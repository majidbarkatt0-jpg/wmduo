"use client"
import { useState, useEffect } from "react"
import Link from "next/link"

const EMOJIS: Record<string, string> = {
  "Projectors": "📽️", "Home & Wellness": "🌿", "Auto Accessories": "🚗",
  "Gadgets & Tech": "🔧", "Air Quality": "💨", "Home Cooling": "🌀",
}

export default function CategoriesSection() {
  const [cats, setCats] = useState<{ name: string; count: number }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const ac = new AbortController()
    fetch("/api/categories", { signal: ac.signal })
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setCats(data) })
      .catch(() => {})
      .finally(() => setLoading(false))
    return () => ac.abort()
  }, [])

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
      <span className="text-[10px] font-semibold tracking-widest uppercase text-brown-mid">✦ Categories</span>
      <h2 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl font-bold text-brown-deep mt-1 mb-8">
        Browse by <span className="text-gold italic">Category</span>
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bento-card bento-card--white animate-pulse items-center text-center" style={{ aspectRatio: "1/1" }}>
                <div className="w-10 h-10 rounded-full bg-brown-light/20 mx-auto mb-3" />
                <div className="h-3 bg-brown-light/20 rounded w-3/4 mx-auto" />
              </div>
            ))
          : cats.map((cat, i) => (
              <Link key={cat.name} href={`/products?category=${encodeURIComponent(cat.name)}`}
                className="bento-card bento-card--white items-center text-center no-underline group animate-float-in"
                style={{ aspectRatio: "1/1", animationDelay: `${i * 60}ms` }}>
                <span className="text-3xl mb-2 group-hover:scale-125 transition-transform duration-500 block">{EMOJIS[cat.name] || "📦"}</span>
                <span className="text-xs font-bold text-brown-deep group-hover:text-gold transition-colors">{cat.name}</span>
                <span className="text-[10px] text-brown-mid mt-0.5">{cat.count} item{cat.count !== 1 ? "s" : ""}</span>
              </Link>
            ))
        }
      </div>
    </section>
  )
}
