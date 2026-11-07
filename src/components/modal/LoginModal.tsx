'use client';

import React, { useState, useEffect } from 'react';
import { X, KeyRound, Sparkles, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [eventCode, setEventCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // State untuk mengontrol animasi tampil/tutup
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Sedikit delay agar transisi scale/opacity terbaca oleh browser
      const timer = setTimeout(() => setIsAnimating(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
      // Tunggu animasi keluar selesai sebelum elemen di-unmount dari DOM
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ email, password });
  };

  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 z-999 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
    >
      {/* Container Modal dengan Animasi Pop-up (Scale) */}
      <div
        onClick={(e) => e.stopPropagation()} // Mencegah modal tertutup saat area dalam diklik
        className={`relative w-full max-w-md p-8 bg-[#0d0b14] border border-purple-900/40 rounded-3xl shadow-[0_0_35px_rgba(168,85,247,0.15)] text-white transition-all duration-300 transform ${isAnimating ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'
          }`}
      >

        {/* Tombol Close (X) */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Logo & Title */}
        <div className="flex flex-col items-center mb-8">
          <Image src="/images/logo/cekreks2.png" alt="Logo Cekreks" width={100} height={100} className="my-3" />
          <h2 className="text-2xl font-bold tracking-wider">LOGIN</h2>
          <span className="text-xs tracking-widest text-gray-400 uppercase">AI Photobooth App</span>
        </div>

        {/* Form Login Utama */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold tracking-wider text-gray-400 uppercase mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              required
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
                className="w-full px-4 py-3 pr-12 bg-[#13111c] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-white transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Tombol Sign In dengan Neon Glow Magenta */}
          <button
            type="submit"
            className="w-full py-3.5 mt-2 font-bold tracking-wider text-white uppercase bg-gradient-to-r from-[#ff4d6d] via-[#d946ef] to-[#8b5cf6] rounded-xl shadow-[0_0_20px_rgba(217,70,239,0.4)] hover:shadow-[0_0_25px_rgba(217,70,239,0.7)] hover:scale-[1.01] active:scale-[0.99] transition duration-200 text-sm"
          >
            Sign In
          </button>
        </form>

        {/* Divider / Garis Pemisah Tipis */}
        <div className="my-6 border-t border-white/5" />

        {/* Kotak Connect to Event (6 Digit Code) */}
        <div className="flex items-center justify-between p-3 bg-[#13111c] border border-white/5 rounded-xl">
          <button className="flex items-center font-bold tracking-wider text-white p-2 uppercase bg-gradient-to-r from-[#ff4d6d] via-[#d946ef] to-[#8b5cf6] rounded-lg shadow-[0_0_20px_rgba(217,70,239,0.4)] hover:shadow-[0_0_25px_rgba(217,70,239,0.7)] hover:scale-[1.01] active:scale-[0.99] transition duration-200 text-sm">
            <KeyRound className="w-4 h-4 mr-2" />
            <span className="text-xs font-medium text-gray-100">Connect to Event</span>
          </button>
          <input
            type="text"
            maxLength={6}
            value={eventCode}
            onChange={(e) => setEventCode(e.target.value)}
            placeholder="6 DIGIT CODE"
            className="w-32 px-3 py-1.5 bg-[#0d0b14] border border-white/10 rounded-lg text-center text-xs tracking-widest text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition uppercase"
          />
        </div>
      </div>
    </div>
  );
}