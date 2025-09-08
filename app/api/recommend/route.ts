// app/api/recommend/route.ts (no DB version)
import { NextResponse } from "next/server"

function estimateEffectiveRate(country: string, region: string, size: number) {
  const base = country === "CA" ? 0.23 : 0.25
  const regionBump = country === "CA" && region === "QC" ? 0.05 : 0.0
  const sizeAdj = Math.max(0, 0.02 * (size - 1))
  return Math.min(0.45, base + regionBump - sizeAdj)
}

export async function POST(req: Request) {
  const body = await req.json() as {
    grossAnnual: number, country: string, region: string, size: number, children: number
  }

  const eff = estimateEffectiveRate(body.country, body.region, body.size)
  const net = Math.round(body.grossAnnual * (1 - eff))

  const savingsPct = body.size > 2 ? 0.18 : 0.15
  const debtsPct = 0.10
  const essentialsPct = 0.32
  const discPct = Math.max(0.15, 1 - (savingsPct + debtsPct + essentialsPct))

  const allocations = {
    Rent_Housing: Math.round(net * 0.30),
    Savings: Math.round(net * savingsPct),
    Debt_Paydown: Math.round(net * debtsPct),
    Essentials: Math.round(net * essentialsPct),
    Discretionary: Math.round(net * discPct),
  }

  return NextResponse.json({
    netAnnual: net,
    allocations,
    explanation:
      `Using baseline rules (30% housing cap; ${Math.round(savingsPct*100)}% savings; 10% debt; 32% essentials).\n` +
      `Sign in (Google or demo) to personalize later.`
  })
}
