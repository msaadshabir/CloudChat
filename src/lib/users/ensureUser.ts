import { auth, currentUser } from '@clerk/nextjs/server';
import { getDb } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// Ensures a local user row exists/updated for the signed-in Clerk user id.
// Uses Clerk's username (for @handle) and display name; no email fallbacks.
export async function ensureCurrentUserInDb() {
  const { userId } = await auth();
  if (!userId) return;

  const cu = await currentUser();
  if (!cu) return;

  const username = cu.username || undefined;
  const name = cu.fullName || [cu.firstName, cu.lastName].filter(Boolean).join(' ') || undefined;
  const image = cu.imageUrl || null;

  const db = await getDb();
  await db
    .insert(users)
    .values({ id: userId, username, name, image })
    .onConflictDoUpdate({ target: users.id, set: { username, name, image } });
}
