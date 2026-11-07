'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Play, Settings, ArrowLeft } from 'lucide-react';

interface EventDetailClientProps {
  eventData: {
    title: string;
    description?: string;
    date?: string;
  };
  kode: string;
}

export default function EventDetailClient({ eventData, kode }: EventDetailClientProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#07050d] text-white flex flex-col items-center justify-center p-6 relative font-sans">
      
      {/* Tombol Kembali */}
      <button 
        onClick={() => router.push('/event')}
        className="absolute top-8 left-8 flex items-center gap-2 px-4 py-2 bg-[#13111c] border border-white/10 rounded-xl text-xs font-semibold text-gray-300 hover:text-white transition"
      >
        <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Event
      </button>

      {/* Konten Center */}
      <div className="max-w-xl w-full text-center space-y-6 bg-[#0d0b14] border border-purple-500/20 p-10 rounded-3xl shadow-[0_0_50px_rgba(168,85,247,0.15)]">
        
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-[#ff4d6d] via-[#d946ef] to-[#8b5cf6] flex items-center justify-center shadow-[0_0_20px_rgba(217,70,239,0.4)]">
          <Sparkles className="w-8 h-8 text-white" />
        </div>

        <div>
          <span className="text-xs font-mono font-bold tracking-widest text-pink-400 uppercase">
            CODE: {kode}
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-wider mt-2 mb-3 bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
            {eventData.title}
          </h1>
          <p className="text-sm text-gray-400 max-w-md mx-auto">
            {eventData.description || 'Sesi photobooth aktif dan siap dioperasikan.'}
          </p>
        </div>

        {/* 2 Tombol Utama: Launch & Setting */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          <button 
            onClick={() => alert(`Meluncurkan sesi photobooth untuk ${eventData.title}...`)}
            className="flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-[#ff4d6d] via-[#d946ef] to-[#8b5cf6] text-white font-extrabold uppercase tracking-widest rounded-2xl shadow-[0_0_20px_rgba(217,70,239,0.4)] hover:scale-105 transition"
          >
            <Play className="w-5 h-5 fill-current" /> Launch
          </button>

          <button 
            onClick={() => alert(`Membuka pengaturan untuk ${eventData.title}...`)}
            className="flex items-center justify-center gap-3 py-4 px-6 bg-[#13111c] border border-white/15 hover:border-purple-500 text-white font-extrabold uppercase tracking-widest rounded-2xl transition"
          >
            <Settings className="w-5 h-5 text-purple-400" /> Setting
          </button>
        </div>

      </div>

      <footer className="absolute bottom-6 text-center text-xs text-gray-500">
        Cekreks.id AI Photobooth Operational Panel
      </footer>
    </div>
  );
}