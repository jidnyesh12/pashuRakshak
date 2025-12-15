import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import LandingPage from './LandingPage';
import { useAuth } from '../context/AuthContext';

const Home: React.FC = () => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user?.roles) {
      console.log("Home: Redirecting authenticated user to dashboard");
      // Redirect authenticated users to their dashboard
      if (user.roles.includes('ADMIN')) {
        navigate('/admin/dashboard');
      } else if (user.roles.includes('NGO')) {
        navigate('/ngo/dashboard');
      } else if (user.roles.includes('NGO_WORKER')) {
        navigate('/worker/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    }
  }, [isAuthenticated, user, navigate, isLoading]);

  // Show a minimal loading state that doesn't include different header/footer
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-center">
          <Heart className="h-16 w-16 text-primary-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600 font-medium">Loading PashuRakshak...</p>
        </div>
      </div>
    );
  }

  // Don't render the landing page if user is authenticated (they'll be redirected)
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-center">
          <Heart className="h-16 w-16 text-primary-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600 font-medium">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  // Render the full landing page for unauthenticated users
  return <LandingPage />;
};

export default Home;