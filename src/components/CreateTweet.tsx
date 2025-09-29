'use client';
import { useUser } from '@clerk/nextjs';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export default function CreateTweet() {
  const { user } = useUser();
  const [content, setContent] = useState('');

  const handleSubmit = async () => {
    // TODO: Implement tweet creation API
  };

  return (
    <div className="border-b p-4">
      <Textarea 
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's happening?"
        className="mb-2 min-h-[100px]"
      />
      <Button onClick={handleSubmit} disabled={!content.trim()}>
        Tweet
      </Button>
    </div>
  );
}