/**
 * LiteAPI provider — real hotel search + live rates (3M+ properties).
 *
 * Flow:
 *   1. GET  /v3.0/data/hotels?countryCode&cityName   → hotel ids + details (name, stars, address)
 *   2. POST /v3.0/hotels/rates  { hotelIds, checkin, checkout, ... } → live prices for the stay
 *   merge by hotelId.
 *
 * Credentials (set in .env):
 *   LITE_API_KEY  — sandbox key starts with "sand_", production key with "prod_"
 *
 * Get a free instant key at https://liteapi.travel
 */

const BASE = 'https://api.liteapi.travel/v3.0'

class LiteApiConfigError extends Error {
  constructor() {
    super(
      'LiteAPI is not configured. Set LITE_API_KEY in .env ' +
        '(free instant key at https://liteapi.travel — sandbox keys start with "sand_").',
    )
    this.name = 'LiteApiConfigError'
  }
}

function apiKey(): string {
  const k = process.env.LITE_API_KEY
  if (!k) throw new LiteApiConfigError()
  return k
}

async function liteFetch<T = any>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      'X-API-Key': apiKey(),
      Accept: 'application/json',
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...(init?.headers ?? {}),
    },
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`LiteAPI error (${res.status}): ${text || res.statusText}`.trim())
  }
  return (await res.json()) as T
}

export interface HotelOffer {
  name: string
  neighborhood: string
  rating: number
  nightlyUsd: number
  totalUsd: number
  bookingUrl?: string
}

/** Pull the lowest stay total (USD) out of a LiteAPI rates entry, tolerating shape variations. */
function lowestTotal(entry: any): number | null {
  let min: number | null = null
  for (const rt of entry?.roomTypes ?? []) {
    for (const rate of rt?.rates ?? []) {
      // retailRate.total is usually [{ amount, currency }]; tolerate object/number too.
      const total = rate?.retailRate?.total
      const amount = Array.isArray(total)
        ? total[0]?.amount
        : typeof total === 'object'
          ? total?.amount
          : total
      const n = Number(amount)
      if (Number.isFinite(n) && (min === null || n < min)) min = n
    }
    // some responses expose a flattened offerRetailRate per room type
    const flat = Number(rt?.offerRetailRate?.amount)
    if (Number.isFinite(flat) && (min === null || flat < min)) min = flat
  }
  return min
}

export async function searchHotels(args: {
  city: string
  countryCode: string
  checkIn: string
  nights: number
  budgetBand: 'budget' | 'mid' | 'luxury'
  adults?: number
  guestNationality?: string
  limit?: number
}): Promise<HotelOffer[]> {
  const checkOut = addNights(args.checkIn, args.nights)
  const limit = args.limit ?? 25

  // Step 1: hotels (ids + details) for the city.
  const hotelsQuery = new URLSearchParams({
    countryCode: args.countryCode.toUpperCase(),
    cityName: args.city,
    limit: String(limit),
  })
  const list = await liteFetch<{ data?: any[] }>(`/data/hotels?${hotelsQuery.toString()}`)
  const hotels = list.data ?? []
  if (hotels.length === 0) return []

  const details = new Map<string, any>(hotels.map(h => [String(h.id), h]))
  const hotelIds = hotels.map(h => String(h.id))

  // Step 2: live rates for those hotels.
  const rates = await liteFetch<{ data?: any[] }>('/hotels/rates', {
    method: 'POST',
    body: JSON.stringify({
      hotelIds,
      checkin: args.checkIn,
      checkout: checkOut,
      currency: 'USD',
      guestNationality: (args.guestNationality ?? 'US').toUpperCase(),
      occupancies: [{ adults: args.adults ?? 1 }],
    }),
  })

  const bands: Record<'budget' | 'mid' | 'luxury', (nightly: number) => boolean> = {
    budget: n => n <= 120,
    mid: n => n > 120 && n <= 300,
    luxury: n => n > 300,
  }

  const offers: HotelOffer[] = []
  for (const entry of rates.data ?? []) {
    const totalUsdRaw = lowestTotal(entry)
    if (totalUsdRaw === null) continue
    const d = details.get(String(entry.hotelId)) ?? {}
    const totalUsd = Math.round(totalUsdRaw * 100) / 100
    offers.push({
      name: d.name ?? 'Unknown hotel',
      neighborhood: d.address ?? d.city ?? args.city,
      rating: Number(d.stars ?? d.starRating ?? 0),
      nightlyUsd: Math.round((totalUsd / Math.max(args.nights, 1)) * 100) / 100,
      totalUsd,
    })
  }

  // Prefer the requested band, but never return [] just because the band was tight.
  const inBand = offers.filter(h => bands[args.budgetBand](h.nightlyUsd))
  return (inBand.length ? inBand : offers).sort((a, b) => a.nightlyUsd - b.nightlyUsd)
}

/** Add N nights to an ISO date (YYYY-MM-DD) → checkout date. */
function addNights(checkIn: string, nights: number): string {
  const d = new Date(`${checkIn}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + nights)
  return d.toISOString().slice(0, 10)
}
