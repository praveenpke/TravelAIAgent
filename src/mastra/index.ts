import { Mastra } from '@mastra/core'
import { PinoLogger } from '@mastra/loggers'
import { conciergeAgent } from './agents/concierge-agent'
import { storage, vector } from './storage'

export const mastra = new Mastra({
  agents: { conciergeAgent },
  storage, // shared LibSQLStore — powers Studio's memory inspector + later phases
  vectors: { libsql: vector }, // RAG: retrieval tool resolves this store by name
  logger: new PinoLogger({
    name: 'Travel Agent',
    level: 'info',
  }),
})
