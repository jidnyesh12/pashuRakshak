import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  History, 
  AlertCircle, 
  User, 
  LogOut,
  Heart
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
    window.location.href = '/';
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/user/dashboard' },
    { icon: PlusCircle, label: 'Report Animal', path: '/report-animal' },
    { icon: History, label: 'Track History', path: '/track-report' },
    { icon: AlertCircle, label: 'Emergency Help', path: '/emergency' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-30 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="flex items-center justify-center h-16 border-b border-gray-100">
          <Heart className="h-8 w-8 text-purple-600 mr-2" />
          <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            PashuRakshak
          </span>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-gray-100 bg-purple-50">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 font-bold">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{user?.fullName}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.roles?.[0]?.toLowerCase() || 'User'}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => window.innerWidth < 1024 && onClose()}
              className={({ isActive }) => `
                flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors
                ${isActive 
                  ? 'bg-purple-100 text-purple-700' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
              `}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.label}
            </NavLink>
          ))}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-colors mt-8"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </button>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
