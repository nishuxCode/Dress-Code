'use client';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalScans: 0,
    violations: 0,
    compliant: 0
  });
  const [currentHour, setCurrentHour] = useState(12);
  const [currentSlide, setCurrentSlide] = useState(0);

  const sliderImages = [
    '/54953ccbea5b0d2072d5562b97ac9b86.jpg',
    '/0c605f5725146674637fe3342783ecf4.jpg',
    '/47cf80157f64c8c0c770b52cbfdf907a.jpg',
  ];

  useEffect(() => {
    const hour = new Date().getHours();
    setCurrentHour(hour);
    
    // Fetch stats
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getGreeting = () => {
    if (currentHour < 12) return 'Good Morning';
    if (currentHour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const features = [
    {
      title: 'Scan Dress Code',
      description: 'Check dress code compliance',
      icon: '📸',
      href: '/scan',
      bgGradient: 'from-cyan-300 to-blue-400',
    },
    {
      title: 'View Rules',
      description: 'See all dress guidelines',
      icon: '📋',
      href: '/rules',
      bgGradient: 'from-purple-300 to-blue-400',
    },
    {
      title: 'Violations',
      description: 'Check compliance history',
      icon: '⚠️',
      href: '/violations',
      bgGradient: 'from-pink-300 to-red-400',
    },
    {
      title: 'Analytics',
      description: 'View detailed reports',
      icon: '📊',
      href: '/home',
      bgGradient: 'from-yellow-300 to-orange-400',
    },
    {
      title: 'Profile',
      description: 'Manage your account',
      icon: '👤',
      href: '/home',
      bgGradient: 'from-green-300 to-emerald-400',
    },
    {
      title: 'About',
      description: 'Learn about the system',
      icon: 'ℹ️',
      href: '/about',
      bgGradient: 'from-rose-300 to-pink-400',
    },
    {
      title: 'Feedback',
      description: 'Send your feedback',
      icon: '💬',
      href: '/home',
      bgGradient: 'from-indigo-300 to-purple-400',
    },
    {
      title: 'Support',
      description: 'Get help & support',
      icon: '🆘',
      href: '/home',
      bgGradient: 'from-teal-300 to-cyan-400',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header - Clean Design */}
      <div className="bg-transparent px-4 md:px-8 py-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-6">
            {/* Left: Greeting with Sun Icon */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-4xl">☀️</span>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  {getGreeting()}
                </h1>
              </div>
              <p className="text-gray-700 text-base ml-14 font-medium">{session?.user?.name}</p>
            </div>

            {/* Right: Search Bar */}
            <div className="w-full md:w-2/5 relative">
              <input
                type="text"
                placeholder="Search modules..."
                className="w-full px-5 py-2 rounded-xl border-2 border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 bg-white shadow-md text-sm"
              />
              <svg className="absolute right-3 top-2.5 w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section with Image Slider */}
      <div className="w-full px-4 md:px-8 py-8">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl">
          {/* Slider Images */}
          <div className="relative h-96 md:h-[550px] bg-gray-900">
            {sliderImages.map((img, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  idx === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img
                  src={img}
                  alt={`Slide ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              </div>
            ))}

            {/* Text Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-3 leading-tight">
                Smart Uniform Detection
              </h2>
              <p className="text-lg md:text-xl text-white/90 mb-6 max-w-2xl">
                Experience cutting-edge AI technology that ensures dress code compliance with precision and efficiency
              </p>
              <Link
                href="/scan"
                className="inline-block bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
              >
                Start Scanning →
              </Link>
            </div>

            {/* Slider Navigation Dots */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
              {sliderImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    idx === currentSlide
                      ? 'bg-white w-8'
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={() => setCurrentSlide((prev) => (prev - 1 + sliderImages.length) % sliderImages.length)}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-all"
            >
              ❮
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % sliderImages.length)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-all"
            >
              ❯
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Feature Cards Grid - iCloudEMS Style */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 ml-4">Features & Modules</h2>
          
          {/* Row 1 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {features.slice(0, 4).map((feature, idx) => (
              <Link
                key={idx}
                href={feature.href}
                className="group"
              >
                <div className={`bg-gradient-to-br ${feature.bgGradient} rounded-3xl p-8 text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105 relative overflow-hidden h-40 flex flex-col justify-between`}>
                  <div className="text-4xl">{feature.icon}</div>
                  <div>
                    <p className="font-bold text-lg">{feature.title}</p>
                    <p className="text-sm text-white/90">{feature.description}</p>
                  </div>
                  {/* Decorative wave */}
                  <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/20 rounded-full -mr-8 -mb-8"></div>
                </div>
              </Link>
            ))}
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white rounded-2xl p-4 shadow-md">
            {features.slice(4, 8).map((feature, idx) => (
              <Link
                key={idx}
                href={feature.href}
                className="group"
              >
                <div className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-all hover:-translate-y-1 border border-gray-100">
                  <p className="text-4xl mb-3">{feature.icon}</p>
                  <p className="font-bold text-gray-900 text-sm">{feature.title}</p>
                  <p className="text-xs text-gray-600">{feature.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Compliance Rate Section */}
        <div className="bg-white rounded-3xl p-8 shadow-md border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">📈 Overall Compliance Rate</h2>
          
          <div className="space-y-8">
            {/* Compliance Bar */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <p className="font-semibold text-gray-700">Compliance Rate</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.totalScans > 0 ? Math.round((stats.compliant / stats.totalScans) * 100) : 0}%
                </p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all"
                  style={{ width: `${stats.totalScans > 0 ? (stats.compliant / stats.totalScans) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            {/* Violation Bar */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <p className="font-semibold text-gray-700">Violation Rate</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.totalScans > 0 ? Math.round((stats.violations / stats.totalScans) * 100) : 0}%
                </p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-red-500 to-red-600 h-4 rounded-full transition-all"
                  style={{ width: `${stats.totalScans > 0 ? (stats.violations / stats.totalScans) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Project Info */}
        <div className="bg-gradient-to-r from-blue-400 via-blue-500 to-purple-500 text-white rounded-3xl p-8 shadow-lg mb-8">
          <h2 className="text-3xl font-bold mb-3">🚀 Smart Academic Uniform Detection</h2>
          <p className="text-blue-50 mb-6">Industry-level AI-powered system for real-time dress code compliance monitoring</p>
          <div className="flex gap-4">
            <Link
              href="/scan"
              className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition"
            >
              Start Scan
            </Link>
            <Link
              href="/about"
              className="bg-white/20 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/30 transition"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* --- New Sections Start --- */}

        {/* Stats Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">A System You Can Trust</h2>
          <div className="bg-white rounded-3xl p-8 shadow-md border border-gray-100">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-4xl font-bold text-blue-600">110k+</p>
                <p className="text-gray-600 mt-2">Registered Users</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-green-600">840k+</p>
                <p className="text-gray-600 mt-2">Groups Managed</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-purple-600">1.9M+</p>
                <p className="text-gray-600 mt-2">Students Tracked</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-red-600">30M+</p>
                <p className="text-gray-600 mt-2">Compliance Records</p>
              </div>
            </div>
          </div>
        </div>

        {/* Vision/Mission Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-bold text-blue-600 mb-2">The Vision</h3>
            <p className="text-gray-600">To provide a simple and convenient way to track compliance for any group.</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-bold text-purple-600 mb-2">The Promise</h3>
            <p className="text-gray-600">To continuously improve and update the software based on user feedback.</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-bold text-green-600 mb-2">The Mission</h3>
            <p className="text-gray-600">To help you get started for free and provide a system you'll love.</p>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Loved by Our Campus Community!</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-xl font-bold text-blue-600">SV</div>
                <p className="ml-4 font-semibold text-gray-800">Sonia V.</p>
              </div>
              <p className="text-gray-600 text-sm">"Only just started using the program, but I am impressed! This is so much better than manual tracking!"</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-xl font-bold text-green-600">CC</div>
                <p className="ml-4 font-semibold text-gray-800">Cerena C.</p>
              </div>
              <p className="text-gray-600 text-sm">"Thank you for the great app!!! Most are using old methods and this works out great for me and the classrooms! Thank you for letting me have this great tool!!!"</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-xl font-bold text-purple-600">TB</div>
                <p className="ml-4 font-semibold text-gray-800">Tristan B.</p>
              </div>
              <p className="text-gray-600 text-sm">"Thanks, you offer a great service. We are grateful for your work!"</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-xl font-bold text-yellow-600">AT</div>
                <p className="ml-4 font-semibold text-gray-800">Alison T.</p>
              </div>
              <p className="text-gray-600 text-sm">"This site is a great fit for my needs. I find it easy to use overall and it helps me keep track of day to day compliance. Thank you!"</p>
            </div>
          </div>
        </div>

        {/* Our Story Section */}
        <div className="bg-white rounded-3xl p-8 shadow-md border border-gray-100 mb-8 flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/3 text-center">
            <div className="w-40 h-40 rounded-full mx-auto shadow-lg bg-gradient-to-br from-blue-100 to-purple-200 flex items-center justify-center">
              <span className="text-6xl">👨‍💻</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mt-4">Trent O.</h3>
            <p className="text-gray-600">Husband, Daddy, Founder</p>
          </div>
          <div className="md:w-2/3">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">We Love Teachers (Literally)</h2>
            <p className="text-gray-700 mb-4">
              I started building this system because my lovely wife, a teacher, asked me to please help her track student uniform compliance more easily than the ways that were available. So I built her a simple and easy way to track, view and report on the compliance of all of her classes online.
            </p>
            <p className="text-gray-700">
              When I had a system together that she loved, other teachers kept asking her how they could use it too and this project was born! I continue to improve and update the software every day, listening to the feedback of our users.
            </p>
          </div>
        </div>

        {/* Use Cases Section */}
        <div className="bg-white rounded-3xl p-8 shadow-md border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Perfect for Any Group or Gathering!</h2>
          <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
            While we built this for school teachers initially, the app works perfectly for tracking compliance online for any class, group, or gathering!
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 text-center">
            <div className="bg-gray-50 p-4 rounded-xl hover:bg-blue-100 transition-colors duration-300"><p className="text-3xl mb-2">🧘</p><p className="font-semibold text-gray-800">Yoga Classes</p></div>
            <div className="bg-gray-50 p-4 rounded-xl hover:bg-green-100 transition-colors duration-300"><p className="text-3xl mb-2">⛪</p><p className="font-semibold text-gray-800">Church Groups</p></div>
            <div className="bg-gray-50 p-4 rounded-xl hover:bg-red-100 transition-colors duration-300"><p className="text-3xl mb-2">🥋</p><p className="font-semibold text-gray-800">Martial Arts</p></div>
            <div className="bg-gray-50 p-4 rounded-xl hover:bg-yellow-100 transition-colors duration-300"><p className="text-3xl mb-2">👶</p><p className="font-semibold text-gray-800">Child Care</p></div>
            <div className="bg-gray-50 p-4 rounded-xl hover:bg-purple-100 transition-colors duration-300"><p className="text-3xl mb-2">🏢</p><p className="font-semibold text-gray-800">Employees</p></div>
          </div>
        </div>

        {/* --- New Sections End --- */}
      </div>

      {/* Footer */}
      <footer className="bg-white py-12 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Smart Uniform Detection</h3>
              <p className="text-gray-600 mb-4 max-w-md">
                Ensuring academic excellence through automated dress code compliance monitoring. 
                Powered by advanced AI technology for accurate and efficient detection.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="/home" className="hover:text-blue-600 transition">Home</Link></li>
                <li><Link href="/scan" className="hover:text-blue-600 transition">Scan</Link></li>
                <li><Link href="/rules" className="hover:text-blue-600 transition">Rules</Link></li>
                <li><Link href="/about" className="hover:text-blue-600 transition">About Us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-600">
                <li>support@college.edu</li>
                <li>+1 (555) 123-4567</li>
                <li>Campus Building A, Room 101</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-8 text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} Smart Academic Uniform Detection. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
