import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status")
  const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "50") || 50, 1), 200)
  const isAdmin = (session.user as any)?.role === "admin"

  try {
    const where: any = {}
    // Admins can see all orders, regular users only see their own
    if (!isAdmin) {
      where.userId = session.user.id
    }
    if (status) where.status = status

    const orders = await prisma.order.findMany({
      where,
      include: { items: true, user: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
      take: limit,
    })
    return NextResponse.json(orders)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { items, name, email, phone, address, city, country, zipCode } = data

    // Require login to place order
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "You must be logged in to place an order" }, { status: 401 })
    }

    // 🔒 SECURITY: Validate prices against database to prevent price manipulation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Order must contain at least one item" }, { status: 400 })
    }

    // Fetch all products from DB to verify prices
    const productIds = items.map((i: any) => i.productId).filter(Boolean)
    const dbProducts = productIds.length > 0
      ? await prisma.product.findMany({ where: { id: { in: productIds } }, select: { id: true, price: true, name: true, stock: true } })
      : []
    const productMap = new Map(dbProducts.map(p => [p.id, p]))

    // 🔒 REJECT items without valid DB product — never use client-supplied prices
    let calculatedTotal = 0
    const validatedItems = items.map((item: any) => {
      const dbProduct = item.productId ? productMap.get(item.productId) : null

      if (!dbProduct) {
        throw new Error(`Invalid product: "${item.name}" not found in database.`)
      }

      // Negative or zero quantity check — prevents price manipulation
      const qty = Number.isInteger(item.quantity) && item.quantity > 0 ? item.quantity : null
      if (!qty) {
        throw new Error(`Invalid quantity for "${dbProduct.name}". Quantity must be a positive integer.`)
      }

      // Use DB price, NOT client-supplied price
      const dbPrice = dbProduct.price
      calculatedTotal += dbPrice * qty

      // Check stock before proceeding
      if (dbProduct.stock < qty) {
        throw new Error(`Insufficient stock for "${dbProduct.name}". Please reduce quantity and try again.`)
      }

      return {
        name: dbProduct.name,
        price: dbPrice,
        quantity: qty,
        imageUrl: item.imageUrl || null,
        productId: item.productId,
      }
    })

    // Generate order number using crypto-safe random
    const buf = new Uint8Array(4)
    crypto.getRandomValues(buf)
    const random = Array.from(buf).map(b => b.toString(36).toUpperCase()).join('').substring(0, 8)
    const timestamp = Date.now().toString(36).toUpperCase()
    const orderNumber = `WMD-${timestamp}${random}`

    // 🔒 Wrap in transaction: create order + deduct stock atomically
    const order = await prisma.$transaction(async (tx) => {
      // Create order — only whitelisted fields from client
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: session.user.id,
          email: session.user.email || email || "",
          name: session.user.name || name || "",
          phone: phone || null,
          address: address || null,
          city: city || null,
          country: country || null,
          zipCode: zipCode || null,
          total: calculatedTotal,
          items: { create: validatedItems },
        },
        include: { items: true },
      })

      // Deduct stock atomically within same transaction
      for (const item of validatedItems) {
        if (item.productId) {
          // Use updateMany with stock check to prevent overselling
          const result = await tx.product.updateMany({
            where: { 
              id: item.productId, 
              stock: { gte: item.quantity } 
            },
            data: { stock: { decrement: item.quantity } },
          })
          if (result.count === 0) {
            throw new Error(`Insufficient stock for "${item.name}". Please refresh and try again.`)
          }
        }
      }

      return newOrder
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error: any) {
    console.error("Order creation error:", error)
    const message = error.message || "Failed to create order"
    return NextResponse.json({ error: message }, { status: message.includes("stock") ? 400 : 500 })
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id, status, trackingUrl, notes } = await request.json()
    const validStatuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"]
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 })
    }
    const order = await prisma.order.update({
      where: { id },
      data: { status, trackingUrl, notes },
      include: { items: true },
    })
    return NextResponse.json(order)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
  }
}
