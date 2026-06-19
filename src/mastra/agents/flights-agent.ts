import { Agent } from '@mastra/core/agent'
import { flightSearchTool } from '../tools/flight-search-tool'
import { currencyTool } from '../tools/currency-tool'

export const flightsAgent = new Agent({
  id: 'flights-agent',
  name: 'Flights Agent',
  // The supervisor reads this description to decide when to delegate.
  description:
    'Finds and compares flight options for a trip. Given an origin, destination, date, and party size, ' +
    'returns 2-3 candidate flights with airline, price, and duration. Converts prices to the traveler home currency when asked.',
  instructions: `You are a flight specialist for the Travel AI Agent concierge.
    - Use flightSearchTool to find candidate flights for the requested route and date (IATA codes).
    - Use currencyTool to convert prices to the traveler's home currency when relevant.
    - Return a short, scannable list of 2-3 options with airline, price, and total duration.
    - Never invent flights. If no options match, say so plainly.`,
  model: 'minimax/MiniMax-M2',
  tools: { flightSearchTool, currencyTool },
})
