import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const { name, email, message, phone, subject } = await request.json()

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
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
