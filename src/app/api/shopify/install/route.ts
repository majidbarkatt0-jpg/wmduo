import { NextRequest, NextResponse } from 'next/server';
import { getAuthUrl, getStoreUrl, getClientId } from '@/lib/shopify';
import crypto from 'crypto';

export async function GET(request: NextRequest) {
  // Generate a random state for CSRF protection
  const state = crypto.randomBytes(16).toString('hex');
  
  // The redirect URI where Shopify will send the code
  const redirectUri = `${request.nextUrl.origin}/api/shopify/callback`;
  
  // Generate the full OAuth authorization URL
  const authUrl = getAuthUrl(redirectUri, state);

  return NextResponse.json({
    success: true,
    store: getStoreUrl(),
    client_id: getClientId(),
    redirect_uri: redirectUri,
    state: state,
    auth_url: authUrl,
    instructions: [
      '1. Open the auth_url in your browser',
      '2. Log in to your Shopify store if prompted',
      '3. Click "Install app" to authorize WM Duo',
      '4. You will be redirected back with your access token',
    ],
  });
}
