"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { Save, ArrowLeft } from "lucide-react";

function NavLinks() {
  const pathname = usePathname();

  // Ekstrak kode event dari URL (misal: /event/4S03UZ/settings)
  const pathSegments = pathname.split("/");
  const eventCode = pathSegments[2] || "4S03UZ";

  const navItems = [
    { name: "Settings", href: `/event/${eventCode}/settings` },
    { name: "Concepts", href: `/event/${eventCode}/settings/concepts` },
    { name: "Interactive Flow", href: `/event/${eventCode}/settings/interactive-flow` },
  ];

  return (
    <nav className="hidden md:flex items-center bg-[#130d22] border border-white/10 rounded-full p-1.5 space-x-1 shadow-inner">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`px-5 py-2 rounded-full text-xs font-bold tracking-wider transition-all duration-200 ${
              isActive
                ? "bg-gradient-to-r from-[#9d4edd] to-[#7b2cbf] text-white shadow-[0_0_15px_rgba(157,78,221,0.5)]"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}

export default function NavbarEvent() {
  return (
    <header className="w-full bg-[#070312] border-b border-white/10 px-6 py-4 flex items-center justify-between text-white select-none">
      {/* Kiri: Judul / Logo */}
      <div className="flex items-center">
        <span className="font-black tracking-wider text-xl text-white">
          Settings
        </span>
      </div>

      {/* Tengah: Menu Navigasi dibungkus Suspense */}
      <Suspense fallback={<div className="h-10 w-72 bg-white/5 rounded-full animate-pulse" />}>
        <NavLinks />
      </Suspense>

      {/* Kanan: Tombol Aksi (Save & Back) */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => alert("Concept Saved!")}
          className="flex items-center space-x-2 bg-gradient-to-r from-[#9d4edd] to-[#7b2cbf] hover:opacity-90 text-white px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider shadow-[0_0_20px_rgba(157,78,221,0.4)] transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Concept</span>
        </button>

        <button
          onClick={() => (window.location.href = "/event")}
          className="flex items-center space-x-2 bg-[#130d22] hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      </div>
    </header>
  );
}