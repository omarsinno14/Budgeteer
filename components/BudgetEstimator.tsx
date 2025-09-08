// components/BudgetEstimator.tsx
'use client'

import dynamic from 'next/dynamic'
import type { ComponentType } from 'react'
import { useMemo, useState } from 'react'
import { z } from 'zod'
import { motion } from 'framer-motion'

import { Button, PrimaryButton } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'

import { Kpi } from '@/components/Kpi'
import { GoalRing } from '@/components/GoalRing'
import { Tips } from '@/components/Tips'
import { MonthlyBars } from '@/components/MonthlyBars'

// Recharts dynamic imports (cast to generic components to avoid TS prop mismatch)
const PieChart = dynamic(
  () =>
    import('recharts').then((m) => ({
      default: m.PieChart as unknown as ComponentType<any>,
    })),
  { ssr: false }
)

const Pie = dynamic(
  () =>
    import('recharts').then((m) => ({
      default: m.Pie as unknown as ComponentType<any>,
    })),
  { ssr: false }
)

const Cell = dynamic(
  () =>
    import('recharts').then((m) => ({
      default: m.Cell as unknown as ComponentType<any>,
    })),
  { ssr: false }
)

const schema = z.object({
  grossAnnual: z.coerce.number().int().positive(),
  country: z.string().length(2),
  region: z.string().min(2),
  size: z.coerce.number().int().min(1).max(10),
  children: z.coerce.number().int().min(0).max(10),
})

const presets = [
  { label: 'Solo, QC', v: { grossAnnual: '90000',  country: 'CA', region: 'QC', size: '1', children: '0' } },
  { label: 'Couple, ON', v:{ grossAnnual: '160000', country: 'CA', region: 'ON', size: '2', children: '0' } },
  { label: 'Family (2 kids), QC', v:{ grossAnnual: '180000', country: 'CA', region: 'QC', size: '4', children: '2' } },
]

export default function BudgetEstimator() {
  const [grossAnnual, setGross] = useState('100000')
  const [country, setCountry] = useState('CA')
  const [region, setRegion] = useState('QC')
  const [size, setSize] = useState('1')
  const [children, setChildren] = useState('0')

  const [netAnnual, setNet] = useState<number | null>(null)
  const [plan, setPlan] = useState<Record<string, number> | null>(null)
  const [explanation, setExp] = useState('')
  const [loading, setLoading] = useState(false)
  const [fb, setFb] = useState<string | null>(null)

  const pieData = useMemo(
    () => (!plan ? [] : Object.entries(plan).map(([name, value]) => ({ name, value }))),
    [plan]
  )

  async function submit() {
    const parsed = schema.safeParse({ grossAnnual, country, region, size, children })
    if (!parsed.success) { alert('Please check your inputs.'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grossAnnual: Number(grossAnnual),
          country, region,
          size: Number(size), children: Number(children),
        }),
      })
      const data = await res.json()
      setNet(data.netAnnual)
      setPlan(data.allocations)
      setExp(data.explanation)
    } finally {
      setLoading(false)
    }
  }

  async function sendFeedback(val: 'good' | 'aggressive' | 'conservative') {
    setFb(val)
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sentiment: val }),
      })
    } catch {
      /* ok in demo mode */
    }
  }

  const applyPreset = (p: typeof presets[number]['v']) => {
    setGross(p.grossAnnual)
    setCountry(p.country)
    setRegion(p.region)
    setSize(p.size)
    setChildren(p.children)
  }

  const monthlySavings = plan ? Math.round((plan.Savings ?? 0) / 12) : 0
  // rough 6-month proxy; tweak as you like
  const emergencyGoal = Math.max(1, Math.round((netAnnual ?? 0) / 2))

  return (
    <div className="space-y-6">
      {/* Scenario presets */}
      <div className="flex flex-wrap gap-2">
        {presets.map((p) => (
          <button
            key={p.label}
            className="btn btn-outline"
            onClick={() => applyPreset(p.v)}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Intake form */}
      <Card className="space-y-5">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">Gross Income (Annual)</label>
              <Input inputMode="numeric" value={grossAnnual} onChange={(e) => setGross(e.target.value)} />
            </div>
            <div>
              <label className="label">Country</label>
              <Select value={country} onChange={(e) => setCountry(e.target.value)}>
                <option>CA</option>
                <option>US</option>
              </Select>
            </div>
            <div>
              <label className="label">Region</label>
              <Input value={region} onChange={(e) => setRegion(e.target.value.toUpperCase())} placeholder="QC" />
            </div>
            <div>
              <label className="label">Household Size</label>
              <Input inputMode="numeric" value={size} onChange={(e) => setSize(e.target.value)} />
            </div>
            <div>
              <label className="label">Children</label>
              <Input inputMode="numeric" value={children} onChange={(e) => setChildren(e.target.value)} />
            </div>
          </div>
          <div className="flex gap-3 mt-2">
            <PrimaryButton onClick={submit} disabled={loading}>
              {loading ? 'Calculating…' : 'Estimate Budget'}
            </PrimaryButton>
            <Button
              onClick={() => {
                setPlan(null)
                setNet(null)
                setFb(null)
              }}
            >
              Reset
            </Button>
          </div>
        </motion.div>
      </Card>

      {/* Empty state before first estimate */}
      {!plan && (
        <div className="card p-8 text-center">
          <div className="text-lg font-medium mb-1">Let’s build your first plan</div>
          <p className="text-ink-600 dark:text-ink-300 mb-4">
            Pick a preset or enter your details, then hit “Estimate Budget”.
          </p>
          <div className="opacity-70 text-sm">We’ll never show this as tax advice—just guidance.</div>
        </div>
      )}

      {/* KPIs */}
      {plan && netAnnual !== null && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Kpi label="Net / Year" value={`$${netAnnual.toLocaleString()}`} />
          <Kpi label="Net / Month" value={`$${Math.round(netAnnual / 12).toLocaleString()}`} />
          <Kpi label="Housing Cap" value={`$${(plan.Rent_Housing ?? 0).toLocaleString()}`} />
          <Kpi label="Savings Target" value={`$${(plan.Savings ?? 0).toLocaleString()}`} />
        </div>
      )}

      {/* Main content when we have a plan */}
      {plan && netAnnual !== null && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Chart + Monthly bars (span 2 cols) */}
          <div className="space-y-6 lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <h3 className="text-xl font-semibold">Estimated Net: ${(netAnnual / 1000).toFixed(1)}k</h3>
                <div className="h-64 flex items-center justify-center">
                  {pieData.length > 0 && (
                    <PieChart width={360} height={240}>
                      <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={110}>
                        {pieData.map((_, i) => (
                          <Cell key={i} />
                        ))}
                      </Pie>
                    </PieChart>
                  )}
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 }}
            >
              <MonthlyBars plan={plan} />
            </motion.div>
          </div>

          {/* Right: Tips + Goal ring + Plan details */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Tips country={country} region={region} size={Number(size)} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 }}
            >
              <GoalRing label="Emergency Fund" value={monthlySavings * 4} goal={emergencyGoal} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1 }}
            >
              <Card className="space-y-3">
                <h4 className="text-lg font-medium">Plan</h4>
                <ul className="text-sm space-y-1">
                  {Object.entries(plan).map(([k, v]) => (
                    <li key={k} className="flex justify-between">
                      <span>{k}</span>
                      <span>${v.toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-ink-600 dark:text-ink-300 whitespace-pre-line">{explanation}</p>
                <div className="pt-1 flex flex-wrap gap-2">
                  <Button
                    className={fb === 'good' ? 'ring-2 ring-brand-500' : ''}
                    onClick={() => sendFeedback('good')}
                  >
                    Looks Good
                  </Button>
                  <Button
                    className={fb === 'aggressive' ? 'ring-2 ring-brand-500' : ''}
                    onClick={() => sendFeedback('aggressive')}
                  >
                    Too Aggressive
                  </Button>
                  <Button
                    className={fb === 'conservative' ? 'ring-2 ring-brand-500' : ''}
                    onClick={() => sendFeedback('conservative')}
                  >
                    Too Conservative
                  </Button>
                </div>
                <p className="text-[11px] text-ink-500">
                  Estimates are for planning only — not tax or financial advice.
                </p>
              </Card>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  )
}