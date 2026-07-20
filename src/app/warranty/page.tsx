import Link from "next/link"

export default function WarrantyPage() {
  return (
    <div className="min-h-screen bg-[#0D0D12] text-[#E4E4E7]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-24">
        <Link href="/" className="text-[#E8A94C] text-sm hover:underline mb-8 inline-block">&larr; Back to Home</Link>
        <h1 className="font-['Playfair_Display',serif] text-4xl font-bold text-white mb-8">Returns & Warranty</h1>
        <div className="space-y-6 text-[#A1A1AA] leading-relaxed">
          <h2 className="text-xl font-semibold text-white mt-4">30-Day Money-Back Guarantee</h2>
          <p>If you are not completely satisfied with your CastleView™ projector, return it within 30 days of delivery for a full refund. No restocking fees.</p>
          <h2 className="text-xl font-semibold text-white mt-8">Return Process</h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Contact us at <a href="mailto:hello@wmduo.com" className="text-[#E8A94C] hover:underline">hello@wmduo.com</a> with your order number</li>
            <li>We will provide a return shipping label (defective items) or instructions (change-of-mind returns)</li>
            <li>Ship the item back in original packaging within 7 days of receiving the label</li>
            <li>Refund processed within 5-7 business days of receiving the return</li>
          </ol>
          <h2 className="text-xl font-semibold text-white mt-8">2-Year Warranty</h2>
          <p>All CastleView™ projectors come with a 2-year warranty against manufacturing defects. This covers hardware malfunctions but not damage from misuse, water damage, or unauthorized modifications.</p>
          <h2 className="text-xl font-semibold text-white mt-8">Warranty Claims</h2>
          <p>To file a warranty claim, email <a href="mailto:hello@wmduo.com" className="text-[#E8A94C] hover:underline">hello@wmduo.com</a> with your order number and a description of the issue. We typically respond within 24 hours.</p>
        </div>
      </div>
    </div>
  )
}
