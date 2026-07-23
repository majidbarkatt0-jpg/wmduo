import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { checkRateLimit, getRateLimitKey } from "@/lib/rate-limit"

export async function POST(request: Request) {
  try {
    const rlKey = `contact:${getRateLimitKey(request)}`
    const { allowed, remaining, resetAt } = checkRateLimit(rlKey, { maxRequests: 3, windowMs: 60 * 1000 })
    if (!allowed) {
      return NextResponse.json({ error: "Too many messages. Please try again later." }, { 
        status: 429,
        headers: { "Retry-After": String(Math.ceil((resetAt - Date.now()) / 1000)) }
      })
    }

    const { name, email, message, phone, subject } = await request.json()

    const contactSchema = z.object({
      name: z.string().min(1, "Name is required").max(200),
      email: z.string().email("Invalid email address"),
      message: z.string().min(1, "Message is required").max(5000, "Message too long"),
      phone: z.string().regex(/^[\d\s\-\+\(\)]{7,20}$/).optional().nullable(),
      subject: z.string().max(200).optional().nullable(),
    })

    const validation = contactSchema.safeParse({ name, email, message, phone, subject })
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      )
    }

    await prisma.contactMessage.create({
      data: { name, email, message, phone, subject },
    })

    return NextResponse.json(
      { message: "Message sent successfully! We'll get back to you within 24 hours." },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}
