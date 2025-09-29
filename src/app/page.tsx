// src/app/page.tsx
import { auth } from '@clerk/nextjs/server';
import { getDb } from '@/lib/db';
import { tweets, users, likes } from '@/lib/db/schema';
import { eq, count, desc } from 'drizzle-orm';
import CreateTweet from '@/components/CreateTweet';
import TweetCard from '@/components/TweetCard';
import Sidebar from '@/components/Sidebar';
import TopNav from '@/components/TopNav';

export default async function HomePage() {
  const { userId } = await auth();

  // Fetch tweets with author info and like counts
  const tweetData = await getDb()
    .select({
      id: tweets.id,
      content: tweets.content,
      createdAt: tweets.createdAt,
      authorId: tweets.authorId,
      author: {
        id: users.id,
        name: users.name,
        image: users.image,
        username: users.username,
      },
      likeCount: count(likes.id),
    })
    .from(tweets)
    .leftJoin(users, eq(tweets.authorId, users.id))
    .leftJoin(likes, eq(tweets.id, likes.tweetId))
    .groupBy(tweets.id, users.id)
    .orderBy(desc(tweets.createdAt))
    .limit(50);

  // Format data for TweetCard
  const tweetsWithMetadata = tweetData
    .filter(tweet => tweet.author) // Filter out tweets with null author
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
    replies: 0, // TODO: Add replies count
    isLiked: false, // TODO: Implement like status
  }));

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Top Navigation */}
        <TopNav userId={userId} />

        {/* Feed Content */}
        <div className="flex-1 max-w-2xl mx-auto px-6 py-8">
          {/* Feed Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Home</h2>
            <p className="text-gray-400">Discover what&apos;s happening in your network</p>
          </div>

          {/* Create Tweet */}
          {userId && <CreateTweet />}

          {/* Tweet Feed */}
          <div className="space-y-6">
            {tweetsWithMetadata.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">No posts yet</h3>
                <p className="text-gray-500">Be the first to share something with your network.</p>
              </div>
            ) : (
              tweetsWithMetadata.map(tweet => (
                <TweetCard key={tweet.id} tweet={tweet} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Force dynamic rendering to avoid prerendering issues with Clerk
export const dynamic = 'force-dynamic';