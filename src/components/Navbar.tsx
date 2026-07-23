"use client"
import { useState } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { useCart } from "@/context/CartContext"

export default function Navbar() {
  const { data: session } = useSession()
  const { items } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="relative z-50 py-3 px-4 sm:px-8 max-w-7xl mx-auto flex items-center justify-between">
      <Link href="/" className="flex items-baseline gap-1.5 no-underline">
        <span className="font-['Playfair_Display',serif] text-2xl sm:text-3xl font-bold text-brown-deep tracking-tight">
          WM<span className="text-gold italic">DUO</span>
        </span>
        <span className="hidden sm:inline text-[10px] text-brown-mid tracking-widest uppercase ml-1 font-['Inter']">· studio</span>
      </Link>

      <nav className="hidden md:flex items-center gap-8">
        {[
          { href: "/products", label: "Objects" },
          { href: "/blog", label: "Journal" },
          { href: "/#features", label: "Atelier" },
          { href: "/#contact", label: "Contact" },
        ].map((item) => (
          <Link key={item.href} href={item.href}
            className="text-xs font-semibold tracking-widest uppercase text-brown-rich no-underline relative pb-1
                       after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-gold
                       after:transition-all after:duration-500 hover:text-gold hover:after:w-full">
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden w-11 h-11 rounded-full bg-white border border-gold/10 flex items-center justify-center text-brown-deep shadow-sm hover:bg-gold hover:text-white transition-all duration-500"
          aria-label="Menu"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d={menuOpen ? "M4 4l10 10M4 14L14 4" : "M3 5h12M3 9h12M3 13h12"} />
          </svg>
        </button>

        <button className="hidden sm:flex w-11 h-11 rounded-full bg-white border border-gold/10 items-center justify-center text-brown-deep shadow-sm hover:bg-gold hover:text-white transition-all duration-500" aria-label="Search">⌕</button>

        <Link href="/cart"
          className="relative w-11 h-11 rounded-full bg-white border border-gold/10 flex items-center justify-center text-brown-deep shadow-sm hover:bg-gold hover:text-white transition-all duration-500 no-underline"
          aria-label="Cart">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
          {items.length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gold text-white text-[10px] font-bold flex items-center justify-center shadow-md">
              {items.length}
            </span>
          )}
        </Link>

        {session ? (
          <button onClick={() => signOut({ callbackUrl: "/" })}
            className="hidden sm:block text-xs font-semibold tracking-widest uppercase text-brown-mid hover:text-gold transition-colors bg-transparent border-none cursor-pointer">
            Exit
          </button>
        ) : (
          <Link href="/login"
            className="hidden sm:inline-flex items-center px-5 py-2.5 rounded-full border border-gold text-xs font-semibold tracking-widest uppercase text-brown-deep bg-white hover:bg-gold hover:text-white transition-all duration-500 no-underline shadow-sm">
            Sign In
          </Link>
        )}
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 mx-4 mt-2 bg-white rounded-3xl shadow-xl border border-gold/10 p-6 md:hidden z-50 animate-fade-up">
          <nav className="flex flex-col gap-4">
            {[
              { href: "/products", label: "Objects" },
              { href: "/blog", label: "Journal" },
              { href: "/#features", label: "Atelier" },
              { href: "/#contact", label: "Contact" },
              { href: session ? "/orders" : "/login", label: session ? "My Orders" : "Sign In" },
            ].map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}
                className="text-sm font-semibold text-brown-rich no-underline py-2 hover:text-gold transition-colors">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
