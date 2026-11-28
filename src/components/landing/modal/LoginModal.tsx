'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, KeyRound, Eye, EyeOff, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  notice?: string | null;
}

export default function LoginModal({ isOpen, onClose, notice }: LoginModalProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [eventCode, setEventCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConnectingEvent, setIsConnectingEvent] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    setErrorMsg(null);
    onClose();
  };

  // Logika Handler Login Admin / Operator Event melalui server API
  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        redirectUrl?: string;
        error?: string;
      };

      if (!res.ok || !data.ok) {
        setErrorMsg(data.error || 'Email atau password salah.');
        return;
      }

      handleClose();
      router.push(data.redirectUrl || '/event');
      router.refresh();
    } catch {
      setErrorMsg('Gagal menghubungi server autentikasi. Coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Logika Handler Connect to Event (Vendor) melalui server API
  const handleVendorConnect = async () => {
    const cleanCode = eventCode.trim().toUpperCase();
    if (!cleanCode || isConnectingEvent) {
      if (!cleanCode) setErrorMsg('Masukkan 6 digit kode event terlebih dahulu.');
      return;
    }

    setErrorMsg(null);
    setIsConnectingEvent(true);

    try {
      const res = await fetch('/api/auth/connect-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: cleanCode }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        redirectUrl?: string;
        error?: string;
      };

      if (!res.ok || !data.ok) {
        setErrorMsg(data.error || 'Kode Event tidak ditemukan!');
        return;
      }

      handleClose();
      router.push(data.redirectUrl || `/event/${cleanCode}`);
      router.refresh();
    } catch {
      setErrorMsg('Gagal menghubungkan ke event. Periksa koneksi Anda.');
    } finally {
      setIsConnectingEvent(false);
    }
  };

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 z-999 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
    >
      {/* Container Modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md p-8 bg-[#0d0b14] border border-purple-900/40 rounded-3xl shadow-[0_0_35px_rgba(168,85,247,0.15)] text-white transition-all duration-300"
      >
        {/* Tombol Close (X) */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Tutup modal login"
          className="absolute top-5 right-5 p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Logo & Title */}
        <div className="flex flex-col items-center mb-6">
          <Image src="/images/logo/cekreks2.png" alt="Logo Cekreks" width={100} height={100} className="my-3" />
          <h2 className="text-2xl font-bold tracking-wider">LOGIN</h2>
          <span className="text-xs tracking-widest text-gray-400 uppercase">AI Photobooth App</span>
        </div>

        {(notice || errorMsg) && (
          <div
            className={`mb-5 px-4 py-3 rounded-xl text-xs font-medium border ${
              errorMsg
                ? 'bg-rose-500/10 border-rose-500/40 text-rose-300'
                : 'bg-amber-500/10 border-amber-500/40 text-amber-200'
            }`}
          >
            {errorMsg || notice}
          </div>
        )}

        {/* Form Login Utama */}
        <form onSubmit={handleAdminSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold tracking-wider text-gray-400 uppercase mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@cekreks.id"
              required
              autoComplete="email"
              className="w-full px-4 py-3 bg-[#13111c] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold tracking-wider text-gray-400 uppercase mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="w-full px-4 py-3 pr-12 bg-[#13111c] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Sembunyikan password' : 'Lihat password'}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-white transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Tombol Sign In dengan Neon Glow Magenta */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 mt-2 font-bold tracking-wider text-white uppercase bg-gradient-to-r from-[#ff4d6d] via-[#d946ef] to-[#8b5cf6] rounded-xl shadow-[0_0_20px_rgba(217,70,239,0.4)] hover:shadow-[0_0_25px_rgba(217,70,239,0.7)] hover:scale-[1.01] active:scale-[0.99] transition duration-200 text-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memverifikasi...</span>
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Divider / Garis Pemisah Tipis */}
        <div className="my-6 border-t border-white/5" />

        {/* Kotak Connect to Event (6 Digit Code) */}
        <div className="p-3 bg-[#13111c] border border-white/10 rounded-2xl space-y-2">
          <div className="flex items-center space-x-2 text-xs text-gray-400 mb-1">
            <KeyRound className="w-3.5 h-3.5 text-pink-400" />
            <span>Connect to Event</span>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="text"
              maxLength={6}
              value={eventCode}
              onChange={(e) => setEventCode(e.target.value)}
              placeholder="6 DIGIT CODE"
              className="flex-1 px-4 py-3 bg-[#0d0b14] border border-white/10 rounded-xl text-center text-xs tracking-widest text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition uppercase"
            />

            <button
              type="button"
              disabled={isConnectingEvent}
              onClick={handleVendorConnect}
              className="px-5 py-3 font-bold tracking-wider text-white uppercase bg-gradient-to-r from-[#ff4d6d]/80 via-[#d946ef]/80 to-[#8b5cf6]/80 border border-purple-500/30 rounded-xl shadow-[0_0_15px_rgba(217,70,239,0.2)] hover:shadow-[0_0_20px_rgba(217,70,239,0.4)] transition duration-200 text-xs whitespace-nowrap disabled:opacity-60"
            >
              {isConnectingEvent ? '...' : 'Connect'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
