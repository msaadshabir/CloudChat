// Simple in-memory rate limiter for API routes
// For production, consider using Redis-based solutions like @upstash/ratelimit

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 60000); // Clean up every minute

export interface RateLimitConfig {
  // Maximum number of requests allowed in the window
  limit: number;
  // Time window in milliseconds
  windowMs: number;
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetTime: number;
  limit: number;
}

// Default configurations for different API types
export const RateLimitConfigs = {
  // Strict limit for write operations
  write: { limit: 10, windowMs: 60000 } as RateLimitConfig, // 10 per minute
  // More lenient for read operations
  read: { limit: 60, windowMs: 60000 } as RateLimitConfig, // 60 per minute
  // Very strict for auth-related operations
  auth: { limit: 5, windowMs: 300000 } as RateLimitConfig, // 5 per 5 minutes
  // Standard API limit
  standard: { limit: 30, windowMs: 60000 } as RateLimitConfig, // 30 per minute
};

/**
 * Check if a request should be rate limited
 * @param identifier - Unique identifier for the client (e.g., userId or IP)
 * @param config - Rate limit configuration
 * @returns RateLimitResult with success status and metadata
 */
export function checkRateLimit(
  identifier: string, 
  config: RateLimitConfig = RateLimitConfigs.standard
): RateLimitResult {
  const now = Date.now();
  const key = identifier;
  
  let record = rateLimitStore.get(key);
  
  // If no record exists or window has expired, create new record
  if (!record || now > record.resetTime) {
    record = {
      count: 1,
      resetTime: now + config.windowMs,
    };
    rateLimitStore.set(key, record);
    return {
      success: true,
      remaining: config.limit - 1,
      resetTime: record.resetTime,
      limit: config.limit,
    };
  }
  
  // Increment count
  record.count++;
  
  // Check if limit exceeded
  if (record.count > config.limit) {
    return {
      success: false,
      remaining: 0,
      resetTime: record.resetTime,
      limit: config.limit,
    };
  }
  
  return {
    success: true,
    remaining: config.limit - record.count,
    resetTime: record.resetTime,
    limit: config.limit,
  };
}

/**
 * Get rate limit headers for response
 */
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': Math.ceil(result.resetTime / 1000).toString(),
  };
}

/**
 * Create a rate limiter for a specific endpoint
 * Returns a function that can be used in API routes
 */
export function createRateLimiter(config: RateLimitConfig = RateLimitConfigs.standard) {
  return (identifier: string) => checkRateLimit(identifier, config);
}
