// src/lib/rateLimit.ts

interface RateLimitResult {
  success: boolean;
  remaining: number;
  reset: number; // in seconds
}

// In-memory cache for IP request timestamps
const rateLimitMap = new Map<string, number[]>();

/**
 * Basic IP-based sliding window rate limiter
 * @param ip Client IP address
 * @param limit Max number of requests allowed in the window
 * @param windowMs Window duration in milliseconds
 */
export function rateLimit(ip: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const windowStart = now - windowMs;

  let requestTimestamps = rateLimitMap.get(ip) || [];

  // Remove timestamps outside of the sliding window
  requestTimestamps = requestTimestamps.filter(timestamp => timestamp > windowStart);

  if (requestTimestamps.length >= limit) {
    const oldestTimestamp = requestTimestamps[0];
    const resetTime = oldestTimestamp + windowMs;
    rateLimitMap.set(ip, requestTimestamps);
    return {
      success: false,
      remaining: 0,
      reset: Math.max(0, Math.ceil((resetTime - now) / 1000)),
    };
  }

  requestTimestamps.push(now);
  rateLimitMap.set(ip, requestTimestamps);

  return {
    success: true,
    remaining: limit - requestTimestamps.length,
    reset: Math.ceil(windowMs / 1000),
  };
}

/**
 * Retrieve client IP address from request headers
 */
export function getClientIp(headers: Headers): string {
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  const realIp = headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return '127.0.0.1';
}
