'use client'
type Props = { label: string; value: number; goal: number }
export function GoalRing({ label, value, goal }: Props) {
  const pct = Math.max(0, Math.min(100, Math.round((value/goal)*100 || 0)))
  const r = 42, c = 2 * Math.PI * r, dash = (pct/100)*c
  return (
    <div className="card p-5 flex items-center gap-4">
      <svg width="110" height="110" viewBox="0 0 110 110">
        <circle cx="55" cy="55" r={r} stroke="rgba(99,102,241,.15)" strokeWidth="10" fill="none"/>
        <circle cx="55" cy="55" r={r} stroke="currentColor" strokeWidth="10" fill="none"
          strokeDasharray={`${dash} ${c-dash}`} transform="rotate(-90 55 55)"/>
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className="fill-ink-800 dark:fill-ink-100 text-sm">{pct}%</text>
      </svg>
      <div>
        <div className="text-sm text-ink-500">{label}</div>
        <div className="font-semibold">${value.toLocaleString()} <span className="text-ink-500">/ ${goal.toLocaleString()}</span></div>
      </div>
    </div>
  )
}
