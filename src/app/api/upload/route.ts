import { put } from '@vercel/blob';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get('file') as File;
  
  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  const blob = await put(`profiles/${userId}/${file.name}`, file, {
    access: 'public',
  });

  // Save blob.url to user record in DB
  await (await getDb())
    .update(users)
    .set({ image: blob.url })
    .where(eq(users.id, userId));
  
  return NextResponse.json({ url: blob.url });
}