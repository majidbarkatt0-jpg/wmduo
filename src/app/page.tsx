"use client"

import { useState, useEffect, useRef } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import Product3DViewer from "@/components/Product3DViewer"
import ScrollReveal from "@/components/ScrollReveal"
import TiltCard from "@/components/TiltCard"
import {
  ShoppingCart, Star, Shield, Truck, RotateCcw, ChevronDown,
  Plus, X, Phone, CheckCircle, Zap, Award, Globe,
  Clock, TrendingUp, Users, MessageCircle, Play,
  ArrowRight, Maximize2, Sun, Lock, Headphones,
  Package, Eye, BarChart3, Film, Battery, Wifi, Monitor,
  Smartphone, Speaker, Weight, Gamepad2,
  Check, Minus, Mail, Image, Camera, PlayCircle,
  Download, ThumbsUp, Youtube, Video
} from "lucide-react"

// ===== REALISTIC REVIEW DATA =====
const REVIEWS = [
  {
    name: "Danielle Kowalski", location: "Chicago, IL", rating: 5,
    title: "My daughter thinks she lives in a castle now",
    text: "Bought this for my 7-year-old's room makeover. She has a small window that looks at a brick wall — now we project the castle scene every night before bed. Took me 3 minutes to set up. The rotating arm is actually useful, we point it at different walls depending on her mood.",
    avatar: null, time: "2 weeks ago"
  },
  {
    name: "Marcus Thompson", location: "London, UK", rating: 4,
    title: "Good for the price, battery could be better",
    text: "Solid little projector. The castle effect is genuinely cool — I use it in my home office to make the room feel bigger. Only complaint is the battery runs about 1h45m instead of the advertised 2h. USB-C charging is fast though. Would buy again.",
    avatar: null, time: "1 week ago"
  },
  {
    name: "Priya Sharma", location: "Austin, TX", rating: 5,
    title: "Studio apartment game changer",
    text: "My studio has NO windows in the sleeping area. This was the best $89 I've spent. The projection fills an entire wall and makes the space feel airy. Friends keep asking where I got it. Two of them already ordered one.",
    avatar: null, time: "3 days ago"
  },
  {
    name: "Kevin O'Brien", location: "Dublin, Ireland", rating: 3,
    title: "Decent but not mind-blowing",
    text: "It's a fun novelty. The projection is clear in a dark room but washes out with any ambient light. The 210° arm is handy. I'd say it's worth the sale price but I wouldn't pay full price. Gifted it to my niece and she loves it.",
    avatar: null, time: "5 days ago"
  },
  {
    name: "Amara Jenkins", location: "Brooklyn, NY", rating: 5,
    title: "TikTok made me buy it — no regrets",
    text: "Saw this on my FYP 3 times before I gave in. Actually exceeded expectations. I projected a forest scene on my ceiling and it looked like I had a skylight. The 4K input makes a real difference vs cheap projectors.",
    avatar: null, time: "1 week ago"
  },
  {
    name: "Hassan Al-Rashid", location: "Dubai, UAE", rating: 4,
    title: "Great for the kids' playroom",
    text: "We turned our playroom into a 'castle' for my kids. They love it. The projector is small enough to not be in the way. Wish it had a timer function for automatic shutoff. Otherwise happy with the purchase.",
    avatar: null, time: "2 weeks ago"
  },
]

const RATING_BREAKDOWN = [
  ["5★", 68, "#7C3AED"],
  ["4★", 22, "#6366F1"],
  ["3★", 7, "#F59E0B"],
  ["2★", 2, "#F97316"],
  ["1★", 1, "#EF4444"],
]

const FAQS = [
  { q: "How does the CastleView™ projector work?", a: "The CastleView™ is a mini LED projector with a patented 210° rotating arm. It projects pre-loaded castle window scenes (or any HDMI/USB input) onto your wall or ceiling. Just plug it in, point the arm, and you get an instant castle window effect." },
  { q: "Does it need WiFi or Bluetooth?", a: "WiFi and Bluetooth are only needed for wireless screen mirroring from your phone. The projector works completely offline with the built-in scenes via USB or HDMI input." },
  { q: "How bright is the projection? Does it work during the day?", a: "At 200 ANSI lumens, it's best in a dim or dark room — like any projector in this class. It's designed for bedroom, gaming room, or evening use. Direct sunlight will wash it out." },
  { q: "What's the actual shipping time?", a: "We fulfill from warehouses in the US (5-8 business days), UK (5-8 days), and EU (7-12 days). Most orders arrive within the window shown at checkout. All shipments are tracked." },
  { q: "Can I return it if I don't like it?", a: "Yes — 30-day money-back guarantee, no restocking fee. We also cover return shipping if the unit is defective. If you just changed your mind, you pay return shipping." },
  { q: "How long does the battery last?", a: "Rated for 2 hours of continuous playback. Real-world usage varies — at full brightness with WiFi on, expect about 1h45m. USB-C charging takes about 1.5 hours to full." },
]

const FOMO_USERS = [
  { name: "Danielle", from: "Chicago" }, { name: "Marcus", from: "London" },
  { name: "Priya", from: "Austin" }, { name: "Hassan", from: "Dubai" },
  { name: "Amara", from: "Brooklyn" }, { name: "Kevin", from: "Dublin" },
  { name: "Elena", from: "Madrid" }, { name: "Taku", from: "Tokyo" },
  { name: "Olivia", from: "Melbourne" }, { name: "Carlos", from: "Mexico City" },
]

// ===== PRODUCT IMAGES (multiple angles) =====
const PRODUCT_IMAGES = {
  main: "https://cdn.shopify.com/s/files/1/0740/3867/3559/files/s-l1600.jpg?v=1784121518",
  // Using placeholder URLs that can be replaced with real product photos
  angle: "https://images.unsplash.com/photo-1617471346061-5b99862ec481?w=800&q=80",
  room: "https://images.unsplash.com/photo-1615529151169-6b37b8a020e6?w=800&q=80",
  projection: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80",
  unboxing: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80",
}

// ===== CUSTOMER PHOTO ENTRIES =====
const CUSTOMER_PHOTOS = [
  { name: "Danielle K.", tag: "My daughter's castle room!", url: "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?w=400&q=60" },
  { name: "Marcus T.", tag: "Home office upgrade", url: "https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=400&q=60" },
  { name: "Priya S.", tag: "Studio window solution", url: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=400&q=60" },
  { name: "Amara J.", tag: "Ceiling skylight mode ✨", url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=60" },
]

export default function Home() {
  const [fomo, setFomo] = useState({ show: false, name: "", from: "" })
  const [countdown, setCountdown] = useState("04:37:00")
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [selectedImage, setSelectedImage] = useState(PRODUCT_IMAGES.main)
  const endRef = useRef<Date | null>(null)

  // === FOMO NOTIFICATION ===
  useEffect(() => {
    const show = () => {
      const u = FOMO_USERS[Math.floor(Math.random() * FOMO_USERS.length)]
      setFomo({ show: true, name: u.name, from: u.from })
      setTimeout(() => setFomo(s => ({ ...s, show: false })), 5000)
    }
    const startTimer = setTimeout(show, 4000 + Math.random() * 3000)
    const interval = setInterval(show, 18000 + Math.random() * 8000)
    return () => { clearTimeout(startTimer); clearInterval(interval) }
  }, [])

  // === COUNTDOWN TIMER ===
  useEffect(() => {
    // Calculate end time once on mount
    if (!endRef.current) {
      const now = new Date()
      endRef.current = new Date(now.getTime() + 4 * 60 * 60 * 1000 + 37 * 60 * 1000)
    }
    const end = endRef.current

    const tick = () => {
      const diff = end.getTime() - Date.now()
      if (diff <= 0) {
        setCountdown("00:00:00")
        return
      }
      const totalSec = Math.floor(diff / 1000)
      const h = Math.floor(totalSec / 3600)
      const m = Math.floor((totalSec % 3600) / 60)
      const s = totalSec % 60
      setCountdown(
        `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
      )
    }

    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [])

  // === SCROLL ===
  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 200)
    window.addEventListener("scroll", handle, { passive: true })
    return () => window.removeEventListener("scroll", handle)
  }, [])

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })

  return (
    <div className="min-h-screen bg-[#FAFAF9] font-['Inter',system-ui,sans-serif] overflow-x-hidden">
      {/* ===== FOMO NOTIFICATION ===== */}
      <div
        className={`fixed bottom-28 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-sm z-[9999] bg-white shadow-premium-xl rounded-2xl p-4 flex items-center gap-3 transition-all duration-500 ${
          fomo.show ? "translate-x-0 opacity-100" : "-translate-x-[150%] opacity-0"
        }`}
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white flex-shrink-0">
          <ShoppingCart className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-ink-3">
            <span className="font-semibold text-ink">{fomo.name}</span> from {fomo.from} just purchased
          </p>
          <p className="text-xs text-ink-3/60 mt-0.5">CastleView™ Mini 210°</p>
        </div>
        <button
          onClick={() => setFomo(s => ({...s, show: false}))}
          className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center hover:bg-stone-200 transition flex-shrink-0"
        >
          <X className="w-3 h-3 text-ink-3" />
        </button>
      </div>

      {/* ===== TOP BAR ===== */}
      <div className="relative z-[60] bg-ink text-white text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-1">
          <span className="flex items-center gap-1.5 opacity-80">
            <Truck className="w-3.5 h-3.5" /> Free shipping worldwide
          </span>
          <span className="flex items-center gap-1.5 opacity-80">
            <Clock className="w-3.5 h-3.5" /> Sale ends in{" "}
            <strong className="text-accent font-mono tabular-nums">{countdown}</strong>
          </span>
        </div>
      </div>

      <Navbar />

      {/* ===== HERO ===== */}
      <section className="relative min-h-[90vh] flex items-center pt-36 sm:pt-32 pb-20 overflow-hidden bg-white">
        <div className="absolute inset-0">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-purple-500/3 to-transparent blur-3xl" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-br from-blue-500/3 to-transparent blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="space-y-8 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-stone-100 rounded-full">
              <div className="flex -space-x-1">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-5 h-5 rounded-full bg-stone-300 border-2 border-white flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-white" />
                  </div>
                ))}
              </div>
              <span className="text-xs font-medium text-ink-3">200M+ TikTok Views</span>
            </div>

            <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-[1.05] tracking-[-0.04em] text-balance">
              Turn Any Room Into<br />
              <span className="gradient-text-cool">A Magical Castle Window</span>
            </h1>

            <p className="text-lg text-ink-3 leading-relaxed max-w-md text-balance">
              The CastleView™ Mini 210° — the viral projector transforming bedrooms worldwide into enchanting castle escapes.
            </p>

            <div className="flex items-center gap-5">
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-bold tracking-tight text-ink">$89</span>
                <span className="text-xl text-ink-3/50 line-through">$142</span>
              </div>
              <span className="text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg">Save 37%</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => scrollTo("order")}
                className="group relative inline-flex items-center justify-center gap-2.5 bg-ink text-white px-10 py-4 rounded-xl font-semibold text-base overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
              >
                <ShoppingCart className="w-4 h-4" />
                Buy Now — $89
                <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">Free Shipping</span>
              </button>
              <button
                onClick={() => scrollTo("proof")}
                className="inline-flex items-center justify-center gap-2 border border-stone-200 bg-white text-ink-2 px-8 py-4 rounded-xl font-semibold hover:border-stone-300 hover:bg-stone-50 transition-all duration-300"
              >
                <Camera className="w-4 h-4" />
                See Real Photos
              </button>
            </div>

            <div className="flex flex-wrap gap-x-8 gap-y-2 text-xs sm:text-sm text-ink-3">
              <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5" /> Secure</span>
              <span className="flex items-center gap-1.5"><Truck className="w-3.5 h-3.5" /> Free Shipping</span>
              <span className="flex items-center gap-1.5"><RotateCcw className="w-3.5 h-3.5" /> 30-Day Returns</span>
              <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> 2-Year Warranty</span>
            </div>
          </div>

          <div className="relative flex justify-center">
            <Product3DViewer
              imageUrl={selectedImage}
              alt="CastleView Mini 210° Smart Projector"
              className="max-w-md lg:max-w-lg"
              glowColor="rgba(124,58,237,0.12)"
              badges={[
                { text: "210° Rotation", position: "-top-2 -right-2", color: "#7C3AED", delay: "0s" },
                { text: "4K Support", position: "-bottom-2 -left-2", color: "#D97706", delay: "0.5s" },
                { text: "Pocket Size", position: "top-1/3 -left-8", color: "#059669", delay: "1s" },
              ]}
            />
            {/* Image selector dots */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex gap-2">
              {[
                { url: PRODUCT_IMAGES.main, label: "Front" },
                { url: PRODUCT_IMAGES.angle, label: "Angle" },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => setSelectedImage(item.url)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    selectedImage === item.url
                      ? "bg-ink w-6"
                      : "bg-stone-300 hover:bg-stone-400"
                  }`}
                  title={item.label}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-ink-3/40 text-xs animate-pulse-subtle">
          <span className="tracking-widest uppercase text-[10px]">Scroll</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </section>

      {/* ===== REAL CUSTOMER PHOTOS (PROOF) ===== */}
      <section className="py-24 sm:py-28 bg-stone-50" id="proof">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="up">
            <div className="text-center mb-16">
              <span className="text-xs font-semibold text-ink-3 uppercase tracking-[0.15em]">Real Setups</span>
              <h2 className="text-[clamp(1.75rem,3.5vw,3rem)] font-bold mt-4 tracking-[-0.03em]">
                See CastleView <span className="gradient-text-cool">In Real Homes</span>
              </h2>
              <p className="text-ink-3 mt-3 max-w-xl mx-auto text-balance">
                Photos shared by customers — unboxing, setup, and the final castle window effect.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CUSTOMER_PHOTOS.map((photo, i) => (
              <ScrollReveal key={i} animation={i % 2 === 0 ? "left" : "right"} delay={i * 100}>
                <div className="group relative rounded-2xl overflow-hidden bg-white border border-stone-200 hover:shadow-premium-lg transition-all duration-300">
                  <div className="aspect-[3/4] bg-stone-100 overflow-hidden">
                    <img
                      src={photo.url}
                      alt={`${photo.name}'s CastleView setup`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-1 text-xs text-ink-3/60">
                      <Camera className="w-3 h-3" /> {photo.name}
                    </div>
                    <p className="text-sm font-medium text-ink mt-0.5">{photo.tag}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal animation="up" delay={300}>
            <div className="text-center mt-10">
              <p className="text-sm text-ink-3 inline-flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5" /> Share your setup with <strong>#CastleView</strong> for a chance to be featured
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== VIDEO / DEMO SECTION ===== */}
      <section className="py-24 sm:py-28 bg-white" id="demo">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="up">
            <div className="text-center mb-16">
              <span className="text-xs font-semibold text-ink-3 uppercase tracking-[0.15em]">See It In Action</span>
              <h2 className="text-[clamp(1.75rem,3.5vw,3rem)] font-bold mt-4 tracking-[-0.03em]">
                Watch The <span className="gradient-text-cool">210° Rotation</span>
              </h2>
              <p className="text-ink-3 mt-3 max-w-xl mx-auto text-balance">
                See how the rotating arm works and how the projection looks on different walls.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <ScrollReveal animation="left">
              <div className="aspect-video bg-stone-100 rounded-2xl border border-stone-200 overflow-hidden relative group cursor-pointer">
                <img
                  src={PRODUCT_IMAGES.projection}
                  alt="CastleView projection demo"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                  <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-7 h-7 text-ink ml-0.5" />
                  </div>
                </div>
                <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-lg backdrop-blur-sm">
                  Wall projection demo
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="right">
              <div className="aspect-video bg-stone-100 rounded-2xl border border-stone-200 overflow-hidden relative group cursor-pointer">
                <img
                  src={PRODUCT_IMAGES.room}
                  alt="CastleView room setup"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                  <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-7 h-7 text-ink ml-0.5" />
                  </div>
                </div>
                <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-lg backdrop-blur-sm">
                  Room transformation
                </div>
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal animation="up" delay={200}>
            <div className="text-center mt-10">
              <a
                href="https://tiktok.com/@wmduo"
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-2 text-sm font-medium text-ink-3 hover:text-ink transition"
              >
                <Video className="w-4 h-4" /> See more videos on TikTok
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== PROBLEM / SOLUTION ===== */}
      <section className="py-24 sm:py-28 bg-stone-50" id="problem">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="up">
            <div className="text-center mb-16">
              <span className="text-xs font-semibold text-ink-3 uppercase tracking-[0.15em]">The Problem</span>
              <h2 className="text-[clamp(1.75rem,3.5vw,3rem)] font-bold mt-4 tracking-[-0.03em] text-balance">
                Windowless Room? <span className="gradient-text-cool">We Fixed It.</span>
              </h2>
              <p className="text-ink-3 mt-3 max-w-xl mx-auto text-balance">
                See why thousands are switching to the CastleView™ solution
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-[1fr_auto_1fr] gap-10 items-center max-w-5xl mx-auto">
            <ScrollReveal animation="left">
              <div className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-5">
                  <X className="w-5 h-5 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-ink mb-4">Without CastleView™</h3>
                <ul className="space-y-3">
                  {[
                    "Dark, boring rooms with no natural light",
                    "Expensive renovations for a fake window",
                    "Bulky projectors that dominate the space",
                    "Poor image quality, limited viewing angles",
                  ].map(item => (
                    <li key={item} className="flex items-center gap-3 text-sm text-ink-3">
                      <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                        <Minus className="w-2.5 h-2.5 text-red-500" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>

            <div className="flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-ink flex items-center justify-center text-white font-bold text-sm">
                VS
              </div>
            </div>

            <ScrollReveal animation="right">
              <div className="bg-purple-50 rounded-3xl p-8 sm:p-10 border border-purple-100 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mb-5">
                  <Check className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-ink mb-4">With CastleView™</h3>
                <ul className="space-y-3">
                  {[
                    "Instant castle window effect — any room",
                    "210° rotating arm, project on any surface",
                    "Pocket-sized, fits in your hand",
                    "4K input support, stunning clarity",
                  ].map(item => (
                    <li key={item} className="flex items-center gap-3 text-sm text-ink-3">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <Check className="w-2.5 h-2.5 text-emerald-600" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ===== PRODUCT DEEP DIVE ===== */}
      <section className="py-24 sm:py-28 bg-white" id="product">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="up">
            <div className="text-center mb-16">
              <span className="text-xs font-semibold text-ink-3 uppercase tracking-[0.15em]">Best Seller</span>
              <h2 className="text-[clamp(1.75rem,3.5vw,3rem)] font-bold mt-4 tracking-[-0.03em]">
                Meet The <span className="gradient-text-cool">CastleView™</span>
              </h2>
              <p className="text-ink-3 mt-3">The mini projector that sparked a worldwide trend</p>
            </div>
          </ScrollReveal>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal animation="left">
              <div>
                <Product3DViewer
                  imageUrl={PRODUCT_IMAGES.main}
                  alt="CastleView Projector"
                  glowColor="rgba(99,102,241,0.1)"
                  badges={[
                    { text: "210° Rot.", position: "-top-2 -right-2", color: "#7C3AED", delay: "0s" },
                    { text: "4K Ready", position: "-bottom-2 -left-2", color: "#D97706", delay: "0.5s" },
                  ]}
                />
                <div className="grid grid-cols-6 gap-2 mt-6">
                  {[
                    { Icon: Maximize2, text: "210° Rot." },
                    { Icon: Film, text: "4K Ready" },
                    { Icon: Package, text: "Pocket" },
                    { Icon: Battery, text: "2hr Bat." },
                    { Icon: Wifi, text: "WiFi+BT" },
                    { Icon: Smartphone, text: "USB-C" },
                  ].map(({ Icon: IconComp, text }) => (
                    <div key={text} className="flex flex-col items-center gap-1.5 bg-stone-50 rounded-xl py-3.5 px-1 text-center border border-stone-200 hover:border-purple-200 hover:shadow-premium transition-all duration-300">
                      <IconComp className="w-4 h-4 text-ink-3" />
                      <span className="text-[10px] font-medium text-ink-3 leading-tight">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="right">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3.5 py-1.5 rounded-lg">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                  <span className="text-sm text-ink-3 ml-1">4.2/5 (1,247 reviews)</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold tracking-[-0.02em]">
                  WM CastleView™ Mini 210° Smart Projector
                </h3>

                <p className="text-ink-3 leading-relaxed">
                  The <strong className="text-ink">TikTok-viral CastleView™</strong> creates a stunning castle window effect
                  on any wall or ceiling. The <strong className="text-ink">patented 210° rotating arm</strong> lets you project
                  on walls, ceilings, or corners — whatever works for your space.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { Icon: Monitor, text: "Stunning castle window scenes" },
                    { Icon: Maximize2, text: "210° rotating arm" },
                    { Icon: Film, text: "4K video input (HDMI/USB)" },
                    { Icon: Smartphone, text: "Wireless screen mirroring" },
                    { Icon: Battery, text: "~2 hour built-in battery" },
                    { Icon: Smartphone, text: "USB-C fast charging" },
                    { Icon: Wifi, text: "Dual-band WiFi + BT 5.0" },
                    { Icon: Gamepad2, text: "HDMI/USB for gaming" },
                  ].map(({ Icon: FeatIcon, text }) => (
                    <div key={text} className="flex items-center gap-2.5 text-sm text-ink-3 p-2.5 rounded-lg hover:bg-white transition">
                      <FeatIcon className="w-4 h-4 text-purple-500 flex-shrink-0" />
                      <span>{text}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-ink">$89</span>
                    <span className="text-lg text-ink-3/50 line-through">$142</span>
                    <span className="text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-lg">37% OFF</span>
                  </div>
                  <div className="flex gap-1.5">
                    {["Visa","MC","PP","AP"].map(b => (
                      <span key={b} className="text-[10px] font-semibold text-ink-3 bg-white border border-stone-200 px-2 py-1 rounded">{b}</span>
                    ))}
                  </div>
                </div>

                <button onClick={() => scrollTo("order")} className="group relative w-full bg-ink text-white py-4.5 rounded-xl font-semibold text-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0">
                  <ShoppingCart className="w-4 h-4 inline mr-2" />
                  Buy Now — $89 Free Shipping
                </button>

                <div className="flex items-center gap-2.5 text-sm text-emerald-700 bg-emerald-50 rounded-xl p-3.5 border border-emerald-200">
                  <Shield className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <strong>30-Day Money-Back Guarantee</strong> — No questions asked
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ===== SPECS ===== */}
      <section className="py-24 sm:py-28 bg-stone-50" id="specs">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <ScrollReveal animation="up">
            <div className="text-center mb-16">
              <span className="text-xs font-semibold text-ink-3 uppercase tracking-[0.15em]">Specifications</span>
              <h2 className="text-[clamp(1.75rem,3.5vw,3rem)] font-bold mt-4 tracking-[-0.03em]">
                Technical <span className="gradient-text-cool">Details</span>
              </h2>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="scale">
            <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden divide-y divide-stone-200 shadow-sm">
              {[
                { Icon: Monitor, label: "Projection Technology", value: "LCD (Latest Gen)" },
                { Icon: Film, label: "Resolution", value: "1080p Native (4K Support)" },
                { Icon: Maximize2, label: "Rotation Arm", value: "210° Patented Design" },
                { Icon: Sun, label: "Brightness", value: "200 ANSI Lumens" },
                { Icon: Battery, label: "Battery Life", value: "~2 Hours (Built-in)" },
                { Icon: Wifi, label: "Connectivity", value: "WiFi + BT 5.0 + HDMI + USB" },
                { Icon: Smartphone, label: "Charging", value: "USB-C Fast Charging" },
                { Icon: Weight, label: "Weight", value: "180g (Pocket-Sized)" },
                { Icon: Speaker, label: "Speaker", value: "Built-in 3W Stereo" },
                { Icon: Shield, label: "Warranty", value: "2 Years" },
              ].map(({ Icon: SpecIcon, label, value }) => (
                <div key={label} className="flex items-center gap-4 px-6 sm:px-8 py-4 sm:py-5 hover:bg-stone-50 transition-colors">
                  <SpecIcon className="w-5 h-5 text-ink-3 flex-shrink-0" />
                  <span className="font-medium text-ink text-sm sm:text-base w-[35%]">{label}</span>
                  <span className="text-ink-3 text-sm sm:text-base">{value}</span>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="py-24 sm:py-28 bg-white" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="up">
            <div className="text-center mb-16">
              <span className="text-xs font-semibold text-ink-3 uppercase tracking-[0.15em]">Why Choose Us</span>
              <h2 className="text-[clamp(1.75rem,3.5vw,3rem)] font-bold mt-4 tracking-[-0.03em]">
                The <span className="gradient-text-cool">WM Duo</span> Difference
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { Icon: Award, title: "#1 TikTok Viral", desc: "50,000+ videos, 200M+ views. The most shared projector on social media." },
              { Icon: Shield, title: "Premium Quality", desc: "Every unit undergoes 48-hour rigorous quality testing before shipping." },
              { Icon: Truck, title: "Free Worldwide Shipping", desc: "Free shipping to US, UK, EU, and Asia. Delivered in 7-15 business days." },
              { Icon: RotateCcw, title: "30-Day Returns", desc: "Not happy? Return within 30 days for a full refund. No restocking fee." },
              { Icon: Headphones, title: "24/7 Customer Support", desc: "Real humans via chat, email, and WhatsApp. Average response under 2 hours." },
              { Icon: Lock, title: "Secure Checkout", desc: "256-bit SSL encryption. All major cards and PayPal accepted." },
            ].map(({ Icon: FeatIcon, title, desc }) => (
              <TiltCard key={title} maxTilt={4} scale={1.01}>
                <div className="bg-stone-50 rounded-2xl p-6 sm:p-7 border border-stone-200 hover:border-purple-200 hover:shadow-premium transition-all duration-300 h-full">
                  <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center mb-4">
                    <FeatIcon className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="font-bold text-ink mb-1.5">{title}</h3>
                  <p className="text-sm text-ink-3 leading-relaxed">{desc}</p>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ===== REVIEWS ===== */}
      <section className="py-24 sm:py-28 bg-stone-50" id="reviews">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="up">
            <div className="text-center mb-16">
              <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 px-3.5 py-1.5 rounded-lg text-sm font-medium text-amber-800">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                4.2/5 — 1,247 Reviews
              </span>
              <h2 className="text-[clamp(1.75rem,3.5vw,3rem)] font-bold mt-4 tracking-[-0.03em]">
                What <span className="gradient-text-cool">Customers</span> Say
              </h2>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="scale">
            <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 mb-12 shadow-sm">
              <div className="flex flex-col sm:flex-row gap-8 items-center">
                <div className="text-center flex-shrink-0">
                  <div className="text-5xl sm:text-6xl font-bold gradient-text-cool">4.2</div>
                  <div className="flex items-center gap-0.5 justify-center mt-2">
                    {[...Array(5)].map((_, i) => (
                      i < 4
                        ? <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        : <Star key={i} className="w-4 h-4 text-amber-200" />
                    ))}
                  </div>
                  <div className="text-sm text-ink-3 mt-1">1,247 Verified Reviews</div>
                </div>
                <div className="flex-1 w-full space-y-2">
                  {RATING_BREAKDOWN.map(([label, pct, color]) => (
                    <div key={label} className="flex items-center gap-3 text-sm">
                      <span className="w-10 font-medium text-ink-3">{label}</span>
                      <div className="flex-1 h-2.5 bg-stone-200 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${pct}%`, background: color }} />
                      </div>
                      <span className="w-8 text-right text-ink-3/60">{pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {REVIEWS.map((review, i) => (
              <ScrollReveal key={i} animation="up" delay={i * 100}>
                <div className="bg-white rounded-2xl p-6 sm:p-7 border border-stone-200 hover:border-purple-200 hover:shadow-premium transition-all duration-300">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      Verified Purchase
                      <span className="text-ink-3/40 font-normal ml-1">· {review.time}</span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, j) => (
                        <Star
                          key={j}
                          className={`w-3.5 h-3.5 ${j < review.rating ? "fill-amber-400 text-amber-400" : "text-stone-200"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <h4 className="font-bold text-ink mb-1.5 text-sm">{review.title}</h4>
                  <p className="text-sm text-ink-3 leading-relaxed mb-4">&ldquo;{review.text}&rdquo;</p>
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm"
                      style={{ background: i % 2 === 0 ? "#7C3AED" : "#2563EB" }}
                    >
                      {review.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <strong className="text-sm text-ink">{review.name}</strong>
                      <div className="text-xs text-ink-3/60">{review.location}</div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TIKTOK VIRAL ===== */}
      <section className="relative py-24 sm:py-28 overflow-hidden bg-ink text-white">
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-500 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <ScrollReveal animation="up">
            <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10 text-sm font-medium mb-6">
              <Play className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              TikTok Viral Sensation
            </div>
          </ScrollReveal>
          <ScrollReveal animation="up" delay={100}>
            <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-bold tracking-[-0.03em] mb-2">
              #FakeWindow Trend
            </h2>
          </ScrollReveal>
          <ScrollReveal animation="up" delay={200}>
            <p className="text-lg text-amber-400 font-semibold mb-2">50,000+ videos · 200M+ views · 381% growth</p>
          </ScrollReveal>
          <ScrollReveal animation="up" delay={300}>
            <p className="text-white/50 mb-10">Join the community creating magical spaces with CastleView™</p>
          </ScrollReveal>
          <ScrollReveal animation="scale" delay={400}>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { Icon: Film, label: "50K+ TikToks" },
                { Icon: Eye, label: "200M+ Views" },
                { Icon: BarChart3, label: "381% Growth" },
                { Icon: Globe, label: "15+ Countries" },
              ].map(({ Icon: SocIcon, label }) => (
                <span key={label} className="bg-white/5 backdrop-blur-sm px-5 py-3 rounded-xl text-sm font-medium border border-white/5 hover:bg-white/10 transition flex items-center gap-2">
                  <SocIcon className="w-4 h-4 text-amber-400" />
                  {label}
                </span>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="py-24 sm:py-28 bg-white" id="faq">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <ScrollReveal animation="up">
            <div className="text-center mb-16">
              <span className="text-xs font-semibold text-ink-3 uppercase tracking-[0.15em]">FAQ</span>
              <h2 className="text-[clamp(1.75rem,3.5vw,3rem)] font-bold mt-4 tracking-[-0.03em]">
                Frequently Asked <span className="gradient-text-cool">Questions</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-stone-50 rounded-xl border border-stone-200 overflow-hidden hover:border-stone-300 transition-colors">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex justify-between items-center px-5 sm:px-6 py-4 text-left font-medium text-ink hover:text-purple-700 transition gap-4"
                >
                  <span>{faq.q}</span>
                  <div className={`w-7 h-7 rounded-full bg-white border border-stone-200 flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-45 border-purple-200 bg-purple-50" : ""}`}>
                    <Plus className={`w-3.5 h-3.5 transition-colors ${openFaq === i ? "text-purple-600" : "text-ink-3"}`} />
                  </div>
                </button>
                <div className={`overflow-hidden transition-all duration-400 ${openFaq === i ? "max-h-96" : "max-h-0"}`}>
                  <div className="px-5 sm:px-6 pb-5 text-sm text-ink-3 leading-relaxed border-t border-stone-200 pt-4">{faq.a}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== GUARANTEE ===== */}
      <section className="py-20 sm:py-24 bg-stone-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <ScrollReveal animation="scale">
            <div className="bg-white rounded-3xl p-8 sm:p-14 shadow-premium-lg border border-stone-200 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500" />
              <div className="w-14 h-14 rounded-full bg-purple-50 flex items-center justify-center mx-auto mb-5">
                <Shield className="w-7 h-7 text-purple-600" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-ink">100% Risk-Free Purchase</h2>
              <p className="text-ink-3 leading-relaxed max-w-lg mx-auto mb-8 text-balance">
                You&apos;re covered by our <strong className="text-ink">30-Day Money-Back Guarantee</strong>.
                Not thrilled? Return it for a full refund — no restocking fees, no hassle.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {[
                  { Icon: Lock, label: "Secure Checkout" },
                  { Icon: Truck, label: "Free Shipping" },
                  { Icon: RotateCcw, label: "30-Day Returns" },
                  { Icon: Shield, label: "2-Year Warranty" },
                  { Icon: Headphones, label: "24/7 Support" },
                ].map(({ Icon: GuarIcon, label }) => (
                  <span key={label} className="inline-flex items-center gap-1.5 bg-stone-50 border border-stone-200 px-4 py-2.5 rounded-xl text-sm font-medium text-ink-3 hover:border-purple-200 hover:shadow-sm transition">
                    <GuarIcon className="w-4 h-4 text-purple-500" />
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== ORDER CTA ===== */}
      <section className="py-24 sm:py-28 bg-white" id="order">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <ScrollReveal animation="up">
            <div className="bg-stone-50 rounded-3xl p-8 sm:p-14 border border-stone-200 text-center relative overflow-hidden">
              <div className="inline-flex items-center gap-2 bg-ink text-white px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-6">
                <Zap className="w-3 h-3 text-amber-400" />
                Limited Time Offer
              </div>

              <h2 className="text-[clamp(1.75rem,3vw,2.75rem)] font-bold tracking-[-0.03em] mb-3 text-ink">
                Ready To Transform Your Space?
              </h2>
              <p className="text-ink-3 mb-8 text-balance max-w-md mx-auto">
                Join <strong className="text-ink">12,000+ customers</strong> worldwide. Free shipping, 30-day guarantee.
              </p>

              <div className="flex items-center justify-center gap-5 mb-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl sm:text-6xl font-bold tracking-tight text-ink">$89</span>
                  <span className="text-2xl text-ink-3/40 line-through">$142</span>
                </div>
                <span className="text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">Save 37%</span>
              </div>

              <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 mb-8 text-sm">
                <span className="flex items-center gap-1.5 text-ink-3">
                  <Package className="w-4 h-4 text-amber-500" /> Low stock — selling fast
                </span>
                <span className="flex items-center gap-1.5 text-ink-3">
                  <TrendingUp className="w-4 h-4 text-purple-500" /> Popular choice
                </span>
              </div>

              <button
                onClick={() => alert("Thank you! We'll contact you shortly to complete your order.")}
                className="group relative w-full bg-ink text-white py-5 rounded-xl font-semibold text-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <ShoppingCart className="w-5 h-5 inline mr-2" />
                Order Now — Free Shipping
              </button>

              <div className="mt-4 text-xs text-ink-3 space-y-1">
                <p className="flex items-center justify-center gap-1"><Lock className="w-3 h-3" /> 256-bit SSL Encryption</p>
                <p>Visa · Mastercard · PayPal · Apple Pay · Google Pay</p>
              </div>

              <div className="mt-6 flex items-center justify-center gap-2.5 text-sm text-ink-3 bg-white rounded-xl p-3.5 border border-stone-200">
                <Clock className="w-4 h-4 text-amber-500 animate-pulse-subtle" />
                <span>Price expires in:</span>
                <strong className="text-ink font-mono tabular-nums text-lg">{countdown}</strong>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== CONTACT ===== */}
      <section className="py-24 sm:py-28 bg-stone-50" id="contact">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <ScrollReveal animation="up">
            <div className="text-center mb-16">
              <span className="text-xs font-semibold text-ink-3 uppercase tracking-[0.15em]">Contact</span>
              <h2 className="text-[clamp(1.75rem,3.5vw,3rem)] font-bold mt-4 tracking-[-0.03em]">
                Get In <span className="gradient-text-cool">Touch</span>
              </h2>
              <p className="text-ink-3 mt-3">We&apos;re here 24/7 — real humans, not bots</p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-[1fr_1.5fr] gap-10 max-w-4xl mx-auto">
            <ScrollReveal animation="left">
              <div className="space-y-4">
                {[
                  { Icon: Mail, label: "Email", value: "hello@wmduo.com", sub: "Response within 4 hours" },
                  { Icon: MessageCircle, label: "WhatsApp", value: "+92 344 7186276", sub: "Fastest response" },
                  { Icon: Globe, label: "Shipping", value: "Worldwide — US, UK, EU, Asia", sub: "7-15 business days" },
                  { Icon: Shield, label: "Guarantee", value: "30-day money-back", sub: "No questions asked" },
                ].map(({ Icon: ContactIcon, label, value, sub }) => (
                  <div key={label} className="flex gap-4 p-4 bg-white rounded-xl border border-stone-200 hover:border-purple-200 hover:shadow-premium transition-all">
                    <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                      <ContactIcon className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <strong className="text-sm text-ink">{label}</strong>
                      <p className="text-sm text-ink-3">{value}</p>
                      <p className="text-xs text-ink-3/60 mt-0.5">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal animation="right">
              <form
                onSubmit={async (e) => {
                  e.preventDefault()
                  const form = e.currentTarget as HTMLFormElement
                  const fd = new FormData(form)
                  try {
                    const res = await fetch("/api/contact", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        name: fd.get("name"),
                        email: fd.get("email"),
                        message: fd.get("message"),
                      }),
                    })
                    const r = await res.json()
                    if (res.ok) { alert("Message sent! We'll get back to you soon."); form.reset() }
                    else alert("Error: " + r.error)
                  } catch { alert("Network error. Please try again.") }
                }}
                className="space-y-4 bg-white rounded-2xl p-6 sm:p-8 shadow-premium border border-stone-200"
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <input name="name" required placeholder="Your Name"
                    className="w-full px-4 py-3.5 border-2 border-stone-200 rounded-xl focus:border-purple-400 focus:ring-4 focus:ring-purple-500/10 outline-none transition text-sm bg-stone-50" />
                  <input name="email" type="email" required placeholder="Your Email"
                    className="w-full px-4 py-3.5 border-2 border-stone-200 rounded-xl focus:border-purple-400 focus:ring-4 focus:ring-purple-500/10 outline-none transition text-sm bg-stone-50" />
                </div>
                <textarea name="message" required rows={4} placeholder="Your Message"
                  className="w-full px-4 py-3.5 border-2 border-stone-200 rounded-xl focus:border-purple-400 focus:ring-4 focus:ring-purple-500/10 outline-none transition text-sm resize-none bg-stone-50" />
                <button type="submit" className="w-full bg-ink text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0">
                  Send Message
                </button>
              </form>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ===== WHATSAPP FLOAT ===== */}
      <a
        href="https://wa.me/923447186276"
        target="_blank"
        rel="noopener"
        className={`fixed bottom-6 right-6 z-[9998] w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-premium-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 ${
          scrolled ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
        }`}
      >
        <MessageCircle className="w-6 h-6" />
      </a>

      <Footer />
    </div>
  )
}
