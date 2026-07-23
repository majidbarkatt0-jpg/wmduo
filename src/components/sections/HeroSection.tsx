"use client"
import Link from "next/link"

export default function HeroSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-8 grid lg:grid-cols-2 gap-10 items-center py-10 pb-16 border-b border-gold/10">
      <div>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white rounded-full border border-gold/10 text-[10px] font-semibold tracking-widest uppercase text-brown-mid mb-6 shadow-sm">
          ✦ Premium Tech &amp; Objects
        </div>
        <h1 className="font-['Playfair_Display',serif] text-[clamp(2.8rem,6vw,5rem)] font-black leading-[1.02] tracking-[-0.03em] text-brown-deep">
          Where <span className="bg-gradient-to-r from-gold to-gold-soft bg-clip-text text-transparent italic">Vision</span>
          <br />Meets Craft
        </h1>
        <p className="text-lg text-brown-mid max-w-md mt-4 font-light leading-relaxed">
          Curated tech and lifestyle objects — each piece tested for quality, built to last, backed by our satisfaction guarantee.
        </p>
        <div className="flex gap-3 mt-8">
          <Link href="/products" className="btn-gold inline-flex items-center gap-2 no-underline">
            Explore Collection <span className="text-base leading-none">→</span>
          </Link>
          <Link href="/#features" className="btn-brown inline-flex items-center gap-2 no-underline">
            Our Atelier
          </Link>
        </div>
      </div>

      {/* Orbital duo visual */}
      <div className="hidden lg:flex items-center justify-center relative h-[400px]">
        <div className="absolute w-[280px] h-[280px] rounded-full border border-gold/20 animate-[orbitSpin_22s_linear_infinite]">
          <div className="absolute w-6 h-6 bg-gradient-to-br from-gold-soft to-gold rounded-full shadow-[0_0_60px_rgba(212,175,55,0.4)] -top-3 left-1/2 -translate-x-1/2" />
        </div>
        <div className="absolute w-[380px] h-[380px] rounded-full border border-gold/10 animate-[orbitSpin_30s_linear_infinite_reverse]">
          <div className="absolute w-[18px] h-[18px] bg-gradient-to-br from-gold to-brown-rich rounded-full shadow-[0_0_40px_rgba(212,175,55,0.3)] -top-[9px] left-1/2 -translate-x-1/2" />
        </div>
        <div className="relative z-10 font-['Playfair_Display',serif] text-xl font-bold text-brown-deep bg-white px-7 py-4 rounded-full shadow-[0_20px_60px_rgba(44,30,22,0.08)] border border-gold/15 tracking-wider">
          ✦ <span className="text-gold">DUO</span>
        </div>
      </div>
    </section>
  )
}
