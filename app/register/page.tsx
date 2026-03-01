'use client';
import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

const EMAIL_REGEX = /^[A-Za-z0-9]{12,}@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

interface FormErrors {
  name?: string;
  email?: string;
  regNo?: string;
  year?: string;
  password?: string;
  confirmPassword?: string;
  gender?: string;
}

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '', email: '', regNo: '', year: '', password: '', confirmPassword: '', gender: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (formData.name.length < 2) newErrors.name = 'Name must be 2+ characters';
    if (!EMAIL_REGEX.test(formData.email)) newErrors.email = 'Email: 12+ chars before @, valid domain';
    if (formData.regNo.length < 6) newErrors.regNo = 'RegNo must be 6+ characters';
    if (!formData.year) newErrors.year = 'Please select year';
    if (!PASSWORD_REGEX.test(formData.password)) newErrors.password = 'Password: 6+ chars, 1 upper, 1 lower, 1 number, 1 special';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.gender) newErrors.gender = 'Please select gender';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }

    setLoading(true);
    try {
      console.log('=== REGISTER ATTEMPT ===');
      console.log('Form data to send:', formData);
      console.log('Data types:', {
        name: typeof formData.name,
        email: typeof formData.email,
        regNo: typeof formData.regNo,
        year: typeof formData.year,
        password: typeof formData.password,
        confirmPassword: typeof formData.confirmPassword,
        gender: typeof formData.gender,
      });
      
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      console.log('Response status:', res.status);
      
      const data = await res.json();
      console.log('Response data:', data);
      
      if (res.ok) {
        setSuccess(true);
        toast.success('✅ Registration successful! Please login.');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else if (data.message) {
        console.log('Registration error:', data.message);
        toast.error(`❌ ${data.message}`);
      } else {
        console.log('Registration failed - unknown error');
        toast.error('❌ Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Register exception:', error);
      toast.error('❌ Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-2">Create Account</h2>
            <p className="text-gray-600">Join College Uniform Scanner</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-xl space-y-6">
            <div className="animate-pulse h-12 bg-gray-200 rounded"></div>
            <div className="animate-pulse h-12 bg-gray-200 rounded"></div>
            <div className="animate-pulse h-12 bg-gray-200 rounded"></div>
            <div className="animate-pulse h-12 bg-gray-200 rounded"></div>
            <div className="animate-pulse h-12 bg-gray-200 rounded"></div>
            <div className="animate-pulse h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="max-w-md w-full space-y-8">
        {/* SUCCESS MESSAGE */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-green-700 font-semibold">Registration Successful! ✅</p>
            <p className="text-green-600 text-sm mt-1">Redirecting to login...</p>
          </div>
        )}

        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Create Account</h2>
          <p className="text-gray-600">Join College Uniform Scanner</p>
        </div>
        
        <form className="bg-white p-8 rounded-2xl shadow-xl space-y-6" onSubmit={handleSubmit}>
          {/* NAME */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
            <input
              type="text" 
              required 
              placeholder="Enter your full name"
              className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${
                errors.name ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
              }`}
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <input
              type="email" 
              required 
              placeholder="CS202400123456@college.in"
              className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${
                errors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
              }`}
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          {/* REGNO */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Registration Number</label>
            <input
              type="text" 
              required 
              placeholder="CS2024001"
              className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${
                errors.regNo ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
              }`}
              value={formData.regNo}
              onChange={(e) => setFormData({...formData, regNo: e.target.value})}
            />
            {errors.regNo && <p className="mt-1 text-sm text-red-600">{errors.regNo}</p>}
          </div>

          {/* YEAR */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Year</label>
            <select
              required
              className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${
                errors.year ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
              }`}
              value={formData.year}
              onChange={(e) => setFormData({...formData, year: e.target.value})}
            >
              <option value="">Select Year</option>
              <option value="1st">1st Year</option>
              <option value="2nd">2nd Year</option>
              <option value="3rd">3rd Year</option>
              <option value="4th">4th Year</option>
            </select>
            {errors.year && <p className="mt-1 text-sm text-red-600">{errors.year}</p>}
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input
              type="password" 
              required 
              placeholder="Enter strong password"
              className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${
                errors.password ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
              }`}  // ✅ FIXED SYNTAX ERROR
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
            <input
              type="password" 
              required 
              placeholder="Confirm your password"
              className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${
                errors.confirmPassword ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
              }`}
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            />
            {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
          </div>

          {/* GENDER */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
            <select
              required
              className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${
                errors.gender ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
              }`}
              value={formData.gender}
              onChange={(e) => setFormData({...formData, gender: e.target.value})}
            >
              <option value="">Select Gender</option>
              <option value="boy">Male</option>
              <option value="girl">Female</option>
            </select>
            {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender}</p>}
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all shadow-lg"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          <div className="text-center">
            <Link href="/login" className="text-blue-600 hover:text-blue-500 font-medium">
              Already have account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
