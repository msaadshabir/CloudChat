// src/app/page.tsx
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { tweets, users, likes } from '@/lib/db/schema';
import { eq, count, desc } from 'drizzle-orm';
import CreateTweet from '@/components/CreateTweet';
import TweetCard from '@/components/TweetCard';

export default async function HomePage() {
  const { userId } = await auth();

  // Fetch tweets with author info and like counts
  const tweetData = await db
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
    createdAt: tweet.createdAt,
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
    <div className="max-w-2xl mx-auto border-x">
      {/* Header */}
      <div className="border-b p-4 font-bold text-xl">Home</div>

      {/* Create Tweet */}
      {userId && <CreateTweet />}

      {/* Tweet Feed */}
      <div>
        {tweetsWithMetadata.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No tweets yet. Be the first to post!
          </div>
        ) : (
          tweetsWithMetadata.map(tweet => (
            <TweetCard key={tweet.id} tweet={tweet} />
          ))
        )}
      </div>
    </div>
  );
}