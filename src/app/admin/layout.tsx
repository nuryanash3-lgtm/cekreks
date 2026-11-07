'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/admin/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#07050d] text-white flex font-sans">
      
      {/* Sidebar dengan State Collapse */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* MAIN CONTENT WRAPPER */}
      {/* Lebar kiri otomatis menyesuaikan: pl-20 saat ciut, pl-64 saat melebar */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        isCollapsed ? 'pl-20' : 'pl-64'
      }`}>
        
        {/* Dashboard Top Header */}

        {/* Page Content dengan lebar maksimal mengikuti sisa ruang */}
        <main className="flex-1 p-6 md:p-10 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>

    </div>
  );
}