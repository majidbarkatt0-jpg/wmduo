import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const result = await prisma.product.groupBy({
      by: ["category"],
      where: { status: "active", category: { not: null } },
      _count: true,
    })

    const categories = result
      .map((r) => ({ name: r.category!, count: r._count }))
      .sort((a, b) => a.name.localeCompare(b.name))

    return NextResponse.json(categories)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}
