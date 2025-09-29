'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';

export default function CreateTweet() {
  const { user } = useUser();
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    // TODO: Implement tweet creation logic
    console.log('Creating tweet:', { content, authorId: user?.id });

    setContent('');
  };

  if (!user) {
    return <div>Please sign in to create a tweet.</div>;
  }

  return (
    <div className="border-b border-gray-200 p-4">
      <form onSubmit={handleSubmit} className="flex space-x-4">
        <img
          src={user.imageUrl}
          alt={user.username || 'User'}
          className="w-12 h-12 rounded-full"
        />
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's happening?"
            className="w-full p-2 border-none resize-none focus:outline-none text-xl"
            rows={3}
          />
          <div className="flex justify-between items-center mt-4">
            <div></div>
            <button
              type="submit"
              disabled={!content.trim()}
              className="bg-blue-500 text-white px-4 py-2 rounded-full font-bold hover:bg-blue-600 disabled:opacity-50"
            >
              Tweet
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}