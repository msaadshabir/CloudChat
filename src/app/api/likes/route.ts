import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getDb } from '@/lib/db';
import { likes } from '@/lib/db/schema';
import { and, eq, sql } from 'drizzle-orm';
import { ensureLikesUniqueIndex } from '@/lib/db/migrations';

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json().catch(() => null) as { tweetId?: string } | null;
  const tweetId = body?.tweetId;
  if (!tweetId) return NextResponse.json({ error: 'Missing tweetId' }, { status: 400 });

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
  return NextResponse.json({ liked, likes: count });
}
