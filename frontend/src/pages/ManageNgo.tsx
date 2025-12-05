import React from 'react';
import { Building2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';

const ManageNgo: React.FC = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
              <Building2 className="w-8 h-8 text-purple-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Manage NGO</h1>
            <p className="text-gray-600 mb-6">
              NGO management features coming soon!
            </p>
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 text-left">
              <h3 className="font-semibold text-blue-900 mb-2">Planned Features:</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• Update NGO information and contact details</li>
                <li>• Manage team members and volunteers</li>
                <li>• View rescue statistics and performance metrics</li>
                <li>• Upload and manage NGO documents</li>
                <li>• Configure notification preferences</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageNgo;
