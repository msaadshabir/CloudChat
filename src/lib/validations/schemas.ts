import { z } from 'zod';

// Tweet schemas
export const createTweetSchema = z.object({
  content: z
    .string()
    .min(1, 'Content cannot be empty')
    .max(280, 'Content exceeds 280 characters')
    .transform(val => val.trim()),
  parentId: z.string().uuid().optional().nullable(),
});

export const tweetIdSchema = z.object({
  tweetId: z.string().uuid('Invalid tweet ID'),
});

// Reply schemas
export const createReplySchema = z.object({
  tweetId: z.string().uuid('Invalid tweet ID'),
  content: z
    .string()
    .min(1, 'Comment cannot be empty')
    .max(280, 'Comment exceeds 280 characters')
    .transform(val => val.trim()),
});

// User/Profile schemas
export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, 'Display name must be at least 2 characters')
    .max(50, 'Display name must be at most 50 characters')
    .transform(val => val.trim()),
  bio: z
    .string()
    .max(160, 'Bio must be at most 160 characters')
    .optional()
    .transform(val => val?.trim()),
});

// Pagination schemas
export const paginationSchema = z.object({
  cursor: z.string().datetime().optional(),
  limit: z
    .string()
    .optional()
    .transform(val => {
      if (!val) return 20;
      const num = parseInt(val, 10);
      return isNaN(num) ? 20 : Math.min(Math.max(1, num), 50);
    }),
});

// Search schemas
export const searchSchema = z.object({
  q: z
    .string()
    .max(100, 'Search query too long')
    .optional()
    .transform(val => val?.trim()),
});

// Type exports
export type CreateTweetInput = z.infer<typeof createTweetSchema>;
export type TweetIdInput = z.infer<typeof tweetIdSchema>;
export type CreateReplyInput = z.infer<typeof createReplySchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type SearchInput = z.infer<typeof searchSchema>;

// Validation helper
export function validateInput<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string[]> } {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  const errors: Record<string, string[]> = {};
  for (const error of result.error.issues) {
    const path = error.path.join('.') || 'root';
    if (!errors[path]) {
      errors[path] = [];
    }
    errors[path].push(error.message);
  }
  
  return { success: false, errors };
}
