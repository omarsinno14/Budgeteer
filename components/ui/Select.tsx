import { SelectHTMLAttributes } from 'react'
import { clsx } from 'clsx'


export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
return <select className={clsx('input', className)} {...props}>{children}</select>
}