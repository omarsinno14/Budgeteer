// components/ui/Button.tsx
'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import clsx from 'clsx'

type BaseProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean
}

function baseClasses(variant: 'default' | 'primary' | 'outline') {
  const common =
    'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition ' +
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none ' +
    'shadow-sm hover:shadow'

  const light =
    'bg-ink-100 text-ink-900 hover:bg-ink-200 dark:bg-ink-800 dark:text-ink-100 dark:hover:bg-ink-700 ' +
    'border border-ink-200/70 dark:border-ink-700/70'

  const primary =
    'bg-brand-600 text-white hover:bg-brand-700 focus-visible:ring-brand-500 ' +
    'dark:bg-brand-500 dark:hover:bg-brand-600'

  const outline =
    'bg-transparent text-ink-900 dark:text-ink-100 border border-ink-300 dark:border-ink-700 ' +
    'hover:bg-ink-100/60 dark:hover:bg-ink-800/60'

  switch (variant) {
    case 'primary':
      return `${common} ${primary}`
    case 'outline':
      return `${common} ${outline}`
    default:
      return `${common} ${light}`
  }
}

const Button = React.forwardRef<any, BaseProps & { variant?: 'default'|'primary'|'outline'; className?: string }>(
  ({ asChild, className, variant = 'default', ...props }, ref) => {
    const Comp: any = asChild ? Slot : 'button'
    return <Comp ref={ref} className={clsx(baseClasses(variant), className)} {...props} />
  }
)
Button.displayName = 'Button'

export const PrimaryButton = React.forwardRef<any, Omit<BaseProps, 'variant'> & { className?: string }>(
  ({ asChild, className, ...props }, ref) => {
    const Comp: any = asChild ? Slot : 'button'
    return <Comp ref={ref} className={clsx(baseClasses('primary'), className)} {...props} />
  }
)
PrimaryButton.displayName = 'PrimaryButton'

export { Button }
