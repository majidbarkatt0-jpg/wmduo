"use client"

import { useState } from "react"
import Link from "next/link"
import { Mail, ArrowRight, Shield, CheckCircle } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [devUrl, setDevUrl] = useState("")
  const [emailSent, setEmailSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()

      if (res.ok) {
        setSent(true)
        if (data.emailSent) {
          setEmailSent(true)
        }
        // In dev mode, show the reset URL for testing
        if (data.devUrl) {
          setDevUrl(data.devUrl)
        }
      } else {
        setError(data.error || "Something went wrong")
      }
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white-soft px-4">
        <div className="bento-card bento-card--white shadow-premium-xl p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-brown-mid/10 flex items-center justify-center mx-auto mb-5 border border-brown-mid/20">
            <CheckCircle className="w-8 h-8 text-brown-mid" />
          </div>
          <h1 className="font-['Playfair_Display',serif] text-2xl font-bold text-brown-deep mb-2">Check Your Email</h1>
          {emailSent ? (
            <>
              <p className="text-brown-mid text-sm mb-2">We sent a reset link to <strong className="text-brown-deep">{email}</strong></p>
              <p className="text-brown-mid text-xs mb-6">Link expires in 1 hour. Check spam folder if you don&apos;t see it.</p>
            </>
          ) : (
            <>
              <p className="text-brown-mid text-sm mb-4">Here&apos;s your password reset link:</p>
              {devUrl && (
                <div className="bg-white-soft border border-[#E8A94C]/30 rounded-xl p-4 mb-4">
                  <p className="text-[10px] text-[#E8A94C] font-semibold uppercase tracking-wider mb-2">⚠ Email Not Configured</p>
                  <p className="text-brown-mid text-xs mb-2">
                    Set <code className="text-[#E8A94C] bg-white-soft px-1 rounded">RESEND_API_KEY</code> in Vercel env vars for automatic emails.
                  </p>
                  <a href={devUrl} className="text-sm text-gold hover:underline font-medium break-all block">{devUrl}</a>
                </div>
              )}
            </>
          )}
          <Link href="/login" className="text-[#E8A94C] font-semibold hover:text-[#D48832] transition hover:underline">
            ← Back to Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white-soft relative overflow-hidden px-4">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D12] via-[#0D0D12] to-[#14141A]" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-gold/5 rounded-full blur-3xl animate-float" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#E8A94C]/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />

      <div className="w-full max-w-md relative z-10">
        <Link href="/" className="flex items-center justify-center gap-3 mb-10 group">
          <span className="text-4xl gradient-text font-bold group-hover:scale-110 transition-all duration-300">◈</span>
          <span className="text-3xl font-extrabold">
            <span className="text-brown-deep">WM</span>
            <span className="text-gold">DUO</span>
          </span>
        </Link>

        <div className="bento-card bento-card--white shadow-premium-xl p-8 sm:p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E8A94C] via-[#D4AF37] to-[#D4AF37]" />

          <div className="text-center mb-8">
            <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-[#D4AF37]/20">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="font-['Playfair_Display',serif] text-2xl font-bold text-brown-deep">Reset Password</h1>
            <p className="text-brown-mid text-sm mt-1.5">Enter your email and we&apos;ll send you a reset link</p>
          </div>

          {error && (
            <div className="bg-red-500/10 text-red-400 text-sm rounded-2xl px-5 py-4 mb-6 border border-red-500/20">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-brown-mid mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-mid" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-white-soft border border-gold/10 rounded-2xl focus:border-[#E8A94C] focus:ring-4 focus:ring-[#E8A94C]/10 outline-none transition-all text-sm text-brown-deep placeholder-brown-mid"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full gradient-bg text-black py-3.5 rounded-2xl font-bold text-base hover:shadow-xl hover:shadow-[#D4AF37]/20 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Sending...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Send Reset Link
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </form>

          <div className="text-center mt-6">
            <Link href="/login" className="text-sm text-[#E8A94C] font-semibold hover:text-[#D48832] transition hover:underline">
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
