'use client';

import React, { useState } from 'react';
import {
  Search,
  Coins,
  Trash2,
  UserPlus
} from 'lucide-react';
import TopupTokenModal from '@/components/admin/TopupTokenModal';
import CreateUserModal from '@/components/admin/CreateUserModal'; // Import modal buat user baru

const initialUsers = [
  {
    id: '1',
    name: 'Budi Santoso',
    email: 'budi@eventorganizer.id',
    phone: '081234567890',
    role: 'Operator Event',
    tokens: 1200,
    status: 'Aktif',
    lastActive: '2026-05-18 14:20',
  },
  {
    id: '2',
    name: 'Siti Rahma',
    email: 'siti@weddingcorp.com',
    phone: '081987654321',
    role: 'Client Admin',
    tokens: 1200,
    status: 'Ditangguhkan',
    lastActive: '2026-05-18 11:05',
  },
  {
    id: '3',
    name: 'Rian Pratama',
    email: 'rian@cekreks.id',
    phone: '085711223344',
    role: 'Super Admin',
    tokens: 9999,
    status: 'Ditangguhkan',
    lastActive: '2026-05-18 14:45',
  },
];

export default function UserManagementPage() {
  const [users, setUsers] = useState(initialUsers);
  const [searchQuery, setSearchQuery] = useState('');

  // State Modal Top-Up Token
  const [isTopupModalOpen, setIsTopupModalOpen] = useState(false);
  const [selectedUserForTopup, setSelectedUserForTopup] = useState<any>(null);

  // State Modal Tambah Pengguna Baru
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'Aktif').length;
  const totalTokens = users.reduce((acc, curr) => acc + curr.tokens, 0);

  const handleToggleStatus = (id: string) => {
    setUsers(users.map(user => {
      if (user.id === id) {
        const newStatus = user.status === 'Aktif' ? 'Ditangguhkan' : 'Aktif';
        return { ...user, status: newStatus };
      }
      return user;
    }));
  };

  const handleDeleteUser = (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus pengguna ${name}?`)) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const handleTopupSuccess = (userId: string, addedAmount: number) => {
    setUsers(users.map(u => u.id === userId ? { ...u, tokens: u.tokens + addedAmount } : u));
  };

  // Fungsi simpan pengguna baru ke state tabel
  const handleCreateUser = (newUser: { name: string; email: string; phone: string; role: string; tokens: number }) => {
    const createdUser = {
      id: String(users.length + 1),
      ...newUser,
      status: 'Aktif', // Status default ketika baru dibuat
      lastActive: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setUsers([createdUser, ...users]);
    alert(`Berhasil mendaftarkan pengguna baru: ${newUser.name}!`);
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 text-white min-h-screen">

      {/* HEADER PAGE */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-wide">
            Manajemen Pengguna
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Daftarkan, hapus, dan atur kuota status akun pengguna webapp.
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-5 py-2.5 text-xs font-bold uppercase bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-[0_0_20px_rgba(147,51,234,0.4)] hover:scale-105 transition flex items-center justify-center gap-2 self-start md:self-auto cursor-pointer"
        >
          <UserPlus className="w-4 h-4" /> Tambah Pengguna Baru
        </button>
      </div>

      {/* STATS CARDS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="p-6 bg-[#0d0b14] border border-white/10 rounded-2xl shadow-lg">
          <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">Total Pengguna</span>
          <div className="text-3xl font-black mt-3 text-white tracking-widest">{totalUsers} Akun</div>
        </div>
        <div className="p-6 bg-[#0d0b14] border border-white/10 rounded-2xl shadow-lg">
          <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">Pengguna Aktif</span>
          <div className="text-3xl font-black mt-3 text-emerald-400 tracking-widest">{activeUsers} Akun</div>
        </div>
        <div className="p-6 bg-[#0d0b14] border border-white/10 rounded-2xl shadow-lg">
          <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">Total Token Beredar</span>
          <div className="text-3xl font-black mt-3 text-yellow-400 tracking-widest">{totalTokens} Token</div>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="relative mb-6">
        <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
          <Search className="w-4 h-4" />
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari nama, email, atau role..."
          className="w-full pl-11 pr-4 py-3 bg-[#0d0b14] border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
        />
      </div>

      {/* TABLE USERS */}
      <div className="bg-[#0d0b14] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-xs text-gray-400 uppercase tracking-wider">
                <th className="py-4 px-6">Pengguna</th>
                <th className="py-4 px-6">Role / Akses</th>
                <th className="py-4 px-6">Sisa Token</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Aktivitas Terakhir</th>
                <th className="py-4 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-white/[0.02] transition">
                    <td className="py-4 px-6">
                      <div className="font-bold text-white">{user.name}</div>
                      <div className="text-xs text-gray-400">{user.email} • {user.phone}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 bg-[#161324] border border-white/10 text-purple-300 text-xs rounded-full font-medium">
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 font-bold text-yellow-400">
                        <Coins className="w-4 h-4" /> {user.tokens}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleToggleStatus(user.id)}
                        title="Klik untuk mengubah status"
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition cursor-pointer hover:opacity-80 ${user.status === 'Aktif'
                            ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                            : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
                          }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Aktif' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                        {user.status}
                      </button>
                    </td>
                    <td className="py-4 px-6 text-xs text-gray-400 font-mono">
                      {user.lastActive}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedUserForTopup(user);
                            setIsTopupModalOpen(true);
                          }}
                          title="Top-up Token"
                          className="p-2 bg-[#161324] hover:bg-white/10 rounded-lg text-yellow-400 transition cursor-pointer"
                        >
                          <Coins className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id, user.name)}
                          title="Hapus Pengguna"
                          className="p-2 bg-[#161324] hover:bg-red-500/10 rounded-lg text-rose-400 transition cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500 text-xs">
                    Tidak ada pengguna yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL TOP-UP */}
      <TopupTokenModal
        isOpen={isTopupModalOpen}
        onClose={() => setIsTopupModalOpen(false)}
        user={selectedUserForTopup}
        onSuccess={handleTopupSuccess}
      />

      {/* MODAL TAMBAH PENGGUNA BARU */}
      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateUser}
      />

    </div>
  );
}