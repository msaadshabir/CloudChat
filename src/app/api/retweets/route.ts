import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getDb } from '@/lib/db';
import { retweets } from '@/lib/db/schema';
import { and, eq, sql } from 'drizzle-orm';
import { ensureRetweetsTable } from '@/lib/db/migrations';

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json().catch(() => null) as { tweetId?: string } | null;
  const tweetId = body?.tweetId;
  if (!tweetId) return NextResponse.json({ error: 'Missing tweetId' }, { status: 400 });

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
  return NextResponse.json({ retweeted, retweets: count });
}
