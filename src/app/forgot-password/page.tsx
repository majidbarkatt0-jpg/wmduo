"use client"

import { useState } from "react"
import Link from "next/link"
import { Mail, ArrowRight, CheckCircle } from "lucide-react"
import ParticleBackground from "@/components/ParticleBackground"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Simulate sending reset email (backend implementation later)
    setTimeout(() => {
      setSent(true)
      setLoading(false)
    }, 1500)
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFE] relative overflow-hidden px-4">
        <ParticleBackground count={20} speed={0.1} />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-green-200/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl" />
        </div>
        <div className="glass-light rounded-3xl shadow-xl p-10 max-w-md w-full text-center border relative">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Check Your Email</h2>
          <p className="text-gray-500 mb-2">
            We&apos;ve sent a password reset link to <strong className="text-gray-800">{email}</strong>
          </p>
          <p className="text-xs text-gray-400 mb-6">Didn&apos;t receive it? Check your spam folder or try again.</p>
          <Link href="/login" className="gradient-bg text-white px-6 py-3 rounded-2xl font-semibold inline-block hover:shadow-lg transition-all">
            Back to Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFE] relative overflow-hidden px-4">
      <ParticleBackground count={20} speed={0.1} />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        <Link href="/" className="flex items-center justify-center gap-3 mb-10 group">
          <span className="text-4xl gradient-text font-bold group-hover:scale-110 transition-transform duration-300">◈</span>
          <span className="text-3xl font-extrabold tracking-tight">
            <span className="text-gray-900">WM</span>
            <span className="text-primary">DUO</span>
          </span>
        </Link>

        <div className="glass-light rounded-3xl shadow-xl shadow-purple-100/50 p-8 sm:p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-blue-500 to-pink-500" />

          <div className="text-center mb-8">
            <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-purple-200/50">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-black text-gray-900">Reset Password</h1>
            <p className="text-gray-500 text-sm mt-1.5">Enter your email and we&apos;ll send you a reset link</p>
          </div>

          {error && (
            <div className="bg-red-50/80 text-red-600 text-sm rounded-2xl px-5 py-4 mb-6 border border-red-100 flex items-start gap-3">
              <span className="text-lg leading-none mt-0.5">⚠️</span>
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-white/80 border border-gray-200 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full gradient-bg text-white py-3.5 rounded-2xl font-bold text-base hover:shadow-xl hover:shadow-purple-200/50 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 group"
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

          <p className="text-center text-sm text-gray-500 mt-6">
            Remember your password?{" "}
            <Link href="/login" className="text-primary font-semibold hover:text-primary-dark transition-colors">
              Sign In →
            </Link>
          </p>
        </div>

        <p className="text-center mt-6">
          <Link href="/" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
            ← Back to Home
          </Link>
        </p>
      </div>
    </div>
  )
}
