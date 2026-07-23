"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import CustomCursor from "@/components/CustomCursor"

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: "", email: "", password: "", adminKey: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showAdmin, setShowAdmin] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (res.ok) { router.push("/login") }
      else { setError(data.error || "Something went wrong") }
    } catch { setError("Connection error") }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-white-soft flex items-center justify-center px-4 relative">
      <CustomCursor />
      <div className="w-full max-w-md relative z-10">
        <Link href="/" className="flex items-center justify-center gap-2 mb-10 no-underline">
          <span className="font-['Playfair_Display',serif] text-3xl font-bold text-brown-deep">
            WM<span className="text-gold italic">DUO</span>
          </span>
        </Link>

        <div className="bento-card bento-card--white !p-8 sm:!p-10">
          <div className="text-center mb-6">
            <span className="text-3xl mb-2 block">✦</span>
            <h1 className="font-['Playfair_Display',serif] text-2xl font-bold text-brown-deep">Create Account</h1>
            <p className="text-sm text-brown-mid mt-1">Join 12,000+ happy customers</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] font-semibold tracking-widest uppercase text-brown-mid block mb-1.5">Full Name</label>
              <input type="text" required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                className="w-full bg-white-soft border border-gold/10 rounded-xl px-4 py-3 text-sm text-brown-deep outline-none focus:border-gold/40 transition-all" placeholder="Your name" />
            </div>
            <div>
              <label className="text-[10px] font-semibold tracking-widest uppercase text-brown-mid block mb-1.5">Email</label>
              <input type="email" required value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                className="w-full bg-white-soft border border-gold/10 rounded-xl px-4 py-3 text-sm text-brown-deep outline-none focus:border-gold/40 transition-all" placeholder="you@example.com" />
            </div>
            <div>
              <label className="text-[10px] font-semibold tracking-widest uppercase text-brown-mid block mb-1.5">Password</label>
              <input type="password" required value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} minLength={8}
                className="w-full bg-white-soft border border-gold/10 rounded-xl px-4 py-3 text-sm text-brown-deep outline-none focus:border-gold/40 transition-all" placeholder="Min 8 characters" />
            </div>
            <div>
              <label className="flex items-center gap-2 cursor-pointer" onClick={() => setShowAdmin(!showAdmin)}>
                <input type="checkbox" checked={showAdmin} onChange={() => setShowAdmin(!showAdmin)} className="w-4 h-4 accent-gold" />
                <span className="text-xs text-brown-mid">Register as admin?</span>
              </label>
            </div>
            {showAdmin && (
              <div>
                <label className="text-[10px] font-semibold tracking-widest uppercase text-brown-mid block mb-1.5">Admin Key</label>
                <input type="password" value={form.adminKey} onChange={e => setForm(p => ({ ...p, adminKey: e.target.value }))}
                  className="w-full bg-white-soft border border-gold/10 rounded-xl px-4 py-3 text-sm text-brown-deep outline-none focus:border-gold/40 transition-all" placeholder="Enter admin secret key" />
              </div>
            )}
            <button type="submit" disabled={loading}
              className="btn-brown w-full text-center disabled:opacity-50">
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-brown-mid mt-6">
            Already have an account? <Link href="/login" className="text-gold font-semibold hover:underline">Sign In →</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
