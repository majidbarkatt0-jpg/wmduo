import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"
import { checkRateLimit, getRateLimitKey } from "@/lib/rate-limit"

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
    const rlKey = `forgot-password:${getRateLimitKey(request)}`
    const { allowed, remaining, resetAt } = checkRateLimit(rlKey, { maxRequests: 3, windowMs: 60 * 60 * 1000 })
    if (!allowed) {
      return NextResponse.json({ error: "Too many attempts. Please try again later." }, { 
        status: 429,
        headers: { "Retry-After": String(Math.ceil((resetAt - Date.now()) / 1000)) }
      })
    }

    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Email-based rate limit: max 5 reset requests per day per email
    const emailRlKey = `forgot-password-email:${email.toLowerCase()}`
    const { allowed: emailAllowed, resetAt: emailResetAt } = checkRateLimit(emailRlKey, { maxRequests: 5, windowMs: 24 * 60 * 60 * 1000 })
    if (!emailAllowed) {
      return NextResponse.json({ error: "Too many requests for this email. Try again tomorrow." }, { 
        status: 429,
        headers: { "Retry-After": String(Math.ceil((emailResetAt - Date.now()) / 1000)) }
      })
    }

    // Check if user exists (don't reveal this to the client)
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      // Still do token operations to prevent timing-based user enumeration
      const dummyToken = crypto.randomBytes(32).toString("hex")
      await prisma.passwordResetToken.deleteMany({ where: { email } })
      await prisma.passwordResetToken.create({
        data: { email, token: dummyToken, expiresAt: new Date(Date.now() + 60 * 60 * 1000) },
      })
      return NextResponse.json({
        message: "If an account with that email exists, a reset link has been sent.",
      })
    }

    // Artificial delay to prevent timing-based user enumeration
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200))

    // Generate reset token (32 bytes = 64 hex chars)
    const token = crypto.randomBytes(32).toString("hex")
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    // Delete old tokens for this email
    await prisma.passwordResetToken.deleteMany({ where: { email } })

    // Save new token
    await prisma.passwordResetToken.create({
      data: { email, token, expiresAt },
    })

    let siteUrl = process.env.NEXTAUTH_URL || "https://wmduo.com"

    // Guard against a misconfigured env var where the value accidentally
    // includes its own key, e.g. NEXTAUTH_URL="NEXTAUTH_URL=https://..."
    if (!/^https?:\/\//.test(siteUrl)) {
      const match = siteUrl.match(/https?:\/\/.+/)
      if (match) {
        console.error(`[FORGOT PASSWORD] NEXTAUTH_URL was malformed ("${siteUrl}") — extracted "${match[0]}". Fix the env var.`)
        siteUrl = match[0]
      } else {
        console.error(`[FORGOT PASSWORD] NEXTAUTH_URL is invalid ("${siteUrl}") — falling back to default.`)
        siteUrl = "https://wmduo.com"
      }
    }

    const resetUrl = `${siteUrl}/reset-password/${token}`

    const textBody = `Reset your WM Duo password

Click the link below to reset your password. This link expires in 1 hour.

${resetUrl}

If you didn't request this, ignore this email.`

    // === SEND EMAIL ===
    let emailSent = false

    if (resend && process.env.RESEND_API_KEY) {
      try {
        const { data, error } = await resend.emails.send({
          from: "WM Duo <hello@wmduo.com>",
          to: email,
          subject: "Reset your WM Duo password",
          text: textBody,
          html: `<div style="background:#0D0D12;padding:30px 15px;font-family:Helvetica,Arial,sans-serif;">
  <div style="max-width:460px;margin:0 auto;background:#1A1A23;border-radius:20px;padding:35px 25px;text-align:center;">
    <div style="font-size:36px;margin-bottom:10px;">🏰</div>
    <h1 style="font-size:24px;font-weight:800;color:#fff;margin:0 0 20px 0;">WM DUO</h1>
    <h2 style="font-size:18px;font-weight:700;color:#fff;margin:0 0 10px 0;">Reset Your Password</h2>
    <p style="font-size:14px;color:#A1A1AA;line-height:1.5;margin:0 0 25px 0;">
      Click the button below to reset your password.<br/>
      This link expires in <strong style="color:#E8A94C;">1 hour</strong>.
    </p>
    <a href="${resetUrl}" target="_blank" style="display:inline-block;background:#7C3AED;color:#fff;text-decoration:none;padding:15px 40px;border-radius:12px;font-size:16px;font-weight:bold;">Reset Password</a>
    <p style="font-size:13px;color:#52525B;margin:25px 0 0 0;">
      Button not working? Copy this link into your browser:<br/>
      <a href="${resetUrl}" target="_blank" style="color:#6C63FF;font-size:12px;word-break:break-all;">${resetUrl}</a>
    </p>
    <hr style="border:none;border-top:1px solid #2A2A35;margin:25px 0;" />
    <p style="font-size:11px;color:#52525B;margin:0;">WM Duo &bull; <a href="${siteUrl}" style="color:#6C63FF;text-decoration:none;">${siteUrl}</a></p>
    <p style="font-size:11px;color:#52525B;margin:5px 0 0 0;">If you didn't request this, ignore this email.</p>
  </div>
</div>`,
        })

        if (error) {
          console.error("[FORGOT PASSWORD] Resend API error:", error)
          emailSent = false
        } else {
          emailSent = true
        }
      } catch (emailError) {
        console.error("[FORGOT PASSWORD] Email send threw:", emailError)
      }
    }

    const response: any = {
      message: "If an account with that email exists, a reset link has been sent.",
    }

    // 🔒 Only return dev URL in development — NEVER in production
    if (!emailSent && process.env.NODE_ENV !== 'production') {
      response.devUrl = resetUrl
    }

    if (emailSent) {
      response.emailSent = true
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
