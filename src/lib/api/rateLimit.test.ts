import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { checkRateLimit, RateLimitConfigs } from '@/lib/api/rateLimit';

describe('Rate Limiting', () => {
  beforeEach(() => {
    // Reset rate limit store by waiting or using different identifiers
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('allows requests within the limit', () => {
    const identifier = `test-${Date.now()}-1`;
    const config = { limit: 5, windowMs: 60000 };
    
    const result1 = checkRateLimit(identifier, config);
    expect(result1.success).toBe(true);
    expect(result1.remaining).toBe(4);
    
    const result2 = checkRateLimit(identifier, config);
    expect(result2.success).toBe(true);
    expect(result2.remaining).toBe(3);
  });

  it('blocks requests over the limit', () => {
    const identifier = `test-${Date.now()}-2`;
    const config = { limit: 2, windowMs: 60000 };
    
    checkRateLimit(identifier, config);
    checkRateLimit(identifier, config);
    
    const result = checkRateLimit(identifier, config);
    expect(result.success).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it('resets after window expires', () => {
    const identifier = `test-${Date.now()}-3`;
    const config = { limit: 1, windowMs: 1000 };
    
    const result1 = checkRateLimit(identifier, config);
    expect(result1.success).toBe(true);
    
    const result2 = checkRateLimit(identifier, config);
    expect(result2.success).toBe(false);
    
    // Advance time past the window
    vi.advanceTimersByTime(1500);
    
    const result3 = checkRateLimit(identifier, config);
    expect(result3.success).toBe(true);
  });

  it('uses correct defaults for different config types', () => {
    expect(RateLimitConfigs.write.limit).toBe(10);
    expect(RateLimitConfigs.read.limit).toBe(60);
    expect(RateLimitConfigs.auth.limit).toBe(5);
    expect(RateLimitConfigs.standard.limit).toBe(30);
  });
});
