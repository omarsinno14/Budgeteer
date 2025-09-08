'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Button, PrimaryButton } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function SignInPage() {
  const sp = useSearchParams()
  const callbackUrl = sp.get('callbackUrl') || '/home'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErr(null)
    setLoading(true)
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
      callbackUrl,
    })
    setLoading(false)
    if (!res) return setErr('Something went wrong.')
    if (res.error) return setErr('Email or password is incorrect.')
    window.location.href = callbackUrl
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Card className="w-full max-w-md p-6 space-y-4">
        <h1 className="text-xl font-semibold">Sign in to Budgeteer</h1>

        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="label">Email</label>
            <Input type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="label">Password</label>
            <Input type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
          </div>

        {err && <p className="text-sm text-red-600">{err}</p>}

          <PrimaryButton type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </PrimaryButton>
        </form>

        <div className="pt-2">
          <Button onClick={() => signIn('google', { callbackUrl })} className="w-full">
            Continue with Google
          </Button>
        </div>

        <p className="text-sm text-ink-600 dark:text-ink-300">
          No account?{' '}
          <Link className="underline" href={`/sign-up?callbackUrl=${encodeURIComponent(callbackUrl)}`}>
            Create one
          </Link>
        </p>
      </Card>
    </div>
  )
}
