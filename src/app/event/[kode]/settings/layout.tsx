import React from 'react';
import NavbarEvent from '@/components/event/NavbarEvent';

export default function SettingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Navbar khusus halaman publik */}
      <NavbarEvent />

      {/* Konten halaman publik (Beranda & Layanan) */}
      <main className="flex-1">{children}</main>

    </>
  );
}