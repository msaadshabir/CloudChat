import { db } from '@/lib/db';
import { tweets, likes } from '@/lib/db/schema';
import { auth } from '@clerk/nextjs/server';
import { eq, count } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { content, parentId } = await request.json();
  
  try {
    const [newTweet] = await db
      .insert(tweets)
      .values({ 
        content, 
        authorId: userId,
        parentId: parentId || null
      })
      .returning();
    
    return NextResponse.json(newTweet);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create tweet' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const tweetData = await db
      .select({
        id: tweets.id,
        content: tweets.content,
        createdAt: tweets.createdAt,
        author: {
          name: users.name,
          image: users.image
        },
        likes: count(likes.id)
      })
      .from(tweets)
      .leftJoin(users, eq(tweets.authorId, users.id))
      .leftJoin(likes, eq(tweets.id, likes.tweetId))
      .groupBy(tweets.id, users.id)
      .orderBy(tweets.createdAt, 'desc')
      .limit(50);
    
    return NextResponse.json(tweetData);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tweets' }, { status: 500 });
  }
}