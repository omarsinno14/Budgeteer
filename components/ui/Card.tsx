import { PropsWithChildren } from 'react'
import { clsx } from 'clsx'


export function Card({ children, className }: PropsWithChildren<{ className?: string }>) {
return <div className={clsx('card p-6 hover:shadow-xl transition', className)}>{children}</div>
}