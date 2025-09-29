'use client';
import { useUser } from '@clerk/nextjs';
import { useState } from 'react';

export default function CreateTweet() {
  const { user } = useUser();
  const [content, setContent] = useState('');

  const handleSubmit = async () => {
    // TODO: Implement tweet creation API
  };

  return (
    <div className="border-b p-4">
      <textarea
        value={content}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
        placeholder="What's happening?"
        className="w-full p-2 border rounded mb-2 min-h-[100px] resize-none"
      />
      <button
        onClick={handleSubmit}
        disabled={!content.trim()}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        Tweet
      </button>
    </div>
  );
}