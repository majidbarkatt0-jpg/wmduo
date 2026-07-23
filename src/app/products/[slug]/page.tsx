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
  const [addedFlash, setAddedFlash] = useState(false)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [buying, setBuying] = useState(false)
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null)
  const [imgError, setImgError] = useState(false)
  const [showMobileBar, setShowMobileBar] = useState(false)
  const { addItem } = useCart()

  // Show mobile sticky bar after scrolling past buy section
  useEffect(() => {
    const handleScroll = () => setShowMobileBar(window.scrollY > 400)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (product) document.title = `${product.name} — WM Duo`
  }, [product])

  useEffect(() => {
    if (!slug) return
    fetch(`/api/products?slug=${slug}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) throw new Error(data.error)
        setProduct(data)
        // Fetch related products from same category
        if (data.category) {
          fetch(`/api/products?category=${data.category}&status=active`)
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
      <div className="min-h-screen bg-white-soft flex items-center justify-center">
        <div className="animate-spin h-10 w-10 rounded-full border-4 border-gold/30 border-t-gold" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white-soft flex flex-col items-center justify-center gap-4">
        <span className="text-4xl">🔍</span>
        <h2 className="text-xl font-bold text-brown-deep">Product not found</h2>
        <Link href="/products" className="text-gold hover:underline text-sm">Browse all products →</Link>
      </div>
    )
  }

  // 🔒 Safe JSON parse to prevent crashes on malformed data
  function safeJsonParse<T>(val: string | null | undefined, fallback: T): T {
    if (!val) return fallback
    try { return JSON.parse(val) as T } catch { return fallback }
  }
  const images: string[] = safeJsonParse<string[]>(product.images, [product.imageUrl || ""].filter(Boolean))
  const features: string[] = safeJsonParse<string[]>(product.features, [])
  const specs: Record<string, string> = safeJsonParse<Record<string, string>>(product.specs, {})
  const discount = (product.compareAt && product.compareAt > product.price) ? Math.round((1 - product.price / product.compareAt) * 100) : 0

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
    setAddedFlash(true)
    setTimeout(() => { setAddedToCart(false); setAddedFlash(false) }, 2000)
  }

  const handleBuyNow = async () => {
    setBuying(true)
    try {
      // Get Shopify variant ID for this product
      const variantRes = await fetch(`/api/shopify/variant/${slug}`)
      const variantData = await variantRes.json()
      
      if (!variantData.success) {
        alert('This product is not available for checkout yet. Please try again later.')
        setBuying(false)
        return
      }
      
      // Create Shopify checkout
      const res = await fetch('/api/shopify/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variantId: variantData.variantId,
          quantity: quantity,
        }),
      })
      const data = await res.json()
      
      if (data.success && data.checkoutUrl) {
        setCheckoutUrl(data.checkoutUrl)
        // Redirect to Shopify checkout page
        window.location.href = data.checkoutUrl
      } else {
        alert('Checkout failed: ' + (data.error || 'Unknown error'))
      }
    } catch (err) {
      alert('Failed to create checkout. Please try again.')
    } finally {
      setBuying(false)
    }
  }

  return (
    <div className="min-h-screen bg-white-soft">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gold/10 py-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-2 text-sm text-brown-mid">
          <Link href="/" className="hover:text-gold transition">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-gold transition">Products</Link>
          <span>/</span>
          {product.category && <Link href={`/products?category=${product.category}`} className="hover:text-gold transition">{product.category}</Link>}
          <span>/</span>
          <span className="text-brown-light truncate">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div>
            <div className="bento-card bento-card--white !p-0 !rounded-2xl overflow-hidden relative group" style={{ aspectRatio: "4/3" }}>
              {imgError || !images[selectedImage] ? (
                <div className="w-full h-full flex items-center justify-center bg-white-soft">
                  <div className="text-center">
                    <span className="text-6xl opacity-20">◈</span>
                    <p className="text-xs text-brown-mid mt-2">Image unavailable</p>
                  </div>
                </div>
              ) : (
              <img src={images[selectedImage] || product.imageUrl || ""} alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                onError={() => setImgError(true)} loading="lazy" />
              )}
              {discount > 0 && (
                <span className="absolute top-4 left-4 bg-gold text-white text-sm font-bold px-3 py-1 rounded-xl">-{discount}%</span>
              )}
              {images.length > 1 && (
                <>
                  <button onClick={() => setSelectedImage(i => Math.max(0, i - 1))} disabled={selectedImage === 0}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-brown-deep/70 text-white flex items-center justify-center hover:bg-brown-deep disabled:opacity-30">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button onClick={() => setSelectedImage(i => Math.min(images.length - 1, i + 1))} disabled={selectedImage === images.length - 1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-brown-deep/70 text-white flex items-center justify-center hover:bg-brown-deep disabled:opacity-30">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)}
                    className={`w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                      i === selectedImage ? "border-gold" : "border-transparent opacity-60 hover:opacity-100"
                    }`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <p className="text-[10px] font-semibold text-gold uppercase tracking-widest mb-2">{product.category}</p>
            <h1 className="font-['Playfair_Display',serif] text-2xl sm:text-3xl lg:text-4xl font-bold text-brown-deep leading-tight mb-4">{product.name}</h1>

            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.round(product.rating) ? "fill-gold text-gold" : "text-brown-light/30"}`} />
                ))}
              </div>
              <span className="text-sm text-brown-mid">{product.rating} ({product.reviewCount.toLocaleString()} reviews)</span>
              {product.stock > 0 && (
                <span className="text-xs text-brown-mid flex items-center gap-1 ml-2">
                  <Check className="w-3 h-3 text-gold" /> In Stock
                </span>
              )}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl sm:text-4xl font-bold text-brown-deep">${product.price.toFixed(2)}</span>
              {product.compareAt && <span className="text-lg text-brown-light line-through">${product.compareAt.toFixed(2)}</span>}
              {discount > 0 && <span className="text-sm font-bold text-gold">Save ${(product.compareAt! - product.price).toFixed(0)}</span>}
            </div>

            {/* Description */}
            <p className="text-brown-mid text-sm leading-relaxed mb-6">{product.description}</p>

            {/* Features */}
            {features.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mb-6">
                {features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-brown-mid">
                    <Zap className="w-3.5 h-3.5 text-gold" />
                    {f}
                  </div>
                ))}
              </div>
            )}

            {/* Quantity + Add to Cart */}
            <div className="bento-card bento-card--white !p-5 mb-6">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-sm text-brown-mid">Quantity:</span>
                <div className="flex items-center gap-3 bg-white-soft border border-gold/10 rounded-xl px-3 py-1.5">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1} className="text-brown-mid hover:text-brown-deep disabled:opacity-30 p-1">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-base font-bold text-brown-deep w-8 text-center">{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} disabled={quantity >= product.stock} className="text-brown-mid hover:text-brown-deep disabled:opacity-30 p-1">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-xs text-brown-light">{product.stock} available</span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleBuyNow}
                  disabled={product.stock <= 0 || buying}
                  className="btn-brown flex-1 !px-6 !py-3.5 text-sm flex items-center justify-center gap-2 group"
                >
                  {buying ? (
                    <>⏳ Processing...</>
                  ) : (
                    <><Zap className="w-4 h-4 group-hover:scale-110 transition-transform" /> Buy Now — ${(product.price * quantity).toFixed(2)}</>
                  )}
                </button>
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="btn-gold !px-5 !py-3.5 text-sm flex items-center gap-2 group"
                >
                  {addedToCart ? (
                    <><Check className="w-4 h-4 text-green-500" /> Added</>
                  ) : (
                    <><ShoppingCart className="w-4 h-4 group-hover:scale-110 transition-transform" /> Cart</>
                  )}
                </button>
              </div>
              {/* Secure Checkout Badge */}
              <div className="flex items-center justify-center gap-4 mt-3 text-xs text-[#52525B]">
                <span>🔒 Secure checkout via Shopify</span>
                <span>💳 Visa • MC • PayPal • Apple Pay</span>
              </div>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { icon: Truck, text: "Free Shipping", sub: "Orders over $50" },
                { icon: RotateCcw, text: "30-Day Returns", sub: "No questions asked" },
                { icon: Shield, text: "2-Year Warranty", sub: "Full coverage" },
              ].map(({ icon: Icon, text, sub }) => (
                <div key={text} className="bento-card bento-card--white !rounded-xl !p-3 items-center text-center">
                  <Icon className="w-5 h-5 text-gold mx-auto mb-1" />
                  <p className="text-xs font-bold text-brown-deep">{text}</p>
                  <p className="text-[10px] text-brown-mid">{sub}</p>
                </div>
              ))}
            </div>

            {/* SKU */}
            {product.sku && <p className="text-xs text-brown-mid">SKU: {product.sku}</p>}
          </div>
        </div>

        {/* Specs Table */}
        {Object.keys(specs).length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-brown-deep mb-6">Technical Specifications</h2>
            <div className="bento-card bento-card--white !rounded-2xl !p-0 overflow-hidden">
              <div className="divide-y divide-gold/10">
                {Object.entries(specs).map(([key, value]) => (
                  <div key={key} className="grid grid-cols-2 gap-4 px-6 py-3.5">
                    <span className="text-sm text-brown-mid">{key}</span>
                    <span className="text-sm text-brown-deep font-medium">{value}</span>
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
              <h2 className="text-xl font-bold text-brown-deep">You Might Also Like</h2>
              <Link href={`/products${product.category ? `?category=${product.category}` : ""}`} className="text-sm text-gold hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {relatedProducts.map(rp => (
                <Link key={rp.id} href={`/products/${rp.slug}`} className="bento-card bento-card--white !rounded-xl !p-0 overflow-hidden group">
                  <div className="aspect-square bg-white-soft overflow-hidden">
                    <img src={rp.imageUrl || ""} alt={rp.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  </div>
                  <div className="p-3">
                    <h3 className="text-xs font-bold text-brown-deep truncate group-hover:text-gold transition-colors">{rp.name}</h3>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-2.5 h-2.5 fill-gold text-gold" />
                      <span className="text-[10px] text-brown-mid">{rp.rating.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-sm font-bold text-brown-deep">${rp.price.toFixed(2)}</span>
                      {rp.compareAt && <span className="text-[10px] text-brown-mid line-through">${rp.compareAt.toFixed(2)}</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back to products */}
        <div className="mt-12 text-center">
          <Link href="/products" className="inline-flex items-center gap-2 text-brown-mid hover:text-gold transition text-sm">
            <ChevronLeft className="w-4 h-4" /> Back to all products
          </Link>
        </div>
      </div>

      {/* Mobile Sticky Buy Bar */}
      <div className={`fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-gold/10 p-3 md:hidden transition-transform duration-300 ${
        showMobileBar ? 'translate-y-0' : 'translate-y-full'
      }`}>
        <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-brown-deep">${product ? (product.price * quantity).toFixed(2) : '0.00'}</span>
              {product?.compareAt && (
                <span className="text-xs text-brown-mid line-through">${(product.compareAt * quantity).toFixed(2)}</span>
              )}
            </div>
            <p className="text-[10px] text-brown-mid">Qty: {quantity}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAddToCart}
              disabled={!product || product.stock <= 0}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                addedFlash
                  ? 'bg-brown-deep text-white'
                  : 'bg-white-soft border border-gold/10 text-brown-mid hover:text-brown-deep'
              }`}
            >
              {addedFlash ? (
                <><Check className="w-3.5 h-3.5" /> Added</>
              ) : (
                <><ShoppingCart className="w-3.5 h-3.5" /> Cart</>
              )}
            </button>
            <button
              onClick={handleBuyNow}
              disabled={!product || product.stock <= 0 || buying}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#E8A94C] to-[#D48832] text-[#0D0D12] hover:shadow-lg transition-all flex items-center gap-1.5"
            >
              {buying ? '⏳' : <><Zap className="w-3.5 h-3.5" /> Buy</>}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom padding for mobile sticky bar */}
      {showMobileBar && <div className="h-20 md:hidden" />}
    </div>
  )
}
