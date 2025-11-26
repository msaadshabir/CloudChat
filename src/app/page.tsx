// src/app/page.tsx
import { auth } from '@clerk/nextjs/server';
import { getDb } from '@/lib/db';
import { tweets, users as usersTable, likes, retweets, replies } from '@/lib/db/schema';
import { eq, count, desc, and, inArray } from 'drizzle-orm';
import CreateCloud from '@/components/CreateTweet';
import InfiniteFeed from '@/components/InfiniteFeed';
import Sidebar from '@/components/Sidebar';
import TopNav from '@/components/TopNav';
import NewTweetsBanner from '@/components/NewTweetsBanner';

const PAGE_SIZE = 20;

export default async function HomePage() {
  const { userId } = await auth();
  const db = await getDb();
  if (userId) {
    const [row] = await db
      .select({ username: usersTable.username, name: usersTable.name })
      .from(usersTable)
      .where(eq(usersTable.id, userId));
    void row;
  }

  // Fetch initial tweets with author info and like counts
  const tweetData = await db
    .select({
      id: tweets.id,
      content: tweets.content,
      createdAt: tweets.createdAt,
      authorId: tweets.authorId,
      author: {
        id: usersTable.id,
        name: usersTable.name,
        image: usersTable.image,
        username: usersTable.username,
      },
      likeCount: count(likes.id),
    })
    .from(tweets)
    .leftJoin(usersTable, eq(tweets.authorId, usersTable.id))
    .leftJoin(likes, eq(tweets.id, likes.tweetId))
    .groupBy(tweets.id, usersTable.id)
    .orderBy(desc(tweets.createdAt))
    .limit(PAGE_SIZE + 1);

  // Check if there are more results
  const hasMore = tweetData.length > PAGE_SIZE;
  const results = hasMore ? tweetData.slice(0, PAGE_SIZE) : tweetData;
  const nextCursor = hasMore && results.length > 0 
    ? results[results.length - 1].createdAt?.toISOString() || null
    : null;

  // Fetch reply and retweet counts for initial tweets
  const tweetIds = results.map(t => t.id);
  
  let replyCounts: Record<string, number> = {};
  let retweetCounts: Record<string, number> = {};
  let userLikes: Set<string> = new Set();
  let userRetweets: Set<string> = new Set();

  if (tweetIds.length > 0) {
    const replyResults = await db
      .select({ tweet_id: replies.tweetId, count: count() })
      .from(replies)
      .where(inArray(replies.tweetId, tweetIds))
      .groupBy(replies.tweetId) as Array<{ tweet_id: string | null; count: number }>;
    replyCounts = Object.fromEntries(replyResults.filter(r => r.tweet_id).map(r => [r.tweet_id!, r.count]));

    const retweetResults = await db
      .select({ tweet_id: retweets.tweetId, count: count() })
      .from(retweets)
      .where(inArray(retweets.tweetId, tweetIds))
      .groupBy(retweets.tweetId) as Array<{ tweet_id: string | null; count: number }>;
    retweetCounts = Object.fromEntries(retweetResults.filter(r => r.tweet_id).map(r => [r.tweet_id!, r.count]));

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

  // Format data for InfiniteFeed
  const tweetsWithMetadata = results
    .filter(tweet => tweet.author)
    .map(tweet => ({
      id: tweet.id,
      content: tweet.content,
      createdAt: tweet.createdAt || new Date(),
      author: {
        id: tweet.author!.id,
        name: tweet.author!.name || 'Anonymous',
        image: tweet.author!.image || null,
        username: tweet.author!.username || 'user',
      },
      likes: Number(tweet.likeCount),
      replies: replyCounts[tweet.id] || 0,
      retweets: retweetCounts[tweet.id] || 0,
      isLiked: userLikes.has(tweet.id),
      isRetweeted: userRetweets.has(tweet.id),
    }));

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Left Sidebar */}
      <Sidebar />

      {/* New Tweets Banner */}
      <NewTweetsBanner />

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-0 md:ml-[260px]">
  {/* Top Navigation */}
  <TopNav />

        {/* Feed Content */}
        <div className="flex-1 max-w-2xl mx-auto px-4 md:px-6 py-10 mt-6 w-full">
          {/* Feed Header */}
          <div className="mb-6 mt-2">
            <div className="flex items-center gap-2 mb-2">
              <span className="vc-badge">Cloud Feed</span>
            </div>
            <h2 className="text-xl font-semibold">Home</h2>
            <p className="text-white/60 text-sm">Share your thoughts and see new clouds from your network</p>
          </div>

          {/* Create Cloud */}
          {userId && <CreateCloud />}

          {/* Cloud Feed with Infinite Scroll */}
          <InfiniteFeed 
            initialTweets={tweetsWithMetadata}
            initialCursor={nextCursor}
            initialHasMore={hasMore}
          />
        </div>
      </div>
    </div>
  );
}

// Force dynamic rendering to avoid prerendering issues with Clerk
export const dynamic = 'force-dynamic';
// Revalidate the page data every 30 seconds
export const revalidate = 30;