"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Star, ShoppingCart, Check, Shield, Truck, RotateCcw, Minus, Plus, ChevronLeft, ChevronRight, Share2, Heart, Zap, ArrowRight } from "lucide-react"
import { useCart } from "@/context/CartContext"

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
  features: string | null
  specs: string | null
  sku: string | null
  stock: number
  rating: number
  reviewCount: number
  featured: boolean
}

export default function ProductDetailPage() {
  const { slug } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [addedToCart, setAddedToCart] = useState(false)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const { addItem } = useCart()

  useEffect(() => {
    if (!slug) return
    fetch(`/api/products?slug=${slug}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) throw new Error(data.error)
        setProduct(data)
        // Fetch related products from same category
        if (data.category) {
          fetch(`/api/products?category=${data.category}`)
            .then(r => r.json())
            .then(related => {
              const filtered = (Array.isArray(related) ? related : [])
                .filter((p: Product) => p.slug !== data.slug)
                .slice(0, 4)
              setRelatedProducts(filtered)
            })
            .catch(() => {})
        }
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D12] flex items-center justify-center">
        <div className="animate-spin h-10 w-10 rounded-full border-4 border-[#2A2A35] border-t-[#E8A94C]" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0D0D12] flex flex-col items-center justify-center gap-4">
        <span className="text-4xl">🔍</span>
        <h2 className="text-xl font-bold text-white">Product not found</h2>
        <Link href="/products" className="text-[#E8A94C] hover:underline text-sm">Browse all products →</Link>
      </div>
    )
  }

  const images: string[] = product.images ? JSON.parse(product.images) : [product.imageUrl || ""]
  const features: string[] = product.features ? JSON.parse(product.features) : []
  const specs: Record<string, string> = product.specs ? JSON.parse(product.specs) : {}
  const discount = product.compareAt ? Math.round((1 - product.price / product.compareAt) * 100) : 0

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl || "",
      slug: product.slug,
      stock: product.stock,
    }, quantity)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 3000)
  }

  return (
    <div className="min-h-screen bg-[#0D0D12]">
      {/* Breadcrumb */}
      <div className="bg-[#1A1A23] border-b border-[#2A2A35] py-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-2 text-sm text-[#52525B]">
          <Link href="/" className="hover:text-[#E8A94C] transition">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-[#E8A94C] transition">Products</Link>
          <span>/</span>
          {product.category && <Link href={`/products?category=${product.category}`} className="hover:text-[#E8A94C] transition">{product.category}</Link>}
          <span>/</span>
          <span className="text-[#A1A1AA] truncate">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div>
            <div className="aspect-[4/3] bg-[#1A1A23] rounded-2xl overflow-hidden border border-[#2A2A35] relative group">
              <img
                src={images[selectedImage] || product.imageUrl || ""}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              {discount > 0 && (
                <span className="absolute top-4 left-4 bg-[#E8A94C] text-black text-sm font-bold px-3 py-1 rounded-xl">-{discount}%</span>
              )}
              {images.length > 1 && (
                <>
                  <button onClick={() => setSelectedImage(i => Math.max(0, i - 1))} disabled={selectedImage === 0}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 disabled:opacity-30">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button onClick={() => setSelectedImage(i => Math.min(images.length - 1, i + 1))} disabled={selectedImage === images.length - 1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 disabled:opacity-30">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)}
                    className={`w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition ${
                      i === selectedImage ? "border-[#E8A94C]" : "border-transparent opacity-60 hover:opacity-100"
                    }`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <p className="text-xs font-semibold text-[#E8A94C] uppercase tracking-widest mb-2">{product.category}</p>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight mb-4">{product.name}</h1>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.round(product.rating) ? "fill-[#E8A94C] text-[#E8A94C]" : "text-[#2A2A35]"}`} />
                ))}
              </div>
              <span className="text-sm text-[#A1A1AA]">{product.rating} ({product.reviewCount.toLocaleString()} reviews)</span>
              {product.stock > 0 && (
                <span className="text-xs text-[#34D399] flex items-center gap-1 ml-2">
                  <Check className="w-3 h-3" /> In Stock
                </span>
              )}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl sm:text-4xl font-bold text-white">${product.price}</span>
              {product.compareAt && <span className="text-lg text-[#52525B] line-through">${product.compareAt}</span>}
              {discount > 0 && <span className="text-sm font-bold text-[#34D399]">Save ${(product.compareAt! - product.price).toFixed(0)}</span>}
            </div>

            {/* Description */}
            <p className="text-[#A1A1AA] text-sm leading-relaxed mb-6">{product.description}</p>

            {/* Features */}
            {features.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mb-6">
                {features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-[#A1A1AA]">
                    <Zap className="w-3.5 h-3.5 text-[#E8A94C]" />
                    {f}
                  </div>
                ))}
              </div>
            )}

            {/* Quantity + Add to Cart */}
            <div className="bg-[#1A1A23] rounded-2xl p-5 border border-[#2A2A35] mb-6">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-sm text-[#A1A1AA]">Quantity:</span>
                <div className="flex items-center gap-3 bg-[#0D0D12] border border-[#2A2A35] rounded-xl px-3 py-1.5">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1} className="text-[#A1A1AA] hover:text-white disabled:opacity-30 p-1">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-base font-bold text-white w-8 text-center">{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} disabled={quantity >= product.stock} className="text-[#A1A1AA] hover:text-white disabled:opacity-30 p-1">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-xs text-[#52525B]">{product.stock} available</span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="flex-1 gradient-bg text-white py-3.5 rounded-xl font-bold text-sm hover:shadow-xl hover:shadow-[#7C3AED]/20 transition-all disabled:opacity-30 flex items-center justify-center gap-2"
                >
                  {addedToCart ? (
                    <><Check className="w-4 h-4" /> Added to Cart!</>
                  ) : (
                    <><ShoppingCart className="w-4 h-4" /> Add to Cart — ${(product.price * quantity).toFixed(2)}</>
                  )}
                </button>
                <button className="p-3.5 bg-[#0D0D12] border border-[#2A2A35] rounded-xl text-[#A1A1AA] hover:text-[#E8A94C] hover:border-[#E8A94C]/30 transition">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="p-3.5 bg-[#0D0D12] border border-[#2A2A35] rounded-xl text-[#A1A1AA] hover:text-[#E8A94C] transition">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { icon: Truck, text: "Free Shipping", sub: "Orders over $50" },
                { icon: RotateCcw, text: "30-Day Returns", sub: "No questions asked" },
                { icon: Shield, text: "2-Year Warranty", sub: "Full coverage" },
              ].map(({ icon: Icon, text, sub }) => (
                <div key={text} className="bg-[#1A1A23] rounded-xl p-3 border border-[#2A2A35] text-center">
                  <Icon className="w-5 h-5 text-[#E8A94C] mx-auto mb-1" />
                  <p className="text-xs font-bold text-white">{text}</p>
                  <p className="text-[10px] text-[#52525B]">{sub}</p>
                </div>
              ))}
            </div>

            {/* SKU */}
            {product.sku && <p className="text-xs text-[#52525B]">SKU: {product.sku}</p>}
          </div>
        </div>

        {/* Specs Table */}
        {Object.keys(specs).length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-white mb-6">Technical Specifications</h2>
            <div className="bg-[#1A1A23] rounded-2xl border border-[#2A2A35] overflow-hidden">
              <div className="divide-y divide-[#2A2A35]">
                {Object.entries(specs).map(([key, value]) => (
                  <div key={key} className="grid grid-cols-2 gap-4 px-6 py-3.5">
                    <span className="text-sm text-[#A1A1AA]">{key}</span>
                    <span className="text-sm text-white font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">You Might Also Like</h2>
              <Link href={`/products${product.category ? `?category=${product.category}` : ""}`} className="text-sm text-[#E8A94C] hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {relatedProducts.map(rp => (
                <Link key={rp.id} href={`/products/${rp.slug}`} className="group bg-[#1A1A23] rounded-xl border border-[#2A2A35] overflow-hidden hover:border-[#E8A94C]/30 hover:-translate-y-0.5 transition-all duration-300">
                  <div className="aspect-square bg-[#0D0D12] overflow-hidden">
                    <img src={rp.imageUrl || ""} alt={rp.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  </div>
                  <div className="p-3">
                    <h3 className="text-xs font-bold text-white truncate group-hover:text-[#E8A94C] transition-colors">{rp.name}</h3>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-2.5 h-2.5 fill-[#E8A94C] text-[#E8A94C]" />
                      <span className="text-[10px] text-[#A1A1AA]">{rp.rating.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-sm font-bold text-white">${rp.price}</span>
                      {rp.compareAt && <span className="text-[10px] text-[#52525B] line-through">${rp.compareAt}</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back to products */}
        <div className="mt-12 text-center">
          <Link href="/products" className="inline-flex items-center gap-2 text-[#A1A1AA] hover:text-[#E8A94C] transition text-sm">
            <ChevronLeft className="w-4 h-4" /> Back to all products
          </Link>
        </div>
      </div>
    </div>
  )
}
