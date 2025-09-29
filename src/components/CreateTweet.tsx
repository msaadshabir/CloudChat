'use client';
import { useUser } from '@clerk/nextjs';
import { useState } from 'react';

export default function CreateTweet() {
  const { user } = useUser();
  const [content, setContent] = useState('');

  const handleSubmit = async () => {
    if (!user) return; // User must be authenticated

    // TODO: Implement tweet creation API
    console.log('Creating tweet for user:', user.id);
  };

  return (
    <div className="border-b border-gray-600 p-4 bg-black">
      <div className="mb-2 text-green-400 text-sm">[TWEET COMPOSER]</div>
      <textarea
        value={content}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
        placeholder="> Enter your message..."
        className="w-full p-3 bg-black border border-gray-600 text-green-400 font-mono resize-none focus:border-green-400 focus:outline-none min-h-[80px]"
        style={{ fontFamily: 'Courier New, monospace' }}
      />
      <div className="flex justify-between items-center mt-3">
        <div className="text-xs text-gray-500">
          {content.length}/280 characters | Status: {user ? 'READY' : 'AUTH REQUIRED'}
        </div>
        <button
          onClick={handleSubmit}
          disabled={!content.trim() || !user}
          className="px-4 py-2 border border-gray-600 bg-black text-green-400 font-mono hover:border-green-400 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          [POST TWEET]
        </button>
      </div>
    </div>
  );
}