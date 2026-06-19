import { z } from 'zod'

// The typed itinerary the concierge produces (structured output + workflow IO).
export const itinerarySchema = z.object({
  destination: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  travelers: z.number().int().positive(),
  flights: z.array(
    z.object({
      from: z.string(),
      to: z.string(),
      carrier: z.string(),
      price: z.number(),
    }),
  ),
  hotels: z.array(
    z.object({
      name: z.string(),
      nights: z.number().int().positive(),
      pricePerNight: z.number(),
    }),
  ),
  activities: z.array(
    z.object({
      title: z.string(),
      price: z.number(),
    }),
  ),
})

export type Itinerary = z.infer<typeof itinerarySchema>

// The result of a completed booking run.
export const bookingResultSchema = z.object({
  status: z.enum(['booked', 'rejected']),
  total: z.number(),
  currency: z.string(),
  confirmationId: z.string().optional(),
  message: z.string(),
})

export type BookingResult = z.infer<typeof bookingResultSchema>
