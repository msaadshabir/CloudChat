import { UserListSkeleton } from '@/components/TweetCardSkeleton';

export default function SearchLoading() {
  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Left Sidebar skeleton */}
      <div className="vc-sidebar h-screen fixed left-0 top-0">
        <div className="p-5 border-b border-[color:var(--border)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white rounded-[10px]" />
            <div className="h-4 w-20 bg-gray-700 rounded" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-[260px]">
        {/* Top Navigation skeleton */}
        <div className="vc-nav">
          <div className="vc-nav-inner">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-[6px] bg-gray-700" />
              <div className="h-4 w-20 bg-gray-700 rounded" />
            </div>
          </div>
        </div>

        <div className="flex-1 max-w-2xl mx-auto px-6 py-10 mt-6 w-full">
          {/* Header skeleton */}
          <div className="mb-6 mt-2 animate-pulse">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-6 w-16 bg-gray-800 rounded-full" />
            </div>
            <div className="h-6 w-32 bg-gray-700 rounded mb-2" />
            <div className="h-4 w-48 bg-gray-800 rounded" />
          </div>

          {/* Search bar skeleton */}
          <div className="mb-6 vercel-card p-2 rounded-[10px] flex items-center gap-2 animate-pulse">
            <div className="flex-1 h-10 bg-gray-800 rounded" />
            <div className="h-10 w-20 bg-gray-700 rounded-full" />
          </div>

          {/* Users list skeleton */}
          <UserListSkeleton count={5} />
        </div>
      </div>
    </div>
  );
}
