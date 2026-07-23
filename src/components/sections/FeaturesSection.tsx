"use client"

const FEATURES = [
  { emoji: "✦", title: "Premium Quality", desc: "Every product personally tested before it reaches your door." },
  { emoji: "🛡️", title: "2-Year Warranty", desc: "All electronics come with a minimum 2-year hassle-free warranty." },
  { emoji: "🚚", title: "Free Shipping", desc: "Free to 30+ countries on orders over $50. Delivered in 7-15 days." },
  { emoji: "↩️", title: "30-Day Returns", desc: "Not happy? Return within 30 days for a full refund." },
  { emoji: "💬", title: "24/7 Support", desc: "Real humans on WhatsApp and email. Response under 2 hours." },
  { emoji: "🔒", title: "Secure Checkout", desc: "256-bit SSL encryption. Your data is never stored on our servers." },
]

export default function FeaturesSection() {
  return (
    <section id="features" className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
      <span className="text-[10px] font-semibold tracking-widest uppercase text-brown-mid">✦ Atelier</span>
      <h2 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl font-bold text-brown-deep mt-1 mb-8">
        The <span className="text-gold italic">Difference</span>
      </h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {FEATURES.map((f, i) => (
          <div key={f.title} className="bento-card bento-card--white animate-float-in" style={{ animationDelay: `${i * 60}ms` }}>
            <span className="text-2xl mb-3 block">{f.emoji}</span>
            <h3 className="font-['Playfair_Display',serif] text-lg font-bold text-brown-deep">{f.title}</h3>
            <p className="text-sm text-brown-mid mt-1 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
