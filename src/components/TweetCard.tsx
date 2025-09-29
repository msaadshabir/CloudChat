import { format } from 'date-fns';
import { Heart, MessageCircle, Repeat, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Tweet {
  id: string;
  content: string;
  author: { name: string; image: string | null };
  createdAt: Date;
  likes: number;
  replies: number;
}

export default function TweetCard({ tweet }: { tweet: Tweet }) {
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
            <Button variant="ghost" size="sm">
              <MessageCircle className="w-5 h-5 mr-1" />
              {tweet.replies}
            </Button>
            <Button variant="ghost" size="sm">
              <Repeat className="w-5 h-5 mr-1" />
            </Button>
            <Button variant="ghost" size="sm">
              <Heart className="w-5 h-5 mr-1" />
              {tweet.likes}
            </Button>
            <Button variant="ghost" size="sm">
              <Share className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}