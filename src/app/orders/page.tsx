"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Package, ChevronRight, Clock, Shield, Truck, ArrowLeft } from "lucide-react"

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  imageUrl: string | null
}

interface Order {
  id: string
  orderNumber: string
  total: number
  status: string
  createdAt: string
  items: OrderItem[]
}

const statusStyles: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  confirmed: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  shipped: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  delivered: "bg-green-500/10 text-green-400 border-green-500/20",
  cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
}

export default function MyOrdersPage() {
  const router = useRouter()
  const { data: session, status: authStatus } = useSession()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.push("/login?callbackUrl=/orders")
      return
    }
    if (authStatus === "authenticated") {
      fetchOrders()
    }
  }, [authStatus])

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders")
      if (!res.ok) throw new Error("Failed to fetch orders")
      const data = await res.json()
      setOrders(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  if (authStatus === "loading" || loading) {
    return (
      <div className="min-h-screen bg-[#0D0D12] flex items-center justify-center">
        <svg className="animate-spin h-8 w-8 text-[#A78BFA]" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0D0D12]">
      {/* Header */}
      <div className="bg-[#1A1A23] border-b border-[#2A2A35] py-4">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl gradient-text font-bold">◈</span>
            <span className="text-lg font-extrabold text-white">WM<span className="text-[#A78BFA]">DUO</span></span>
          </Link>
          <Link href="/" className="text-xs text-[#A1A1AA] hover:text-white transition">
            Back to store
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-8">
          <Package className="w-6 h-6 text-[#A78BFA]" />
          <h1 className="text-2xl sm:text-3xl font-bold text-white">My Orders</h1>
        </div>

        {error && (
          <div className="bg-red-500/10 text-red-400 text-sm rounded-2xl px-5 py-4 mb-6 border border-red-500/20">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-[#1A1A23] border border-[#2A2A35] flex items-center justify-center">
              <Package className="w-7 h-7 text-[#52525B]" />
            </div>
            <h2 className="text-lg font-bold text-white mb-2">No orders yet</h2>
            <p className="text-[#A1A1AA] text-sm mb-6">Place your first order and it will show up here.</p>
            <Link
              href="/"
              className="inline-block gradient-bg text-white px-6 py-3 rounded-xl font-semibold text-sm hover:shadow-xl hover:shadow-[#7C3AED]/20 transition-all"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/order/confirmation/${order.orderNumber}`}
                className="block bg-[#1A1A23] rounded-2xl border border-[#2A2A35] p-5 hover:border-[#A78BFA]/30 transition group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm font-bold text-white">{order.orderNumber}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-[#52525B]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <span>{order.items?.length || 0} item(s)</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[11px] font-semibold px-3 py-1 rounded-full border ${statusStyles[order.status] || statusStyles.pending}`}>
                      {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || "Pending"}
                    </span>
                    <ChevronRight className="w-4 h-4 text-[#52525B] group-hover:text-[#A78BFA] transition" />
                  </div>
                </div>

                {order.items && order.items.length > 0 && (
                  <div className="flex gap-3 overflow-x-auto pb-1">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 bg-[#0D0D12] rounded-xl p-2 min-w-0 flex-shrink-0">
                        {item.imageUrl && (
                          <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-[#1A1A23]" />
                        )}
                        <div className="min-w-0">
                          <p className="text-xs text-white font-medium truncate max-w-[160px]">{item.name}</p>
                          <p className="text-[11px] text-[#52525B]">${item.price} × {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-between items-center mt-4 pt-3 border-t border-[#2A2A35]">
                  <div className="flex items-center gap-1.5 text-xs text-[#34D399]">
                    <Shield className="w-3 h-3" />
                    {order.status === "shipped" || order.status === "delivered" ? "Shipped" : "Processing"}
                  </div>
                  <span className="text-sm font-bold text-white">${order.total?.toFixed(2)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
