import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const MainLayout = () => {
  return (
    <div className="flex bg-[#FAF9F6] text-zinc-800 min-h-screen font-sans">
      {/* Collapsible Sidebar */}
      <Sidebar />

      {/* Main Content viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        
        {/* Page content wrapper with responsive scroll padding */}
        <main className="flex-1 p-6 overflow-y-auto max-h-[calc(100vh-4rem)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
