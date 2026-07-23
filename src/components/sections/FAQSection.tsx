"use client"
import { useState } from "react"

const FAQ_DATA = [
  { q: "How long does shipping take?", a: "Orders ship within 24 hours. Standard delivery takes 7-15 business days worldwide. Express shipping (3-5 days) is available at checkout." },
  { q: "What is your return policy?", a: "We offer 30-day hassle-free returns. Items must be unused and in original packaging." },
  { q: "Do you ship internationally?", a: "Yes! We ship to over 30 countries. Free shipping on orders over $50." },
  { q: "Are payments secure?", a: "Absolutely. We use 256-bit SSL encryption. Your data is never stored on our servers." },
  { q: "How do I track my order?", a: "Once shipped, you'll receive a tracking number via email. You can also track orders in your account dashboard." },
  { q: "What warranty do you offer?", a: "All electronics come with a 2-year warranty. Accessories carry a 1-year warranty." },
]

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="faq" className="max-w-3xl mx-auto px-4 sm:px-8 py-16">
      <div className="text-center mb-10">
        <span className="text-[10px] font-semibold tracking-widest uppercase text-brown-mid">✦ FAQ</span>
        <h2 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl font-bold text-brown-deep mt-1">
          Got <span className="text-gold italic">Questions?</span>
        </h2>
      </div>

      <div className="space-y-2">
        {FAQ_DATA.map((faq, i) => (
          <div key={i}
            className="bento-card bento-card--white !p-0 cursor-pointer animate-float-in"
            style={{ animationDelay: `${i * 40}ms` }}
            onClick={() => setOpen(open === i ? null : i)}>
            <div className="flex items-center justify-between p-5">
              <h3 className="font-semibold text-sm text-brown-deep pr-4">{faq.q}</h3>
              <span className={`text-gold text-lg transition-transform duration-300 ${open === i ? "rotate-45" : ""}`}>+</span>
            </div>
            <div className="overflow-hidden transition-all duration-400"
              style={{ maxHeight: open === i ? "200px" : "0px" }}>
              <p className="px-5 pb-5 text-sm text-brown-mid leading-relaxed">{faq.a}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
