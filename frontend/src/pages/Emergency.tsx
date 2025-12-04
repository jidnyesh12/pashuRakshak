import React from 'react';
import { Phone, Shield, AlertTriangle, MapPin, ExternalLink } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';

const Emergency: React.FC = () => {
  const emergencyContacts = [
    {
      name: 'National Animal Helpline',
      number: '1962',
      description: '24/7 Toll-free number for animal emergencies across India',
      icon: Phone,
      color: 'bg-red-100 text-red-600'
    },
    {
      name: 'PashuRakshak Rapid Response',
      number: '+91 98765 43210',
      description: 'Our dedicated emergency response team',
      icon: Shield,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      name: 'Ambulance Service',
      number: '+91 11223 34455',
      description: 'Immediate medical transport for injured animals',
      icon: AlertTriangle,
      color: 'bg-orange-100 text-orange-600'
    }
  ];

  const nearbyClinics = [
    {
      name: 'City Vet Hospital',
      address: '123 Main St, Mumbai',
      distance: '1.2 km',
      status: 'Open 24 Hours'
    },
    {
      name: 'Animal Care Center',
      address: '456 Park Ave, Mumbai',
      distance: '2.5 km',
      status: 'Closes at 9 PM'
    }
  ];

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Emergency Help</h1>
          <p className="text-gray-600 mt-2">
            Immediate assistance for critical situations. If you see an animal in life-threatening danger, please call immediately.
          </p>
        </div>

        {/* Emergency Numbers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {emergencyContacts.map((contact, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${contact.color}`}>
                <contact.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">{contact.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{contact.description}</p>
              <a 
                href={`tel:${contact.number}`}
                className="block w-full py-2.5 bg-gray-900 text-white text-center rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Call {contact.number}
              </a>
            </div>
          ))}
        </div>

        {/* First Aid Guide */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white mb-10 shadow-lg">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">First Aid Guide</h2>
              <p className="text-purple-100 max-w-xl">
                Learn basic first aid steps to stabilize an injured animal before professional help arrives.
                Knowledge saves lives.
              </p>
            </div>
            <button className="px-6 py-3 bg-white text-purple-600 rounded-xl font-bold hover:bg-purple-50 transition-colors shadow-sm whitespace-nowrap">
              View Guide
            </button>
          </div>
        </div>

        {/* Nearby Clinics */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">Nearby Veterinary Clinics</h2>
            <button className="text-purple-600 text-sm font-medium hover:text-purple-700 flex items-center">
              View Map <ExternalLink className="h-4 w-4 ml-1" />
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {nearbyClinics.map((clinic, index) => (
              <div key={index} className="p-6 hover:bg-gray-50 transition-colors flex items-center justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gray-100 rounded-lg">
                    <MapPin className="h-6 w-6 text-gray-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{clinic.name}</h3>
                    <p className="text-sm text-gray-500">{clinic.address}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                        {clinic.status}
                      </span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">{clinic.distance} away</span>
                    </div>
                  </div>
                </div>
                <button className="p-2 text-gray-400 hover:text-purple-600 transition-colors">
                  <Phone className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Emergency;
