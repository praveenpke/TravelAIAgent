import { Agent } from '@mastra/core/agent'
import { hotelSearchTool } from '../tools/hotel-search-tool'
import { currencyTool } from '../tools/currency-tool'

export const hotelsAgent = new Agent({
  id: 'hotels-agent',
  name: 'Hotels Agent',
  description:
    'Finds lodging options for a destination and date range within a budget band. Returns 2-3 hotels ' +
    'with name, nightly price, rating, and a one-line reason it fits the trip.',
  instructions: `You are a lodging specialist for the Travel AI Agent concierge.
    - Use hotelSearchTool to find stays for the destination, dates, and budget band (it needs the city's ISO country code).
    - Use currencyTool to convert nightly prices when the traveler asks.
    - Return 2-3 options with name, nightly price, rating, and why each fits (location, budget).
    - Do not fabricate hotels or prices.`,
  model: 'minimax/MiniMax-M2',
  tools: { hotelSearchTool, currencyTool },
})
