import Link from "next/link"

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-[#0D0D12] text-[#E4E4E7]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-24">
        <Link href="/" className="text-[#E8A94C] text-sm hover:underline mb-8 inline-block">&larr; Back to Home</Link>
        <h1 className="font-['Playfair_Display',serif] text-4xl font-bold text-white mb-8">Shipping Information</h1>
        <div className="space-y-6 text-[#A1A1AA] leading-relaxed">
          <h2 className="text-xl font-semibold text-white mt-4">Free Worldwide Shipping</h2>
          <p>We offer free shipping to all destinations worldwide. No minimum order required.</p>
          <h2 className="text-xl font-semibold text-white mt-8">Delivery Times</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong className="text-white">United States:</strong> 5-8 business days</li>
            <li><strong className="text-white">United Kingdom:</strong> 5-8 business days</li>
            <li><strong className="text-white">European Union:</strong> 7-12 business days</li>
            <li><strong className="text-white">Asia &amp; Rest of World:</strong> 7-15 business days</li>
          </ul>
          <h2 className="text-xl font-semibold text-white mt-8">Order Tracking</h2>
          <p>All orders are tracked. You will receive a tracking number via email once your order ships.</p>
          <h2 className="text-xl font-semibold text-white mt-8">Customs &amp; Duties</h2>
          <p>International orders may be subject to customs fees. WM Duo is not responsible for these charges.</p>
        </div>
      </div>
    </div>
  )
}
