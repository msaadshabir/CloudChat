'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SearchBar({ initialQuery = '' }: { initialQuery?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(initialQuery);

  // Keep local state in sync when navigating back/forward
  useEffect(() => {
    const current = searchParams.get('q') || '';
    if (current !== value) setValue(current);
  }, [searchParams, value]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (value.trim()) {
      params.set('q', value.trim());
    } else {
      params.delete('q');
    }
    router.push(`/search?${params.toString()}`);
  };

  return (
    <form onSubmit={onSubmit} className="vercel-card p-2 rounded-[10px] flex items-center gap-2">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search by name or @handle"
        className="vercel-input flex-1 px-3 py-2 bg-transparent outline-none"
      />
      <button type="submit" className="vercel-button px-4 py-2">Search</button>
    </form>
  );
}
