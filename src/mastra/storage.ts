import { LibSQLStore, LibSQLVector } from '@mastra/libsql'

// A single SQLite/libSQL database holds message history, working memory,
// vector embeddings, and (in later phases) workflow snapshots and traces.
// Override with DATABASE_URL in production (an absolute file: path, or a
// remote libSQL/Turso URL); defaults to a local file for dev.
const url = process.env.DATABASE_URL ?? 'file:./travel-agent.db'

export const storage = new LibSQLStore({
  id: 'travel-agent-storage',
  url,
})

export const vector = new LibSQLVector({
  id: 'travel-agent-vector',
  url,
})
