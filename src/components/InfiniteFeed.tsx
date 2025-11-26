'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import TweetCard from './TweetCard';
import { FeedSkeleton } from './TweetCardSkeleton';

interface Tweet {
  id: string;
  content: string;
  author: { id?: string; name: string; username?: string | null; image: string | null };
  createdAt: Date;
  likes: number;
  replies: number;
  retweets?: number;
  isLiked?: boolean;
  isRetweeted?: boolean;
}

interface InfiniteFeedProps {
  initialTweets: Tweet[];
  initialCursor: string | null;
  initialHasMore: boolean;
}

export default function InfiniteFeed({ initialTweets, initialCursor, initialHasMore }: InfiniteFeedProps) {
  const [tweets, setTweets] = useState<Tweet[]>(initialTweets);
  const [cursor, setCursor] = useState<string | null>(initialCursor);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore || !cursor) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`/api/tweets?cursor=${encodeURIComponent(cursor)}&limit=20`);
      if (!res.ok) {
        throw new Error('Failed to load more clouds');
      }
      
      const data = await res.json();
      
      setTweets(prev => [...prev, ...data.tweets]);
      setCursor(data.nextCursor);
      setHasMore(data.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, cursor]);

  useEffect(() => {
    // Reset state when initial data changes (e.g., after creating a new tweet)
    setTweets(initialTweets);
    setCursor(initialCursor);
    setHasMore(initialHasMore);
  }, [initialTweets, initialCursor, initialHasMore]);

  useEffect(() => {
    // Set up intersection observer for infinite scroll
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loading, loadMore]);

  if (tweets.length === 0) {
    return (
      <div className="text-center vercel-card px-12 py-16">
        <div className="text-white/50 mb-4">
          <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium mb-2">No clouds yet</h3>
        <p className="text-white/50 max-w-md mx-auto">Be the first to create a cloud and start the conversation.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tweets.map(tweet => (
        <TweetCard key={tweet.id} tweet={tweet} />
      ))}
      
      {/* Load more trigger */}
      <div ref={loadMoreRef} className="py-4">
        {loading && <FeedSkeleton count={2} />}
        
        {error && (
          <div className="text-center py-4">
            <p className="text-red-400 text-sm mb-2">{error}</p>
            <button 
              onClick={loadMore}
              className="vercel-button px-4 py-2 text-sm"
            >
              Try again
            </button>
          </div>
        )}
        
        {!hasMore && tweets.length > 0 && (
          <p className="text-center text-white/40 text-sm py-4">
            You have reached the end
          </p>
        )}
      </div>
    </div>
  );
}
