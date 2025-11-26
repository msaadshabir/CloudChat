import { getDb } from '@/lib/db';
import { tweets, likes, users, retweets, replies } from '@/lib/db/schema';
import { auth } from '@clerk/nextjs/server';
import { eq, count, desc, lt, and, inArray } from 'drizzle-orm';
import { NextResponse, NextRequest } from 'next/server';
import { containsBannedLanguage, getModerationErrorMessage } from '@/lib/moderation';
import { checkRateLimit, getRateLimitHeaders, RateLimitConfigs } from '@/lib/api/rateLimit';
import { ErrorResponses } from '@/lib/api/errors';
import { createTweetSchema, validateInput } from '@/lib/validations/schemas';

const DEFAULT_PAGE_SIZE = 20;

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return ErrorResponses.unauthorized();

  // Rate limit write operations
  const rateLimitResult = checkRateLimit(`tweets:write:${userId}`, RateLimitConfigs.write);
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait before posting again.' },
      { status: 429, headers: getRateLimitHeaders(rateLimitResult) }
    );
  }

  const body = await request.json().catch(() => null);
  const validation = validateInput(createTweetSchema, body);
  
  if (!validation.success) {
    return ErrorResponses.validationError(validation.errors);
  }
  
  const { content, parentId } = validation.data;
  
  if (containsBannedLanguage(content)) {
    return ErrorResponses.badRequest(getModerationErrorMessage());
  }
  
  try {
    const db = await getDb();
    const [newTweet] = await db
      .insert(tweets)
      .values({ 
        content, 
        authorId: userId,
        parentId: parentId || null
      })
      .returning() as { id: string; content: string; authorId: string; parentId: string | null; createdAt: Date }[];
    
    return NextResponse.json(newTweet, { headers: getRateLimitHeaders(rateLimitResult) });
  } catch {
    return ErrorResponses.serverError('Failed to create cloud');
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get('cursor');
    const limitParam = searchParams.get('limit');
    const limit = Math.min(Math.max(1, parseInt(limitParam || '', 10) || DEFAULT_PAGE_SIZE), 50);

    const { userId } = await auth();
    const db = await getDb();

    // Build the where clause for cursor-based pagination
    let whereClause = undefined;
    if (cursor) {
      const cursorDate = new Date(cursor);
      if (!isNaN(cursorDate.getTime())) {
        whereClause = lt(tweets.createdAt, cursorDate);
      }
    }

    // Fetch tweets with counts
    const tweetData = await db
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
      .where(whereClause)
      .groupBy(tweets.id, users.id)
      .orderBy(desc(tweets.createdAt))
      .limit(limit + 1); // Fetch one extra to check if there's more

    // Determine if there are more results
    const hasMore = tweetData.length > limit;
    const results = hasMore ? tweetData.slice(0, limit) : tweetData;
    const nextCursor = hasMore && results.length > 0 
      ? results[results.length - 1].createdAt?.toISOString() 
      : null;

    // Fetch reply and retweet counts for all tweets in one query
    const tweetIds = results.map(t => t.id);
    
    let replyCounts: Record<string, number> = {};
    let retweetCounts: Record<string, number> = {};
    let userLikes: Set<string> = new Set();
    let userRetweets: Set<string> = new Set();

    if (tweetIds.length > 0) {
      // Get reply counts
      const replyResults = await db
        .select({ tweet_id: replies.tweetId, count: count() })
        .from(replies)
        .where(inArray(replies.tweetId, tweetIds))
        .groupBy(replies.tweetId) as Array<{ tweet_id: string | null; count: number }>;
      replyCounts = Object.fromEntries(replyResults.filter(r => r.tweet_id).map(r => [r.tweet_id!, r.count]));

      // Get retweet counts
      const retweetResults = await db
        .select({ tweet_id: retweets.tweetId, count: count() })
        .from(retweets)
        .where(inArray(retweets.tweetId, tweetIds))
        .groupBy(retweets.tweetId) as Array<{ tweet_id: string | null; count: number }>;
      retweetCounts = Object.fromEntries(retweetResults.filter(r => r.tweet_id).map(r => [r.tweet_id!, r.count]));

      // Get user's likes and retweets for this batch
      if (userId) {
        const userLikeResults = await db
          .select({ tweetId: likes.tweetId })
          .from(likes)
          .where(and(eq(likes.userId, userId), inArray(likes.tweetId, tweetIds)));
        userLikes = new Set(userLikeResults.map(l => l.tweetId!));

        const userRetweetResults = await db
          .select({ tweetId: retweets.tweetId })
          .from(retweets)
          .where(and(eq(retweets.userId, userId), inArray(retweets.tweetId, tweetIds)));
        userRetweets = new Set(userRetweetResults.map(r => r.tweetId!));
      }
    }

    // Format results with all counts and user state
    const formattedResults = results.map(tweet => ({
      id: tweet.id,
      content: tweet.content,
      createdAt: tweet.createdAt,
      author: tweet.author,
      likes: Number(tweet.likes),
      replies: replyCounts[tweet.id] || 0,
      retweets: retweetCounts[tweet.id] || 0,
      isLiked: userLikes.has(tweet.id),
      isRetweeted: userRetweets.has(tweet.id)
    }));

    return NextResponse.json({
      tweets: formattedResults,
      nextCursor,
      hasMore
    });
  } catch (error) {
    console.error('Failed to fetch clouds:', error);
    return NextResponse.json({ error: 'Failed to fetch clouds' }, { status: 500 });
  }
}