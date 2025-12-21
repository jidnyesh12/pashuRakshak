import React from 'react';
import { Menu, Circle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from 'react-router-dom';

interface TopHeaderProps {
  onMenuClick: () => void;
  isSidebarExpanded?: boolean;
}

const TopHeader: React.FC<TopHeaderProps> = ({ onMenuClick }) => {
  const { user } = useAuth();
  const location = useLocation();

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Get page title from route
  const getPageInfo = () => {
    const path = location.pathname;
    if (path.includes('dashboard')) return { title: 'Dashboard', subtitle: 'Overview' };
    if (path.includes('report-animal')) return { title: 'Report', subtitle: 'New case' };
    if (path.includes('track-report')) return { title: 'Cases', subtitle: 'Track history' };
    if (path.includes('profile')) return { title: 'Profile', subtitle: 'Settings' };
    if (path.includes('manage-ngo')) return { title: 'NGO', subtitle: 'Management' };
    return { title: 'Dashboard', subtitle: '' };
  };

  const pageInfo = getPageInfo();

  return (
    <header 
      className={`
        bg-white/80 backdrop-blur-sm h-16 fixed top-0 right-0 z-30 
        transition-all duration-300 ease-out border-b border-slate-100/80
        left-0 lg:left-16
      `}
    >
      <div className="h-full px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Mobile Menu + Page Context */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 -ml-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          {/* Page Context - Desktop only */}
          <div className="hidden lg:flex items-center gap-3">
            <span className="text-slate-300 text-sm">{getGreeting()}</span>
            <span className="text-slate-200">·</span>
            <span className="text-slate-900 font-medium">{pageInfo.title}</span>
          </div>
        </div>

        {/* Right: Status + User */}
        <div className="flex items-center gap-3">
          {/* Online Status Indicator */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
            <Circle className="w-2 h-2 fill-emerald-500 text-emerald-500" />
            <span>Online</span>
          </div>
          
          {/* Divider */}
          <div className="hidden sm:block w-px h-4 bg-slate-200" />
          
          {/* User Name (shortened) */}
          <span className="text-sm text-slate-600 font-medium hidden sm:block">
            {user?.fullName?.split(' ')[0]}
          </span>
        </div>
      </div>
    </header>
  );
};

export default TopHeader;
