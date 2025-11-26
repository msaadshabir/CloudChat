import { describe, it, expect } from 'vitest';
import { 
  createTweetSchema, 
  tweetIdSchema, 
  createReplySchema,
  updateProfileSchema,
  validateInput 
} from '@/lib/validations/schemas';

describe('Validation Schemas', () => {
  describe('createTweetSchema', () => {
    it('validates valid tweet content', () => {
      const result = validateInput(createTweetSchema, { content: 'Hello world!' });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.content).toBe('Hello world!');
      }
    });

    it('rejects empty content', () => {
      const result = validateInput(createTweetSchema, { content: '' });
      expect(result.success).toBe(false);
    });

    it('rejects content over 280 characters', () => {
      const longContent = 'a'.repeat(281);
      const result = validateInput(createTweetSchema, { content: longContent });
      expect(result.success).toBe(false);
    });

    it('trims whitespace from content', () => {
      const result = validateInput(createTweetSchema, { content: '  Hello world!  ' });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.content).toBe('Hello world!');
      }
    });

    it('accepts optional parentId', () => {
      const result = validateInput(createTweetSchema, { 
        content: 'Reply', 
        parentId: '550e8400-e29b-41d4-a716-446655440000' 
      });
      expect(result.success).toBe(true);
    });
  });

  describe('tweetIdSchema', () => {
    it('validates valid UUID', () => {
      const result = validateInput(tweetIdSchema, { 
        tweetId: '550e8400-e29b-41d4-a716-446655440000' 
      });
      expect(result.success).toBe(true);
    });

    it('rejects invalid UUID', () => {
      const result = validateInput(tweetIdSchema, { tweetId: 'not-a-uuid' });
      expect(result.success).toBe(false);
    });

    it('rejects missing tweetId', () => {
      const result = validateInput(tweetIdSchema, {});
      expect(result.success).toBe(false);
    });
  });

  describe('createReplySchema', () => {
    it('validates valid reply', () => {
      const result = validateInput(createReplySchema, { 
        tweetId: '550e8400-e29b-41d4-a716-446655440000',
        content: 'Great tweet!'
      });
      expect(result.success).toBe(true);
    });

    it('rejects empty content', () => {
      const result = validateInput(createReplySchema, { 
        tweetId: '550e8400-e29b-41d4-a716-446655440000',
        content: ''
      });
      expect(result.success).toBe(false);
    });
  });

  describe('updateProfileSchema', () => {
    it('validates valid profile update', () => {
      const result = validateInput(updateProfileSchema, { 
        name: 'John Doe',
        bio: 'Hello, I am John!'
      });
      expect(result.success).toBe(true);
    });

    it('rejects name shorter than 2 characters', () => {
      const result = validateInput(updateProfileSchema, { name: 'J' });
      expect(result.success).toBe(false);
    });

    it('rejects name longer than 50 characters', () => {
      const result = validateInput(updateProfileSchema, { name: 'a'.repeat(51) });
      expect(result.success).toBe(false);
    });

    it('rejects bio longer than 160 characters', () => {
      const result = validateInput(updateProfileSchema, { 
        name: 'John',
        bio: 'a'.repeat(161) 
      });
      expect(result.success).toBe(false);
    });
  });
});
