/**
 * 🔐 WAJID v5.8 — ADMIN PANEL SECURITY PROXY
 * 
 * THREE LAYER SECURITY:
 * Layer 1: Secret Path Check — /admin/* 404 if no ?__admin=SECRET_PATH or cookie
 * Layer 2: Role Check — Admin role required
 * Layer 3: Session Auth — NextAuth handles this
 */

import crypto from "crypto"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const COOKIE_NAME = "__wmduo_admin_access"
const COOKIE_MAX_AGE = 60 * 60 * 24 // 24 hours

function getSecretPath(): string {
  return process.env.ADMIN_SECRET_PATH || ''
}

function timingSafeEqual(a: string, b: string): boolean {
  try {
    return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b))
  } catch {
    return false
  }
}

function hasSecretAccess(req: NextRequest): boolean {
  const path = req.nextUrl.pathname

  // 🔑 Sirf /admin/* routes ko secret path check chahiye
  if (!path.startsWith('/admin')) return true

  // Admin login page is always accessible
  if (path === '/admin' || path === '/admin-login') return true
  if (path.includes('/_next/')) return true

  const secretPath = getSecretPath()
  if (!secretPath) {
    if (process.env.NODE_ENV === 'production') {
      console.error('CRITICAL: ADMIN_SECRET_PATH not configured — admin panel is UNPROTECTED. Set this env var immediately.')
    }
    return true // Legacy mode — warn in production
  }

  // Check query param (timing-safe comparison)
  const adminKey = req.nextUrl.searchParams.get('__admin')
  if (adminKey && timingSafeEqual(adminKey, secretPath)) return true

  // Check cookie (timing-safe comparison)
  const adminCookie = req.cookies.get(COOKIE_NAME)?.value
  if (adminCookie && timingSafeEqual(adminCookie, secretPath)) return true

  return false
}

function get404Response(): NextResponse {
  return new NextResponse(
    `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>404 — Not Found</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:system-ui,-apple-system,sans-serif;background:#0D0D12;color:#E4E4E7;display:flex;align-items:center;justify-content:center;min-height:100vh;text-align:center;padding:20px}
.container{max-width:400px}
.icon{font-size:64px;opacity:.3;margin-bottom:20px}
h1{font-size:72px;font-weight:900;color:#2A2A35;margin-bottom:8px}
p{color:#52525B;font-size:14px;line-height:1.6}
a{color:#A78BFA;text-decoration:none}
a:hover{text-decoration:underline}
</style></head>
<body><div class="container">
<div class="icon">◈</div><h1>404</h1>
<p>The page you're looking for doesn't exist.</p>
<p style="margin-top:16px"><a href="/">← Back to Home</a></p>
</div></body></html>`,
    { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  )
}

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname

  // 🔴 LAYER 1: Secret Path Check
  if (!hasSecretAccess(request)) {
    return get404Response()
  }

  // Set cookie for future visits if accessed via query param
  const secretPath = getSecretPath()
  const adminKey = request.nextUrl.searchParams.get('__admin')
  const hasCookie = request.cookies.get(COOKIE_NAME)?.value === secretPath
  
  if (adminKey === secretPath && !hasCookie && secretPath) {
    const response = NextResponse.next()
    response.cookies.set(COOKIE_NAME, secretPath, {
      maxAge: COOKIE_MAX_AGE,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/admin',
    })
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|apple-icon.png|icon.png|robots.txt|sitemap.xml).*)',
  ],
}
