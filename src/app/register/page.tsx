"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, Shield, Sparkles } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Registration failed")
      router.push("/login?registered=true")
    } catch (err: any) {
      setError(err.message)
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D0D12] relative overflow-hidden px-4">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D12] via-[#0D0D12] to-[#14141A]" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#6C63FF]/5 rounded-full blur-3xl animate-float" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#E8A94C]/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />

      <div className="w-full max-w-md relative z-10">
        <Link href="/" className="flex items-center justify-center gap-3 mb-10 group">
          <span className="text-4xl gradient-text font-bold group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">◈</span>
          <span className="text-3xl font-extrabold tracking-tight">
            <span className="text-white">WM</span>
            <span className="text-[#A78BFA]">DUO</span>
          </span>
        </Link>

        <div className="bg-[#1A1A23] rounded-3xl shadow-premium-xl border border-[#2A2A35] p-8 sm:p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E8A94C] via-[#6C63FF] to-[#7C3AED]" />

          <div className="text-center mb-8">
            <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-[#7C3AED]/20">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="font-['Playfair_Display',serif] text-2xl font-bold text-white">Create Account</h1>
            <p className="text-[#A1A1AA] text-sm mt-1.5">Join 12,000+ CastleView customers</p>
          </div>

          {error && (
            <div className="bg-red-500/10 backdrop-blur-sm text-red-400 text-sm rounded-2xl px-5 py-4 mb-6 border border-red-500/20">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-[#E4E4E7] mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#52525B]" />
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-[#0D0D12] border border-[#2A2A35] rounded-2xl focus:border-[#E8A94C] focus:ring-4 focus:ring-[#E8A94C]/10 outline-none transition-all text-sm text-white placeholder-[#52525B]"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#E4E4E7] mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#52525B]" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-[#0D0D12] border border-[#2A2A35] rounded-2xl focus:border-[#E8A94C] focus:ring-4 focus:ring-[#E8A94C]/10 outline-none transition-all text-sm text-white placeholder-[#52525B]"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#E4E4E7] mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#52525B]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full pl-11 pr-11 py-3 bg-[#0D0D12] border border-[#2A2A35] rounded-2xl focus:border-[#E8A94C] focus:ring-4 focus:ring-[#E8A94C]/10 outline-none transition-all text-sm text-white placeholder-[#52525B]"
                  placeholder="Min 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#52525B] hover:text-[#A1A1AA] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full gradient-bg text-white py-3.5 rounded-2xl font-bold text-base hover:shadow-xl hover:shadow-[#7C3AED]/20 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              {loading ? (
                <span className="flex items-center gap-2 relative z-10">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating account...
                </span>
              ) : (
                <span className="flex items-center gap-2 relative z-10">
                  Create Account
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#2A2A35]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#1A1A23] px-4 text-[#52525B]">or</span>
            </div>
          </div>

          <p className="text-center text-sm text-[#A1A1AA]">
            Already have an account?{" "}
            <Link href="/login" className="text-[#E8A94C] font-semibold hover:text-[#D48832] transition-colors hover:underline">
              Sign In →
            </Link>
          </p>
        </div>

        <p className="text-center mt-6">
          <Link href="/" className="text-xs text-[#52525B] hover:text-[#A1A1AA] transition-colors">
            ← Back to Home
          </Link>
        </p>
      </div>
    </div>
  )
}
