// Force Node runtime for Prisma
export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth' // <-- use auth() in v5

type Body = {
  sentiment: 'good' | 'aggressive' | 'conservative'
  recommendationId?: string
  userAdjustments?: Record<string, number>
  comment?: string
}

export async function POST(req: Request) {
  // NextAuth v5 way to get the session
  const session = await auth()

  // If not signed in, no-op (or return 401 if you prefer)
  if (!session?.user?.email) {
    return NextResponse.json({ ok: true })
    // return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = (await req.json()) as Body

  // If caller didn’t pass a recommendationId, use latest for this user
  let recId = body.recommendationId
  if (!recId) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    })
    if (!user) return NextResponse.json({ ok: true })

    const latest = await prisma.recommendation.findFirst({
      where: { plan: { household: { userId: user.id } } },
      orderBy: { createdAt: 'desc' },
      select: { id: true },
    })
    if (!latest) return NextResponse.json({ ok: true })
    recId = latest.id
  }

  const usefulness =
    body.sentiment === 'good' ? 5 :
    body.sentiment === 'aggressive' ? 2 : 3

  await prisma.feedback.create({
    data: {
      recommendationId: recId,
      usefulnessScore: usefulness,
      userAdjustments: body.userAdjustments,
      comment: body.comment,
    },
  })

  return NextResponse.json({ ok: true })
}
