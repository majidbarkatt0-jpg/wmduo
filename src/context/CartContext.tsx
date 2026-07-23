"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"

export interface CartItem {
  productId: string
  name: string
  price: number
  quantity: number
  imageUrl: string
  slug: string
  stock: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity">, qty?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, qty: number) => void
  clearCart: () => void
  itemCount: number
  subtotal: number
  shipping: number
  total: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_KEY = "wmduo_cart"
const FREE_SHIPPING_THRESHOLD = 50

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [hydrated, setHydrated] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) setItems(parsed)
      }
    } catch (err) { console.warn("Cart localStorage parse error:", err) }
    setHydrated(true)
  }, [])

  // Save to localStorage on change
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(CART_KEY, JSON.stringify(items))
    }
  }, [items, hydrated])

  const addItem = useCallback((item: Omit<CartItem, "quantity">, qty = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.productId === item.productId)
      if (existing) {
        return prev.map(i =>
          i.productId === item.productId
            ? { ...i, quantity: Math.min(i.quantity + qty, i.stock) }
            : i
        )
      }
      return [...prev, { ...item, quantity: Math.min(qty, item.stock) }]
    })
  }, [])

  const removeItem = useCallback((productId: string) => {
    setItems(prev => prev.filter(i => i.productId !== productId))
  }, [])

  const updateQuantity = useCallback((productId: string, qty: number) => {
    setItems(prev =>
      qty <= 0
        ? prev.filter(i => i.productId !== productId)
        : prev.map(i => (i.productId === productId ? { ...i, quantity: Math.min(qty, i.stock) } : i))
    )
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : 9.99
  const total = subtotal + shipping

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, itemCount, subtotal, shipping, total }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}
