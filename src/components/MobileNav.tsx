'use client';

import { useUser, UserButton } from '@clerk/nextjs';
import { Home, Search, Bell, User, Plus } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function MobileNav() {
  const { user } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { icon: Home, label: 'Home', href: '/', isProtected: false },
    { icon: Search, label: 'Search', href: '/search', isProtected: false },
    { icon: Plus, label: 'Create', href: '/compose', isProtected: true },
    { icon: Bell, label: 'Activity', href: '/activity', isProtected: true },
    { icon: User, label: 'Profile', href: '/profile', isProtected: true },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-[color:var(--border)] pb-safe">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          
          // For profile, show user button if signed in
          if (item.href === '/profile' && user) {
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
                  active ? 'text-white' : 'text-gray-500'
                }`}
              >
                <div className="w-6 h-6 rounded-full overflow-hidden">
                  <UserButton 
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: 'w-6 h-6'
                      }
                    }}
                  />
                </div>
              </Link>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={(e) => {
                if (item.isProtected && !user) {
                  e.preventDefault();
                  router.push('/sign-in');
                }
              }}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors min-w-[48px] ${
                active 
                  ? 'text-white bg-[color:var(--panel)]' 
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Icon className={`w-6 h-6 ${item.href === '/compose' ? 'text-blue-500' : ''}`} />
              <span className="text-[10px] mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
