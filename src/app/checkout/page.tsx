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

  // Set page title
  useEffect(() => {
    document.title = "Checkout — WM Duo"
  }, [])

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
    <div className="min-h-screen bg-white-soft">
      {/* Header */}
      <div className="bg-white bento-card bento-card--white border-b border-gold/10 py-4">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl gradient-text font-bold">◈</span>
            <span className="text-lg font-extrabold text-brown-deep">WM<span className="text-gold">DUO</span></span>
          </Link>
          <div className="flex items-center gap-2 text-xs text-brown-mid">
            <Lock className="w-3 h-3 text-brown-mid" />
            Secure Checkout
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 lg:py-12">
        <Link href="/cart" className="inline-flex items-center gap-1.5 text-sm text-brown-mid hover:text-[#E8A94C] transition mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to cart
        </Link>

        {/* ⛔ Login Gate */}
        {status === "loading" ? (
          <div className="flex items-center justify-center py-24">
            <svg className="animate-spin h-8 w-8 text-gold" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        ) : status === "unauthenticated" ? (
          <div className="max-w-lg mx-auto text-center py-16">
            <div className="bento-card bento-card--white !p-10">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gold/10 flex items-center justify-center">
                <LogIn className="w-7 h-7 text-gold" />
              </div>
              <h2 className="text-2xl font-bold text-brown-deep mb-2">Sign in to Order</h2>
              <p className="text-brown-mid text-sm mb-8 max-w-sm mx-auto">
                You need an account to place an order. Creating one takes less than a minute!
              </p>
              <div className="space-y-3">
                <Link
                  href="/login?callbackUrl=/checkout"
                  className="block w-full gradient-bg text-black py-3.5 rounded-xl font-bold text-sm hover:shadow-xl hover:shadow-[#E8A94C]/20 transition-all"
                >
                  Sign in to Continue
                </Link>
                <p className="text-xs text-brown-mid">
                  No account yet?{" "}
                  <Link href="/register?callbackUrl=/checkout" className="text-gold hover:underline">Create one</Link>
                </p>
              </div>
            </div>
            <div className="mt-8 flex items-center justify-center gap-6 text-xs text-brown-mid">
              <span>🔒 256-bit SSL</span>
              <span>🚚 Free shipping over $50</span>
              <span>↩️ 30-day returns</span>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-24">
            <ShoppingCart className="w-12 h-12 text-[#2A2A35] mx-auto mb-4" />
            <h2 className="text-xl font-bold text-brown-deep mb-2">Your cart is empty</h2>
            <p className="text-brown-mid text-sm mb-6">Add some products before checking out.</p>
            <Link href="/products" className="gradient-bg text-black px-6 py-3 rounded-xl font-bold text-sm inline-block">
              Browse Products
            </Link>
          </div>
        ) : (
        <div className="grid lg:grid-cols-[1fr_420px] gap-10 items-start">
          {/* Checkout Form */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-brown-deep mb-1">Checkout</h1>
            <p className="text-brown-mid text-sm mb-8">Complete your order — {items.length} item{items.length > 1 ? "s" : ""}</p>

            {error && (
              <div className="bg-red-500/10 text-red-400 text-sm rounded-2xl px-5 py-4 mb-6 border border-red-500/20 flex items-start gap-3">
                <span className="text-lg leading-none mt-0.5">!</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Contact Info */}
              <div className="bento-card bento-card--white !p-6 sm:!p-8 mb-5">
                <h2 className="font-bold text-brown-deep mb-5 flex items-center gap-2">
                  <User className="w-4 h-4 text-[#E8A94C]" />
                  Contact Information
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-brown-mid mb-1.5">Full Name *</label>
                    <input name="name" value={form.name} onChange={handleChange} required
                      className="w-full px-4 py-3 bg-white-soft border border-gold/10 rounded-xl focus:border-[#E8A94C] focus:ring-4 focus:ring-[#E8A94C]/10 outline-none transition text-sm text-brown-deep placeholder-brown-mid"
                      placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-brown-mid mb-1.5">Email *</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} required
                      className="w-full px-4 py-3 bg-white-soft border border-gold/10 rounded-xl focus:border-[#E8A94C] focus:ring-4 focus:ring-[#E8A94C]/10 outline-none transition text-sm text-brown-deep placeholder-brown-mid"
                      placeholder="john@example.com" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-brown-mid mb-1.5">Phone *</label>
                    <input name="phone" type="tel" value={form.phone} onChange={handleChange} required
                      className="w-full px-4 py-3 bg-white-soft border border-gold/10 rounded-xl focus:border-[#E8A94C] focus:ring-4 focus:ring-[#E8A94C]/10 outline-none transition text-sm text-brown-deep placeholder-brown-mid"
                      placeholder="+1 (555) 000-0000" />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bento-card bento-card--white !p-6 sm:!p-8 mb-5">
                <h2 className="font-bold text-brown-deep mb-5 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#E8A94C]" />
                  Shipping Address
                </h2>
                <div className="space-y-4">
                  <input name="address" value={form.address} onChange={handleChange} required
                    className="w-full px-4 py-3 bg-white-soft border border-gold/10 rounded-xl focus:border-[#E8A94C] focus:ring-4 focus:ring-[#E8A94C]/10 outline-none text-sm text-brown-deep placeholder-brown-mid"
                    placeholder="123 Main Street, Apt 4B" />
                  <div className="grid sm:grid-cols-3 gap-4">
                    <input name="city" value={form.city} onChange={handleChange} required
                      className="w-full px-4 py-3 bg-white-soft border border-gold/10 rounded-xl focus:border-[#E8A94C] focus:ring-4 focus:ring-[#E8A94C]/10 outline-none text-sm text-brown-deep placeholder-brown-mid"
                      placeholder="City" />
                    <select name="country" value={form.country} onChange={handleChange} required
                      className="w-full px-4 py-3 bg-white-soft border border-gold/10 rounded-xl focus:border-[#E8A94C] focus:ring-4 focus:ring-[#E8A94C]/10 outline-none text-sm text-brown-deep">
                      <option>United States</option>
                      <option>United Kingdom</option>
                      <option>Canada</option>
                      <option>Australia</option>
                      <option>Germany</option>
                      <option>France</option>
                      <option>Other</option>
                    </select>
                    <input name="zipCode" value={form.zipCode} onChange={handleChange}
                      className="w-full px-4 py-3 bg-white-soft border border-gold/10 rounded-xl focus:border-[#E8A94C] focus:ring-4 focus:ring-[#E8A94C]/10 outline-none text-sm text-brown-deep placeholder-brown-mid"
                      placeholder="ZIP Code" />
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bento-card bento-card--white !p-6 sm:!p-8 mb-5">
                <h2 className="font-bold text-brown-deep mb-5 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#E8A94C]" />
                  Payment Method
                </h2>
                <div className="bg-white-soft border border-gold/10 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <input type="radio" defaultChecked disabled className="accent-[#E8A94C]" />
                    <span className="text-sm text-brown-deep font-medium">Pay on Confirmation (Invoice)</span>
                  </div>
                  <p className="text-xs text-brown-mid ml-7">
                    We&apos;ll send you an invoice via email. Pay after you receive the order confirmation.
                    <span className="block mt-1 text-[#E8A94C]">✓ Secure &amp; hassle-free</span>
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {["Visa", "Mastercard", "PayPal", "Apple Pay", "Google Pay"].map(p => (
                    <span key={p} className="text-[11px] font-semibold text-brown-mid bg-white-soft border border-gold/10 px-3 py-1.5 rounded-lg">{p}</span>
                  ))}
                </div>
              </div>

              {/* Mobile: Cart Items Summary */}
              <div className="lg:hidden bento-card bento-card--white !p-6 mb-5">
                <h2 className="font-bold text-brown-deep mb-4">Items ({items.length})</h2>
                <div className="space-y-3">
                  {items.map(item => (
                    <div key={item.productId} className="flex gap-3 pb-3 border-b border-gold/10 last:border-0 last:pb-0">
                      <img src={item.imageUrl} alt={item.name} className="w-14 h-14 rounded-lg object-cover bg-white-soft" />
                      <div className="flex-1">
                        <p className="text-xs font-medium text-brown-deep">{item.name}</p>
                        <p className="text-xs text-brown-mid">Qty: {item.quantity}</p>
                        <p className="text-sm font-bold text-[#E8A94C]">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gold/10 pt-4 mt-4 space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-brown-mid">Subtotal</span><span className="text-brown-deep">${subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-brown-mid">Shipping</span><span className="text-brown-mid">{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span></div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-gold/10">
                    <span className="text-brown-deep">Total</span><span className="text-[#E8A94C]">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full gradient-bg text-black py-4 rounded-2xl font-bold text-base hover:shadow-xl hover:shadow-[#E8A94C]/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2 group">
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

              <p className="text-center text-xs text-brown-mid mt-4 flex items-center justify-center gap-1.5">
                <Shield className="w-3 h-3 text-brown-mid" />
                256-bit SSL Encryption · 30-Day Money-Back
              </p>
            </form>
          </div>

          {/* Desktop: Order Summary Sidebar */}
          <div className="hidden lg:block sticky top-32">
            <div className="bento-card bento-card--white !p-6">
              <h2 className="font-bold text-brown-deep mb-5 flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-[#E8A94C]" />
                Order Summary ({items.length})
              </h2>

              <div className="space-y-4 mb-5 max-h-80 overflow-y-auto pr-1">
                {items.map(item => (
                  <div key={item.productId} className="flex gap-3 pb-4 border-b border-gold/10 last:border-0 last:pb-0">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-white-soft flex-shrink-0">
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-brown-deep line-clamp-1">{item.name}</p>
                      <p className="text-xs text-brown-mid mt-0.5">Qty: {item.quantity}</p>
                      <p className="text-sm font-bold text-brown-deep mt-1">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between"><span className="text-brown-mid">Subtotal</span><span className="text-brown-deep font-medium">${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-brown-mid">Shipping</span><span className="text-brown-mid font-medium">{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span></div>
              </div>

              <div className="flex justify-between font-bold text-lg mt-5 pt-5 border-t border-gold/10">
                <span className="text-brown-deep">Total</span><span className="text-[#E8A94C]">${total.toFixed(2)}</span>
              </div>

              <div className="mt-5 bg-white-soft border border-gold/10 rounded-xl p-4 space-y-2.5">
                {[
                  { icon: Truck, text: "Free shipping worldwide over $50" },
                  { icon: RotateCcw, text: "30-day money-back guarantee" },
                  { icon: Shield, text: "2-year warranty included" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2.5 text-xs text-brown-mid">
                    <Icon className="w-3.5 h-3.5 text-brown-mid" />
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
