import { describe, it, expect } from 'vitest';
import { containsBannedLanguage, getModerationErrorMessage } from '@/lib/moderation';

describe('Moderation', () => {
  describe('containsBannedLanguage', () => {
    it('returns false when no banned words are configured', () => {
      // Without BANNED_WORDS env var, should return false
      const originalEnv = process.env.BANNED_WORDS;
      process.env.BANNED_WORDS = '';
      
      expect(containsBannedLanguage('hello world')).toBe(false);
      expect(containsBannedLanguage('any text here')).toBe(false);
      
      process.env.BANNED_WORDS = originalEnv;
    });

    it('detects banned words', () => {
      const originalEnv = process.env.BANNED_WORDS;
      process.env.BANNED_WORDS = 'badword,offensive';
      
      expect(containsBannedLanguage('this contains badword')).toBe(true);
      expect(containsBannedLanguage('this is offensive')).toBe(true);
      expect(containsBannedLanguage('this is clean')).toBe(false);
      
      process.env.BANNED_WORDS = originalEnv;
    });

    it('handles leet speak substitutions', () => {
      const originalEnv = process.env.BANNED_WORDS;
      process.env.BANNED_WORDS = 'test';
      
      // Should detect "t3st" as "test"
      expect(containsBannedLanguage('t3st')).toBe(true);
      
      process.env.BANNED_WORDS = originalEnv;
    });
  });

  describe('getModerationErrorMessage', () => {
    it('returns the expected error message', () => {
      expect(getModerationErrorMessage()).toBe('Content contains inappropriate language');
    });
  });
});
