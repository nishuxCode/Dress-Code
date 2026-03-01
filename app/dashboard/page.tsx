'use client';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalScans: 0,
    violations: 0,
    compliant: 0
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [currentHour, setCurrentHour] = useState(12);

  useEffect(() => {
    const hour = new Date().getHours();
    setCurrentHour(hour);
    
    // Fetch stats
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(() => {});
  }, []);

  const getGreeting = () => {
    if (currentHour < 12) return '🌅 Good Morning';
    if (currentHour < 18) return '☀️ Good Afternoon';
    return '🌙 Good Evening';
  };

  const features = [
    {
      title: 'Scan Dress Code',
      description: 'Check uniform compliance with camera',
      icon: '📸',
      href: '/scan',
      bgGradient: 'from-blue-400 to-blue-600',
      color: 'blue'
    },
    {
      title: 'View Rules',
      description: 'See all dress code guidelines',
      icon: '📋',
      href: '/rules',
      bgGradient: 'from-purple-400 to-purple-600',
      color: 'purple'
    },
    {
      title: 'Violations',
      description: 'Check your compliance history',
      icon: '⚠️',
      href: '/violations',
      bgGradient: 'from-red-400 to-red-600',
      color: 'red'
    },
    {
      title: 'Guidelines',
      description: 'Learn dress code standards',
      icon: '📖',
      href: '/rules',
      bgGradient: 'from-green-400 to-green-600',
      color: 'green'
    },
    {
      title: 'Statistics',
      description: 'View scan statistics',
      icon: '📊',
      href: '/dashboard',
      bgGradient: 'from-yellow-400 to-yellow-600',
      color: 'yellow'
    },
    {
      title: 'Profile',
      description: 'Manage your account',
      icon: '👤',
      href: '/dashboard',
      bgGradient: 'from-indigo-400 to-indigo-600',
      color: 'indigo'
    },
    {
      title: 'Feedback',
      description: 'Send us your feedback',
      icon: '💬',
      href: '/dashboard',
      bgGradient: 'from-pink-400 to-pink-600',
      color: 'pink'
    },
    {
      title: 'Help',
      description: 'Get support and assistance',
      icon: '❓',
      href: '/dashboard',
      bgGradient: 'from-cyan-400 to-cyan-600',
      color: 'cyan'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-8 shadow-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">{getGreeting()}</h1>
              <p className="text-gray-600 text-lg mt-2">{session?.user?.name}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search features..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-lg shadow-md"
            />
            <svg className="absolute right-4 top-4 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Compliant Scans */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-3xl p-6 shadow-md hover:shadow-lg transition">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-green-700 text-sm font-semibold mb-2">✅ Compliant Scans</p>
                <p className="text-4xl font-bold text-green-600">{stats.compliant}</p>
              </div>
              <div className="text-4xl">📸</div>
            </div>
          </div>

          {/* Violations */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-3xl p-6 shadow-md hover:shadow-lg transition">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-red-700 text-sm font-semibold mb-2">⚠️ Violations</p>
                <p className="text-4xl font-bold text-red-600">{stats.violations}</p>
              </div>
              <div className="text-4xl">📋</div>
            </div>
          </div>

          {/* Total Scans */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-3xl p-6 shadow-md hover:shadow-lg transition">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-blue-700 text-sm font-semibold mb-2">👁️ Total Scans</p>
                <p className="text-4xl font-bold text-blue-600">{stats.totalScans}</p>
              </div>
              <div className="text-4xl">📊</div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Access Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, index) => (
              <Link
                key={index}
                href={feature.href}
                className="group bg-white rounded-3xl p-6 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-2 border border-gray-100"
              >
                <div className="text-center">
                  <div className="text-5xl mb-3">{feature.icon}</div>
                  <h3 className="font-bold text-gray-900 mb-2 text-lg group-hover:text-blue-600 transition">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* About Section Card */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-blue-200 rounded-3xl p-8 shadow-md mb-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">ℹ️ About College Uniform Scanner</h2>
              <p className="text-gray-700 mb-4">
                With iCloudEMS, a single, unified system empowers educational institutions to seamlessly manage the entire student lifecycle. Our specialized module ensures dress code compliance across campus using advanced AI technology.
              </p>
              <Link
                href="/about"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition"
              >
                Learn More →
              </Link>
            </div>
            <div className="text-6xl ml-4">🎓</div>
          </div>
        </div>

        {/* Quick Stats Bars */}
        <div className="bg-white rounded-3xl p-8 shadow-md border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Status</h2>
          
          <div className="space-y-6">
            {/* Compliance Rate */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="font-semibold text-gray-700">Compliance Rate</p>
                <p className="text-lg font-bold text-blue-600">
                  {stats.totalScans > 0 ? Math.round((stats.compliant / stats.totalScans) * 100) : 0}%
                </p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all"
                  style={{ width: `${stats.totalScans > 0 ? (stats.compliant / stats.totalScans) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            {/* Violation Rate */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="font-semibold text-gray-700">Violations</p>
                <p className="text-lg font-bold text-red-600">
                  {stats.totalScans > 0 ? Math.round((stats.violations / stats.totalScans) * 100) : 0}%
                </p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full transition-all"
                  style={{ width: `${stats.totalScans > 0 ? (stats.violations / stats.totalScans) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
