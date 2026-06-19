# Travel Agent

A multi-agent **AI travel concierge** built on [Mastra](https://mastra.ai). Describe a trip in plain language — *"5 days in Denver in July, mid-budget, flying from SFO"* — and the agent plans it against **real** flight, hotel, weather, and currency data, then (in later phases) remembers your preferences, grounds visa answers in a knowledge base, and runs a human-approved booking workflow.

This repo is built incrementally, phase by phase. The full build plan lives in [`SPEC.md`](./SPEC.md).

---

## Status

| Phase | Scope | State |
| - | - | - |
| 1 | Scaffold + concierge agent + Studio | ✅ Done |
| 2 | Tools (flights, hotels, weather, currency) — **real providers** | ✅ Done |
| 3 | Storage + memory (history, working memory, semantic recall) | ⏳ Next |
| 4–10 | RAG, multi-agent network, booking workflow, processors/evals, observability/voice, auth/MCP, deploy | 🗺️ Planned |

Everything you can run today is a real, working agent: no mock data — each tool calls a live API.

---

## How it works

```
trip brief ──▶ Travel Agent Concierge (LLM) ──▶ picks tools ──▶ real providers
                                                  │
        ┌─────────────────────────────────────────┼───────────────────────────┐
        ▼                     ▼                     ▼                           ▼
  flight-search         hotel-search          get-weather               convert-currency
   (SerpApi /            (LiteAPI)             (Open-Meteo)               (Frankfurter / ECB)
   Google Flights)
```

- **Agent** — a single `conciergeAgent` (`src/mastra/agents/concierge-agent.ts`) with instructions, a model, and a set of tools. It decides which tool to call and with what arguments.
- **Tools** — typed `createTool` definitions (`src/mastra/tools/`). Each tool's Zod `inputSchema` is the contract the model reads, and its `execute` calls a real provider.
- **Provider seam** — every flight/hotel call goes through `src/mastra/providers/index.ts`. Swapping a data source (SerpApi → Duffel → Amadeus → your own backend) is a one-line change there; tools and the agent never change.

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
travel-agent/
├─ src/mastra/
│  ├─ index.ts                  # Mastra instance — registers agents
│  ├─ agents/concierge-agent.ts # the travel concierge
│  ├─ tools/                    # flight / hotel / weather / currency tools
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

> `.env` is gitignored — never commit your keys. If a tool's key is missing it throws a clear "not configured" error rather than returning fake data.

### 4. Run
```bash
pnpm dev      # starts Mastra + Studio at http://localhost:4111
pnpm build    # production build
```

Open **http://localhost:4111**, go to **Agents → Travel Agent Concierge**, and try:

> *"Find me flights from SFO to DEN on July 13 2026, and a mid-budget hotel in Denver for 3 nights from July 13. Show the hotel total in INR."*

Expand the tool calls or open the **Traces** tab to watch the model choose tools and see the real provider responses.

---

## Roadmap

The project follows the 10-phase plan in [`SPEC.md`](./SPEC.md): storage & memory → RAG knowledge base → multi-agent network → booking workflow with human approval → processors & evals → observability & voice → auth, client & MCP → deploy.

---

## License

MIT
