import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getDb } from '@/lib/db';
import { retweets } from '@/lib/db/schema';
import { and, eq, sql } from 'drizzle-orm';
import { ensureRetweetsTable } from '@/lib/db/migrations';
import { checkRateLimit, getRateLimitHeaders, RateLimitConfigs } from '@/lib/api/rateLimit';
import { ErrorResponses } from '@/lib/api/errors';
import { tweetIdSchema, validateInput } from '@/lib/validations/schemas';

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return ErrorResponses.unauthorized();
  
  // Rate limit retweet operations
  const rateLimitResult = checkRateLimit(`retweets:${userId}`, RateLimitConfigs.standard);
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait before retweeting again.' },
      { status: 429, headers: getRateLimitHeaders(rateLimitResult) }
    );
  }

  const body = await req.json().catch(() => null);
  const validation = validateInput(tweetIdSchema, body);
  
  if (!validation.success) {
    return ErrorResponses.validationError(validation.errors);
  }
  
  const { tweetId } = validation.data;

  await ensureRetweetsTable();
  const db = await getDb();
  const existing = await db.select({ id: retweets.id }).from(retweets).where(and(eq(retweets.userId, userId), eq(retweets.tweetId, tweetId))).limit(1);
  let retweeted: boolean;
  if (existing.length > 0) {
    await db.delete(retweets).where(and(eq(retweets.userId, userId), eq(retweets.tweetId, tweetId)));
    retweeted = false;
  } else {
    await db.insert(retweets).values({ userId, tweetId });
    retweeted = true;
  }
  const [{ count }] = await db.execute(sql`select count(*)::int as count from retweets where tweet_id = ${tweetId}`) as unknown as Array<{ count: number }>;
  return NextResponse.json(
    { retweeted, retweets: count },
    { headers: getRateLimitHeaders(rateLimitResult) }
  );
}
