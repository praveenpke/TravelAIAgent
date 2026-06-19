import { createTool } from '@mastra/core/tools'
import { z } from 'zod'

// Wikimedia asks API clients to send a descriptive User-Agent.
const UA = 'TravelAIAgent/0.1 (https://github.com/praveenpke/TravelAIAgent)'

export const activitySearchTool = createTool({
  id: 'activity-search',
  description:
    'Find real notable attractions and points of interest in or near a city (museums, landmarks, ' +
    'parks, sights) to suggest as activities. Returns each with a short description and a reference link.',
  inputSchema: z.object({
    city: z.string().describe('City name, e.g. "Kyoto"'),
    interests: z
      .string()
      .optional()
      .describe('Optional traveler interests to theme suggestions around, e.g. "food, trains, history"'),
    limit: z.number().int().min(1).max(20).default(10).describe('Max number of suggestions'),
  }),
  outputSchema: z.object({
    activities: z.array(
      z.object({
        title: z.string(),
        description: z.string(),
        url: z.string(),
      }),
    ),
  }),
  execute: async inputData => {
    const { city, limit = 10 } = inputData

    // 1. Geocode the city (Open-Meteo, free, no key).
    const geo = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`,
    ).then(r => r.json())
    const place = geo.results?.[0]
    if (!place) {
      throw new Error(`City '${city}' not found`)
    }

    // 2. Find notable nearby pages (Wikipedia GeoSearch, free, no key).
    const geosearch = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=geosearch` +
        `&gscoord=${place.latitude}%7C${place.longitude}&gsradius=10000&gslimit=${limit}&format=json&origin=*`,
      { headers: { 'User-Agent': UA } },
    ).then(r => r.json())

    const hits: { pageid: number; title: string }[] = geosearch.query?.geosearch ?? []
    if (hits.length === 0) {
      return { activities: [] }
    }

    // 3. Fetch a one/two-sentence description + canonical URL for each.
    const ids = hits.map(h => h.pageid).join('|')
    const detail = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&prop=extracts|info&inprop=url` +
        `&exintro&explaintext&exsentences=2&pageids=${ids}&format=json&origin=*`,
      { headers: { 'User-Agent': UA } },
    ).then(r => r.json())

    const pages = detail.query?.pages ?? {}
    const activities = hits.map(h => {
      const p = pages[h.pageid] ?? {}
      return {
        title: h.title,
        description: (p.extract ?? '').trim() || `A notable point of interest in ${place.name}.`,
        url: p.fullurl ?? `https://en.wikipedia.org/?curid=${h.pageid}`,
      }
    })

    return { activities }
  },
})
