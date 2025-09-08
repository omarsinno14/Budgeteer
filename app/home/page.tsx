import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Button, PrimaryButton } from '@/components/ui/Button'
import { ArrowRight, Sparkles, Target, PiggyBank, CreditCard, ListChecks, TrendingUp, PieChart, Info } from 'lucide-react'

export const metadata = { title: 'Home – Budgeteer' }

export default async function Home() {
  const session = await auth()
  if (!session?.user) redirect('/sign-in?callbackUrl=/home')

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="rounded-2xl p-6 border border-ink-200/60 dark:border-ink-800/60 bg-white/60 dark:bg-black/40 backdrop-blur">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 text-brand-600">
              <Sparkles className="h-5 w-5" />
              <span className="font-medium">
                Hello{session.user?.name ? `, ${session.user.name.split(' ')[0]}` : ''}!
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Let’s make your money work smarter
            </h1>
            <p className="text-ink-600 dark:text-ink-300">
              Start with an estimate, set goals, then track spending. We’ll guide you as you go.
            </p>
          </div>
          <div className="flex gap-3">
            <PrimaryButton asChild>
              <Link href="/dashboard" className="inline-flex items-center gap-2">
                Open Budget Estimator <ArrowRight className="h-4 w-4" />
              </Link>
            </PrimaryButton>
            <Button asChild><Link href="/goals">Create Goals</Link></Button>
          </div>
        </div>
      </section>

      {/* Action tiles */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 space-y-2">
          <div className="flex items-center gap-2">
            <PieChart className="h-5 w-5 text-brand-600" />
            <h2 className="text-xl font-semibold">Estimate Your Budget</h2>
          </div>
          <p className="text-sm text-ink-600 dark:text-ink-300">
            Enter income, region, and household size to get a recommended allocation.
          </p>
          <div className="pt-2">
            <PrimaryButton asChild><Link href="/dashboard">Open Estimator</Link></PrimaryButton>
          </div>
        </Card>

        <Card className="p-6 space-y-2">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-brand-600" />
            <h2 className="text-xl font-semibold">Set Financial Goals</h2>
          </div>
          <p className="text-sm text-ink-600 dark:text-ink-300">
            Define savings targets, payoff timelines, and your emergency fund.
          </p>
          <div className="pt-2">
            <Button asChild><Link href="/goals">Create Goals</Link></Button>
          </div>
        </Card>

        <Card className="p-6 space-y-2">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-brand-600" />
            <h2 className="text-xl font-semibold">Track Expenses</h2>
          </div>
          <p className="text-sm text-ink-600 dark:text-ink-300">
            Log recurring bills and monthly spend to refine your plan.
          </p>
          <div className="pt-2">
            <Button asChild><Link href="/expenses">Add Expenses</Link></Button>
          </div>
        </Card>
      </section>

      {/* Quick shortcuts + checklist */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 space-y-4 lg:col-span-2">
          <h3 className="text-lg font-medium">Quick shortcuts</h3>
          <div className="flex flex-wrap gap-2">
            <Button asChild><Link href="/dashboard?preset=solo-qc">Solo in QC</Link></Button>
            <Button asChild><Link href="/dashboard?preset=couple-on">Couple in ON</Link></Button>
            <Button asChild><Link href="/dashboard?preset=family-2kids">Family (2 kids)</Link></Button>
            <Button asChild><Link href="/goals/new?type=emergency">New Emergency Fund</Link></Button>
            <Button asChild><Link href="/expenses/new">New Expense</Link></Button>
            <Button asChild><Link href="/profile">Profile</Link></Button>
            <Button asChild><Link href="/settings">Settings</Link></Button>
          </div>
          <div className="mt-2 rounded-xl border border-ink-200/60 dark:border-ink-800/60 p-4 bg-white/50 dark:bg-black/30">
            <div className="flex items-center gap-2 mb-2">
              <ListChecks className="h-4 w-4 text-brand-600" />
              <span className="font-medium">Starter checklist</span>
            </div>
            <ul className="text-sm space-y-2">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-4 w-4 rounded-full bg-brand-500/15 ring-1 ring-brand-500/30" />
                Run your first budget estimate in the Dashboard
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-4 w-4 rounded-full bg-brand-500/15 ring-1 ring-brand-500/30" />
                Create at least one savings goal
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-4 w-4 rounded-full bg-brand-500/15 ring-1 ring-brand-500/30" />
                Add your top 3 recurring expenses
              </li>
            </ul>
          </div>
        </Card>

        <Card className="p-6 space-y-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-brand-600" />
            <h3 className="text-lg font-medium">Savings Snapshot</h3>
          </div>
          <p className="text-sm text-ink-600 dark:text-ink-300">
            Once you run an estimate and add goals, we’ll visualize progress here.
          </p>
          <div className="rounded-lg border border-ink-200/60 dark:border-ink-800/60 p-4 bg-white/50 dark:bg-black/30">
            <div className="text-sm text-ink-600 dark:text-ink-300">No data yet — try the estimator.</div>
          </div>
        </Card>
      </section>

      {/* Guidance / tips */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 space-y-2">
          <div className="flex items-center gap-2">
            <PiggyBank className="h-5 w-5 text-brand-600" />
            <h3 className="text-lg font-medium">Guided next steps</h3>
          </div>
          <ul className="text-sm list-disc pl-5 space-y-1 text-ink-700 dark:text-ink-200">
            <li>Start with 50/30/20, then adjust based on your city and household size.</li>
            <li>Keep housing ≤ 30–35% of your net income (lower in high-cost months).</li>
            <li>Automate savings right after payday; treat it like a fixed bill.</li>
            <li>Give feedback on plans — we’ll learn your preferences over time.</li>
          </ul>
          <div className="text-xs text-ink-500 inline-flex items-center gap-1 mt-2">
            <Info className="h-3.5 w-3.5" /> Guidance is educational only (not financial advice).
          </div>
        </Card>

        <Card className="p-6 space-y-2">
          <h3 className="text-lg font-medium">What’s next</h3>
          <p className="text-sm text-ink-600 dark:text-ink-300">
            We’re adding goal progress rings, expense categories by location, and smarter rent caps.
          </p>
          <div className="pt-2">
            <Button asChild><Link href="/changelog">View changelog</Link></Button>
          </div>
        </Card>
      </section>
    </div>
  )
}
