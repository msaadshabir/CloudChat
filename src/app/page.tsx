// src/app/page.tsx
import { auth } from '@clerk/nextjs/server';
import { getDb } from '@/lib/db';
import { tweets, users, likes } from '@/lib/db/schema';
import { eq, count, desc } from 'drizzle-orm';
import CreateTweet from '@/components/CreateTweet';
import TweetCard from '@/components/TweetCard';

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
    <div className="min-h-screen bg-black text-green-400 font-mono">
      {/* Terminal Header */}
      <div className="border border-gray-600 bg-black p-2 text-center">
        <div className="text-green-400 font-bold">CLOUDCHAT v1.0 - Social Terminal</div>
        <div className="text-xs text-gray-400">Connected to Neon Database | User: {userId ? 'AUTHENTICATED' : 'GUEST'}</div>
      </div>

      {/* Main Terminal Window */}
      <div className="max-w-4xl mx-auto border border-gray-600 bg-black m-4">
        {/* Header */}
        <div className="border-b border-gray-600 p-3 bg-gray-900 text-green-400 font-bold text-center">
          [HOME FEED] - {tweetsWithMetadata.length} TWEETS LOADED
        </div>

        {/* Create Tweet */}
        {userId && <CreateTweet />}

        {/* Tweet Feed */}
        <div className="divide-y divide-gray-700">
          {tweetsWithMetadata.length === 0 ? (
            <div className="text-center py-10 text-gray-500 border border-gray-600 m-4 bg-gray-900">
              <div className="text-green-400 mb-2">[SYSTEM MESSAGE]</div>
              No tweets in database. Execute &apos;CREATE TWEET&apos; to initialize feed.
            </div>
          ) : (
            tweetsWithMetadata.map(tweet => (
              <TweetCard key={tweet.id} tweet={tweet} />
            ))
          )}
        </div>

        {/* Terminal Footer */}
        <div className="border-t border-gray-600 p-2 text-center text-xs text-gray-500 bg-gray-900">
          CloudChat Terminal - Press Ctrl+C to exit | Status: ONLINE
        </div>
      </div>
    </div>
  );
}