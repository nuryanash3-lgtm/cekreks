'use client';

import React, { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newUser: {
    name: string;
    email: string;
    phone: string;
    role: string;
    tokens: number;
  }) => void;
}

export default function CreateUserModal({ isOpen, onClose, onSave }: CreateUserModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('Operator Event');
  const [tokens, setTokens] = useState('100');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      alert('Harap isi semua kolom wajib!');
      return;
    }

    onSave({
      name,
      email,
      phone,
      role,
      tokens: parseInt(tokens, 10) || 100,
    });

    // Reset form
    setName('');
    setEmail('');
    setPhone('');
    setRole('Operator Event');
    setTokens('100');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-[#0d0b14] border border-white/10 rounded-2xl w-full max-w-lg p-6 md:p-8 shadow-2xl relative">
        
        {/* Tombol Tutup (X) */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Modal */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-white tracking-wide">
            Daftarkan Pengguna Baru
          </h3>
        </div>

        {/* Form Pendaftaran */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Nama Lengkap */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
              Nama Lengkap
            </label>
            <input 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Ahmad Fauzi"
              className="w-full px-4 py-3 bg-[#161324] border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
              Email
            </label>
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ahmad@event.id"
              className="w-full px-4 py-3 bg-[#161324] border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
              required
            />
          </div>

          {/* Nomor WhatsApp */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
              Nomor WhatsApp
            </label>
            <input 
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0812xxxxxxxx"
              className="w-full px-4 py-3 bg-[#161324] border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
              required
            />
          </div>

          {/* Role & Token Awal (Grid 2 Kolom) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Role / Peran */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                Role / Peran
              </label>
              <div className="relative">
                <select 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-3 bg-[#161324] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500 appearance-none transition cursor-pointer"
                >
                  <option value="Operator Event">Operator Event</option>
                  <option value="Client Admin">Client Admin</option>
                  <option value="Super Admin">Super Admin</option>
                </select>
                <span className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-400">
                  <ChevronDown className="w-4 h-4" />
                </span>
              </div>
            </div>

            {/* Token Awal */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                Token Awal
              </label>
              <input 
                type="number"
                value={tokens}
                onChange={(e) => setTokens(e.target.value)}
                placeholder="100"
                className="w-full px-4 py-3 bg-[#161324] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500 transition"
              />
            </div>

          </div>

          {/* Tombol Aksi */}
          <div className="flex items-center gap-3 pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 text-xs font-bold uppercase tracking-wider bg-[#161324] hover:bg-white/5 border border-white/10 text-gray-300 rounded-xl transition"
            >
              Batal
            </button>
            <button 
              type="submit"
              className="flex-1 py-3.5 text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:opacity-90 text-white rounded-xl shadow-[0_0_20px_rgba(147,51,234,0.4)] transition"
            >
              Simpan Akun
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}