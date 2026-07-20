import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForToken, getStoreUrl } from '@/lib/shopify';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const hmac = searchParams.get('hmac');
  const shop = searchParams.get('shop');
  const timestamp = searchParams.get('timestamp');

  // Error handling
  if (!code) {
    const error = searchParams.get('error');
    return NextResponse.json(
      { error: error || 'No authorization code provided' },
      { status: 400 }
    );
  }

  try {
    // Exchange the code for a permanent access token
    const redirectUri = `${request.nextUrl.origin}/api/shopify/callback`;
    const tokenData = await exchangeCodeForToken(code, redirectUri);

    // Token stored in memory via shopify.ts module
    return NextResponse.json({
      success: true,
      message: '✅ Shopify installed successfully!',
      store: getStoreUrl(),
      token_preview: tokenData.access_token?.substring(0, 10) + '...',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to complete OAuth' },
      { status: 500 }
    );
  }
}
