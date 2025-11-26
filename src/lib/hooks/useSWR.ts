'use client';

import useSWR, { SWRConfiguration } from 'swr';

// Default fetcher for SWR
const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.');
    throw error;
  }
  return res.json();
};

// SWR configuration defaults
const defaultConfig: SWRConfiguration = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  dedupingInterval: 2000,
  errorRetryCount: 3,
};

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

interface TweetFeedResponse {
  tweets: Tweet[];
  nextCursor: string | null;
  hasMore: boolean;
}

// Hook for fetching tweet feed with caching
export function useTweetFeed(cursor?: string, limit: number = 20) {
  const url = cursor 
    ? `/api/tweets?cursor=${encodeURIComponent(cursor)}&limit=${limit}`
    : `/api/tweets?limit=${limit}`;
  
  return useSWR<TweetFeedResponse>(
    url,
    fetcher,
    {
      ...defaultConfig,
      revalidateOnFocus: true, // Revalidate feed on focus
      refreshInterval: 60000, // Refresh every minute
    }
  );
}

// Hook for user profile data
interface UserProfile {
  id: string;
  name: string | null;
  username: string | null;
  image: string | null;
  bio: string | null;
}

export function useProfile() {
  return useSWR<UserProfile>(
    '/api/profile',
    fetcher,
    {
      ...defaultConfig,
      revalidateOnFocus: true,
    }
  );
}

// Mutate helpers for optimistic updates
export { mutate } from 'swr';

// Custom fetcher with error handling
export async function fetchWithError<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Request failed');
  }
  return res.json();
}

// POST request with optimistic update support
export async function postWithOptimism<T>(
  url: string, 
  data: unknown
): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Request failed');
  }
  
  return res.json();
}
