import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { status: "active" },
      select: { category: true },
    })

    // Count products per category
    const counts: Record<string, number> = {}
    for (const p of products) {
      if (p.category) {
        counts[p.category] = (counts[p.category] || 0) + 1
      }
    }

    const categories = Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name))

    return NextResponse.json(categories)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}
