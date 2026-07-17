"use client"

import { useEffect, useState } from "react"
import { Plus, Package, Star, Trash2, X, ExternalLink } from "lucide-react"

interface Product {
  id: string
  name: string
  slug: string
  price: number
  compareAt: number | null
  stock: number
  status: string
  featured: boolean
  rating: number
  reviewCount: number
  imageUrl: string | null
  createdAt: string
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    name: "", description: "", price: 89.99, compareAt: 142, stock: 50,
    status: "active", featured: false, imageUrl: "", sku: "", category: "projectors",
  })
  const [saving, setSaving] = useState(false)

  const fetchProducts = async () => {
    setLoading(true)
    const res = await fetch("/api/products")
    const data = await res.json()
    setProducts(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { fetchProducts() }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setShowForm(false)
        setForm({ name: "", description: "", price: 89.99, compareAt: 142, stock: 50, status: "active", featured: false, imageUrl: "", sku: "", category: "projectors" })
        fetchProducts()
      }
    } finally {
      setSaving(false)
    }
  }

  const toggleFeatured = async (product: Product) => {
    await fetch("/api/products", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: product.id, featured: !product.featured }),
    })
    fetchProducts()
  }

  const deleteProduct = async (id: string) => {
    if (!confirm("Delete this product?")) return
    await fetch(`/api/products?id=${id}`, { method: "DELETE" })
    fetchProducts()
  }

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-white">Products</h1>
          <p className="text-white/40 text-sm mt-1">Manage your product catalog</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold transition-all ${
            showForm
              ? "bg-white/5 text-white/60 border border-white/10 hover:bg-white/10"
              : "gradient-bg text-white hover:shadow-xl hover:shadow-purple-500/20"
          }`}
        >
          {showForm ? (
            <><X className="w-4 h-4" /> Cancel</>
          ) : (
            <><Plus className="w-4 h-4" /> Add Product</>
          )}
        </button>
      </div>

      {/* Add Product Form */}
      {showForm && (
        <form onSubmit={handleCreate} className="bg-[#1A1A2E] rounded-2xl border border-white/5 p-6 sm:p-8 mb-8 space-y-6">
          <h3 className="font-bold text-lg text-white flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            New Product
          </h3>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-white/70 mb-1.5">Product Name</label>
              <input
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/20 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                placeholder="CastleView Mini 210°"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-white/70 mb-1.5">SKU</label>
              <input
                value={form.sku}
                onChange={e => setForm(p => ({ ...p, sku: e.target.value }))}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/20 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                placeholder="PROJ-001"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-white/70 mb-1.5">Price ($)</label>
              <input
                type="number" step="0.01"
                value={form.price}
                onChange={e => setForm(p => ({ ...p, price: parseFloat(e.target.value) }))}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/20 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-white/70 mb-1.5">Compare At ($)</label>
              <input
                type="number" step="0.01"
                value={form.compareAt}
                onChange={e => setForm(p => ({ ...p, compareAt: parseFloat(e.target.value) }))}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/20 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-white/70 mb-1.5">Stock</label>
              <input
                type="number"
                value={form.stock}
                onChange={e => setForm(p => ({ ...p, stock: parseInt(e.target.value) }))}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/20 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-white/70 mb-1.5">Image URL</label>
              <input
                value={form.imageUrl}
                onChange={e => setForm(p => ({ ...p, imageUrl: e.target.value }))}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/20 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                placeholder="https://..."
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-white/70 mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              rows={3}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/20 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 outline-none transition-all resize-none"
              placeholder="Describe the product..."
            />
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2.5 text-sm text-white/70 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={e => setForm(p => ({ ...p, featured: e.target.checked }))}
                className="w-4 h-4 accent-primary"
              />
              Featured Product
            </label>
            <select
              value={form.status}
              onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
              className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:border-primary/50 outline-none"
            >
              <option value="active" className="bg-[#1A1A2E]">Active</option>
              <option value="draft" className="bg-[#1A1A2E]">Draft</option>
              <option value="archived" className="bg-[#1A1A2E]">Archived</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="gradient-bg text-white px-8 py-3 rounded-2xl text-sm font-semibold hover:shadow-xl hover:shadow-purple-500/20 transition-all disabled:opacity-50"
          >
            {saving ? "Creating..." : "Create Product"}
          </button>
        </form>
      )}

      {/* Product List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-14 h-14 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white/40 text-sm">Loading products...</p>
          </div>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-[#1A1A2E] rounded-2xl border border-white/5 p-16 text-center">
          <Package className="w-16 h-16 text-white/10 mx-auto mb-4" />
          <h3 className="font-bold text-lg text-white mb-2">No products yet</h3>
          <p className="text-white/40 text-sm mb-6">Add your first product to start selling.</p>
          <button
            onClick={() => setShowForm(true)}
            className="gradient-bg text-white px-6 py-3 rounded-2xl text-sm font-semibold inline-flex items-center gap-2 hover:shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map(product => (
            <div
              key={product.id}
              className="bg-[#1A1A2E] rounded-2xl border border-white/5 overflow-hidden hover:border-white/10 hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-300 group"
            >
              {/* Image */}
              <div className="relative h-48 bg-gradient-to-br from-white/5 to-transparent">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Package className="w-12 h-12 text-white/10" />
                  </div>
                )}
                <div className="absolute top-3 right-3 flex gap-2">
                  <span className={`text-[11px] font-semibold px-3 py-1 rounded-full capitalize border ${
                    product.status === "active" ? "bg-green-500/10 text-green-400 border-green-500/20" :
                    product.status === "draft" ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" :
                    "bg-white/5 text-white/40 border-white/10"
                  }`}>
                    {product.status}
                  </span>
                  {product.featured && (
                    <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[11px] font-semibold px-3 py-1 rounded-full">
                      ★ Featured
                    </span>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="p-5">
                <h3 className="font-bold text-sm text-white mb-2 line-clamp-1">{product.name}</h3>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xl font-black text-white">${product.price.toFixed(2)}</span>
                  {product.compareAt && (
                    <span className="text-sm text-white/30 line-through">${product.compareAt.toFixed(2)}</span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-xs text-white/40 mb-4">
                  <span>📦 {product.stock} in stock</span>
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400" fill="currentColor" />
                    {product.rating} ({product.reviewCount})
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleFeatured(product)}
                    className={`flex-1 text-xs px-3 py-2.5 rounded-xl font-semibold transition-all ${
                      product.featured
                        ? "bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
                        : "bg-white/5 text-white/40 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {product.featured ? "★ Featured" : "☆ Feature"}
                  </button>
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="flex items-center gap-1 text-xs px-3 py-2.5 rounded-xl font-semibold bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
