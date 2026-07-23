"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ShoppingBag, Package, Users, MessageSquare, DollarSign, TrendingUp, Clock, ArrowRight } from "lucide-react"

interface Stats {
  totalOrders: number
  totalRevenue: number
  totalProducts: number
  totalUsers: number
  unreadMessages: number
  recentOrders: any[]
  ordersByStatus: { status: string; _count: number }[]
  monthlyRevenue: { month: string; revenue: number }[]
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  confirmed: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  shipped: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  delivered: "bg-green-500/10 text-green-400 border-green-500/20",
  cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/stats")
      .then(res => res.json())
      .then(data => { setStats(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/40 text-sm">Loading stats...</p>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center py-20">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
          <TrendingUp className="w-10 h-10 text-white/20" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Welcome to Your Dashboard</h2>
        <p className="text-white/40 text-sm">Stats will appear once you have orders and products.</p>
      </div>
    )
  }

  const cards = [
    { label: "Total Orders", value: stats.totalOrders, icon: ShoppingBag, gradient: "from-purple-500/20 to-purple-600/10", iconBg: "bg-purple-500/20 text-purple-400" },
    { label: "Total Revenue", value: `$${stats.totalRevenue.toFixed(2)}`, icon: DollarSign, gradient: "from-green-500/20 to-green-600/10", iconBg: "bg-green-500/20 text-green-400" },
    { label: "Products", value: stats.totalProducts, icon: Package, gradient: "from-blue-500/20 to-blue-600/10", iconBg: "bg-blue-500/20 text-blue-400" },
    { label: "Users", value: stats.totalUsers, icon: Users, gradient: "from-amber-500/20 to-amber-600/10", iconBg: "bg-amber-500/20 text-amber-400" },
    { label: "Messages", value: stats.unreadMessages, icon: MessageSquare, gradient: "from-red-500/20 to-red-600/10", iconBg: "bg-red-500/20 text-red-400" },
  ]

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-white">Dashboard</h1>
          <p className="text-white/40 text-sm mt-1">Here&apos;s your store overview.</p>
        </div>
        <Link
          href="/admin/orders"
          className="gradient-bg text-white px-6 py-3 rounded-2xl text-sm font-semibold hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300 flex items-center gap-2 group"
        >
          View All Orders
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-10">
        {cards.map((card, i) => {
          const Icon = card.icon
          return (
            <div
              key={`stat-${card.label}`}
              className={`relative bg-gradient-to-br ${card.gradient} bg-[#1A1A2E] rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-all duration-300 group`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${card.iconBg} flex items-center justify-center`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-3xl opacity-5 group-hover:opacity-10 transition-opacity">
                  <Icon className="w-12 h-12" />
                </span>
              </div>
              <div className="text-3xl font-black text-white mb-1">{card.value}</div>
              <div className="text-sm text-white/40">{card.label}</div>
            </div>
          )
        })}
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-[#1A1A2E] rounded-2xl border border-white/5 p-6 hover:border-white/10 transition-all duration-300">
          <h2 className="font-bold text-lg text-white mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Recent Orders
          </h2>
          {stats.recentOrders.length === 0 ? (
            <div className="text-center py-10">
              <ShoppingBag className="w-12 h-12 text-white/10 mx-auto mb-3" />
              <p className="text-white/30 text-sm">No orders yet</p>
            </div>
          ) : (
            <div className="space-y-1">
              {stats.recentOrders.map((order: any) => (
                <div key={order.id} className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-white/5 transition-colors">
                  <div>
                    <Link href="/admin/orders" className="font-semibold text-sm text-white hover:text-primary transition-colors">
                      {order.orderNumber}
                    </Link>
                    <p className="text-xs text-white/30 mt-0.5">
                      ${order.total.toFixed(2)} · {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`text-[11px] font-semibold px-3 py-1 rounded-full border capitalize ${statusColors[order.status] || "bg-white/5 text-white/40 border-white/10"}`}>
                    {order.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Orders by Status */}
        <div className="bg-[#1A1A2E] rounded-2xl border border-white/5 p-6 hover:border-white/10 transition-all duration-300">
          <h2 className="font-bold text-lg text-white mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Orders by Status
          </h2>
          {stats.ordersByStatus.length === 0 ? (
            <div className="text-center py-10">
              <TrendingUp className="w-12 h-12 text-white/10 mx-auto mb-3" />
              <p className="text-white/30 text-sm">No data yet</p>
            </div>
          ) : (
            <div className="space-y-5">
              {stats.ordersByStatus.map((item: any) => {
                const total = stats.ordersByStatus.reduce((a: number, b: any) => a + b._count, 0)
                const pct = total > 0 ? Math.round((item._count / total) * 100) : 0
                const barColor =
                  item.status === "delivered" ? "from-green-500 to-green-400" :
                  item.status === "shipped" ? "from-purple-500 to-purple-400" :
                  item.status === "confirmed" ? "from-blue-500 to-blue-400" :
                  item.status === "cancelled" ? "from-red-500 to-red-400" :
                  "from-yellow-500 to-yellow-400"
                return (
                  <div key={item.status}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-white capitalize">{item.status}</span>
                      <span className="text-white/40">{item._count} ({pct}%)</span>
                    </div>
                    <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-1000`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
