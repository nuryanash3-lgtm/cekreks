"use client";

import Link from "next/link";
import { Ghost, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#0d071a] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Efek Glow / Cahaya Latar Belakang */}
      <div className="absolute w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none right-10 bottom-10" />

      <div className="max-w-md w-full text-center relative z-10 space-y-6">

        {/* Kode Error 404 */}
        <div>
          <span className="text-xs font-bold tracking-widest uppercase bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Error 404
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white mt-2">
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-3 leading-relaxed">
            Sepertinya halaman yang Anda cari telah dipindahkan, dihapus, atau mungkin tidak pernah ada di tata surya ini.
          </p>
        </div>

        {/* Tombol Aksi Navigasi */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs sm:text-sm bg-cyan-400 text-gray-950 hover:bg-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.3)] transition duration-300 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs sm:text-sm bg-[#180d38] text-gray-300 border border-white/10 hover:border-cyan-400/40 hover:text-white transition duration-300 flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Halaman Sebelumnya
          </button>
        </div>

      </div>
    </main>
  );
}