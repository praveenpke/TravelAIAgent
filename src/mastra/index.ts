import { Mastra } from '@mastra/core'
import { PinoLogger } from '@mastra/loggers'
import { conciergeAgent } from './agents/concierge-agent'

export const mastra = new Mastra({
  agents: { conciergeAgent },
  logger: new PinoLogger({
    name: 'Travel Agent',
    level: 'info',
  }),
})
