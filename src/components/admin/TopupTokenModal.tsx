'use client';

import React, { useState } from 'react';
import { X, Coins } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  tokens: number;
}

interface TopupTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSuccess: (userId: string, addedAmount: number) => void;
}

export default function TopupTokenModal({ isOpen, onClose, user, onSuccess }: TopupTokenModalProps) {
  const [amount, setAmount] = useState('50');

  if (!isOpen || !user) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseInt(amount, 10);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('Masukkan jumlah token yang valid!');
      return;
    }

    onSuccess(user.id, parsedAmount);
    alert(`Berhasil menambahkan ${parsedAmount} token untuk ${user.name}!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-[#0d0b14] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
        
        {/* Tombol Tutup (X) */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Modal */}
        <div className="mb-5">
          <h3 className="text-lg font-bold text-white tracking-wide">
            Top-Up Token Pengguna
          </h3>
          <p className="text-xs text-gray-400 mt-1 leading-relaxed">
            Menambahkan saldo token untuk <span className="text-white font-semibold">{user.name}</span>. Sisa saat ini: <span className="text-yellow-400 font-bold">{user.tokens} Token</span>.
          </p>
        </div>

        {/* Form Input */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2">
              Jumlah Tambahan Token
            </label>
            <input 
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Contoh: 50"
              className="w-full px-4 py-3 bg-[#161324] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500 transition"
              autoFocus
            />
          </div>

          {/* Tombol Aksi */}
          <div className="flex items-center gap-3 pt-2">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-3 text-xs font-bold uppercase tracking-wider bg-[#161324] hover:bg-white/5 border border-white/10 text-gray-300 rounded-xl transition"
            >
              Batal
            </button>
            <button 
              type="submit"
              className="flex-1 py-3 text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:opacity-90 text-black font-extrabold rounded-xl shadow-[0_0_20px_rgba(234,179,8,0.4)] transition"
            >
              Tambah Token
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}