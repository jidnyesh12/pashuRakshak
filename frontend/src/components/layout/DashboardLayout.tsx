import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopHeader from './TopHeader';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      <TopHeader 
        onMenuClick={() => setIsSidebarOpen(true)} 
      />

      <main className="lg:pl-64 pt-16 min-h-screen transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
