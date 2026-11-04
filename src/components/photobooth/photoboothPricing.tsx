"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { PHOTOBOOTH_PACKAGES } from "@/constants/photoboothData";

export default function PhotoboothPricing() {
  // Karena sekarang ada 3 card terpisah, kita bisa atur state default untuk masing-masing card jika dibutuhkan,
  // atau kita langsung petakan setiap tier menjadi card mandiri.
  
  // Helper untuk menentukan tema warna berdasarkan indeks card (0: Coral, 1: Fuchsia, 2: Purple)
  const getLogoGradientTheme = (cardIndex: number) => {
    if (cardIndex === 0) {
      // Card Pertama (Sisi Kiri - Coral/Pink)
      return {
        boxBg: "bg-gradient-to-b from-rose-950/70 via-[#140b2b] to-[#140b2b] border-rose-500/60 shadow-[0_0_35px_rgba(244,63,94,0.25)]",
        arrowHex: "#f43f5e",
        priceColor: "text-rose-400",
        buttonStyle: "bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:opacity-90 shadow-[0_0_20px_rgba(244,63,94,0.35)]",
        badgeTheme: "text-rose-400"
      };
    } else if (cardIndex === 1) {
      // Card Kedua (Sisi Tengah - Fuchsia/Pink Tua)
      return {
        boxBg: "bg-gradient-to-b from-fuchsia-950/70 via-[#140b2b] to-[#140b2b] border-fuchsia-500/60 shadow-[0_0_35px_rgba(217,70,239,0.25)]",
        arrowHex: "#d946ef",
        priceColor: "text-fuchsia-400",
        buttonStyle: "bg-gradient-to-r from-fuchsia-500 to-purple-500 text-white hover:opacity-90 shadow-[0_0_20px_rgba(217,70,239,0.35)]",
        badgeTheme: "text-fuchsia-400"
      };
    } else {
      // Card Ketiga (Sisi Kanan - Ungu/Violet)
      return {
        boxBg: "bg-gradient-to-b from-purple-950/70 via-[#140b2b] to-[#140b2b] border-purple-500/60 shadow-[0_0_35px_rgba(168,85,247,0.25)]",
        arrowHex: "#a855f7",
        priceColor: "text-purple-400",
        buttonStyle: "bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:opacity-90 shadow-[0_0_20px_rgba(168,85,247,0.35)]",
        badgeTheme: "text-purple-400"
      };
    }
  };

  // Ambil data paket pertama dari PHOTOBOOTH_PACKAGES
  const basePkg = PHOTOBOOTH_PACKAGES[0];

  return (
    <section id="pricing" className="scroll-mt-18">
      <div className="text-left mb-10">
        <span className="text-xs font-bold tracking-widest uppercase text-cyan-400">
          Pilihan Paket & Harga
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
          Daftar Paket AI Photobooth & Konvensional
        </h2>
        <p className="text-gray-400 text-xs sm:text-sm mt-1">
          Pilih paket photobooth yang sesuai untuk melihat rincian fasilitas, kuota voucher, dan penawaran terbaik kami.
        </p>
      </div>

      {/* Grid 3 Card Utama Menyamping di Desktop (lg:grid-cols-3) & 1 di Mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-7xl mx-auto">
        {basePkg.tiers.map((tier, cardIdx) => {
          const theme = getLogoGradientTheme(cardIdx);

          return (
            <div
              key={tier.id || cardIdx}
              className="relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-500 bg-[#120a22]/90 border border-white/10 hover:border-white/20"
            >
              <div>
                {/* Header Paket */}
                <div className="pb-2 mb-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-cyan-400">
                    {basePkg.tagline}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white mt-1 uppercase leading-snug">
                    {basePkg.categoryName} <br/>
                    {tier.name}
                  </h3>
                  <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                    {basePkg.desc}
                  </p>

                  {/* Pengganti Tab: Badge 1 Tab Statis yang Menampilkan Nama Tier/Durasi */}
                  <div className="mt-5 p-1 rounded-2xl bg-[#080312] border border-white/10 text-center">
                    <div className={`py-2.5 px-2 rounded-xl text-[11px] sm:text-xs font-black bg-[#1e133a] border border-white/15 shadow-md ${theme.badgeTheme}`}>
                      {tier.name}
                    </div>
                  </div>
                </div>

                {/* Container utama card pembungkus dengan panah di luarnya */}
                <div className="relative mt-3">
                  {/* Panah (Arrow Pointer) diposisikan tepat di tengah atas kotak */}
                  <div 
                    className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-b-[8px] transition-all duration-300 ease-in-out z-30"
                    style={{
                      borderBottomColor: theme.arrowHex
                    }}
                  ></div>

                  {/* Kotak Pembungkus (Wrapper Box) */}
                  <div className={`relative rounded-2xl p-5 sm:p-6 border transition-all duration-500 overflow-hidden ${theme.boxBg}`}>
                    
                    {/* Bagian Harga */}
                    <div className="mb-6 pt-2">
                      <span className="text-[11px] text-gray-300 block font-medium">
                        Paket Pilihan ({tier.name}):
                      </span>
                      <span className={`text-2xl sm:text-3xl font-black block mt-1 ${theme.priceColor}`}>
                        {tier.price}
                      </span>
                    </div>

                    {/* List Benefit */}
                    <div className="mb-6">
                      <span className="text-[11px] font-semibold text-gray-200 uppercase tracking-wider block mb-3">
                        Fasilitas & Benefit:
                      </span>
                      <ul className="space-y-2.5 min-h-[190px]">
                        {tier.features.map((feat, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-2.5 text-xs text-gray-100">
                            <Check className="w-4 h-4 text-white shrink-0 mt-0.5" />
                            <span className="leading-snug">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Catatan Tambahan Photobooth */}
                    <div className="mb-6 p-3 rounded-xl bg-black/30 border border-white/10 text-xs text-gray-300 space-y-1">
                      <p className="font-semibold text-cyan-300">Catatan:</p>
                      <p>• Sudah termasuk cetak di kertas Photopaper + Paperframe</p>
                      <p>• Tersedia opsi tanpa cetak / cetak tambahan (Photoblok)</p>
                    </div>

                    {/* Tombol Pemesanan */}
                    <a
                      href={`https://wa.me/6285801105140?text=${encodeURIComponent(
                        `Halo Cekreks.id, saya tertarik booking ${basePkg.categoryName} (${tier.name}) dengan harga ${tier.price}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full py-3.5 rounded-xl font-bold text-xs text-center transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${theme.buttonStyle}`}
                    >
                      <span>Pesan Paket Ini</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}