import { put } from '@vercel/blob';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get('file') as File;
  
  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  const blob = await put(`profiles/${userId}/${file.name}`, file, {
    access: 'public',
  });

  // TODO: Save blob.url to user record in DB
  
  return NextResponse.json({ url: blob.url });
}