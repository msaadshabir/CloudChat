'use client';

export default function TweetCardSkeleton() {
  return (
    <div className="vercel-card p-6 rounded-[10px] animate-pulse">
      <div className="flex space-x-4">
        {/* Avatar skeleton */}
        <div className="w-12 h-12 rounded-full bg-gray-700 flex-shrink-0" />

        <div className="flex-1 min-w-0">
          {/* User info skeleton */}
          <div className="flex items-center gap-2 mb-3">
            <div className="h-4 w-24 bg-gray-700 rounded" />
            <div className="h-3 w-16 bg-gray-800 rounded" />
            <div className="h-3 w-8 bg-gray-800 rounded" />
          </div>

          {/* Content skeleton */}
          <div className="space-y-2 mb-5">
            <div className="h-4 w-full bg-gray-700 rounded" />
            <div className="h-4 w-3/4 bg-gray-700 rounded" />
          </div>

          {/* Action buttons skeleton */}
          <div className="flex items-center justify-between max-w-md pt-4 border-t border-[color:var(--border)]">
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-full bg-gray-800" />
              <div className="h-3 w-4 bg-gray-800 rounded" />
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-full bg-gray-800" />
              <div className="h-3 w-4 bg-gray-800 rounded" />
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-full bg-gray-800" />
              <div className="h-3 w-4 bg-gray-800 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FeedSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <TweetCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function UserCardSkeleton() {
  return (
    <div className="vercel-card p-6 rounded-[10px] flex items-center gap-4 animate-pulse">
      <div className="w-12 h-12 bg-gray-700 rounded-full flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="h-4 w-32 bg-gray-700 rounded mb-2" />
        <div className="h-3 w-20 bg-gray-800 rounded" />
      </div>
    </div>
  );
}

export function UserListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <UserCardSkeleton key={i} />
      ))}
    </div>
  );
}
