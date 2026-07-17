"use client"

import { useSession } from "next-auth/react"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"
import { LayoutDashboard, ShoppingBag, Package, LogOut, Home, ChevronRight, Menu, X } from "lucide-react"
import { SessionProvider } from "next-auth/react"
import { useState } from "react"

function AdminSidebar({ onNavClick }: { onNavClick?: () => void }) {
  const pathname = usePathname()

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
    { href: "/admin/products", label: "Products", icon: Package },
  ]

  return (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="p-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-3 group">
          <span className="text-2xl gradient-text font-bold group-hover:scale-110 transition-transform">◈</span>
          <div>
            <span className="text-lg font-extrabold text-white">
              WM<span className="text-primary">DUO</span>
            </span>
            <p className="text-[10px] text-white/40 tracking-widest uppercase">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(item => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavClick}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? "gradient-bg text-white shadow-lg shadow-purple-500/20"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
              {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <Link
          href="/"
          onClick={onNavClick}
          className="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm text-white/40 hover:text-white hover:bg-white/5 transition-all duration-200"
        >
          <Home className="w-4 h-4" />
          View Site
        </Link>
        <Link
          href="/login"
          onClick={() => { if (onNavClick) onNavClick(); fetch("/api/auth/signout", { method: "POST" }) }}
          className="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </Link>
      </div>
    </div>
  )
}

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#0F0F1A] flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/40 text-sm">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!session) return null

  const isAdmin = (session.user as any)?.role === "admin"

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#0F0F1A] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <LogOut className="w-10 h-10 text-red-400" />
          </div>
          <h1 className="text-2xl font-black text-white mb-2">Access Denied</h1>
          <p className="text-white/40 mb-6">You don&apos;t have admin privileges.</p>
          <Link href="/" className="gradient-bg text-white px-6 py-3 rounded-2xl font-semibold inline-block hover:shadow-lg transition-all">
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0F0F1A] flex">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-[#1A1A2E] border-r border-white/5 hidden lg:flex flex-col">
        <AdminSidebar />
      </aside>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-[#1A1A2E] border-r border-white/5 animate-fade-in-up">
            <div className="flex justify-end p-4">
              <button onClick={() => setMobileMenuOpen(false)} className="text-white/40 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <AdminSidebar onNavClick={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="bg-[#1A1A2E]/80 backdrop-blur-xl border-b border-white/5 px-4 sm:px-8 py-4 flex items-center justify-between lg:justify-end">
          <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden text-white/40 hover:text-white">
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-white">{(session.user as any)?.name || "Admin"}</p>
              <p className="text-xs text-white/40">{(session.user as any)?.email}</p>
            </div>
            <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-purple-500/20">
              {((session.user as any)?.name || "A").charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  )
}

export default function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </SessionProvider>
  )
}
