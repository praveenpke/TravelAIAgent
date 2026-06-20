import { Mastra } from '@mastra/core'
import { PinoLogger } from '@mastra/loggers'
import { conciergeAgent } from './agents/concierge-agent'
import { flightsAgent } from './agents/flights-agent'
import { hotelsAgent } from './agents/hotels-agent'
import { activitiesAgent } from './agents/activities-agent'
import { storage, vector } from './storage'

export const mastra = new Mastra({
  // Supervisor + specialists. Subagents must be registered so Studio shows them
  // and delegation resolves them by id.
  agents: { conciergeAgent, flightsAgent, hotelsAgent, activitiesAgent },
  storage, // shared LibSQLStore — memory + workflow/agent persistence
  vectors: { libsql: vector }, // RAG: retrieval tool resolves this store by name
  logger: new PinoLogger({
    name: 'Travel Agent',
    level: 'info',
  }),
})
