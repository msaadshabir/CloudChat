'use client';

import { useRealtime } from '@/lib/hooks/useRealtime';
import { useRouter } from 'next/navigation';

export default function NewTweetsBanner() {
  const router = useRouter();
  const { newTweetsCount, clearNewTweetsCount } = useRealtime({
    enabled: true
  });

  if (newTweetsCount === 0) {
    return null;
  }

  const handleClick = () => {
    clearNewTweetsCount();
    router.refresh();
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={handleClick}
      className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 
                 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full 
                 shadow-lg transition-all duration-200 hover:scale-105
                 flex items-center gap-2 text-sm font-medium"
    >
      <svg 
        className="w-4 h-4" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M5 10l7-7m0 0l7 7m-7-7v18" 
        />
      </svg>
      {newTweetsCount} new {newTweetsCount === 1 ? 'cloud' : 'clouds'}
    </button>
  );
}
