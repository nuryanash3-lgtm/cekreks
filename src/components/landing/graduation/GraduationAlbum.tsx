"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GRADUATION_ALBUM } from "@/constants/graduationData";

export default function GraduationAlbum() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const total = GRADUATION_ALBUM.length;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
    }, 3000);

    return () => clearInterval(timer);
  }, [total]);

  const getSlideStyle = (index: number) => {
    let diff = (index - currentIndex) % total;
    if (diff < -Math.floor(total / 2)) diff += total;
    if (diff > Math.floor(total / 2)) diff -= total;

    // Foto Tengah Aktif (Diperbesar ukurannya dengan scale lebih tinggi)
    if (diff === 0) {
      return {
        transform: "translateX(0%) scale(1.25)", // Diubah dari 1.15 ke 1.35 (sesuaikan jika ingin lebih besar/kecil)
        zIndex: 30,
        opacity: 1,
        filter: "brightness(1)",
        pointerEvents: "auto" as const,
      };
    }

    // Foto Kanan (Jarak translateX tetap di 100%)
    if (diff === 1) {
      return {
        transform: "translateX(80%) scale(0.85)",
        zIndex: 20,
        opacity: 0.8,
        filter: "brightness(0.85)",
        pointerEvents: "auto" as const,
      };
    }

    // Foto Kiri (Jarak translateX tetap di -100%)
    if (diff === -1) {
      return {
        transform: "translateX(-80%) scale(0.85)",
        zIndex: 20,
        opacity: 0.8,
        filter: "brightness(0.85)",
        pointerEvents: "auto" as const,
      };
    }

    // Layer Luar Kanan
    if (diff === 2) {
      return {
        transform: "translateX(140%) scale(0.7)",
        zIndex: 10,
        opacity: 0.4,
        filter: "brightness(0.6)",
        pointerEvents: "none" as const,
      };
    }

    // Layer Luar Kiri
    if (diff === -2) {
      return {
        transform: "translateX(-140%) scale(0.7)",
        zIndex: 10,
        opacity: 0.4,
        filter: "brightness(0.6)",
        pointerEvents: "none" as const,
      };
    }

    return {
      transform: "translateX(0%) scale(0.5)",
      zIndex: 0,
      opacity: 0,
      pointerEvents: "none" as const,
    };
  };

  return (
    <section className="py-20 border-t border-white/10 overflow-hidden">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-[100rem] mx-auto px-5 mb-12">
        <div className="text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 py-1 rounded-full text-xs font-semibold uppercase text-cyan-300">
            Album
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Hasil Karya Graduation
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Ekspresi kebahagiaan dan kebanggaan momen wisuda bersama Cekreks.id
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Geser ke kiri"
            className="p-3 rounded-full bg-[#140b2b] border border-white/10 hover:border-cyan-400 text-gray-300 hover:text-white transition duration-200 cursor-pointer shadow-lg active:scale-95"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Geser ke kanan"
            className="p-3 rounded-full bg-[#140b2b] border border-white/10 hover:border-cyan-400 text-gray-300 hover:text-white transition duration-200 cursor-pointer shadow-lg active:scale-95"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tinggi container disesuaikan agar card tengah yang besar tidak terpotong */}
      <div className="relative w-full max-w-[100rem] mx-auto h-[420px] sm:h-[480px] flex items-center justify-center">
        {GRADUATION_ALBUM.map((item, index) => {
          const style = getSlideStyle(index);
          const isCenter = index === currentIndex;

          return (
            <div
              key={item.id}
              onClick={() => setCurrentIndex(index)}
              style={style}
              className={`absolute top-1/2 -translate-y-1/2 w-[240px] sm:w-[280px] md:w-[320px] aspect-square rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer transition-all duration-700 ease-out select-none ${
                isCenter
                  ? "border-2 border-cyan-400 shadow-[0_0_35px_rgba(34,211,238,0.35)]"
                  : "border border-white/10 shadow-2xl hover:opacity-85"
              }`}
            >
              <Image
                src={item.image}
                alt={item.alt}
                fill
                sizes="(max-width: 640px) 240px, (max-width: 768px) 280px, 320px"
                className="object-cover transition-transform duration-500"
                priority={index === 0}
              />
              {!isCenter && (
                <div className="absolute inset-0 bg-[#070312]/20 transition-opacity duration-500" />
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-center items-center gap-1.5 mt-8">
        {GRADUATION_ALBUM.map((_, dotIdx) => (
          <button
            key={dotIdx}
            type="button"
            onClick={() => setCurrentIndex(dotIdx)}
            aria-label={`Pindah ke foto ${dotIdx + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
              dotIdx === currentIndex
                ? "w-7 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]"
                : "w-2 bg-white/20 hover:bg-white/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
}