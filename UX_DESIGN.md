# Travel AI Agent — UX Vision & Design Prompt

> How a future travel AI agent should look and feel — designed to erase the real gaps travelers hit (tab fatigue, value-for-money doubt, kid timing, decision paralysis, trust) — plus a **paste-ready prompt to generate the mockups in Claude design**.
>
> **Part 1** is the prompt you run. **Part 2** is the vision/spec behind it.

---

# Part 1 — Paste-Ready Design Prompt (run this in Claude design)

# Travel AI Agent — Paste-Ready Design Prompt

## 1. Master Prompt

```
Design a high-fidelity, responsive web app called "Travel AI" — an AI travel concierge that does the 40-tab planning work for the user and shows the answer with receipts.

PRODUCT IN ONE LINE: A multi-agent AI concierge that turns a one-sentence trip brief into a real, bookable, family-aware itinerary — comparing live flights, hotels, and activities for you, optimizing for value-per-buck (not cheapest, not fanciest), respecting kids' nap/meal/school timing, and never committing money without your explicit OK.

TARGET USERS & CORE PAINS (design must visibly erase these):
- Overwhelmed trip planners who waste hours across many tabs/sites to decide. Pain: tab sprawl, 600-hotel overload, comparison fatigue, decision paralysis.
- Value-seekers who want maximum experience-per-dollar, not the cheapest or the fanciest. Pain: "is this actually worth it, or just a price?", overpaying dread, FOMO that there's a better deal unseen.
- Families juggling real-life constraints. Pain: kid nap/meal/bedtime timing, school calendars, pacing ("is this too rushed for a 4-year-old?"), accessibility, jet lag.
- Trust-anxious AI users. Pain: stale/closed listings, hallucinated visa rules, "did the AI make this up?"

INTERACTION PARADIGM — a 3-region "planning desk", NOT a chatbot, NOT an OTA search dump:
- LEFT: Concierge chat rail (natural-language steering) + an "Agents at Work" live feed showing parallel specialist agents (Flights, Hotels, Activities, Weather, Currency, Visa-KB) each resolving to a result with its data source.
- CENTER: the "Trip Canvas" — a durable, typed itinerary artifact that survives reload and is the single source of truth. Switchable views: Timeline (family clock) · Map (geography/transfers) · Sheet (line-item costs) · Compare.
- RIGHT: Context Dock — an always-on "What I remember about you" profile chip, a search-coverage chip ("I checked 142 flights / 380 hotels"), and a trust drawer (citations, freshness, fact-vs-opinion).
- A linear progress spine across the top: Plan → Compare → Refine → Book → During. Chat steers, the canvas holds the truth, the dock proves it; nothing commits until the human says go. Agent proposals appear as pending/draft state (~50% opacity) until accepted; everything is undoable.

VISUAL STYLE & MOOD: A confident concierge, not a busy OTA — editorial-calm, premium-but-approachable, cartographic, fintech-grade trustworthy. Warm off-white "paper" canvas (#FAF8F4), not stark white. Color = meaning, never decoration: teal brand (#0E7C73) = the concierge; GOLD (#C8911C) reserved EXCLUSIVELY for value/"worth it"; green = fresh/live data; amber = stale/caution; indigo = AI opinion/inference; orange = "too rushed" pacing. Typography: Fraunces (humanist serif) for destination/section heroes only; Inter for UI/body with tabular-nums for all prices; mono for IDs/citations. Soft warm low shadows, radii 6–20px (rounded but not bubbly). Generous whitespace + strict typographic hierarchy so it reads calm despite being data-rich. Motion is purposeful: data arriving, cards staggering in as agents resolve, the plan "magnetizing" into the timeline, value cards re-ranking on a FLIP animation. No spinner theater, no FOMO red banners.

SCREENS TO DESIGN (one line each):
1. Trip Brief Start — a big natural-language brief bar pre-filled from memory; agent restates interpreted constraints as editable chips before any search; destination optional (agent proposes 2–3).
2. Onboarding / Profile (Memory) — conversational party-builder (adults/kids+ages/seniors), constraint chips, value-default budget slider; plus an editable, deletable "what I remember" drawer.
3. Live Planning — the "Agents at Work" feed running in parallel while the itinerary assembles progressively (flights → stay → activities fill in live), with a search-coverage banner.
4. Compare & Decide — three normalized tiers (Saver · Smart Value · Comfort) with a value slider that re-ranks live, true all-in cost, why-this rationale, and "why not the others?".
5. Itinerary Canvas (kid-aware) — the day as a vertical timeline with protected nap/meal/bedtime bands, inter-item travel times, pacing meter (Relaxed/Balanced/Packed), rush warnings, jet-lag softening, drag-to-reflow.
6. Booking Approval — the suspend/resume human gate: all-in home-currency breakdown, "nothing booked yet" draft state, single confident Approve & Book, reload-safe.
7. Value / Trade-off detail — the value-per-buck meter, "what your money buys", and the Save↔Value↔Splurge slider as a focused surface.

SIGNATURE COMPONENTS TO INCLUDE (name them on the mockups):
- Value-per-buck meter (`ValueScoreBadge` / `ValueMeter`): a 0–100 filled-arc score in GOLD with a plain-English "what your money buys" list, plus a Save↔Value↔Splurge slider that re-ranks options live.
- Agent-activity feed (`AgentActivityItem`): one line per specialist — queued/running(pulse)/done(check + result count + source chip); makes parallelism visible.
- Comparison surface (`ComparisonRail`): 3 columns, same axes, true all-in cost, hidden-fee deltas, winning-cell highlights, Smart Value column elevated with a gold ribbon.
- Kid-aware day timeline (`DayTimeline`): hatched protected bands for nap/meal/bedtime, travel time drawn to scale between items, pacing rail, "⚠ too rushed for a 4-year-old → ease this day".
- Why-this / source chips (`WhyThisPanel`, `ProvenanceBadge`, `CitationChip`): one-line reason + expandable cited drivers; live-source badges with freshness timestamps; visa facts carry clickable KB citations; fact (round badge) vs. opinion (diamond, italic "suggestion") visually orthogonal.
- Booking-approval card (`ApprovalCard`): draft/on-hold pill, line-item all-in total in home currency, Approve & Book / Modify / Reject, "survives reload" note.

REQUIREMENTS:
- Responsive: desktop-first 3-zone planning desk; tablet collapses to Chat⇄Canvas toggle; mobile stacks with swipeable compare cards, vertical timeline, and a sticky bottom action bar in the thumb zone; modals become bottom sheets.
- Light AND dark mode (dark is a first-class warm theme, not an inversion).
- Accessibility WCAG 2.1 AA: never color alone (icon/shape + text on every status), visible 2px teal focus rings, ≥44px tap targets, aria-live agent feed, focus-trapped approval dialog, prefers-reduced-motion support.
- Tone: confident, plain-spoken, trustworthy — "here's the one that wins for you," with receipts. Never salesy, urgent, or FOMO-baiting.

Deliver clean, realistic mockups with plausible real data (real-looking airline/hotel names, prices in USD with a home-currency line, live-FX and "checked 2 min ago" timestamps). Show at least one pending/draft state and one populated "remembered profile" state.
```

## 2. Per-Screen Prompts

### Trip Brief Start

```
Design the "Trip Brief Start" screen for an AI travel concierge web app (warm-paper #FAF8F4 canvas, teal #0E7C73 brand, Fraunces serif headers, Inter body).

JOB: Let the user say the whole trip in one breath, then confirm the agent's interpretation before any expensive search. Destination is an OUTPUT, not a required input.

LAYOUT & COMPONENTS:
- A large single natural-language brief bar, placeholder pre-filled from memory: "Plan a 5-day trip from BLR for 2 adults + Aanya (4), mid-budget, somewhere with slow mornings…".
- Below it (after submit): an "InterpretedBriefChips" row of editable chips the agent extracted — 📍 Destination: open (suggest 3) · 📅 Oct, flexible ±3d · 👨‍👩‍👧 2 adults + 1 kid (4) · 💸 Best value · ✈️ from BLR · 🧭 vibe: relaxed + 1 adventure. Each chip tap-to-edit.
- A primary "Looks right — plan it" button.
- A "DreamSpark" affordance for the blank-page case: "Don't know where? Paste a photo/link, or tell me a vibe." If destination is blank, show 3 destination candidate cards, each with a one-line "why this fits YOU" + a green/amber/red "when to go" band.
- Always-on top-right MemoryChip: "Remembering: BLR · veg · 2 adults + Aanya 4 · mid-budget ✎".

STATES: empty brief bar; parsed-into-chips confirmation state; destination-open with 3 candidate cards.
STYLE: editorial calm, lots of whitespace, the brief bar is the hero. Budget chip defaults to "Best value" (gold), never "cheapest". Light + dark mode.
```

### Onboarding / Profile (Memory)

```
Design the "Onboarding & Memory" screen for an AI travel concierge (warm-paper canvas, teal brand, gold = value).

JOB: Capture the few facts that change every recommendation (kids + ages, hard constraints, value-default budget) conversationally in under 90 seconds — and make the agent's memory visible, editable, and deletable.

LAYOUT & COMPONENTS:
- Warm prompt: "Before I plan anything — who am I planning for?"
- TravelPartyBuilder: tappable cards "+ Adult / + Kid / + Senior". Adding a Kid reveals an inline age stepper (0–17) and an auto-suggested nap-window chip ("Aanya, 4 → nap ~1–3pm"). Senior reveals a mobility chip (step-free, slow pace).
- ConstraintChips (multi-select, plain language): "No early flights · Home by school start · Max 6h travel/day · Quiet afternoons · Wheelchair/step-free · Aisle seat".
- BudgetStyleSlider: 3-stop Save ⟷ Best value ⟷ Splurge, DEFAULTED to Best value (the product thesis on screen one).
- IdentityRow: home airport (autocomplete) + passport country (flag picker), labeled "used only for flights & visa facts".
- A "MemoryDrawer" panel: list of remembered fields (Home airport BLR, Dietary Vegetarian, Budget Mid-value, Seat Aisle, Passport 🇮🇳 India [used only for visa checks], Family 2 adults + child 4) each with [edit] [forget]; plus "Learned from past trips" rows ("You skipped the 3rd activity most days → I plan lighter" [keep][drop]); and "Pause memory for this trip" + "Delete everything".

STATES: empty first-run; populated returning-user profile; a "Saved: home airport → BLR [undo]" toast.
STYLE: card-based, conversational, no wall of form fields. Sensitive fields (passport) carry a purpose note. Light + dark mode, AA contrast, ≥44px targets.
```

### Live Planning

```
Design the "Live Planning" hero screen for an AI travel concierge — the moment parallel specialist agents work and the itinerary assembles live (warm-paper canvas, teal brand).

JOB: Make the multi-agent parallelism VISIBLE (it's the value the user pays for), kill "is it frozen?" anxiety, and let the plan materialize progressively instead of spinner-then-dump.

LAYOUT (3 zones):
- LEFT — AgentActivityFeed: one live line per specialist with real status and a result count + source: "✓ Flights — 142 fares scanned · SerpApi", "✓ Hotels — 380 stays · LiteAPI · live", "⟳ Activities — Wikipedia/geo …", "✓ Weather — Oct 22°C dry · Open-Meteo", "✓ Visa — RAG checked, cited". States: queued (hollow dot) / running (teal pulsing dot + shimmer) / done (green check + count + source chip) / empty-error (plain-language). Each done row clickable → scrolls to its result. Expandable raw trace.
- CENTER — AssemblingPlanCanvas: skeleton sections (Flights → Stay → Things to do → Money → Entry) that fill in as each agent returns, partially populated, never blank. Each filled card carries a freshness badge ("checked just now") + source chip. A running SearchCoverageBanner: "Comparing 142 flights · 380 stays so you don't have to."
- RIGHT — ConciergeChat rail; user can interject ("actually, no red-eyes") mid-run; show a "No red-eyes, noted ✓" reply.

STATES: mid-run (some agents done, some running, skeletons loading); an honest empty result ("No nonstops on your dates — try ±2 days").
STYLE: motion = cards fade+rise 8px staggered as agents resolve; skeletons hold layout (no reflow jank). aria-live feed. Light + dark mode.
```

### Compare & Decide

```
Design the "Compare & Decide" screen for an AI travel concierge — the one screen that replaces 20 tabs (warm-paper canvas, teal brand, GOLD reserved for value).

JOB: Normalize apples-to-oranges into one grid where VALUE is the hero metric, hidden costs are exposed, and the agent has already picked a winner the user can trust.

LAYOUT & COMPONENTS:
- A ValueSlider pinned at top: "Save money ⟷ Best value ⟷ Splurge" — dragging re-ranks all cards live (FLIP reorder animation).
- Three normalized columns shown as Saver · ★ Smart Value · Comfort, same rows/axes. The Smart Value column is elevated with a gold ribbon + gold left-border.
- Each card: a ValueScore arc (0–100, gold fill) + a one-line WhyThis ("$40 more, but 9-min walk to all your picks + real veg breakfast — worth it"), a TrueCostRow (base + bags + transfers + fees + FX, all-in, in home currency, e.g. "₹21,300 / 5 nt incl. fees+FX, live"), a SourceChip + FreshnessBadge ("LiteAPI · just now").
- An "I checked everything" strip: "✓ Compared 380 stays — these 3 win for you. Why not the others? ▸" (expands rejected trade-offs naming specific losers, e.g. "Comfort: +₹3.6k for a pool you skipped, resort fee ₹600/nt").
- "See all 380 ▸" escape hatch (never the default). Live FX footnote "1€=₹90 (ECB, just now)".

STATES: default Best-Value ranking; slider dragged to "Save money" with cards reordered; "why not the others?" expanded.
STYLE: comparison TABLE clarity with tabular-nums, winning cells get subtle teal-50 fill. Mobile: cards become horizontally swipeable, one tier per snap. Light + dark mode, AA.
```

### Itinerary Canvas (kid-aware)

```
Design the "Itinerary Canvas" — the kid-aware day timeline, the product's headline differentiator (warm-paper canvas, teal brand).

JOB: Render the trip as a day-by-day TIMELINE (not a list) that visibly respects kid nap/meal/bedtime, travel time between items, weather windows, jet lag, and pacing — and let the user drag-to-reshape with the agent reflowing dependents.

LAYOUT & COMPONENTS:
- A horizontal DayRail (Day 1…Day 5), each with a PacingMeter chip (Relaxed / Balanced / ⚠ Packed).
- A vertical DayTimeline with real clock hours. Overlay hatched PROTECTED BANDS: nap (13:00–15:00, from kid age in memory), lunch anchor, bedtime 19:30 — the agent will not schedule over them. A WeatherBand ("🌧 rain 15–17h → outdoor item flagged"). A JetLagBand softening Day 1 ("you land 6am wrecked — gentle morning").
- Each item shows travel time to the next drawn to scale ("🚕 12 min", "🚶 8 min") and a diet/accessibility tag (🥦 veg ✓, ♿ partly steep ⚠) from profile.
- ConflictFlags inline: "⚠ Oceanário at 13:30 = Aanya's nap. [Move to 15:30] [Keep, she'll nap in stroller]"; day-level "⚠ Day 2: 5 stops · 6h moving — too tight for age 4. [Ease this day]".
- A CalendarGuard strip: "✓ Home before school resumes Oct 26". Quick-action chips: more kid-friendly · less rushed · cheaper · more adventure. Drag any item ↕, 📌 lock to protect from reflow; edits show a DiffView ("moved museum → 10am; dinner pushed 30 min").

STATES: a "Packed" day with a rush warning; a nap-collision callout; a softened jet-lag Day 1.
STYLE: protected bands as solid hatched zones; gaps drawn to scale so crunch is spatial, not textual. Pacing rail colored green/gold/orange. Light + dark mode.
```

### Booking Approval

```
Design the "Booking Approval" card for an AI travel concierge — the suspend/resume human gate, framed as safety not friction (warm-paper canvas, teal brand).

JOB: Turn buy-button terror into a calm, reversible-feeling moment. Show exactly what's being bought, all-in, in home currency, with one confident action — backed by a durable, reload-safe workflow.

LAYOUT & COMPONENTS:
- A "DRAFT · on hold" pill and a PendingDraftBanner: "Held for you — nothing is booked yet." Whole card reads as not-yet-real (reduced-opacity draft styling).
- Header (Fraunces): destination · dates · party ("Lisbon · Oct 12–18 · 2 adults + 1 child").
- CostBreakdown, line-by-line with source chips and tabular-nums:
  Flights 2 × $612 ◆SerpApi … $1,224
  Hotel 6 nts × $148 ◆LiteAPI … $888
  Activities 4 items ◆live … $200
  ── TOTAL $2,312 · ₹1,92,100 (amber because > $1,500 gate) · ◆ ECB 1 USD=82.9 INR, as of 14:30
- The suspend reason verbatim: "This itinerary is $2,312, above your $1,500 approval limit. Confirm to book."
- A PriceContext line: "ⓘ In typical range · lower than 80% of similar trips."
- Footer actions: primary "Approve & Book ▸" (teal), secondary "Edit plan", tertiary "Don't book". A ResumeStrip: "🔒 runId saved · survives reload · resume anytime, any device."

STATES: held/draft; "Booking…" determinate progress on the primary button (never optimistic confirm); ConfirmationCard with mono confirmationId + a booked/pending status strip (flights ✓ · hotel ✓ · activities ⧗); "Already approved in another tab" multi-tab guard.
STYLE: focus-trapped dialog, e4 elevation + scrim, calm not celebratory. Mobile = bottom sheet, sticky action bar. Light + dark mode, AA.
```

### Value / Trade-off detail

```
Design the "Value / Trade-off" detail surface for an AI travel concierge — experience-per-buck made legible (warm-paper canvas, teal brand, GOLD reserved exclusively for value).

JOB: Make value-per-buck the hero metric — a score, a plain-English "what your money buys", and a live trade-off slider — so the user feels smart about money and stops fearing they overpaid.

LAYOUT & COMPONENTS:
- ValueScoreBadge: a 0–100 filled ARC meter in gold with a one-line verdict "Smart Value pick", on an option header ("Hotel Sakura Shinjuku ★★★★ · Shinjuku · $148/night · live rate, checked 2 min ago").
- "WHAT YOUR MONEY BUYS" list: ✓ 6-min walk to everything you listed (saves ~₹2k/day taxis) · ✓ real breakfast, veg options ✓ · ✓ 12% under median for these dates · △ no pool (you didn't ask for one).
- A "Why 87?" expander → layered breakdown, each contributing factor with its weight and a source chip (LiteAPI live rate, Open-Meteo, distance computed from Activities geo) — value is never a black box.
- TradeoffSlider: coarse "Save money ●━━○━━ Splurge" on top (marker at "Best Value") + four fine weight bars (Price / Time-convenience / Comfort / Experiences). On release, options re-rank with motion.
- TradeoffNudge micro-moment card: "Spend $40 more on the Shinjuku hotel → save ~$90 in transfers + 35 min/day. Net: +experience, −$50. [Apply]".
- TrueCostStrip: "Headline $148 → TRUE COST ₹13,200/night (incl. taxes, breakfast, 0 transfer · live FX 1 USD=₹83.4 · Jun 19)".
- Three tiers co-present: SAVER · SMART VALUE (highlighted) · COMFORT, middle dominant (Goldilocks).

STATES: default Best-Value; slider dragged with re-ranked list; TradeoffNudge applied.
STYLE: gold arc/marker only for value; green = clear win, amber = trade-offs, never red (losers are explained, not shown). Light + dark mode, AA, prefers-reduced-motion.
```

## 3. How to Use These Prompts

- **Start with the Master Prompt** to establish the product, the 3-region planning-desk paradigm, the design tokens (warm-paper canvas, teal brand, gold-for-value-only), and the full screen set. Run it first so the tool builds a coherent design system and shared shell (progress spine, MemoryChip, agent feed) before any single screen.
- **Then run each per-screen prompt individually** to get a focused, high-fidelity mockup of that hero screen. Each block is self-contained and repeats the core style cues, so it works standalone if you only need one screen.
- **Iterate per screen** by appending one instruction (e.g., "show the dark-mode variant", "show the mobile bottom-sheet state", "show the empty/error state"). Each prompt already lists its key states — ask for them one at a time for cleaner output.
- **Keep the invariants stable** across regenerations: gold is for value only; every price has a source/freshness badge; fact (round badge) vs. opinion (diamond + "suggestion") stay visually distinct; nothing books without the Approval card; coverage counts ("checked 142") appear wherever options are narrowed.
- **For a clickable prototype**, run Master → Trip Brief Start → Live Planning → Compare & Decide → Itinerary Canvas → Booking Approval in sequence, asking the tool to link each screen's primary action to the next (the Plan → Compare → Refine → Book spine).

---

# Part 2 — UX Vision & Design Spec

# UX Vision & Design Spec — Travel AI Agent

## The Vision

> **Travel planning should feel like having one brilliant friend who already did the work.** Not 40 tabs. Not a spreadsheet. Not a wall of 600 hotels. Just a calm planning desk where a trusted concierge has scanned everything, narrowed it to the few that win *for you*, and shows you exactly *why* — with receipts. You steer with your voice; the plan holds itself together; nothing gets bought until you say go.

The product erases four specific aches: the **tab sprawl** of researching across a dozen sites, the **paralysis** of too many undifferentiated options, the **dread** of overpaying or missing something better, and the **blindness** to whether a plan actually fits your real life — your kids' naps, the school calendar, the jet lag, the budget. It replaces them with one surface, a value-first verdict, a family-aware timeline, and a reversible, reload-proof buy button.

---

## Core Principles

**1. One calm surface, not 20 tabs.** The agent does the cross-site synthesis. Flights, hotels, activities, weather, money, and visa facts live as cards in a single, persistent, reload-surviving workspace. The user never leaves, never reconstructs their trip from a chat transcript.

**2. Fewer, justified options.** Never a raw list of 600. Three curated picks + "show more," each carrying a one-line plain-English *why*. A confident default beats ten equal choices.

**3. Value is the hero metric — not cheapest, not fanciest.** "Experience-per-buck" is a first-class, sortable, sliderable score with a human-readable breakdown of what your money actually buys. The "Smart Value" pick is visually distinct from "Saver" and "Comfort."

**4. Fits real life — kids, pacing, budget, bodies.** The itinerary is a *timeline, not a list*, with protected nap/meal/bedtime bands, transfer times drawn to scale, jet-lag-softened arrival days, accessibility baked in, and loud "too rushed for a 4-year-old" warnings. Real constraints are visible, protected structure.

**5. Show your work.** Freshness badges, source chips, citations, "I checked 142 options" coverage counts, and a hard line between *fact* (cited, live) and *opinion* (labeled suggestion). Trust is earned visibly, in one tap.

**6. The human governs; nothing commits silently.** Every agent proposal lands as a reversible draft. Booking is a calm, explicit, reload-proof gate — framed as safety, not friction.

---

## The Interaction Model

**Chat steers, the canvas holds, the dock proves it — and nothing commits until the human says go.**

A three-region workspace, always coherent, one durable trip object:

- **Copilot Rail (left)** — natural-language steering + the **Agents-at-Work feed** that makes parallel specialists *visible* (the value you're paying for). Restates interpreted constraints as editable chips *before* fanning out.
- **Trip Canvas (center)** — the durable, typed itinerary **artifact**, the single source of truth. Switchable views: **Timeline** (family clock, pacing) · **Map** (geography, transfers) · **Sheet** (line-item costs, value) · **Compare** (3 tiers).
- **Context Dock (right)** — the always-on **"What I remember about you"** profile chip, the **trust drawer** (citations, freshness, fact-vs-opinion), and the **"I checked N options"** coverage assurance.

**Five modes = lenses on one trip object** (a visible progress spine, never separate apps): **PLAN** → **COMPARE** → **REFINE** → **BOOK** → **DURING**. Switching mode never loses state.

**Steering model:** the agent *narrows*; the human *governs*. Three escalating controls — one-tap **quick-action chips** (`more budget`, `less rushed`, `ease this day`), the **Value Slider** (Save ↔ Best Value ↔ Splurge, re-ranks live), and **free-text** for anything else. Every proposal is a `pending` draft at reduced opacity until accepted; everything is undoable.

**Session start:** Cold start is **constraint-first, not a destination box** — "tell me the shape, not the name"; destination is an *output*. Warm start skips intake entirely and lands on Trips Home with the profile chip pre-applied and "plan another like this."

---

## Key Screens

### Hero Screen 1 — `LivePlanningView`: parallel agents, plan assembling live

Makes the supervisor's parallelism visible, kills "is it frozen?" dread, materializes the plan progressively instead of spinner-then-dump.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Plan · Compare · Itinerary · Approve · You      Remembering: BLR·veg·2+Aanya4 ✎│
├──────────────────────┬──────────────────────────────────────┬────────────────┤
│  AGENTS AT WORK       │   ASSEMBLING YOUR LISBON PLAN          │  CONCIERGE     │
│                       │                                        │                │
│ ✓ Flights   SerpApi   │  ✈ FLIGHTS        ▓▓▓▓▓▓▓ done         │ You: 5 days,   │
│   142 fares scanned   │   BLR→LIS, 1 stop, 13h · from $612     │ Lisbon-ish,    │
│ ✓ Hotels    LiteAPI   │   [Compare 3 →]                         │ slow mornings  │
│   380 stays · live    │                                        │                │
│ ⟳ Activities Wiki/geo │  🏨 STAY          ▓▓▓▓░░░ loading…      │ Me: On it —    │
│   28 found near you   │   Alfama · walkable · live rates…       │ scanning now.  │
│ ✓ Weather   Open-Meteo│                                        │ No red-eyes,   │
│   Oct: 22°C, dry ✓    │  🎡 THINGS TO DO  ▓▓░░░░░ loading…      │ noted ✓        │
│ ✓ Visa      RAG ✓cite │                                        │                │
│   IN→PT: see Entry    │  💱 MONEY  1€=₹90 · 🛂 ENTRY ✓ cited    │ [type here…]   │
│                       │                                        │                │
│ ▸ expand trace        │  Comparing 142 flights · 380 stays for  │                │
│                       │  you so you can stop looking.           │                │
└──────────────────────┴──────────────────────────────────────┴────────────────┘
```

### Hero Screen 2 — `CompareGrid`: the one screen that replaces 20 tabs

Normalizes apples-to-oranges into one grid where **value is the hero**, hidden costs are exposed, and the agent has already picked a winner you can trust.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  COMPARE — STAY IN LISBON          Save money ●━━━━○━━━━ Splurge  [Best value] │
│  ✓ Compared 380 stays · these 3 win for you.   Why not the others? ▸          │
├───────────────────────┬───────────────────────────┬─────────────────────────┤
│   SAVER               │  ★ SMART VALUE  (pick)     │   COMFORT                │
│  Pensão Alfama        │  Casa Chiado ⭐ BEST VALUE  │  Hotel Avenida           │
│  ₹3.1k/nt             │  ₹4.2k/nt                   │  ₹7.8k/nt                │
│                       │                             │                          │
│  Value ███░░ 6.1      │  Value █████ 8.7            │  Value ███░░ 5.4         │
│  Why: cheapest, but   │  Why: ₹1.1k more than saver │  Why: lovely, but 25 min │
│  20-min walk to old   │  but 9-min walk to all your │  out + ₹3.6k more for    │
│  town; shared bath.   │  picks + real veg breakfast.│  little you listed.      │
│                       │  Worth it.                  │                          │
│  True cost (all-in,   │  True cost ₹21,300 / 5 nt   │  True cost ₹40,100/5nt   │
│  ₹): ₹16,800          │  (incl. fees+FX, live)      │  (resort fee ₹600/nt!)   │
│  LiteAPI · just now   │  LiteAPI · just now ✓       │  LiteAPI · just now      │
│  [ Select ]           │  [ ✓ Select this ]          │  [ Select ]              │
└───────────────────────┴───────────────────────────┴─────────────────────────┘
         See all 380 ▸        ⓘ FX live 1€=₹90 (ECB, just now)
```

### Hero Screen 3 — `ItineraryCanvas`: the living, family-aware timeline

The headline differentiator. The trip as a day-by-day timeline that visibly respects nap/meal/bedtime, travel time, weather windows, and jet lag — reshapeable by drag, with the agent reflowing dependents.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ITINERARY · LISBON      [Day1•gentle] [Day2 ⚠Packed] [Day3] [Day4] [Day5]    │
│  ✓ Home before school resumes Oct 26       Quick: kid-friendly·less rushed·€  │
├──────────────────── DAY 2  ·  Pacing: ⚠ PACKED — ease? ──────────────────────┤
│ 08:00 ┃ ☕ Slow breakfast @ Casa Chiado            🥦 veg ✓                    │
│ 09:30 ┃ 🚋 Tram 28 + Alfama walk        🚶 8 min · ♿ partly steep ⚠          │
│ 11:00 ┃ 🏰 São Jorge Castle             🚕 12 min to next                     │
│ ┌─────────────────── NAP / QUIET 13:00–15:00 (Aanya, 4) ──────────────────┐  │
│ │  ⚠ You scheduled Oceanário at 13:30 — that's nap time.                    │  │
│ │     [Move to 15:30]   [Keep, she'll nap in stroller]                       │  │
│ └───────────────────────────────────────────────────────────────────────────┘  │
│ 15:30 ┃ 🐟 Oceanário (moved)            🌧 rain 15–17h — indoor ✓ good pick   │
│ 18:00 ┃ 🍽 Early dinner — veg-friendly  before bedtime 19:30 band            │
│ ┌─ bedtime 19:30 ──────────────────────────────────────────────────────────┐ │
│ │  ⚠ Day total: 5 stops · 6h moving. Too tight for age 4.  [ Ease this day ] │ │
│ └───────────────────────────────────────────────────────────────────────────┘ │
│  drag any item ↕  ·  📌 lock  ·  changes reflow transfers & show a diff        │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Supporting screens

- **`OnboardingProfile`** (`/welcome`) — conversational party-builder (adults/kids+ages/seniors), constraint chips, budget *defaulting to Best Value*. Writes the memory moat in under 90 seconds. Returning users skip it.
- **`TripBriefBar`** (`/plan`) — one free-text breath → editable `InterpretedBriefChips` confirmed *before* any expensive fan-out. Blank destination → 3 candidates with "why this fits YOU" + a green/amber/red when-to-go band.
- **`BookingApprovalCard`** (modal) — the suspend/resume human gate (Screen 6 below in Trust).
- **`MemoryView`** (`/you`) — visible, editable, deletable profile + transparent "what I learned" post-trip.
- **`TripCompanion`** (`/trip/:id/now`) — calm "now / next" glance view with one-tap in-context re-plan ("we're tired / it's raining / running late") that keeps bookings intact.

**The spine:** `OnboardingProfile → TripBriefBar → LivePlanningView → CompareGrid → ItineraryCanvas → BookingApprovalCard → TripCompanion → MemoryView`.

---

## Signature Gap-Closing Features

**1. The Value Engine (`ValueLens`).** Price is never the headline. A 0–100 **ValueScore** with a filled-arc meter and a "what your money buys" breakdown; a **TradeoffSlider** (Save ↔ Value ↔ Splurge) that re-ranks everything live with motion; a **TrueCostStrip** that exposes all-in cost (base + bags + transfers + resort fees + FX) in home currency. The signature micro-moment: *"Spend $40 more → save ~$90 in transfers and 35 min/day. Net: +experience, −$50. Apply?"*

**2. One Canvas, No Tabs.** Living map/timeline/compare views, an Agent-Activity Rail proving the parallel work, freshness + source chips on every card, and a **SearchCoverageBanner** ("compared 142 flights / 380 stays — these 3 win; why not the others? ▸") that grants *permission to stop looking*.

**3. Family Clock.** `DayTimeline` with protected nap/meal/bedtime bands, inter-item transfer times drawn to scale, a per-day `PaceMeter` (Relaxed/Balanced/Packed), a loud `RushWarning` ("too rushed for a 4-year-old → ease this day"), a `CalendarGuard` (school resumes, home-by dates), and a `JetLagSoftener` auto-gentling arrival days.

**4. Decision Confidence.** `WhyThis` layered reasoning (one line → full receipts) with fact-vs-opinion typographically split; `AssumptionChips` surfaced and editable *before* the fan-out; `OneTapVariants` (cheaper / more relaxed / more adventurous / more kid-friendly) that re-spin the same artifact without re-typing; a `TimeBoxedDefault` that always collapses to one "if you do nothing else, book this."

**5. Budget Guardrails + the Approval Moment.** `PriceContextBar` ("lower than 80% of similar trips," buy/wait *only when confident*), deterministic line-by-line `CostBreakdown` in home currency, and the reload-proof `ApprovalGate`.

---

## Trust, Transparency & Control

The trust layer is inline affordances, not a settings page. Four invariants:

- **No naked numbers.** Every price/rate/hour wears a `ProvenanceBadge` (`◆ Live · LiteAPI · checked 2 min ago`) → one tap opens a `SourcePopover` with the raw source, timestamp, FX rate used, and coverage count.
- **Fact vs. opinion are visually orthogonal.** Hard facts = round badge + source + timestamp. Soft suggestions = diamond `◇ AI suggestion` + label. Shape *and* color encode it (never color alone). Visa/entry/safety always carry a `CitationChip` → exact KB chunk; if RAG finds nothing, an `UnverifiedNotice` appears ("I won't guess on visa rules") — the system never answers entry rules from the model.
- **Suppress, don't fake.** Missing confidence, empty results, and unverifiable facts each get a *named, honest* state — never a blank, never a guess. A missing Buy/Wait call is itself a trust signal.
- **The human stays in command.** A `SteeringDock` (lock pick, re-run one specialist, redo cheaper, undo last change, see all N); an `AssumptionBar` of editable chips that re-runs only what's affected; and a `MemoryDrawer` where remembered facts are visible, granularly editable, deletable, and pausable — memory is glass, not a black box, with purpose notes on sensitive fields (passport "used only for visa checks").

### Screen 6 — `BookingApprovalCard`: the human gate as a feature

```
┌──────────────── HELD FOR YOUR OK ──────────────────┐
│  Tokyo · Apr 10–15 · 2 adults + 1 child             │
│                                                      │
│  Here's exactly what you're buying, all-in,         │
│  in ₹ — nothing booked yet.                         │
│                                                      │
│  ✈ flights ✓   🏨 stay ✓   🎟 4 activities ✓        │
│  TOTAL  ₹1,83,000   ($2,200)                         │
│  ⓘ In typical range · lower than 80% similar         │
│                                                      │
│   [  Approve & Book  ]        [ Edit plan ]          │
│                                                      │
│  🔒 I've held this plan. Say the word anytime —     │
│     it survives if you close this tab.   runId ✓     │
└──────────────────────────────────────────────────────┘
```

The gate is framed as *safety, not friction*: "nothing booked yet," a single confident primary action, a `runId` persisted to `localStorage` the instant the card appears so it rehydrates on reload, on another device, or after a deploy. Approve → real `confirmationId` + a booked-vs-pending status strip. Reject → "Cancelled — tweak it?" with the artifact intact.

---

## Visual Language Summary

**North star:** a *confident concierge*, not a busy OTA. Rich in data, quiet in chrome. Every pixel builds **trust**, surfaces **value**, or respects the **real-life clock** — nothing decorative competes.

- **Mood:** editorial calm · concierge-premium · cartographic · trustworthy fintech-grade · warm-neutral, breathable, data-rich.
- **Color:** warm-paper neutrals (`#FAF8F4`, not stark white); teal `--brand-700` = the concierge; **gold reserved exclusively for value** ("worth it" never dilutes). Semantic palette: fresh-green, stale-amber, inference-indigo `◇`, warn-orange, approve-teal, error-red. Pacing scale: relaxed-green / balanced-gold / packed-orange.
- **Type:** Fraunces (humanist serif) for destination/hero headers only; Inter for UI/body with `tabular-nums` on all prices and totals; Geist Mono for IDs/confirmation codes/citations.
- **Form:** 4px spacing grid; radii 6/10/14/20; soft warm-tinted elevation (never harsh black shadows); dark mode is a first-class theme, not an inversion.
- **Signature components (`TA-` prefix):** `AgentActivityItem` · `OptionCard` · `ValueChip` · `ValueMeter` · `ValueSlider` · `ComparisonRail` · `DayTimeline` (+ PacingRail + kid bands) · `SourceChip`/`WhyThis` · `ApprovalCard` · `ConfirmationCard` · `BudgetBar`.
- **Motion:** purposeful only — streaming text with a soft caret, agents-at-work shimmer→spring on done, cards fading+rising as each specialist resolves, the plan *magnetizing* into the timeline, value-slider FLIP re-rank. All gated by `prefers-reduced-motion`.
- **Layout:** desktop = 3-zone planning desk (trips/profile · chat+cards · living canvas); mobile = stacked, swipeable comparison rails, sticky thumb-zone action bar, modals as bottom sheets.
- **Accessibility:** WCAG 2.1 AA contrast, status by shape+text (not color alone), 2px brand focus rings, `aria-live` agent feed, 44px tap targets, dietary/accessibility constraints surfaced on every card from profile — set once, never re-stated.

---

> **The whole product in one rule:** *chat steers, the canvas holds, the dock proves it — and nothing commits until the human says go.*
