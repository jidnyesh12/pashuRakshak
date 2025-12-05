import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Heart, ArrowRight, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI } from '../../utils/api';
import { setAuthData } from '../../utils/auth';
import { useAuth } from '../../context/AuthContext';
import type { LoginRequest } from '../../types';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>();

  const onSubmit = async (data: LoginRequest) => {
    setIsLoading(true);
    try {
      const response = await authAPI.login(data);

      // Store auth data
      setAuthData(response);

      // Update auth context
      login({
        id: response.id,
        username: response.username,
        email: response.email,
        fullName: response.fullName,
        ngoId: response.ngoId,
        roles: response.roles,
      }, response.token);

      toast.success('Login successful!');

      // Redirect to the page they were trying to access, or dashboard based on role
      const from = location.state?.from?.pathname;
      if (from && from !== '/') {
        navigate(from, { replace: true });
      } else {
        // Redirect based on role
        if (response.roles.includes('ADMIN')) {
          navigate('/admin/dashboard');
        } else if (response.roles.includes('NGO')) {
          navigate('/ngo/dashboard');
        } else if (response.roles.includes('NGO_WORKER')) {
          navigate('/worker/dashboard');
        } else {
          navigate('/user/dashboard');
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-100">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Heart className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-600">
              Sign in to continue helping animals
            </p>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                Username or Email
              </label>
              <input
                {...register('username', { required: 'Username is required' })}
                type="text"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 outline-none"
                placeholder="Enter your username or email"
              />
              {errors.username && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <span className="text-lg">•</span> {errors.username.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  {...register('password', { required: 'Password is required' })}
                  type={showPassword ? 'text' : 'password'}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 outline-none pr-12"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <span className="text-lg">•</span> {errors.password.message}
                </p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="flex items-center justify-end">
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3.5 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="font-semibold text-purple-600 hover:text-purple-700 transition-colors"
              >
                Create one now
              </Link>
            </p>
          </div>

          {/* Test Credentials */}
          <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
            <div className="flex items-start gap-2 mb-3">
              <Shield className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-2">Test Credentials</p>
                <div className="text-xs text-gray-600 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-medium min-w-[60px]">Admin:</span>
                    <code className="bg-white px-2 py-0.5 rounded">admin / admin123</code>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium min-w-[60px]">NGO:</span>
                    <code className="bg-white px-2 py-0.5 rounded">ngouser / ngo123</code>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium min-w-[60px]">User:</span>
                    <code className="bg-white px-2 py-0.5 rounded">testuser / user123</code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;