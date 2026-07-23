import Link from "next/link"

const links = [
  { label: "Objects", href: "/products" },
  { label: "Journal", href: "/blog" },
  { label: "Atelier", href: "/#features" },
  { label: "Contact", href: "/#contact" },
]
const support = [
  { label: "Shipping", href: "/shipping" },
  { label: "Warranty", href: "/warranty" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
]

export default function Footer() {
  return (
    <footer className="border-t border-gold/10 mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        <div className="grid sm:grid-cols-3 gap-8 mb-10">
          <div>
            <Link href="/" className="font-['Playfair_Display',serif] text-xl font-bold text-brown-deep no-underline">
              WM<span className="text-gold italic">DUO</span>
            </Link>
            <p className="text-sm text-brown-mid mt-2 max-w-xs leading-relaxed">
              Premium tech and lifestyle objects — curated, tested, and built to last.
            </p>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold tracking-widest uppercase text-brown-mid mb-4">Navigate</h4>
            <div className="flex flex-col gap-2">
              {links.map(l => (
                <Link key={l.href} href={l.href} className="text-sm text-brown-rich no-underline hover:text-gold transition-colors">{l.label}</Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold tracking-widest uppercase text-brown-mid mb-4">Support</h4>
            <div className="flex flex-col gap-2">
              {support.map(s => (
                <Link key={s.href} href={s.href} className="text-sm text-brown-rich no-underline hover:text-gold transition-colors">{s.label}</Link>
              ))}
            </div>
            <p className="text-xs text-brown-mid mt-4">
              WhatsApp: <a href="https://wa.me/923447186276" target="_blank" rel="noopener noreferrer" className="text-gold no-underline hover:underline">+92 344 7186276</a>
            </p>
          </div>
        </div>
        <div className="border-t border-gold/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-brown-mid">
          <span>© 2026 <span className="font-semibold text-gold">WMDuo</span> · All rights reserved.</span>
          <span>Crafted with <span className="text-gold">✦</span> precision</span>
        </div>
      </div>
    </footer>
  )
}
