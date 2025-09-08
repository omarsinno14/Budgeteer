// components/AuthForms.tsx
'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button, PrimaryButton } from '@/components/ui/Button'

function useRelativeCallback(defaultPath = '/home') {
  const sp = useSearchParams()
  const raw = sp.get('callbackUrl') || defaultPath
  return useMemo(() => {
    try {
      if (raw.startsWith('http')) return new URL(raw).pathname || defaultPath
      return raw.startsWith('/') ? raw : `/${raw}`
    } catch {
      return defaultPath
    }
  }, [raw, defaultPath])
}

export function SignInForm() {
  const router = useRouter()
  const callbackUrl = useRelativeCallback('/home')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError(null)
    const res = await signIn('credentials', { redirect: false, email, password })
    setLoading(false)
    if (!res?.ok) {
      setError('Email or password not correct.')
      return
    }
    router.replace(callbackUrl) // always relative
  }

  return (
    <Card className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Welcome back</h1>
      <p className="text-ink-600 dark:text-ink-300 text-sm">Sign in to continue budgeting.</p>

      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="label">Email</label>
          <Input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" required />
        </div>
        <div>
          <label className="label">Password</label>
          <Input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" required />
        </div>
        {error && <div className="text-sm text-red-600">{error}</div>}
        <div className="flex gap-3 pt-2">
          <PrimaryButton type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </PrimaryButton>
          <Button type="button" onClick={() => signIn('google', { callbackUrl })}>
            Continue with Google
          </Button>
        </div>
      </form>

      <div className="text-sm">
        New to Budgeteer?{' '}
        <Link className="link" href={`/sign-up?callbackUrl=${encodeURIComponent(callbackUrl)}`}>
          Create an account
        </Link>
      </div>
    </Card>
  )
}

export function SignUpForm() {
  const router = useRouter()
  const callbackUrl = useRelativeCallback('/home')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError(null)
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      if (!res.ok) {
        const j = await res.json().catch(()=> ({}))
        throw new Error(j.error || 'Failed to sign up')
      }
      const login = await signIn('credentials', { redirect: false, email, password })
      if (!login?.ok) throw new Error('Signup succeeded but login failed')
      router.replace(callbackUrl) // always relative
    } catch (e:any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Create your account</h1>
      <p className="text-ink-600 dark:text-ink-300 text-sm">Set goals, plan budgets, and get smart guidance.</p>

      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="label">Name</label>
          <Input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" />
        </div>
        <div>
          <label className="label">Email</label>
          <Input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" required />
        </div>
        <div>
          <label className="label">Password</label>
          <Input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Minimum 8 characters" required />
        </div>
        {error && <div className="text-sm text-red-600">{error}</div>}
        <div className="flex gap-3 pt-2">
          <PrimaryButton type="submit" disabled={loading}>
            {loading ? 'Creating…' : 'Create account'}
          </PrimaryButton>
          <Button type="button" onClick={() => signIn('google', { callbackUrl })}>
            Continue with Google
          </Button>
        </div>
      </form>

      <div className="text-sm">
        Already have an account?{' '}
        <Link className="link" href={`/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`}>
          Sign in
        </Link>
      </div>
    </Card>
  )
}
