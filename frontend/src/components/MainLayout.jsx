import React from 'react';
import Sidebar from './Layout/Sidebar';
import Navbar from './Layout/Navbar';

// --- Main Layout (Bố cục chính) ---
const MainLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <div className="h-auto w-54 bg-white shadow-xl flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="pb-2 pt-1 px-5 md:px-5 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;