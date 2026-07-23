"use client"

const STATS = [
  { label: "Happy Customers", value: "12,000+", emoji: "✦" },
  { label: "Countries Shipped", value: "30+", emoji: "🌍" },
  { label: "Product Categories", value: "8", emoji: "📦" },
  { label: "Avg Rating", value: "4.5★", emoji: "★" },
]

export default function StatsBanner() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {STATS.map((s, i) => (
          <div key={s.label} className="bento-card bento-card--white items-center text-center animate-float-in"
            style={{ animationDelay: `${i * 80}ms` }}>
            <span className="text-2xl mb-1">{s.emoji}</span>
            <div className="font-['Playfair_Display',serif] text-2xl sm:text-3xl font-black text-gold">{s.value}</div>
            <div className="text-xs text-brown-mid font-medium">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
