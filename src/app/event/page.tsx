'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus, Copy, Play, Image as ImageIcon, Download, Settings,
  Database, Trash2, Coins, Key, CheckCircle2, X, LogOut, AlertTriangle,
  User2
} from 'lucide-react';

interface EventApiRecord {
  id: string;
  ownerId: string;
  code: string;
  title: string;
  description: string | null;
  eventDate: string | null;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  companyName: string | null;
  city: string | null;
  country: string | null;
  planName: string;
  tokenBalance: number;
  unlimitedUntil: string | null;
}

interface EventItem {
  id: string;
  code: string;
  title: string;
  date: string;
  description: string;
  isPublic: boolean;
}

function formatEventDate(eventDate: string | null, createdAt: string): string {
  const source = eventDate || createdAt;
  const parsed = new Date(source);
  if (Number.isNaN(parsed.getTime())) {
    return new Date().toLocaleDateString('en-US');
  }
  return parsed.toLocaleDateString('en-US');
}

function mapApiEventToItem(ev: EventApiRecord): EventItem {
  return {
    id: ev.id,
    code: ev.code,
    title: ev.title,
    date: formatEventDate(ev.eventDate, ev.createdAt),
    description: ev.description || 'Semua bisa mengekspresikan disini',
    isPublic: ev.isPublic,
  };
}

export default function EventDashboardPage() {
  const router = useRouter();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [kredit, setKredit] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // State untuk Modal & Form Buat Event Baru
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDesc, setNewEventDesc] = useState('');
  const [language, setLanguage] = useState<'ID' | 'EN'>('ID');

  // State untuk Modal Peringatan Public Event
  const [isPublicModalOpen, setIsPublicModalOpen] = useState(false);
  const [pendingEventCode, setPendingEventCode] = useState<string | null>(null);
  const [isCheckedAgreement, setIsCheckedAgreement] = useState(false);

  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      try {
        const res = await fetch('/api/events', { cache: 'no-store' });
        if (res.status === 401) {
          router.push('/?login=required');
          return;
        }

        const data = (await res.json().catch(() => null)) as {
          ok?: boolean;
          error?: string;
          user?: UserProfile;
          events?: EventApiRecord[];
        } | null;

        if (!res.ok || !data?.ok) {
          throw new Error(data?.error || 'Gagal memuat daftar event.');
        }

        if (cancelled) return;

        setEvents(Array.isArray(data.events) ? data.events.map(mapApiEventToItem) : []);
        if (data.user) {
          setUserProfile(data.user);
          setKredit(typeof data.user.tokenBalance === 'number' ? data.user.tokenBalance : 0);
        }
      } catch (error) {
        if (!cancelled) {
          console.error('Gagal memuat data event dari server', error);
          showToast(error instanceof Error ? error.message : 'Gagal memuat data event.');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, [router, showToast]);

  const handleAccountSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const oldPassword = String(formData.get('oldPassword') ?? '');
    const newPassword = String(formData.get('newPassword') ?? '');
    const confirmPassword = String(formData.get('confirmPassword') ?? '');

    if ((newPassword || confirmPassword) && !oldPassword) {
      showToast('Masukkan password lama untuk mengubah password.');
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast('Konfirmasi password baru tidak cocok.');
      return;
    }

    showToast('Form siap. Penyimpanan perubahan perlu dihubungkan ke backend.');
  };

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} berhasil disalin!`);
  };

  const handleToggleClick = async (ev: EventItem) => {
    if (!ev.isPublic) {
      setPendingEventCode(ev.code);
      setIsCheckedAgreement(false);
      setIsPublicModalOpen(true);
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/events/${encodeURIComponent(ev.code)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublic: false }),
      });
      const data = (await res.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
        event?: EventApiRecord;
      } | null;

      if (!res.ok || !data?.ok || !data.event) {
        throw new Error(data?.error || 'Gagal mengubah status event.');
      }

      const updated = mapApiEventToItem(data.event);
      setEvents((prev) =>
        prev.map((item) => (item.code === ev.code ? updated : item))
      );
      showToast(`Event ${updated.title} diset menjadi Private`);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Gagal mengubah status event.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmEnablePublic = async () => {
    if (!pendingEventCode || isSubmitting) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/events/${encodeURIComponent(pendingEventCode)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublic: true, regenerateCode: true }),
      });
      const data = (await res.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
        event?: EventApiRecord;
      } | null;

      if (!res.ok || !data?.ok || !data.event) {
        throw new Error(data?.error || 'Gagal mengaktifkan Event Publik.');
      }

      const updated = mapApiEventToItem(data.event);
      setEvents((prev) =>
        prev.map((item) => (item.code === pendingEventCode ? updated : item))
      );
      showToast(`Event ${updated.title} diset menjadi Public dengan kode baru!`);
      setIsPublicModalOpen(false);
      setPendingEventCode(null);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Gagal mengaktifkan Event Publik.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEvent = async (code: string, title: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus event "${title}"?`)) {
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/events/${encodeURIComponent(code)}`, {
        method: 'DELETE',
      });
      const data = (await res.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
      } | null;

      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || 'Gagal menghapus event.');
      }

      setEvents((prev) => prev.filter((ev) => ev.code !== code));
      showToast(`Event ${title} berhasil dihapus!`);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Gagal menghapus event.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) {
      showToast('Nama event tidak boleh kosong!');
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newEventTitle.trim().toUpperCase(),
          description: newEventDesc.trim() || 'Semua bisa mengekspresikan disini',
        }),
      });
      const data = (await res.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
        event?: EventApiRecord;
      } | null;

      if (!res.ok || !data?.ok || !data.event) {
        throw new Error(data?.error || 'Gagal membuat event baru.');
      }

      const created = mapApiEventToItem(data.event);
      setEvents((prev) => [created, ...prev]);
      setIsModalOpen(false);
      setNewEventTitle('');
      setNewEventDesc('');
      showToast(`Event ${created.title} berhasil dibuat sebagai Private!`);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Gagal membuat event baru.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#07050d] text-white p-6 md:p-10 font-sans relative">

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#13111c] border border-purple-500/50 text-white px-4 py-3 rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.3)] animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-medium">{toastMessage}</span>
        </div>
      )}

      {isAccountModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setIsAccountModalOpen(false)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="account-modal-title"
            className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/15 bg-[#101010] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Tutup pengaturan akun"
              onClick={() => setIsAccountModalOpen(false)}
              className="absolute right-5 top-5 text-gray-400 transition hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-6">
              <h2 id="account-modal-title" className="text-xl flex items-center font-extrabold">
                <User2 className="mr-2 text-fuchsia-500" />
                Account Settings
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-gray-400">
                Update your account details and password. Email and phone number
                cannot be changed.
              </p>
            </div>

            <form onSubmit={handleAccountSave} className="space-y-4">
              <div>
                <label htmlFor="account-name" className="mb-1.5 block text-xs font-bold">
                  Name
                </label>
                <input
                  id="account-name"
                  name="name"
                  defaultValue={userProfile?.name ?? 'User'}
                  className="w-full rounded-xl border border-white/20 bg-black/50 px-3 py-3 text-sm outline-none focus:border-fuchsia-500"
                />
              </div>

              <div>
                <label htmlFor="company-name" className="mb-1.5 block text-xs font-bold">
                  Company Name
                </label>
                <input
                  id="company-name"
                  name="companyName"
                  defaultValue={userProfile?.companyName ?? 'CekreksID'}
                  className="w-full rounded-xl border border-white/20 bg-black/50 px-3 py-3 text-sm outline-none focus:border-fuchsia-500"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="account-city" className="mb-1.5 block text-xs font-bold">
                    Kota / Kabupaten
                  </label>
                  <input
                    id="account-city"
                    name="city"
                    defaultValue={userProfile?.city ?? 'Bandung'}
                    className="w-full rounded-xl border border-white/20 bg-black/50 px-3 py-3 text-sm outline-none focus:border-fuchsia-500"
                  />
                </div>
                <div>
                  <label htmlFor="account-country" className="mb-1.5 block text-xs font-bold">
                    Country
                  </label>
                  <input
                    id="account-country"
                    name="country"
                    defaultValue={userProfile?.country ?? 'Indonesia'}
                    className="w-full rounded-xl border border-white/20 bg-black/50 px-3 py-3 text-sm outline-none focus:border-fuchsia-500"
                  />
                </div>
              </div>

              <div className="border-t border-white/10 pt-4">
                <h3 className="mb-4 text-sm font-bold">Change Password</h3>

                <label htmlFor="old-password" className="mb-1.5 block text-xs font-bold">
                  Old Password
                </label>
                <input
                  id="old-password"
                  name="oldPassword"
                  type="password"
                  placeholder="Required if changing password"
                  autoComplete="current-password"
                  className="mb-4 w-full rounded-xl border border-white/20 bg-black/50 px-3 py-3 text-sm outline-none focus:border-fuchsia-500"
                />

                <label htmlFor="new-password" className="mb-1.5 block text-xs font-bold">
                  New Password (Optional)
                </label>
                <input
                  id="new-password"
                  name="newPassword"
                  type="password"
                  placeholder="Leave blank to keep current password"
                  autoComplete="new-password"
                  className="mb-4 w-full rounded-xl border border-white/20 bg-black/50 px-3 py-3 text-sm outline-none focus:border-fuchsia-500"
                />

                <label htmlFor="confirm-password" className="mb-1.5 block text-xs font-bold">
                  Confirm New Password
                </label>
                <input
                  id="confirm-password"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-white/20 bg-black/50 px-3 py-3 text-sm outline-none focus:border-fuchsia-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAccountModalOpen(false)}
                  className="rounded-full bg-zinc-800 px-5 py-2.5 text-xs font-bold hover:bg-zinc-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-fuchsia-600 px-5 py-2.5 text-xs font-bold hover:bg-fuchsia-500"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {/* MODAL PERINGATAN PUBLIC EVENT */}
      {isPublicModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0b061a] border border-purple-500/40 w-full max-w-lg rounded-2xl p-6 shadow-[0_0_40px_rgba(168,85,247,0.25)] relative">
            <div className="flex items-center gap-3 pb-3 mb-4 border-b border-white/10">
              <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold tracking-wide text-white">Peringatan Akses Event Publik</h3>
                <p className="text-[11px] text-gray-400">Harap baca ketentuan sebelum mengaktifkan mode publik.</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-gray-300 leading-relaxed mb-6">
              <p>
                Ketika Event Publik diaktifkan, siapa saja yang memiliki tautan (URL) ini dapat membuka dan menjalankan aktivitas photobooth tanpa harus masuk (login).
              </p>
              <p className="font-semibold text-purple-300">
                Setiap proses generasi akan mengonsumsi dan memotong kredit dari akun Anda. Oleh karena itu:
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-gray-400 pl-1">
                <li>Bagikan tautan hanya kepada pihak yang dipercaya.</li>
                <li>Jangan bagikan tautan di tempat umum kecuali diperlukan.</li>
                <li>Pantau penggunaan kredit selama Event Publik aktif.</li>
                <li>Nonaktifkan Event Publik segera setelah acara selesai atau saat tautan tidak lagi diperlukan.</li>
              </ul>

              <div className="mt-4 p-3 rounded-xl bg-[#130d22] border border-white/10 flex items-start gap-3 cursor-pointer" onClick={() => setIsCheckedAgreement(!isCheckedAgreement)}>
                <input
                  type="checkbox"
                  checked={isCheckedAgreement}
                  onChange={(e) => setIsCheckedAgreement(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-purple-600 rounded cursor-pointer"
                />
                <span className="text-[11px] text-gray-200 select-none">
                  Saya memahami risiko dan bertanggung jawab penuh atas penggunaan kredit melalui tautan publik ini.
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => { setIsPublicModalOpen(false); setPendingEventCode(null); }}
                className="px-5 py-2 text-xs font-bold uppercase bg-[#130d22] border border-white/10 hover:border-white/30 rounded-xl text-gray-300 transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={!isCheckedAgreement || isSubmitting}
                onClick={confirmEnablePublic}
                className={`px-5 py-2 text-xs font-bold uppercase rounded-xl transition ${isCheckedAgreement && !isSubmitting
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:scale-105 cursor-pointer'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-50'
                  }`}
              >
                Aktifkan Event Publik
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL BUAT EVENT BARU */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0d0b14] border border-white/10 w-full max-w-lg rounded-2xl p-6 shadow-[0_0_40px_rgba(168,85,247,0.2)] relative">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
              <h3 className="text-lg font-extrabold tracking-wider text-white">Buat Event Baru</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white transition cursor-pointer"
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
                  className="px-5 py-2.5 text-xs font-bold uppercase bg-[#13111c] border border-white/10 hover:border-white/30 rounded-xl text-gray-300 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 text-xs font-bold uppercase bg-gradient-to-r from-[#ff4d6d] via-[#d946ef] to-[#8b5cf6] text-white rounded-xl shadow-[0_0_15px_rgba(217,70,239,0.4)] hover:scale-105 transition transform cursor-pointer disabled:opacity-50"
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
            Selamat datang kembali, <span className="text-purple-400 font-semibold">{userProfile?.name ?? 'User'}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => showToast('Membuka Info Harga')}
            className="px-4 py-2 text-xs font-bold uppercase bg-[#13111c] border border-amber-500/50 text-amber-400 rounded-full hover:border-amber-500 hover:scale-105 transition shadow-[0_0_15px_rgba(245,158,11,0.2)] cursor-pointer"
          >
            Info Harga
          </button>

          <button
            onClick={() => showToast('Membuka Tutorial')}
            className="px-4 py-2 text-xs font-bold uppercase bg-[#13111c] border border-purple-500/30 text-purple-300 rounded-full hover:border-purple-500 hover:scale-105 transition cursor-pointer"
          >
            Tutorial
          </button>

          <div className="flex items-center bg-[#13111c] border border-white/10 rounded-full p-1">
            <button
              onClick={() => { setLanguage('EN'); showToast('Bahasa diubah ke English'); }}
              className={`px-3 py-1 text-[11px] font-bold rounded-full transition cursor-pointer ${language === 'EN' ? 'bg-white text-black' : 'text-gray-400'}`}
            >
              EN
            </button>
            <button
              onClick={() => { setLanguage('ID'); showToast('Bahasa diubah ke Indonesia'); }}
              className={`px-3 py-1 text-[11px] font-bold rounded-full transition cursor-pointer ${language === 'ID' ? 'bg-white text-black' : 'text-gray-400'}`}
            >
              ID
            </button>
          </div>

          <div className="flex items-center space-x-2 px-4 py-2 bg-[#13111c] border border-purple-500/40 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.15)]">
            <Coins className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-bold">{kredit} Kredit</span>
          </div>

          <button
            onClick={() => setIsAccountModalOpen(true)}
            className="w-9 h-9 flex items-center justify-center bg-[#13111c] border border-white/10 rounded-full hover:border-purple-500 text-gray-300 hover:text-white hover:scale-105 transition cursor-pointer"
          >
            <User2 className="w-4 h-4" />
          </button>

          <button
            onClick={async () => {
              await fetch('/api/auth/logout', { method: 'POST' });
              router.push('/');
              router.refresh();
            }}
            aria-label="Logout"
            className="w-9 h-9 flex items-center justify-center bg-[#13111c] border border-white/10 rounded-full hover:border-rose-500 text-gray-300 hover:text-rose-400 hover:scale-105 transition cursor-pointer"
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
            {userProfile?.planName ?? 'Free'}
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
              className="px-4 py-1.5 text-xs font-bold uppercase bg-gradient-to-r from-[#ff4d6d] via-[#d946ef] to-[#8b5cf6] text-white rounded-lg shadow-[0_0_15px_rgba(217,70,239,0.4)] hover:scale-105 transition transform cursor-pointer"
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
              className="px-4 py-1.5 text-xs font-bold uppercase bg-gradient-to-r from-[#ff4d6d] via-[#d946ef] to-[#8b5cf6] text-white rounded-lg shadow-[0_0_15px_rgba(217,70,239,0.4)] hover:scale-105 transition transform cursor-pointer"
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
          <div key={ev.id} className="bg-[#0d0b14] border border-white/10 rounded-2xl p-6 relative flex flex-col justify-between shadow-2xl hover:border-purple-500/30 transition">
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
                  disabled={isSubmitting}
                  onClick={() => handleToggleClick(ev)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${ev.isPublic ? 'bg-gradient-to-r from-pink-500 to-purple-600' : 'bg-gray-700'
                    }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${ev.isPublic ? 'translate-x-6' : 'translate-x-1'
                      }`}
                  />
                </button>
              </div>

              {/* KONDISIONAL: KODE & URL HANYA MUNCUL JIKA isPublic TRUE */}
              {ev.isPublic ? (
                <div className="grid grid-cols-2 gap-2 mb-3 animate-fade-in">
                  <div className="flex items-center justify-between px-3 py-2 bg-[#13111c] border border-white/5 rounded-xl text-xs">
                    <div className="flex items-center gap-1 text-gray-400 text-[10px]">
                      <Key className="w-3 h-3 text-purple-400" />
                      <span>CODE:</span>
                    </div>
                    <span className="font-mono font-bold text-pink-400 tracking-wider">{ev.code}</span>
                    <button onClick={() => handleCopyText(ev.code, `Kode ${ev.code}`)} className="text-gray-400 hover:text-white transition cursor-pointer">
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <button
                    onClick={() => handleCopyText(typeof window !== 'undefined' ? `${window.location.origin}/event/${ev.code}` : `https://cekreks.id/event/${ev.code}`, 'URL Event')}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 bg-[#13111c] border border-white/5 rounded-xl text-xs text-gray-300 hover:text-white transition cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5 text-purple-400" /> Copy URL
                  </button>
                </div>
              ) : (
                <div className="mb-3 px-3 py-2.5 bg-[#13111c]/50 border border-dashed border-white/10 rounded-xl text-center">
                  <span className="text-[11px] text-gray-200 font-medium italic">
                    Event diset Private ( Kode & URL disembunyikan )
                  </span>
                </div>
              )}

              {/* MULAI & PENGATURAN ROW */}
              <div className="grid grid-cols-2 gap-2 mb-2">
                <a
                  href={`/event/${ev.code}`}
                  className="flex items-center justify-center gap-2 py-2.5 bg-[#13111c] border border-white/10 hover:border-purple-500/50 rounded-xl text-xs font-bold uppercase transition text-white"
                >
                  <Play className="w-3.5 h-3.5 fill-current text-white" /> Mulai
                </a>
                <button
                  onClick={() => {
                    showToast(`Membuka pengaturan: ${ev.title}`);
                    router.push(`/event/${ev.code}/settings`);
                  }}
                  className="flex items-center justify-center gap-2 py-2.5 bg-[#13111c] border border-white/10 hover:border-purple-500/50 rounded-xl text-xs font-bold uppercase transition text-white cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5 text-purple-400" /> Pengaturan
                </button>
              </div>

              {/* GALERI BUTTON */}
              <button
                onClick={() => showToast(`Membuka galeri event ${ev.title}`)}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#13111c] border border-white/10 hover:border-purple-500/50 rounded-xl text-xs font-bold uppercase transition text-white mb-3 cursor-pointer"
              >
                <ImageIcon className="w-3.5 h-3.5 text-purple-400" /> Galeri
              </button>
            </div>

            {/* BOTTOM ACTIONS (ZIP, DRIVE, DELETE) */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/5">
              <button
                onClick={() => showToast(`Mengunduh ZIP untuk ${ev.title}...`)}
                className="flex flex-col items-center justify-center p-2 bg-[#13111c] border border-blue-500/20 hover:border-blue-500/50 rounded-xl text-[10px] text-blue-400 font-medium text-center transition cursor-pointer"
                title="Unduh Semua Data (ZIP)"
              >
                <Download className="w-4 h-4 mb-1" />
                <span className="leading-tight">Unduh Semua Data (ZIP)</span>
              </button>
              <button
                onClick={() => showToast(`Mencadangkan ${ev.title} ke Google Drive...`)}
                className="flex flex-col items-center justify-center p-2 bg-[#13111c] border border-white/10 hover:border-purple-500/50 rounded-xl text-[10px] text-gray-300 font-medium text-center transition cursor-pointer"
                title="Cadangkan ke Google Drive"
              >
                <Database className="w-4 h-4 mb-1 text-purple-400" />
                <span className="leading-tight">Cadangkan ke Google Drive</span>
              </button>
              <button
                onClick={() => handleDeleteEvent(ev.code, ev.title)}
                className="flex flex-col items-center justify-center p-2 bg-[#13111c] border border-rose-500/20 hover:border-rose-500/50 rounded-xl text-[10px] text-rose-400 font-medium text-center transition cursor-pointer"
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
