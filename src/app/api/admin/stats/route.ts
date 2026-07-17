import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const [
      totalOrders,
      totalRevenue,
      totalProducts,
      totalUsers,
      totalMessages,
      recentOrders,
      ordersByStatus,
      monthlyRevenue,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.aggregate({ _sum: { total: true } }),
      prisma.product.count({ where: { status: "active" } }),
      prisma.user.count(),
      prisma.contactMessage.count({ where: { read: false } }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { items: true },
      }),
      prisma.order.groupBy({
        by: ["status"],
        _count: true,
      }),
      prisma.$queryRaw`
        SELECT strftime('%Y-%m', createdAt) as month, SUM(total) as revenue
        FROM "Order"
        GROUP BY month
        ORDER BY month DESC
        LIMIT 6
      `,
    ])

    return NextResponse.json({
      totalOrders,
      totalRevenue: totalRevenue._sum.total || 0,
      totalProducts,
      totalUsers,
      unreadMessages: totalMessages,
      recentOrders,
      ordersByStatus,
      monthlyRevenue,
    })
  } catch (error) {
    console.error("Stats error:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
