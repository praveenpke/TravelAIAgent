import { createTool } from '@mastra/core/tools'
import { z } from 'zod'
import { searchHotels } from '../providers'

export const hotelSearchTool = createTool({
  id: 'hotel-search',
  description:
    'Search real hotels in a city within a nightly budget band, with live rates. Returns candidate hotels with nightly price (USD), star rating, and neighborhood.',
  inputSchema: z.object({
    city: z.string().describe('City name, e.g. "Kyoto"'),
    countryCode: z
      .string()
      .length(2)
      .describe('ISO 3166-1 alpha-2 country code of the city, e.g. "JP" for Kyoto, "FR" for Paris'),
    checkIn: z.string().describe('Check-in date, ISO format e.g. "2026-04-10"'),
    nights: z.number().int().min(1).describe('Number of nights'),
    adults: z.number().int().min(1).default(1).describe('Number of adult guests'),
    guestNationality: z
      .string()
      .length(2)
      .default('US')
      .describe("Guest's nationality as an ISO alpha-2 code (affects rates/taxes), e.g. \"IN\""),
    budgetBand: z
      .enum(['budget', 'mid', 'luxury'])
      .default('mid')
      .describe('Nightly budget band the traveler prefers'),
  }),
  outputSchema: z.object({
    hotels: z.array(
      z.object({
        name: z.string(),
        neighborhood: z.string(),
        rating: z.number(),
        nightlyUsd: z.number(),
        totalUsd: z.number(),
        bookingUrl: z.string().optional().describe('Deep link to book this hotel'),
      }),
    ),
  }),
  execute: async inputData => {
    const { city, countryCode, checkIn, nights, adults = 1, guestNationality = 'US', budgetBand = 'mid' } =
      inputData

    const hotels = await searchHotels({
      city,
      countryCode,
      checkIn,
      nights,
      adults,
      guestNationality,
      budgetBand,
    })

    return { hotels }
  },
})
