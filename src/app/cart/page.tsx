"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft, Truck, Shield, RotateCcw, CreditCard, Lock } from "lucide-react"
import { useCart } from "@/context/CartContext"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, shipping, total, clearCart } = useCart()
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  useEffect(() => {
    document.title = "Shopping Cart — WM Duo"
  }, [])

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white-soft flex flex-col items-center justify-center px-4">
        <Navbar />
        <div className="bento-card bento-card--white !p-12 text-center max-w-md w-full">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gold/10 flex items-center justify-center">
            <ShoppingBag className="w-8 h-8 text-gold" />
          </div>
          <h2 className="text-xl font-bold text-brown-deep mb-2">Your cart is empty</h2>
          <p className="text-sm text-brown-mid mb-8">Looks like you haven&apos;t added anything yet. Time to find your perfect projector!</p>
          <Link href="/products" className="inline-block gradient-bg text-black px-8 py-3 rounded-xl font-bold text-sm hover:shadow-xl hover:shadow-[#E8A94C]/20 transition-all">
            Browse Products
          </Link>
        </div>
        <div className="mt-8 flex items-center gap-6 text-xs text-brown-mid">
          <span>🚚 Free shipping over $50</span>
          <span>↩️ 30-day returns</span>
          <span>🔒 Secure checkout</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white-soft">
      <Navbar />
      {/* Header */}
      <div className="bg-white bento-card bento-card--white border-b border-gold/10 py-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/products" className="inline-flex items-center gap-1.5 text-sm text-brown-mid hover:text-[#E8A94C] transition mb-2">
                <ArrowLeft className="w-4 h-4" />
                Continue Shopping
              </Link>
              <h1 className="text-2xl sm:text-3xl font-bold text-brown-deep">
                Shopping Cart <span className="text-brown-mid text-lg">({items.length} item{items.length > 1 ? "s" : ""})</span>
              </h1>
            </div>
            <button onClick={() => setShowClearConfirm(true)} className="text-xs text-brown-mid hover:text-red-400 transition">
              Clear All
            </button>
          </div>
        </div>
      </div>

      {/* Clear confirmation modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setShowClearConfirm(false)}>
          <div className="bento-card bento-card--white !p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-brown-deep mb-2">Clear cart?</h3>
            <p className="text-sm text-brown-mid mb-5">This will remove all {items.length} item{items.length > 1 ? "s" : ""} from your cart.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowClearConfirm(false)} className="flex-1 px-4 py-2.5 bg-white-soft border border-gold/10 rounded-xl text-sm text-brown-deep font-medium">Cancel</button>
              <button onClick={() => { clearCart(); setShowClearConfirm(false) }} className="flex-1 px-4 py-2.5 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-red-400 font-medium hover:bg-red-500/20">Clear</button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[1fr_380px] gap-8">
          {/* Cart Items */}
          <div className="space-y-4">
            {items.map(item => (
              <div key={item.productId} className="bento-card bento-card--white !p-4 flex gap-4 group hover:border-[#E8A94C]/20 transition">
                <Link href={`/products/${item.slug}`} className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-white-soft flex-shrink-0">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/products/${item.slug}`}>
                    <h3 className="text-sm font-bold text-brown-deep hover:text-[#E8A94C] transition line-clamp-1">{item.name}</h3>
                  </Link>
                  <p className="text-sm font-bold text-[#E8A94C] mt-1">${(item.price * item.quantity).toFixed(2)}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2 bg-white-soft border border-gold/10 rounded-lg px-2 py-1">
                      <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="text-brown-mid hover:text-brown-deep p-0.5">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-medium text-brown-deep w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} disabled={item.quantity >= item.stock} className="text-brown-mid hover:text-brown-deep disabled:opacity-30 p-0.5">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <button onClick={() => removeItem(item.productId)} className="p-1.5 text-brown-mid hover:text-red-400 opacity-0 group-hover:opacity-100 transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-24 self-start">
            <div className="bento-card bento-card--white !p-6">
              <h2 className="text-lg font-bold text-brown-deep mb-5">Order Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-brown-mid">Subtotal</span>
                  <span className="text-brown-deep font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brown-mid">Shipping</span>
                  <span className={shipping === 0 ? "text-brown-mid font-medium" : "text-brown-deep font-medium"}>
                    {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-[10px] text-brown-mid">Free shipping on orders over $50</p>
                )}
              </div>

              <div className="flex justify-between font-bold text-lg mt-5 pt-5 border-t border-gold/10">
                <span className="text-brown-deep">Total</span>
                <span className="text-[#E8A94C]">${total.toFixed(2)}</span>
              </div>

              <Link
                href="/checkout"
                className="w-full gradient-bg text-black py-3.5 rounded-xl font-bold text-sm mt-5 hover:shadow-xl hover:shadow-[#E8A94C]/20 transition-all flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                Proceed to Checkout
              </Link>

              <div className="mt-5 bg-white-soft border border-gold/10 rounded-xl p-4 space-y-2.5">
                {[
                  { icon: Truck, text: "Free shipping worldwide over $50" },
                  { icon: RotateCcw, text: "30-day money-back guarantee" },
                  { icon: Shield, text: "2-year warranty included" },
                  { icon: CreditCard, text: "Secure payment processing" },
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
      </div>
      <Footer />
    </div>
  )
}
