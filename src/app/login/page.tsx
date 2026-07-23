"use client"
import { useState, Suspense } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import CustomCursor from "@/components/CustomCursor"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const rawCallback = searchParams?.get("callbackUrl") || "/"
  let callbackUrl = rawCallback
  try {
    const url = new URL(rawCallback, window.location.origin)
    if (url.origin !== window.location.origin) callbackUrl = "/"
  } catch {
    if (!rawCallback.startsWith("/")) callbackUrl = "/"
  }
  const adminKey = searchParams?.get("__admin") || ""

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const result = await signIn("credentials", { email, password, redirect: false })
      if (result?.error) {
        const msgs: Record<string, string> = {
          "CredentialsSignin": "Invalid email or password.",
          "Too many login attempts. Please try again in 60 seconds.": "Too many attempts. Please wait 60 seconds.",
        }
        setError(msgs[result.error] || result.error)
        setPassword("")
      } else {
        const { getSession } = await import("next-auth/react")
        let session: any = null
        for (let i = 0; i < 5; i++) { session = await getSession(); if (session) break; await new Promise(r => setTimeout(r, 200)) }
        if (callbackUrl.startsWith("/admin") && session?.user?.role !== "admin") {
          router.push("/"); router.refresh(); return
        }
        const redirectUrl = adminKey && callbackUrl.includes('/admin')
          ? `${callbackUrl}${callbackUrl.includes('?') ? '&' : '?'}__admin=${encodeURIComponent(adminKey)}`
          : callbackUrl
        router.push(redirectUrl); router.refresh()
      }
    } catch { setError("Connection error. Please try again.") }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-white-soft flex items-center justify-center px-4 relative">
      <CustomCursor />
      <div className="w-full max-w-md relative z-10">
        <Link href="/" className="flex items-center justify-center gap-2 mb-10 no-underline group">
          <span className="font-['Playfair_Display',serif] text-3xl font-bold text-brown-deep">
            WM<span className="text-gold italic">DUO</span>
          </span>
        </Link>

        <div className="bento-card bento-card--white !p-8 sm:!p-10">
          <div className="text-center mb-6">
            <span className="text-3xl mb-2 block">✦</span>
            <h1 className="font-['Playfair_Display',serif] text-2xl font-bold text-brown-deep">Welcome Back</h1>
            <p className="text-sm text-brown-mid mt-1">Sign in to your account</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-5 flex items-start gap-2">
              <span>!</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] font-semibold tracking-widest uppercase text-brown-mid block mb-1.5">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email"
                className="w-full bg-white-soft border border-gold/10 rounded-xl px-4 py-3 text-sm text-brown-deep placeholder-brown-light outline-none focus:border-gold/40 transition-all"
                placeholder="you@example.com" />
            </div>
            <div>
              <label className="text-[10px] font-semibold tracking-widest uppercase text-brown-mid block mb-1.5">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password"
                className="w-full bg-white-soft border border-gold/10 rounded-xl px-4 py-3 text-sm text-brown-deep placeholder-brown-light outline-none focus:border-gold/40 transition-all"
                placeholder="Enter your password" />
            </div>
            <div className="flex items-center justify-between text-xs">
              <Link href="/forgot-password" className="text-gold font-semibold hover:underline">Forgot Password?</Link>
            </div>
            <button type="submit" disabled={loading}
              className="btn-brown w-full text-center disabled:opacity-50">
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gold/10" /></div>
            <div className="relative flex justify-center"><span className="bg-white px-4 text-xs text-brown-mid">or</span></div>
          </div>

          <p className="text-center text-sm text-brown-mid">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-gold font-semibold hover:underline">Create Account →</Link>
          </p>
        </div>

        <p className="text-center mt-6"><Link href="/" className="text-xs text-brown-mid hover:text-gold transition-colors">← Back to Home</Link></p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white-soft flex items-center justify-center"><div className="animate-spin h-8 w-8 border-2 border-gold border-t-transparent rounded-full" /></div>}>
      <LoginForm />
    </Suspense>
  )
}
