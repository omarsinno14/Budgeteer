import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Card } from '@/components/ui/Card'
import SettingsForm from '@/components/SettingsForm'
import { ThemeToggle } from '@/components/ThemeToggle'

export const metadata = { title: 'Settings – Budgeteer' }

function formatSince(date: Date) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      year: 'numeric', month: 'short', day: '2-digit'
    }).format(date)
  } catch { return date.toDateString() }
}

export default async function SettingsPage() {
  const session = await auth()
  if (!session?.user) redirect('/sign-in?callbackUrl=/settings')

  const me = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
    select: { name: true, email: true, phone: true, region: true, country: true, createdAt: true },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <div className="text-sm text-ink-600 dark:text-ink-300">
          Member since {me?.createdAt ? formatSince(me.createdAt) : '—'}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile form */}
        <Card className="lg:col-span-2 p-6">
          <SettingsForm
            initial={{
              name: me?.name ?? '',
              email: me?.email ?? '',
              phone: me?.phone ?? '',
              region: me?.region ?? '',
              country: me?.country ?? '',
            }}
          />
        </Card>

        {/* Theme + misc */}
        <Card className="p-6 space-y-4">
          <div>
            <h2 className="text-lg font-medium">Appearance</h2>
            <p className="text-sm text-ink-600 dark:text-ink-300">Switch between light and dark theme.</p>
          </div>
          <ThemeToggle />
          <div className="pt-2 text-xs text-ink-500">
            Theme changes are instant and saved to your device.
          </div>
        </Card>
      </div>
    </div>
  )
}
