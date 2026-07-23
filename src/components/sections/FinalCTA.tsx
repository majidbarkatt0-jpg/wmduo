"use client"
import Link from "next/link"

export default function FinalCTA() {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-8 py-16">
      <div className="bento-card bento-card--brown !p-10 sm:!p-16 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-gold via-gold-soft to-gold" />
        <span className="text-4xl mb-4 block">✦</span>
        <h2 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl font-bold text-white mb-3">
          Ready to Level Up Your <span className="text-gold italic">Tech</span>?
        </h2>
        <p className="text-white/60 max-w-md mx-auto mb-8 text-sm">
          Join 12,000+ happy customers worldwide. Free shipping, 30-day returns, and 24/7 support.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/products" className="btn-gold !bg-gold !text-white !border-gold hover:!bg-gold-soft hover:!text-brown-deep no-underline">
            Shop Now →
          </Link>
          <Link href="/#contact" className="btn-brown no-underline">
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  )
}
