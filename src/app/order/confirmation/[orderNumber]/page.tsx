"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle, ShoppingCart, Truck, Shield, ArrowRight, Package, Clock, MapPin, Mail, Phone, User } from "lucide-react"

interface Order {
  id: string
  orderNumber: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  country: string
  zipCode: string
  total: number
  status: string
  createdAt: string
  items: Array<{
    name: string
    price: number
    quantity: number
    imageUrl: string
  }>
}

export default function OrderConfirmationPage() {
  const params = useParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const orderNumber = params.orderNumber as string

  useEffect(() => {
    // Fetch order by orderNumber
    // Since we don't have a public API for this, we'll store in sessionStorage
    const stored = sessionStorage.getItem(`order_${orderNumber}`)
    if (stored) {
      try {
        setOrder(JSON.parse(stored))
        setLoading(false)
        return
      } catch {}
    }
    // Fallback: try to fetch from API (only works if user is logged in as admin)
    setLoading(false)
    setError("Order details not available. Check your email for confirmation.")
  }, [orderNumber])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D12] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#E8A94C] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0D0D12]">
      {/* Mini header */}
      <div className="bg-[#1A1A23] border-b border-[#2A2A35] py-4">
        <div className="max-w-3xl mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl gradient-text font-bold">◈</span>
            <span className="text-lg font-extrabold text-white">WM<span className="text-[#A78BFA]">DUO</span></span>
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
        {/* Success Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 rounded-full bg-[#34D399]/10 flex items-center justify-center mx-auto mb-6 border border-[#34D399]/20">
            <CheckCircle className="w-10 h-10 text-[#34D399]" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Order Confirmed! 🎉</h1>
          <p className="text-[#A1A1AA]">
            Thank you, <strong className="text-white">{order?.name || "customer"}</strong>!
            Your order has been placed successfully.
          </p>
        </div>

        {order ? (
          <>
            {/* Order Number Card */}
            <div className="bg-[#1A1A23] rounded-2xl border border-[#2A2A35] p-6 sm:p-8 mb-6 text-center">
              <p className="text-xs text-[#52525B] uppercase tracking-wider mb-1">Order Number</p>
              <p className="text-2xl sm:text-3xl font-bold text-[#E8A94C] font-mono">{order.orderNumber}</p>
              <div className="flex items-center justify-center gap-4 mt-4 text-xs text-[#52525B]">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <Package className="w-3 h-3" />
                  <span className="capitalize">{order.status}</span>
                </span>
              </div>
            </div>

            {/* Items */}
            <div className="bg-[#1A1A23] rounded-2xl border border-[#2A2A35] p-6 sm:p-8 mb-6">
              <h2 className="font-bold text-white mb-5 flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-[#E8A94C]" />
                Items Ordered
              </h2>
              {order.items.map((item, i) => (
                <div key={i} className="flex gap-4 pb-4 mb-4 border-b border-[#2A2A35] last:border-0 last:pb-0 last:mb-0">
                  {item.imageUrl && (
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#0D0D12] flex-shrink-0">
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{item.name}</p>
                    <p className="text-xs text-[#A1A1AA] mt-0.5">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-bold text-white">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            {/* Shipping Details */}
            <div className="bg-[#1A1A23] rounded-2xl border border-[#2A2A35] p-6 sm:p-8 mb-6">
              <h2 className="font-bold text-white mb-5 flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#E8A94C]" />
                Shipping Details
              </h2>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div className="bg-[#0D0D12] rounded-xl p-4 border border-[#2A2A35]">
                  <p className="text-xs text-[#E8A94C] font-semibold mb-2">Contact</p>
                  <p className="text-white font-medium flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-[#A1A1AA]" /> {order.name}</p>
                  <p className="text-[#A1A1AA] flex items-center gap-1.5 mt-1"><Mail className="w-3.5 h-3.5" /> {order.email}</p>
                  {order.phone && <p className="text-[#A1A1AA] flex items-center gap-1.5 mt-1"><Phone className="w-3.5 h-3.5" /> {order.phone}</p>}
                </div>
                <div className="bg-[#0D0D12] rounded-xl p-4 border border-[#2A2A35]">
                  <p className="text-xs text-[#E8A94C] font-semibold mb-2">Shipping Address</p>
                  <p className="text-white">{order.address}</p>
                  <p className="text-[#A1A1AA]">{order.city}, {order.country}</p>
                  {order.zipCode && <p className="text-[#A1A1AA]">{order.zipCode}</p>}
                </div>
              </div>
            </div>

            {/* Total */}
            <div className="bg-[#1A1A23] rounded-2xl border border-[#2A2A35] p-6 sm:p-8 mb-8">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-[#A1A1AA]">Total Charged</p>
                  <p className="text-xs text-[#52525B]">Free Shipping · 30-Day Guarantee</p>
                </div>
                <p className="text-3xl font-bold text-[#E8A94C]">${order.total.toFixed(2)}</p>
              </div>
            </div>
          </>
        ) : (
          /* Fallback if order data not available */
          <div className="bg-[#1A1A23] rounded-2xl border border-[#2A2A35] p-8 mb-6 text-center">
            <Package className="w-12 h-12 text-[#E8A94C] mx-auto mb-4" />
            <p className="text-[#A1A1AA] mb-2">{error || "Order confirmed!"}</p>
            <p className="text-xs text-[#52525B]">Order #{orderNumber}</p>
          </div>
        )}

        {/* CTA */}
        <div className="text-center space-y-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 gradient-bg text-white px-8 py-4 rounded-2xl font-bold text-base hover:shadow-xl hover:shadow-[#7C3AED]/20 transition-all"
          >
            Continue Shopping
            <ArrowRight className="w-4 h-4" />
          </Link>
          <div className="flex items-center justify-center gap-1.5 text-xs text-[#52525B]">
            <Shield className="w-3 h-3 text-[#34D399]" />
            A confirmation email will be sent to your email address
          </div>
        </div>
      </div>
    </div>
  )
}
