import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getDb } from '@/lib/db';
import { replies } from '@/lib/db/schema';
import { sql } from 'drizzle-orm';
import { ensureRepliesTable } from '@/lib/db/migrations';
import { containsBannedLanguage, getModerationErrorMessage } from '@/lib/moderation';

export async function POST(req: Request) {
  await ensureRepliesTable();
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json().catch(() => null) as { tweetId?: string; content?: string } | null;
  const tweetId = body?.tweetId;
  const content = (body?.content || '').trim();
  if (!tweetId) return NextResponse.json({ error: 'Missing tweetId' }, { status: 400 });
  if (!content) return NextResponse.json({ error: 'Comment cannot be empty' }, { status: 400 });
  if (content.length > 280) return NextResponse.json({ error: 'Comment exceeds 280 characters' }, { status: 400 });
  if (containsBannedLanguage(content)) return NextResponse.json({ error: getModerationErrorMessage() }, { status: 400 });

  const db = await getDb();
  await db.insert(replies).values({ tweetId, userId, content });
  const [{ count }] = await db.execute(sql`select count(*)::int as count from replies where tweet_id = ${tweetId}`) as unknown as Array<{ count: number }>;
  return NextResponse.json({ replies: count });
}
