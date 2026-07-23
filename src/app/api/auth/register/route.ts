import crypto from "crypto"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { checkRateLimit, getRateLimitKey } from "@/lib/rate-limit"

export async function POST(request: Request) {
  try {
    const { name, email: rawEmail, password, adminKey } = await request.json()
    const email = rawEmail?.toLowerCase().trim() // ✅ Normalize email to lowercase

    // Validate FIRST before rate limiting, so users get proper validation errors
    const registerSchema = z.object({
      name: z.string().min(1, "Name is required").max(100),
      email: z.string().email("Valid email is required"),
      password: z.string().min(8, "Password must be at least 8 characters"),
      adminKey: z.string().optional(),
    })

    const validation = registerSchema.safeParse({ name, email, password, adminKey })
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      )
    }

    // Rate limit AFTER validation (prevent wasting attempts on bad data)
    const rlKey = `register:${getRateLimitKey(request)}`
    const { allowed, resetAt } = checkRateLimit(rlKey, { maxRequests: 5, windowMs: 60 * 1000 })
    if (!allowed) {
      return NextResponse.json({ error: "Too many attempts. Please try again later." }, { 
        status: 429,
        headers: { "Retry-After": String(Math.ceil((resetAt - Date.now()) / 1000)) }
      })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json(
        { error: "If the email is available, an account has been created." },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    // 🔐 ADMIN VERIFICATION: Use timing-safe comparison to prevent brute-force
    const adminSecret = process.env.ADMIN_SECRET_KEY
    let role = "user"
    if (adminKey && adminSecret) {
      // Timing-safe comparison to prevent character-by-character brute force
      const buf1 = Buffer.from(adminKey)
      const buf2 = Buffer.from(adminSecret)
      const safeEqual = buf1.length === buf2.length && crypto.timingSafeEqual(buf1, buf2)
      if (safeEqual) role = "admin"
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    })

    return NextResponse.json(
      { message: "User created successfully", user },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}
