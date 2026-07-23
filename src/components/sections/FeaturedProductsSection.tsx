"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import ProductCard from "./ProductCard"

export default function FeaturedProductsSection() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const ac = new AbortController()
    fetch("/api/products?featured=true", { signal: ac.signal })
      .then(r => r.json())
      .then(data => { setProducts(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
    return () => ac.abort()
  }, [])

  const display = products.slice(0, 7)

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-[10px] font-semibold tracking-widest uppercase text-brown-mid">✦ Signature Objects</span>
          <h2 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl font-bold text-brown-deep mt-1">
            Featured <span className="text-gold italic">Collection</span>
          </h2>
        </div>
        <Link href="/products" className="btn-gold no-underline text-xs px-5 py-2.5">
          View All
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bento-card bento-card--white animate-pulse" style={{ aspectRatio: "1/1.3" }}>
              <div className="flex-1 bg-brown-light/20 rounded-xl mb-3" />
              <div className="h-4 bg-brown-light/20 rounded w-3/4 mb-2" />
              <div className="h-3 bg-brown-light/20 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[minmax(180px,auto)]">
          {display.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      )}
    </section>
  )
}
