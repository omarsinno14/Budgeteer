export function MonthlyBars({ plan }: { plan: Record<string, number> }) {
  const monthly = Object.entries(plan).map(([k,v]) => [k, Math.round(v/12)]) as [string,number][]
  const max = Math.max(...monthly.map(([,v])=>v))
  return (
    <div className="card p-5">
      <div className="text-sm font-medium mb-3">Monthly breakdown</div>
      <div className="space-y-2">
        {monthly.map(([k,v]) => (
          <div key={k}>
            <div className="flex justify-between text-xs mb-1"><span>{k}</span><span>${v.toLocaleString()}</span></div>
            <div className="h-2 rounded-full bg-ink-200/60 overflow-hidden">
              <div className="h-full bg-brand-600" style={{ width: `${(v/max)*100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
