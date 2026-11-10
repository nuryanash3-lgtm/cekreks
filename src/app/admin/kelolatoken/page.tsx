'use client';

import React, { useState } from 'react';
import { Coins, Sparkles, ChevronDown } from 'lucide-react';

export default function TokenManagementPage() {
  const [selectedUser, setSelectedUser] = useState('');
  const [tokenAmount, setTokenAmount] = useState('50');

  // Daftar dummy pengguna untuk dropdown
  const userList = [
    { id: '1', name: 'Budi Santoso (budi@eventorganizer.id)' },
    { id: '2', name: 'Siti Rahma (siti@weddingcorp.com)' },
    { id: '3', name: 'Rian Pratama (rian@cekreks.id)' },
  ];

  const handleProcessTopUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) {
      alert('Silakan pilih pengguna target terlebih dahulu!');
      return;
    }
    alert(`Berhasil menambahkan ${tokenAmount} token ke akun pengguna!`);
  };

  return (
    <div className="p-4 md:p-8 text-white min-h-screen">
      
      {/* HEADER PAGE */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold tracking-wide">
          Manajemen Kuota Kredit & Token AI
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Alokasikan saldo token untuk pemrosesan AI Photobooth per pengguna atau event.
        </p>
      </div>

      {/* GRID LAYOUT UTAMA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* KIRI: TOP-UP TOKEN MANUAL (Span 7) */}
        <div className="lg:col-span-7 bg-[#0d0b14] border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Coins className="w-5 h-5 text-yellow-400" />
              <h2 className="text-lg font-bold tracking-wide">Top-Up Token Manual</h2>
            </div>
            <p className="text-xs text-gray-400 mb-6">
              Pilih pengguna dan masukkan kuota token yang ingin ditambahkan.
            </p>

            <form onSubmit={handleProcessTopUp} className="space-y-5">
              
              {/* PILIH PENGGUNA TARGET */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2">
                  Pilih Pengguna Target
                </label>
                <div className="relative">
                  <select 
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    className="w-full px-4 py-3 bg-[#161324] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500 appearance-none transition cursor-pointer"
                  >
                    <option value="" disabled>-- Pilih User --</option>
                    {userList.map((user) => (
                      <option key={user.id} value={user.id} className="bg-[#161324] text-white">
                        {user.name}
                      </option>
                    ))}
                  </select>
                  <span className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-400">
                    <ChevronDown className="w-4 h-4" />
                  </span>
                </div>
              </div>

              {/* JUMLAH TOKEN TAMBAHAN */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2">
                  Jumlah Token Tambahan
                </label>
                <input 
                  type="number"
                  value={tokenAmount}
                  onChange={(e) => setTokenAmount(e.target.value)}
                  placeholder="Contoh: 50"
                  className="w-full px-4 py-3 bg-[#161324] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500 transition"
                />
              </div>

              {/* TOMBOL PROSES */}
              <button 
                type="submit"
                className="w-full py-3.5 mt-2 text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:opacity-90 text-white rounded-xl shadow-[0_0_20px_rgba(147,51,234,0.4)] transition"
              >
                Proses Tambah Token
              </button>

            </form>
          </div>
        </div>

        {/* KANAN: BATAS PEMAKAIAN API & TOKEN (Span 5) */}
        <div className="lg:col-span-5 bg-[#0d0b14] border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 bg-[#161324] border border-white/10 text-purple-300 text-[10px] rounded-lg font-mono flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-purple-400" /> AI Rate Limit Config
              </span>
            </div>
            
            <h2 className="text-lg font-bold tracking-wide mt-3 mb-2">
              Batas Pemakaian API & Token
            </h2>
            <p className="text-xs text-gray-400 leading-relaxed mb-6">
              Setiap eksekusi pembuatan foto AI mengonsumsi 5 token. Admin dapat mengatur aturan auto-refill atau penghentian otomatis saat batas token event tercapai.
            </p>

            {/* CARD DETAIL INFORMASI */}
            <div className="bg-[#161324] border border-white/5 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">1 Render Foto AI:</span>
                <span className="font-bold text-yellow-400">5 Token</span>
              </div>
              <div className="flex items-center justify-between text-xs pt-3 border-t border-white/5">
                <span className="text-gray-400">Peringatan Kuota Rendah:</span>
                <span className="font-bold text-rose-400">&lt; 50 Token</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5 text-[11px] text-gray-500 italic">
            * Pengaturan batas otomatis dapat disesuaikan pada file konfigurasi sistem.
          </div>
        </div>

      </div>

    </div>
  );
}