'use client';

import { useUser } from '@clerk/nextjs';

interface TopNavProps {
  userId: string | null;
}

export default function TopNav({ userId }: TopNavProps) {
  const { user } = useUser();

  return (
    <div className="border-b border-gray-800 bg-black/50 backdrop-blur-sm px-6 py-4 flex justify-end">
      <div className="flex items-center space-x-4">
        {user ? (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {user.firstName?.[0] || user.username?.[0] || 'U'}
              </span>
            </div>
            <div className="text-right">
              <p className="text-white font-medium text-sm">
                {user.firstName || user.username}
              </p>
              <p className="text-gray-400 text-xs">
                @{user.username}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-gray-400 text-sm">
            Not signed in
          </div>
        )}
      </div>
    </div>
  );
}