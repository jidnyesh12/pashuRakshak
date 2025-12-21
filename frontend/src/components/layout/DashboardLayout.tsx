import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopHeader from './TopHeader';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  role?: string;
  fullScreen?: boolean;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, fullScreen = false }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isExpanded={isSidebarExpanded}
        onToggleExpand={() => setIsSidebarExpanded(!isSidebarExpanded)}
      />

      <TopHeader
        onMenuClick={() => setIsSidebarOpen(true)}
        isSidebarExpanded={isSidebarExpanded}
      />

      {/* Main Content - Adjusts based on rail width */}
      <main 
        className={`
          pt-16 min-h-screen transition-all duration-300 ease-out
          lg:pl-16
        `}
      >
        <div className={
          fullScreen 
            ? "h-[calc(100vh-64px)] overflow-hidden" 
            : "max-w-7xl mx-auto px-6 lg:px-8 py-8"
        }>
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
