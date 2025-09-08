// lib/auth.ts
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

type Creds = { email?: string; password?: string }

export const { handlers, auth, signIn, signOut } = NextAuth({
  // users/accounts still via DB, but session via JWT so no DB read/write loop
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: "/sign-in", // our custom UI
  },

  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    Credentials({
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(raw) {
        const { email, password } = (raw ?? {}) as Creds
        const e = email?.toLowerCase().trim()
        const p = password ?? ""
        if (!e || !p) return null

        const user = await prisma.user.findUnique({ where: { email: e } })
        if (!user?.passwordHash) return null

        const ok = await bcrypt.compare(p, user.passwordHash)
        if (!ok) return null

        return { id: user.id, name: user.name ?? undefined, email: user.email ?? undefined }
      },
    }),
  ],

  callbacks: {
    // put the user id into the JWT
    async jwt({ token, user }) {
      if (user?.id) token.uid = user.id
      return token
    },
    // and surface it on the session
    async session({ session, token }) {
      if (session.user && token?.uid) (session.user as any).id = token.uid
      return session
    },
  },
})
