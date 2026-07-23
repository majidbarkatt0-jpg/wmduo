"use client"
import { useState } from "react"

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" })
  const [done, setDone] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (res.ok) { setDone(true); setForm({ name: "", email: "", message: "" }); setTimeout(() => setDone(false), 5000) }
    } catch {}
  }

  return (
    <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
      <div className="text-center mb-10">
        <span className="text-[10px] font-semibold tracking-widest uppercase text-brown-mid">✦ Get in Touch</span>
        <h2 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl font-bold text-brown-deep mt-1">
          We&apos;re Here to <span className="text-gold italic">Help</span>
        </h2>
      </div>

      <div className="grid md:grid-cols-[1fr_1.5fr] gap-6 max-w-4xl mx-auto">
        <div className="space-y-3">
          {[
            { emoji: "💬", title: "WhatsApp", desc: "Fastest response — under 10 minutes." },
            { emoji: "✉️", title: "Email", desc: "hello@wmduo.com — within 24 hours." },
            { emoji: "🛡️", title: "Live Chat", desc: "Available 24/7 on our website." },
          ].map((item) => (
            <div key={item.title} className="bento-card bento-card--white">
              <span className="text-xl mb-1 block">{item.emoji}</span>
              <h3 className="font-semibold text-brown-deep text-sm">{item.title}</h3>
              <p className="text-xs text-brown-mid">{item.desc}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="bento-card bento-card--white">
          {done ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <span className="text-4xl mb-3">✓</span>
              <h3 className="font-bold text-brown-deep text-lg">Message Sent!</h3>
              <p className="text-sm text-brown-mid">We&apos;ll get back to you within 24 hours.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-semibold tracking-widest uppercase text-brown-mid block mb-1.5">Name</label>
                <input type="text" required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full bg-white-soft border border-gold/10 rounded-xl px-4 py-3 text-sm text-brown-deep placeholder-brown-light outline-none focus:border-gold/40 transition-all"
                  placeholder="Your name" />
              </div>
              <div>
                <label className="text-[10px] font-semibold tracking-widest uppercase text-brown-mid block mb-1.5">Email</label>
                <input type="email" required value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  className="w-full bg-white-soft border border-gold/10 rounded-xl px-4 py-3 text-sm text-brown-deep placeholder-brown-light outline-none focus:border-gold/40 transition-all"
                  placeholder="your@email.com" />
              </div>
              <div>
                <label className="text-[10px] font-semibold tracking-widest uppercase text-brown-mid block mb-1.5">Message</label>
                <textarea required rows={4} value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                  className="w-full bg-white-soft border border-gold/10 rounded-xl px-4 py-3 text-sm text-brown-deep placeholder-brown-light outline-none focus:border-gold/40 transition-all resize-none"
                  placeholder="How can we help?" />
              </div>
              <button type="submit"
                className="btn-brown w-full text-center">
                Send Message
              </button>
            </div>
          )}
        </form>
      </div>
    </section>
  )
}
