import { getDb } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { desc, ilike, or } from 'drizzle-orm';
import Sidebar from '@/components/Sidebar';
import TopNav from '@/components/TopNav';
import { ensureCurrentUserInDb } from '@/lib/users/ensureUser';
import SearchBar from '../../components/SearchBar';
import { ensureUsersBioColumn } from '@/lib/db/migrations';

export const dynamic = 'force-dynamic';

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  await ensureUsersBioColumn();
  await ensureCurrentUserInDb();
  const db = await getDb();
  const sp = await searchParams;
  const q = (sp?.q || '').trim();

  const baseSelect = db
    .select({
      id: users.id,
      name: users.name,
      username: users.username,
      image: users.image,
      createdAt: users.createdAt,
    })
    .from(users);

  const allUsers = await (q
    ? baseSelect
        .where(or(ilike(users.name, `%${q}%`), ilike(users.username, `%${q}%`)))
        .orderBy(desc(users.createdAt))
    : baseSelect.orderBy(desc(users.createdAt))
  );

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-0 md:ml-[260px]">
        <TopNav />

        <div className="flex-1 max-w-2xl mx-auto px-4 md:px-6 py-10 mt-6 w-full">
          {/* Header */}
          <div className="mb-6 mt-2">
            <div className="flex items-center gap-2 mb-2">
              <span className="vc-badge">Search</span>
            </div>
            <h2 className="text-xl font-semibold">{q ? `Results for “${q}”` : 'All Users'}</h2>
            <p className="text-white/60 text-sm">{q ? `Showing ${allUsers.length} result${allUsers.length === 1 ? '' : 's'}` : 'Browse everyone on CloudChat'}</p>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <SearchBar initialQuery={q} />
          </div>

          {/* Users List */}
          <div className="space-y-4">
            {allUsers.length === 0 ? (
              <div className="text-center vercel-card px-12 py-16">
                <div className="text-white/50 mb-4">
                  <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">{q ? 'No matches found' : 'No users yet'}</h3>
                <p className="text-white/50 max-w-md mx-auto">{q ? 'Try a different name or handle.' : 'New users will appear here as they sign up.'}</p>
              </div>
            ) : (
              allUsers.map((u) => (
                <div key={u.id} className="vercel-card p-6 rounded-[10px] flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-medium">
                      {(u.name || u.username || 'U').charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm truncate">{u.name || u.username || 'Unknown'}</p>
                    {u.username && (
                      <p className="text-[12px] text-white/50 truncate">@{u.username}</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
