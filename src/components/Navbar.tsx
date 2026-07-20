"use client"

import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { Menu, X, ShoppingCart, User, LogOut, LayoutDashboard, Package, Store } from "lucide-react"
import { useCart } from "@/context/CartContext"

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { data: session } = useSession()
  const { itemCount } = useCart()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav className={`fixed top-[72px] sm:top-[38px] left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? "bg-[#0D0D12]/95 backdrop-blur-md shadow-premium py-2 border-b border-[#2A2A35]"
        : "bg-[#0D0D12]/80 backdrop-blur-md py-4"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <img 
            src="https://cdn.shopify.com/s/files/1/0740/3867/3559/t/1/assets/wmduo-logo.png?v=1784536181" 
            alt="WM Duo" 
            className="h-9 w-auto"
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/products" className="text-sm font-medium text-[#A1A1AA] hover:text-[#E8A94C] transition flex items-center gap-1">
            <Store className="w-3.5 h-3.5" />
            Shop
          </Link>
          <Link href="/products" className="text-sm font-medium text-[#A1A1AA] hover:text-[#E8A94C] transition">All Products</Link>
          <Link href="/#reviews" className="text-sm font-medium text-[#A1A1AA] hover:text-[#E8A94C] transition">Reviews</Link>
          <Link href="/#faq" className="text-sm font-medium text-[#A1A1AA] hover:text-[#E8A94C] transition">FAQ</Link>
          <Link href="/#contact" className="text-sm font-medium text-[#A1A1AA] hover:text-[#E8A94C] transition">Contact</Link>

          {/* Cart Icon with Badge */}
          <Link
            href="/cart"
            className="hidden md:flex items-center gap-1.5 text-sm font-medium text-[#A1A1AA] hover:text-[#E8A94C] transition relative"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden lg:inline">Cart</span>
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#E8A94C] text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </Link>

          {session ? (
            <div className="flex items-center gap-3">
              <Link
                href="/orders"
                className="flex items-center gap-1 text-sm font-medium text-[#A1A1AA] hover:text-[#E8A94C] transition"
              >
                <Package className="w-4 h-4" />
                <span className="hidden lg:inline">My Orders</span>
              </Link>
              {(session.user as any)?.role === "admin" && (
                <Link href="/admin/dashboard" className="flex items-center gap-1 text-sm font-medium text-[#6C63FF] hover:text-[#7C3AED] transition">
                  <LayoutDashboard className="w-4 h-4" />
                  Admin
                </Link>
              )}
              <div className="hidden lg:flex items-center gap-2 text-sm text-[#A1A1AA]">
                <User className="w-4 h-4" />
                {session.user?.name}
              </div>
              <button onClick={() => signOut()} className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300 transition">
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          ) : (
            <Link href="/login" className="gradient-bg text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-[#7C3AED]/20 transition-all">
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden p-2 text-white" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#1A1A23] border-t border-[#2A2A35] shadow-premium-lg absolute top-full left-0 right-0 p-6 flex flex-col gap-4">
          <Link href="/products" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 text-[#E4E4E7] font-medium hover:text-[#E8A94C] transition">
            <Store className="w-4 h-4" />
            Shop All Products
          </Link>
          <Link href="/#reviews" onClick={() => setMobileOpen(false)} className="text-[#E4E4E7] font-medium hover:text-[#E8A94C] transition">Reviews</Link>
          <Link href="/#faq" onClick={() => setMobileOpen(false)} className="text-[#E4E4E7] font-medium hover:text-[#E8A94C] transition">FAQ</Link>
          <Link href="/#contact" onClick={() => setMobileOpen(false)} className="text-[#E4E4E7] font-medium hover:text-[#E8A94C] transition">Contact</Link>
          <Link href="/cart" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 text-[#E4E4E7] font-medium hover:text-[#E8A94C] transition">
            <ShoppingCart className="w-4 h-4" />
            Cart {itemCount > 0 && `(${itemCount})`}
          </Link>
          <hr className="border-[#2A2A35]" />
          {session ? (
            <>
              <Link href="/orders" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 text-[#E4E4E7] font-medium hover:text-[#E8A94C] transition">
                <Package className="w-4 h-4" />
                My Orders
              </Link>
              {(session.user as any)?.role === "admin" && (
                <Link href="/admin/dashboard" onClick={() => setMobileOpen(false)} className="text-[#6C63FF] font-medium">Admin Dashboard</Link>
              )}
              <div className="text-sm text-[#A1A1AA] flex items-center gap-2">
                <User className="w-4 h-4" />
                {session.user?.name}
              </div>
              <button onClick={() => signOut()} className="text-red-400 font-medium text-left">Logout</button>
            </>
          ) : (
            <Link href="/login" onClick={() => setMobileOpen(false)} className="gradient-bg text-white px-5 py-3 rounded-xl text-center font-semibold">Sign In</Link>
          )}
        </div>
      )}
    </nav>
  )
}
