import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getDb } from '@/lib/db';
import { replies } from '@/lib/db/schema';
import { sql } from 'drizzle-orm';
import { ensureRepliesTable } from '@/lib/db/migrations';
import { containsBannedLanguage, getModerationErrorMessage } from '@/lib/moderation';
import { checkRateLimit, getRateLimitHeaders, RateLimitConfigs } from '@/lib/api/rateLimit';
import { ErrorResponses } from '@/lib/api/errors';
import { createReplySchema, validateInput } from '@/lib/validations/schemas';

export async function POST(req: Request) {
  await ensureRepliesTable();
  const { userId } = await auth();
  if (!userId) return ErrorResponses.unauthorized();
  
  // Rate limit reply operations
  const rateLimitResult = checkRateLimit(`replies:${userId}`, RateLimitConfigs.write);
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait before replying again.' },
      { status: 429, headers: getRateLimitHeaders(rateLimitResult) }
    );
  }

  const body = await req.json().catch(() => null);
  const validation = validateInput(createReplySchema, body);
  
  if (!validation.success) {
    return ErrorResponses.validationError(validation.errors);
  }
  
  const { tweetId, content } = validation.data;
  
  if (containsBannedLanguage(content)) {
    return ErrorResponses.badRequest(getModerationErrorMessage());
  }

  const db = await getDb();
  await db.insert(replies).values({ tweetId, userId, content });
  const [{ count }] = await db.execute(sql`select count(*)::int as count from replies where tweet_id = ${tweetId}`) as unknown as Array<{ count: number }>;
  return NextResponse.json(
    { replies: count },
    { headers: getRateLimitHeaders(rateLimitResult) }
  );
}
