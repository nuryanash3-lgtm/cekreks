"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { EVENTS_PACKAGES } from "@/constants/eventsData";

export default function EventsPricing() {
  const [selectedTiers, setSelectedTiers] = useState<Record<number, number>>({
    0: 0,
    1: 0, // default ke tier pertama untuk paket kedua
  });

  const handleSelectTier = (catIndex: number, tierIndex: number) => {
    setSelectedTiers((prev) => ({ ...prev, [catIndex]: tierIndex }));
  };

  // Helper untuk menentukan tema warna berdasarkan jumlah tab & posisi tab aktif
  const getLogoGradientTheme = (tierIndex: number, totalTiers: number) => {
    // Jika total tab ada 2 (seperti pada Event & Seminar Coverage)
    if (totalTiers === 2) {
      if (tierIndex === 0) {
        // Tab Pertama (Sisi Kiri - Coral/Rose)
        return {
          tabTextActive: "text-rose-400 font-black",
          boxBg: "bg-gradient-to-b from-rose-950/70 via-[#140b2b] to-[#140b2b] border-rose-500/60 shadow-[0_0_35px_rgba(244,63,94,0.25)]",
          arrowHex: "#f43f5e",
          priceColor: "text-rose-400",
          buttonStyle: "bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:opacity-90 shadow-[0_0_20px_rgba(244,63,94,0.35)]"
        };
      } else {
        // Tab Kedua (Sisi Kanan - Ungu/Purple)
        return {
          tabTextActive: "text-purple-400 font-black",
          boxBg: "bg-gradient-to-b from-purple-950/70 via-[#140b2b] to-[#140b2b] border-purple-500/60 shadow-[0_0_35px_rgba(168,85,247,0.25)]",
          arrowHex: "#a855f7",
          priceColor: "text-purple-400",
          buttonStyle: "bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:opacity-90 shadow-[0_0_20px_rgba(168,85,247,0.35)]"
        };
      }
    }

    // Jika total tab ada 3 (seperti pada beberapa paket lain)
    if (totalTiers === 3) {
      if (tierIndex === 0) {
        return {
          tabTextActive: "text-rose-400 font-black",
          boxBg: "bg-gradient-to-b from-rose-950/70 via-[#140b2b] to-[#140b2b] border-rose-500/60 shadow-[0_0_35px_rgba(244,63,94,0.25)]",
          arrowHex: "#f43f5e",
          priceColor: "text-rose-400",
          buttonStyle: "bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:opacity-90 shadow-[0_0_20px_rgba(244,63,94,0.35)]"
        };
      } else if (tierIndex === 1) {
        return {
          tabTextActive: "text-fuchsia-400 font-black",
          boxBg: "bg-gradient-to-b from-fuchsia-950/70 via-[#140b2b] to-[#140b2b] border-fuchsia-500/60 shadow-[0_0_35px_rgba(217,70,239,0.25)]",
          arrowHex: "#d946ef",
          priceColor: "text-fuchsia-400",
          buttonStyle: "bg-gradient-to-r from-fuchsia-500 to-purple-500 text-white hover:opacity-90 shadow-[0_0_20px_rgba(217,70,239,0.35)]"
        };
      } else {
        return {
          tabTextActive: "text-purple-400 font-black",
          boxBg: "bg-gradient-to-b from-purple-950/70 via-[#140b2b] to-[#140b2b] border-purple-500/60 shadow-[0_0_35px_rgba(168,85,247,0.25)]",
          arrowHex: "#a855f7",
          priceColor: "text-purple-400",
          buttonStyle: "bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:opacity-90 shadow-[0_0_20px_rgba(168,85,247,0.35)]"
        };
      }
    }

    // Fallback default
    return {
      tabTextActive: "text-pink-400 font-black",
      boxBg: "bg-gradient-to-b from-pink-950/70 via-[#140b2b] to-[#140b2b] border-pink-500/60 shadow-[0_0_35px_rgba(236,72,153,0.25)]",
      arrowHex: "#ec4899",
      priceColor: "text-pink-400",
      buttonStyle: "bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:opacity-90 shadow-[0_0_20px_rgba(236,72,153,0.35)]"
    };
  };

  return (
    <section id="pricing" className="scroll-mt-18">
      <div className="text-left mb-10">
        <span className="text-xs font-bold tracking-widest uppercase text-cyan-400">
          Pilihan Paket & Harga
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
          Daftar Paket Event & Acara
        </h2>
        <p className="text-gray-400 text-xs sm:text-sm mt-1">
          Pilih di dalam masing-masing kategori untuk melihat detail benefit dan penawaran harga eksklusif.
        </p>
      </div>

      {/* Grid 2 Card Utama */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto">
        {EVENTS_PACKAGES.slice(0, 2).map((pkg, catIdx) => {
          const activeTierIdx = selectedTiers[catIdx] ?? 0;
          const currentPlan = pkg.tiers[activeTierIdx];
          const totalTiers = pkg.tiers.length;
          const theme = getLogoGradientTheme(activeTierIdx, totalTiers);

          return (
            <div
              key={catIdx}
              className="relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-500 bg-[#120a22]/90 border border-white/10 hover:border-white/20"
            >
              <div>
                {/* Header Paket */}
                <div className="pb-2 mb-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-cyan-400">
                    {pkg.tagline}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                    {pkg.categoryName}
                  </h3>
                  <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                    {pkg.desc}
                  </p>

                  {/* Sub-tier Switcher / Tab dengan Animasi Geser */}
                  <div className="mt-5 p-1 rounded-2xl bg-[#080312] border border-white/10 relative flex">
                    <div
                      className="absolute top-1 bottom-1 rounded-xl bg-[#1e133a] border border-white/15 shadow-md transition-all duration-300 ease-in-out"
                      style={{
                        left: `calc(${(activeTierIdx * 100) / totalTiers}% + 4px)`,
                        width: `calc(${100 / totalTiers}% - 8px)`,
                      }}
                    />

                    {pkg.tiers.map((tier, tIdx) => {
                      const isActive = activeTierIdx === tIdx;
                      const tabTheme = getLogoGradientTheme(tIdx, totalTiers);

                      return (
                        <button
                          key={tier.id}
                          type="button"
                          onClick={() => handleSelectTier(catIdx, tIdx)}
                          className={`flex-1 py-2.5 px-2 rounded-xl text-[11px] sm:text-xs transition-colors duration-300 cursor-pointer text-center relative z-10 ${
                            isActive
                              ? tabTheme.tabTextActive
                              : "text-gray-400 hover:text-white font-medium"
                          }`}
                        >
                          {tier.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Container utama card pembungkus dengan panah di luarnya */}
                <div className="relative mt-3">
                  {/* Panah (Arrow Pointer) diposisikan di luar kotak card */}
                  <div 
                    className="absolute -top-2.5 w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-b-[8px] transition-all duration-300 ease-in-out z-30"
                    style={{
                      left: `calc(${((activeTierIdx + 0.5) * 100) / totalTiers}%)`,
                      transform: 'translateX(-50%)',
                      borderBottomColor: theme.arrowHex
                    }}
                  ></div>

                  {/* Kotak Pembungkus (Wrapper Box) */}
                  <div className={`relative rounded-2xl p-5 sm:p-6 border transition-all duration-500 overflow-hidden ${theme.boxBg}`}>
                    
                    {/* Bagian Harga */}
                    <div className="mb-6 pt-2">
                      <span className="text-[11px] text-gray-300 block font-medium">
                        Paket Lengkap ({currentPlan.name}):
                      </span>
                      <span className={`text-2xl sm:text-3xl font-black block mt-1 ${theme.priceColor}`}>
                        {currentPlan.price}
                      </span>
                    </div>

                    {/* List Benefit */}
                    <div className="mb-6">
                      <span className="text-[11px] font-semibold text-gray-200 uppercase tracking-wider block mb-3">
                        Fasilitas & Benefit:
                      </span>
                      <ul className="space-y-2.5 min-h-[190px]">
                        {currentPlan.features.map((feat, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-2.5 text-xs text-gray-100">
                            <Check className="w-4 h-4 text-white shrink-0 mt-0.5" />
                            <span className="leading-snug">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Tombol Pemesanan */}
                    <a
                      href={`https://wa.me/6285801105140?text=${encodeURIComponent(
                        `Halo Cekreks.id, saya tertarik booking ${pkg.categoryName} (${currentPlan.name}) dengan harga ${currentPlan.price}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full py-3.5 rounded-xl font-bold text-xs text-center transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${theme.buttonStyle}`}
                    >
                      <span>Pesan Paket {currentPlan.name}</span>
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