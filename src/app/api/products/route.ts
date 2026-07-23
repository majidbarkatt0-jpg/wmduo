import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const featured = searchParams.get("featured")
  const status = searchParams.get("status")
  const slug = searchParams.get("slug")
  const category = searchParams.get("category")
  const search = searchParams.get("search")

  try {
    if (slug) {
      const product = await prisma.product.findUnique({ where: { slug } })
      if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 })
      return NextResponse.json(product)
    }

    const where: any = {}
    if (featured === "true") where.featured = true
    if (status) where.status = status
    if (category) where.category = category
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ]
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
    })

    // Mask stock levels for non-admin requests to prevent competitive intel
    const session = await getServerSession(authOptions)
    const isAdmin = session && (session.user as any)?.role === "admin"
    const sanitized = products.map(p => ({
      ...p,
      stock: isAdmin ? p.stock : (p.stock > 10 ? 10 : p.stock > 0 ? p.stock : 0),
    }))

    return NextResponse.json(sanitized)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const data = await request.json()
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")

    const product = await prisma.product.create({
      data: {
        ...data,
        slug,
        features: data.features ? JSON.stringify(data.features) : undefined,
        specs: data.specs ? JSON.stringify(data.specs) : undefined,
        images: data.images ? JSON.stringify(data.images) : undefined,
      },
    })
    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id, ...data } = await request.json()
    const product = await prisma.product.update({
      where: { id },
      data: {
        ...data,
        features: data.features ? JSON.stringify(data.features) : undefined,
        specs: data.specs ? JSON.stringify(data.specs) : undefined,
        images: data.images ? JSON.stringify(data.images) : undefined,
      },
    })
    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 })

  try {
    await prisma.product.delete({ where: { id } })
    return NextResponse.json({ message: "Deleted" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 })
  }
}
