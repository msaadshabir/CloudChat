import { auth } from '@clerk/nextjs/server';
import Sidebar from '@/components/Sidebar';
import TopNav from '@/components/TopNav';
import ProfileImageUploader from '@/components/ProfileImageUploader';
import { getDb } from '@/lib/db';
import { tweets, users, likes } from '@/lib/db/schema';
import { count, desc, eq } from 'drizzle-orm';
import TweetCard from '@/components/TweetCard';
import { ensureUsersBioColumn } from '@/lib/db/migrations';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  await ensureUsersBioColumn();
  const { userId } = await auth();

  const db = await getDb();
  const [me] = await db
    .select({ id: users.id, name: users.name, username: users.username, image: users.image, bio: users.bio })
    .from(users)
    .where(eq(users.id, userId!));

  const myClouds = await db
    .select({
      id: tweets.id,
      content: tweets.content,
      createdAt: tweets.createdAt,
      author: {
        id: users.id,
        name: users.name,
        image: users.image,
        username: users.username,
      },
      likes: count(likes.id),
    })
    .from(tweets)
    .leftJoin(users, eq(tweets.authorId, users.id))
    .leftJoin(likes, eq(tweets.id, likes.tweetId))
    .where(eq(tweets.authorId, userId!))
    .groupBy(tweets.id, users.id)
    .orderBy(desc(tweets.createdAt));

  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-[260px]">
        <TopNav />
        <div className="flex-1 max-w-2xl mx-auto px-6 py-10 mt-6 w-full">
          {/* Header */}
          <div className="mb-6 mt-2">
            <div className="flex items-center gap-2 mb-2">
              <span className="vc-badge">Profile</span>
            </div>
            <h2 className="text-xl font-semibold">{me?.name || 'Your profile'}</h2>
            <p className="text-white/60 text-sm">@{me?.username}</p>
            {me?.bio && <p className="text-white/80 text-sm mt-3 whitespace-pre-wrap">{me.bio}</p>}
          </div>

          {/* Uploader */}
          <div className="mb-6">
            <ProfileImageUploader currentUrl={me?.image} />
          </div>

          {/* Clouds */}
          <div className="space-y-4">
            {myClouds.length === 0 ? (
              <div className="text-center vercel-card px-12 py-16">
                <h3 className="text-lg font-medium mb-2">No clouds yet</h3>
                <p className="text-white/50 max-w-md mx-auto">Start by creating your first cloud.</p>
              </div>
            ) : (
              myClouds.filter(t => t.author).map((t) => (
                <TweetCard
                  key={t.id}
                  tweet={{
                    id: t.id,
                    content: t.content,
                    createdAt: t.createdAt || new Date(),
                    author: {
                      id: t.author!.id,
                      name: t.author!.name || 'Anonymous',
                      image: t.author!.image || null,
                      username: t.author!.username || undefined,
                    },
                    likes: Number(t.likes),
                    replies: 0,
                  }}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
