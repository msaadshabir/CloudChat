import { FeedSkeleton } from '@/components/TweetCardSkeleton';

export default function HomeLoading() {
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
        <nav className="flex-1 p-3">
          <ul className="flex flex-col gap-1.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <li key={i}>
                <div className="flex items-center gap-3 p-3 rounded-lg">
                  <div className="w-5 h-5 bg-gray-700 rounded" />
                  <div className="h-4 w-16 bg-gray-700 rounded" />
                </div>
              </li>
            ))}
          </ul>
        </nav>
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

        {/* Feed Content */}
        <div className="flex-1 max-w-2xl mx-auto px-6 py-10 mt-6 w-full">
          {/* Header skeleton */}
          <div className="mb-6 mt-2">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-6 w-24 bg-gray-800 rounded-full" />
            </div>
            <div className="h-6 w-16 bg-gray-700 rounded mb-2" />
            <div className="h-4 w-64 bg-gray-800 rounded" />
          </div>

          {/* Create Cloud skeleton */}
          <div className="vercel-card p-6 mb-6 rounded-[10px] animate-pulse">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gray-700 rounded-full flex-shrink-0" />
              <div className="flex-1">
                <div className="h-24 bg-gray-800 rounded mb-4" />
                <div className="flex items-center justify-between pt-4 border-t border-[color:var(--border)]">
                  <div className="h-4 w-12 bg-gray-800 rounded" />
                  <div className="h-10 w-28 bg-gray-700 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Feed skeleton */}
          <FeedSkeleton count={5} />
        </div>
      </div>
    </div>
  );
}
