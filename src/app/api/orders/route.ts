import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status")
  const limit = parseInt(searchParams.get("limit") || "50")
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
    const { items, ...orderData } = data

    // Require login to place order
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "You must be logged in to place an order" }, { status: 401 })
    }

    // Generate order number
    const count = await prisma.order.count()
    const orderNumber = `WMD-${String(count + 1).padStart(5, "0")}`

    const order = await prisma.order.create({
      data: {
        ...orderData,
        orderNumber,
        userId: session.user.id,
        email: session.user.email || orderData.email,
        name: session.user.name || orderData.name,
        items: {
          create: items.map((item: any) => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            imageUrl: item.imageUrl,
            productId: item.productId,
          })),
        },
      },
      include: { items: true },
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error("Order creation error:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id, status, trackingUrl, notes } = await request.json()
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
