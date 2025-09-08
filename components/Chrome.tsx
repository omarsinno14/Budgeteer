// components/Chrome.tsx
'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { ThemeToggle } from '@/components/ThemeToggle'

function NavLink({ href, children }:{ href:string, children: React.ReactNode }) {
  const pathname = usePathname()
  const active = pathname === href
  return (
    <Link
      href={href}
      className={`px-3 py-2 rounded-lg text-sm ${
        active
          ? 'bg-brand-500/10 text-brand-700 dark:text-brand-300'
          : 'text-ink-700 dark:text-ink-200 hover:bg-ink-100/60 dark:hover:bg-ink-900/50'
      }`}
    >
      {children}
    </Link>
  )
}

export function Navbar() {
  const { data: session } = useSession()
  const router = useRouter()

  async function handleSignOut() {
    // safest pattern: no redirect from NextAuth, we control navigation
    await signOut({ redirect: false })
    router.replace('/sign-in')
  }

  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/60 dark:bg-black/40 border-b border-ink-200/60 dark:border-ink-800/60">
      <div className="container mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="font-semibold text-lg">Budgeteer</Link>
        </div>

        <nav className="flex items-center gap-2">
          {/* Always available */}
          <NavLink href="/home">Home</NavLink>
          <NavLink href="/dashboard">Estimator</NavLink>

          {/* Auth links */}
          {!session?.user ? (
            <>
              {/* Always link to the UI page, not the API */}
              <NavLink href="/sign-in">Sign in</NavLink>
              <NavLink href="/sign-up">Sign up</NavLink>
            </>
          ) : (
            <button
              onClick={handleSignOut}
              className="px-3 py-2 rounded-lg text-sm text-ink-700 dark:text-ink-200 hover:bg-ink-100/60 dark:hover:bg-ink-900/50"
            >
              Sign out
            </button>
          )}

          {/* Theme toggle */}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}

export function Footer() {
  return (
    <footer className="mt-12 py-6 text-center text-sm text-ink-600 dark:text-ink-300">
      © {new Date().getFullYear()} Budgeteer
    </footer>
  )
}
