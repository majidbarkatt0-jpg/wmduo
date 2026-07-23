import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { checkRateLimit, getRateLimitKey } from "@/lib/rate-limit"

const tokenAttempts = new Map<string, number>()

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const rlKey = `reset-pw:${getRateLimitKey(request)}`
    const { allowed } = checkRateLimit(rlKey, { maxRequests: 10, windowMs: 60 * 1000 })
    if (!allowed) {
      return NextResponse.json({ error: "Too many attempts. Please try again later." }, { status: 429 })
    }

    const { token, password } = await request.json()

    const resetSchema = z.object({
      token: z.string().min(1, "Token is required"),
      password: z.string().min(8, "Password must be at least 8 characters"),
    })

    const validation = resetSchema.safeParse({ token, password })
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      )
    }

    // Per-token attempt tracking — invalidate after 5 failures
    const tokenKey = `reset-token:${token}`
    const attempts = tokenAttempts.get(tokenKey) || 0
    if (attempts >= 5) {
      return NextResponse.json({ error: "Too many attempts with this token. Request a new reset link." }, { status: 429 })
    }
    tokenAttempts.set(tokenKey, attempts + 1)

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    })

    if (!resetToken) {
      return NextResponse.json({ error: "Invalid or expired reset link" }, { status: 400 })
    }

    if (resetToken.used) {
      return NextResponse.json({ error: "This reset link has already been used" }, { status: 400 })
    }

    if (new Date() > resetToken.expiresAt) {
      return NextResponse.json({ error: "This reset link has expired" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { email: resetToken.email },
        data: { password: hashedPassword },
      })
      await tx.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { used: true },
      })
    })

    return NextResponse.json({ message: "Password reset successful. You can now log in." })
  } catch (error) {
    console.error("Reset password error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
