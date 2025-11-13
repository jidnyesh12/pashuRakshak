import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';
import Layout from '../components/common/Layout';

const Unauthorized: React.FC = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div>
            <Shield className="mx-auto h-24 w-24 text-red-500" />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Access Denied
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              You don't have permission to access this page.
            </p>
          </div>
          
          <div className="mt-8 space-y-4">
            <p className="text-gray-500">
              This page requires specific permissions that your account doesn't have.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Home
              </Link>
              
              <Link
                to="/dashboard"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                My Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Unauthorized;