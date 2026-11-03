"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SlideItem } from "@/types";

interface HeroSliderProps {
  slides: SlideItem[];
}

export default function HeroSlider({ slides }: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;

    const intervalId = window.setInterval(() => {
      setCurrentIndex((index) => (index + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="w-full max-w-[100rem] relative rounded-3xl overflow-hidden border border-purple-800/40 bg-gradient-to-b from-[#160b33] to-[#0d061c] shadow-[0_0_40px_rgba(112,26,117,0.18)] group">
      {/* Container Gambar */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9] max-h-[520px] min-h-[420px] bg-neutral-900 overflow-hidden">
        {/* Layer Semua Gambar untuk Transisi Cross-Fade Halus */}
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              idx === currentIndex ? "opacity-100 z-1" : "opacity-0 pointer-events-none z-0"
            }`}
          >
            <Image
              src={slide.imageUrl}
              alt={slide.title}
              fill
              priority={idx === 0}
              style={{ objectPosition: slide.imagePosition ?? "center" }}
              className="object-cover"
            />
          </div>
        ))}

        <div className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-[#0e071e] via-[#0e071e]/70 to-transparent z-10 pointer-events-none" />

        {/* Tombol Panah Navigasi Kiri & Kanan */}
        <button
          onClick={prevSlide}
          aria-label="Slide sebelumnya"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/10 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2]" />
        </button>

        <button
          onClick={nextSlide}
          aria-label="Slide berikutnya"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/10 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95"
        >
          <ChevronRight className="w-6 h-6 stroke-[2]" />
        </button>

        {/* Konten Kiri Bawah (Diberi right-24 di mobile agar aman dari dots, tanpa line-clamp) */}
        <div className="absolute bottom-5 left-4 right-24 sm:bottom-10 sm:left-10 sm:right-auto max-w-xl z-20 pointer-events-none flex flex-col justify-end">
          <span className="text-[10px] sm:text-xs font-extrabold tracking-widest uppercase text-cyan-400 mb-1">
            {slides[currentIndex].tag}
          </span>
          <h1 className="text-base sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-snug sm:leading-tight mb-1 sm:mb-2 drop-shadow-md">
            {slides[currentIndex].title}
          </h1>
          <p className="text-[11px] sm:text-sm text-slate-300 font-normal leading-relaxed">
            {slides[currentIndex].description}
          </p>
        </div>

        {/* Dots Pagination di Kanan Bawah */}
        <div className="absolute bottom-5 right-4 sm:bottom-10 sm:right-10 z-20 flex items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Buka slide ${idx + 1}`}
              className={`transition-all duration-300 ${
                idx === currentIndex
                  ? "w-6 h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                  : "w-2 h-2 rounded-full bg-slate-600/70 hover:bg-slate-400"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}