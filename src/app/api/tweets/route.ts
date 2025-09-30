import { getDb } from '@/lib/db';
import { tweets, likes, users } from '@/lib/db/schema';
import { auth } from '@clerk/nextjs/server';
import { eq, count, desc } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { content, parentId } = await request.json();
  const text = (content ?? '').toString().trim();
  if (!text || text.length === 0) {
    return NextResponse.json({ error: 'Content cannot be empty' }, { status: 400 });
  }
  if (text.length > 280) {
    return NextResponse.json({ error: 'Content exceeds 280 characters' }, { status: 400 });
  }
  
  try {
    const [newTweet] = await getDb()
      .insert(tweets)
      .values({ 
        content: text, 
        authorId: userId,
        parentId: parentId || null
      })
      .returning() as { id: string; content: string; authorId: string; parentId: string | null; createdAt: Date }[];
    
    return NextResponse.json(newTweet);
  } catch {
    return NextResponse.json({ error: 'Failed to create tweet' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const tweetData = await getDb()
      .select({
        id: tweets.id,
        content: tweets.content,
        createdAt: tweets.createdAt,
        author: {
          id: users.id,
          name: users.name,
          image: users.image,
          username: users.username
        },
        likes: count(likes.id)
      })
      .from(tweets)
      .leftJoin(users, eq(tweets.authorId, users.id))
      .leftJoin(likes, eq(tweets.id, likes.tweetId))
      .groupBy(tweets.id, users.id)
      .orderBy(desc(tweets.createdAt))
      .limit(50);
    
    return NextResponse.json(tweetData);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch tweets' }, { status: 500 });
  }
}