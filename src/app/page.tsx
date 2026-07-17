"use client"

import { useState, useEffect, useRef } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { ShoppingCart, Star, Shield, Truck, RotateCcw, ChevronDown, Plus, X, Phone, CheckCircle, Zap, Award, Globe, Heart, Sparkles, Clock, TrendingUp, Users, MessageCircle, Play } from "lucide-react"

// ===== DATA =====
const FOMO_USERS = [
  { name: "Sarah", from: "New York", flag: "🇺🇸" },
  { name: "James", from: "London", flag: "🇬🇧" },
  { name: "Maria", from: "Berlin", flag: "🇩🇪" },
  { name: "Alex", from: "Toronto", flag: "🇨🇦" },
  { name: "Emma", from: "Sydney", flag: "🇦🇺" },
  { name: "Lucas", from: "Paris", flag: "🇫🇷" },
  { name: "Fatima", from: "Dubai", flag: "🇦🇪" },
  { name: "Wei", from: "Singapore", flag: "🇸🇬" },
  { name: "Priya", from: "Mumbai", flag: "🇮🇳" },
  { name: "Mike", from: "Los Angeles", flag: "🇺🇸" },
]

const REVIEWS = [
  { initials: "SM", color: "from-purple-500 to-indigo-600", name: "Sarah M.", location: "New York, USA", title: "Completely transformed my room!", text: "The CastleView projector completely transformed my bedroom. I get compliments every time someone sees it. The 210° rotation is genius — I can project on my ceiling while lying in bed. Best purchase this year!" },
  { initials: "JK", color: "from-blue-500 to-cyan-600", name: "James K.", location: "London, UK", title: "Perfect for windowless rooms", text: "I live in a tiny London flat with no windows in my bedroom. This projector changed everything. It feels like I have a castle window now! My friends are obsessed." },
  { initials: "MR", color: "from-emerald-500 to-teal-600", name: "Maria R.", location: "Berlin, Germany", title: "Dorm room essential!", text: "Bought this for my daughter's dorm room. Her roommate loved it so much they bought one too. The 210° rotation is perfect for small spaces. Amazing quality for the price." },
  { initials: "AL", color: "from-amber-500 to-orange-600", name: "Alex L.", location: "Toronto, Canada", title: "Better than expected!", text: "Was skeptical at first but this thing is amazing. The castle projection is so realistic. Setup took 2 minutes. Battery lasts long enough for a movie. Highly recommend!" },
]

const FAQS = [
  { q: "What is the CastleView™ projector?", a: "The CastleView™ is a mini smart projector with a patented 210° rotating arm that creates stunning castle window projections on any wall or ceiling. It's the #1 TikTok viral fake window projector with 200M+ views worldwide." },
  { q: "Does it really support 4K?", a: "Yes! The CastleView™ supports 4K video input, giving you stunningly sharp and clear projections. The native resolution is 1080p, but it handles 4K content beautifully." },
  { q: "How long does shipping take?", a: "We offer free worldwide shipping! Delivery takes 7-15 business days to the US, UK, Europe, and Asia. All orders are tracked and insured." },
  { q: "What's the return policy?", a: "We offer a 30-day money-back guarantee. If you're not absolutely in love with your CastleView™, return it for a full refund — no questions asked. We also provide a 2-year warranty against defects." },
  { q: "How does the 210° rotation work?", a: "The patented rotating arm allows you to position the projector at any angle — walls, ceilings, corners. You can even project onto the ceiling while lying in bed." },
  { q: "Can I connect my phone or laptop?", a: "Absolutely! Supports wireless screen mirroring from iOS and Android. Also has HDMI and USB ports for laptops, gaming consoles, and streaming sticks." },
]

const FEATURES = [
  { icon: "🏆", title: "#1 TikTok Viral", desc: "50,000+ videos, 200M+ views. The most shared projector on social media." },
  { icon: "🎯", title: "Premium Quality", desc: "Every unit undergoes 48-hour rigorous quality testing before shipping." },
  { icon: "🚚", title: "Free Worldwide Shipping", desc: "Free shipping to US, UK, EU, and Asia. Delivered in 7-15 business days." },
  { icon: "🔄", title: "30-Day Risk Free", desc: "Not in love? Return within 30 days for a full refund. No questions asked." },
  { icon: "💬", title: "24/7 Customer Support", desc: "Real humans, not bots. We're here via chat, email, and WhatsApp." },
  { icon: "🔒", title: "Secure Checkout", desc: "256-bit SSL encryption. We accept Visa, Mastercard, PayPal, Apple Pay." },
  { icon: "🛡️", title: "2-Year Warranty", desc: "Industry-leading warranty. We stand behind every product we sell." },
  { icon: "⭐", title: "4.8★ Average Rating", desc: "2,847 verified reviews. 98% of customers recommend WM Duo." },
]

export default function Home() {
  const [fomo, setFomo] = useState({ show: false, text: "" })
  const [countdown, setCountdown] = useState("04:37:00")
  const [stock, setStock] = useState(7)
  const [sold, setSold] = useState(48)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set())
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map())

  // === FOMO ===
  useEffect(() => {
    const showFomo = () => {
      const user = FOMO_USERS[Math.floor(Math.random() * FOMO_USERS.length)]
      setFomo({ show: true, text: `${user.flag} ${user.name} from ${user.from} just purchased CastleView™` })
      setTimeout(() => setFomo(s => ({ ...s, show: false })), 5000)
    }
    setTimeout(showFomo, 3000)
    const interval = setInterval(showFomo, 10000 + Math.random() * 5000)
    return () => clearInterval(interval)
  }, [])

  // === COUNTDOWN ===
  useEffect(() => {
    const end = new Date()
    end.setHours(end.getHours() + 4, end.getMinutes() + 37, 0, 0)
    const tick = () => {
      const diff = Math.max(0, Math.floor((end.getTime() - Date.now()) / 1000))
      const h = String(Math.floor(diff / 3600)).padStart(2, "0")
      const m = String(Math.floor((diff % 3600) / 60)).padStart(2, "0")
      const s = String(diff % 60).padStart(2, "0")
      setCountdown(`${h}:${m}:${s}`)
    }
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [])

  // === STOCK/SOLD ===
  useEffect(() => {
    const interval = setInterval(() => {
      setStock(s => Math.max(1, s - (Math.random() > 0.6 ? 1 : 0)))
      setSold(s => s + (Math.random() > 0.5 ? Math.floor(Math.random() * 3) + 1 : 0))
    }, 45000)
    return () => clearInterval(interval)
  }, [])

  // === SCROLL ===
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 200)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // === INTERSECTION OBSERVER ===
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisibleSections(prev => new Set(prev).add(entry.target.id))
        }
      })
    }, { threshold: 0.15 })

    document.querySelectorAll("[data-observe]").forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const scrollToOrder = () => document.getElementById("order")?.scrollIntoView({ behavior: "smooth" })

  const AnimatedSection = ({ id, children, className = "" }: { id: string; children: React.ReactNode; className?: string }) => (
    <section
      id={id}
      data-observe
      className={`transition-all duration-1000 ${visibleSections.has(id) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"} ${className}`}
    >
      {children}
    </section>
  )

  return (
    <div className="min-h-screen bg-[#FAFAFE] font-['Inter',system-ui,sans-serif] overflow-x-hidden">
      {/* ===== FOMO NOTIFICATION ===== */}
      <div className={`fixed bottom-28 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-[9999] bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-primary/10 p-4 flex items-center gap-3 transition-all duration-500 ${
        fomo.show ? "translate-x-0 opacity-100 scale-100" : "-translate-x-[150%] opacity-0 scale-95"
      }`}>
        <span className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-primary to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">🔥</span>
        <p className="text-sm text-gray-700 flex-1 leading-relaxed">{fomo.text}</p>
        <button onClick={() => setFomo(s => ({ ...s, show: false }))} className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition">
          <X className="w-3 h-3 text-gray-500" />
        </button>
      </div>

      {/* ===== TOP BAR ===== */}
      <div className="relative z-[60] bg-gradient-to-r from-dark-2 via-purple-900 to-dark-2 text-white text-xs sm:text-sm py-2.5 overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, rgba(139,92,246,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(99,102,241,0.3) 0%, transparent 50%)" }} />
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-1 relative z-10">
          <span className="flex items-center gap-1.5">🚚 <strong className="text-accent-light">Free Worldwide Shipping</strong> on all orders</span>
          <span className="flex items-center gap-1.5">⏰ Sale ends in <strong className="text-accent-light font-mono">{countdown}</strong></span>
        </div>
      </div>

      <Navbar />

      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-screen flex items-center pt-36 pb-20 overflow-hidden">
        {/* Animated BG */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-blue-50" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
          <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-pink-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "4s" }} />
          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left */}
          <div className="space-y-7" style={{ animation: "fadeInUp 0.8s ease forwards" }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-200/50 rounded-full text-purple-700 text-sm font-semibold shadow-sm">
              <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
              #1 TikTok Viral — 200M+ Views
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight">
              Turn Any Room<br />
              Into A{" "}
              <span className="bg-gradient-to-r from-purple-600 via-blue-500 to-pink-500 bg-clip-text text-transparent">
                Magical Castle
              </span>
            </h1>

            <p className="text-lg text-gray-500 leading-relaxed max-w-lg">
              The <strong className="text-gray-800">CastleView™ Mini 210° Projector</strong> — the viral fake window projector transforming bedrooms worldwide.
            </p>

            {/* Price Block */}
            <div className="flex flex-wrap items-center gap-4 p-4 bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="text-4xl font-black text-gray-900">$89</span>
                <span className="text-lg text-gray-400 line-through">$142</span>
              </div>
              <span className="text-sm font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 px-3 py-1.5 rounded-lg shadow-sm">Save 37%</span>
              <span className="text-sm text-gray-400">+ Free Shipping</span>
            </div>

            {/* Stock */}
            <div className="flex items-center gap-3">
              <div className="w-24 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-400 to-red-500 rounded-full transition-all duration-700" style={{ width: `${Math.min(100, (stock / 15) * 100)}%` }} />
              </div>
              <span className={`text-xs font-semibold ${stock <= 3 ? "text-red-500" : "text-amber-600"}`}>
                ⚡ Only {stock} units left — selling fast!
              </span>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={scrollToOrder} className="group relative inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-10 py-4.5 rounded-xl font-bold text-base overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:-translate-y-0.5">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <ShoppingCart className="w-5 h-5" />
                Buy Now — Free Shipping
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">$89</span>
              </button>
              <a href="#reviews" className="inline-flex items-center justify-center gap-2 border-2 border-gray-200 bg-white text-gray-700 px-8 py-4.5 rounded-xl font-semibold hover:border-purple-300 hover:text-purple-600 hover:bg-purple-50/50 transition-all duration-300">
                <Star className="w-5 h-5 text-amber-400" />
                See Reviews
              </a>
            </div>

            {/* Trust */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs sm:text-sm text-gray-500">
              {[
                ["🔒", "Secure Checkout", "text-green-500"],
                ["🚚", "Free Shipping", "text-purple-500"],
                ["🔄", "30-Day Returns", "text-amber-500"],
                ["🛡️", "2-Year Warranty", "text-blue-500"],
              ].map(([icon, label, color]) => (
                <span key={label} className="flex items-center gap-1.5 font-medium">
                  <span className={color}>{icon}</span> {label}
                </span>
              ))}
            </div>

            {/* Stats */}
            <div className="flex gap-8 sm:gap-12 pt-2 border-t border-gray-100">
              {[
                ["12K+", "Happy Customers", "👥"],
                ["4.8★", "Avg Rating", "⭐"],
                ["15+", "Countries", "🌍"],
                ["200M+", "TikTok Views", "📱"],
              ].map(([num, label, emoji]) => (
                <div key={num} className="text-center sm:text-left">
                  <div className="text-lg sm:text-xl font-extrabold text-gray-900 flex items-center gap-1">
                    {emoji} {num}
                  </div>
                  <div className="text-xs text-gray-400">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Product Visual */}
          <div className="relative flex justify-center">
            {/* Glow rings */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-72 h-72 sm:w-96 sm:h-96 rounded-full border-2 border-purple-200/30 animate-[spin_20s_linear_infinite]" />
              <div className="w-56 h-56 sm:w-80 sm:h-80 rounded-full border-2 border-blue-200/20 animate-[spin_30s_linear_infinite_reverse] absolute" />
              <div className="w-40 h-40 sm:w-56 sm:h-56 rounded-full bg-gradient-to-br from-purple-400/10 to-blue-400/10 blur-2xl absolute" />
            </div>

            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-pink-500/20 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <img
                src="https://cdn.shopify.com/s/files/1/0740/3867/3559/files/s-l1600.jpg?v=1784121518"
                alt="CastleView Mini 210° Smart Projector"
                className="w-full max-w-md relative z-10 rounded-[2rem] shadow-2xl group-hover:shadow-3xl transition-all duration-700 group-hover:scale-[1.02]"
              />

              {/* Floating badges */}
              <div className="absolute -top-3 -right-3 sm:right-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-gray-100 text-sm font-bold text-purple-700 animate-bounce z-20">
                🔄 210° Rotation
              </div>
              <div className="absolute -bottom-3 -left-3 sm:left-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-gray-100 text-sm font-bold text-amber-600 animate-bounce z-20" style={{ animationDelay: "0.5s" }}>
                🎬 4K Support
              </div>
              <div className="absolute top-1/3 -left-6 sm:-left-8 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl shadow-lg border border-gray-100 text-xs font-bold text-emerald-600 animate-bounce z-20" style={{ animationDelay: "1s" }}>
                🤏 Pocket Size
              </div>
            </div>
          </div>
        </div>

        {/* Scroll */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-gray-400 text-xs animate-bounce">
          <span>Scroll to explore</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </section>

      {/* ===== TRUST STRIP ===== */}
      <div className="relative py-5 bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-4 relative z-10">
          <p className="text-sm">Trusted by <strong className="text-amber-300">12,000+ customers</strong> worldwide</p>
          <div className="flex gap-6 text-xs text-gray-300">
            <span>✦ Free Shipping</span>
            <span>✦ 30-Day Returns</span>
            <span>✦ 2-Year Warranty</span>
            <span>✦ Secure Checkout</span>
          </div>
        </div>
      </div>

      {/* ===== PROBLEM / SOLUTION ===== */}
      <section data-observe className="py-24 bg-gradient-to-b from-white to-gray-50 transition-all duration-1000 opacity-0 translate-y-12" id="problem">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-700 px-5 py-1.5 rounded-full text-sm font-semibold border border-purple-200/50">The Problem</span>
            <h2 className="text-4xl sm:text-5xl font-black mt-5 leading-tight">
              Windowless Room? <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">We Fixed It.</span>
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">See why thousands are switching to the CastleView™ solution</p>
          </div>

          <div className="grid md:grid-cols-[1fr_auto_1fr] gap-8 items-center max-w-5xl mx-auto">
            {/* Problem */}
            <div className="relative bg-white rounded-[2rem] p-8 sm:p-10 shadow-lg border border-red-100 hover:shadow-xl transition-all duration-300 group">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-400 to-rose-400 rounded-t-[2rem]" />
              <div className="text-5xl mb-5">😔</div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">Without CastleView™</h3>
              <ul className="space-y-3">
                {[
                  "Dark, boring rooms with no view",
                  "Expensive renovations & fake windows",
                  "Bulky projectors that take up space",
                  "Poor image quality & limited angles",
                ].map(item => (
                  <li key={item} className="flex items-center gap-3 text-gray-500 text-sm">
                    <span className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                      <X className="w-3 h-3 text-red-500" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* VS */}
            <div className="relative flex items-center justify-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-black text-lg sm:text-xl shadow-xl">
                VS
              </div>
            </div>

            {/* Solution */}
            <div className="relative bg-white rounded-[2rem] p-8 sm:p-10 shadow-lg border border-emerald-100 hover:shadow-xl transition-all duration-300 group">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-t-[2rem]" />
              <div className="text-5xl mb-5">🏰</div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">With CastleView™</h3>
              <ul className="space-y-3">
                {[
                  "Instant castle window — any room",
                  "210° rotating arm — project anywhere",
                  "Pocket-sized, fits in your hand",
                  "4K support — stunning clarity",
                ].map(item => (
                  <li key={item} className="flex items-center gap-3 text-gray-500 text-sm">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PRODUCT DEEP DIVE ===== */}
      <section data-observe className="py-24 bg-white transition-all duration-1000 opacity-0 translate-y-12" id="product">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-700 px-5 py-1.5 rounded-full text-sm font-semibold border border-purple-200/50">Best Seller</span>
            <h2 className="text-4xl sm:text-5xl font-black mt-5 leading-tight">
              Meet The <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">CastleView™</span>
            </h2>
            <p className="text-gray-500 mt-3">The mini projector that sparked a worldwide trend</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-14 items-center">
            {/* Left - Image + USPs */}
            <div>
              <div className="relative group mb-8">
                <div className="absolute -inset-3 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-pink-500/10 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <img
                  src="https://cdn.shopify.com/s/files/1/0740/3867/3559/files/s-l1600.jpg?v=1784121518"
                  alt="CastleView Projector"
                  className="w-full rounded-[2rem] shadow-2xl relative z-10 group-hover:scale-[1.01] transition-transform duration-700"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  ["🔄", "210° Rot."],
                  ["🎬", "4K Ready"],
                  ["🤏", "Pocket"],
                  ["🔋", "2hr Bat."],
                  ["📱", "WiFi+BT"],
                  ["🔌", "USB-C"],
                ].map(([icon, text]) => (
                  <div key={text} className="flex flex-col items-center gap-1.5 bg-gradient-to-b from-gray-50 to-white rounded-xl py-4 px-2 text-center border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all duration-300">
                    <span className="text-2xl">{icon}</span>
                    <span className="text-xs font-semibold text-gray-500">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Info */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 px-4 py-2 rounded-xl">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />)}
                <span className="text-sm text-gray-500 ml-1">4.8/5 <strong>(2,847 reviews)</strong></span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold leading-tight">WM CastleView™ Mini 210° Smart Projector</h3>

              <p className="text-gray-500 leading-relaxed">
                The <strong className="text-gray-800">TikTok-viral CastleView™</strong> creates a stunning castle window effect 
                on any wall or ceiling. <strong>Patented 210° rotating arm</strong> lets you project anywhere — walls, 
                ceilings, or corners.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  ["✨", "Stunning castle window effect"],
                  ["🔄", "210° rotating arm"],
                  ["🎬", "4K video input support"],
                  ["📱", "Wireless screen mirroring"],
                  ["🔋", "2-hour built-in battery"],
                  ["🔌", "USB-C fast charging"],
                  ["📶", "Dual-band WiFi + BT 5.0"],
                  ["🎮", "HDMI/USB for gaming"],
                ].map(([icon, text]) => (
                  <div key={text} className="flex items-center gap-3 text-sm text-gray-600 p-2 rounded-lg hover:bg-gray-50 transition">
                    <span className="text-lg">{icon}</span>
                    <span>{text}</span>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-gray-50 to-purple-50/50 rounded-2xl p-6 border border-gray-100 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-3xl font-black text-gray-900">$89</span>
                    <span className="text-gray-400 line-through ml-2">$142</span>
                  </div>
                  <span className="text-sm font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 px-3 py-1.5 rounded-lg">37% OFF</span>
                </div>
                <div className="flex gap-2 text-sm text-gray-400">
                  <span className="bg-white px-2 py-1 rounded border">💳</span>
                  <span className="bg-white px-2 py-1 rounded border">Visa</span>
                  <span className="bg-white px-2 py-1 rounded border">MC</span>
                  <span className="bg-white px-2 py-1 rounded border">PP</span>
                  <span className="bg-white px-2 py-1 rounded border">AP</span>
                </div>
              </div>

              <button onClick={scrollToOrder} className="group relative w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4.5 rounded-xl font-bold text-lg overflow-hidden shadow-lg hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                🛒 Buy Now — $89 Free Shipping
              </button>

              <div className="flex items-center gap-2.5 text-sm text-gray-500 bg-green-50 rounded-xl p-3 border border-green-100">
                <Shield className="w-5 h-5 text-green-600 flex-shrink-0" />
                <strong className="text-green-800">30-Day Money-Back Guarantee</strong> — No questions asked
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SPECS ===== */}
      <section data-observe className="py-24 bg-gradient-to-b from-gray-50 to-white transition-all duration-1000 opacity-0 translate-y-12" id="specs">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-700 px-5 py-1.5 rounded-full text-sm font-semibold border border-purple-200/50">Specifications</span>
            <h2 className="text-4xl sm:text-5xl font-black mt-5 leading-tight">
              Technical <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">Details</span>
            </h2>
          </div>

          <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden divide-y divide-gray-100">
            {[
              ["Projection Technology", "LCD (Latest Gen)", "🎯"],
              ["Resolution", "1080p Native (4K Support)", "🎬"],
              ["Rotation Arm", "210° Patented Design", "🔄"],
              ["Brightness", "200 ANSI Lumens", "💡"],
              ["Battery Life", "2 Hours (Built-in)", "🔋"],
              ["Connectivity", "WiFi 2.4G/5G, BT 5.0, HDMI, USB", "📶"],
              ["Charging", "USB-C Fast Charging", "🔌"],
              ["Weight", "180g (Pocket-Sized)", "🤏"],
              ["Speaker", "Built-in 3W Stereo", "🔊"],
              ["Warranty", "2 Years", "🛡️"],
            ].map(([label, value, icon], i) => (
              <div key={label as string} className="flex items-center gap-4 px-6 sm:px-8 py-4 sm:py-5 hover:bg-purple-50/30 transition-colors">
                <span className="text-xl flex-shrink-0">{icon as string}</span>
                <span className="font-semibold text-gray-800 text-sm sm:text-base w-1/3">{label as string}</span>
                <span className="text-gray-500 text-sm sm:text-base">{value as string}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section data-observe className="py-24 bg-white transition-all duration-1000 opacity-0 translate-y-12" id="features">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-700 px-5 py-1.5 rounded-full text-sm font-semibold border border-purple-200/50">Why Choose Us</span>
            <h2 className="text-4xl sm:text-5xl font-black mt-5 leading-tight">
              The <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">WM Duo</span> Difference
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((feat, i) => (
              <div
                key={feat.title}
                className="group relative bg-white rounded-2xl p-6 sm:p-7 shadow-lg border border-gray-100 hover:border-purple-200 hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="text-4xl mb-4">{feat.icon}</div>
                <h3 className="font-bold text-gray-800 mb-2">{feat.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== REVIEWS ===== */}
      <section data-observe className="py-24 bg-gradient-to-b from-gray-50 to-white transition-all duration-1000 opacity-0 translate-y-12" id="reviews">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-700 px-5 py-1.5 rounded-full text-sm font-semibold">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
              4.8/5 Rating
            </span>
            <h2 className="text-4xl sm:text-5xl font-black mt-5 leading-tight">
              What <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">2,847 Customers</span> Say
            </h2>
          </div>

          {/* Rating Summary */}
          <div className="max-w-3xl mx-auto bg-white rounded-[2rem] p-6 sm:p-10 shadow-xl border border-gray-100 mb-10">
            <div className="flex flex-col sm:flex-row gap-8 items-center">
              <div className="text-center flex-shrink-0">
                <div className="text-6xl font-black bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">4.8</div>
                <div className="flex items-center gap-0.5 justify-center mt-2">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />)}
                </div>
                <div className="text-sm text-gray-400 mt-1">2,847 Verified Reviews</div>
              </div>
              <div className="flex-1 w-full space-y-2">
                {[
                  ["5 ★", 83, "#10B981"],
                  ["4 ★", 12, "#3B82F6"],
                  ["3 ★", 3, "#F59E0B"],
                  ["2 ★", 1, "#F97316"],
                  ["1 ★", 1, "#EF4444"],
                ].map(([label, pct, color]) => (
                  <div key={label as string} className="flex items-center gap-3 text-sm">
                    <span className="w-12 font-semibold text-gray-700">{label as string}</span>
                    <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${pct}%`, background: color as string }} />
                    </div>
                    <span className="w-8 text-right text-gray-400">{pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Review Cards */}
          <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {REVIEWS.map((review, i) => (
              <div
                key={i}
                className={`bg-white rounded-2xl p-6 sm:p-7 shadow-lg border transition-all duration-500 hover:shadow-xl hover:-translate-y-1 ${i === 0 ? "border-purple-200" : "border-gray-100"}`}
              >
                <div className="flex items-center gap-2 text-xs text-emerald-600 font-semibold mb-3">
                  <span className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-white" />
                  </span>
                  Verified Purchase
                </div>
                <div className="flex items-center gap-0.5 mb-3">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <h4 className="font-bold text-gray-800 mb-2">{review.title}</h4>
                <p className="text-sm text-gray-500 leading-relaxed mb-5">"{review.text}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${review.color} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                    {review.initials}
                  </div>
                  <div>
                    <strong className="text-sm text-gray-800">{review.name}</strong>
                    <div className="text-xs text-gray-400">{review.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TRENDING ===== */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-500 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-5 py-2 rounded-full text-sm font-semibold mb-6 border border-white/10">
            <Play className="w-4 h-4 text-amber-400 fill-amber-400" />
            TikTok Viral Sensation
          </span>
          <h2 className="text-4xl sm:text-5xl font-black mb-3">#FakeWindow Trend</h2>
          <p className="text-xl text-amber-300 font-semibold mb-2">50,000+ videos · 200M+ views · 381% growth</p>
          <p className="text-purple-200/70 mb-10">Join the community creating magical spaces with CastleView™</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              ["📱", "50K+ TikToks"],
              ["👁️", "200M+ Views"],
              ["📈", "381% Growth"],
              ["🌍", "15+ Countries"],
            ].map(([icon, label]) => (
              <span key={label} className="bg-white/10 backdrop-blur-sm px-5 py-3 rounded-xl text-sm font-medium border border-white/5 hover:bg-white/20 transition">
                {icon} {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section data-observe className="py-24 bg-white transition-all duration-1000 opacity-0 translate-y-12" id="faq">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-700 px-5 py-1.5 rounded-full text-sm font-semibold border border-purple-200/50">FAQ</span>
            <h2 className="text-4xl sm:text-5xl font-black mt-5 leading-tight">
              Frequently Asked <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">Questions</span>
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-purple-200 transition-colors">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex justify-between items-center px-5 py-4 text-left font-semibold text-gray-800 hover:text-purple-700 transition gap-4"
                >
                  <span>{faq.q}</span>
                  <div className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-45 bg-purple-100" : ""}`}>
                    <Plus className={`w-4 h-4 transition-colors ${openFaq === i ? "text-purple-600" : "text-gray-400"}`} />
                  </div>
                </button>
                <div className={`overflow-hidden transition-all duration-400 ${openFaq === i ? "max-h-60" : "max-h-0"}`}>
                  <div className="px-5 pb-5 text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-4">{faq.a}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== GUARANTEE ===== */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-white rounded-[2.5rem] p-8 sm:p-14 shadow-2xl border border-purple-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500" />
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl" />
            <div className="text-6xl mb-5 relative">🛡️</div>
            <h2 className="text-3xl sm:text-4xl font-black mb-4 relative">100% Risk-Free Purchase</h2>
            <p className="text-gray-500 leading-relaxed max-w-xl mx-auto mb-8 relative">
              You're covered by our <strong className="text-gray-800">30-Day Money-Back Guarantee</strong>. 
              If you're not absolutely thrilled with your CastleView™, return it for a full refund. 
              No restocking fees, no return shipping, no hassle.
            </p>
            <div className="flex flex-wrap justify-center gap-3 relative">
              {[
                ["🔒", "Secure Checkout"],
                ["🚚", "Free Shipping"],
                ["🔄", "30-Day Returns"],
                ["🛡️", "2-Year Warranty"],
                ["💬", "24/7 Support"],
              ].map(([icon, label]) => (
                <span key={label} className="bg-gradient-to-b from-gray-50 to-white border border-gray-200 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 shadow-sm hover:border-purple-200 transition">
                  {icon} {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== ORDER CTA ===== */}
      <section className="py-24 bg-white" id="order">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-[2.5rem] p-8 sm:p-14 shadow-2xl border-2 border-purple-100 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500" />

            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 text-white px-5 py-2 rounded-full text-sm font-bold shadow-lg mb-6 animate-pulse-glow">
              🔥 Limited Time Offer
            </div>

            <h2 className="text-3xl sm:text-4xl font-black mb-3">Ready To Transform Your Space?</h2>
            <p className="text-gray-500 mb-7">Join <strong className="text-gray-800">12,000+ happy customers</strong> worldwide. Free shipping, 30-day guarantee.</p>

            <div className="flex items-center justify-center gap-4 mb-6">
              <div>
                <span className="text-5xl font-black text-gray-900">$89</span>
                <span className="text-2xl text-gray-400 line-through ml-3">$142</span>
              </div>
              <span className="text-base font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-2 rounded-xl shadow-md">Save 37%</span>
            </div>

            <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 mb-7 text-sm">
              <span className="flex items-center gap-1.5 text-amber-600 font-semibold">
                <Zap className="w-4 h-4" /> Only {stock} left at this price
              </span>
              <span className="flex items-center gap-1.5 text-purple-600 font-semibold">
                <TrendingUp className="w-4 h-4" /> {sold} bought today
              </span>
            </div>

            <button onClick={() => alert("🚀 Thank you! We'll contact you shortly to complete your order.")} className="group relative w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-5 rounded-xl font-bold text-lg overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              🛒 Order Now — Free Shipping
            </button>

            <div className="mt-4 text-xs text-gray-400 space-y-1">
              <p>🔒 256-bit SSL Encryption</p>
              <p>💳 Visa · Mastercard · PayPal · Apple Pay · Google Pay</p>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500 bg-gradient-to-r from-gray-50 to-purple-50/50 rounded-xl p-3 border border-gray-100">
              <Clock className="w-4 h-4 text-red-500" />
              <span>⏰ This special price expires in:</span>
              <strong className="text-red-500 text-lg font-mono">{countdown}</strong>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CONTACT ===== */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white" id="contact">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-700 px-5 py-1.5 rounded-full text-sm font-semibold border border-purple-200/50">Contact</span>
            <h2 className="text-4xl sm:text-5xl font-black mt-5 leading-tight">
              Get In <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">Touch</span>
            </h2>
            <p className="text-gray-500 mt-3">We're here 24/7 — real humans, not bots</p>
          </div>

          <div className="grid md:grid-cols-[1fr_1.5fr] gap-10 max-w-4xl mx-auto">
            <div className="space-y-6">
              {[
                ["📧", "Email", "hello@wmduo.com", "Response within 4 hours"],
                ["💬", "WhatsApp", "+92 344 7186276", "Fastest response via WhatsApp"],
                ["🌍", "Worldwide Shipping", "US, UK, Europe, Asia", "7-15 business days"],
                ["🛡️", "30-Day Guarantee", "100% money-back", "No questions asked"],
              ].map(([icon, label, value, sub]) => (
                <div key={label as string} className="flex gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all">
                  <span className="text-2xl flex-shrink-0">{icon as string}</span>
                  <div>
                    <strong className="text-sm text-gray-800">{label as string}</strong>
                    <p className="text-sm text-gray-500">{value as string}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{sub as string}</p>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault()
              const form = e.currentTarget as HTMLFormElement
              const formData = new FormData(form)
              const data = {
                name: formData.get('name') as string,
                email: formData.get('email') as string,
                message: formData.get('message') as string,
              }
              try {
                const res = await fetch("/api/contact", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(data),
                })
                const result = await res.json()
                if (res.ok) {
                  alert("✅ " + result.message)
                  form.reset()
                } else {
                  alert("❌ " + result.error)
                }
              } catch {
                alert("❌ Network error. Please try again.")
              }
            }} className="space-y-4 bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-100">
              <div className="grid sm:grid-cols-2 gap-4">
                <input name="name" required placeholder="Your Name" className="w-full px-4 py-3.5 border-2 border-gray-100 rounded-xl focus:border-purple-400 focus:ring-4 focus:ring-purple-500/10 outline-none transition text-sm" />
                <input name="email" type="email" required placeholder="Your Email" className="w-full px-4 py-3.5 border-2 border-gray-100 rounded-xl focus:border-purple-400 focus:ring-4 focus:ring-purple-500/10 outline-none transition text-sm" />
              </div>
              <textarea name="message" required rows={4} placeholder="Your Message" className="w-full px-4 py-3.5 border-2 border-gray-100 rounded-xl focus:border-purple-400 focus:ring-4 focus:ring-purple-500/10 outline-none transition text-sm resize-none" />
              <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-bold hover:shadow-xl hover:shadow-purple-500/20 transition-all">
                Send Message ✉️
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ===== WHATSAPP FLOAT ===== */}
      <a
        href="https://wa.me/923447186276"
        target="_blank"
        rel="noopener"
        className={`fixed bottom-6 right-6 z-[9998] w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center text-white shadow-xl hover:shadow-2xl hover:shadow-green-500/30 hover:scale-110 active:scale-95 transition-all duration-300 ${scrolled ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
      >
        <Phone className="w-6 h-6 sm:w-7 sm:h-7" />
      </a>

      <Footer />
    </div>
  )
}
