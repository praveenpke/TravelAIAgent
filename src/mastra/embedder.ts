import { fastembed } from '@mastra/fastembed'

// Local, key-free embedding model (bge-small-en-v1.5, 384-dim).
// The model is downloaded automatically on first use.
//
// Alternative (API key required):
//   import { ModelRouterEmbeddingModel } from '@mastra/core/llm'
//   export const embedder = new ModelRouterEmbeddingModel('openai/text-embedding-3-small') // 1536 dims
export const embedder = fastembed

// fastembed's bge-small-en-v1.5 output dimension. Used to create the RAG vector index.
// (Switch embedders → update this AND recreate the index, or writes will be rejected.)
export const EMBEDDING_DIMENSION = 384
