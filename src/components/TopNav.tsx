'use client';

import { useUser } from '@clerk/nextjs';

export default function TopNav() {
  const { user } = useUser();

  return (
    <div className="vc-nav">
      <div className="vc-nav-inner">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-[6px] bg-white" />
          <span className="text-sm text-white/80">CloudChat</span>
        </div>
        <div />
      </div>
    </div>
  );
}