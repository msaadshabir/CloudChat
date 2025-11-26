import { describe, it, expect } from 'vitest';
import { shortRelative } from '@/lib/time';

describe('shortRelative', () => {
  it('returns "now" for very recent dates', () => {
    const now = new Date();
    expect(shortRelative(now)).toBe('now');
  });

  it('returns minutes for dates within the hour', () => {
    const date = new Date(Date.now() - 5 * 60 * 1000); // 5 minutes ago
    expect(shortRelative(date)).toBe('5m');
  });

  it('returns hours for dates within the day', () => {
    const date = new Date(Date.now() - 3 * 60 * 60 * 1000); // 3 hours ago
    expect(shortRelative(date)).toBe('3h');
  });

  it('returns days for dates within the week', () => {
    const date = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000); // 2 days ago
    expect(shortRelative(date)).toBe('2d');
  });

  it('handles string input', () => {
    const now = new Date();
    expect(shortRelative(now.toISOString())).toBe('now');
  });

  it('handles numeric timestamp input', () => {
    const now = Date.now();
    expect(shortRelative(now)).toBe('now');
  });
});
