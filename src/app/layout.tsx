import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingAIAgent from "@/components/modal/FloatingAIAgent";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cekreks.id - Solusi Dokumentasi Terintegrasi",
  description: "Layanan dokumentasi foto & video pernikahan, graduation, dan event profesional.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#070312] text-white relative">
        {/* Navbar akan selalu tampil di semua halaman */}
        <Navbar />

        {/* Isi halaman (Beranda / Detail Wedding) */}
        <main className="flex-1">{children}</main>

        {/* Footer akan otomatis ikut di paling bawah semua halaman */}
        <Footer />

        {/* 2. Floating AI Agent yang melayang di kanan bawah secara global */}
        <FloatingAIAgent />
      </body>
    </html>
  );
}