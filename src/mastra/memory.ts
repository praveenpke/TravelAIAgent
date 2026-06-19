import { Memory } from '@mastra/memory'
import { storage, vector } from './storage'
import { embedder } from './embedder'
import { travelerProfileSchema } from './schemas/traveler-profile'

// Memory is self-contained: it gets its own storage, vector, and embedder
// (independent of what's registered on the top-level Mastra instance).
export const conciergeMemory = new Memory({
  storage,
  vector,
  embedder,
  options: {
    // 1. Message history: keep the last 20 turns in the context window.
    lastMessages: 20,

    // 2. Semantic recall: pull in older, relevant messages by meaning.
    semanticRecall: {
      topK: 3, // retrieve the 3 most relevant past messages
      messageRange: 2, // include 2 messages of context around each match
      scope: 'resource', // search across all of this traveler's threads
    },

    // 3. Working memory: a persistent, structured traveler profile.
    workingMemory: {
      enabled: true,
      scope: 'resource', // profile follows the traveler across every conversation
      schema: travelerProfileSchema,
    },
  },
})
