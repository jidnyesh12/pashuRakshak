import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, ArrowRight, User, Mail, Phone, Lock, UserCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI } from '../../utils/api';
import type { SignupRequest } from '../../types';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ImageUpload from '../../components/common/ImageUpload';

const Signup: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [registrationDocumentUrl, setRegistrationDocumentUrl] = useState<string>('');
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignupRequest & { confirmPassword: string }>();

  const password = watch('password');
  const userType = watch('userType');

  const onSubmit = async (data: SignupRequest & { confirmPassword: string }) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    // For NGO users, require document upload
    if (data.userType === 'NGO' && !registrationDocumentUrl) {
      toast.error('Please upload your NGO registration document');
      return;
    }

    setIsLoading(true);
    try {
      const { confirmPassword, ...signupData } = data;
      // Add document URL for NGO users
      if (data.userType === 'NGO') {
        signupData.registrationDocumentUrl = registrationDocumentUrl;
      }
      await authAPI.signup(signupData);

      if (data.userType === 'NGO') {
        toast.success('NGO registration submitted! Your account will be activated after admin verification.');
      } else {
        toast.success('Account created successfully! Please login.');
      }
      navigate('/login');
    } catch (error: any) {
      toast.error(error.response?.data || 'Signup failed');
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
          <img src="/logo.png" alt="PashuRakshak" className="h-20 w-auto mb-8 drop-shadow-lg" />
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Join the <span className="text-[#e6ce00]">Movement</span>,<br />
            Be the <span className="text-[#e6ce00]">Voice</span>.
          </h1>
          <p className="text-xl text-emerald-100 max-w-lg mb-8">
            Whether you're reporting a rescue or saving lives directly, your contribution matters.
          </p>

          <div className="grid grid-cols-2 gap-6 w-full max-w-lg">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
              <h3 className="font-bold text-[#e6ce00] text-lg mb-1">For Users</h3>
              <p className="text-sm text-emerald-100">Report stray animals in distress and track their rescue journey.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
              <h3 className="font-bold text-[#e6ce00] text-lg mb-1">For NGOs</h3>
              <p className="text-sm text-emerald-100">Manage rescue operations and coordinate with your team efficiently.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 relative overflow-y-auto">
        {/* Decorative stickers */}
        <img src="/animal-stickers.png" alt="" className="absolute top-10 right-10 w-24 opacity-20 rotate-12 pointer-events-none" />

        <div className="max-w-2xl w-full space-y-8 my-auto">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-[#004432]">Create Account</h2>
            <p className="mt-2 text-gray-600">Start making a difference today</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="space-y-2">
                <label htmlFor="fullName" className="text-sm font-medium text-gray-700">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                  <input
                    {...register('fullName', { required: 'Full name is required' })}
                    type="text"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#004432] focus:ring-4 focus:ring-[#004432]/10 transition-all outline-none bg-gray-50 focus:bg-white"
                    placeholder="John Doe"
                  />
                </div>
                {errors.fullName && <p className="text-sm text-red-500">{errors.fullName.message}</p>}
              </div>

              {/* Username */}
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium text-gray-700">Username</label>
                <div className="relative">
                  <UserCircle className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                  <input
                    {...register('username', {
                      required: 'Username is required',
                      minLength: { value: 3, message: 'Min 3 chars' },
                      maxLength: { value: 20, message: 'Max 20 chars' },
                    })}
                    type="text"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#004432] focus:ring-4 focus:ring-[#004432]/10 transition-all outline-none bg-gray-50 focus:bg-white"
                    placeholder="johndoe"
                  />
                </div>
                {errors.username && <p className="text-sm text-red-500">{errors.username.message}</p>}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                  <input
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email',
                      },
                    })}
                    type="email"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#004432] focus:ring-4 focus:ring-[#004432]/10 transition-all outline-none bg-gray-50 focus:bg-white"
                    placeholder="john@example.com"
                  />
                </div>
                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone (Optional)</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                  <input
                    {...register('phone')}
                    type="tel"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#004432] focus:ring-4 focus:ring-[#004432]/10 transition-all outline-none bg-gray-50 focus:bg-white"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
            </div>

            {/* Account Type */}
            <div className="space-y-2">
              <label htmlFor="userType" className="text-sm font-medium text-gray-700">I want to join as</label>
              <div className="relative">
                <select
                  {...register('userType', { required: 'Please select account type' })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#004432] focus:ring-4 focus:ring-[#004432]/10 transition-all outline-none bg-gray-50 focus:bg-white appearance-none cursor-pointer"
                >
                  <option value="">Select account type</option>
                  <option value="USER">Regular User (Report & Track Cases)</option>
                  <option value="NGO">NGO Representative (Rescue Animals)</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                </div>
              </div>
              {errors.userType && <p className="text-sm text-red-500">{errors.userType.message}</p>}
            </div>

            {/* NGO Specific Fields */}
            {userType === 'NGO' && (
              <div className="bg-[#004432]/5 border border-[#004432]/10 rounded-2xl p-6 space-y-6 animate-fadeIn">
                <div className="flex items-center gap-2 pb-2 border-b border-[#004432]/10">
                  <span className="text-xl">🏢</span>
                  <h3 className="font-bold text-[#004432]">Organization Details</h3>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">NGO Name *</label>
                  <input
                    {...register('ngoName', { required: userType === 'NGO' ? 'Required' : false })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#004432] focus:ring-4 focus:ring-[#004432]/10 transition-all outline-none bg-white"
                    placeholder="E.g., Animal Welfare Foundation"
                  />
                  {errors.ngoName && <p className="text-sm text-red-500">{errors.ngoName.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Address *</label>
                  <input
                    {...register('address', { required: userType === 'NGO' ? 'Required' : false })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#004432] focus:ring-4 focus:ring-[#004432]/10 transition-all outline-none bg-white"
                    placeholder="Full address"
                  />
                  {errors.address && <p className="text-sm text-red-500">{errors.address.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Latitude *</label>
                    <input
                      {...register('latitude', { required: userType === 'NGO', valueAsNumber: true })}
                      type="number"
                      step="any"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#004432] focus:ring-4 focus:ring-[#004432]/10 transition-all outline-none bg-white"
                      placeholder="19.0760"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Longitude *</label>
                    <input
                      {...register('longitude', { required: userType === 'NGO', valueAsNumber: true })}
                      type="number"
                      step="any"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#004432] focus:ring-4 focus:ring-[#004432]/10 transition-all outline-none bg-white"
                      placeholder="72.8777"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    {...register('description')}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#004432] focus:ring-4 focus:ring-[#004432]/10 transition-all outline-none bg-white resize-none"
                    placeholder="Mission statement..."
                  />
                </div>

                <div className="space-y-3 pt-2">
                  <label className="text-sm font-medium text-gray-700">Registration Document *</label>
                  <ImageUpload
                    onUpload={(url) => setRegistrationDocumentUrl(url)}
                    onRemove={() => setRegistrationDocumentUrl('')}
                    label="Upload Registration Document"
                  />
                  {/* Note: I am assuming ImageUpload is generic enough. If it has blue colors hardcoded, we might need to update it separately, but sticking to logic here. */}
                  {registrationDocumentUrl && (
                    <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                      ✓ Uploaded
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                  <input
                    {...register('password', { required: 'Required', minLength: { value: 6, message: 'Min 6 chars' } })}
                    type={showPassword ? 'text' : 'password'}
                    className="w-full pl-11 pr-12 py-3 rounded-xl border border-gray-200 focus:border-[#004432] focus:ring-4 focus:ring-[#004432]/10 transition-all outline-none bg-gray-50 focus:bg-white"
                    placeholder="Password"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                  <input
                    {...register('confirmPassword', { required: 'Required', validate: val => val === password || ' mismatch' })}
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="w-full pl-11 pr-12 py-3 rounded-xl border border-gray-200 focus:border-[#004432] focus:ring-4 focus:ring-[#004432]/10 transition-all outline-none bg-gray-50 focus:bg-white"
                    placeholder="Confirm"
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600">
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            <div className="text-xs text-center text-gray-500">
              By joining, you agree to our <Link to="/terms" className="text-[#004432] font-medium hover:underline">Terms</Link> and <Link to="/privacy" className="text-[#004432] font-medium hover:underline">Privacy Policy</Link>.
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#004432] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#13735f] shadow-lg shadow-[#004432]/20 hover:shadow-xl hover:shadow-[#004432]/30 transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? <LoadingSpinner size="sm" /> : (
                <>
                  Create Account <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-[#004432] hover:text-[#13735f]">
              Sign in
            </Link>
          </p>

          <div className="text-center">
            <Link to="/" className="text-sm text-gray-500 hover:text-[#004432] transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
