"use client"

import { useEffect, useState } from "react"
import { Search, Filter, ChevronDown, Package, ExternalLink } from "lucide-react"

interface Order {
  id: string
  orderNumber: string
  name: string
  email: string
  phone: string | null
  address: string
  city: string
  country: string
  status: string
  total: number
  trackingUrl: string | null
  notes: string | null
  createdAt: string
  items: { id: string; name: string; price: number; quantity: number; imageUrl: string | null }[]
  user: { name: string; email: string } | null
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  confirmed: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  shipped: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  delivered: "bg-green-500/10 text-green-400 border-green-500/20",
  cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
}

const statusGradients: Record<string, string> = {
  pending: "from-yellow-500/10 to-transparent",
  confirmed: "from-blue-500/10 to-transparent",
  shipped: "from-purple-500/10 to-transparent",
  delivered: "from-green-500/10 to-transparent",
  cancelled: "from-red-500/10 to-transparent",
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editStatus, setEditStatus] = useState("")
  const [editTracking, setEditTracking] = useState("")
  const [editNotes, setEditNotes] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  const fetchOrders = async () => {
    setLoading(true)
    const url = statusFilter ? `/api/orders?status=${statusFilter}` : "/api/orders"
    const res = await fetch(url)
    const data = await res.json()
    setOrders(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { fetchOrders() }, [statusFilter])

  const handleUpdate = async (id: string) => {
    const res = await fetch("/api/orders", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: editStatus, trackingUrl: editTracking, notes: editNotes }),
    })
    if (res.ok) {
      setEditingId(null)
      fetchOrders()
    }
  }

  const filteredOrders = orders.filter(o =>
    !searchQuery || o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-white">Orders</h1>
          <p className="text-white/40 text-sm mt-1">Manage customer orders</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-48 lg:w-64 pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-sm text-white placeholder-white/30 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 outline-none transition-all"
            />
          </div>
          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-sm text-white/60 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filter
            <ChevronDown className={`w-3 h-3 transition-transform ${showFilters ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>

      {/* Status Filters */}
      {showFilters && (
        <div className="flex flex-wrap gap-2 mb-8 p-4 bg-white/5 rounded-2xl border border-white/5">
          {["", "pending", "confirmed", "shipped", "delivered", "cancelled"].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all capitalize ${
                statusFilter === status
                  ? "gradient-bg text-white shadow-lg shadow-purple-500/20"
                  : "bg-white/5 text-white/40 hover:text-white hover:bg-white/10"
              }`}
            >
              {status || "All"}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-14 h-14 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white/40 text-sm">Loading orders...</p>
          </div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-[#1A1A2E] rounded-2xl border border-white/5 p-16 text-center">
          <Package className="w-16 h-16 text-white/10 mx-auto mb-4" />
          <h3 className="font-bold text-lg text-white mb-2">No orders yet</h3>
          <p className="text-white/40 text-sm">Orders will appear here once customers start purchasing.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(order => (
            <div
              key={order.id}
              className={`bg-[#1A1A2E] rounded-2xl border border-white/5 p-6 hover:border-white/10 transition-all duration-300 bg-gradient-to-r ${statusGradients[order.status] || ""}`}
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-white text-lg">{order.orderNumber}</h3>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize border ${statusColors[order.status] || "bg-white/5 text-white/40 border-white/10"}`}>
                    {order.status}
                  </span>
                </div>
                <div className="text-3xl font-black text-white">${order.total.toFixed(2)}</div>
              </div>

              {/* Customer Info */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/50 mb-5">
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  {order.name}
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  {order.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Items */}
              <div className="border-t border-white/5 pt-4 mb-4">
                <div className="space-y-2">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      {item.imageUrl && (
                        <img src={item.imageUrl} alt="" className="w-12 h-12 rounded-xl object-cover bg-white/5" />
                      )}
                      <span className="flex-1 text-white/70">{item.name}</span>
                      <span className="text-white/40">×{item.quantity}</span>
                      <span className="font-semibold text-white">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Address */}
              <div className="border-t border-white/5 pt-4 mb-4">
                <div className="flex flex-col sm:flex-row gap-2 text-sm text-white/40">
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    {order.address}, {order.city}, {order.country}
                  </span>
                  {order.phone && (
                    <span className="flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                      {order.phone}
                    </span>
                  )}
                </div>
              </div>

              {/* Edit Form */}
              <div className="border-t border-white/5 pt-4">
                {editingId === order.id ? (
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs text-white/40 mb-1">Status</label>
                        <select
                          value={editStatus}
                          onChange={e => setEditStatus(e.target.value)}
                          className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:border-primary/50 outline-none"
                        >
                          {["pending", "confirmed", "shipped", "delivered", "cancelled"].map(s => (
                            <option key={s} value={s} className="bg-[#1A1A2E]">{s}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-white/40 mb-1">Tracking URL</label>
                        <input
                          value={editTracking}
                          onChange={e => setEditTracking(e.target.value)}
                          placeholder="https://..."
                          className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/20 focus:border-primary/50 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-white/40 mb-1">Notes</label>
                        <input
                          value={editNotes}
                          onChange={e => setEditNotes(e.target.value)}
                          placeholder="Optional notes"
                          className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/20 focus:border-primary/50 outline-none"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdate(order.id)}
                        className="gradient-bg text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-purple-500/20 transition-all"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-white/5 text-white/60 px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-white/10 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => {
                        setEditingId(order.id)
                        setEditStatus(order.status)
                        setEditTracking(order.trackingUrl || "")
                        setEditNotes(order.notes || "")
                      }}
                      className="gradient-bg text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-purple-500/20 transition-all"
                    >
                      Update Status
                    </button>
                    {order.trackingUrl && (
                      <a
                        href={order.trackingUrl}
                        target="_blank"
                        rel="noopener"
                        className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/10 transition-all"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Track Package
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
