'use client';

import React from 'react';
import { 
  TrendingUp, 
  Clock, 
  Sparkles, 
  CheckCircle2 
} from 'lucide-react';

export default function StatisticsPage() {
  return (
    <div className="p-4 md:p-8 text-white min-h-screen">
      
      {/* HEADER PAGE */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold tracking-wide">
          Statistik Penggunaan AI Photobooth
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Ringkasan performa sistem dan pemrosesan foto.
        </p>
      </div>

      {/* STATS CARDS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Total Foto Di-generate */}
        <div className="p-6 bg-[#0d0b14] border border-white/10 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
              Total Foto Di-generate
            </span>
            <div className="text-3xl font-black mt-3 text-white tracking-widest">
              1,248
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-white/5 text-xs font-semibold text-emerald-400">
            <TrendingUp className="w-4 h-4" /> 18% dari minggu lalu
          </div>
        </div>

        {/* Card 2: Rata-rata Waktu Render */}
        <div className="p-6 bg-[#0d0b14] border border-white/10 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
              Rata-rata Waktu Render
            </span>
            <div className="text-3xl font-black mt-3 text-white tracking-widest flex items-baseline gap-1.5">
              4.2 <span className="text-lg font-normal text-gray-400">detik</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-white/5 text-xs font-semibold text-purple-400">
            <Clock className="w-4 h-4" /> Performa optimal
          </div>
        </div>

        {/* Card 3: Preset Paling Populer */}
        <div className="p-6 bg-[#0d0b14] border border-white/10 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
              Preset Paling Populer
            </span>
            <div className="text-xl font-bold mt-3 text-purple-300 tracking-wide">
              Cyberpunk Neon
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-white/5 text-xs text-gray-400">
            <Sparkles className="w-4 h-4 text-purple-400" /> 412 x Pemakaian
          </div>
        </div>

        {/* Card 4: Tingkat Keberhasilan */}
        <div className="p-6 bg-[#0d0b14] border border-white/10 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
              Tingkat Keberhasilan
            </span>
            <div className="text-3xl font-black mt-3 text-emerald-400 tracking-widest">
              99.2%
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-white/5 text-xs text-gray-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 0.8% failure rate
          </div>
        </div>

      </div>

    </div>
  );
}