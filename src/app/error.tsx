'use client';

import { useEffect } from 'react';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Page error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
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
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
        <p className="text-gray-400 mb-6">
          We encountered an error while loading this page. Please try again.
        </p>
        {error.digest && (
          <p className="text-gray-500 text-xs mb-4">
            Error ID: {error.digest}
          </p>
        )}
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
  );
}
