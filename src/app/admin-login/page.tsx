"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Shield, ArrowRight, Lock, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

export default function AdminLoginPage() {
  const router = useRouter()
  const [adminPath, setAdminPath] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPath, setShowPath] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!adminPath.trim()) {
      setError("Please enter the admin access key")
      return
    }

    setLoading(true)

    // Try to access admin dashboard with the provided key
    // Middleware will verify the key via the __admin query param
    const encodedPath = encodeURIComponent(adminPath.trim())
    const testUrl = `/admin/dashboard?__admin=${encodedPath}`

    // Redirect — middleware will handle verification
    // If wrong, middleware returns 404
    router.push(testUrl)
  }

  return (
    <div className="min-h-screen bg-[#0D0D12] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D12] via-[#0D0D12] to-[#14141A]" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-3 mb-10 group">
          <span className="text-4xl gradient-text font-bold group-hover:scale-110 transition-all">◈</span>
          <span className="text-3xl font-extrabold">
            <span className="text-white">WM</span>
            <span className="text-[#A78BFA]">DUO</span>
          </span>
        </Link>

        <div className="bg-[#1A1A23] rounded-3xl border border-[#2A2A35] p-8 sm:p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#6C63FF] via-[#7C3AED] to-[#3B82F6]" />

          <div className="text-center mb-8">
            <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-[#7C3AED]/20">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Access</h1>
            <p className="text-[#A1A1AA] text-sm mt-1.5">
              Enter your admin secret path to access the control panel
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 text-red-400 text-sm rounded-2xl px-5 py-4 mb-6 border border-red-500/20 flex items-start gap-3">
              <span className="text-lg leading-none mt-0.5">!</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-[#E4E4E7] mb-1.5">
                Admin Secret Path
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#52525B] group-focus-within:text-[#7C3AED] transition-colors" />
                <input
                  type={showPath ? "text" : "password"}
                  value={adminPath}
                  onChange={e => setAdminPath(e.target.value)}
                  required
                  placeholder="Enter admin secret path"
                  autoFocus
                  className="w-full pl-11 pr-11 py-3 bg-[#0D0D12] border border-[#2A2A35] rounded-2xl focus:border-[#7C3AED] focus:ring-4 focus:ring-[#7C3AED]/10 outline-none transition-all text-sm text-white placeholder-[#52525B]"
                />
                <button
                  type="button"
                  onClick={() => setShowPath(!showPath)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#52525B] hover:text-[#A1A1AA] transition-colors"
                  tabIndex={-1}
                >
                  {showPath ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10px] text-[#52525B] mt-2">
                This is the secret path configured in your .env file. If you don&apos;t know it, contact your site administrator.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full gradient-bg text-black py-3.5 rounded-2xl font-bold text-base hover:shadow-xl hover:shadow-[#7C3AED]/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Verifying...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Access Admin Panel
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#2A2A35] text-center">
            <Link href="/" className="text-xs text-[#52525B] hover:text-[#A1A1AA] transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>

        <p className="text-center text-[10px] text-[#2A2A35] mt-6">
          Authorized personnel only. Unauthorized access is prohibited.
        </p>
      </div>
    </div>
  )
}
