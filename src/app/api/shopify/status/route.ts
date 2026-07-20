import { NextRequest, NextResponse } from 'next/server';
import { getAccessToken, getStoreUrl, getShopInfo } from '@/lib/shopify';

export async function GET() {
  const token = getAccessToken();
  
  if (!token) {
    return NextResponse.json({
      connected: false,
      store: getStoreUrl(),
      message: '❌ Shopify not installed yet. Visit /api/shopify/install to get started.',
    });
  }

  try {
    const shopInfo = await getShopInfo();
    return NextResponse.json({
      connected: true,
      store: getStoreUrl(),
      shop: shopInfo.data?.shop || 'Unknown',
      message: '✅ Shopify connected!',
    });
  } catch (error: any) {
    return NextResponse.json({
      connected: false,
      store: getStoreUrl(),
      error: error.message,
      message: '⚠️ Shopify token may have expired. Reinstall at /api/shopify/install',
    });
  }
}
