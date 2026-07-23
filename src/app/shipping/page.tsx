import Link from "next/link"

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-white-soft text-brown-mid">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-24">
        <Link href="/" className="text-[#E8A94C] text-sm hover:underline mb-8 inline-block">&larr; Back to Home</Link>
        <h1 className="font-['Playfair_Display',serif] text-4xl font-bold text-brown-deep mb-8">Shipping Information</h1>
        <div className="space-y-6 text-brown-mid leading-relaxed">
          <h2 className="text-xl font-semibold text-brown-deep mt-4">Free Worldwide Shipping</h2>
          <p>We offer free shipping to all destinations worldwide. No minimum order required.</p>
          <h2 className="text-xl font-semibold text-brown-deep mt-8">Delivery Times</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong className="text-brown-deep">United States:</strong> 5-8 business days</li>
            <li><strong className="text-brown-deep">United Kingdom:</strong> 5-8 business days</li>
            <li><strong className="text-brown-deep">European Union:</strong> 7-12 business days</li>
            <li><strong className="text-brown-deep">Asia &amp; Rest of World:</strong> 7-15 business days</li>
          </ul>
          <h2 className="text-xl font-semibold text-brown-deep mt-8">Order Tracking</h2>
          <p>All orders are tracked. You will receive a tracking number via email once your order ships.</p>
          <h2 className="text-xl font-semibold text-brown-deep mt-8">Customs &amp; Duties</h2>
          <p>International orders may be subject to customs fees. WM Duo is not responsible for these charges.</p>
        </div>
      </div>
    </div>
  )
}
