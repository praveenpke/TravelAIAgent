import { createTool } from '@mastra/core/tools'
import { z } from 'zod'
import { searchFlights } from '../providers'

export const flightSearchTool = createTool({
  id: 'flight-search',
  description:
    'Search real available flights between two airports for a given date. Returns candidate flights with price (USD), airline, flight number, duration, and a booking link.',
  inputSchema: z.object({
    origin: z.string().describe('Origin IATA airport code, e.g. "DEL"'),
    destination: z.string().describe('Destination IATA airport code, e.g. "NRT"'),
    departDate: z.string().describe('Departure date in ISO format, e.g. "2026-04-10"'),
    passengers: z.number().int().min(1).default(1).describe('Number of travelers'),
  }),
  outputSchema: z.object({
    flights: z.array(
      z.object({
        airline: z.string(),
        flightNumber: z.string(),
        origin: z.string(),
        destination: z.string(),
        departDate: z.string(),
        durationHours: z.number(),
        priceUsd: z.number(),
        bookingUrl: z.string().optional().describe('Affiliate deep link to book this flight'),
      }),
    ),
  }),
  execute: async inputData => {
    const { origin, destination, departDate, passengers = 1 } = inputData

    const flights = await searchFlights({ origin, destination, departDate, passengers })

    return { flights }
  },
})
