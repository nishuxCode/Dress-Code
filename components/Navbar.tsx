'use client';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navItems = [
  { href: '/home', label: 'Home', icon: '🏠' },
  { href: '/scan', label: 'Scan', icon: '📸' },
  { href: '/rules', label: 'Rules', icon: '📋' },
  { href: '/violations', label: 'Violations', icon: '⚠️' },
  { href: '/about', label: 'About', icon: 'ℹ️' },
];

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hide navbar on auth pages
  const authPages = ['/login', '/register'];
  const isAuthPage = authPages.includes(pathname);

  if (isAuthPage) {
    return null;
  }

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center space-x-2">
              <span className="text-2xl">📚</span>
              <span className="text-xl font-bold text-white">
                Smart Academic Uniform Scan Protocol
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  pathname === item.href
                    ? 'bg-white/20 text-white shadow-lg'
                    : 'text-blue-100 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            {session && (
              <div className="hidden sm:flex items-center space-x-2 text-white">
                <span className="text-sm font-medium">👤 {session.user?.name}</span>
              </div>
            )}
            {session ? (
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all hidden sm:block"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-50 transition-all"
              >
                Login
              </Link>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-white hover:bg-white/20 transition"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-blue-700 border-t border-blue-500">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-3 py-3 rounded-lg text-base font-medium transition ${
                  pathname === item.href
                    ? 'bg-white/20 text-white'
                    : 'text-blue-100 hover:text-white hover:bg-white/10'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            ))}
            {session && (
              <div className="px-3 py-3 text-blue-100 text-sm font-medium">
                👤 {session.user?.name}
              </div>
            )}
            {session ? (
              <button
                onClick={() => {
                  signOut({ callbackUrl: '/login' });
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-3 text-base font-medium text-red-200 hover:bg-white/10 rounded-lg transition"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="block w-full text-left px-3 py-3 text-base font-bold text-white hover:bg-white/10 rounded-lg transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
