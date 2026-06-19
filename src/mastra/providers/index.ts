/**
 * Provider abstraction. Tools import flight/hotel search from here, never from a
 * specific provider — so swapping a data source (or mixing providers) is a change
 * confined to this file, with no edits to tools or the agent.
 *
 * Current mix:
 *   flights → SerpApi (Google Flights)  — real Google Flights results, instant + reliable
 *   hotels  → LiteAPI                   — real search + live rates (3M+ properties)
 */
export { searchFlights } from './serpapi'
export type { FlightOffer } from './serpapi'

export { searchHotels } from './liteapi'
export type { HotelOffer } from './liteapi'
