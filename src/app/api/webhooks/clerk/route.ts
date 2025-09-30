import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { users, tweets, likes } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

type ClerkUser = {
  id: string;
  username?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  full_name?: string | null;
  image_url?: string | null;
};

type ClerkUserEvent = {
  type: 'user.created' | 'user.updated' | 'user.deleted';
  data: ClerkUser;
};

export async function POST(req: Request) {
  // Verify Clerk webhooks via Svix when secret is present
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  let evt: ClerkUserEvent | null = null;
  if (secret) {
    const svixId = req.headers.get('svix-id');
    const svixTimestamp = req.headers.get('svix-timestamp');
    const svixSignature = req.headers.get('svix-signature');
    if (!svixId || !svixTimestamp || !svixSignature) {
      return NextResponse.json({ error: 'Missing Svix headers' }, { status: 400 });
    }
    const payload = await req.text();
    try {
      const { Webhook } = await import('svix');
      const wh = new Webhook(secret);
      evt = wh.verify(payload, {
        'svix-id': svixId,
        'svix-timestamp': svixTimestamp,
        'svix-signature': svixSignature,
      }) as ClerkUserEvent;
    } catch {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }
  } else {
    // Fallback for local testing without signature verification
    try {
      evt = (await req.json()) as ClerkUserEvent;
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }
  }

  if (!evt?.type || !evt?.data) {
    return NextResponse.json({ error: 'Invalid event' }, { status: 400 });
  }

  const db = await getDb();

  if (evt.type === 'user.deleted') {
    const uid: string | undefined = evt.data?.id;
    if (!uid) return NextResponse.json({ error: 'Missing user id' }, { status: 400 });
    // Belt-and-suspenders: delete dependent rows even if DB cascade isn’t migrated yet
    await db.delete(likes).where(eq(likes.userId, uid));
    await db.delete(tweets).where(eq(tweets.authorId, uid));
    await db.delete(users).where(eq(users.id, uid));
    return NextResponse.json({ ok: true });
  }

  if (evt.type === 'user.created' || evt.type === 'user.updated') {
    const d = evt.data;
    const uid: string | undefined = d?.id;
    if (!uid) return NextResponse.json({ error: 'Missing user id' }, { status: 400 });

    const username: string | undefined = d?.username || undefined;
    const first = (d?.first_name as string | undefined) || '';
    const last = (d?.last_name as string | undefined) || '';
    const full = (d?.full_name as string | undefined) || `${first} ${last}`.trim();
    const image = (d?.image_url as string | undefined) || null;

    await db
      .insert(users)
      .values({ id: uid, username, name: full || undefined, image })
      .onConflictDoUpdate({ target: users.id, set: { username, name: full || undefined, image } });

    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: true });
}
