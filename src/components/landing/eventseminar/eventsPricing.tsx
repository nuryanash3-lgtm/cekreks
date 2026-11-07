"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { EVENTS_PACKAGES } from "@/constants/eventsData";

export default function EventsPricing() {
  const [selectedTiers, setSelectedTiers] = useState<Record<number, number>>({
    0: 0,
    1: 0,
    2: 0,
  });

  const handleSelectTier = (catIndex: number, tierIndex: number) => {
    setSelectedTiers((prev) => ({ ...prev, [catIndex]: tierIndex }));
  };

  // Helper untuk menentukan tema warna berdasarkan indeks card / kategori
  const getLogoGradientTheme = (cardIndex: number) => {
    if (cardIndex === 0) {
      // Card 1: Half Day (Coral/Rose)
      return {
        boxBg: "bg-gradient-to-b from-rose-950/70 via-[#140b2b] to-[#140b2b] border-rose-500/60 shadow-[0_0_35px_rgba(244,63,94,0.25)]",
        arrowHex: "#f43f5e",
        priceColor: "text-rose-400",
        buttonStyle: "bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:opacity-90 shadow-[0_0_20px_rgba(244,63,94,0.35)]"
      };
    } else if (cardIndex === 1) {
      // Card 2: Full Day (Fuchsia/Purple)
      return {
        boxBg: "bg-gradient-to-b from-fuchsia-950/70 via-[#140b2b] to-[#140b2b] border-fuchsia-500/60 shadow-[0_0_35px_rgba(217,70,239,0.25)]",
        arrowHex: "#d946ef",
        priceColor: "text-fuchsia-400",
        buttonStyle: "bg-gradient-to-r from-fuchsia-500 to-purple-500 text-white hover:opacity-90 shadow-[0_0_20px_rgba(217,70,239,0.35)]"
      };
    } else {
      // Card 3: Paket Lainnya (Ungu/Indigo)
      return {
        boxBg: "bg-gradient-to-b from-purple-950/70 via-[#140b2b] to-[#140b2b] border-purple-500/60 shadow-[0_0_35px_rgba(168,85,247,0.25)]",
        arrowHex: "#a855f7",
        priceColor: "text-purple-400",
        buttonStyle: "bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:opacity-90 shadow-[0_0_20px_rgba(168,85,247,0.35)]"
      };
    }
  };

  // 1. Ambil data Paket 0 (Event & Seminar Coverage)
  const eventPkg = EVENTS_PACKAGES[0];
  
  // Pisahkan tier-nya menjadi 2 item terpisah (Half Day & Full Day)
  const separatedCards = [
    {
      ...eventPkg,
      categoryName: `${eventPkg.categoryName} ${eventPkg.tiers[0].name}`,
      tagline: eventPkg.tagline,
      desc: eventPkg.desc,
      tier: eventPkg.tiers[0],
    },
    {
      ...eventPkg,
      categoryName: `${eventPkg.categoryName} ${eventPkg.tiers[1].name}`,
      tagline: eventPkg.tagline,
      desc: eventPkg.desc,
      tier: eventPkg.tiers[1],
    },
    // 2. Masukkan paket berikutnya dari EVENTS_PACKAGES (indeks 1)
    {
      ...EVENTS_PACKAGES[1],
      tier: EVENTS_PACKAGES[1].tiers[selectedTiers[2] ?? 0], // Mendukung state tab jika paket ke-3 punya sub-tier
      originalPkg: EVENTS_PACKAGES[1],
    }
  ];

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

      {/* Grid 3 Card Utama Menyamping di Desktop (lg:grid-cols-3) & 1 di Mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-7xl mx-auto">
        {separatedCards.map((item, cardIdx) => {
          const currentPlan = item.tier;
          const theme = getLogoGradientTheme(cardIdx);
          const isThirdCard = cardIdx === 2;
          const pkgSource = isThirdCard ? EVENTS_PACKAGES[1] : item;

          return (
            <div
              key={cardIdx}
              className="relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-500 bg-[#120a22]/90 border border-white/10 hover:border-white/20"
            >
              <div>
                {/* Header Paket */}
                <div className="pb-2 mb-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-cyan-400">
                    {item.tagline}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                    {item.categoryName}
                  </h3>
                  <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                    {item.desc}
                  </p>

                  {/* Jika Card ke-3 memiliki sub-tier (lebih dari 1 pilihan tab), tampilkan tab switcher. Jika hanya 1, tampilkan badge judul statis/1 tab */}
                  {isThirdCard && pkgSource.tiers.length > 1 ? (
                    <div className="mt-5 p-1 rounded-2xl bg-[#080312] border border-white/10 relative flex">
                      <div
                        className="absolute top-1 bottom-1 rounded-xl bg-[#1e133a] border border-white/15 shadow-md transition-all duration-300 ease-in-out"
                        style={{
                          left: `calc(${((selectedTiers[2] ?? 0) * 100) / pkgSource.tiers.length}% + 4px)`,
                          width: `calc(${100 / pkgSource.tiers.length}% - 8px)`,
                        }}
                      />
                      {pkgSource.tiers.map((tierOpt, tIdx) => {
                        const isActive = (selectedTiers[2] ?? 0) === tIdx;
                        return (
                          <button
                            key={tierOpt.id}
                            type="button"
                            onClick={() => setSelectedTiers((prev) => ({ ...prev, 2: tIdx }))}
                            className={`flex-1 py-2.5 px-2 rounded-xl text-[11px] sm:text-xs transition-colors duration-300 cursor-pointer text-center relative z-10 ${
                              isActive ? "text-purple-400 font-black" : "text-gray-400 hover:text-white font-medium"
                            }`}
                          >
                            {tierOpt.name}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    /* 1 Tab / Badge Statis untuk menandakan cakupan durasi */
                    <div className="mt-5 p-1 rounded-2xl bg-[#080312] border border-white/10 text-center">
                      <div className="py-2.5 px-2 rounded-xl text-[11px] sm:text-xs text-cyan-300 font-bold bg-[#1e133a] border border-white/15 shadow-md">
                        {isThirdCard ? pkgSource.tiers[selectedTiers[2] ?? 0].name : (cardIdx === 0 ? "Half Day Coverage" : "Full Day Coverage")}
                      </div>
                    </div>
                  )}
                </div>

                {/* Container utama card pembungkus dengan panah di luarnya */}
                <div className="relative mt-3">
                  {/* Panah (Arrow Pointer) diposisikan di tengah */}
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
                        Investasi Paket:
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
                        `Halo Cekreks.id, saya tertarik booking ${item.categoryName} dengan harga ${currentPlan.price}`
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