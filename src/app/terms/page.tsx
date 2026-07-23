import Link from "next/link"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white-soft text-brown-mid">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-24">
        <Link href="/" className="text-[#E8A94C] text-sm hover:underline mb-8 inline-block">&larr; Back to Home</Link>
        <h1 className="font-['Playfair_Display',serif] text-4xl font-bold text-brown-deep mb-8">Terms of Service</h1>
        <div className="space-y-6 text-brown-mid leading-relaxed">
          <p><strong className="text-brown-deep">Last updated:</strong> July 2026</p>
          <h2 className="text-xl font-semibold text-brown-deep mt-8">1. Acceptance of Terms</h2>
          <p>By purchasing from WM Duo, you agree to these terms. If you do not agree, please do not use our services.</p>
          <h2 className="text-xl font-semibold text-brown-deep mt-8">2. Products & Pricing</h2>
          <p>All prices are in USD. We reserve the right to modify prices at any time. Product images are for illustration; actual products may vary slightly.</p>
          <h2 className="text-xl font-semibold text-brown-deep mt-8">3. Shipping & Delivery</h2>
          <p>Estimated delivery times are provided at checkout and are not guaranteed. Delays due to customs or carrier issues are beyond our control.</p>
          <h2 className="text-xl font-semibold text-brown-deep mt-8">4. Returns & Refunds</h2>
          <p>Our 30-day return policy applies. Items must be returned in original condition. Refunds are processed within 5-7 business days of receiving the return.</p>
          <h2 className="text-xl font-semibold text-brown-deep mt-8">5. Limitation of Liability</h2>
          <p>WM Duo is not liable for incidental or consequential damages arising from product use.</p>
        </div>
      </div>
    </div>
  )
}
