'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Button, PrimaryButton } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function SignUpPage() {
  const sp = useSearchParams()
  const callbackUrl = sp.get('callbackUrl') || '/home'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErr(null)
    setLoading(true)
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })
    setLoading(false)
    const data = await res.json()
    if (!res.ok) return setErr(data?.message || 'Sign up failed.')
    window.location.href = `/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Card className="w-full max-w-md p-6 space-y-4">
        <h1 className="text-xl font-semibold">Create your account</h1>
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="label">Name</label>
            <Input value={name} onChange={e=>setName(e.target.value)} />
          </div>
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
            {loading ? 'Creating…' : 'Create account'}
          </PrimaryButton>
        </form>

        <p className="text-sm text-ink-600 dark:text-ink-300">
          Already have an account?{' '}
          <Link className="underline" href={`/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`}>
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  )
}
