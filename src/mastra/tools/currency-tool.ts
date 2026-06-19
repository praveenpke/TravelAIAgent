import { createTool } from '@mastra/core/tools'
import { z } from 'zod'

export const currencyTool = createTool({
  id: 'convert-currency',
  description:
    'Convert an amount from one currency to another using live reference rates (Frankfurter / European Central Bank). Use when the traveler wants prices in a currency other than USD.',
  inputSchema: z.object({
    amount: z.number().describe('The amount to convert'),
    from: z.string().describe('Source currency code, e.g. "USD"'),
    to: z.string().describe('Target currency code, e.g. "INR"'),
  }),
  outputSchema: z.object({
    amount: z.number(),
    from: z.string(),
    to: z.string(),
    rate: z.number(),
    converted: z.number(),
    asOf: z.string().describe('Date of the reference rate (YYYY-MM-DD)'),
  }),
  execute: async inputData => {
    const { amount } = inputData
    const from = inputData.from.toUpperCase()
    const to = inputData.to.toUpperCase()

    // Same currency: no API call needed.
    if (from === to) {
      return { amount, from, to, rate: 1, converted: amount, asOf: new Date().toISOString().slice(0, 10) }
    }

    // Live reference rates from the Frankfurter API (ECB data, key-free).
    const res = await fetch(
      `https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=${to}`,
    )

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(
        `Currency conversion failed (${res.status}). ${from} or ${to} may be unsupported. ${text}`.trim(),
      )
    }

    const data = (await res.json()) as {
      amount: number
      base: string
      date: string
      rates: Record<string, number>
    }

    const converted = data.rates?.[to]
    if (converted === undefined) {
      throw new Error(`No reference rate available for ${from} → ${to}.`)
    }

    return {
      amount,
      from,
      to,
      rate: Math.round((converted / amount) * 1e6) / 1e6,
      converted: Math.round(converted * 100) / 100,
      asOf: data.date,
    }
  },
})
