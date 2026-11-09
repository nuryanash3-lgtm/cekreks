'use client';

import React, { useState } from 'react';
import { 
  Plus, Copy, Play, Settings, Image as ImageIcon, Download, 
  Database, Trash2, Coins, Key, CheckCircle2, X, Globe, LogOut 
} from 'lucide-react';
import akunData from '@/data/daftarAkun.json';

interface EventItem {
  code: string;
  title: string;
  date: string;
  description: string;
  isPublic?: boolean;
}

export default function EventDashboardPage() {
  const [events, setEvents] = useState<EventItem[]>(
    akunData.events.map((ev) => ({ ...ev, isPublic: ev.isPublic ?? true }))
  );
  const [kredit] = useState(198);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // State untuk Modal & Form Buat Event Baru
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDesc, setNewEventDesc] = useState('');
  const [language, setLanguage] = useState<'ID' | 'EN'>('ID');

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} berhasil disalin!`);
  };

  const togglePublicStatus = (code: string) => {
    setEvents(prev =>
      prev.map(ev => {
        if (ev.code === code) {
          const newStatus = !ev.isPublic;
          showToast(`Event ${ev.title} diset menjadi ${newStatus ? 'Public' : 'Private'}`);
          return { ...ev, isPublic: newStatus };
        }
        return ev;
      })
    );
  };

  const handleDeleteEvent = (code: string, title: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus event "${title}"?`)) {
      setEvents(prev => prev.filter(ev => ev.code !== code));
      showToast(`Event ${title} berhasil dihapus!`);
    }
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) {
      showToast('Nama event tidak boleh kosong!');
      return;
    }

    // Generate random 6-character code
    const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const currentDate = new Date().toLocaleDateString('en-US');

    const newEvent: EventItem = {
      code: randomCode,
      title: newEventTitle.toUpperCase(),
      date: currentDate,
      description: newEventDesc || 'Semua bisa mengekspresikan disini',
      isPublic: true,
    };

    setEvents([newEvent, ...events]);
    setIsModalOpen(false);
    setNewEventTitle('');
    setNewEventDesc('');
    showToast(`Event ${newEvent.title} berhasil dibuat!`);
  };

  return (
    <div className="min-h-screen bg-[#07050d] text-white p-6 md:p-10 font-sans relative">
      
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#13111c] border border-purple-500/50 text-white px-4 py-3 rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.3)] animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-medium">{toastMessage}</span>
        </div>
      )}

      {/* MODAL BUAT EVENT BARU */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0d0b14] border border-white/10 w-full max-w-lg rounded-2xl p-6 shadow-[0_0_40px_rgba(168,85,247,0.2)] relative animate-scale-up">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
              <h3 className="text-lg font-extrabold tracking-wider text-white">Buat Event Baru</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent}>
              <div className="mb-4">
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Nama Event
                </label>
                <input 
                  type="text"
                  placeholder="Contoh: WEDDING PARTY"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  className="w-full bg-[#13111c] border border-white/10 focus:border-purple-500 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Deskripsi Event
                </label>
                <textarea 
                  placeholder="Tulis deskripsi singkat..."
                  value={newEventDesc}
                  onChange={(e) => setNewEventDesc(e.target.value)}
                  rows={3}
                  className="w-full bg-[#13111c] border border-white/10 focus:border-purple-500 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-xs font-bold uppercase bg-[#13111c] border border-white/10 hover:border-white/30 rounded-xl text-gray-300 transition"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2.5 text-xs font-bold uppercase bg-gradient-to-r from-[#ff4d6d] via-[#d946ef] to-[#8b5cf6] text-white rounded-xl shadow-[0_0_15px_rgba(217,70,239,0.4)] hover:scale-105 transition transform"
                >
                  Simpan Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TOP HEADER SECTION */}
      <header className="flex flex-col lg:flex-row items-start lg:items-center justify-between pb-6 mb-8 border-b border-white/10 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-wider bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
            DASHBOARD
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Selamat datang kembali, <span className="text-purple-400 font-semibold">User</span>
          </p>
        </div>

        {/* Badges & Actions (Updated like reference image) */}
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => showToast('Membuka Info Harga')}
            className="px-4 py-2 text-xs font-bold uppercase bg-[#13111c] border border-amber-500/50 text-amber-400 rounded-full hover:border-amber-500 hover:scale-105 transition shadow-[0_0_15px_rgba(245,158,11,0.2)]"
          >
            Info Harga
          </button>
          
          <button 
            onClick={() => showToast('Membuka Tutorial')}
            className="px-4 py-2 text-xs font-bold uppercase bg-[#13111c] border border-purple-500/30 text-purple-300 rounded-full hover:border-purple-500 hover:scale-105 transition"
          >
            Tutorial
          </button>

          {/* Toggle Bahasa EN / ID */}
          <div className="flex items-center bg-[#13111c] border border-white/10 rounded-full p-1">
            <button 
              onClick={() => { setLanguage('EN'); showToast('Bahasa diubah ke English'); }}
              className={`px-3 py-1 text-[11px] font-bold rounded-full transition ${language === 'EN' ? 'bg-white text-black' : 'text-gray-400'}`}
            >
              EN
            </button>
            <button 
              onClick={() => { setLanguage('ID'); showToast('Bahasa diubah ke Indonesia'); }}
              className={`px-3 py-1 text-[11px] font-bold rounded-full transition ${language === 'ID' ? 'bg-white text-black' : 'text-gray-400'}`}
            >
              ID
            </button>
          </div>

          {/* Badge Kredit */}
          <div className="flex items-center space-x-2 px-4 py-2 bg-[#13111c] border border-purple-500/40 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.15)]">
            <Coins className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-bold">{kredit} Kredit</span>
          </div>

          {/* Icon Settings */}
          <button 
            onClick={() => showToast('Membuka Pengaturan Akun')}
            className="w-9 h-9 flex items-center justify-center bg-[#13111c] border border-white/10 rounded-full hover:border-purple-500 text-gray-300 hover:text-white hover:scale-105 transition"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Icon Logout */}
          <button 
            onClick={() => showToast('Berhasil Keluar')}
            className="w-9 h-9 flex items-center justify-center bg-[#13111c] border border-white/10 rounded-full hover:border-rose-500 text-gray-300 hover:text-rose-400 hover:scale-105 transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
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
            <button 
              onClick={() => showToast('Mengarahkan ke halaman Beli Kredit')}
              className="px-4 py-1.5 text-xs font-bold uppercase bg-gradient-to-r from-[#ff4d6d] via-[#d946ef] to-[#8b5cf6] text-white rounded-lg shadow-[0_0_15px_rgba(217,70,239,0.4)] hover:scale-105 transition transform"
            >
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
            <button 
              onClick={() => showToast('Mengarahkan ke pembelian Unlimited')}
              className="px-4 py-1.5 text-xs font-bold uppercase bg-gradient-to-r from-[#ff4d6d] via-[#d946ef] to-[#8b5cf6] text-white rounded-lg shadow-[0_0_15px_rgba(217,70,239,0.4)] hover:scale-105 transition transform"
            >
              Buy Unlimited
            </button>
          </div>
        </div>
      </div>

      {/* SECTION: EVENT ANDA */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold tracking-wider">Event Anda</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 text-xs font-bold uppercase bg-gradient-to-r from-[#ff4d6d] via-[#d946ef] to-[#8b5cf6] rounded-xl shadow-[0_0_20px_rgba(217,70,239,0.4)] flex items-center gap-2 hover:scale-105 transition transform cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Buat Event
        </button>
      </div>

      {/* GRID EVENT */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* CARD BUAT EVENT BARU */}
        <div 
          onClick={() => setIsModalOpen(true)}
          className="border-2 border-dashed border-white/10 hover:border-purple-500/50 rounded-2xl p-8 flex flex-col items-center justify-center text-center min-h-[420px] bg-[#0d0b14]/50 cursor-pointer group transition hover:scale-[1.01]"
        >
          <div className="w-14 h-14 rounded-full bg-purple-500/10 group-hover:bg-purple-500/20 flex items-center justify-center text-purple-400 mb-4 transition shadow-[0_0_15px_rgba(168,85,247,0.15)] group-hover:scale-110">
            <Plus className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-base text-white tracking-wide">Buat event baru</h3>
          <p className="text-xs text-gray-400 mt-1">Mulai photobooth baru</p>
        </div>

        {/* LIST EVENT CARDS */}
        {events.map((ev) => (
          <div key={ev.code} className="bg-[#0d0b14] border border-white/10 rounded-2xl p-6 relative flex flex-col justify-between shadow-2xl hover:border-purple-500/30 transition">
            <div>
              {/* Header Card */}
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-lg font-bold tracking-widest uppercase">{ev.title}</h3>
                <span className={`w-2.5 h-2.5 rounded-full ${ev.isPublic ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]'}`} />
              </div>
              <div className="text-[11px] text-gray-500 mb-3">{ev.date}</div>
              <p className="text-xs text-gray-300 mb-4">{ev.description}</p>

              {/* TOGGLE PUBLIC EVENT */}
              <div className="flex items-center justify-between mb-4 bg-[#13111c] border border-white/5 px-3.5 py-2.5 rounded-xl">
                <span className="text-[11px] font-bold tracking-wider text-gray-300 uppercase">Public Event</span>
                <button
                  type="button"
                  onClick={() => togglePublicStatus(ev.code)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                    ev.isPublic ? 'bg-gradient-to-r from-pink-500 to-purple-600' : 'bg-gray-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      ev.isPublic ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* CODE & COPY URL ROW */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="flex items-center justify-between px-3 py-2 bg-[#13111c] border border-white/5 rounded-xl text-xs">
                  <div className="flex items-center gap-1 text-gray-400 text-[10px]">
                    <Key className="w-3 h-3 text-purple-400" />
                    <span>CODE:</span>
                  </div>
                  <span className="font-mono font-bold text-pink-400 tracking-wider">{ev.code}</span>
                  <button onClick={() => handleCopyText(ev.code, `Kode ${ev.code}`)} className="text-gray-400 hover:text-white transition">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                <button 
                  onClick={() => handleCopyText(`https://cekreks.id/event/${ev.code}`, 'URL Event')}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 bg-[#13111c] border border-white/5 rounded-xl text-xs text-gray-300 hover:text-white transition"
                >
                  <Copy className="w-3.5 h-3.5 text-purple-400" /> Copy URL
                </button>
              </div>

              {/* MULAI & PENGATURAN ROW */}
              <div className="grid grid-cols-2 gap-2 mb-2">
                <a 
                  href={`/event/${ev.code}`}
                  className="flex items-center justify-center gap-2 py-2.5 bg-[#13111c] border border-white/10 hover:border-purple-500/50 rounded-xl text-xs font-bold uppercase transition text-white"
                >
                  <Play className="w-3.5 h-3.5 fill-current text-white" /> Mulai
                </a>
                <button 
                  onClick={() => showToast(`Membuka pengaturan: ${ev.title}`)}
                  className="flex items-center justify-center gap-2 py-2.5 bg-[#13111c] border border-white/10 hover:border-purple-500/50 rounded-xl text-xs font-bold uppercase transition text-white"
                >
                  <Settings className="w-3.5 h-3.5 text-purple-400" /> Pengaturan
                </button>
              </div>

              {/* GALERI BUTTON */}
              <button 
                onClick={() => showToast(`Membuka galeri event ${ev.title}`)}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#13111c] border border-white/10 hover:border-purple-500/50 rounded-xl text-xs font-bold uppercase transition text-white mb-3"
              >
                <ImageIcon className="w-3.5 h-3.5 text-purple-400" /> Galeri
              </button>
            </div>

            {/* BOTTOM ACTIONS (ZIP, DRIVE, DELETE) */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/5">
              <button 
                onClick={() => showToast(`Mengunduh ZIP untuk ${ev.title}...`)}
                className="flex flex-col items-center justify-center p-2 bg-[#13111c] border border-blue-500/20 hover:border-blue-500/50 rounded-xl text-[10px] text-blue-400 font-medium text-center transition"
                title="Unduh Semua Data (ZIP)"
              >
                <Download className="w-4 h-4 mb-1" />
                <span className="leading-tight">Unduh Semua Data (ZIP)</span>
              </button>
              <button 
                onClick={() => showToast(`Mencadangkan ${ev.title} ke Google Drive...`)}
                className="flex flex-col items-center justify-center p-2 bg-[#13111c] border border-white/10 hover:border-purple-500/50 rounded-xl text-[10px] text-gray-300 font-medium text-center transition"
                title="Cadangkan ke Google Drive"
              >
                <Database className="w-4 h-4 mb-1 text-purple-400" />
                <span className="leading-tight">Cadangkan ke Google Drive</span>
              </button>
              <button 
                onClick={() => handleDeleteEvent(ev.code, ev.title)}
                className="flex flex-col items-center justify-center p-2 bg-[#13111c] border border-rose-500/20 hover:border-rose-500/50 rounded-xl text-[10px] text-rose-400 font-medium text-center transition"
                title="Hapus"
              >
                <Trash2 className="w-4 h-4 mb-1" />
                <span className="leading-tight">Hapus</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}