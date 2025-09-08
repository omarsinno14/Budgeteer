import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  const { name, email, password } = await req.json()

  if (!email || !password) {
    return NextResponse.json({ message: 'Email and password required' }, { status: 400 })
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ message: 'User already exists' }, { status: 409 })
  }

  const passwordHash = await bcrypt.hash(password, 10)

  await prisma.user.create({
    data: {
      name: name || null,
      email,
      passwordHash,
    },
  })

  return NextResponse.json({ ok: true })
}
