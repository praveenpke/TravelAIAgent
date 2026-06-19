# CLAUDE.md

Guidance for Claude Code (and other AI agents) working in this repository.

## What this is

**Travel AI Agent** (`travel-ai-agent`) is a **production** multi-agent AI travel concierge built on [Mastra](https://mastra.ai). It is built incrementally following the 10-phase plan in [`SPEC.md`](./SPEC.md). Phases 1–2 are complete (agent + real-provider tools); Phase 3 (storage & memory) is next.

**This is not the tutorial demo.** Even though the structure mirrors `SPEC.md`, every tool calls a real API — there are no mock/placeholder implementations. Keep it that way.

## Commands

> On this machine `pnpm` is only on PATH in **bash**, not PowerShell. Run all `pnpm`/CLI commands through bash.

```bash
pnpm install            # install deps
pnpm dev                # Mastra dev server + Studio at http://localhost:4111
pnpm build              # production build
pnpm exec tsc --noEmit  # typecheck (run this before committing)
```

Test a tool end-to-end without the LLM (the dev server must be running):

```bash
curl -s -X POST http://localhost:4111/api/tools/<tool-id>/execute \
  -H "Content-Type: application/json" \
  -d '{"data":{ ...tool input... }}'
# tool ids: flight-search, hotel-search, get-weather, convert-currency
```

## Architecture

- **`src/mastra/index.ts`** — the `Mastra` instance. Anything not registered here (agents, later storage/workflows) won't appear in Studio.
- **`src/mastra/agents/concierge-agent.ts`** — the single `conciergeAgent`. Model is `minimax/MiniMax-M2` via Mastra's model router. Later phases add memory, structured output, sub-agents, etc.
- **`src/mastra/tools/`** — `createTool` definitions. The Zod `inputSchema` (and its `.describe()` text) is the contract the model reads, so keep descriptions concrete.
- **`src/mastra/providers/`** — data-source clients. **The golden rule:** tools import flight/hotel search only from `providers/index.ts` (the seam). To change a data source, edit that one barrel file — never reach into a provider from a tool. Current mix: flights → `serpapi.ts` (Google Flights), hotels → `liteapi.ts`.

## Conventions

- **Code style:** TypeScript, 2-space indent, **single quotes, no semicolons**, arrow functions. Match the surrounding files.
- **Tool I/O:** keep outputs conforming to each tool's Zod `outputSchema` so downstream phases (e.g. the booking workflow) stay stable. Adding optional fields is fine; changing existing ones is a breaking change.
- **Errors over fakes:** if a provider key is missing or a call fails, throw a clear, actionable error. Never fall back to fabricated data.
- **Zod `.default()` quirk:** in this Mastra version, a tool's `execute` input is typed as the *pre-default* shape, so fields with `.default()` read as possibly-undefined. Mirror the default in a destructuring default (e.g. `const { passengers = 1 } = inputData`).

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
