import React from 'react';
import { Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface TopHeaderProps {
  onMenuClick: () => void;
}

const TopHeader: React.FC<TopHeaderProps> = ({ onMenuClick }) => {
  const { user } = useAuth();

  return (
    <header className="bg-white shadow-sm h-16 fixed top-0 right-0 left-0 lg:left-64 z-10 transition-all duration-300">
      <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Mobile Menu & Title */}
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="ml-4 text-xl font-semibold text-gray-800 hidden sm:block">
            Dashboard
          </h1>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-4">
          {/* Role Badge */}
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#e6ce00]/20 text-[#004432] border border-[#e6ce00]/30 capitalize">
            {user?.roles?.[0]?.toLowerCase() || 'User'}
          </span>
        </div>
      </div>
    </header>
  );
};

export default TopHeader;
