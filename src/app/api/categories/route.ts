import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { status: "active" },
      select: { category: true },
      distinct: ["category"],
      orderBy: { category: "asc" },
    })

    const categories = products
      .map(p => p.category)
      .filter((c): c is string => c !== null)

    return NextResponse.json(categories)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}
