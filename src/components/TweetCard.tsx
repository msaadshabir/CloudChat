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
    <div className="p-4 border-b hover:bg-gray-50">
      <div className="flex gap-3">
        <img
          src={tweet.author.image || '/default-avatar.png'}
          alt={tweet.author.name}
          className="w-10 h-10 rounded-full"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-bold">{tweet.author.name}</span>
            <span className="text-gray-500 text-sm">
              {format(new Date(tweet.createdAt), 'MMM d')}
            </span>
          </div>
          <p className="my-2">{tweet.content}</p>
          <div className="flex justify-between max-w-md mt-4">
            <button disabled={!user} className="flex items-center text-gray-500 hover:text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
              <MessageCircle className="w-5 h-5 mr-1" />
              {tweet.replies}
            </button>
            <button disabled={!user} className="flex items-center text-gray-500 hover:text-green-500 disabled:opacity-50 disabled:cursor-not-allowed">
              <Repeat className="w-5 h-5 mr-1" />
            </button>
            <button disabled={!user} className="flex items-center text-gray-500 hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed">
              <Heart className="w-5 h-5 mr-1" />
              {tweet.likes}
            </button>
            <button disabled={!user} className="flex items-center text-gray-500 hover:text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
              <Share className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}