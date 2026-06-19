/**
 * Demonstrates the booking workflow's suspend/resume loop from plain code
 * (this is what Studio does for you under the hood).
 *
 * Run with:  pnpm booking-demo
 */
import { mastra } from '../src/mastra'
import { approveIfOverBudget } from '../src/mastra/workflows/booking-workflow'

async function main() {
  const workflow = mastra.getWorkflow('bookingWorkflow')
  const run = await workflow.createRun()

  // 1) Start with a deliberately expensive brief so it crosses the approval gate.
  const result = await run.start({
    inputData: {
      brief:
        '10 days in Japan in spring, business-class flights for two from Delhi, ' +
        'loves food and trains, mid-range hotels and a few paid activities.',
      resourceId: 'traveler-asha',
      threadId: 'trip-japan-spring',
    },
  })

  // 2) If it paused, read why — then approve and resume.
  if (result.status === 'suspended') {
    const suspended = result.suspended[0] // e.g. ['approve-if-over-budget']
    const payload = result.steps[suspended[0]].suspendPayload
    console.log('Paused for approval:', payload)

    const final = await run.resume({
      step: approveIfOverBudget, // pass the step object for full type-safety
      resumeData: { approved: true },
    })

    console.log('Final:', final.status, final.result)
  } else {
    // Under-budget trips finish without ever pausing.
    console.log('Finished without approval:', result.status, result.result)
  }
}

main()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
