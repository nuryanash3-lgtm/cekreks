import React from 'react';
import Navbar from "@/components/landing/layout/Navbar";
import Footer from "@/components/landing/layout/Footer";
import FloatingAIAgent from "@/components/modal/FloatingAIAgent";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Navbar khusus halaman publik */}
      <Navbar />

      {/* Konten halaman publik (Beranda & Layanan) */}
      <main className="flex-1">{children}</main>

      {/* Footer khusus halaman publik */}
      <Footer />

      {/* Floating AI Agent khusus halaman publik */}
      <FloatingAIAgent />
    </>
  );
}