import { auth } from '@clerk/nextjs/server';
import { getDb } from '@/lib/db';
import { tweets } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return new Response('Unauthorized', { status: 401 });

  const body = await req.json().catch(() => null) as { tweetId?: string } | null;
  const tweetId = body?.tweetId;
  if (!tweetId) return new Response('Missing tweetId', { status: 400 });

  const db = await getDb();
  await db.delete(tweets).where(eq(tweets.id, tweetId));
  return Response.json({ ok: true });
}
