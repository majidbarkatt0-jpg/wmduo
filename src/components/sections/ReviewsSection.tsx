"use client"

const REVIEWS = [
  { name: "Ahmed K.", location: "Dubai, UAE", rating: 5, text: "Ordered my projector and it arrived in 5 days. The build quality is premium — feels like a $200 device, not a $90 one." },
  { name: "Sarah M.", location: "London, UK", rating: 5, text: "The essential oil diffuser is gorgeous. Real quality craftsmanship." },
  { name: "Raj P.", location: "Mumbai, India", rating: 5, text: "Had an issue with my order and they resolved it within 2 hours on WhatsApp. Truly exceptional support." },
  { name: "Emma L.", location: "Sydney, AUS", rating: 4, text: "The air purifier is incredible for the price. My allergies have improved so much!" },
  { name: "Carlos G.", location: "Mexico City, MX", rating: 5, text: "Ordered on Monday, arrived by Friday from across the world. Very impressed." },
  { name: "Aisha R.", location: "Riyadh, KSA", rating: 5, text: "Third time ordering from WM Duo. Always consistent quality." },
]

export default function ReviewsSection() {
  return (
    <section id="reviews" className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
      <div className="text-center mb-10">
        <span className="text-[10px] font-semibold tracking-widest uppercase text-brown-mid">✦ 4.5/5 — 2,000+ Reviews</span>
        <h2 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl font-bold text-brown-deep mt-1">
          What Our <span className="text-gold italic">Customers Say</span>
        </h2>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {REVIEWS.map((r, i) => (
          <div key={i} className="bento-card bento-card--white animate-float-in" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="flex items-center gap-1 mb-3">
              {Array.from({ length: 5 }).map((_, s) => (
                <span key={s} className={`text-sm ${s < r.rating ? "text-gold" : "text-brown-light/30"}`}>★</span>
              ))}
            </div>
            <p className="text-sm text-brown-mid leading-relaxed mb-4 italic">&ldquo;{r.text}&rdquo;</p>
            <div className="flex items-center gap-3 pt-3 border-t border-gold/10">
              <div className="w-8 h-8 rounded-full bg-brown-deep text-white text-xs font-bold flex items-center justify-center">
                {r.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold text-brown-deep">{r.name}</p>
                <p className="text-xs text-brown-mid">{r.location}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
