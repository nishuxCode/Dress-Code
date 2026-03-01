'use client';
import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const EMAIL_REGEX = /^[A-Za-z0-9]{12,}@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

interface FormErrors {
  email?: string;
  password?: string;
}

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const validateForm = () => {
    const newErrors: FormErrors = {};

    // Email validation: 12+ chars before @, then domain.min2letters
    if (!EMAIL_REGEX.test(formData.email)) {
      newErrors.email = 'Email must be 12+ chars before @, valid domain (ex: CS2024001@college.in)';
    }

    // Password validation: 6+ chars, 1 uppercase, 1 lowercase, 1 number, 1 special
    if (!PASSWORD_REGEX.test(formData.password)) {
      newErrors.password = 'Password: 6+ chars, 1 uppercase, 1 lowercase, 1 number, 1 special (@$!%)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      console.log('Attempting login with email:', formData.email);
      
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      console.log('SignIn result:', result);

      if (result?.ok) {
        console.log('Login successful!');
        toast.success('✅ Login successful! Welcome back!');
        setTimeout(() => {
          router.push('/home');
        }, 1500);
      } else if (result?.error) {
        console.log('Login error:', result.error);
        toast.error('❌ Invalid email or password');
      } else {
        console.log('Login failed - no ok or error');
        toast.error('❌ Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login exception:', error);
      toast.error('❌ An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to your college account</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-xl space-y-6">
            <div className="animate-pulse h-12 bg-gray-200 rounded"></div>
            <div className="animate-pulse h-12 bg-gray-200 rounded"></div>
            <div className="animate-pulse h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-600">Sign in to your college account</p>
        </div>
        
        <form className="bg-white p-8 rounded-2xl shadow-xl space-y-6" onSubmit={handleSubmit}>
          <div>
            <input
              type="email"
              required
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${
                errors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
              }`}
              placeholder="CS2024001@college.in"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              required
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${
                errors.password ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
              }`}
              placeholder="Password123!"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all shadow-lg"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="text-center">
            <Link href="/register" className="text-blue-600 hover:text-blue-500 font-medium">
              Don&apos;t have an account? Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
