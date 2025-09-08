import Link from 'next/link'
import { ArrowRight } from 'lucide-react'


export default function Landing(){
return (
<div className="grid md:grid-cols-2 gap-10 items-center">
<div className="space-y-6">
<h1 className="text-5xl font-semibold leading-tight">Budget smarter. <span className="text-brand-600">Live calmer.</span></h1>
<p className="text-ink-600 dark:text-ink-300 text-lg">Estimate your net income, get a plan tailored to your region & household, and fine‑tune it with your feedback.</p>
<div className="flex gap-3">
<Link href="/dashboard" className="btn btn-primary">Try the Demo <ArrowRight size={16}/></Link>
<Link href="/api/auth/signin" className="btn btn-outline">Sign in</Link>
</div>
</div>
<div className="card p-8">
<h3 className="text-xl font-medium mb-4">What you’ll see</h3>
<ul className="space-y-3 text-ink-700 dark:text-ink-200">
<li>• Clean inputs for income, region, and household</li>
<li>• A beautiful budget breakdown with animations</li>
<li>• Instant feedback buttons to personalize guidance</li>
</ul>
</div>
</div>
)
}