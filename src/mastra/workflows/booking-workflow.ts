import { createWorkflow, createStep } from '@mastra/core/workflows'
import { Agent } from '@mastra/core/agent'
import { z } from 'zod'
import { itinerarySchema, bookingResultSchema } from '../schemas/itinerary'

// Trips above this total need an explicit human "yes" before booking.
const APPROVAL_THRESHOLD = 1500

// A dedicated, tool-free agent whose only job is to convert the concierge's
// free-text plan into the itinerary schema. Keeping it separate from the
// tool-heavy concierge makes structured output reliable (the concierge's tool
// calls + reasoning tokens otherwise break JSON extraction).
const itineraryStructurer = new Agent({
  id: 'itinerary-structurer',
  name: 'Itinerary Structurer',
  instructions:
    'You convert a free-text trip plan into a single itinerary JSON object that matches the ' +
    'requested schema exactly. Use the concrete numbers (prices, nights, dates, carriers) from ' +
    'the plan; if a value is genuinely missing, estimate reasonably. ALL prices are per-item ' +
    'totals in US dollars — flight.price is the per-ticket fare (typically 150–6000), ' +
    'hotel.pricePerNight is one night (typically 50–600), activity.price is per activity ' +
    '(typically 10–500). Never output prices in another currency or multiply into huge numbers. ' +
    'Respond with ONLY the JSON.',
  model: 'minimax/MiniMax-M2',
})

// What the caller hands the workflow: a free-text brief + traveler/thread keys.
const bookingInputSchema = z.object({
  brief: z.string().describe('Free-text trip brief from the traveler'),
  resourceId: z.string().describe('Traveler id, for memory'),
  threadId: z.string().describe('Conversation thread id'),
})

// Shared shape passed between steps once we have a priced itinerary.
const pricedSchema = z.object({
  itinerary: itinerarySchema,
  total: z.number(),
  currency: z.string(),
})

/**
 * Step 1 — buildItinerary
 * Ask the concierge agent to turn the brief into a typed Itinerary.
 * The agent PROPOSES; the workflow will COMMIT.
 */
const buildItinerary = createStep({
  id: 'build-itinerary',
  description: 'Use the concierge agent to assemble a structured itinerary',
  inputSchema: bookingInputSchema,
  outputSchema: z.object({ itinerary: itinerarySchema }),
  execute: async ({ inputData, mastra }) => {
    const concierge = mastra.getAgent('conciergeAgent')

    // 1. The concierge proposes a plan using its real tools (flights/hotels/etc.)
    //    and the traveler's remembered preferences.
    const plan = await concierge.generate(inputData.brief, {
      memory: { resource: inputData.resourceId, thread: inputData.threadId },
    })

    // 2. A dedicated tool-free agent turns that plan into the typed Itinerary.
    //    jsonPromptInjection coerces structured output by prompt + JSON parsing
    //    (the MiniMax model has no native response-format schema support).
    const structured = await itineraryStructurer.generate(
      `Convert this trip plan into the itinerary JSON object.\n\nTRIP PLAN:\n${plan.text}`,
      { structuredOutput: { schema: itinerarySchema, jsonPromptInjection: true } },
    )

    if (!structured.object) {
      throw new Error('Could not produce a structured itinerary from the concierge plan')
    }

    return { itinerary: structured.object }
  },
})

/**
 * Step 2 — priceItinerary
 * Deterministic math. No model. Sum every component into a single total.
 */
const priceItinerary = createStep({
  id: 'price-itinerary',
  description: 'Sum flights, hotels and activities into a single total',
  inputSchema: z.object({ itinerary: itinerarySchema }),
  outputSchema: pricedSchema,
  execute: async ({ inputData }) => {
    const { itinerary } = inputData

    const flightsTotal = itinerary.flights.reduce((sum, f) => sum + f.price, 0)
    const hotelsTotal = itinerary.hotels.reduce((sum, h) => sum + h.pricePerNight * h.nights, 0)
    const activitiesTotal = itinerary.activities.reduce((sum, a) => sum + a.price, 0)

    const total = Number((flightsTotal + hotelsTotal + activitiesTotal).toFixed(2))

    return { itinerary, total, currency: 'USD' }
  },
})

/**
 * Step 3 — approveIfOverBudget  ← the human-in-the-loop gate
 * Under the threshold: sails through. Over it: SUSPEND with a payload explaining
 * what's needed, then wait for resume({ approved }) before continuing.
 */
const approveIfOverBudget = createStep({
  id: 'approve-if-over-budget',
  description: 'Pause for human approval when the trip exceeds the budget gate',
  inputSchema: pricedSchema,
  outputSchema: pricedSchema.extend({ approved: z.boolean() }),
  // What we tell the human while paused.
  suspendSchema: z.object({
    reason: z.string(),
    total: z.number(),
    currency: z.string(),
    destination: z.string(),
  }),
  // What the human sends back to resume.
  resumeSchema: z.object({
    approved: z.boolean(),
  }),
  execute: async ({ inputData, resumeData, suspend }) => {
    const { itinerary, total, currency } = inputData

    // Cheap trip: auto-approve, no human needed.
    if (total <= APPROVAL_THRESHOLD) {
      return { itinerary, total, currency, approved: true }
    }

    // Expensive trip and we don't yet have a decision → pause.
    if (resumeData?.approved === undefined) {
      return await suspend({
        reason: `This itinerary is ${currency} ${total}, above the ${currency} ${APPROVAL_THRESHOLD} approval limit. Confirm to book.`,
        total,
        currency,
        destination: itinerary.destination,
      })
    }

    // We have a human decision — carry it forward.
    return { itinerary, total, currency, approved: resumeData.approved }
  },
})

/**
 * Step 4 — book
 * The only irreversible action. Runs ONLY after approval is settled.
 * (Swap for a real booking/payment provider when going live.)
 */
const book = createStep({
  id: 'book',
  description: 'Commit the booking (or record the rejection)',
  inputSchema: pricedSchema.extend({ approved: z.boolean() }),
  outputSchema: bookingResultSchema,
  execute: async ({ inputData }) => {
    const { total, currency, approved, itinerary } = inputData

    if (!approved) {
      return {
        status: 'rejected' as const,
        total,
        currency,
        message: `Booking for ${itinerary.destination} was not approved.`,
      }
    }

    const confirmationId = `TRV-${Date.now().toString(36).toUpperCase()}`

    return {
      status: 'booked' as const,
      total,
      currency,
      confirmationId,
      message: `Booked ${itinerary.destination} for ${currency} ${total}. Confirmation ${confirmationId}.`,
    }
  },
})

export const bookingWorkflow = createWorkflow({
  id: 'bookingWorkflow',
  description: 'Deterministic trip booking with a human-approval gate over budget',
  inputSchema: bookingInputSchema,
  outputSchema: bookingResultSchema,
})
  .then(buildItinerary)
  .then(priceItinerary)
  .then(approveIfOverBudget)
  .then(book)
  .commit()

// Export the gate step so callers get full type-safety on resume().
export { approveIfOverBudget }
