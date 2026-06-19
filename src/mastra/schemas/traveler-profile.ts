import { z } from 'zod'

// The persistent traveler profile the agent maintains across all sessions
// (working memory). Schema-based working memory uses merge semantics — the
// agent only sends the fields it wants to change; the rest are preserved.
export const travelerProfileSchema = z.object({
  homeAirport: z.string().optional(), // e.g. "BLR (Bangalore)"
  dietaryNeeds: z.string().optional(), // e.g. "vegetarian, no shellfish"
  budgetStyle: z.enum(['budget', 'mid', 'luxury']).optional(),
  // Free-text rather than an enum: models sometimes send "" for unknown fields,
  // which an enum would reject and spam validation errors.
  seatPreference: z.string().optional(), // e.g. "aisle", "window"
  passportCountry: z.string().optional(), // used later for visa/RAG questions
})

export type TravelerProfile = z.infer<typeof travelerProfileSchema>
