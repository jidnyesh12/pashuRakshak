import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  History,
  FileText,
  Building2,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, isExpanded, onToggleExpand }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [isHovering, setIsHovering] = useState(false);

  // Show expanded state if explicitly expanded OR hovering
  const showExpanded = isExpanded || isHovering;

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
    window.location.href = '/';
  };

  // Check user role
  const isNGO = user?.roles?.includes('NGO');
  const isAdmin = user?.roles?.includes('ADMIN');
  const isWorker = user?.roles?.includes('NGO_WORKER');

  // Define menu items based on user role
  const navItems = isNGO ? [
    { icon: LayoutDashboard, label: 'Overview', path: '/ngo/dashboard' },
    { icon: FileText, label: 'Track Cases', path: '/track-report' },
    { icon: Building2, label: 'Manage NGO', path: '/manage-ngo' },
    { icon: User, label: 'Profile', path: '/profile' },
  ] : isAdmin ? [
    { icon: LayoutDashboard, label: 'Overview', path: '/admin/dashboard' },
    { icon: FileText, label: 'All Reports', path: '/track-report' },
    { icon: User, label: 'Profile', path: '/profile' },
  ] : isWorker ? [
    { icon: LayoutDashboard, label: 'Tasks', path: '/worker/dashboard' },
    { icon: User, label: 'Profile', path: '/profile' },
  ] : [
    { icon: LayoutDashboard, label: 'Overview', path: '/user/dashboard' },
    { icon: PlusCircle, label: 'Report', path: '/report-animal' },
    { icon: History, label: 'History', path: '/track-report' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Navigation Rail */}
      <aside
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className={`
          fixed top-0 left-0 z-50 h-full bg-white border-r border-slate-100
          transition-all duration-300 ease-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${showExpanded ? 'w-56' : 'w-16'}
        `}
      >
        {/* Logo Area */}
        <div className={`h-16 flex items-center border-b border-slate-100 ${showExpanded ? 'px-5' : 'justify-center'}`}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          {showExpanded && (
            <span className="ml-3 font-bold text-slate-900 whitespace-nowrap overflow-hidden transition-opacity duration-200">
              PashuRakshak
            </span>
          )}
        </div>

        {/* User Avatar */}
        <div className={`py-4 border-b border-slate-100 ${showExpanded ? 'px-4' : 'px-3'}`}>
          <div className={`flex items-center ${showExpanded ? 'gap-3' : 'justify-center'}`}>
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-semibold flex-shrink-0">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            {showExpanded && (
              <div className="min-w-0 overflow-hidden">
                <p className="text-sm font-medium text-slate-900 truncate">{user?.fullName}</p>
                <p className="text-xs text-slate-400 capitalize">{user?.roles?.[0]?.toLowerCase()}</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-4">
          <div className={`space-y-1 ${showExpanded ? 'px-3' : 'px-2'}`}>
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => window.innerWidth < 1024 && onClose()}
                className={({ isActive }) => `
                  group relative flex items-center rounded-xl transition-all duration-200
                  ${showExpanded ? 'px-3 py-2.5 gap-3' : 'p-3 justify-center'}
                  ${isActive
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-emerald-600' : ''}`} />
                    {showExpanded && (
                      <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
                    )}
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-emerald-500 rounded-r-full" />
                    )}
                    {/* Tooltip for collapsed state */}
                    {!showExpanded && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 text-white text-xs rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                        {item.label}
                      </div>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Bottom Section */}
        <div className={`absolute bottom-0 left-0 right-0 border-t border-slate-100 ${showExpanded ? 'p-3' : 'p-2'}`}>
          {/* Logout */}
          <button
            onClick={handleLogout}
            className={`
              group relative flex items-center w-full rounded-xl transition-all duration-200 text-slate-400 hover:bg-red-50 hover:text-red-600
              ${showExpanded ? 'px-3 py-2.5 gap-3' : 'p-3 justify-center'}
            `}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {showExpanded && (
              <span className="text-sm font-medium">Logout</span>
            )}
            {!showExpanded && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 text-white text-xs rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                Logout
              </div>
            )}
          </button>

          {/* Expand Toggle (Desktop only) */}
          <button
            onClick={onToggleExpand}
            className={`
              hidden lg:flex items-center w-full rounded-xl transition-all duration-200 text-slate-300 hover:bg-slate-50 hover:text-slate-500 mt-2
              ${showExpanded ? 'px-3 py-2 gap-3' : 'p-2 justify-center'}
            `}
          >
            {showExpanded ? (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span className="text-xs">Collapse</span>
              </>
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
