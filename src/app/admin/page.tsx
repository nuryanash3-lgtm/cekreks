'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  Copy, 
  Play, 
  Settings, 
  Image as ImageIcon, 
  Download, 
  Database, 
  Trash2, 
  Coins 
} from 'lucide-react';

const initialEvents = [
  {
    id: '1',
    title: 'ARTBOOTH',
    date: '10/17/2026',
    description: 'Semua bisa mengekspresikan disini',
    isPublic: true,
    code: '4S03UZ',
  },
  {
    id: '2',
    title: 'Wedding Party',
    date: '11/7/2026',
    description: 'Wedding At Baros',
    isPublic: true,
    code: 'K4X41Z',
  },
];

export default function DashboardPage() {
  const [events, setEvents] = useState(initialEvents);
  const [kredit] = useState(198);

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    alert(`${label} berhasil disalin!`);
  };

  const handleTogglePublic = (id: string) => {
    setEvents(events.map(ev => ev.id === id ? { ...ev, isPublic: !ev.isPublic } : ev));
  };

  const handleDeleteEvent = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus event ini?')) {
      setEvents(events.filter(ev => ev.id !== id));
    }
  };

  return (
    <div>
      {/* HEADER PAGE */}
      <div className="pb-6 mb-8 border-b border-white/10">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-wider bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
          DASHBOARD
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Selamat datang kembali, <span className="text-purple-400 font-semibold">Hafizh Muttaqin</span>
        </p>
      </div>

      {/* STATS CARDS ROW */}
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
            <div className="text-3xl font-black mt-3 text-white tracking-wider flex items-center gap-2">
              <Coins className="w-6 h-6 text-purple-400" /> {kredit}
            </div>
          </div>
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
            <span className="text-[11px] text-purple-400 cursor-pointer hover:underline">Info Harga Credit</span>
            <button className="px-4 py-1.5 text-xs font-bold uppercase bg-gradient-to-r from-[#ff4d6d] via-[#d946ef] to-[#8b5cf6] text-white rounded-lg shadow-[0_0_15px_rgba(217,70,239,0.4)] hover:scale-105 transition">
              Beli Kredit
            </button>
          </div>
        </div>

        <div className="p-6 bg-[#0d0b14] border border-white/10 rounded-2xl shadow-lg flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold tracking-wider text-gray-400 uppercase">Unlimited Time</span>
            <div className="text-2xl font-mono font-bold mt-3 text-white tracking-widest">00:00:00</div>
            <span className="text-[11px] text-gray-400 mt-1 block">Credits active</span>
          </div>
          <div className="mt-4 pt-3 border-t border-white/5 flex justify-end">
            <button className="px-4 py-1.5 text-xs font-bold uppercase bg-gradient-to-r from-[#ff4d6d] via-[#d946ef] to-[#8b5cf6] text-white rounded-lg shadow-[0_0_15px_rgba(217,70,239,0.4)] hover:scale-105 transition">
              Buy Unlimited
            </button>
          </div>
        </div>

      </div>

      {/* SECTION: EVENT ANDA */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold tracking-wider">Event Anda</h2>
        <button 
          onClick={() => alert('Fitur buat event baru akan dibuka!')}
          className="px-5 py-2.5 text-xs font-bold uppercase bg-gradient-to-r from-[#ff4d6d] via-[#d946ef] to-[#8b5cf6] rounded-xl shadow-[0_0_20px_rgba(217,70,239,0.4)] hover:scale-105 transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Buat Event
        </button>
      </div>

      {/* GRID DAFTAR EVENT */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Card Placeholder: Buat Event Baru */}
        <div className="border-2 border-dashed border-white/10 hover:border-purple-500/50 rounded-2xl p-8 flex flex-col items-center justify-center text-center min-h-[380px] bg-[#0d0b14]/50 cursor-pointer transition group">
          <div className="w-12 h-12 rounded-full bg-purple-500/10 group-hover:bg-purple-500/20 flex items-center justify-center text-purple-400 mb-4 transition">
            <Plus className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-sm text-white">Buat event baru</h3>
          <p className="text-xs text-gray-400 mt-1">Mulai photobooth baru</p>
        </div>

        {/* Mapping Daftar Event */}
        {events.map((ev) => (
          <div key={ev.id} className="bg-[#0d0b14] border border-white/10 rounded-2xl p-6 relative flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold tracking-wider">{ev.title}</h3>
                <span className={`w-2.5 h-2.5 rounded-full ${ev.isPublic ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-gray-500'}`} />
              </div>
              <div className="text-[11px] text-gray-500 mb-2">{ev.date}</div>
              <p className="text-xs text-gray-300 mb-4">{ev.description}</p>

              <div className="flex items-center justify-between p-2.5 bg-[#13111c] rounded-xl mb-4 border border-white/5">
                <span className="text-[11px] font-semibold text-gray-300 uppercase tracking-wider">Public Event</span>
                <button 
                  onClick={() => handleTogglePublic(ev.id)}
                  className={`w-9 h-5 flex items-center rounded-full p-1 transition duration-300 ${ev.isPublic ? 'bg-purple-600 justify-end' : 'bg-gray-700 justify-start'}`}
                >
                  <div className="bg-white w-3.5 h-3.5 rounded-full shadow-md" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="flex items-center justify-between px-3 py-2 bg-[#13111c] border border-white/5 rounded-xl text-xs">
                  <span className="text-gray-400 text-[10px]">CODE:</span>
                  <span className="font-mono font-bold text-pink-400 tracking-widest">{ev.code}</span>
                  <button onClick={() => handleCopyText(ev.code, `Kode ${ev.code}`)} className="text-gray-400 hover:text-white">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                <button 
                  onClick={() => handleCopyText(`https://cekreks.id/event/${ev.code}/photobooth`, 'URL Event')}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 bg-[#13111c] border border-white/5 rounded-xl text-xs text-gray-300 hover:text-white transition"
                >
                  <Copy className="w-3.5 h-3.5 text-purple-400" /> Copy URL
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3">
                <a 
                  href={`/event/${ev.code}/photobooth`}
                  className="flex items-center justify-center gap-2 py-2.5 bg-[#13111c] border border-white/10 hover:border-purple-500/50 rounded-xl text-xs font-bold uppercase transition"
                >
                  <Play className="w-3.5 h-3.5 fill-current text-white" /> Mulai
                </a>
                <button 
                  onClick={() => alert(`Buka pengaturan event: ${ev.title}`)}
                  className="flex items-center justify-center gap-2 py-2.5 bg-[#13111c] border border-white/10 hover:border-purple-500/50 rounded-xl text-xs font-bold uppercase transition"
                >
                  <Settings className="w-3.5 h-3.5 text-purple-400" /> Pengaturan
                </button>
              </div>

              <button 
                onClick={() => alert(`Membuka galeri event ${ev.title}`)}
                className="w-full py-2.5 bg-[#13111c] border border-white/10 hover:border-white/20 rounded-xl text-xs font-bold uppercase flex items-center justify-center gap-2 transition mb-3"
              >
                <ImageIcon className="w-3.5 h-3.5 text-purple-400" /> Galeri
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/5">
              <button 
                onClick={() => alert('Mengunduh semua data ZIP...')}
                className="flex flex-col items-center justify-center p-2 bg-[#13111c] hover:bg-white/5 rounded-xl text-[10px] text-gray-300 transition"
              >
                <Download className="w-3.5 h-3.5 text-blue-400 mb-1" />
                <span>Unduh ZIP</span>
              </button>
              <button 
                onClick={() => alert('Mencadangkan ke Google Drive...')}
                className="flex flex-col items-center justify-center p-2 bg-[#13111c] hover:bg-white/5 rounded-xl text-[10px] text-gray-300 transition"
              >
                <Database className="w-3.5 h-3.5 text-purple-400 mb-1" />
                <span>GDrive</span>
              </button>
              <button 
                onClick={() => handleDeleteEvent(ev.id)}
                className="flex flex-col items-center justify-center p-2 bg-[#13111c] hover:bg-red-500/10 rounded-xl text-[10px] text-red-400 transition"
              >
                <Trash2 className="w-3.5 h-3.5 mb-1" />
                <span>Hapus</span>
              </button>
            </div>

          </div>
        ))}

      </div>
    </div>
  );
}