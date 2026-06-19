# CLAUDE.md

Guidance for Claude Code (and other AI agents) working in this repository.

## What this is

**Travel AI Agent** (`travel-ai-agent`) is a **production** multi-agent AI travel concierge built on [Mastra](https://mastra.ai). It is built incrementally following the 10-phase plan in [`SPEC.md`](./SPEC.md). Phases 1–6 are complete (agent + real-provider tools + storage/memory + RAG + booking workflow + multi-agent network); Phase 7 (processors, structured output & streaming) is next.

**This is not the tutorial demo.** Even though the structure mirrors `SPEC.md`, every tool calls a real API — there are no mock/placeholder implementations. Keep it that way.

## Commands

> On this machine `pnpm` is only on PATH in **bash**, not PowerShell. Run all `pnpm`/CLI commands through bash.

```bash
pnpm install            # install deps
pnpm ingest             # build-time RAG: chunk + embed knowledge/ → vector index
pnpm dev                # Mastra dev server + Studio at http://localhost:4111
pnpm build              # production build
pnpm booking-demo       # drive the booking workflow's suspend/resume loop
pnpm plan-trip          # watch the supervisor delegate to specialists
pnpm exec tsc --noEmit  # typecheck (run this before committing)
```

> **RAG DB sharing:** `pnpm ingest` (CWD = project root) and `pnpm dev` (bundled, different CWD) must point at the **same** DB. Set `DATABASE_URL` to an absolute `file:` path in `.env`, or the ingested vectors won't be visible to the running agent. Re-run `pnpm ingest` after editing `knowledge/destinations.md`.

Test a tool end-to-end without the LLM (the dev server must be running):

```bash
curl -s -X POST http://localhost:4111/api/tools/<tool-id>/execute \
  -H "Content-Type: application/json" \
  -d '{"data":{ ...tool input... }}'
# tool ids: flight-search, hotel-search, get-weather, convert-currency
```

## Architecture

- **`src/mastra/index.ts`** — the `Mastra` instance. Anything not registered here (agents, later storage/workflows) won't appear in Studio.
- **`src/mastra/agents/`** — a **supervisor + specialists** network (Phase 6). `conciergeAgent` is the supervisor: it holds `agents: { flightsAgent, hotelsAgent, activitiesAgent }` (delegation), keeps only `ragRetrievalTool` directly, plus memory. Specialists each have a `description` (the supervisor reads it to route), a tight prompt, and only their tools — flights: `flightSearchTool`+`currencyTool`; hotels: `hotelSearchTool`+`currencyTool`; activities: `activitySearchTool`+`weatherTool`+`ragRetrievalTool`. All four must be registered on the Mastra instance. Model is `minimax/MiniMax-M2` everywhere.
- **`src/mastra/tools/`** — `createTool` definitions. The Zod `inputSchema` (and its `.describe()` text) is the contract the model reads, so keep descriptions concrete.
- **`src/mastra/providers/`** — data-source clients. **The golden rule:** tools import flight/hotel search only from `providers/index.ts` (the seam). To change a data source, edit that one barrel file — never reach into a provider from a tool. Current mix: flights → `serpapi.ts` (Google Flights), hotels → `liteapi.ts`.
- **RAG (Phase 4):** `knowledge/destinations.md` → `scripts/ingest.ts` (chunk + embed + upsert) → `LibSQLVector` index `destinations`. The agent queries it via `ragRetrievalTool` (`createVectorQueryTool`, resolved by the `vectors: { libsql }` key on the Mastra instance). **Footgun:** ingest and query must use the **same** embedder + dimension. We use `fastembed` (bge-small, 384-dim) on both sides — keep `EMBEDDING_DIMENSION` in `embedder.ts` in sync if you change embedders, and recreate the index.

## Conventions

- **Code style:** TypeScript, 2-space indent, **single quotes, no semicolons**, arrow functions. Match the surrounding files.
- **Tool I/O:** keep outputs conforming to each tool's Zod `outputSchema` so downstream phases (e.g. the booking workflow) stay stable. Adding optional fields is fine; changing existing ones is a breaking change.
- **Errors over fakes:** if a provider key is missing or a call fails, throw a clear, actionable error. Never fall back to fabricated data.
- **Zod `.default()` quirk:** in this Mastra version, a tool's `execute` input is typed as the *pre-default* shape, so fields with `.default()` read as possibly-undefined. Mirror the default in a destructuring default (e.g. `const { passengers = 1 } = inputData`).
- **Structured output with MiniMax:** MiniMax M2 has no native response-format/JSON-schema support, and the tool-heavy concierge (tools + memory + RAG + reasoning tokens) breaks JSON extraction. For structured output, use `structuredOutput: { schema, jsonPromptInjection: true }` **and** a dedicated tool-free agent for the structuring pass (see `itineraryStructurer` in `workflows/booking-workflow.ts`). Don't ask the tool-heavy agent for structured output directly.

## Workflows

- **`src/mastra/workflows/booking-workflow.ts`** — `build → price → approve(suspend) → book`. Only `approve-if-over-budget` suspends; on resume it re-runs `execute` with `resumeData`. Each step's `outputSchema` must equal the next step's `inputSchema`. Snapshots persist to the same LibSQL DB (so a suspended run survives a restart). Registered under `workflows: { bookingWorkflow }` on the Mastra instance. Money/irreversible actions belong in a workflow step, never in an agent turn.

## Environment & secrets

- Required env vars (see `.env.example`): `MINIMAX_API_KEY` (model), `SERPAPI_KEY` (flights), `LITE_API_KEY` (hotels). Weather/currency are key-free.
- **`.env` is gitignored — never commit secrets.** Before any commit/push, confirm `.env` is not staged.

## Provider notes (hard-won)

- **Flights → SerpApi (Google Flights).** Reliable real data, instant free key. One-way = `type=2`, `currency=USD`.
- **Hotels → LiteAPI.** Two calls: `GET /v3.0/data/hotels` (ids + details) then `POST /v3.0/hotels/rates`. Star rating is `stars` (not `starRating`; `rating` is the /10 review score). Price at `roomTypes[].rates[].retailRate.total[0].amount`. The hotel tool needs a `countryCode` (the model supplies it).
- **Rejected:** Amadeus (heavy production onboarding); Travelpayouts (flight prices are a 48h cache, empty for most dates; real-time flight search is gated behind partner approval → 403; Hotellook hotel API retired).

## When working here

- Read [`SPEC.md`](./SPEC.md) for the phase you're implementing before starting — it has the grounded Mastra APIs and exact module mapping.
- Run `pnpm exec tsc --noEmit` before committing; keep the build green.
- Don't downgrade real integrations to mocks "to make tests pass."
