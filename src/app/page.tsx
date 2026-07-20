"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import ParticleBackground from "@/components/ParticleBackground"
import { useCart } from "@/context/CartContext"
import {
  ShoppingCart, Star, Shield, Truck, RotateCcw,
  Plus, X, CheckCircle, Zap, Award, Globe,
  Clock, TrendingUp, Users, MessageCircle,
  ArrowRight, Maximize2, Sun, Lock, Headphones,
  Package, Eye, BarChart3, Film, Battery, Wifi, Monitor,
  Smartphone, Speaker, Weight, Gamepad2,
  Check, Minus, Mail, Image, Camera,
  Download, ThumbsUp, Video, Sparkles, Moon,
  Heart, Quote, ChevronRight, ExternalLink,
  HeadphonesIcon, SmartphoneIcon, Laptop, Watch,
  Lightbulb, SpeakerIcon, Cpu, ChevronDown,
  Layers, Palette, RefreshCw, Gift, Gem
} from "lucide-react"

// ===== HOOK: SCROLL REVEAL =====
function useReveal(threshold = 0.08) {
  const ref = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || revealed) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setRevealed(true); observer.disconnect() } },
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, revealed])

  return { ref, revealed }
}

function RevealWrapper({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, revealed } = useReveal(0.05)
  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-900`}
      style={{
        opacity: revealed ? 1 : 0,
        transform: revealed ? "translateY(0) scale(1)" : "translateY(40px) scale(0.97)",
        filter: revealed ? "blur(0)" : "blur(4px)",
        transitionDelay: `${delay}ms`,
        transitionProperty: "opacity, transform, filter",
        transitionDuration: "900ms",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {children}
    </div>
  )
}

// ===== PRODUCT CATEGORIES =====
const CATEGORIES = [
  { name: "Audio", icon: HeadphonesIcon, desc: "Premium earbuds, headphones & speakers", color: "#E8A94C", emoji: "🎧", count: 3 },
  { name: "Charging", icon: Battery, desc: "GaN chargers, cables & power banks", color: "#34D399", emoji: "⚡", count: 3 },
  { name: "Gaming", icon: Gamepad2, desc: "Controllers, cables & gaming gear", color: "#6C63FF", emoji: "🎮", count: 2 },
  { name: "Laptop Accessories", icon: Laptop, desc: "Sleeves, stands & USB-C hubs", color: "#F97316", emoji: "💻", count: 3 },
  { name: "Phone Accessories", icon: SmartphoneIcon, desc: "Cases, grips & magnetic stands", color: "#EC4899", emoji: "📱", count: 3 },
  { name: "Smart Home", icon: Lightbulb, desc: "Smart bulbs, plugs & security", color: "#06B6D4", emoji: "💡", count: 3 },
  { name: "Wearables", icon: Watch, desc: "Smart watches & fitness trackers", color: "#A855F7", emoji: "⌚", count: 1 },
  { name: "Projectors", icon: Film, desc: "Mini projectors & accessories", color: "#E8A94C", emoji: "📽️", count: 1 },
]

// ===== STATS =====
const STATS = [
  { label: "Happy Customers", value: "12,000+", icon: Users },
  { label: "Countries Shipped", value: "30+", icon: Globe },
  { label: "Product Categories", value: "8", icon: Package },
  { label: "Avg Rating", value: "4.5★", icon: Star },
]

// ===== FEATURES =====
const FEATURES = [
  { title: "Premium Quality", desc: "Every product is personally tested before it reaches our store.", icon: Gem, color: "#E8A94C" },
  { title: "2-Year Warranty", desc: "All products come with a minimum 1-year hassle-free warranty.", icon: Shield, color: "#34D399" },
  { title: "Free Shipping", desc: "Free to 30+ countries on orders over $50. Delivered in 7-15 days.", icon: Truck, color: "#6C63FF" },
  { title: "30-Day Returns", desc: "Not happy? Return within 30 days for a full refund. No restocking fee.", icon: RotateCcw, color: "#F97316" },
  { title: "24/7 Support", desc: "Real humans on WhatsApp, email, and chat. Response under 2 hours.", icon: MessageCircle, color: "#25D366" },
  { title: "Secure Checkout", desc: "256-bit SSL encryption. Cards, PayPal, and Apple Pay accepted.", icon: Lock, color: "#A855F7" },
]

// ===== REVIEWS =====
const REVIEWS = [
  { name: "Ahmed K.", location: "Dubai, UAE", rating: 5, title: "Exceptional quality!", text: "Ordered the GaN charger and it arrived in 5 days. The build quality is premium — feels like a $80 charger, not a $35 one." },
  { name: "Sarah M.", location: "London, UK", rating: 5, title: "Beautiful products", text: "The leather sleeve is gorgeous. Real quality craftsmanship. My MacBook fits perfectly and looks so elegant." },
  { name: "Raj P.", location: "Mumbai, India", rating: 5, title: "Best customer service", text: "Had an issue with my order and they resolved it within 2 hours on WhatsApp. Truly exceptional support." },
  { name: "Emma L.", location: "Sydney, AUS", rating: 4, title: "Great value for money", text: "The wireless earbuds sound incredible for the price. Battery life is amazing. Would recommend!" },
  { name: "Carlos G.", location: "Mexico City, MX", rating: 5, title: "Fast shipping!", text: "Ordered on Monday, arrived by Friday from across the world. Very impressed with the shipping speed." },
  { name: "Aisha R.", location: "Riyadh, KSA", rating: 5, title: "My go-to tech store", text: "Third time ordering from WM Duo. Always consistent quality. The gaming accessories are top-tier." },
]

// ===== FAQ =====
const FAQ_DATA = [
  { q: "How long does shipping take?", a: "Orders ship within 24 hours. Standard delivery takes 7-15 business days worldwide. Express shipping (3-5 days) is available at checkout." },
  { q: "What is your return policy?", a: "We offer 30-day hassle-free returns. Items must be unused and in original packaging. We provide a prepaid return label." },
  { q: "Do you ship internationally?", a: "Yes! We ship to over 30 countries. Free shipping on orders over $50. Duties and taxes are calculated at checkout." },
  { q: "Are payments secure?", a: "Absolutely. We use 256-bit SSL encryption and partner with Stripe for payment processing. Your data is never stored on our servers." },
  { q: "How do I track my order?", a: "Once shipped, you'll receive a tracking number via email. You can also track orders in your account dashboard." },
  { q: "What warranty do you offer?", a: "All electronics come with a 2-year warranty. Accessories carry a 1-year warranty. We stand behind everything we sell." },
]

// ===== PRODUCT CARD =====
function ProductCard({ product, index }: { product: any; index: number }) {
  const { addItem, items } = useCart()
  const [added, setAdded] = useState(false)
  const cartItem = items.find(i => i.productId === product.id)
  const quantity = cartItem?.quantity || 0
  const hasDiscount = product.compareAt && product.compareAt > product.price
  const discount = hasDiscount ? Math.round((1 - product.price / product.compareAt) * 100) : 0
  const lowStock = product.stock !== null && product.stock <= 5 && product.stock > 0

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({ productId: product.id, name: product.name, price: product.price, imageUrl: product.image || "", slug: product.slug, stock: product.stock ?? 0 })
    setAdded(true)
    setTimeout(() => setAdded(false), 800)
  }

  return (
    <div
      className="group relative bg-gradient-to-b from-[#1A1A23]/80 to-[#14141A]/80 backdrop-blur-xl rounded-3xl border border-[#2A2A35]/50 overflow-hidden transition-all duration-700 hover:border-[#E8A94C]/30 hover:shadow-2xl hover:shadow-[#E8A94C]/5 hover:-translate-y-2"
      style={{
        animation: `float-in 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${index * 80}ms forwards`,
        opacity: 0,
      }}
    >
      {/* Glow effect on hover */}
      <div className="absolute -inset-1 bg-gradient-to-r from-[#E8A94C]/0 via-[#E8A94C]/0 to-[#E8A94C]/0 group-hover:from-[#E8A94C]/5 group-hover:via-[#E8A94C]/3 group-hover:to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 rounded-3xl blur-xl pointer-events-none" />

      {/* Image */}
      <Link href={`/products/${product.slug}`} className="block relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-[#1A1A23] to-[#14141A]">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl opacity-30 group-hover:scale-125 group-hover:opacity-50 transition-all duration-700">◈</span>
          </div>
        )}
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D12]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Discount badge */}
        {hasDiscount && (
          <div className="absolute top-3 left-3 px-2.5 py-1 bg-gradient-to-r from-[#34D399] to-[#059669] rounded-full text-xs font-bold text-white shadow-lg shadow-green-500/20">
            -{discount}%
          </div>
        )}

        {/* Low stock badge */}
        {lowStock && (
          <div className="absolute top-3 right-3 px-2.5 py-1 bg-[#EF4444]/90 rounded-full text-xs font-bold text-white shadow-lg shadow-red-500/20 animate-pulse-subtle">
            Only {product.stock} left
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-4 sm:p-5 relative z-10">
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-[#E8A94C]">{product.category || "Tech"}</span>
          {product.rating && (
            <span className="flex items-center gap-1 text-[11px] text-[#A1A1AA] ml-auto">
              <Star className="w-3 h-3 fill-[#E8A94C] text-[#E8A94C]" />
              {product.rating}
            </span>
          )}
        </div>

        <Link href={`/products/${product.slug}`}>
          <h3 className="font-bold text-white text-sm sm:text-base leading-tight mb-1 line-clamp-2 group-hover:text-[#E8A94C] transition-colors duration-300">
            {product.name}
          </h3>
        </Link>

        {product.description && (
          <p className="text-xs text-[#71717A] line-clamp-2 mb-3 min-h-[2em]">{product.description}</p>
        )}

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-white">${product.price.toFixed(2)}</span>
            {hasDiscount && (
              <span className="text-xs text-[#71717A] line-through">${product.compareAt.toFixed(2)}</span>
            )}
          </div>

          <button
            onClick={handleAdd}
            disabled={product.stock === 0}
            className={`relative flex items-center justify-center w-10 h-10 rounded-2xl transition-all duration-300 active:scale-90 ${
              product.stock === 0
                ? "bg-[#2A2A35] text-[#52525B] cursor-not-allowed"
                : added
                ? "bg-[#34D399] text-white shadow-lg shadow-green-500/20"
                : "bg-gradient-to-br from-[#E8A94C] to-[#D48832] text-white shadow-lg shadow-[#E8A94C]/20 hover:shadow-xl hover:shadow-[#E8A94C]/30 hover:-translate-y-0.5"
            }`}
          >
            {product.stock === 0 ? (
              <X className="w-4 h-4" />
            ) : added ? (
              <Check className="w-4 h-4" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
          </button>
        </div>

        {quantity > 0 && (
          <div className="mt-2 flex items-center gap-2 text-[11px] text-[#34D399] font-medium">
            <CheckCircle className="w-3 h-3" />
            {quantity} in cart
          </div>
        )}
      </div>
    </div>
  )
}

// ===== CATEGORY CARD =====
function CategoryCard({ cat, index }: { cat: typeof CATEGORIES[0]; index: number }) {
  return (
    <Link
      href={`/products?category=${encodeURIComponent(cat.name)}`}
      className="group relative bg-gradient-to-b from-[#1A1A23]/60 to-[#14141A]/60 backdrop-blur-xl rounded-3xl border border-[#2A2A35]/40 p-6 transition-all duration-500 hover:border-[#E8A94C]/25 hover:shadow-2xl hover:shadow-[#E8A94C]/5 overflow-hidden"
      style={{
        animation: `float-in 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${index * 80}ms forwards`,
        opacity: 0,
      }}
    >
      {/* Hover glow */}
      <div
        className="absolute -inset-1 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl blur-2xl pointer-events-none"
        style={{ background: `radial-gradient(ellipse at center, ${cat.color}15, transparent 70%)` }}
      />
      {/* Border glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none"
        style={{ boxShadow: `inset 0 0 30px ${cat.color}08` }}
      />

      {/* Emoji icon */}
      <div className="relative z-10 mb-4">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-1"
          style={{ background: `${cat.color}15` }}
        >
          {cat.emoji}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <h3 className="font-bold text-white text-base mb-1 group-hover:text-[#E8A94C] transition-colors duration-300">{cat.name}</h3>
        <p className="text-xs text-[#71717A] mb-3 line-clamp-2">{cat.desc}</p>
        <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: cat.color }}>
          <span>{cat.count} products</span>
          <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
        </div>
      </div>
    </Link>
  )
}

// ===== STATS BANNER =====
function StatsBanner() {
  return (
    <section className="relative py-16 sm:py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[#0D0D12] via-[#1A1A23] to-[#0D0D12]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(232,169,76,0.03)_0%,_transparent_70%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
          {STATS.map((stat, i) => {
            const Icon = stat.icon
            return (
              <RevealWrapper key={stat.label} delay={i * 100}>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E8A94C]/10 to-transparent border border-[#E8A94C]/10 flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-5 h-5 text-[#E8A94C]" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black gradient-text-glow mb-0.5">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-[#71717A] font-medium">{stat.label}</div>
                </div>
              </RevealWrapper>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ===== HERO SECTION =====
function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-40 sm:pt-36 pb-20 overflow-hidden">
      {/* Aurora background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D12] via-[#0D0D12] to-[#14141A]" />
      <div
        className="absolute top-[-20%] left-[-10%] w-[80%] h-[70%] rounded-full opacity-20 animate-aurora pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 30% 50%, rgba(232,169,76,0.15) 0%, rgba(124,58,237,0.08) 40%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[60%] rounded-full opacity-20 animate-aurora pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 70% 50%, rgba(124,58,237,0.12) 0%, rgba(232,169,76,0.06) 40%, transparent 70%)",
          animationDelay: "5s",
          animationDirection: "reverse",
        }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[70%] bg-[radial-gradient(ellipse_at_center,_rgba(232,169,76,0.03)_0%,_transparent_70%)]" />

      {/* Grid effect */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(232,169,76,1) 1px, transparent 1px), linear-gradient(90deg, rgba(232,169,76,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Floating orbs */}
      <div className="absolute top-[20%] left-[15%] w-3 h-3 rounded-full bg-[#E8A94C]/30 blur-sm animate-drift pointer-events-none" />
      <div className="absolute top-[60%] right-[20%] w-2 h-2 rounded-full bg-[#A78BFA]/30 blur-sm animate-drift pointer-events-none" style={{ animationDelay: "2s" }} />
      <div className="absolute bottom-[30%] left-[40%] w-4 h-4 rounded-full bg-[#34D399]/20 blur-sm animate-drift pointer-events-none" style={{ animationDelay: "4s" }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10">
        <div className="space-y-8 max-w-xl">
          <RevealWrapper delay={100}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#1A1A23]/80 backdrop-blur-xl border border-[#2A2A35]/50 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-[#E8A94C]" />
              <span className="text-xs font-medium text-[#A1A1AA]">Premium Tech Accessories Store</span>
            </div>
          </RevealWrapper>

          <RevealWrapper delay={200}>
            <h1 className="font-['Playfair_Display',serif] text-[clamp(2.8rem,7vw,5rem)] font-bold leading-[1.05] tracking-[-0.02em] text-balance">
              <span className="text-white">Premium Tech</span>
              <br />
              <span className="gradient-text-glow">For Everyday Life</span>
            </h1>
          </RevealWrapper>

          <RevealWrapper delay={300}>
            <p className="text-lg text-[#A1A1AA] leading-relaxed max-w-md text-balance">
              Curated audio, charging, gaming, smart home & more. Every product tested for quality — backed by our satisfaction guarantee.
            </p>
          </RevealWrapper>

          <RevealWrapper delay={400}>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/products"
                className="group relative inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#E8A94C] to-[#D48832] text-white px-10 py-4 rounded-2xl font-semibold text-base overflow-hidden shadow-lg hover:shadow-xl hover:shadow-[#E8A94C]/20 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
              >
                <span className="relative z-10 flex items-center gap-2.5">
                  <ShoppingCart className="w-4 h-4" />
                  Shop All Products
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <Link
                href="/#categories"
                className="inline-flex items-center justify-center gap-2 border border-[#2A2A35]/60 bg-[#1A1A23]/50 backdrop-blur-sm text-[#E4E4E7] px-8 py-4 rounded-2xl font-semibold hover:border-[#E8A94C]/30 hover:bg-[#1A1A23]/80 transition-all duration-300"
              >
                Browse Categories
              </Link>
            </div>
          </RevealWrapper>

          <RevealWrapper delay={500}>
            <div className="flex flex-wrap gap-x-8 gap-y-2 text-xs sm:text-sm text-[#71717A]">
              <span className="flex items-center gap-1.5"><Truck className="w-3.5 h-3.5 text-[#E8A94C]" /> Free Shipping $50+</span>
              <span className="flex items-center gap-1.5"><RotateCcw className="w-3.5 h-3.5 text-[#6C63FF]" /> 30-Day Returns</span>
              <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-[#34D399]" /> 2-Year Warranty</span>
              <span className="flex items-center gap-1.5"><MessageCircle className="w-3.5 h-3.5 text-[#25D366]" /> 24/7 Support</span>
            </div>
          </RevealWrapper>
        </div>

        {/* Hero Right - Floating Category Showcase */}
        <div className="hidden lg:grid grid-cols-2 gap-3">
          {CATEGORIES.slice(0, 4).map((cat, i) => (
            <Link
              key={cat.name}
              href={`/products?category=${encodeURIComponent(cat.name)}`}
              className="group aspect-square rounded-2xl bg-gradient-to-br from-[#1A1A23]/60 to-[#14141A]/60 backdrop-blur-xl border border-[#2A2A35]/40 flex flex-col items-center justify-center gap-3 hover:border-[#E8A94C]/25 hover:-translate-y-1.5 transition-all duration-500 hover:shadow-xl hover:shadow-[#E8A94C]/5 overflow-hidden relative"
              style={{
                animation: `float-in 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${(i + 4) * 80}ms forwards`,
                opacity: 0,
              }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{ background: `radial-gradient(ellipse at center, ${cat.color}10, transparent 70%)` }}
              />
              <span className="text-5xl group-hover:scale-125 group-hover:-translate-y-1 transition-all duration-500">{cat.emoji}</span>
              <span className="text-sm font-bold text-white group-hover:text-[#E8A94C] transition-colors">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#52525B] animate-float">
        <span className="text-[10px] font-medium tracking-widest uppercase">Scroll</span>
        <ChevronDown className="w-4 h-4" />
      </div>
    </section>
  )
}

// ===== FEATURED PRODUCTS =====
function FeaturedProductsSection() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { ref, revealed } = useReveal(0.02)

  useEffect(() => {
    fetch("/api/products")
      .then(r => r.json())
      .then(data => { setProducts(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const displayProducts = products.slice(0, 8)

  return (
    <section id="products" className="relative py-20 sm:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#14141A] via-[#0D0D12] to-[#14141A]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <RevealWrapper>
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#E8A94C]/10 border border-[#E8A94C]/20 rounded-full text-xs font-semibold text-[#E8A94C] mb-4">
              <Sparkles className="w-3 h-3" />
              OUR COLLECTION
            </div>
            <h2 className="font-['Playfair_Display',serif] text-3xl sm:text-5xl font-bold text-white mb-3">
              Premium Tech <span className="gradient-text-glow">Accessories</span>
            </h2>
            <p className="text-[#71717A] max-w-2xl mx-auto text-sm sm:text-base">
              Curated products across audio, charging, gaming, smart home & more — tested for quality, built to last.
            </p>
          </div>
        </RevealWrapper>

        <div ref={ref} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-[#1A1A23] rounded-3xl border border-[#2A2A35]/50 animate-pulse overflow-hidden">
                  <div className="aspect-[4/3] bg-[#2A2A35]/30" />
                  <div className="p-4 sm:p-5 space-y-3">
                    <div className="h-3 bg-[#2A2A35]/30 rounded-full w-1/3" />
                    <div className="h-4 bg-[#2A2A35]/30 rounded-full w-3/4" />
                    <div className="h-3 bg-[#2A2A35]/30 rounded-full w-1/2" />
                    <div className="h-8 bg-[#2A2A35]/30 rounded-2xl w-full" />
                  </div>
                </div>
              ))
            : displayProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))
          }
        </div>

        {!loading && products.length > 8 && (
          <RevealWrapper delay={200}>
            <div className="text-center mt-12">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#E8A94C] to-[#D48832] text-white px-8 py-3.5 rounded-2xl font-semibold text-sm hover:shadow-xl hover:shadow-[#E8A94C]/20 transition-all duration-300 hover:-translate-y-0.5"
              >
                View All Products <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </RevealWrapper>
        )}
      </div>
    </section>
  )
}

// ===== CATEGORIES SECTION =====
function CategoriesSection() {
  return (
    <section id="categories" className="relative py-20 sm:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D12] via-[#14141A] to-[#0D0D12]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,_rgba(232,169,76,0.02)_0%,_transparent_50%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <RevealWrapper>
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#6C63FF]/10 border border-[#6C63FF]/20 rounded-full text-xs font-semibold text-[#6C63FF] mb-4">
              <Layers className="w-3 h-3" />
              CATEGORIES
            </div>
            <h2 className="font-['Playfair_Display',serif] text-3xl sm:text-5xl font-bold text-white mb-3">
              Shop By <span className="gradient-text-cool">Category</span>
            </h2>
            <p className="text-[#71717A] max-w-xl mx-auto text-sm sm:text-base">
              Everything you need — from audio to smart home, all premium quality.
            </p>
          </div>
        </RevealWrapper>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {CATEGORIES.map((cat, i) => (
            <CategoryCard key={cat.name} cat={cat} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ===== FEATURES SECTION =====
function FeaturesSection() {
  return (
    <section id="features" className="relative py-20 sm:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D12] via-[#0D0D12] to-[#14141A]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <RevealWrapper>
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#34D399]/10 border border-[#34D399]/20 rounded-full text-xs font-semibold text-[#34D399] mb-4">
              <Gem className="w-3 h-3" />
              WHY WM DUO
            </div>
            <h2 className="font-['Playfair_Display',serif] text-3xl sm:text-5xl font-bold text-white mb-3">
              The WM Duo <span className="gradient-text-warm">Difference</span>
            </h2>
            <p className="text-[#71717A] max-w-xl mx-auto text-sm sm:text-base">
              We don&apos;t just sell tech — we curate the best, test everything, and stand behind every product.
            </p>
          </div>
        </RevealWrapper>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {FEATURES.map((feat, i) => {
            const Icon = feat.icon
            return (
              <RevealWrapper key={feat.title} delay={i * 80}>
                <div
                  className="group relative bg-gradient-to-b from-[#1A1A23]/60 to-[#14141A]/60 backdrop-blur-xl rounded-3xl border border-[#2A2A35]/40 p-6 sm:p-8 transition-all duration-500 hover:border-[#E8A94C]/20 hover:shadow-xl hover:shadow-[#E8A94C]/5 overflow-hidden"
                >
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    style={{ background: `radial-gradient(ellipse at 30% 20%, ${feat.color}08, transparent 70%)` }}
                  />
                  <div className="relative z-10">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-1"
                      style={{ background: `${feat.color}15` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: feat.color }} />
                    </div>
                    <h3 className="font-bold text-white text-base mb-2">{feat.title}</h3>
                    <p className="text-sm text-[#71717A] leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              </RevealWrapper>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ===== REVIEWS SECTION =====
function ReviewsSection() {
  return (
    <section id="reviews" className="relative py-20 sm:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#14141A] to-[#0D0D12]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_50%,_rgba(232,169,76,0.02)_0%,_transparent_50%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <RevealWrapper>
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#E8A94C]/10 border border-[#E8A94C]/20 rounded-full text-xs font-semibold text-[#E8A94C] mb-4">
              <MessageCircle className="w-3 h-3" />
              <span className="text-[#E8A94C]">4.5/5</span> — 2,000+ Reviews
            </div>
            <h2 className="font-['Playfair_Display',serif] text-3xl sm:text-5xl font-bold text-white mb-3">
              What Our <span className="gradient-text-glow">Customers Say</span>
            </h2>
          </div>
        </RevealWrapper>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {REVIEWS.map((review, i) => (
            <RevealWrapper key={i} delay={i * 80}>
              <div className="group relative bg-gradient-to-b from-[#1A1A23]/60 to-[#14141A]/60 backdrop-blur-xl rounded-3xl border border-[#2A2A35]/40 p-6 transition-all duration-500 hover:border-[#E8A94C]/20 hover:shadow-xl hover:shadow-[#E8A94C]/5">
                <Quote className="w-6 h-6 text-[#E8A94C]/20 absolute top-4 right-4" />
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star
                      key={s}
                      className={`w-4 h-4 ${s < review.rating ? "fill-[#E8A94C] text-[#E8A94C]" : "text-[#2A2A35]"}`}
                    />
                  ))}
                </div>
                <h4 className="font-semibold text-white text-sm mb-1">{review.title}</h4>
                <p className="text-sm text-[#71717A] leading-relaxed mb-4">&ldquo;{review.text}&rdquo;</p>
                <div className="flex items-center gap-3 pt-3 border-t border-[#2A2A35]/30">
                  <div className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center text-white text-xs font-bold">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{review.name}</p>
                    <p className="text-xs text-[#71717A]">{review.location}</p>
                  </div>
                </div>
              </div>
            </RevealWrapper>
          ))}
        </div>
      </div>
    </section>
  )
}

// ===== FAQ SECTION =====
function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faq" className="relative py-20 sm:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D12] via-[#14141A] to-[#0D0D12]" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <RevealWrapper>
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#6C63FF]/10 border border-[#6C63FF]/20 rounded-full text-xs font-semibold text-[#6C63FF] mb-4">
              <MessageCircle className="w-3 h-3" />
              FAQ
            </div>
            <h2 className="font-['Playfair_Display',serif] text-3xl sm:text-5xl font-bold text-white mb-3">
              Got <span className="gradient-text-cool">Questions?</span>
            </h2>
            <p className="text-[#71717A] text-sm">Everything you need to know about shopping at WM Duo.</p>
          </div>
        </RevealWrapper>

        <div className="space-y-3">
          {FAQ_DATA.map((faq, i) => (
            <RevealWrapper key={i} delay={i * 50}>
              <div
                className="bg-gradient-to-b from-[#1A1A23]/60 to-[#14141A]/60 backdrop-blur-xl rounded-2xl border border-[#2A2A35]/40 overflow-hidden transition-all duration-300 hover:border-[#E8A94C]/20 cursor-pointer"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <div className="flex items-center justify-between p-5 sm:p-6">
                  <h3 className="font-semibold text-white text-sm sm:text-base pr-4">{faq.q}</h3>
                  <div
                    className={`w-8 h-8 rounded-xl bg-[#2A2A35]/50 flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      openIndex === i ? "bg-[#E8A94C]/20 rotate-45" : ""
                    }`}
                  >
                    <Plus className="w-4 h-4 text-[#A1A1AA]" />
                  </div>
                </div>
                <div
                  className="transition-all duration-400 overflow-hidden"
                  style={{ maxHeight: openIndex === i ? "300px" : "0px" }}
                >
                  <p className="px-5 sm:px-6 pb-5 sm:pb-6 text-sm text-[#71717A] leading-relaxed">{faq.a}</p>
                </div>
              </div>
            </RevealWrapper>
          ))}
        </div>
      </div>
    </section>
  )
}

// ===== FINAL CTA =====
function FinalCTA() {
  return (
    <section className="relative py-20 sm:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D12] via-[#0D0D12] to-[#14141A]" />
      <div
        className="absolute top-[-30%] left-[-10%] w-[120%] h-[100%] opacity-10 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, rgba(232,169,76,0.1) 0%, rgba(124,58,237,0.05) 40%, transparent 70%)",
        }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <RevealWrapper>
          <div className="bg-gradient-to-b from-[#1A1A23]/80 to-[#14141A]/80 backdrop-blur-2xl rounded-3xl sm:rounded-4xl border border-[#2A2A35]/50 p-10 sm:p-16 shadow-premium-xl relative overflow-hidden">
            {/* Top gradient bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E8A94C] via-[#A78BFA] to-[#34D399]" />

            <div className="relative z-10">
              <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#7C3AED]/20">
                <ShoppingCart className="w-8 h-8 text-white" />
              </div>
              <h2 className="font-['Playfair_Display',serif] text-3xl sm:text-5xl font-bold text-white mb-4">
                Ready to Level Up Your <span className="gradient-text-glow">Tech</span>?
              </h2>
              <p className="text-[#A1A1AA] max-w-lg mx-auto mb-8 text-sm sm:text-base">
                Join 12,000+ happy customers worldwide. Free shipping, 30-day returns, and 24/7 support.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <Link
                  href="/products"
                  className="group inline-flex items-center gap-2.5 bg-gradient-to-r from-[#E8A94C] to-[#D48832] text-white px-10 py-4 rounded-2xl font-semibold text-base shadow-lg hover:shadow-xl hover:shadow-[#E8A94C]/20 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Shop Now
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/#contact"
                  className="inline-flex items-center gap-2 border border-[#2A2A35]/60 text-[#E4E4E7] px-8 py-4 rounded-2xl font-semibold hover:border-[#E8A94C]/30 hover:bg-[#1A1A23]/80 transition-all duration-300"
                >
                  <MessageCircle className="w-4 h-4" />
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </RevealWrapper>
      </div>
    </section>
  )
}

// ===== CONTACT SECTION =====
function ContactSection() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        setSubmitted(true)
        setFormData({ name: "", email: "", message: "" })
        setTimeout(() => setSubmitted(false), 5000)
      }
    } catch {}
  }

  return (
    <section id="contact" className="relative py-20 sm:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#14141A] to-[#0D0D12]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <RevealWrapper>
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#25D366]/10 border border-[#25D366]/20 rounded-full text-xs font-semibold text-[#25D366] mb-4">
              <MessageCircle className="w-3 h-3" />
              GET IN TOUCH
            </div>
            <h2 className="font-['Playfair_Display',serif] text-3xl sm:text-5xl font-bold text-white mb-3">
              We&apos;re Here to <span className="gradient-text-warm">Help</span>
            </h2>
            <p className="text-[#71717A] text-sm">Questions? Reach out — we respond within 2 hours.</p>
          </div>
        </RevealWrapper>

        <div className="grid md:grid-cols-[1fr_1.5fr] gap-8 max-w-4xl mx-auto">
          <RevealWrapper delay={100}>
            <div className="space-y-5">
              <div className="bg-gradient-to-b from-[#1A1A23]/60 to-[#14141A]/60 backdrop-blur-xl rounded-2xl border border-[#2A2A35]/40 p-5">
                <MessageCircle className="w-5 h-5 text-[#25D366] mb-2" />
                <h3 className="font-semibold text-white text-sm mb-1">WhatsApp</h3>
                <p className="text-xs text-[#71717A]">Fastest response — typically under 10 minutes.</p>
              </div>
              <div className="bg-gradient-to-b from-[#1A1A23]/60 to-[#14141A]/60 backdrop-blur-xl rounded-2xl border border-[#2A2A35]/40 p-5">
                <Mail className="w-5 h-5 text-[#E8A94C] mb-2" />
                <h3 className="font-semibold text-white text-sm mb-1">Email</h3>
                <p className="text-xs text-[#71717A]">hello@wmduo.com — response within 24 hours.</p>
              </div>
              <div className="bg-gradient-to-b from-[#1A1A23]/60 to-[#14141A]/60 backdrop-blur-xl rounded-2xl border border-[#2A2A35]/40 p-5">
                <Shield className="w-5 h-5 text-[#6C63FF] mb-2" />
                <h3 className="font-semibold text-white text-sm mb-1">Live Chat</h3>
                <p className="text-xs text-[#71717A]">Available 24/7 on our website.</p>
              </div>
            </div>
          </RevealWrapper>

          <RevealWrapper delay={200}>
            <form onSubmit={handleSubmit} className="bg-gradient-to-b from-[#1A1A23]/60 to-[#14141A]/60 backdrop-blur-xl rounded-3xl border border-[#2A2A35]/40 p-6 sm:p-8">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <CheckCircle className="w-12 h-12 text-[#34D399] mb-4" />
                  <h3 className="font-bold text-white text-lg mb-1">Message Sent!</h3>
                  <p className="text-sm text-[#71717A]">We&apos;ll get back to you within 24 hours.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                      className="w-full bg-[#0D0D12] border border-[#2A2A35]/60 rounded-xl px-4 py-3 text-sm text-white placeholder-[#52525B] focus:outline-none focus:border-[#E8A94C]/40 focus:ring-1 focus:ring-[#E8A94C]/20 transition-all"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                      className="w-full bg-[#0D0D12] border border-[#2A2A35]/60 rounded-xl px-4 py-3 text-sm text-white placeholder-[#52525B] focus:outline-none focus:border-[#E8A94C]/40 focus:ring-1 focus:ring-[#E8A94C]/20 transition-all"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">Message</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                      className="w-full bg-[#0D0D12] border border-[#2A2A35]/60 rounded-xl px-4 py-3 text-sm text-white placeholder-[#52525B] focus:outline-none focus:border-[#E8A94C]/40 focus:ring-1 focus:ring-[#E8A94C]/20 transition-all resize-none"
                      placeholder="How can we help?"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#E8A94C] to-[#D48832] text-white py-3.5 rounded-2xl font-semibold text-sm hover:shadow-xl hover:shadow-[#E8A94C]/20 transition-all duration-300 active:scale-[0.98]"
                  >
                    Send Message
                  </button>
                </div>
              )}
            </form>
          </RevealWrapper>
        </div>
      </div>
    </section>
  )
}

// ===== HOME PAGE =====
export default function Home() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 200)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      {/* Particle Background */}
      <ParticleBackground />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen bg-[#0D0D12] font-['Inter',system-ui,sans-serif] overflow-x-hidden">
        <Navbar />

        {/* Hero */}
        <HeroSection />

        {/* Stats */}
        <StatsBanner />

        {/* Categories */}
        <CategoriesSection />

        {/* Featured Products */}
        <FeaturedProductsSection />

        {/* Features */}
        <FeaturesSection />

        {/* Reviews */}
        <ReviewsSection />

        {/* FAQ */}
        <FAQSection />

        {/* CTA */}
        <FinalCTA />

        {/* Contact */}
        <ContactSection />

        {/* WhatsApp Float */}
        <a
          href="https://wa.me/1234567890"
          target="_blank"
          rel="noopener noreferrer"
          className={`fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-xl shadow-[#25D366]/30 hover:shadow-2xl hover:shadow-[#25D366]/40 hover:scale-110 active:scale-95 transition-all duration-300 ${
            scrolled ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
          }`}
        >
          <MessageCircle className="w-7 h-7 text-white" />
        </a>

        {/* Footer */}
        <Footer />
      </div>
    </>
  )
}
