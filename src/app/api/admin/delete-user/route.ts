import { auth } from '@clerk/nextjs/server';
import { getDb } from '@/lib/db';
import { users, tweets, likes } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  const { userId } = await auth();
  // Basic gate: only allow if signed-in dev; in a real app, check a role or env list
  if (!userId) return new Response('Unauthorized', { status: 401 });

  const body = await req.json().catch(() => null);
  const targetId = body?.userId as string | undefined;
  if (!targetId) return new Response('Missing userId', { status: 400 });

  const db = await getDb();
  // Delete dependents first for safety if FK cascade isn't applied
  await db.delete(likes).where(eq(likes.userId, targetId));
  await db.delete(tweets).where(eq(tweets.authorId, targetId));
  await db.delete(users).where(eq(users.id, targetId));

  return Response.json({ ok: true });
}
