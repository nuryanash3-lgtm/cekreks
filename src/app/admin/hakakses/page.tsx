'use client';

import React, { useState } from 'react';
import { Shield, CheckCircle2, Edit3 } from 'lucide-react';

export default function RoleMatrixPage() {
  // Data matriks peran sesuai dengan gambar referensi
  const [roles, setRoles] = useState([
    {
      id: 'super-admin',
      title: 'Super Admin',
      userCount: '1 User',
      description: 'Akses penuh tanpa batas ke seluruh konfigurasi API, user, dan log sistem.',
      permissions: [
        'Manajemen All User',
        'Ubah Key API AI',
        'Bebas Alokasi Token',
        'Akses Raw Logs'
      ]
    },
    {
      id: 'operator-event',
      title: 'Operator Event / Client Admin',
      userCount: '3 User',
      description: 'Dikelola oleh tim mitra/EO untuk menjalankan photobooth di lokasi event.',
      permissions: [
        'Pilih Preset Style AI',
        'Monitoring Sisa Kuota Event',
        'Unduh Galeri Foto Event',
        'Reset Sesi Photobooth'
      ]
    },
    {
      id: 'end-user',
      title: 'End-User / Tenant',
      userCount: '1 User',
      description: 'Pengunjung photobooth yang mengambil foto secara langsung.',
      permissions: [
        'Ambil Foto / Scan QR',
        'Gunakan Preset AI Terpilih',
        'Download Hasil Foto'
      ]
    }
  ]);

  const handleEditMatrix = (roleTitle: string) => {
    alert(`Membuka panel pengaturan izin akses untuk peran: ${roleTitle}`);
  };

  return (
    <div className="p-4 md:p-8 text-white min-h-screen">
      
      {/* HEADER PAGE */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold tracking-wide flex items-center gap-3">
          Hak Akses & Peran (Role Matrix)
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Konfigurasi batasan wewenang untuk masing-masing level pengguna.
        </p>
      </div>

      {/* GRID KARTU ROLE MATRIX */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {roles.map((role) => (
          <div 
            key={role.id} 
            className="bg-[#0d0b14] border border-white/10 rounded-2xl p-6 flex flex-col justify-between shadow-xl relative"
          >
            <div>
              {/* Card Header & Badge User Count */}
              <div className="flex items-start justify-between gap-4 mb-3">
                <h3 className="text-lg font-bold tracking-wide">{role.title}</h3>
                <span className="px-3 py-1 bg-[#161324] border border-white/10 text-purple-300 text-xs rounded-lg font-mono">
                  {role.userCount}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-gray-400 leading-relaxed mb-6">
                {role.description}
              </p>

              {/* Permissions List */}
              <div className="mb-6">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block mb-3">
                  IZIN AKSES FITUR:
                </span>
                <ul className="space-y-3">
                  {role.permissions.map((perm, index) => (
                    <li key={index} className="flex items-center gap-2.5 text-xs text-gray-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{perm}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action Button */}
            <button 
              onClick={() => handleEditMatrix(role.title)}
              className="w-full py-3 bg-[#161324] hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition"
            >
              <Edit3 className="w-3.5 h-3.5 text-purple-400" /> Edit Matriks Akses
            </button>

          </div>
        ))}

      </div>

    </div>
  );
}