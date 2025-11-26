'use client';

import { useUser, SignInButton } from '@clerk/nextjs';
import Link from 'next/link';

export default function TopNav() {
  const { user, isLoaded } = useUser();

  return (
    <div className="vc-nav">
      <div className="vc-nav-inner">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-[6px] bg-white flex items-center justify-center">
              <span className="text-black font-bold text-xs">C</span>
            </div>
            <span className="text-sm text-white/80">CloudChat</span>
          </Link>
        </div>
        
        {/* Mobile sign-in button */}
        <div className="md:hidden">
          {isLoaded && !user && (
            <SignInButton mode="modal">
              <button className="vercel-button px-3 py-1.5 text-sm">
                Sign In
              </button>
            </SignInButton>
          )}
        </div>
      </div>
    </div>
  );
}