'use client';
import { useUser } from '@clerk/nextjs';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateTweet() {
  const { user } = useUser();
  const [content, setContent] = useState('');
  const router = useRouter();

  const handleSubmit = async () => {
    if (!user) {
      router.push('/sign-in');
      return;
    }

    // TODO: Implement tweet creation API
    console.log('Creating tweet for user:', user.id);
  };

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 mb-8 backdrop-blur-sm">
      <div className="flex items-start space-x-4">
        {/* User Avatar Placeholder */}
        <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white font-medium text-lg">
            {user?.firstName?.[0] || user?.username?.[0] || 'U'}
          </span>
        </div>

        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
            placeholder="What's happening?"
            className="w-full bg-transparent border-0 resize-none text-white placeholder-gray-400 text-lg focus:outline-none focus:ring-0 min-h-[120px]"
            style={{ fontSize: '18px', lineHeight: '24px' }}
          />

          <div className="flex items-center justify-between pt-4 border-t border-gray-800">
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>{content.length}/280</span>
              {!user && <span className="text-yellow-400">Sign in to post</span>}
            </div>

            <button
              onClick={handleSubmit}
              disabled={!content.trim() || !user}
              className="px-6 py-2 bg-white text-black font-medium rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}