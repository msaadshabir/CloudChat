import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { tweets } from '@/lib/db/schema';
import { count } from 'drizzle-orm';

export async function GET() {
  try {
    const db = await getDb();
    const result = await db
      .select({ totalTweets: count(tweets.id) })
      .from(tweets)
      .limit(1);

    const totalTweets = Number(result?.[0]?.totalTweets ?? 0);
    return NextResponse.json({ ok: true, totalTweets });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
