/**
 * Watch the supervisor delegate to specialists, with delegation hooks logging
 * each handoff while the synthesized itinerary streams.
 *
 * Run with:  pnpm plan-trip
 */
import { mastra } from '../src/mastra'

async function main() {
  const concierge = mastra.getAgent('conciergeAgent')

  const stream = await concierge.stream(
    'Plan my full trip and delegate to all three specialists, then synthesize one itinerary: ' +
      'flights from BLR to Tokyo (NRT) on 2026-04-10 for 1 traveler; a mid-budget Tokyo hotel ' +
      'for 5 nights from 2026-04-10; and curate ramen spots and train day-trips. ' +
      'I hold an Indian passport.',
    {
      maxSteps: 12,
      memory: { thread: 'trip-tokyo-001', resource: 'traveler-alex' },
      delegation: {
        onDelegationStart: async (context: any) => {
          console.log(`\n→ delegating to ${context.primitiveId} (iteration ${context.iteration})`)
          return { proceed: true }
        },
        onDelegationComplete: async (context: any) => {
          console.log(`✓ ${context.primitiveId} finished`)
        },
      },
    },
  )

  for await (const chunk of stream.textStream) {
    process.stdout.write(chunk)
  }
  console.log('\n')
}

main()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
