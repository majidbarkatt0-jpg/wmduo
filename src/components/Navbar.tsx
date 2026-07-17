"use client"

import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { Menu, X, ShoppingBag, User, LogOut, LayoutDashboard } from "lucide-react"

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { data: session } = useSession()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav className={`fixed top-[72px] sm:top-[38px] left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-white/95 backdrop-blur-md shadow-sm py-2" : "bg-white/95 backdrop-blur-md py-4"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl gradient-text font-bold">◈</span>
          <span className="text-xl font-extrabold text-gray-900">
            WM<span className="text-primary">DUO</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/#products" className="text-sm font-medium text-gray-600 hover:text-primary transition">CastleView</Link>
          <Link href="/#features" className="text-sm font-medium text-gray-600 hover:text-primary transition">Why Us</Link>
          <Link href="/#reviews" className="text-sm font-medium text-gray-600 hover:text-primary transition">Reviews</Link>
          <Link href="/#faq" className="text-sm font-medium text-gray-600 hover:text-primary transition">FAQ</Link>
          <Link href="/#contact" className="text-sm font-medium text-gray-600 hover:text-primary transition">Contact</Link>

          {session ? (
            <div className="flex items-center gap-3">
              {(session.user as any)?.role === "admin" && (
                <Link href="/admin/dashboard" className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark transition">
                  <LayoutDashboard className="w-4 h-4" />
                  Admin
                </Link>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <User className="w-4 h-4" />
                {session.user?.name}
              </div>
              <button onClick={() => signOut()} className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 transition">
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          ) : (
            <Link href="/login" className="gradient-bg text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all">
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t shadow-lg absolute top-full left-0 right-0 p-6 flex flex-col gap-4">
          <Link href="/#products" onClick={() => setMobileOpen(false)} className="text-gray-700 font-medium">CastleView</Link>
          <Link href="/#features" onClick={() => setMobileOpen(false)} className="text-gray-700 font-medium">Why Us</Link>
          <Link href="/#reviews" onClick={() => setMobileOpen(false)} className="text-gray-700 font-medium">Reviews</Link>
          <Link href="/#faq" onClick={() => setMobileOpen(false)} className="text-gray-700 font-medium">FAQ</Link>
          <Link href="/#contact" onClick={() => setMobileOpen(false)} className="text-gray-700 font-medium">Contact</Link>
          <hr />
          {session ? (
            <>
              {(session.user as any)?.role === "admin" && (
                <Link href="/admin/dashboard" onClick={() => setMobileOpen(false)} className="text-primary font-medium">Admin Dashboard</Link>
              )}
              <button onClick={() => signOut()} className="text-red-500 font-medium text-left">Logout</button>
            </>
          ) : (
            <Link href="/login" onClick={() => setMobileOpen(false)} className="gradient-bg text-white px-5 py-3 rounded-xl text-center font-semibold">Sign In</Link>
          )}
        </div>
      )}
    </nav>
  )
}
