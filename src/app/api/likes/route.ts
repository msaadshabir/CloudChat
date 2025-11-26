import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getDb } from '@/lib/db';
import { likes } from '@/lib/db/schema';
import { and, eq, sql } from 'drizzle-orm';
import { ensureLikesUniqueIndex } from '@/lib/db/migrations';
import { checkRateLimit, getRateLimitHeaders, RateLimitConfigs } from '@/lib/api/rateLimit';
import { ErrorResponses } from '@/lib/api/errors';
import { tweetIdSchema, validateInput } from '@/lib/validations/schemas';

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return ErrorResponses.unauthorized();
  
  // Rate limit like operations
  const rateLimitResult = checkRateLimit(`likes:${userId}`, RateLimitConfigs.standard);
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait before liking again.' },
      { status: 429, headers: getRateLimitHeaders(rateLimitResult) }
    );
  }

  const body = await req.json().catch(() => null);
  const validation = validateInput(tweetIdSchema, body);
  
  if (!validation.success) {
    return ErrorResponses.validationError(validation.errors);
  }
  
  const { tweetId } = validation.data;

  await ensureLikesUniqueIndex();
  const db = await getDb();

  // Check if like exists
  const existing = await db.select({ id: likes.id }).from(likes).where(and(eq(likes.userId, userId), eq(likes.tweetId, tweetId))).limit(1);
  let liked: boolean;
  if (existing.length > 0) {
    await db.delete(likes).where(and(eq(likes.userId, userId), eq(likes.tweetId, tweetId)));
    liked = false;
  } else {
    await db.insert(likes).values({ userId, tweetId });
    liked = true;
  }

  const [{ count }] = await db.execute(sql`select count(*)::int as count from likes where tweet_id = ${tweetId}`) as unknown as Array<{ count: number }>;
  return NextResponse.json(
    { liked, likes: count },
    { headers: getRateLimitHeaders(rateLimitResult) }
  );
}
