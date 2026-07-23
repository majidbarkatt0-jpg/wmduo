"use client"
import { useState } from "react"
import Link from "next/link"
import { useCart } from "@/context/CartContext"

interface ProductCardProps {
  product: any
  index: number
  span?: "hero" | "wide" | "tall" | "normal"
}

export default function ProductCard({ product, index, span = "normal" }: ProductCardProps) {
  const { addItem, items } = useCart()
  const [added, setAdded] = useState(false)
  const cartItem = items.find(i => i.productId === product.id)
  const quantity = cartItem?.quantity || 0
  const hasDiscount = product.compareAt && product.compareAt > product.price
  const discount = hasDiscount ? Math.round((1 - product.price / product.compareAt) * 100) : 0

  const imgUrl = product.image || product.imageUrl || ""

  const isBrown = index % 3 === 1
  const isGold = index % 5 === 0

  const spanClass = span === "hero" ? "md:col-span-2 md:row-span-2" :
    span === "wide" ? "md:col-span-2" :
    span === "tall" ? "md:row-span-2" : ""

  const colorClass = isBrown ? "bento-card--brown" : isGold ? "bento-card--white bento-card--gold" : "bento-card--white"

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({ productId: product.id, name: product.name, price: product.price, imageUrl: imgUrl, slug: product.slug, stock: product.stock ?? 0 })
    setAdded(true)
    setTimeout(() => setAdded(false), 800)
  }

  return (
    <Link href={`/products/${product.slug}`}
      className={`bento-card ${colorClass} ${spanClass} no-underline cursor-pointer group animate-float-in`}
      style={{ animationDelay: `${index * 60}ms` }}>
      {isBrown && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at center, rgba(212,175,55,0.08), transparent 70%)` }} />
      )}
      <span className="absolute top-3 right-3 z-10 text-[9px] font-semibold tracking-widest uppercase px-3 py-1 rounded-full backdrop-blur-sm border"
        style={{
          background: isBrown ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
          color: isBrown ? "var(--gold-soft)" : "var(--brown-mid)",
          borderColor: "rgba(212,175,55,0.15)",
        }}>
        {hasDiscount ? `-${discount}%` : product.category || "new"}
      </span>

      {imgUrl ? (
        <img src={imgUrl} alt={product.name} loading="lazy"
          className="w-full aspect-square object-cover rounded-xl mb-3 transition-transform duration-700 group-hover:scale-[1.03]"
          style={{ background: "#e8e0d8" }} />
      ) : (
        <div className="w-full aspect-square rounded-xl mb-3 bg-brown-light/10 flex items-center justify-center text-4xl text-brown-light">◈</div>
      )}

      <h3 className="font-['Playfair_Display',serif] text-base sm:text-lg font-bold text-brown-deep leading-tight line-clamp-1">
        {product.name}
      </h3>
      <div className="flex items-baseline gap-2 mt-0.5">
        <span className={`text-lg font-bold ${isBrown ? "text-gold-soft" : "text-gold"}`}>
          ${product.price.toFixed(2)}
        </span>
        {hasDiscount && (
          <span className="text-xs text-brown-mid line-through opacity-50">${product.compareAt.toFixed(2)}</span>
        )}
      </div>
      {product.stock !== null && product.stock <= 5 && product.stock > 0 && (
        <span className="text-[10px] text-brown-mid mt-1 font-medium">Only {product.stock} left</span>
      )}
      <div className="flex items-center gap-2 mt-3" onClick={e => e.preventDefault()}>
        <button onClick={handleAdd}
          className={`text-[10px] font-semibold tracking-widest uppercase px-4 py-2 rounded-full transition-all duration-500 ${added ? "bg-brown-deep text-white" : isBrown ? "btn-brown !text-[10px] !px-4 !py-2" : "btn-gold !text-[10px] !px-4 !py-2"}`}>
          {added ? "✓ Added" : "Add"}
        </button>
        {quantity > 0 && (
          <span className="text-[10px] text-brown-mid font-medium">{quantity} in cart</span>
        )}
      </div>
    </Link>
  )
}
