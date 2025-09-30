'use client';

import { format } from 'date-fns';
import { shortRelative } from '@/lib/time';
import { Heart, MessageCircle, Repeat } from 'lucide-react';
import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

interface Tweet {
  id: string;
  content: string;
  author: { id?: string; name: string; username?: string | null; image: string | null };
  createdAt: Date;
  likes: number;
  replies: number;
  retweets?: number;
}

export default function TweetCard({ tweet }: { tweet: Tweet }) {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [likeCount, setLikeCount] = useState(tweet.likes);
  const [replyCount, setReplyCount] = useState(tweet.replies);
  const [liked, setLiked] = useState(false);
  const [retweetCount, setRetweetCount] = useState(tweet.retweets ?? 0);
  const [retweeted, setRetweeted] = useState(false);
  const [commenting, setCommenting] = useState(false);
  const [comment, setComment] = useState('');
  const [likePending, setLikePending] = useState(false);
  const [retweetPending, setRetweetPending] = useState(false);
  const [replyPending, setReplyPending] = useState(false);

  const handleAuthRequired = () => {
    if (!isLoaded) return true; // wait until Clerk is ready
    if (!isSignedIn) {
      router.push('/sign-in');
      return true;
    }
    return false;
  };

  const handleReply = async () => {
    if (handleAuthRequired()) return;
    if (!commenting) {
      setCommenting(true);
      return;
    }
    const text = comment.trim();
    if (!text) return;
    try {
      setReplyPending(true);
      const res = await fetch('/api/replies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tweetId: tweet.id, content: text }),
      });
      if (!res.ok) {
        console.error('Reply failed', await res.text());
        return;
      }
      const data = await res.json();
      setReplyCount(typeof data.replies === 'number' ? data.replies : replyCount + 1);
      setComment('');
      setCommenting(false);
    } catch (e) {
      console.error('Reply error', e);
    } finally {
      setReplyPending(false);
    }
  };

  const handleRetweet = async () => {
    if (handleAuthRequired()) return;
    try {
      setRetweetPending(true);
      const res = await fetch('/api/retweets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tweetId: tweet.id }),
      });
      if (!res.ok) {
        console.error('Retweet failed', await res.text());
        return;
      }
      const data = await res.json();
      setRetweeted(Boolean(data.retweeted));
      if (typeof data.retweets === 'number') setRetweetCount(data.retweets);
    } catch (e) {
      console.error('Retweet error', e);
    } finally {
      setRetweetPending(false);
    }
  };

  const handleLike = async () => {
    if (handleAuthRequired()) return;
    try {
      setLikePending(true);
      const res = await fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tweetId: tweet.id }),
      });
      if (!res.ok) {
        console.error('Like failed', await res.text());
        return;
      }
      const data = await res.json();
      if (typeof data.likes === 'number') setLikeCount(data.likes);
      if (typeof data.liked === 'boolean') setLiked(data.liked);
    } catch (e) {
      console.error('Like error', e);
    } finally {
      setLikePending(false);
    }
  };

  return (
  <div className="vercel-card p-6 rounded-[10px] hover:bg-[color:var(--panel-2)]/50 transition-colors">
      <div className="flex space-x-4">
        {/* User Avatar */}
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center flex-shrink-0">
          {tweet.author.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={tweet.author.image} alt={tweet.author.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-white font-medium">
              {tweet.author.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          {/* User Info */}
          <div className="flex items-center gap-2 mb-3 min-w-0">
            <h3 className="font-semibold text-white truncate max-w-[40%]">{tweet.author.name}</h3>
            {tweet.author.username && (
              <span className="text-gray-400 text-sm truncate max-w-[30%]">@{tweet.author.username}</span>
            )}
            <span className="text-gray-500 text-sm">·</span>
            <span className="text-gray-400 text-sm whitespace-nowrap" title={format(new Date(tweet.createdAt), 'PPpp')}>
              {shortRelative(tweet.createdAt)}
            </span>
          </div>

          {/* Cloud Content */}
          <div className="text-white text-base leading-relaxed mb-5 whitespace-pre-wrap break-words">
            {tweet.content}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between max-w-md pt-4 border-t border-[color:var(--border)]">
            <button onClick={handleReply} disabled={replyPending} className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors group disabled:opacity-50" aria-label="Reply">
              <div className="p-2 rounded-full group-hover:bg-blue-400/10 transition-colors">
                <MessageCircle className="w-5 h-5" />
              </div>
              <span className="text-sm">{replyCount}</span>
            </button>

            <button onClick={handleRetweet} disabled={retweetPending} className="flex items-center space-x-2 text-gray-400 hover:text-green-400 transition-colors group disabled:opacity-50" aria-label="Retweet">
              <div className="p-2 rounded-full group-hover:bg-green-400/10 transition-colors">
                <Repeat className={`w-5 h-5 ${retweeted ? 'text-green-400' : ''}`} />
              </div>
              <span className="text-sm">{retweetCount}</span>
            </button>

            <button onClick={handleLike} disabled={likePending} className="flex items-center space-x-2 text-gray-400 hover:text-red-400 transition-colors group disabled:opacity-50" aria-label="Like">
              <div className="p-2 rounded-full group-hover:bg-red-400/10 transition-colors">
                <Heart className="w-5 h-5" fill={liked ? 'currentColor' : 'none'} />
              </div>
              <span className="text-sm">{likeCount}</span>
            </button>
          </div>

          {commenting && (
            <div className="mt-3">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a comment…"
                className="w-full bg-transparent border border-[color:var(--border)] rounded-md px-3 py-2 text-sm"
                maxLength={280}
              />
              <div className="flex justify-end mt-2">
                <button onClick={handleReply} disabled={replyPending} className="vercel-button px-3 py-1 text-sm disabled:opacity-50">{replyPending ? 'Posting…' : 'Post'}</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}