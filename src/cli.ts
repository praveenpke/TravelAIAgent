/**
 * Travel AI Agent — terminal planner.
 *
 * Chat with the concierge to plan the best trip for your money. It asks what it
 * needs, researches real flights/hotels/activities, and (on /save) writes a
 * shareable itinerary file you can book from.
 *
 * Run:  pnpm plan
 */
import readline from 'node:readline/promises'
import { stdin, stdout } from 'node:process'
import { mastra } from './mastra'
import { savePlan } from './output/save-plan'

const C = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  teal: '\x1b[36m',
  gold: '\x1b[33m',
  green: '\x1b[32m',
  red: '\x1b[31m',
}

const FINAL_PLAN_PROMPT = `Produce the FINAL trip plan now as clean GitHub-flavored Markdown ONLY (no preamble, start with a "# " title). Include these sections:
- a 2-3 line overview (destination, dates, who, the vibe),
- ## Flights — recommended option(s) with airline, price in USD, duration, and any booking link,
- ## Where to stay — hotel(s) with nightly + total price and one line on why it's worth it,
- ## Day-by-day — a realistic plan tuned to the party and pacing (respect kids' timing if any),
- ## Budget — an itemized estimate (cheap but best experience) with a total,
- ## Visa & entry — only if relevant, with the source,
- ## Money-saving tips — 2-3 concrete tips.
Use the REAL options and prices you found via your specialists. Do not invent data.`

const concierge = mastra.getAgent('conciergeAgent')

let resource = sessionId()
let thread = sessionId()

function sessionId(): string {
  return `cli-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e6).toString(36)}`
}

function banner() {
  stdout.write(`
${C.teal}${C.bold}🌍 Travel AI Agent${C.reset} ${C.dim}— terminal trip planner${C.reset}

I plan the best trip for your money — real flights, hotels & activities, tuned to
how you actually travel. I don't book; I hand you a plan you can act on.

${C.dim}Tell me about your trip in one line, for example:${C.reset}
  ${C.dim}"5 days in Japan in April, 2 adults + a 4-yo, mid-budget, love food & trains, from Bangalore, Indian passport"${C.reset}

${C.dim}Commands:${C.reset} ${C.bold}/save${C.reset} ${C.dim}(md, default)${C.reset}  ${C.bold}/save html${C.reset}  ${C.bold}/reset${C.reset}  ${C.bold}/help${C.reset}  ${C.bold}/exit${C.reset}
`)
}

function help() {
  stdout.write(`
${C.dim}Just type to chat. The agent asks what it needs, then researches and plans.${C.reset}
  ${C.bold}/save${C.reset}        write the itinerary to a Markdown file
  ${C.bold}/save html${C.reset}   write a styled HTML file instead
  ${C.bold}/reset${C.reset}       start a fresh trip (new conversation)
  ${C.bold}/exit${C.reset}        quit
`)
}

async function streamReply(message: string): Promise<void> {
  stdout.write(`${C.gold}${C.bold}agent ▸${C.reset} `)
  try {
    const res = await concierge.stream(message, {
      memory: { resource, thread },
      maxSteps: 16,
    })
    let wrote = false
    for await (const chunk of res.textStream) {
      stdout.write(chunk)
      wrote = true
    }
    if (!wrote) stdout.write(`${C.dim}(no response — try rephrasing)${C.reset}`)
  } catch (err) {
    stdout.write(`${C.red}error: ${(err as Error).message}${C.reset}`)
  }
  stdout.write('\n\n')
}

async function doSave(format: 'md' | 'html'): Promise<void> {
  stdout.write(`${C.dim}Building your itinerary…${C.reset}\n`)
  try {
    const res = await concierge.generate(FINAL_PLAN_PROMPT, {
      memory: { resource, thread },
      maxSteps: 16,
    })
    if (!res.text?.trim()) {
      stdout.write(`${C.red}Couldn't build a plan yet — tell me more about the trip first.${C.reset}\n\n`)
      return
    }
    const saved = await savePlan(res.text, format)
    stdout.write(`${C.green}✅ Saved ${saved.format.toUpperCase()} → ${saved.path}${C.reset}\n\n`)
  } catch (err) {
    stdout.write(`${C.red}Save failed: ${(err as Error).message}${C.reset}\n\n`)
  }
}

async function main() {
  banner()
  const rl = readline.createInterface({ input: stdin, output: stdout })

  for (;;) {
    let line: string
    try {
      line = (await rl.question(`${C.teal}${C.bold}you ▸${C.reset} `)).trim()
    } catch (err) {
      // stdin closed (EOF / piped input ended) — exit cleanly.
      if ((err as NodeJS.ErrnoException).code === 'ERR_USE_AFTER_CLOSE') break
      throw err
    }
    if (!line) continue

    const lower = line.toLowerCase()
    if (lower === '/exit' || lower === 'exit' || lower === '/quit') break
    if (lower === '/help') {
      help()
      continue
    }
    if (lower === '/reset') {
      resource = sessionId()
      thread = sessionId()
      stdout.write(`${C.dim}Started a fresh trip.${C.reset}\n\n`)
      continue
    }
    if (lower === '/save' || lower.startsWith('/save ')) {
      const format = lower.includes('html') ? 'html' : 'md'
      await doSave(format)
      continue
    }

    await streamReply(line)
  }

  rl.close()
  stdout.write(`${C.dim}Safe travels. 👋${C.reset}\n`)
  process.exit(0)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
