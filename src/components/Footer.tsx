import Link from "next/link"
import { Mail, MessageCircle, Globe, Clock, Shield, ChevronRight } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-[#0D0D12] text-white pt-16 pb-8 border-t border-[#2A2A35]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl gradient-text font-bold">◈</span>
              <span className="text-xl font-extrabold text-white">
                WM<span className="text-[#A78BFA]">DUO</span>
              </span>
            </div>
            <p className="text-[#52525B] text-sm leading-relaxed max-w-xs">
              Premium lifestyle innovations that transform your everyday spaces into extraordinary experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
            <div className="flex flex-col gap-2">
              <Link href="/" className="text-[#52525B] text-sm hover:text-[#E8A94C] transition inline-flex items-center gap-1">
                <ChevronRight className="w-3 h-3 text-[#E8A94C]" /> Home
              </Link>
              <Link href="/#product" className="text-[#52525B] text-sm hover:text-[#E8A94C] transition inline-flex items-center gap-1">
                <ChevronRight className="w-3 h-3 text-[#E8A94C]" /> CastleView&trade;
              </Link>
              <Link href="/#features" className="text-[#52525B] text-sm hover:text-[#E8A94C] transition inline-flex items-center gap-1">
                <ChevronRight className="w-3 h-3 text-[#E8A94C]" /> Why WM Duo
              </Link>
              <Link href="/#reviews" className="text-[#52525B] text-sm hover:text-[#E8A94C] transition inline-flex items-center gap-1">
                <ChevronRight className="w-3 h-3 text-[#E8A94C]" /> Reviews
              </Link>
              <Link href="/#faq" className="text-[#52525B] text-sm hover:text-[#E8A94C] transition inline-flex items-center gap-1">
                <ChevronRight className="w-3 h-3 text-[#E8A94C]" /> FAQ
              </Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Support</h4>
            <div className="flex flex-col gap-2">
              <Link href="/#contact" className="text-[#52525B] text-sm hover:text-[#E8A94C] transition inline-flex items-center gap-1">
                <ChevronRight className="w-3 h-3 text-[#E8A94C]" /> Contact Us
              </Link>
              <Link href="/shipping" className="text-[#52525B] text-sm hover:text-[#E8A94C] transition inline-flex items-center gap-1">
                <ChevronRight className="w-3 h-3 text-[#E8A94C]" /> Shipping Info
              </Link>
              <Link href="/warranty" className="text-[#52525B] text-sm hover:text-[#E8A94C] transition inline-flex items-center gap-1">
                <ChevronRight className="w-3 h-3 text-[#E8A94C]" /> Returns & Warranty
              </Link>
              <Link href="/privacy" className="text-[#52525B] text-sm hover:text-[#E8A94C] transition inline-flex items-center gap-1">
                <ChevronRight className="w-3 h-3 text-[#E8A94C]" /> Privacy Policy
              </Link>
              <Link href="/terms" className="text-[#52525B] text-sm hover:text-[#E8A94C] transition inline-flex items-center gap-1">
                <ChevronRight className="w-3 h-3 text-[#E8A94C]" /> Terms of Service
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Contact</h4>
            <div className="flex flex-col gap-3 text-sm">
              <a href="mailto:hello@wmduo.com" className="text-[#52525B] hover:text-[#E8A94C] transition inline-flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#E8A94C]" /> hello@wmduo.com
              </a>
              <a href="https://wa.me/923447186276" target="_blank" rel="noopener" className="text-[#52525B] hover:text-[#E8A94C] transition inline-flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#25D366]" /> WhatsApp
              </a>
              <span className="text-[#52525B] inline-flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#6C63FF]" /> Worldwide Shipping
              </span>
              <span className="text-[#52525B] inline-flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#6C63FF]" /> Response: 4 hours
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-[#2A2A35] pt-6 text-center">
          <p className="text-[#52525B] text-sm">&copy; 2026 <strong className="text-[#A1A1AA]">WM Duo</strong>. All rights reserved.</p>
          <p className="text-[#2A2A35] text-xs mt-1">* All prices in USD. Free shipping applies to all destinations.</p>
        </div>
      </div>
    </footer>
  )
}
