import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForToken, getStoreUrl } from '@/lib/shopify';
import crypto from 'crypto';

function clearStateCookie() {
  const res = NextResponse.json({});
  res.cookies.set('shopify_oauth_state', '', { httpOnly: true, maxAge: 0, path: '/' });
  return res;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const hmac = searchParams.get('hmac');
  const shop = searchParams.get('shop');
  const timestamp = searchParams.get('timestamp');

  if (!code) {
    const error = searchParams.get('error');
    return NextResponse.json(
      { error: error || 'No authorization code provided' },
      { status: 400 }
    );
  }

  // 🔒 Validate state (CSRF protection)
  const storedState = request.cookies.get('shopify_oauth_state')?.value;
  if (!storedState || !state || !crypto.timingSafeEqual(Buffer.from(state), Buffer.from(storedState))) {
    return NextResponse.json(
      { error: 'Invalid OAuth state parameter — possible CSRF attack' },
      { status: 403 }
    );
  }

  // 🔒 Validate HMAC if shop and timestamp are present
  if (hmac && shop && timestamp) {
    const clientSecret = process.env.SHOPIFY_CLIENT_SECRET || '';
    const queryString = `code=${code}&shop=${shop}&state=${state}&timestamp=${timestamp}`;
    const expectedHmac = crypto
      .createHmac('sha256', clientSecret)
      .update(queryString, 'utf8')
      .digest('hex');
    
    if (!crypto.timingSafeEqual(Buffer.from(expectedHmac), Buffer.from(hmac))) {
      return clearStateCookie();
    }
  }

  try {
    const redirectUri = `${request.nextUrl.origin}/api/shopify/callback`;
    await exchangeCodeForToken(code, redirectUri);

    const response = NextResponse.json({
      success: true,
      message: 'Shopify installed successfully!',
      store: getStoreUrl(),
      installed: true,
    });
    
    response.cookies.set('shopify_oauth_state', '', { httpOnly: true, maxAge: 0, path: '/' });
    return response;
  } catch (error: any) {
    console.error('Shopify OAuth error:', error);
    return clearStateCookie();
  }
}
