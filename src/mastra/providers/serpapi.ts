/**
 * SerpApi (Google Flights) provider — real-time FLIGHT search.
 *
 * Returns Google Flights results (real airlines, prices, times) via a single
 * GET. Reliable, instant key, free tier (250 searches/mo). It's display +
 * booking-redirect data (not bookable inventory), which fits a concierge that
 * recommends and hands off to book.
 *
 *   GET https://serpapi.com/search.json?engine=google_flights&departure_id=SFO
 *       &arrival_id=DEN&outbound_date=2026-07-13&type=2&currency=USD&api_key=...
 *
 * Credentials (set in .env):
 *   SERPAPI_KEY — your SerpApi key (https://serpapi.com → API key; free tier, no card)
 */

const SEARCH = 'https://serpapi.com/search.json'

function apiKey(): string {
  const k = process.env.SERPAPI_KEY
  if (!k) {
    throw new Error(
      'SerpApi is not configured. Set SERPAPI_KEY in .env ' +
        '(free key at https://serpapi.com — 250 searches/mo, no card).',
    )
  }
  return k
}

export interface FlightOffer {
  airline: string
  flightNumber: string
  origin: string
  destination: string
  departDate: string
  durationHours: number
  priceUsd: number
  bookingUrl?: string
}

function googleFlightsUrl(origin: string, destination: string, date: string): string {
  const q = `flights from ${origin} to ${destination} on ${date}`
  return `https://www.google.com/travel/flights?q=${encodeURIComponent(q)}`
}

export async function searchFlights(args: {
  origin: string
  destination: string
  departDate: string
  passengers: number
  limit?: number
}): Promise<FlightOffer[]> {
  const origin = args.origin.toUpperCase()
  const destination = args.destination.toUpperCase()

  const params = new URLSearchParams({
    engine: 'google_flights',
    departure_id: origin,
    arrival_id: destination,
    outbound_date: args.departDate,
    type: '2', // one-way
    currency: 'USD',
    hl: 'en',
    adults: String(args.passengers),
    api_key: apiKey(),
  })

  const res = await fetch(`${SEARCH}?${params.toString()}`)
  const data = (await res.json().catch(() => null)) as any
  if (!res.ok || !data) {
    throw new Error(`SerpApi request failed (${res.status})`)
  }
  if (data.error) {
    throw new Error(`SerpApi error: ${data.error}`)
  }

  const groups: any[] = [...(data.best_flights ?? []), ...(data.other_flights ?? [])]

  const offers: FlightOffer[] = groups
    .map(group => {
      const legs = group.flights ?? []
      const first = legs[0]
      const last = legs[legs.length - 1]
      if (!first || !last) return null
      return {
        airline: first.airline ?? '',
        flightNumber: String(first.flight_number ?? '').replace(/\s+/g, ''),
        origin: first.departure_airport?.id ?? origin,
        destination: last.arrival_airport?.id ?? destination,
        departDate: String(first.departure_airport?.time ?? `${args.departDate} `).slice(0, 10),
        durationHours: Math.round(((group.total_duration ?? 0) / 60) * 10) / 10,
        priceUsd: Math.round(Number(group.price ?? 0) * 100) / 100,
        bookingUrl: googleFlightsUrl(origin, destination, args.departDate),
      } as FlightOffer
    })
    .filter((o): o is FlightOffer => o !== null && o.priceUsd > 0)
    .sort((a, b) => a.priceUsd - b.priceUsd)

  return offers.slice(0, args.limit ?? 10)
}
