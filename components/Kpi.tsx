import { PropsWithChildren } from "react"
export function Kpi({ label, value, children }: PropsWithChildren<{label:string,value:string}>) {
  return (
    <div className="card p-5 hover:shadow-xl transition flex items-center justify-between">
      <div>
        <div className="text-xs uppercase tracking-wide text-ink-500">{label}</div>
        <div className="text-2xl font-semibold">{value}</div>
      </div>
      {children}
    </div>
  )
}
