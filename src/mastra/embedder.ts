import { fastembed } from '@mastra/fastembed'

// Local, key-free embedding model (bge-small-en-v1.5, 384-dim).
// The model is downloaded automatically on first use.
//
// Alternative (API key required):
//   import { ModelRouterEmbeddingModel } from '@mastra/core/llm'
//   export const embedder = new ModelRouterEmbeddingModel('openai/text-embedding-3-small')
export const embedder = fastembed
