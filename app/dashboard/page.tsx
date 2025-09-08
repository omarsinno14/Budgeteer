import BudgetEstimator from '@/components/BudgetEstimator'
import { Card } from '@/components/ui/Card'

export const metadata = { title: 'Dashboard – Budgeteer' }

export default async function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between">
        <h2 className="text-2xl font-semibold">Budget Estimator</h2>
      </div>
      <Card>
        <BudgetEstimator />
      </Card>
    </div>
  )
}
