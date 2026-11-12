'use client';

import React, { useState } from 'react';
import { Sparkles, Key, ChevronDown, Save } from 'lucide-react';

export default function AISettingsPage() {
  const [selectedModel, setSelectedModel] = useState('sdxl-turbo');
  const [apiKey, setApiKey] = useState('AIzaSyD-xxxxxxxxxxxxxxxxxxxxxxxxxxxx');

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Konfigurasi Sistem AI berhasil disimpan!');
  };

  return (
    <div className="p-4 md:p-8 text-white min-h-screen">
      
      {/* HEADER PAGE */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold tracking-wide">
          Pengaturan Sistem AI
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Konfigurasi API Endpoint dan model generator photobooth[cite: 7].
        </p>
      </div>

      {/* FORM CARD CONTAINER */}
      <div className="max-w-3xl bg-[#0d0b14] border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl">
        
        <form onSubmit={handleSaveSettings} className="space-y-6">
          
          {/* AI MODEL ENGINE */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2">
              AI Model Engine
            </label>
            <div className="relative">
              <select 
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full px-4 py-3 bg-[#161324] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500 appearance-none transition cursor-pointer"
              >
                <option value="sdxl-turbo">Stable Diffusion XL (SDXL Turbo)</option>
                <option value="gemini-flash">Google Gemini 3.1 Flash Lite</option>
                <option value="flux-schnell">FLUX.1 Schnell</option>
              </select>
              <span className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-400">
                <ChevronDown className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* API KEY CONFIG */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2">
              API Key Config
            </label>
            <div className="relative">
              <input 
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Masukkan API Key..."
                className="w-full px-4 py-3 bg-[#161324] border border-white/10 rounded-xl text-sm text-white font-mono tracking-widest focus:outline-none focus:border-purple-500 transition"
              />
            </div>
          </div>

          {/* TOMBOL SIMPAN PERUBAHAN */}
          <div className="pt-2">
            <button 
              type="submit"
              className="px-6 py-3 text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:opacity-90 text-white rounded-xl shadow-[0_0_20px_rgba(147,51,234,0.4)] transition flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Simpan Perubahan
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}