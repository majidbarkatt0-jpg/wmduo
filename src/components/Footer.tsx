import Link from "next/link"

export default function Footer() {
  return (
    <footer className="gradient-dark text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl gradient-text font-bold">◈</span>
              <span className="text-xl font-extrabold text-white">
                WM<span className="text-primary-light">DUO</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Premium lifestyle innovations that transform your everyday spaces into extraordinary experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
            <div className="flex flex-col gap-2">
              <Link href="/" className="text-gray-400 text-sm hover:text-primary-light transition">Home</Link>
              <Link href="/#products" className="text-gray-400 text-sm hover:text-primary-light transition">CastleView™</Link>
              <Link href="/#features" className="text-gray-400 text-sm hover:text-primary-light transition">Why WM Duo</Link>
              <Link href="/#reviews" className="text-gray-400 text-sm hover:text-primary-light transition">Reviews</Link>
              <Link href="/#faq" className="text-gray-400 text-sm hover:text-primary-light transition">FAQ</Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Support</h4>
            <div className="flex flex-col gap-2">
              <Link href="/#contact" className="text-gray-400 text-sm hover:text-primary-light transition">Contact Us</Link>
              <Link href="/#faq" className="text-gray-400 text-sm hover:text-primary-light transition">Shipping Info</Link>
              <Link href="/#faq" className="text-gray-400 text-sm hover:text-primary-light transition">Returns & Warranty</Link>
              <span className="text-gray-500 text-sm">Privacy Policy</span>
              <span className="text-gray-500 text-sm">Terms of Service</span>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Contact</h4>
            <div className="flex flex-col gap-2 text-sm">
              <a href="mailto:hello@wmduo.com" className="text-gray-400 hover:text-primary-light transition">✉️ hello@wmduo.com</a>
              <a href="https://wa.me/923447186276" target="_blank" rel="noopener" className="text-gray-400 hover:text-primary-light transition">💬 WhatsApp</a>
              <span className="text-gray-500">🌍 Worldwide Shipping</span>
              <span className="text-gray-500">🕐 Response: 4 hours</span>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 text-center">
          <p className="text-gray-500 text-sm">© 2026 <strong className="text-gray-400">WM Duo</strong>. All rights reserved.</p>
          <p className="text-gray-600 text-xs mt-1">* All prices in USD. Free shipping applies to all destinations.</p>
        </div>
      </div>
    </footer>
  )
}
