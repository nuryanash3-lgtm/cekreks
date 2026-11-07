'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarDays,
  Coins,
  Settings,
  Sparkles,
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

export default function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Kelola Event', href: '/dashboard/events', icon: CalendarDays },
    { name: 'Kredit & Paket', href: '/dashboard/credits', icon: Coins },
    { name: 'Pengaturan', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    /* PERBAIKAN: Hapus overflow-hidden dari <aside> utama agar tombol tidak terpotong */
    <aside className={`fixed inset-y-0 left-0 z-50 bg-[#0d0b14] border-r border-white/10 flex flex-col transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'
      }`}>

      {/* Tombol Toggle Melayang di Garis Tepi Sidebar (Kini tampil utuh) */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3.5 top-7 z-50 w-7 h-7 bg-[#161324] border border-white/15 hover:border-purple-500 rounded-full flex items-center justify-center text-gray-300 hover:text-white shadow-lg transition"
        title={isCollapsed ? "Buka Sidebar" : "Tutup Sidebar"}
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* Sidebar Header & Logo (Diberi overflow-hidden agar aman) */}
      <div className="flex items-center px-5 py-3 border-b border-white/10 overflow-hidden whitespace-nowrap">
        <Link href="/dashboard" className="flex items-center space-x-3 w-full">
          {isCollapsed ? (
            <div className="w-10 h-10 relative flex-shrink-0 mx-auto">
              <Image
                src="/images/logo/cekreks.png"
                alt="Cekreks Logo"
                fill
                className="object-contain rounded-lg"
              />
            </div>
          ) : (
            <div className="w-40 h-10 relative flex-shrink-0 mx-auto">
              <Image
                src="/images/logo/cekreks2.png"
                alt="Cekreks Logo"
                fill
                className="object-contain rounded-lg"
              />
            </div>
          )}
        </Link>
      </div>

      {/* Sidebar Menu Links */}
      <nav className="flex-1 px-3 py-6 space-y-2 overflow-hidden">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              title={isCollapsed ? item.name : undefined}
              className={`flex items-center space-x-3 px-3 py-3 rounded-xl text-xs font-semibold tracking-wider uppercase transition whitespace-nowrap ${isActive
                  ? 'bg-gradient-to-r from-[#ff4d6d]/20 via-[#d946ef]/20 to-[#8b5cf6]/20 border border-purple-500/40 text-white shadow-[0_0_15px_rgba(217,70,239,0.15)]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-pink-400' : 'text-gray-400'}`} />
              <span className={`transition-opacity duration-200 ${isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Kembali ke Website */}
      <div className="p-3 border-t border-white/10 overflow-hidden">
        <Link
          href="/"
          title={isCollapsed ? "Kembali ke Website" : undefined}
          className="flex items-center space-x-3 px-3 py-3 rounded-xl text-xs font-semibold text-gray-400 hover:text-white hover:bg-white/5 transition whitespace-nowrap"
        >
          <ExternalLink className="w-5 h-5 flex-shrink-0 text-gray-400" />
          <span className={`transition-opacity duration-200 ${isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            Kembali ke Website
          </span>
        </Link>
      </div>
    </aside>
  );
}