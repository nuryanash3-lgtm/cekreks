'use client';

import React, { useState } from 'react';
import { Plus, Copy, Play, Settings, Image as ImageIcon, Download, Database, Trash2, Coins } from 'lucide-react';
import akunData from '@/data/daftarAkun.json';

export default function EventDashboardPage() {
  const [events, setEvents] = useState(akunData.events);
  const [kredit] = useState(198);

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    alert(`${label} berhasil disalin!`);
  };

  return (
    <div className="min-h-screen bg-[#07050d] text-white p-6 md:p-10 font-sans">
      
      {/* TOP HEADER SECTION */}
      <header className="flex flex-col lg:flex-row items-start lg:items-center justify-between pb-6 mb-8 border-b border-white/10 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-wider bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
            DASHBOARD
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Selamat datang kembali, <span className="text-purple-400 font-semibold">Hafizh Muttaqin</span>
          </p>
        </div>

        {/* Badges & Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <button className="px-4 py-2 text-xs font-bold uppercase bg-[#13111c] border border-purple-500/30 rounded-full hover:border-purple-500 transition">
            Whitelabel
          </button>
          <button className="px-4 py-2 text-xs font-bold uppercase bg-gradient-to-r from-amber-500 to-yellow-600 text-black rounded-full shadow-[0_0_15px_rgba(245,158,11,0.3)]">
            Info Harga
          </button>
          <div className="flex items-center space-x-2 px-4 py-2 bg-[#13111c] border border-purple-500/40 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.15)]">
            <Coins className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-bold">{kredit} Kredit</span>
          </div>
        </div>
      </header>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="p-6 bg-[#0d0b14] border border-white/10 rounded-2xl shadow-lg">
          <span className="text-xs font-bold tracking-wider text-gray-400 uppercase">Total Event</span>
          <div className="text-4xl font-black mt-3 text-white tracking-widest">{events.length}</div>
        </div>
        <div className="p-6 bg-[#0d0b14] border border-white/10 rounded-2xl shadow-lg flex flex-col justify-between">
          <span className="text-xs font-bold tracking-wider text-gray-400 uppercase">Paket Saat Ini</span>
          <div className="text-3xl font-black mt-3 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent italic tracking-wider">
            Free
          </div>
        </div>
        <div className="p-6 bg-[#0d0b14] border border-white/10 rounded-2xl shadow-lg flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold tracking-wider text-gray-400 uppercase">Kredit Tersedia</span>
            <div className="text-3xl font-black mt-3 text-white tracking-wider">{kredit}</div>
          </div>
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
            <span className="text-[11px] text-purple-400 cursor-pointer hover:underline">Info Harga Credit</span>
            <button className="px-4 py-1.5 text-xs font-bold uppercase bg-gradient-to-r from-[#ff4d6d] via-[#d946ef] to-[#8b5cf6] text-white rounded-lg shadow-[0_0_15px_rgba(217,70,239,0.4)]">
              Beli Kredit
            </button>
          </div>
        </div>
        <div className="p-6 bg-[#0d0b14] border border-white/10 rounded-2xl shadow-lg flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold tracking-wider text-gray-400 uppercase">Unlimited Time</span>
            <div className="text-2xl font-mono font-bold mt-3 text-white tracking-widest">00:00:00</div>
          </div>
          <div className="mt-4 pt-3 border-t border-white/5 flex justify-end">
            <button className="px-4 py-1.5 text-xs font-bold uppercase bg-gradient-to-r from-[#ff4d6d] via-[#d946ef] to-[#8b5cf6] text-white rounded-lg shadow-[0_0_15px_rgba(217,70,239,0.4)]">
              Buy Unlimited
            </button>
          </div>
        </div>
      </div>

      {/* SECTION: EVENT ANDA */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold tracking-wider">Event Anda</h2>
        <button className="px-5 py-2.5 text-xs font-bold uppercase bg-gradient-to-r from-[#ff4d6d] via-[#d946ef] to-[#8b5cf6] rounded-xl shadow-[0_0_20px_rgba(217,70,239,0.4)] flex items-center gap-2">
          <Plus className="w-4 h-4" /> Buat Event
        </button>
      </div>

      {/* GRID EVENT */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="border-2 border-dashed border-white/10 hover:border-purple-500/50 rounded-2xl p-8 flex flex-col items-center justify-center text-center min-h-[380px] bg-[#0d0b14]/50 cursor-pointer group">
          <div className="w-12 h-12 rounded-full bg-purple-500/10 group-hover:bg-purple-500/20 flex items-center justify-center text-purple-400 mb-4 transition">
            <Plus className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-sm text-white">Buat event baru</h3>
        </div>

        {events.map((ev) => (
          <div key={ev.code} className="bg-[#0d0b14] border border-white/10 rounded-2xl p-6 relative flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold tracking-wider">{ev.title}</h3>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              </div>
              <div className="text-[11px] text-gray-500 mb-2">{ev.date}</div>
              <p className="text-xs text-gray-300 mb-4">{ev.description}</p>

              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="flex items-center justify-between px-3 py-2 bg-[#13111c] border border-white/5 rounded-xl text-xs">
                  <span className="text-gray-400 text-[10px]">CODE:</span>
                  <span className="font-mono font-bold text-pink-400 tracking-widest">{ev.code}</span>
                  <button onClick={() => handleCopyText(ev.code, `Kode ${ev.code}`)} className="text-gray-400 hover:text-white">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                <button 
                  onClick={() => handleCopyText(`https://cekreks.id/event/${ev.code}`, 'URL Event')}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 bg-[#13111c] border border-white/5 rounded-xl text-xs text-gray-300 hover:text-white"
                >
                  <Copy className="w-3.5 h-3.5 text-purple-400" /> Copy URL
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3">
                <a 
                  href={`/event/${ev.code}`}
                  className="flex items-center justify-center gap-2 py-2.5 bg-[#13111c] border border-white/10 hover:border-purple-500/50 rounded-xl text-xs font-bold uppercase transition"
                >
                  <Play className="w-3.5 h-3.5 fill-current text-white" /> Mulai
                </a>
                <button 
                  onClick={() => alert(`Pengaturan event: ${ev.title}`)}
                  className="flex items-center justify-center gap-2 py-2.5 bg-[#13111c] border border-white/10 hover:border-purple-500/50 rounded-xl text-xs font-bold uppercase transition"
                >
                  <Settings className="w-3.5 h-3.5 text-purple-400" /> Pengaturan
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}