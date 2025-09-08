import './globals.css'
import type { ReactNode } from 'react'
import { Navbar, Footer } from '@/components/Chrome'
import ClientProviders from '@/components/ClientProviders'

export const metadata = {
  title: 'Budgeteer',
  description: 'Smart budgeting with delightful UX',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-grain">
        <ClientProviders>
          <Navbar />
          <main className="container mx-auto max-w-6xl px-4 py-8">
            {children}
          </main>
          <Footer />
        </ClientProviders>
      </body>
    </html>
  )
}
