'use client';

import { useUser, UserButton } from '@clerk/nextjs';
import { Home, Search, Bell, User, Plus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Sidebar() {
  const { user } = useUser();
  const router = useRouter();

  const navItems = [
    { icon: Home, label: 'Home', href: '/', active: true, isProtected: false },
    { icon: Search, label: 'Search', href: '/search', isProtected: false },
    { icon: Bell, label: 'Activity', href: '/activity', isProtected: true },
    { icon: Plus, label: 'Create Tweet', href: '/compose', isProtected: true },
    { icon: User, label: 'Profile', href: '/profile', isProtected: true },
  ];

  const handleNavClick = (href: string, isProtected: boolean) => {
    if (isProtected && !user) {
      router.push('/sign-in');
      return;
    }
    router.push(href);
  };

  return (
    <div className="w-64 bg-black border-r border-gray-800 flex flex-col h-screen fixed left-0 top-0">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
            <span className="text-black font-bold text-lg">C</span>
          </div>
          <h1 className="text-xl font-bold">CloudChat</h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.label}>
              <button
                onClick={() => handleNavClick(item.href, item.isProtected)}
                className={`flex items-center space-x-4 px-4 py-3 rounded-lg transition-colors w-full text-left ${
                  item.active
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <item.icon className="w-6 h-6" />
                <span className="font-medium">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-800">
        {user ? (
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-900">
            <UserButton afterSignOutUrl="/" />
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">
                {user.firstName || user.username}
              </p>
              <p className="text-gray-400 text-sm truncate">
                @{user.username}
              </p>
            </div>
          </div>
        ) : (
          <Link
            href="/sign-in"
            className="flex items-center justify-center w-full px-4 py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
}