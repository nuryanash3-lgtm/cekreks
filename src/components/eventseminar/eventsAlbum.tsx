"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { EVENTS_ALBUM } from "@/constants/eventsData";

export default function EventsAlbum() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const total = EVENTS_ALBUM.length;

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % total);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + total) % total);
    };

    // Timer otomatis murni berputar tiap 3 detik
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % total);
        }, 3000);

        return () => clearInterval(timer);
    }, [total]);

    // Menghitung posisi relatif setiap foto
    const getSlideStyle = (index: number) => {
        let diff = (index - currentIndex) % total;
        if (diff < -Math.floor(total / 2)) diff += total;
        if (diff > Math.floor(total / 2)) diff -= total;

        // Foto Tengah (Membesar 1.12x, Full Highlight, Jernih Penuh)
        if (diff === 0) {
            return {
                transform: "translateX(0%) scale(1.12)",
                zIndex: 30,
                opacity: 1,
                filter: "brightness(1)",
                pointerEvents: "auto" as const,
            };
        }

        // Foto Kanan Tepat
        if (diff === 1) {
            return {
                transform: "translateX(90%) scale(0.85)",
                zIndex: 20,
                opacity: 0.8,
                filter: "brightness(0.85)",
                pointerEvents: "auto" as const,
            };
        }

        // Foto Kiri Tepat
        if (diff === -1) {
            return {
                transform: "translateX(-90%) scale(0.85)",
                zIndex: 20,
                opacity: 0.8,
                filter: "brightness(0.85)",
                pointerEvents: "auto" as const,
            };
        }

        // Foto Kanan ke-2 (Layer luar)
        if (diff === 2) {
            return {
                transform: "translateX(145%) scale(0.7)",
                zIndex: 10,
                opacity: 0.4,
                filter: "brightness(0.6)",
                pointerEvents: "none" as const,
            };
        }

        // Foto Kiri ke-2 (Layer luar)
        if (diff === -2) {
            return {
                transform: "translateX(-145%) scale(0.7)",
                zIndex: 10,
                opacity: 0.4,
                filter: "brightness(0.6)",
                pointerEvents: "none" as const,
            };
        }

        // Sisanya disembunyikan di belakang
        return {
            transform: "translateX(0%) scale(0.5)",
            zIndex: 0,
            opacity: 0,
            pointerEvents: "none" as const,
        };
    };

    return (
        <section className="py-20 border-t border-white/10 overflow-hidden">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-[100rem] mx-auto px-5 mb-12">
                <div className="text-center sm:text-left">
                    <div className="inline-flex items-center gap-1.5 py-1 rounded-full text-xs font-semibold uppercase text-cyan-300">
                        Album
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white">
                        Hasil Karya Event & Acara
                    </h2>
                    <p className="text-xs text-gray-400 mt-1">
                        Momen keseruan dan kemeriahan asli yang diabadikan langsung oleh Cekreks.id
                    </p>
                </div>

                {/* Tombol Manual Kiri & Kanan */}
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

            {/* Carousel Track */}
            <div className="relative w-full max-w-[100rem] mx-auto h-[500px] sm:h-[580px] flex items-center justify-center">
                {EVENTS_ALBUM.map((item, index) => {
                    const style = getSlideStyle(index);
                    const isCenter = index === currentIndex;

                    return (
                        <div
                            key={item.id}
                            onClick={() => setCurrentIndex(index)}
                            style={style}
                            className={`absolute top-1/2 -translate-y-1/2 w-[210px] sm:w-[250px] md:w-[270px] aspect-[9/16] rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer transition-all duration-700 ease-out select-none ${
                                isCenter
                                    ? "border-2 border-cyan-400 shadow-[0_0_40px_rgba(34,211,238,0.4)]"
                                    : "border border-white/10 shadow-2xl hover:opacity-90"
                            }`}
                        >
                            <Image
                                src={item.image}
                                alt={item.alt}
                                fill
                                sizes="(max-width: 640px) 240px, (max-width: 768px) 280px, 320px"
                                className="object-cover object-center transition-transform duration-500"
                                priority={index === 0}
                            />

                            {/* Overlay tipis khusus foto samping yang tidak aktif */}
                            {!isCenter && (
                                <div className="absolute inset-0 bg-[#070312]/20 transition-opacity duration-500" />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Titik Indikator */}
            <div className="flex justify-center items-center gap-1.5 mt-8">
                {EVENTS_ALBUM.map((_, dotIdx) => (
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