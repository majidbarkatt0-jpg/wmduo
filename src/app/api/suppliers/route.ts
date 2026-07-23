import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getAllSupplierInfo } from '@/lib/fulfillment';

export const dynamic = 'force-dynamic';

/**
 * GET /api/suppliers
 * Returns all supplier info for WM Duo products
 * Used by the admin dashboard to monitor costs and profits
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const suppliers = getAllSupplierInfo();
  
  // Calculate totals
  const items = Object.values(suppliers);
  const totalCost = items.reduce((sum: number, s: any) => sum + s.costPrice, 0);
  const totalRevenue = items.reduce((sum: number, s: any) => sum + s.ourPrice, 0);
  const totalProfit = items.reduce((sum: number, s: any) => sum + s.profit, 0);
  const avgMargin = items.length > 0 
    ? Math.round(items.reduce((sum: number, s: any) => sum + s.margin, 0) / items.length) 
    : 0;

  return NextResponse.json({
    success: true,
    totalProducts: items.length,
    stats: {
      totalCost: Math.round(totalCost * 100) / 100,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalProfit: Math.round(totalProfit * 100) / 100,
      averageMargin: `${avgMargin}%`,
    },
    suppliers,
  });
}
