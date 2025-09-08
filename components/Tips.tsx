export function Tips({ country, region, size }: {country:string; region:string; size:number}) {
  const items = [
    "Aim for 3–6 months of expenses in your emergency fund.",
    region === "QC" ? "QC taxes run higher; consider automating savings on payday." : "If your region has lower taxes, boost retirement by +1–2%.",
    size > 2 ? "Larger households: lock in grocery budgets; bulk buys help." : "Solo? Try a 50/30/20 split as a starting point.",
  ]
  return (
    <aside className="card p-5">
      <div className="text-sm font-medium mb-2">Quick tips</div>
      <ul className="space-y-2 text-sm text-ink-700 dark:text-ink-200">
        {items.map((t,i)=> <li key={i}>• {t}</li>)}
      </ul>
    </aside>
  )
}
