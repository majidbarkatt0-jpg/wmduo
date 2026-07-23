"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, SlidersHorizontal, X, Star, ShoppingBag, ChevronDown, Grid3X3, List, Check, ShoppingCart } from "lucide-react"
import { useCart } from "@/context/CartContext"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  compareAt: number | null
  category: string | null
  imageUrl: string | null
  images: string | null
  rating: number
  reviewCount: number
  stock: number
  featured: boolean
  sku: string
}

const SORT_OPTIONS = ["Newest", "Price: Low to High", "Price: High to Low", "Best Rating", "Most Reviews"]

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState("All")
  const [sort, setSort] = useState("Newest")
  const [search, setSearch] = useState("")
  const [view, setView] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const { addItem } = useCart()
  const [addingId, setAddingId] = useState<string | null>(null)

  // Fetch categories on mount
  useEffect(() => {
    fetch("/api/categories")
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setCategories(data.map((c: any) => c.name))
      })
      .catch((err) => console.warn("API error:", err))
  }, [])

  useEffect(() => {
    const ac = new AbortController()
    setLoading(true)
    const params = new URLSearchParams()
    if (category !== "All") params.set("category", category)
    if (search) params.set("search", search)
    params.set("status", "active")

    fetch(`/api/products?${params}`, { signal: ac.signal })
      .then(r => r.json())
      .then(data => {
        let filtered = Array.isArray(data) ? data : []
        switch (sort) {
          case "Price: Low to High": filtered.sort((a, b) => a.price - b.price); break
          case "Price: High to Low": filtered.sort((a, b) => b.price - a.price); break
          case "Best Rating": filtered.sort((a, b) => b.rating - a.rating); break
          case "Most Reviews": filtered.sort((a, b) => b.reviewCount - a.reviewCount); break
          default: break
        }
        setProducts(filtered)
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
    return () => ac.abort()
  }, [category, sort, search])

  const displayed = products

  const handleAdd = (product: Product) => {
    setAddingId(product.id)
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price, // ✅ FIXED: was using compareAt (higher fake price)
      imageUrl: product.imageUrl || "",
      slug: product.slug,
      stock: product.stock,
    }, 1)
    setTimeout(() => setAddingId(null), 800)
  }

  return (
    <div className="min-h-screen bg-white-soft">
      <Navbar />
      {/* Header */}
      <div className="bg-white border-b border-gold/10 pt-24 pb-10 sm:pt-28 sm:pb-14">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="text-xs font-semibold text-[#E8A94C] uppercase tracking-[0.15em]">WM Duo Store</span>
          <h1 className="text-3xl sm:text-5xl font-bold text-white mt-3 mb-3 tracking-tight">
            All <span className="gradient-text-glow">Products</span>
          </h1>
          <p className="text-[#A1A1AA] text-sm sm:text-base max-w-xl mx-auto">
            Curated tech accessories — audio, charging, gaming, and smart home gear
          </p>
        </div>
      </div>

      {/* Search + Filters Bar */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-xl border-b border-gold/10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#52525B]" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-9 py-2.5 bg-white-soft border border-gold/10 rounded-xl focus:border-gold outline-none text-sm text-brown-deep placeholder-brown-mid transition"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#52525B] hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Filter Desktop */}
            <div className="hidden md:flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              {["All", ...categories].map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                    category === cat
                      ? "bg-[#E8A94C]/10 text-[#E8A94C] border border-[#E8A94C]/30"
                      : "text-brown-mid hover:text-brown-deep hover:bg-white border border-transparent"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sort + View */}
            <div className="hidden sm:flex items-center gap-2 ml-auto">
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                className="px-3 py-2.5 bg-white-soft border border-gold/10 rounded-xl text-xs text-brown-mid outline-none focus:border-gold cursor-pointer"
              >
                {SORT_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <div className="flex bg-white-soft border border-gold/10 rounded-xl overflow-hidden">
                <button onClick={() => setView("grid")} className={`p-2.5 ${view === "grid" ? "bg-[#E8A94C]/10 text-[#E8A94C]" : "text-[#52525B] hover:text-white"}`}>
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button onClick={() => setView("list")} className={`p-2.5 ${view === "list" ? "bg-[#E8A94C]/10 text-[#E8A94C]" : "text-[#52525B] hover:text-white"}`}>
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mobile Filter Button */}
            <button onClick={() => setShowFilters(!showFilters)} className="md:hidden p-2.5 bg-[#1A1A23] border border-[#2A2A35] rounded-xl text-[#A1A1AA]">
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="md:hidden mt-3 pb-3 space-y-3 border-t border-[#2A2A35] pt-3">
              <div className="flex flex-wrap gap-1.5">
                {["All", ...categories].map(cat => (
                  <button
                    key={cat}
                    onClick={() => { setCategory(cat); setShowFilters(false) }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                      category === cat
                        ? "bg-[#E8A94C]/10 text-[#E8A94C] border border-[#E8A94C]/30"
                        : "bg-[#1A1A23] text-[#A1A1AA] border border-[#2A2A35]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                className="w-full px-3 py-2 bg-[#1A1A23] border border-[#2A2A35] rounded-xl text-sm text-[#A1A1AA] outline-none"
              >
                {SORT_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          )}

          {/* Active filter count */}
          <div className="hidden sm:flex items-center gap-2 mt-2 text-[10px] text-[#52525B]">
            {category !== "All" && <span className="bg-[#1A1A23] px-2 py-0.5 rounded-md border border-[#2A2A35]">{category}</span>}
            <span>{displayed.length} product{displayed.length !== 1 ? "s" : ""}</span>
          </div>
        </div>
      </div>

      {/* Products Grid/List */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-[#1A1A23] rounded-2xl border border-[#2A2A35] overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-[#0D0D12]" />
                <div className="p-4 space-y-3">
                  <div className="h-3 bg-[#2A2A35] rounded w-1/3" />
                  <div className="h-4 bg-[#2A2A35] rounded w-3/4" />
                  <div className="h-3 bg-[#2A2A35] rounded w-1/4" />
                  <div className="h-8 bg-[#2A2A35] rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : displayed.length === 0 ? (
          <div className="text-center py-24">
            <ShoppingBag className="w-16 h-16 text-[#2A2A35] mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-1">No products found</h3>
            <p className="text-sm text-[#52525B] mb-6">
              {search ? `No results for "${search}"` : "This category is empty"}
            </p>
            {(search || category !== "All") && (
              <button
                onClick={() => { setSearch(""); setCategory("All") }}
                className="gradient-bg text-black px-6 py-2.5 rounded-xl text-sm font-semibold"
              >
              Clear Filters
                </button>
              )}
            </div>
          ) : view === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {displayed.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                adding={addingId === product.id}
                onAddToCart={() => handleAdd(product)}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {displayed.map(product => (
              <ProductListItem
                key={product.id}
                product={product}
                adding={addingId === product.id}
                onAddToCart={() => handleAdd(product)}
              />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

function ProductCard({ product, onAddToCart, adding }: { product: Product; onAddToCart: () => void; adding: boolean }) {
  const discount = (product.compareAt && product.compareAt > product.price) ? Math.round((1 - product.price / product.compareAt) * 100) : 0
  return (
    <div className="group bg-[#1A1A23] rounded-2xl border border-[#2A2A35] overflow-hidden hover:border-[#E8A94C]/30 hover:shadow-xl hover:shadow-[#7C3AED]/5 transition-all duration-300 hover:-translate-y-0.5">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="aspect-[4/3] bg-[#0D0D12] overflow-hidden relative">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#2A2A35] text-2xl">◈</div>
          )}
          {discount > 0 && (
            <span className="absolute top-2 left-2 bg-[#E8A94C] text-black text-[10px] font-bold px-2 py-0.5 rounded-lg shadow-lg">-{discount}%</span>
          )}
          {product.stock > 0 && product.stock <= 5 && (
            <span className="absolute top-2 right-2 bg-red-500/90 text-white text-[10px] font-medium px-2 py-0.5 rounded-lg shadow-lg">Only {product.stock} left</span>
          )}
        </div>
      </Link>
      <div className="p-3 sm:p-4">
        <p className="text-[10px] font-medium text-[#E8A94C] uppercase tracking-wider mb-1 truncate">{product.category || "General"}</p>
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-sm font-bold text-white leading-snug mb-1 hover:text-[#E8A94C] transition-colors line-clamp-2 min-h-[2.5rem]">{product.name}</h3>
        </Link>
        <div className="flex items-center gap-1 mb-2">
          <Star className="w-3 h-3 fill-[#E8A94C] text-[#E8A94C]" />
          <span className="text-xs text-[#A1A1AA]">
            {product.rating.toFixed(1)}
            <span className="text-[#52525B] ml-0.5">({product.reviewCount.toLocaleString()})</span>
          </span>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-white">${product.price.toFixed(2)}</span>
          {product.compareAt && <span className="text-xs text-[#52525B] line-through">${product.compareAt.toFixed(2)}</span>}
        </div>
        <button
          onClick={onAddToCart}
          disabled={product.stock <= 0 || adding}
          className={`w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all disabled:opacity-30 ${
            adding
              ? "bg-[#34D399] text-black"
              : "gradient-bg text-black hover:shadow-lg hover:shadow-[#7C3AED]/20"
          }`}
        >
          {adding ? (
            <><Check className="w-3.5 h-3.5" /> Added!</>
          ) : product.stock <= 0 ? (
            "Out of Stock"
          ) : (
            <><ShoppingCart className="w-3.5 h-3.5" /> Add to Cart</>
          )}
        </button>
      </div>
    </div>
  )
}

function ProductListItem({ product, onAddToCart, adding }: { product: Product; onAddToCart: () => void; adding: boolean }) {
  const discount = (product.compareAt && product.compareAt > product.price) ? Math.round((1 - product.price / product.compareAt) * 100) : 0
  return (
    <div className="group bg-[#1A1A23] rounded-2xl border border-[#2A2A35] overflow-hidden hover:border-[#E8A94C]/30 hover:shadow-lg transition-all duration-300">
      <div className="flex gap-4 sm:gap-6 p-4">
        <Link href={`/products/${product.slug}`} className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-[#0D0D12] flex-shrink-0 relative">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#2A2A35] text-2xl">◈</div>
          )}
          {discount > 0 && (
            <span className="absolute top-1.5 left-1.5 bg-[#E8A94C] text-black text-[9px] font-bold px-1.5 py-0.5 rounded-md">-{discount}%</span>
          )}
        </Link>
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-medium text-[#E8A94C] uppercase tracking-wider mb-0.5">{product.category || "General"}</p>
                <Link href={`/products/${product.slug}`}>
                  <h3 className="text-base sm:text-lg font-bold text-white hover:text-[#E8A94C] transition-colors">{product.name}</h3>
                </Link>
                <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1 line-clamp-2 leading-relaxed">{product.description}</p>
              </div>
              <div className="text-right flex-shrink-0 hidden sm:block">
                <div className="text-xl font-bold text-white">${product.price.toFixed(2)}</div>
                {product.compareAt && <div className="text-xs text-[#52525B] line-through">${product.compareAt.toFixed(2)}</div>}
                {discount > 0 && <div className="text-xs text-[#34D399] font-medium mt-0.5">Save ${(product.compareAt! - product.price).toFixed(0)}</div>}
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Star className="w-3.5 h-3.5 fill-[#E8A94C] text-[#E8A94C]" />
              <span className="text-xs text-[#A1A1AA]">{product.rating.toFixed(1)}</span>
              <span className="text-[10px] text-[#52525B]">({product.reviewCount.toLocaleString()} reviews)</span>
              {product.stock <= 5 && product.stock > 0 && (
                <span className="text-[10px] text-red-400 ml-2">Only {product.stock} left</span>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between mt-3 sm:mt-2">
            <div className="flex items-center gap-3 sm:hidden">
                <span className="text-lg font-bold text-white">${product.price.toFixed(2)}</span>
                {product.compareAt && <span className="text-xs text-[#52525B] line-through">${product.compareAt.toFixed(2)}</span>}
            </div>
            <button
              onClick={onAddToCart}
              disabled={product.stock <= 0 || adding}
              className={`flex items-center justify-center gap-1.5 px-5 py-2 rounded-xl text-sm font-bold transition-all disabled:opacity-30 ${
                adding
                  ? "bg-[#34D399] text-black"
                  : "gradient-bg text-black hover:shadow-lg hover:shadow-[#7C3AED]/20"
                }`}
            >
              {adding ? (
                <><Check className="w-3.5 h-3.5" /> Added!</>
              ) : product.stock <= 0 ? (
                "Out of Stock"
              ) : (
                <><ShoppingCart className="w-3.5 h-3.5" /> Add to Cart</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
