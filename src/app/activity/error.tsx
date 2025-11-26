'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import TopNav from '@/components/TopNav';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ActivityError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Activity error:', error);
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
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
                />
              </svg>
            </div>
            <h1 className="text-xl font-bold mb-2">Failed to load activity</h1>
            <p className="text-gray-400 mb-6">
              We could not load your notifications. Please try again.
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
