'use client';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">About College Uniform Scanner</h1>
          <p className="text-blue-100 text-lg">Complete solution for uniform compliance management</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Main Description */}
        <div className="bg-white rounded-3xl p-8 shadow-md border border-gray-100 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">🎓 What is College Uniform Scanner?</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            With iCloudEMS, a single, unified system empowers educational institutions to seamlessly manage the entire student lifecycle—from lead generation to graduation. Gain comprehensive visibility and make informed decisions with ease.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Our College Uniform Scanner is a specialized module designed to ensure dress code compliance across campus. Using advanced image recognition and AI-powered analysis, we provide real-time monitoring and comprehensive reporting on student uniform compliance.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Attendance Management */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-3xl p-8 shadow-md">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Attendance Management</h3>
            <p className="text-gray-700 mb-6">
              Simplify and optimize attendance tracking with our module. Additionally, enhance efficiency with QR code-based attendance marking via our ERP app, enabling quick and accurate attendance updates.
            </p>
            <div className="flex items-center text-green-700 font-semibold">
              <span>✅ Active & Operational</span>
            </div>
          </div>

          {/* Dress Code Scanning */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-3xl p-8 shadow-md">
            <div className="text-5xl mb-4">📸</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Dress Code Scanning</h3>
            <p className="text-gray-700 mb-6">
              Advanced AI-powered image recognition technology to scan and verify student uniform compliance. Get instant feedback on dress code violations and maintain campus standards efficiently.
            </p>
            <div className="flex items-center text-blue-700 font-semibold">
              <span>✅ Live Monitoring</span>
            </div>
          </div>

          {/* Real-time Reporting */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-3xl p-8 shadow-md">
            <div className="text-5xl mb-4">📊</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Real-time Reporting</h3>
            <p className="text-gray-700 mb-6">
              Comprehensive dashboards and analytics providing detailed insights into compliance patterns, violation trends, and student performance metrics for informed decision-making.
            </p>
            <div className="flex items-center text-purple-700 font-semibold">
              <span>✅ Data Visualization</span>
            </div>
          </div>

          {/* Student Management */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 rounded-3xl p-8 shadow-md">
            <div className="text-5xl mb-4">👥</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Student Management</h3>
            <p className="text-gray-700 mb-6">
              Centralized student database with detailed profiles, compliance history, and personalized tracking. Monitor individual student progress and compliance patterns throughout the semester.
            </p>
            <div className="flex items-center text-orange-700 font-semibold">
              <span>✅ Centralized Control</span>
            </div>
          </div>
        </div>

        {/* Key Statistics */}
        <div className="bg-white rounded-3xl p-8 shadow-md border border-gray-100 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">📈 Key Features</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">99%</div>
              <p className="text-gray-700">Accuracy Rate</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">24/7</div>
              <p className="text-gray-700">Monitoring Active</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">Real-time</div>
              <p className="text-gray-700">Alerts & Reports</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">Secure</div>
              <p className="text-gray-700">Data Protection</p>
            </div>
          </div>
        </div>

        {/* Data Safety & Privacy */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-3xl p-8 shadow-md mb-8">
          <div className="flex items-start space-x-4">
            <div className="text-5xl">🔒</div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Data Safety & Privacy</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center">
                  <span className="text-blue-600 font-bold mr-3">✓</span>
                  End-to-end encryption for all student data
                </li>
                <li className="flex items-center">
                  <span className="text-blue-600 font-bold mr-3">✓</span>
                  Compliant with educational data protection regulations
                </li>
                <li className="flex items-center">
                  <span className="text-blue-600 font-bold mr-3">✓</span>
                  Regular security audits and penetration testing
                </li>
                <li className="flex items-center">
                  <span className="text-blue-600 font-bold mr-3">✓</span>
                  Secure backup systems with disaster recovery protocols
                </li>
                <li className="flex items-center">
                  <span className="text-blue-600 font-bold mr-3">✓</span>
                  User access controls and role-based permissions
                </li>
                <li className="flex items-center">
                  <span className="text-blue-600 font-bold mr-3">✓</span>
                  GDPR and FERPA compliant data handling
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Last Updated */}
        <div className="bg-white rounded-3xl p-8 shadow-md border border-gray-100 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">📅 Version Information</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <span className="text-gray-700">Last Updated</span>
              <span className="font-bold text-gray-900">19 Feb 2026</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <span className="text-gray-700">Current Version</span>
              <span className="font-bold text-gray-900">1.0.0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Status</span>
              <span className="font-bold text-green-600">✓ Production Ready</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-3xl p-8 shadow-lg text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
          <p className="text-blue-100 mb-6">Join thousands of institutions managing dress code compliance efficiently</p>
          <Link
            href="/dashboard"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-xl font-bold hover:bg-blue-50 transition"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
