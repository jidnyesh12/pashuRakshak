import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, ArrowRight, Shield } from 'lucide-react';
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
    <div className="min-h-screen flex bg-white">
      {/* Left Panel - Image Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#004432]">
        <img
          src="/auth-bg.png"
          alt="Wilderness"
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#004432] via-[#004432]/40 to-transparent"></div>
        <div className="relative z-10 p-16 flex flex-col items-start justify-end h-full text-white">
          {/* <img src="/logo.png" alt="PashuRakshak" className="h-20 w-auto mb-8 drop-shadow-lg" /> */}
          <img src="/sticker1.jpg" alt="PashuRakshak" className="h-20 w-auto mb-8 drop-shadow-lg" />
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Protecting <span className="text-[#e6ce00]">Nature</span>,<br />
            Preserving <span className="text-[#e6ce00]">Life</span>.
          </h1>
          <p className="text-xl text-emerald-100 max-w-lg mb-8">
            Join our community of guardians dedicated to rescuing and rehabilitating wildlife. Every action counts.
          </p>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#004432] bg-white flex items-center justify-center overflow-hidden">
                  {/* Placeholder avatars until we have real ones, or just generic user icons */}
                  <div className="w-full h-full bg-gray-200" />
                </div>
              ))}
            </div>
            <span className="text-sm font-medium text-emerald-100">1000+ Guardians joined</span>
          </div>
        </div>
      </div>

      {/* Right Panel - Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 relative">
        {/* Decorative stickers */}
        <img src="/animal-stickers.png" alt="" className="absolute top-10 right-10 w-24 opacity-20 rotate-12 pointer-events-none" />

        <div className="max-w-md w-full space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-[#004432]">Welcome Back</h2>
            <p className="mt-2 text-gray-600">Please enter your details to sign in</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Username Field */}
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-gray-700">
                Username or Email
              </label>
              <input
                {...register('username', { required: 'Username is required' })}
                type="text"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#004432] focus:ring-4 focus:ring-[#004432]/10 transition-all outline-none bg-gray-50 focus:bg-white"
                placeholder="Enter your username"
              />
              {errors.username && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <span className="text-lg">•</span> {errors.username.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-[#004432] hover:text-[#13735f]"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  {...register('password', { required: 'Password is required' })}
                  type={showPassword ? 'text' : 'password'}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#004432] focus:ring-4 focus:ring-[#004432]/10 transition-all outline-none bg-gray-50 focus:bg-white pr-12"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <span className="text-lg">•</span> {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#004432] text-white py-3.5 px-6 rounded-xl font-bold text-lg hover:bg-[#13735f] shadow-lg shadow-[#004432]/20 hover:shadow-xl hover:shadow-[#004432]/30 transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

          <p className="text-center text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="font-bold text-[#004432] hover:text-[#13735f]">
              Create account
            </Link>
          </p>

          {/* Test Credentials Box - Styled for new theme */}
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-[#004432]" />
              <span className="font-bold text-gray-900">Quick Access</span>
            </div>
            <div className="grid grid-cols-1 gap-2 text-sm">
              <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-100">
                <span className="text-gray-500">Admin</span>
                <code className="text-[#004432] font-mono font-medium">admin / admin123</code>
              </div>
              <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-100">
                <span className="text-gray-500">NGO</span>
                <code className="text-[#004432] font-mono font-medium">ngouser / ngo123</code>
              </div>
              <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-100">
                <span className="text-gray-500">User</span>
                <code className="text-[#004432] font-mono font-medium">testuser / user123</code>
              </div>
            </div>
          </div>

          <div className="text-center pt-4">
            <Link to="/" className="text-sm text-gray-500 hover:text-[#004432] transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;