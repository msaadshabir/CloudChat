'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import TopNav from '@/components/TopNav';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ProfileError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Profile error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-0 md:ml-[260px]">
        <TopNav />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="mb-6">
              <svg 
                className="w-16 h-16 mx-auto text-yellow-500 opacity-80" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                />
              </svg>
            </div>
            <h1 className="text-xl font-bold mb-2">Failed to load profile</h1>
            <p className="text-gray-400 mb-6">
              We could not load your profile information. Please try again.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={reset}
                className="vercel-button px-6 py-2"
              >
                Try again
              </button>
              <Link
                href="/"
                className="vercel-button ghost px-6 py-2 inline-flex items-center justify-center"
              >
                Go home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
