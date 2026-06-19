import { createTool } from '@mastra/core/tools'
import { z } from 'zod'

export const weatherTool = createTool({
  id: 'get-weather',
  description:
    'Get the current weather for a city. Use this to advise on packing and to flag weather that affects activities.',
  inputSchema: z.object({
    location: z.string().describe('City name, e.g. "Kyoto"'),
  }),
  outputSchema: z.object({
    location: z.string(),
    temperatureC: z.number(),
    windSpeedKmh: z.number(),
    conditions: z.string(),
  }),
  execute: async inputData => {
    const { location } = inputData

    // Geocode the city (free, no key required).
    const geo = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1`,
    ).then(r => r.json())

    const place = geo.results?.[0]
    if (!place) {
      throw new Error(`Location '${location}' not found`)
    }

    // Current weather (free, no key required).
    const weather = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,wind_speed_10m,weather_code`,
    ).then(r => r.json())

    return {
      location: place.name,
      temperatureC: weather.current.temperature_2m,
      windSpeedKmh: weather.current.wind_speed_10m,
      conditions: describeWeatherCode(weather.current.weather_code),
    }
  },
})

function describeWeatherCode(code: number): string {
  const map: Record<number, string> = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    51: 'Light drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    71: 'Slight snow',
    80: 'Rain showers',
    95: 'Thunderstorm',
  }
  return map[code] ?? 'Unknown'
}
