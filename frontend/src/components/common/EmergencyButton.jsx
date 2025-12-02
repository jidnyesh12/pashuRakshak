import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Phone, X } from 'lucide-react';

const EmergencyButton = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Expanded Menu */}
      {isExpanded && (
        <div className="mb-4 space-y-3">
          {/* Call Emergency */}
          <a
            href="tel:+919876543210"
            className="flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg shadow-lg transition-all duration-300 min-w-[200px]"
          >
            <Phone className="w-5 h-5" />
            <div className="text-left">
              <div className="font-semibold text-sm">Call Emergency</div>
              <div className="text-xs opacity-90">+91-9876543210</div>
            </div>
          </a>

          {/* Report Online */}
          <Link
            to="/report-animal"
            className="flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg shadow-lg transition-all duration-300 min-w-[200px]"
          >
            <Heart className="w-5 h-5" />
            <div className="text-left">
              <div className="font-semibold text-sm">Report Online</div>
              <div className="text-xs opacity-90">Submit with photos</div>
            </div>
          </Link>

          {/* Track Report */}
          <Link
            to="/track-report"
            className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg shadow-lg transition-all duration-300 min-w-[200px]"
          >
            <Heart className="w-5 h-5" />
            <div className="text-left">
              <div className="font-semibold text-sm">Track Report</div>
              <div className="text-xs opacity-90">Check status</div>
            </div>
          </Link>
        </div>
      )}

      {/* Main Emergency Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 ${
          isExpanded ? 'rotate-45' : 'animate-pulse'
        }`}
      >
        {isExpanded ? (
          <X className="w-6 h-6" />
        ) : (
          <Heart className="w-6 h-6" />
        )}
      </button>

      {/* Tooltip for collapsed state */}
      {!isExpanded && (
        <div className="absolute bottom-full right-0 mb-2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
          Emergency Help
        </div>
      )}
    </div>
  );
};

export default EmergencyButton;