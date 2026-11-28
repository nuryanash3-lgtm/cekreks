'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  Search,
  Coins,
  Trash2,
  UserPlus,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import TopupTokenModal from '@/components/admin/TopupTokenModal';
import CreateUserModal from '@/components/admin/CreateUserModal';

interface ApiUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  status: string;
  tokenBalance: number;
  lastActiveAt: string | null;
  createdAt: string;
}

interface AdminUserRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  rawRole: string;
  tokens: number;
  status: 'Aktif' | 'Ditangguhkan';
  rawStatus: 'active' | 'suspended';
  lastActive: string;
}

const ROLE_LABELS: Record<string, string> = {
  operator: 'Operator Event',
  client_admin: 'Client Admin',
  admin: 'Super Admin',
};

function formatTimestamp(isoString: string | null): string {
  if (!isoString) return '-';
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return '-';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`;
}

function mapApiUser(user: ApiUser): AdminUserRow {
  const rawStatus: 'active' | 'suspended' =
    user.status === 'suspended' ? 'suspended' : 'active';
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone?.trim() || '-',
    role: ROLE_LABELS[user.role] ?? user.role,
    rawRole: user.role,
    tokens: Number.isFinite(user.tokenBalance) ? user.tokenBalance : 0,
    status: rawStatus === 'active' ? 'Aktif' : 'Ditangguhkan',
    rawStatus,
    lastActive: formatTimestamp(user.lastActiveAt ?? user.createdAt),
  };
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [busyUserId, setBusyUserId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // State Modal Top-Up Token
  const [isTopupModalOpen, setIsTopupModalOpen] = useState(false);
  const [selectedUserForTopup, setSelectedUserForTopup] =
    useState<AdminUserRow | null>(null);

  // State Modal Tambah Pengguna Baru
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/admin/users', { cache: 'no-store' });
      const data = (await res.json().catch(() => null)) as {
        ok?: boolean;
        users?: ApiUser[];
        error?: string;
      } | null;

      if (!res.ok || !data?.ok || !Array.isArray(data.users)) {
        setErrorMessage(data?.error || 'Gagal memuat daftar pengguna.');
        return;
      }

      setUsers(data.users.map(mapApiUser));
    } catch {
      setErrorMessage('Terjadi kesalahan jaringan saat memuat data pengguna.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadInitialUsers() {
      try {
        const res = await fetch('/api/admin/users', { cache: 'no-store' });
        const data = (await res.json().catch(() => null)) as {
          ok?: boolean;
          users?: ApiUser[];
          error?: string;
        } | null;

        if (cancelled) return;

        if (!res.ok || !data?.ok || !Array.isArray(data.users)) {
          setErrorMessage(data?.error || 'Gagal memuat daftar pengguna.');
          return;
        }

        setUsers(data.users.map(mapApiUser));
      } catch {
        if (!cancelled) {
          setErrorMessage('Terjadi kesalahan jaringan saat memuat data pengguna.');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadInitialUsers();
    return () => {
      cancelled = true;
    };
  }, []);

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === 'Aktif').length;
  const totalTokens = users.reduce((acc, curr) => acc + curr.tokens, 0);

  const handleToggleStatus = async (user: AdminUserRow) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setBusyUserId(user.id);

    const nextStatus = user.rawStatus === 'active' ? 'suspended' : 'active';

    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id, status: nextStatus }),
      });
      const data = (await res.json().catch(() => null)) as {
        ok?: boolean;
        user?: ApiUser;
        error?: string;
      } | null;

      if (!res.ok || !data?.ok || !data.user) {
        setErrorMessage(data?.error || 'Gagal mengubah status pengguna.');
        return;
      }

      const updatedRow = mapApiUser(data.user);
      setUsers((prev) =>
        prev.map((item) => (item.id === updatedRow.id ? updatedRow : item))
      );
      setSuccessMessage(
        `Status ${updatedRow.name} diperbarui menjadi ${updatedRow.status}.`
      );
    } catch {
      setErrorMessage('Terjadi kesalahan jaringan saat mengubah status pengguna.');
    } finally {
      setBusyUserId(null);
    }
  };

  const handleDeleteUser = async (user: AdminUserRow) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus pengguna ${user.name}?`)) {
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);
    setBusyUserId(user.id);

    try {
      const res = await fetch(
        `/api/admin/users?id=${encodeURIComponent(user.id)}`,
        {
          method: 'DELETE',
        }
      );
      const data = (await res.json().catch(() => null)) as {
        ok?: boolean;
        deletedId?: string;
        error?: string;
      } | null;

      if (!res.ok || !data?.ok) {
        setErrorMessage(data?.error || 'Gagal menghapus pengguna.');
        return;
      }

      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      setSuccessMessage(`Pengguna ${user.name} berhasil dihapus.`);
    } catch {
      setErrorMessage('Terjadi kesalahan jaringan saat menghapus pengguna.');
    } finally {
      setBusyUserId(null);
    }
  };

  const handleTopupSuccess = async (userId: string, addedAmount: number) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setBusyUserId(userId);

    try {
      const res = await fetch('/api/admin/tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          amount: addedAmount,
          type: 'topup',
          note: 'Top-up dari halaman Manajemen Pengguna',
        }),
      });

      const data = (await res.json().catch(() => null)) as {
        ok?: boolean;
        user?: { id: string; name: string; tokenBalance: number };
        error?: string;
      } | null;

      if (!res.ok || !data?.ok || !data.user) {
        setErrorMessage(data?.error || 'Gagal memproses top-up token.');
        await fetchUsers();
        return;
      }

      const updatedBalance = data.user.tokenBalance;
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, tokens: updatedBalance } : u
        )
      );
      setSuccessMessage(
        `Saldo ${data.user.name} berhasil ditambahkan +${addedAmount} token.`
      );
    } catch {
      setErrorMessage('Terjadi kesalahan jaringan saat top-up token.');
      await fetchUsers();
    } finally {
      setBusyUserId(null);
    }
  };

  const handleCreateUser = async (newUser: {
    name: string;
    email: string;
    phone: string;
    role: string;
    tokens: number;
  }) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsCreating(true);

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });

      const data = (await res.json().catch(() => null)) as {
        ok?: boolean;
        user?: ApiUser;
        error?: string;
      } | null;

      if (!res.ok || !data?.ok || !data.user) {
        setErrorMessage(data?.error || 'Gagal mendaftarkan pengguna baru.');
        return;
      }

      const createdRow = mapApiUser(data.user);
      setUsers((prev) => [createdRow, ...prev]);
      setSuccessMessage(`Berhasil mendaftarkan pengguna baru: ${createdRow.name}.`);
    } catch {
      setErrorMessage('Terjadi kesalahan jaringan saat mendaftarkan pengguna.');
    } finally {
      setIsCreating(false);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
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
        <div className="flex items-center gap-3 self-start md:self-auto">
          <button
            type="button"
            onClick={() => void fetchUsers()}
            disabled={isLoading}
            className="px-4 py-2.5 text-xs font-semibold bg-[#0d0b14] border border-white/10 hover:bg-white/5 rounded-xl transition flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Muat Ulang
          </button>
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            disabled={isCreating}
            className="px-5 py-2.5 text-xs font-bold uppercase bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-[0_0_20px_rgba(147,51,234,0.4)] hover:scale-105 transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" /> Tambah Pengguna Baru
          </button>
        </div>
      </div>

      {/* FEEDBACK BANNERS */}
      {errorMessage && (
        <div className="mb-6 flex items-center justify-between gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-xs text-rose-200 hover:text-white cursor-pointer"
          >
            Tutup
          </button>
        </div>
      )}

      {successMessage && (
        <div className="mb-6 flex items-center justify-between gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessMessage(null)}
            className="text-xs text-emerald-200 hover:text-white cursor-pointer"
          >
            Tutup
          </button>
        </div>
      )}

      {/* STATS CARDS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="p-6 bg-[#0d0b14] border border-white/10 rounded-2xl shadow-lg">
          <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
            Total Pengguna
          </span>
          <div className="text-3xl font-black mt-3 text-white tracking-widest">
            {totalUsers} Akun
          </div>
        </div>
        <div className="p-6 bg-[#0d0b14] border border-white/10 rounded-2xl shadow-lg">
          <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
            Pengguna Aktif
          </span>
          <div className="text-3xl font-black mt-3 text-emerald-400 tracking-widest">
            {activeUsers} Akun
          </div>
        </div>
        <div className="p-6 bg-[#0d0b14] border border-white/10 rounded-2xl shadow-lg">
          <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
            Total Token Beredar
          </span>
          <div className="text-3xl font-black mt-3 text-yellow-400 tracking-widest">
            {totalTokens} Token
          </div>
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
              {isLoading && users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-400 text-xs">
                    Memuat data pengguna dari database...
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => {
                  const isRowBusy = busyUserId === user.id;
                  return (
                    <tr key={user.id} className="hover:bg-white/[0.02] transition">
                      <td className="py-4 px-6">
                        <div className="font-bold text-white">{user.name}</div>
                        <div className="text-xs text-gray-400">
                          {user.email} • {user.phone}
                        </div>
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
                          type="button"
                          onClick={() => void handleToggleStatus(user)}
                          disabled={isRowBusy}
                          title="Klik untuk mengubah status"
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition cursor-pointer hover:opacity-80 disabled:opacity-50 ${
                            user.status === 'Aktif'
                              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                              : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              user.status === 'Aktif'
                                ? 'bg-emerald-400'
                                : 'bg-rose-400'
                            }`}
                          />
                          {user.status}
                        </button>
                      </td>
                      <td className="py-4 px-6 text-xs text-gray-400 font-mono">
                        {user.lastActive}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedUserForTopup(user);
                              setIsTopupModalOpen(true);
                            }}
                            disabled={isRowBusy}
                            title="Top-up Token"
                            className="p-2 bg-[#161324] hover:bg-white/10 rounded-lg text-yellow-400 transition disabled:opacity-50 cursor-pointer"
                          >
                            <Coins className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleDeleteUser(user)}
                            disabled={isRowBusy}
                            title="Hapus Pengguna"
                            className="p-2 bg-[#161324] hover:bg-red-500/10 rounded-lg text-rose-400 transition disabled:opacity-50 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
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
