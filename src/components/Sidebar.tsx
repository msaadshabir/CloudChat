'use client';

import { useUser, UserButton } from '@clerk/nextjs';
import { Home, Search, Bell, User, Plus } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Sidebar() {
  const { user } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { icon: Home, label: 'Home', href: '/', isProtected: false },
    { icon: Search, label: 'Search', href: '/search', isProtected: false },
    { icon: Bell, label: 'Activity', href: '/activity', isProtected: true },
    { icon: Plus, label: 'Create Cloud', href: '/compose', isProtected: true },
    { icon: User, label: 'Profile', href: '/profile', isProtected: true },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <div
      className="vc-sidebar h-screen fixed left-0 top-0 pb-16 hidden md:flex"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)' }}
    >
      {/* Logo */}
      <div className="p-5 border-b border-[color:var(--border)]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white rounded-[10px] flex items-center justify-center">
            <span className="text-black font-bold text-base">C</span>
          </div>
          <h1 className="text-sm text-white/80">CloudChat</h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3">
        <ul className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  onClick={(e) => {
                    if (item.isProtected && !user) {
                      e.preventDefault();
                      router.push('/sign-in');
                    }
                  }}
                  className={`vc-item ${active ? 'active' : ''} w-full`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-[color:var(--border)] mb-12">
        {user ? (
          <div className="flex items-center gap-3 p-2 rounded-[10px] bg-[color:var(--panel)] border border-[color:var(--border)]">
            <div className="scale-110 origin-left">
              <UserButton afterSignOutUrl="/" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 whitespace-nowrap min-w-0">
                <span className="text-[12px] text-white/60 truncate max-w-[120px]">@{user.username}</span>
                <span className="text-white text-sm truncate max-w-[140px]">
                  {user.firstName || user.username}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              href="/sign-in"
              className="vercel-button inline-flex items-center justify-center py-2 px-4 shrink-0"
            >
              Sign In
            </Link>
            <span className="text-white/60 text-xs whitespace-nowrap">Not signed in</span>
          </div>
        )}
      </div>
    </div>
  );
}