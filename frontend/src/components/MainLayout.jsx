import React, { useState } from 'react';
import Sidebar from './Layout/Sidebar';
import Navbar from './Layout/Navbar';

// --- Main Layout (Bố cục chính) ---
const MainLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <div className="h-auto w-54 bg-white shadow-xl">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-auto">
        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="py-2 px-5 md:px-5 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;