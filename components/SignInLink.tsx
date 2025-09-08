// components/SignInLink.tsx
'use client'
import Link from 'next/link'
import { PrimaryButton } from '@/components/ui/Button'

export function SignInLink({ callbackUrl = '/home', children = 'Sign in' }: { callbackUrl?: string, children?: React.ReactNode }) {
  return (
    <PrimaryButton asChild>
      <Link href={`/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`}>{children}</Link>
    </PrimaryButton>
  )
}
