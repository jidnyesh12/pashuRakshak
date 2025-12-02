import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import Layout from '../components/common/Layout';
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
      } else {
        navigate('/user/dashboard');
      }
    }
  }, [isAuthenticated, user, navigate, isLoading]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Heart className="h-12 w-12 text-primary-600 mx-auto mb-4 animate-pulse" />
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Don't render the landing page if user is authenticated
  if (isAuthenticated) {
    return null;
  }

  // Render the full landing page for unauthenticated users
  return <LandingPage />;
};

export default Home;