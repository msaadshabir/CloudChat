import { auth } from '@clerk/nextjs/server';
import { getDb } from '@/lib/db';
import { likes, tweets, users } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';
import Sidebar from '@/components/Sidebar';
import TopNav from '@/components/TopNav';
import { shortRelative } from '@/lib/time';

export const dynamic = 'force-dynamic';

export default async function ActivityPage() {
  const { userId } = await auth();
  const db = await getDb();

  // Likes received on your clouds
  const received = await db
    .select({
      id: likes.id,
      likedAt: likes.createdAt,
      tweetId: tweets.id,
      tweetContent: tweets.content,
      likerId: users.id,
      likerName: users.name,
      likerUsername: users.username,
    })
    .from(likes)
    .leftJoin(tweets, eq(likes.tweetId, tweets.id))
    .leftJoin(users, eq(likes.userId, users.id))
    .where(eq(tweets.authorId, userId!))
    .orderBy(desc(likes.createdAt))
    .limit(20);

  // Your recent likes
  const yours = await db
    .select({
      id: likes.id,
      likedAt: likes.createdAt,
      tweetId: tweets.id,
      tweetContent: tweets.content,
    })
    .from(likes)
    .leftJoin(tweets, eq(likes.tweetId, tweets.id))
    .where(eq(likes.userId, userId!))
    .orderBy(desc(likes.createdAt))
    .limit(20);

  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-[260px]">
        <TopNav />
        <div className="flex-1 max-w-2xl mx-auto px-6 py-10 mt-6">
          {/* Header */}
          <div className="mb-6 mt-2">
            <div className="flex items-center gap-2 mb-2">
              <span className="vc-badge">Activity</span>
            </div>
            <h2 className="text-xl font-semibold">Notifications</h2>
            <p className="text-white/60 text-sm">See what’s happened on your clouds and what you’ve engaged with</p>
          </div>

          {/* Likes received */}
          <section className="mb-8">
            <h3 className="text-sm text-white/70 mb-3">Likes on your clouds</h3>
            {received.length === 0 ? (
              <div className="vercel-card px-6 py-8 rounded-[10px] text-white/60 text-sm">No likes yet — share a cloud to get the conversation started.</div>
            ) : (
              <ul className="space-y-4">
                {received.map((it) => (
                  <li key={it.id} className="vercel-card p-6 rounded-[10px] flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-medium">{(it.likerName || it.likerUsername || 'U')?.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm">
                        <span className="text-white/80">{it.likerName || it.likerUsername || 'Someone'}</span> liked your cloud
                        <span className="text-white/40"> · {shortRelative(it.likedAt as any)}</span>
                      </p>
                      <p className="text-white/60 text-sm mt-1 truncate">“{it.tweetContent || 'Deleted cloud'}”</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Your likes */}
          <section>
            <h3 className="text-sm text-white/70 mb-3">Your recent likes</h3>
            {yours.length === 0 ? (
              <div className="vercel-card px-6 py-8 rounded-[10px] text-white/60 text-sm">You haven’t liked any clouds yet.</div>
            ) : (
              <ul className="space-y-4">
                {yours.map((it) => (
                  <li key={it.id} className="vercel-card p-6 rounded-[10px]">
                    <p className="text-white/70 text-sm">You liked <span className="text-white/40">· {shortRelative(it.likedAt as any)}</span></p>
                    <p className="text-white text-sm mt-1 truncate">“{it.tweetContent || 'Deleted cloud'}”</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
