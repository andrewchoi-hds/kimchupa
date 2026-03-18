// Simple in-memory rate limiter for Vercel serverless
// Each serverless function instance has its own memory,
// so this provides per-instance rate limiting (not global)

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (entry.resetAt < now) store.delete(key);
  }
}, 60_000);

export interface RateLimitConfig {
  interval: number; // Time window in ms
  limit: number; // Max requests per window
}

export function rateLimit(
  key: string,
  config: RateLimitConfig = { interval: 60_000, limit: 30 }
): { success: boolean; remaining: number; reset: number } {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + config.interval });
    return { success: true, remaining: config.limit - 1, reset: now + config.interval };
  }

  if (entry.count >= config.limit) {
    return { success: false, remaining: 0, reset: entry.resetAt };
  }

  entry.count++;
  return { success: true, remaining: config.limit - entry.count, reset: entry.resetAt };
}

export function getRateLimitHeaders(result: { remaining: number; reset: number }) {
  return {
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(Math.ceil(result.reset / 1000)),
  };
}
