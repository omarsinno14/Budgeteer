import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function PATCH(req: Request) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json().catch(() => ({} as any))
  const data: {
    name?: string
    phone?: string
    region?: string
    country?: string
  } = {}

  if (typeof body.name === 'string') data.name = body.name.trim()
  if (typeof body.phone === 'string') data.phone = body.phone.trim()
  if (typeof body.region === 'string') data.region = body.region.trim().toUpperCase()
  if (typeof body.country === 'string') data.country = body.country.trim().toUpperCase()

  const user = await prisma.user.update({
    where: { email: session.user.email! },
    data,
    select: { id: true },
  })

  return NextResponse.json({ ok: true, id: user.id })
}
