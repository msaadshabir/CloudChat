import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { ensureUsersBioColumn } from '@/lib/db/migrations';

export async function PATCH(req: Request) {
  await ensureUsersBioColumn();
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const imageUrl = body?.imageUrl as string | undefined;
  const name = body?.name as string | undefined;
  const bio = body?.bio as string | undefined;

  if (!imageUrl && !name && typeof bio === 'undefined') {
    return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
  }

  await (await getDb())
    .update(users)
    .set({
      ...(imageUrl ? { image: imageUrl } : {}),
      ...(name ? { name } : {}),
      ...(typeof bio !== 'undefined' ? { bio } : {}),
    })
    .where(eq(users.id, userId));

  return NextResponse.json({ ok: true });
}
