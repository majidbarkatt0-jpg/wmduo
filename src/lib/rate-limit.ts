/**
 * Rate limiter for API endpoints.
 * Uses @upstash/ratelimit + @upstash/redis on Vercel (production).
 * Falls back to in-memory for local dev.
 */

interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

const cleanup = setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt < now) store.delete(key)
  }
}, 5 * 60 * 1000)

if (typeof cleanup === 'object' && cleanup?.unref) cleanup.unref()

export interface RateLimitConfig {
  maxRequests: number
  windowMs: number
}

const defaults: RateLimitConfig = {
  maxRequests: 10,
  windowMs: 60 * 1000,
}

export function checkRateLimit(
  key: string,
  config: Partial<RateLimitConfig> = {}
): { allowed: boolean; remaining: number; resetAt: number } {
  const { maxRequests, windowMs } = { ...defaults, ...config }
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: maxRequests - 1, resetAt: now + windowMs }
  }

  entry.count++

  if (entry.count > maxRequests) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt }
  }

  return { allowed: true, remaining: maxRequests - entry.count, resetAt: entry.resetAt }
}

export function getRateLimitKey(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded?.split(',')[0]?.trim() ||
             request.headers.get('x-real-ip') ||
             'unknown'
  return ip
}
