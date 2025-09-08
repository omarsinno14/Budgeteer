'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button, PrimaryButton } from '@/components/ui/Button'

type Props = {
  initial: {
    name: string
    email: string
    phone: string
    region: string
    country: string
  }
}

export default function SettingsForm({ initial }: Props) {
  const [name, setName] = useState(initial.name)
  const [email] = useState(initial.email) // read-only
  const [phone, setPhone] = useState(initial.phone)
  const [region, setRegion] = useState(initial.region)
  const [country, setCountry] = useState(initial.country || 'CA')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function onSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setMessage(null)
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, region, country }),
      })
      if (!res.ok) throw new Error('Failed to save settings')
      setMessage('Saved!')
    } catch (e: any) {
      setMessage(e.message || 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={onSave} className="space-y-4">
      <div>
        <h2 className="text-lg font-medium mb-1">Profile</h2>
        <p className="text-sm text-ink-600 dark:text-ink-300">
          Update your basic information.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Name</label>
          <Input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
        </div>
        <div>
          <label className="label">Email</label>
          <Input value={email} readOnly className="opacity-80 cursor-not-allowed" />
        </div>
        <div>
          <label className="label">Phone</label>
          <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 555 123 4567" />
        </div>
        <div>
          <label className="label">Country</label>
          <Input value={country} onChange={e => setCountry(e.target.value.toUpperCase())} placeholder="CA" />
        </div>
        <div>
          <label className="label">Region / State / Prov.</label>
          <Input value={region} onChange={e => setRegion(e.target.value.toUpperCase())} placeholder="QC" />
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <PrimaryButton type="submit" disabled={saving}>
          {saving ? 'Saving…' : 'Save changes'}
        </PrimaryButton>
        {message && <span className="text-sm text-ink-600 dark:text-ink-300">{message}</span>}
      </div>
    </form>
  )
}
