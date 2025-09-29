'use client';

import { format } from 'date-fns';
import { Heart, MessageCircle, Repeat, Share } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();

  const handleAuthRequired = () => {
    if (!user) {
      router.push('/sign-in');
      return true;
    }
    return false;
  };

  const handleReply = () => {
    if (handleAuthRequired()) return;
    // TODO: Implement reply functionality
  };

  const handleRetweet = () => {
    if (handleAuthRequired()) return;
    // TODO: Implement retweet functionality
  };

  const handleLike = () => {
    if (handleAuthRequired()) return;
    // TODO: Implement like functionality
  };

  const handleShare = () => {
    if (handleAuthRequired()) return;
    // TODO: Implement share functionality
  };

  return (
    <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-6 hover:bg-gray-900/50 transition-colors backdrop-blur-sm">
      <div className="flex space-x-4">
        {/* User Avatar */}
        <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white font-medium">
            {tweet.author.name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          {/* User Info */}
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="font-semibold text-white truncate">{tweet.author.name}</h3>
            <span className="text-gray-400 text-sm">@{tweet.author.name.toLowerCase().replace(/\s+/g, '')}</span>
            <span className="text-gray-500 text-sm">·</span>
            <span className="text-gray-400 text-sm">
              {format(new Date(tweet.createdAt), 'MMM d')}
            </span>
          </div>

          {/* Tweet Content */}
          <div className="text-white text-base leading-relaxed mb-4 whitespace-pre-wrap">
            {tweet.content}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between max-w-md pt-3 border-t border-gray-800">
            <button
              onClick={handleReply}
              className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors group"
            >
              <div className="p-2 rounded-full group-hover:bg-blue-400/10 transition-colors">
                <MessageCircle className="w-5 h-5" />
              </div>
              <span className="text-sm">{tweet.replies}</span>
            </button>

            <button
              onClick={handleRetweet}
              className="flex items-center space-x-2 text-gray-400 hover:text-green-400 transition-colors group"
            >
              <div className="p-2 rounded-full group-hover:bg-green-400/10 transition-colors">
                <Repeat className="w-5 h-5" />
              </div>
              <span className="text-sm">0</span>
            </button>

            <button
              onClick={handleLike}
              className="flex items-center space-x-2 text-gray-400 hover:text-red-400 transition-colors group"
            >
              <div className="p-2 rounded-full group-hover:bg-red-400/10 transition-colors">
                <Heart className="w-5 h-5" />
              </div>
              <span className="text-sm">{tweet.likes}</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center space-x-2 text-gray-400 hover:text-gray-300 transition-colors group"
            >
              <div className="p-2 rounded-full group-hover:bg-gray-300/10 transition-colors">
                <Share className="w-5 h-5" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}