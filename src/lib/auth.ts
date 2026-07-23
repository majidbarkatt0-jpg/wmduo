import { NextAuthOptions, User } from "next-auth"
import { JWT } from "next-auth/jwt"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "./prisma"

// 🔐 Rate limiter for login brute force protection
const loginAttempts = new Map<string, { count: number; resetAt: number }>()

function checkLoginRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = loginAttempts.get(ip)

  if (!entry || entry.resetAt < now) {
    loginAttempts.set(ip, { count: 1, resetAt: now + 60_000 })
    return true
  }

  if (entry.count >= 5) {
    return false
  }

  entry.count++
  return true
}

// Extend the built-in types
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
  interface User {
    role: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required")
        }

        // 🔒 Rate limit: 5 attempts per minute per IP
        // Use x-real-ip (Vercel) or CF-Connecting-IP (Cloudflare) — these are set by proxies
        // x-forwarded-for can be spoofed by clients, use with caution
        const headers = typeof req === 'object' && req ? req.headers || {} : {}
        const ip = 
          headers['cf-connecting-ip']?.toString() ||
          headers['x-real-ip']?.toString() ||
          headers['x-forwarded-for']?.toString().split(',')[0]?.trim() ||
          'unknown'
        
        if (!checkLoginRateLimit(ip)) {
          throw new Error("Too many login attempts. Please try again in 60 seconds.")
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user) {
          throw new Error("No user found with this email")
        }

        const isValid = await bcrypt.compare(credentials.password, user.password)
        if (!isValid) {
          throw new Error("Invalid password")
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        } as User
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
        session.user.role = token.role
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  // Dynamically set NEXTAUTH_URL so both local dev and Vercel work
  // Vercel sets VERCEL_URL automatically; local dev uses the env var or falls back
  secret: process.env.NEXTAUTH_SECRET,
  useSecureCookies: process.env.VERCEL === "1" || process.env.NODE_ENV === "production",
  cookies: {
    sessionToken: {
      name: process.env.VERCEL === "1" || process.env.NODE_ENV === "production"
        ? "__Secure-next-auth.session-token"
        : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.VERCEL === "1" || process.env.NODE_ENV === "production",
      },
    },
  },
}
