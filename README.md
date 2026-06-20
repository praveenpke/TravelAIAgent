# Travel AI Agent

A multi-agent **AI travel concierge** you run in your **terminal**. Describe a trip in plain language — *"5 days in Tokyo in April, 2 adults + a 4-yo, mid-budget, love ramen & trains, from Bangalore"* — and a team of agents researches **real** flights, hotels, and activities, asks what it needs, optimizes for **best experience per dollar** (not just cheapest), respects real-life constraints like kids' pacing, and hands you a clean **itinerary file** (Markdown or HTML) you can book from yourself.

It plans; it doesn't book — you keep control of the money.

```bash
pnpm plan
```

This repo was built incrementally on [Mastra](https://mastra.ai); the original phase-by-phase plan lives in [`SPEC.md`](./SPEC.md). The project has since pivoted to a **plan-only terminal agent** — the spec's human-approval *booking* workflow was intentionally removed to focus on planning quality.

---

## Status

| Phase | Scope | State |
| - | - | - |
| 1 | Scaffold + concierge agent + Studio | ✅ Done |
| 2 | Tools (flights, hotels, weather, currency) — **real providers** | ✅ Done |
| 3 | Storage + memory (history, working memory, semantic recall) | ✅ Done |
| 4 | RAG knowledge base (destinations/visa, with citations) | ✅ Done |
| 5 | ~~Booking workflow~~ | ➖ Removed (pivoted to plan-only) |
| 6 | Multi-agent network (supervisor + specialists) | ✅ Done |
| — | **Terminal planner** (`pnpm plan`) + itinerary file output (md/html) | ✅ Done |
| next | Sharpening the agent: questions, value reasoning, real-data reliability | 🔨 In progress |

Everything you can run today is a real, working agent: no mock data — each tool calls a live API.

---

## How it works

```
trip brief ──▶ Concierge (supervisor) ──┬──▶ Flights Agent     → flight-search (SerpApi) + currency
                  │  delegates + synthesizes├──▶ Hotels Agent      → hotel-search (LiteAPI) + currency
                  │                         └──▶ Activities Agent  → activity-search (Wikipedia) + weather + RAG
                  └──▶ RAG tool (quick visa/entry follow-ups)
```

- **Supervisor** — `conciergeAgent` (`src/mastra/agents/concierge-agent.ts`) reads the brief and **delegates** to specialists via the `agents` map, then synthesizes one coherent itinerary. It keeps direct RAG access for quick visa follow-ups, plus memory.
- **Specialists** — `flightsAgent`, `hotelsAgent`, `activitiesAgent`: each a focused agent with a tight prompt and only the tools it needs.
- **Tools** — typed `createTool` definitions (`src/mastra/tools/`). Each tool's Zod `inputSchema` is the contract the model reads, and its `execute` calls a real provider.
- **Provider seam** — every flight/hotel call goes through `src/mastra/providers/index.ts`. Swapping a data source (SerpApi → Duffel → Amadeus → your own backend) is a one-line change there; tools and agents never change.
- **Terminal CLI** — `src/cli.ts` (`pnpm plan`) is a streaming chat loop; on `/save` it asks the agent for a final plan and writes it to `trips/` as Markdown or HTML (`src/output/save-plan.ts`).

### Why these providers

No single solo-dev-friendly API reliably covers both flights and hotels with instant access, so the seam mixes the best of each:

| Need | Provider | Why |
| - | - | - |
| Flights | **SerpApi** (Google Flights) | Real Google Flights results, instant free key (250/mo), reliable coverage |
| Hotels | **LiteAPI** | Live rates across 3M+ properties, instant free sandbox key |
| Weather | **Open-Meteo** | Real, key-free |
| Currency | **Frankfurter** | Live ECB reference rates, key-free |

Amadeus (heavy production onboarding) and Travelpayouts (flight prices are a 48h cache; real-time search is gated) were evaluated and rejected for a solo-dev production build — see [`SPEC.md`](./SPEC.md) for the full reasoning.

---

## Tech stack

- **TypeScript** · **Node.js ≥ 22.13** · **pnpm**
- **[Mastra](https://mastra.ai)** (`@mastra/core`) — agents, tools, and the Studio dev playground
- **MiniMax** (`minimax/MiniMax-M2`) via Mastra's model router — swap the model string to use any provider
- **Zod** for tool I/O schemas

---

## Project structure

```
travel-ai-agent/
├─ knowledge/destinations.md    # RAG source: visa / safety / best-time facts
├─ scripts/
│  └─ ingest.ts                 # build-time: chunk + embed + upsert the KB
├─ src/
│  ├─ cli.ts                    # the terminal planner (pnpm plan)
│  ├─ output/save-plan.ts       # render the plan → trips/*.md or *.html
│  └─ mastra/
│  ├─ index.ts                  # Mastra instance — agents + storage + vectors
│  ├─ agents/                   # supervisor + specialists
│  │  ├─ concierge-agent.ts     #   supervisor (delegates + synthesizes, + memory + RAG)
│  │  ├─ flights-agent.ts       #   flights specialist
│  │  ├─ hotels-agent.ts        #   hotels specialist
│  │  └─ activities-agent.ts    #   activities specialist
│  ├─ storage.ts                # LibSQL store + vector singletons
│  ├─ memory.ts                 # history + working memory + semantic recall
│  ├─ embedder.ts               # fastembed (local, key-free, 384-dim)
│  ├─ rag/destinations-index.ts # shared KB index name
│  ├─ schemas/                  # zod schemas (traveler profile, itinerary)
│  ├─ tools/                    # flight / hotel / weather / currency / activity / RAG tools
│  └─ providers/                # swappable data-source clients
│     ├─ index.ts               #   ← the seam: swap providers here
│     ├─ serpapi.ts             #   flights (Google Flights)
│     └─ liteapi.ts             #   hotels (live rates)
├─ SPEC.md                      # full 10-phase build plan / design spec
├─ CLAUDE.md                    # guidance for Claude Code contributors
└─ .env.example                 # required environment variables
```

---

## Getting started

### 1. Prerequisites
- Node.js **≥ 22.13.0** and **pnpm**
- API keys (all have free, no-card tiers):
  - **MiniMax** — model ([platform.minimax.io](https://platform.minimax.io))
  - **SerpApi** — flights ([serpapi.com](https://serpapi.com))
  - **LiteAPI** — hotels ([liteapi.travel](https://liteapi.travel))

### 2. Install
```bash
pnpm install
```

### 3. Configure environment
```bash
cp .env.example .env
# then fill in the keys
```

| Variable | Used for | Required |
| - | - | - |
| `MINIMAX_API_KEY` | The concierge model (`minimax/MiniMax-M2`) | Yes |
| `SERPAPI_KEY` | Flight search (Google Flights) | Yes (for flights) |
| `LITE_API_KEY` | Hotel search (sandbox key starts with `sand_`) | Yes (for hotels) |
| `DATABASE_URL` | LibSQL DB for memory + RAG | Recommended — see note |

> `.env` is gitignored — never commit your keys. If a tool's key is missing it throws a clear "not configured" error rather than returning fake data.
>
> **`DATABASE_URL`:** set this to an **absolute** `file:` path (e.g. `file:/abs/path/travel-agent.db`) so the ingestion script and the dev server share one database. Without it, each resolves `file:./travel-agent.db` against its own working directory and they won't see each other's data.

### 4. Ingest the knowledge base (for RAG)
```bash
pnpm ingest   # chunk + embed knowledge/destinations.md → vector index
```
Re-run whenever you edit `knowledge/destinations.md`. First run downloads the local embedding model once.

### 5. Plan a trip (the main way to use it)
```bash
pnpm plan
```
A streaming chat in your terminal. Tell it about your trip; it asks what it needs, researches real options, and reasons about value. When you're happy, save the itinerary:

```
you ▸ 5 days in Tokyo in April, 2 adults + a 4-yo, mid-budget, love ramen & trains, from Bangalore
agent ▸ … (asks for exact dates, then researches flights/hotels/activities) …
you ▸ /save          # writes trips/<trip>.md
you ▸ /save html     # writes a styled trips/<trip>.html instead
you ▸ /exit
```

Commands: `/save` · `/save html` · `/reset` (new trip) · `/help` · `/exit`. Generated plans land in `trips/` (gitignored).

### Inspect / debug (optional)
```bash
pnpm dev        # Mastra Studio at http://localhost:4111 — inspect agents, tools, memory, traces
pnpm plan-trip  # one-shot demo: logs "→ delegating to flights-agent / hotels-agent / activities-agent"
pnpm build      # production build
```

---

## Roadmap

The agent's foundations follow the early phases of [`SPEC.md`](./SPEC.md) (tools → memory → RAG → multi-agent). Current focus is **sharpening the agent itself**: asking the right questions, reasoning about value, and reliable real-data planning. Booking is deliberately out of scope (the agent hands you a plan to book yourself).

---

## License

MIT
