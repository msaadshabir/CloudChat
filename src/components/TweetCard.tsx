'use client';

import { format } from 'date-fns';
import { Heart, MessageCircle, Repeat, Share } from 'lucide-react';
import { useUser } from '@clerk/nextjs';

interface Tweet {
  id: string;
  content: string;
  author: { name: string; image: string | null };
  createdAt: Date;
  likes: number;
  replies: number;
}

export default function TweetCard({ tweet }: { tweet: Tweet }) {
  const { user } = useUser();

  return (
    <div className="p-4 border-b border-gray-600 hover:bg-gray-900 bg-black transition-colors">
      <div className="flex gap-3">
        {/* Terminal-style avatar placeholder */}
        <div className="w-10 h-10 border border-gray-600 bg-black flex items-center justify-center text-green-400 font-mono text-xs flex-shrink-0">
          [USER]
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-green-400 font-mono font-bold text-sm">
              {tweet.author.name}
            </span>
            <span className="text-gray-500 text-xs font-mono">
              @{tweet.author.name.toLowerCase().replace(/\s+/g, '')}
            </span>
            <span className="text-gray-600 text-xs font-mono">
              {format(new Date(tweet.createdAt), 'yyyy-MM-dd HH:mm')}
            </span>
          </div>
          <div className="text-green-400 font-mono text-sm leading-relaxed mb-3 border-l-2 border-gray-600 pl-3">
            {tweet.content}
          </div>
          <div className="flex justify-between max-w-md border-t border-gray-700 pt-3">
            <button
              disabled={!user}
              className="flex items-center text-gray-500 hover:text-green-400 disabled:opacity-50 disabled:cursor-not-allowed font-mono text-xs transition-colors"
            >
              <MessageCircle className="w-4 h-4 mr-1" />
              {tweet.replies}
            </button>
            <button
              disabled={!user}
              className="flex items-center text-gray-500 hover:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed font-mono text-xs transition-colors"
            >
              <Repeat className="w-4 h-4 mr-1" />
              0
            </button>
            <button
              disabled={!user}
              className="flex items-center text-gray-500 hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed font-mono text-xs transition-colors"
            >
              <Heart className="w-4 h-4 mr-1" />
              {tweet.likes}
            </button>
            <button
              disabled={!user}
              className="flex items-center text-gray-500 hover:text-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed font-mono text-xs transition-colors"
            >
              <Share className="w-4 h-4 mr-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}