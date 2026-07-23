import { NextRequest, NextResponse } from 'next/server';
import { getAuthUrl, getStoreUrl, getClientId } from '@/lib/shopify';
import crypto from 'crypto';

export async function GET(request: NextRequest) {
  // Generate a random state for CSRF protection
  const state = crypto.randomBytes(16).toString('hex');
  
  // 🔒 Store state in a cookie for CSRF validation in callback
  const response = NextResponse.json({
    success: true,
    store: getStoreUrl(),
    client_id: getClientId(),
    redirect_uri: `${request.nextUrl.origin}/api/shopify/callback`,
    state: state,
    auth_url: getAuthUrl(`${request.nextUrl.origin}/api/shopify/callback`, state),
    instructions: [
      '1. Open the auth_url in your browser',
      '2. Log in to your Shopify store if prompted',
      '3. Click "Install app" to authorize WM Duo',
      '4. You will be redirected back with your access token',
    ],
  });
  
  // Set state cookie with httpOnly flag for security
  response.cookies.set('shopify_oauth_state', state, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 300, // 5 minutes
    path: '/',
  });
  
  return response;
}
