"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Lock, Eye, EyeOff, ArrowRight, Shield, CheckCircle, AlertCircle } from "lucide-react"

export default function ResetPasswordPage() {
  const params = useParams()
  const router = useRouter()
  const token = params.token as string

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters")
      setStatus("error")
      return
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match")
      setStatus("error")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      })
      const data = await res.json()

      if (res.ok) {
        setStatus("success")
        setMessage("Password reset successful!")
      } else {
        setStatus("error")
        setMessage(data.error || "Something went wrong")
      }
    } catch {
      setStatus("error")
      setMessage("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D0D12] px-4">
        <div className="bg-[#1A1A23] rounded-3xl shadow-premium-xl border border-[#2A2A35] p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-[#34D399]/10 flex items-center justify-center mx-auto mb-5 border border-[#34D399]/20">
            <CheckCircle className="w-8 h-8 text-[#34D399]" />
          </div>
          <h1 className="font-['Playfair_Display',serif] text-2xl font-bold text-white mb-2">Password Reset!</h1>
          <p className="text-[#A1A1AA] text-sm mb-6">Your password has been updated successfully.</p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 gradient-bg text-white px-8 py-3.5 rounded-2xl font-bold text-base hover:shadow-xl hover:shadow-[#7C3AED]/20 transition-all"
          >
            Sign In Now
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D0D12] relative overflow-hidden px-4">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D12] via-[#0D0D12] to-[#14141A]" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#6C63FF]/5 rounded-full blur-3xl animate-float" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#E8A94C]/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />

      <div className="w-full max-w-md relative z-10">
        <Link href="/" className="flex items-center justify-center gap-3 mb-10 group">
          <span className="text-4xl gradient-text font-bold group-hover:scale-110 transition-all">◈</span>
          <span className="text-3xl font-extrabold">
            <span className="text-white">WM</span>
            <span className="text-[#A78BFA]">DUO</span>
          </span>
        </Link>

        <div className="bg-[#1A1A23] rounded-3xl shadow-premium-xl border border-[#2A2A35] p-8 sm:p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E8A94C] via-[#6C63FF] to-[#7C3AED]" />

          <div className="text-center mb-8">
            <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-[#7C3AED]/20">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="font-['Playfair_Display',serif] text-2xl font-bold text-white">Set New Password</h1>
            <p className="text-[#A1A1AA] text-sm mt-1.5">Enter your new password below</p>
          </div>

          {status === "error" && (
            <div className="bg-red-500/10 text-red-400 text-sm rounded-2xl px-5 py-4 mb-6 border border-red-500/20 flex items-start gap-3">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-[#E4E4E7] mb-1.5">New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#52525B]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full pl-11 pr-11 py-3 bg-[#0D0D12] border border-[#2A2A35] rounded-2xl focus:border-[#E8A94C] focus:ring-4 focus:ring-[#E8A94C]/10 outline-none transition-all text-sm text-white placeholder-[#52525B]"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#52525B] hover:text-[#A1A1AA] transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#E4E4E7] mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#52525B]" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full pl-11 pr-4 py-3 bg-[#0D0D12] border border-[#2A2A35] rounded-2xl focus:border-[#E8A94C] focus:ring-4 focus:ring-[#E8A94C]/10 outline-none transition-all text-sm text-white placeholder-[#52525B]"
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full gradient-bg text-white py-3.5 rounded-2xl font-bold text-base hover:shadow-xl hover:shadow-[#7C3AED]/20 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Resetting...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Reset Password
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
