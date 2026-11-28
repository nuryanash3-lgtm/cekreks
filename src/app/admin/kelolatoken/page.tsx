'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  Coins,
  Sparkles,
  ChevronDown,
  History,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';

interface TokenUserSummary {
  id: string;
  name: string;
  email: string;
  tokenBalance: number;
}

interface TokenTransactionRow {
  id: string;
  userId: string;
  userName: string | null;
  userEmail: string | null;
  type: string;
  amount: number;
  balanceAfter: number;
  note: string | null;
  createdAt: string;
}

function formatTransactionTime(isoString: string): string {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return '-';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`;
}

export default function TokenManagementPage() {
  const [selectedUser, setSelectedUser] = useState('');
  const [tokenAmount, setTokenAmount] = useState('50');
  const [note, setNote] = useState('');

  const [userList, setUserList] = useState<TokenUserSummary[]>([]);
  const [transactions, setTransactions] = useState<TokenTransactionRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchTokenData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/admin/tokens', { cache: 'no-store' });
      const data = (await res.json().catch(() => null)) as {
        ok?: boolean;
        users?: TokenUserSummary[];
        transactions?: TokenTransactionRow[];
        error?: string;
      } | null;

      if (!res.ok || !data?.ok) {
        setErrorMessage(data?.error || 'Gagal memuat data saldo & transaksi token.');
        return;
      }

      setUserList(Array.isArray(data.users) ? data.users : []);
      setTransactions(Array.isArray(data.transactions) ? data.transactions : []);
    } catch {
      setErrorMessage('Terjadi kesalahan jaringan saat memuat data token.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadInitialTokenData() {
      try {
        const res = await fetch('/api/admin/tokens', { cache: 'no-store' });
        const data = (await res.json().catch(() => null)) as {
          ok?: boolean;
          users?: TokenUserSummary[];
          transactions?: TokenTransactionRow[];
          error?: string;
        } | null;

        if (cancelled) return;

        if (!res.ok || !data?.ok) {
          setErrorMessage(data?.error || 'Gagal memuat data saldo & transaksi token.');
          return;
        }

        setUserList(Array.isArray(data.users) ? data.users : []);
        setTransactions(Array.isArray(data.transactions) ? data.transactions : []);
      } catch {
        if (!cancelled) {
          setErrorMessage('Terjadi kesalahan jaringan saat memuat data token.');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadInitialTokenData();
    return () => {
      cancelled = true;
    };
  }, []);

  const activeUser = userList.find((u) => u.id === selectedUser) ?? null;

  const handleProcessTopUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!selectedUser) {
      setErrorMessage('Silakan pilih pengguna target terlebih dahulu.');
      return;
    }

    const parsedAmount = Number(tokenAmount);
    if (!Number.isInteger(parsedAmount) || parsedAmount === 0) {
      setErrorMessage(
        'Masukkan jumlah token yang valid (bilangan bulat bukan nol).'
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUser,
          amount: parsedAmount,
          note: note.trim() || undefined,
          type: parsedAmount > 0 ? 'topup' : 'deduct',
        }),
      });

      const data = (await res.json().catch(() => null)) as {
        ok?: boolean;
        user?: TokenUserSummary;
        transaction?: TokenTransactionRow;
        error?: string;
      } | null;

      if (!res.ok || !data?.ok || !data.user || !data.transaction) {
        setErrorMessage(data?.error || 'Gagal memproses transaksi token.');
        return;
      }

      const updatedUser = data.user;
      const newTransaction = data.transaction;

      setUserList((prev) =>
        prev.map((u) =>
          u.id === updatedUser.id
            ? { ...u, tokenBalance: updatedUser.tokenBalance }
            : u
        )
      );
      setTransactions((prev) => [newTransaction, ...prev].slice(0, 25));
      setNote('');

      const deltaText =
        parsedAmount > 0 ? `+${parsedAmount}` : `${parsedAmount}`;
      setSuccessMessage(
        `Berhasil memproses ${deltaText} token untuk ${updatedUser.name}. Saldo terbaru: ${updatedUser.tokenBalance} Token.`
      );
    } catch {
      setErrorMessage('Terjadi kesalahan jaringan saat memproses top-up token.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-8 text-white min-h-screen">
      {/* HEADER PAGE */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-wide">
            Manajemen Kuota Kredit & Token AI
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Alokasikan saldo token untuk pemrosesan AI Photobooth per pengguna atau event.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void fetchTokenData()}
          disabled={isLoading}
          className="px-4 py-2.5 text-xs font-semibold bg-[#0d0b14] border border-white/10 hover:bg-white/5 rounded-xl transition flex items-center gap-2 self-start md:self-auto disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Muat Ulang
        </button>
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

      {/* GRID LAYOUT UTAMA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* KIRI: TOP-UP TOKEN MANUAL (Span 7) */}
        <div className="lg:col-span-7 bg-[#0d0b14] border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Coins className="w-5 h-5 text-yellow-400" />
              <h2 className="text-lg font-bold tracking-wide">
                Top-Up Token Manual
              </h2>
            </div>
            <p className="text-xs text-gray-400 mb-6">
              Pilih pengguna dan masukkan kuota token yang ingin ditambahkan (atau nilai negatif untuk koreksi saldo).
            </p>

            <form onSubmit={(e) => void handleProcessTopUp(e)} className="space-y-5">
              {/* PILIH PENGGUNA TARGET */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2">
                  Pilih Pengguna Target
                </label>
                <div className="relative">
                  <select
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    disabled={isLoading || isSubmitting}
                    className="w-full px-4 py-3 bg-[#161324] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500 appearance-none transition cursor-pointer disabled:opacity-50"
                  >
                    <option value="" disabled>
                      {isLoading ? '-- Memuat Pengguna... --' : '-- Pilih User --'}
                    </option>
                    {userList.map((user) => (
                      <option
                        key={user.id}
                        value={user.id}
                        className="bg-[#161324] text-white"
                      >
                        {user.name} ({user.email}) — {user.tokenBalance} Token
                      </option>
                    ))}
                  </select>
                  <span className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-400">
                    <ChevronDown className="w-4 h-4" />
                  </span>
                </div>
                {activeUser && (
                  <p className="mt-2 text-xs text-gray-400">
                    Saldo saat ini:{' '}
                    <span className="font-bold text-yellow-400">
                      {activeUser.tokenBalance} Token
                    </span>
                  </p>
                )}
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
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 bg-[#161324] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500 transition disabled:opacity-50"
                />
              </div>

              {/* CATATAN TRANSAKSI */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2">
                  Catatan (Opsional)
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Contoh: Paket Event Wedding 500 Token"
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 bg-[#161324] border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition disabled:opacity-50"
                />
              </div>

              {/* TOMBOL PROSES */}
              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="w-full py-3.5 mt-2 text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:opacity-90 text-white rounded-xl shadow-[0_0_20px_rgba(147,51,234,0.4)] transition disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? 'Memproses...' : 'Proses Tambah Token'}
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

      {/* RIWAYAT TRANSAKSI TOKEN TERBARU */}
      <div className="mt-8 bg-[#0d0b14] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-purple-400" />
            <h2 className="text-base font-bold tracking-wide">
              Riwayat Transaksi Token Terbaru
            </h2>
          </div>
          <span className="text-xs text-gray-400">
            Menampilkan {transactions.length} transaksi terakhir
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-xs text-gray-400 uppercase tracking-wider">
                <th className="py-4 px-6">Waktu</th>
                <th className="py-4 px-6">Pengguna</th>
                <th className="py-4 px-6">Tipe</th>
                <th className="py-4 px-6">Perubahan</th>
                <th className="py-4 px-6">Saldo Akhir</th>
                <th className="py-4 px-6">Catatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {isLoading && transactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-400 text-xs">
                    Memuat riwayat transaksi token...
                  </td>
                </tr>
              ) : transactions.length > 0 ? (
                transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-white/[0.02] transition">
                    <td className="py-4 px-6 text-xs text-gray-400 font-mono whitespace-nowrap">
                      {formatTransactionTime(tx.createdAt)}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-white">
                        {tx.userName ?? 'Pengguna Terhapus'}
                      </div>
                      <div className="text-xs text-gray-400">
                        {tx.userEmail ?? tx.userId}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 bg-[#161324] border border-white/10 text-purple-300 text-xs rounded-full uppercase font-medium">
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-bold whitespace-nowrap">
                      <span
                        className={
                          tx.amount >= 0 ? 'text-emerald-400' : 'text-rose-400'
                        }
                      >
                        {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-bold text-yellow-400 whitespace-nowrap">
                      {tx.balanceAfter} Token
                    </td>
                    <td className="py-4 px-6 text-xs text-gray-300">
                      {tx.note || '-'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500 text-xs">
                    Belum ada transaksi token yang tercatat.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
