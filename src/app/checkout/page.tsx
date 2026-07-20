"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { ShoppingCart, Truck, Lock, Shield, ArrowLeft, Minus, Plus, User, CreditCard, RotateCcw, LogIn, Trash2 } from "lucide-react"
import { useCart } from "@/context/CartContext"

export default function CheckoutPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { items, removeItem, updateQuantity, subtotal, shipping, total, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "United States",
    zipCode: "",
  })

  // Pre-fill user data from session
  useEffect(() => {
    if (session?.user) {
      setForm(prev => ({
        ...prev,
        name: session.user.name || prev.name,
        email: session.user.email || prev.email,
      }))
    }
  }, [session])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (items.length === 0) {
      setError("Your cart is empty")
      return
    }
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: form.address,
          city: form.city,
          country: form.country,
          zipCode: form.zipCode,
          total,
          shipping,
          discount: 0,
          items: items.map(item => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            imageUrl: item.imageUrl,
          })),
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to create order")
      }

      const order = await res.json()
      sessionStorage.setItem(`order_${order.orderNumber}`, JSON.stringify(order))
      clearCart()
      router.push(`/order/confirmation/${order.orderNumber}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0D0D12]">
      {/* Header */}
      <div className="bg-[#1A1A23] border-b border-[#2A2A35] py-4">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl gradient-text font-bold">◈</span>
            <span className="text-lg font-extrabold text-white">WM<span className="text-[#A78BFA]">DUO</span></span>
          </Link>
          <div className="flex items-center gap-2 text-xs text-[#52525B]">
            <Lock className="w-3 h-3 text-[#34D399]" />
            Secure Checkout
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 lg:py-12">
        <Link href="/cart" className="inline-flex items-center gap-1.5 text-sm text-[#A1A1AA] hover:text-[#E8A94C] transition mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to cart
        </Link>

        {/* ⛔ Login Gate */}
        {status === "loading" ? (
          <div className="flex items-center justify-center py-24">
            <svg className="animate-spin h-8 w-8 text-[#A78BFA]" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        ) : status === "unauthenticated" ? (
          <div className="max-w-lg mx-auto text-center py-16">
            <div className="bg-[#1A1A23] rounded-2xl p-10 border border-[#2A2A35]">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#A78BFA]/10 flex items-center justify-center">
                <LogIn className="w-7 h-7 text-[#A78BFA]" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Sign in to Order</h2>
              <p className="text-[#A1A1AA] text-sm mb-8 max-w-sm mx-auto">
                You need an account to place an order. Creating one takes less than a minute!
              </p>
              <div className="space-y-3">
                <Link
                  href="/login?callbackUrl=/checkout"
                  className="block w-full gradient-bg text-white py-3.5 rounded-xl font-bold text-sm hover:shadow-xl hover:shadow-[#7C3AED]/20 transition-all"
                >
                  Sign in to Continue
                </Link>
                <p className="text-xs text-[#52525B]">
                  No account yet?{" "}
                  <Link href="/register?callbackUrl=/checkout" className="text-[#A78BFA] hover:underline">Create one</Link>
                </p>
              </div>
            </div>
            <div className="mt-8 flex items-center justify-center gap-6 text-xs text-[#52525B]">
              <span>🔒 256-bit SSL</span>
              <span>🚚 Free shipping over $50</span>
              <span>↩️ 30-day returns</span>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-24">
            <ShoppingCart className="w-12 h-12 text-[#2A2A35] mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Your cart is empty</h2>
            <p className="text-[#A1A1AA] text-sm mb-6">Add some products before checking out.</p>
            <Link href="/products" className="gradient-bg text-white px-6 py-3 rounded-xl font-bold text-sm inline-block">
              Browse Products
            </Link>
          </div>
        ) : (
        <div className="grid lg:grid-cols-[1fr_420px] gap-10 items-start">
          {/* Checkout Form */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">Checkout</h1>
            <p className="text-[#A1A1AA] text-sm mb-8">Complete your order — {items.length} item{items.length > 1 ? "s" : ""}</p>

            {error && (
              <div className="bg-red-500/10 text-red-400 text-sm rounded-2xl px-5 py-4 mb-6 border border-red-500/20 flex items-start gap-3">
                <span className="text-lg leading-none mt-0.5">!</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Contact Info */}
              <div className="bg-[#1A1A23] rounded-2xl p-6 sm:p-8 border border-[#2A2A35] mb-5">
                <h2 className="font-bold text-white mb-5 flex items-center gap-2">
                  <User className="w-4 h-4 text-[#E8A94C]" />
                  Contact Information
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">Full Name *</label>
                    <input name="name" value={form.name} onChange={handleChange} required
                      className="w-full px-4 py-3 bg-[#0D0D12] border border-[#2A2A35] rounded-xl focus:border-[#E8A94C] focus:ring-4 focus:ring-[#E8A94C]/10 outline-none transition text-sm text-white placeholder-[#52525B]"
                      placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">Email *</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} required
                      className="w-full px-4 py-3 bg-[#0D0D12] border border-[#2A2A35] rounded-xl focus:border-[#E8A94C] focus:ring-4 focus:ring-[#E8A94C]/10 outline-none transition text-sm text-white placeholder-[#52525B]"
                      placeholder="john@example.com" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">Phone *</label>
                    <input name="phone" type="tel" value={form.phone} onChange={handleChange} required
                      className="w-full px-4 py-3 bg-[#0D0D12] border border-[#2A2A35] rounded-xl focus:border-[#E8A94C] focus:ring-4 focus:ring-[#E8A94C]/10 outline-none transition text-sm text-white placeholder-[#52525B]"
                      placeholder="+1 (555) 000-0000" />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-[#1A1A23] rounded-2xl p-6 sm:p-8 border border-[#2A2A35] mb-5">
                <h2 className="font-bold text-white mb-5 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#E8A94C]" />
                  Shipping Address
                </h2>
                <div className="space-y-4">
                  <input name="address" value={form.address} onChange={handleChange} required
                    className="w-full px-4 py-3 bg-[#0D0D12] border border-[#2A2A35] rounded-xl focus:border-[#E8A94C] focus:ring-4 focus:ring-[#E8A94C]/10 outline-none text-sm text-white placeholder-[#52525B]"
                    placeholder="123 Main Street, Apt 4B" />
                  <div className="grid sm:grid-cols-3 gap-4">
                    <input name="city" value={form.city} onChange={handleChange} required
                      className="w-full px-4 py-3 bg-[#0D0D12] border border-[#2A2A35] rounded-xl focus:border-[#E8A94C] focus:ring-4 focus:ring-[#E8A94C]/10 outline-none text-sm text-white placeholder-[#52525B]"
                      placeholder="City" />
                    <select name="country" value={form.country} onChange={handleChange} required
                      className="w-full px-4 py-3 bg-[#0D0D12] border border-[#2A2A35] rounded-xl focus:border-[#E8A94C] focus:ring-4 focus:ring-[#E8A94C]/10 outline-none text-sm text-white">
                      <option>United States</option>
                      <option>United Kingdom</option>
                      <option>Canada</option>
                      <option>Australia</option>
                      <option>Germany</option>
                      <option>France</option>
                      <option>Other</option>
                    </select>
                    <input name="zipCode" value={form.zipCode} onChange={handleChange}
                      className="w-full px-4 py-3 bg-[#0D0D12] border border-[#2A2A35] rounded-xl focus:border-[#E8A94C] focus:ring-4 focus:ring-[#E8A94C]/10 outline-none text-sm text-white placeholder-[#52525B]"
                      placeholder="ZIP Code" />
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-[#1A1A23] rounded-2xl p-6 sm:p-8 border border-[#2A2A35] mb-5">
                <h2 className="font-bold text-white mb-5 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#E8A94C]" />
                  Payment Method
                </h2>
                <div className="bg-[#0D0D12] border border-[#2A2A35] rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <input type="radio" checked readOnly className="accent-[#E8A94C]" />
                    <span className="text-sm text-white font-medium">Pay on Confirmation (Invoice)</span>
                  </div>
                  <p className="text-xs text-[#52525B] ml-7">
                    We&apos;ll send you an invoice via email. Pay after you receive the order confirmation.
                    <span className="block mt-1 text-[#E8A94C]">✓ Secure &amp; hassle-free</span>
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {["Visa", "Mastercard", "PayPal", "Apple Pay", "Google Pay"].map(p => (
                    <span key={p} className="text-[11px] font-semibold text-[#A1A1AA] bg-[#0D0D12] border border-[#2A2A35] px-3 py-1.5 rounded-lg">{p}</span>
                  ))}
                </div>
              </div>

              {/* Mobile: Cart Items Summary */}
              <div className="lg:hidden bg-[#1A1A23] rounded-2xl p-6 border border-[#2A2A35] mb-5">
                <h2 className="font-bold text-white mb-4">Items ({items.length})</h2>
                <div className="space-y-3">
                  {items.map(item => (
                    <div key={item.productId} className="flex gap-3 pb-3 border-b border-[#2A2A35] last:border-0 last:pb-0">
                      <img src={item.imageUrl} alt={item.name} className="w-14 h-14 rounded-lg object-cover bg-[#0D0D12]" />
                      <div className="flex-1">
                        <p className="text-xs font-medium text-white">{item.name}</p>
                        <p className="text-xs text-[#A1A1AA]">Qty: {item.quantity}</p>
                        <p className="text-sm font-bold text-[#E8A94C]">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-[#2A2A35] pt-4 mt-4 space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-[#A1A1AA]">Subtotal</span><span className="text-white">${subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-[#A1A1AA]">Shipping</span><span className="text-[#34D399]">{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span></div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-[#2A2A35]">
                    <span className="text-white">Total</span><span className="text-[#E8A94C]">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full gradient-bg text-white py-4 rounded-2xl font-bold text-base hover:shadow-xl hover:shadow-[#7C3AED]/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2 group">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Place Order — ${total.toFixed(2)}
                  </span>
                )}
              </button>

              <p className="text-center text-xs text-[#52525B] mt-4 flex items-center justify-center gap-1.5">
                <Shield className="w-3 h-3 text-[#34D399]" />
                256-bit SSL Encryption · 30-Day Money-Back
              </p>
            </form>
          </div>

          {/* Desktop: Order Summary Sidebar */}
          <div className="hidden lg:block sticky top-32">
            <div className="bg-[#1A1A23] rounded-2xl p-6 border border-[#2A2A35]">
              <h2 className="font-bold text-white mb-5 flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-[#E8A94C]" />
                Order Summary ({items.length})
              </h2>

              <div className="space-y-4 mb-5 max-h-80 overflow-y-auto pr-1">
                {items.map(item => (
                  <div key={item.productId} className="flex gap-3 pb-4 border-b border-[#2A2A35] last:border-0 last:pb-0">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#0D0D12] flex-shrink-0">
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white line-clamp-1">{item.name}</p>
                      <p className="text-xs text-[#A1A1AA] mt-0.5">Qty: {item.quantity}</p>
                      <p className="text-sm font-bold text-white mt-1">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between"><span className="text-[#A1A1AA]">Subtotal</span><span className="text-white font-medium">${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-[#A1A1AA]">Shipping</span><span className="text-[#34D399] font-medium">{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span></div>
              </div>

              <div className="flex justify-between font-bold text-lg mt-5 pt-5 border-t border-[#2A2A35]">
                <span className="text-white">Total</span><span className="text-[#E8A94C]">${total.toFixed(2)}</span>
              </div>

              <div className="mt-5 bg-[#0D0D12] border border-[#2A2A35] rounded-xl p-4 space-y-2.5">
                {[
                  { icon: Truck, text: "Free shipping worldwide over $50" },
                  { icon: RotateCcw, text: "30-day money-back guarantee" },
                  { icon: Shield, text: "2-year warranty included" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2.5 text-xs text-[#A1A1AA]">
                    <Icon className="w-3.5 h-3.5 text-[#34D399]" />
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  )
}
