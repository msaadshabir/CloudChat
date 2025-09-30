'use client';
import { useUser } from '@clerk/nextjs';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateCloud() {
  const { user } = useUser();
  const [content, setContent] = useState('');
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!user) {
      router.push('/sign-in');
      return;
    }
    const text = content.trim();
    if (!text) return;
    if (text.length > 280) return;
    setPosting(true);
    setError(null);
    try {
      const res = await fetch('/api/tweets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: text }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || 'Failed to create cloud');
      }
      setContent('');
      // Refresh home/feed to show the new cloud at the top
      router.refresh();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Something went wrong';
      setError(msg);
    } finally {
      setPosting(false);
    }
  };

  return (
  <div className="vercel-card p-6 mb-6 rounded-[10px]">
      <div className="flex items-start space-x-4">
        {/* User Avatar Placeholder */}
        <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white font-medium text-lg">
            {user?.firstName?.[0] || user?.username?.[0] || 'U'}
          </span>
        </div>

        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
            placeholder="Start a cloud..."
            className="w-full bg-transparent border-0 resize-none text-white placeholder-gray-400 text-lg focus:outline-none focus:ring-0 min-h-[120px] pr-1"
            style={{ fontSize: '18px', lineHeight: '24px' }}
          />

          <div className="flex items-center justify-between pt-4 border-t border-[color:var(--border)]">
            <div className="flex items-center space-x-4 text-sm text-white/60">
              <span>{content.length}/280</span>
              {!user && <span className="text-white/70">Sign in to post</span>}
              {error && <span className="text-red-400">{error}</span>}
            </div>

            <button
              onClick={handleSubmit}
              disabled={!content.trim() || content.length > 280 || !user || posting}
              className="vercel-button px-5 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {posting ? 'Posting…' : 'Create Cloud'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}