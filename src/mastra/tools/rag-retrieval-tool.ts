import { createVectorQueryTool } from '@mastra/rag'
import { embedder } from '../embedder'
import { DESTINATIONS_INDEX } from '../rag/destinations-index'

// Request-time retrieval: embeds the query with the SAME embedder, searches the
// index, and returns { relevantContext, sources } for the model to ground on.
export const ragRetrievalTool = createVectorQueryTool({
  id: 'search-destination-knowledge',
  description:
    'Search the destination knowledge base for visa, entry, safety, and best-time-to-visit ' +
    'information. ALWAYS use this before answering visa, entry, or safety questions — never ' +
    'answer those from prior knowledge.',
  vectorStoreName: 'libsql', // matches the `vectors` key on the Mastra instance
  indexName: DESTINATIONS_INDEX,
  model: embedder,
})
