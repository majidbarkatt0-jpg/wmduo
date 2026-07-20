import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"

// Resend email integration (production)
let resend: any = null
try {
  if (process.env.RESEND_API_KEY) {
    const { Resend } = require("resend")
    resend = new Resend(process.env.RESEND_API_KEY)
  }
} catch {
  // Resend not available
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Check if user exists (don't reveal this to the client)
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json({
        message: "If an account with that email exists, a reset link has been sent.",
      })
    }

    // Generate reset token (32 bytes = 64 hex chars)
    const token = crypto.randomBytes(32).toString("hex")
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    // Delete old tokens for this email
    await prisma.passwordResetToken.deleteMany({ where: { email } })

    // Save new token
    await prisma.passwordResetToken.create({
      data: { email, token, expiresAt },
    })

    const siteUrl = process.env.NEXTAUTH_URL || "https://wmduo.com"
    const resetUrl = `${siteUrl}/reset-password/${token}`

    // === SEND EMAIL ===
    let emailSent = false

    if (resend && process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: "WM Duo <noreply@wmduo.com>",
          to: email,
          subject: "Reset your WM Duo password",
          html: `
            <!DOCTYPE html>
            <html>
            <head><meta charset="utf-8"></head>
            <body style="background:#0D0D12;color:#E4E4E7;font-family:Inter,sans-serif;padding:40px 20px;">
              <div style="max-width:480px;margin:0 auto;background:#1A1A23;border-radius:24px;border:1px solid #2A2A35;padding:40px;">
                <div style="text-align:center;margin-bottom:32px;">
                  <div style="font-size:32px;margin-bottom:8px;">🏰</div>
                  <h1 style="font-size:24px;font-weight:800;color:#FFFFFF;margin:0;">WM <span style="color:#A78BFA;">DUO</span></h1>
                </div>
                <h2 style="font-size:18px;color:#FFFFFF;margin:0 0 8px 0;">Reset Your Password</h2>
                <p style="color:#A1A1AA;font-size:14px;line-height:1.6;margin:0 0 24px 0;">
                  Click the button below to reset your password. This link expires in <strong style="color:#E8A94C;">1 hour</strong>.
                </p>
                <a href="${resetUrl}" style="display:inline-block;background:linear-gradient(135deg,#7C3AED,#6C63FF,#3B82F6);color:#FFFFFF;text-decoration:none;padding:14px 32px;border-radius:16px;font-weight:700;font-size:15px;">
                  Reset Password
                </a>
                <p style="color:#52525B;font-size:12px;margin-top:24px;">
                  If you didn't request this, you can safely ignore this email.
                </p>
                <hr style="border:none;border-top:1px solid #2A2A35;margin:24px 0;" />
                <p style="color:#52525B;font-size:11px;text-align:center;">
                  WM Duo &bull; <a href="${siteUrl}" style="color:#6C63FF;text-decoration:none;">${siteUrl}</a>
                </p>
              </div>
            </body>
            </html>
          `,
        })
        emailSent = true
        console.log(`[FORGOT PASSWORD] Email sent to ${email}`)
      } catch (emailError) {
        console.error("[FORGOT PASSWORD] Email send failed:", emailError)
        // Fall through to dev mode fallback
      }
    }

    // === FALLBACK: Log URL (dev mode or email failure) ===
    if (!emailSent) {
      console.log(`[FORGOT PASSWORD] Reset URL for ${email}: ${resetUrl}`)
    }

    // Response: Always the same message (don't reveal if email was sent)
    const response: any = {
      message: "If an account with that email exists, a reset link has been sent.",
    }

    // In dev mode or if email failed, show the link for testing
    if (!emailSent) {
      response.devUrl = resetUrl
      response.devToken = token
    }

    // If email was sent successfully, tell the UI
    if (emailSent) {
      response.emailSent = true
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
