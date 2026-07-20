import Link from "next/link"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0D0D12] text-[#E4E4E7]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-24">
        <Link href="/" className="text-[#E8A94C] text-sm hover:underline mb-8 inline-block">&larr; Back to Home</Link>
        <h1 className="font-['Playfair_Display',serif] text-4xl font-bold text-white mb-8">Privacy Policy</h1>
        <div className="space-y-6 text-[#A1A1AA] leading-relaxed">
          <p><strong className="text-white">Last updated:</strong> July 2026</p>
          <h2 className="text-xl font-semibold text-white mt-8">1. Information We Collect</h2>
          <p>We collect information you provide directly to us, including your name, email address, shipping address, and payment information when you make a purchase or contact us.</p>
          <h2 className="text-xl font-semibold text-white mt-8">2. How We Use Your Information</h2>
          <p>We use your information to process orders, provide customer support, improve our products, and send occasional marketing communications (with your consent).</p>
          <h2 className="text-xl font-semibold text-white mt-8">3. Data Security</h2>
          <p>We implement 256-bit SSL encryption and follow industry standards to protect your personal information. We do not store full credit card numbers on our servers.</p>
          <h2 className="text-xl font-semibold text-white mt-8">4. Third-Party Services</h2>
          <p>We use trusted third-party payment processors and shipping partners. Each service has its own privacy policy governing data handling.</p>
          <h2 className="text-xl font-semibold text-white mt-8">5. Contact</h2>
          <p>For privacy-related inquiries, contact us at <a href="mailto:hello@wmduo.com" className="text-[#E8A94C] hover:underline">hello@wmduo.com</a>.</p>
        </div>
      </div>
    </div>
  )
}
