"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import {
  Award,
  Briefcase,
  Handshake,
  Clock,
  ShieldCheck,
  Users,
  Camera,
  Sparkles
} from "lucide-react";

// Definisi tipe props untuk komponen Counter
interface CounterProps {
  end: string | number;
  suffix?: string;
}

function Counter({ end, suffix = "" }: CounterProps) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime: number | null = null;
    const duration = 2000;
    const numericEnd = typeof end === "string" ? parseInt(end, 10) : end;

    const animateCount = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);

      const currentVal = percentage === 1 ? numericEnd : Math.floor(numericEnd * (1 - Math.pow(2, -10 * percentage)));

      setCount(currentVal);

      if (progress < duration) {
        requestAnimationFrame(animateCount);
      }
    };

    requestAnimationFrame(animateCount);
  }, [hasStarted, end]);

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  );
}

export default function PortfolioSection() {
  const stats = [
    {
      value: "10",
      suffix: "+",
      label: "Tahun Pengalaman",
      desc: "Dalam industri fotografi & dokumentasi",
      icon: <Award className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400 mb-1 sm:mb-2" />
    },
    {
      value: "200",
      suffix: "+",
      label: "Proyek Selesai",
      desc: "Event, Booth, & Campaign sukses",
      icon: <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400 mb-1 sm:mb-2" />
    },
    {
      value: "45",
      suffix: "+",
      label: "Mitra & Klien",
      desc: "WO, Korporat, hingga Venue",
      icon: <Handshake className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400 mb-1 sm:mb-2" />
    },
  ];

  // Data benefit dengan ikon khusus
  const benefits = [
    {
      title: "Lebih Berpengalaman",
      desc: "Melayani klien lebih dari 10 tahun sejak 2015, menjadi bekal utama kami untuk memberikan hasil kerja yang optimal.",
      icon: <Clock className="w-5 h-5 text-cyan-400" />
    },
    {
      title: "Kepercayaan Mitra",
      desc: "Lebih dari 45 Mitra yang telah berkerjasama dengan Sudio kami yang menggunakan jasa kami juga bermitra dengan vendor-vendor sampai sekarang.",
      icon: <ShieldCheck className="w-5 h-5 text-purple-400" />
    },
    {
      title: "Profesional Crew Fotografer",
      desc: "Selain crew fotografer utama, kami dibantu dengan crew official dalam menjalankan tugas.",
      icon: <Users className="w-5 h-5 text-cyan-400" />
    },
    {
      title: "Perlengkapan Profesional",
      desc: "Selain di dukung perlengkapan Kamera dan lampu profesional, Hasil sentuhan editing nya yang elegan, renyah gurih, menarik dan hasil cetakan yang tahan lama.",
      icon: <Camera className="w-5 h-5 text-purple-400" />
    },
    {
      title: "Tim Editor Professional",
      desc: "Desain dikerjakan oleh tim Editor yg benar-benar berkerja dibidangnya.",
      icon: <Sparkles className="w-5 h-5 text-cyan-400" />
    },
  ];

  // Daftar logo mitra pendidikan
  const partners = [
    { name: "1", logoUrl: "/images/mitra/pendidikan/1.png" },
    { name: "2", logoUrl: "/images/mitra/pendidikan/2.png" },
    { name: "3", logoUrl: "/images/mitra/pendidikan/3.png" },
    { name: "4", logoUrl: "/images/mitra/pendidikan/4.png" },
    { name: "6", logoUrl: "/images/mitra/pendidikan/6.png" },
    { name: "7", logoUrl: "/images/mitra/pendidikan/7.png" },
    { name: "8", logoUrl: "/images/mitra/pendidikan/8.png" },
    { name: "9", logoUrl: "/images/mitra/pendidikan/9.png" },
    { name: "10", logoUrl: "/images/mitra/pendidikan/10.png" },
    { name: "11", logoUrl: "/images/mitra/pendidikan/11.png" },
    { name: "12", logoUrl: "/images/mitra/pendidikan/12.png" },
    { name: "13", logoUrl: "/images/mitra/pendidikan/13.png" },
    { name: "14", logoUrl: "/images/mitra/pendidikan/14.png" },
    { name: "15", logoUrl: "/images/mitra/pendidikan/15.png" },
    { name: "16", logoUrl: "/images/mitra/pendidikan/16.png" },
    { name: "17", logoUrl: "/images/mitra/pendidikan/17.png" },
    { name: "18", logoUrl: "/images/mitra/pendidikan/18.png" },
    { name: "20", logoUrl: "/images/mitra/pendidikan/20.png" },
    { name: "22", logoUrl: "/images/mitra/pendidikan/22.png" },
    { name: "24", logoUrl: "/images/mitra/pendidikan/24.png" },
    { name: "25", logoUrl: "/images/mitra/pendidikan/25.png" },
    { name: "26", logoUrl: "/images/mitra/pendidikan/26.png" },
    { name: "27", logoUrl: "/images/mitra/pendidikan/27.png" },
    { name: "28", logoUrl: "/images/mitra/pendidikan/28.png" },
    { name: "29", logoUrl: "/images/mitra/pendidikan/29.png" },
    { name: "30", logoUrl: "/images/mitra/pendidikan/30.png" },
    { name: "31", logoUrl: "/images/mitra/pendidikan/31.png" },
    { name: "32", logoUrl: "/images/mitra/pendidikan/32.png" },
    { name: "33", logoUrl: "/images/mitra/pendidikan/33.png" },
    { name: "34", logoUrl: "/images/mitra/pendidikan/34.png" },
    { name: "37", logoUrl: "/images/mitra/pendidikan/37.png" },
    { name: "38", logoUrl: "/images/mitra/pendidikan/38.png" },
  ];

  // Daftar logo mitra perusahaan (folder khusus perusahaan)
  const companyPartners = [
    { name: "Comp 1", logoUrl: "/images/mitra/perusahaan/5.png" },
    { name: "Comp 2", logoUrl: "/images/mitra/perusahaan/19.png" },
    { name: "Comp 3", logoUrl: "/images/mitra/perusahaan/21.png" },
    { name: "Comp 4", logoUrl: "/images/mitra/perusahaan/23.png" },
    { name: "Comp 5", logoUrl: "/images/mitra/perusahaan/35.png" },
    { name: "Comp 6", logoUrl: "/images/mitra/perusahaan/36.png" },
  ];

  return (
    <section id="portofolio" className="w-full max-w-[100rem] mx-auto px-4 sm:px-6 py-10 scroll-mt-18">
      {/* Header Section */}
      <div className="flex flex-col items-center text-center border-b border-slate-800 pb-8 mb-10 sm:mb-12">
        <span className="text-xs font-semibold uppercase tracking-widest text-purple-400 mb-2">
          Jejak Langkah
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
          Portofolio Kami
        </h2>
        <p className="text-base sm:text-base text-slate-300 max-w-2xl leading-relaxed">
          Berdiri sejak 2015, kami hadir dengan dedikasi tinggi dalam industri fotografi, dokumentasi acara, dan teknologi AI photobooth untuk mengabadikan setiap momen spesial Anda.
        </p>
      </div>

      {/* ================= MENGAPA HARUS KAMI? ================= */}
      <div className="mb-16 px-2 sm:px-4">
        <div className="text-center mb-8">
          <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Mengapa Harus Kami?
          </h3>
          <p className="text-base text-slate-400 mt-1">
            Komitmen kami dalam memberikan kualitas terbaik untuk setiap momen berharga
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-5">
          {benefits.map((item, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl bg-[#140b2b]/90 border border-white/10 hover:border-cyan-400/40 transition-all duration-300 flex flex-col justify-between group w-full md:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)]"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h4 className="text-base font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                  {item.title}
                </h4>
                <p className="text-base sm:text-sm text-slate-300 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= STATS GRID ================= */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-6 mb-16">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="p-3 sm:pl-4 sm:py-4 bg-[#140b2b]/50 sm:bg-slate-900/40 border sm:border-0 border-white/10 rounded-xl sm:rounded-r-lg sm:border-l-2 sm:border-purple-500 flex flex-col items-center sm:items-start text-center sm:text-left"
          >
            <div className="flex justify-center sm:justify-start">
              {stat.icon}
            </div>
            <div className="text-xl sm:text-4xl font-extrabold text-white font-mono tracking-tight mb-0.5 sm:mb-1">
              <Counter end={stat.value} suffix={stat.suffix} />
            </div>
            <div className="text-[11px] sm:text-sm font-semibold text-purple-300 mb-0.5 leading-tight">
              {stat.label}
            </div>
            <div className="text-[10px] sm:text-xs text-slate-400 hidden sm:block">
              {stat.desc}
            </div>
          </div>
        ))}
      </div>

      {/* Team Member Grid Gallery */}
      <div className="text-center mb-4">
        <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Tim Kami
        </h3>
        <p className="text-base text-slate-400 mt-1">
          Kami bekerja dengan profesional kami untuk anda.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-2 gap-y-1 sm:gap-3 mb-20 items-end">
        {[
          { name: "Muhammad Revy", image: "/images/team/1.png" },
          { name: "Andi Pratama", image: "/images/team/2.png" },
          { name: "Siti Rahma", image: "/images/team/3.png" },
          { name: "Rizky Ramadhan", image: "/images/team/4.png" },
        ].map((member, idx) => (
          <div
            key={idx}
            className="relative h-46 sm:h-50 lg:h-80 w-full flex items-end justify-center group"
          >
            <div className="relative w-full h-full">
              <Image
                src={member.image}
                alt={member.name}
                fill
                className="object-contain object-bottom group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        ))}
      </div>

      {/* ================= BAGIAN MITRA KAMI ================= */}
      <div className="mt-12 pt-8 border-t border-slate-800/80">

        {/* Baris 1: Mitra Pendidikan (Bergerak ke Kiri) */}
        <div className="mb-4">
          <div className="text-center mb-4">
            <p className="text-sm font-semibold uppercase tracking-widest text-slate-400">
              Mitra Kami
            </p>
          </div>

          <div className="relative w-full overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
            <div
              className="flex animate-marquee whitespace-nowrap gap-2 md:gap-12 items-center py-4"
              style={{ animationDuration: "45s" }}
            >
              {/* Duplikasi array beberapa kali agar panjang dan mulus */}
              {[...partners, ...partners].map((partner, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center shrink-0 transition-transform duration-300 hover:scale-105"
                >
                  <img
                    src={partner.logoUrl}
                    alt={partner.name}
                    className="h-16 md:h-24 w-auto object-contain transition-transform duration-300 opacity-80 hover:opacity-100"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Baris 2: Mitra Perusahaan (Bergerak ke Kanan / Berlawanan Arah) */}
        <div>
          <div className="relative w-full overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
            <div
              className="flex animate-marquee whitespace-nowrap gap-2 md:gap-12 items-center py-4"
              style={{
                animationDuration: "45s",
                animationDirection: "reverse"
              }}
            >
              {/* Karena item cuma 6, kita duplikasi sebanyak 5-6 kali agar panjang elemennya memadai dan tidak ada jeda kosong */}
              {[...companyPartners, ...companyPartners, ...companyPartners, ...companyPartners, ...companyPartners, ...companyPartners].map((partner, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center shrink-0 transition-transform duration-300 hover:scale-105"
                >
                  <img
                    src={partner.logoUrl}
                    alt={partner.name}
                    className="h-16 md:h-24 w-auto object-contain transition-transform duration-300 opacity-80 hover:opacity-100"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}