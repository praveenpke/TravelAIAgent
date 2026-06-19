/**
 * Build-time RAG ingestion (run offline, by hand, whenever the KB changes):
 *   read knowledge/destinations.md → chunk → embed (fastembed) → upsert into LibSQLVector.
 *
 * Run with:  pnpm ingest
 * (loads .env via node --env-file so DATABASE_URL points at the same DB the app uses.)
 */
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { MDocument } from '@mastra/rag'
import { vector } from '../src/mastra/storage'
import { embedder, EMBEDDING_DIMENSION } from '../src/mastra/embedder'
import { DESTINATIONS_INDEX } from '../src/mastra/rag/destinations-index'

async function main() {
  // 1. Load the source document.
  const raw = await readFile(join(process.cwd(), 'knowledge', 'destinations.md'), 'utf8')

  // 2. Chunk it — recursive splitting respects the markdown structure.
  const doc = MDocument.fromMarkdown(raw)
  const chunks = await doc.chunk({ strategy: 'recursive', maxSize: 512, overlap: 50 })
  console.log(`Created ${chunks.length} chunks`)

  // 3. Embed with the SAME embedder used at query time (fastembed → 384 dims).
  const { embeddings } = await embedder.doEmbed({ values: chunks.map(c => c.text) })

  // 4. Create the index (idempotent) — dimension MUST match the embedder.
  await vector
    .createIndex({ indexName: DESTINATIONS_INDEX, dimension: EMBEDDING_DIMENSION })
    .catch(() => {})

  // 5. Upsert vectors + metadata. `text` in metadata is what the agent reads back.
  await vector.upsert({
    indexName: DESTINATIONS_INDEX,
    vectors: embeddings,
    metadata: chunks.map(c => ({ text: c.text, source: 'destinations.md' })),
  })

  console.log(`Upserted ${embeddings.length} vectors into "${DESTINATIONS_INDEX}"`)
}

main()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
