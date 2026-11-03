import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  GraduationCap,
  Presentation,
  Camera,
  ArrowRight
} from "lucide-react";

interface ServiceItem {
  id: string;
  title: string;
  subtitle: string;
  icon: typeof Heart;
  description: string;
  imageUrl: string;
  imagePosition: string; // Properti untuk mengatur titik fokus gambar (misal: "center 20%")
  features: string[];
  ctaText: string;
  ctaHref: string;
}

const SERVICES_DATA: ServiceItem[] = [
  {
    id: "wedding",
    title: "Wedding Photography",
    subtitle: "Dokumentasi Pernikahan Elegan",
    icon: Heart,
    imageUrl: "/images/layanan/weddingan.jpeg",
    imagePosition: "center 20%",
    description:
      "Layanan fotografi pernikahan eksklusif yang memadukan keindahan foto konvensional beresolusi tinggi dengan keajaiban efek AI Generatif.",
    features: [
      "Cetak Foto Instan Berbagai Ukuran Premium",
      "Kustomisasi Busana & Tema AI Impian",
      "Galeri Online/QR Fleksibel Pengantin",
      "Pencahayaan & Editing Otomatis Realtime",
    ],
    ctaText: "Lihat Layanan",
    ctaHref: "/layanan/wedding",
  },
  {
    id: "graduation",
    title: "Graduation",
    subtitle: "Momen Wisuda Berkesan Elegan",
    icon: GraduationCap,
    imageUrl: "/images/layanan/graduation.jpg",
    imagePosition: "center 70%",
    description:
      "Rayakan kelulusan dan pencapaian akademik dengan pengalaman dokumentasi yang modern. Layanan graduation kami memberikan fasilitas terbaik untuk anda.",
    features: [
      "Background Kampus & Landmark Dunia",
      "Output Foto High-Definition Siap Cetak",
      "Custom Watermark Nama & Gelar Wisudawan",
      "Direct Share ke Media Sosial Instant",
    ],
    ctaText: "Lihat Layanan",
    ctaHref: "/layanan/graduation",
  },
  {
    id: "event",
    title: "Event dan Seminar",
    subtitle: "Solusi Interaktif Branding Perusahaan",
    icon: Presentation,
    imageUrl: "/images/layanan/eventseminar.jpeg",
    imagePosition: "center 50%",
    description:
      "Tingkatkan engagement dan excitement pada seminar bisnis, exhibition, peluncuran produk, maupun corporate gathering.",
    features: [
      "Branding Frame & Template Perusahaan",
      "Pengumpulan Data Email & Visitor Analytics",
      "Live Screen Pemutaran Slideshow",
      "Sistem Antrean QR Tanpa Antrean",
    ],
    ctaText: "Lihat Layanan",
    ctaHref: "/layanan/eventseminar",
  },
  {
    id: "photobooth",
    title: "Photobooth",
    subtitle: "Foto Interaktif AI dan Konvensional",
    icon: Camera,
    imageUrl: "/images/layanan/photobooth.jpg",
    imagePosition: "center 20%",
    description:
      "Setup booth fisik interaktif yang dapat ditempatkan di berbagai event wedding, ulang tahun, festival musik, pameran, dan seminar.",
    features: [
      "100+ Pilihan Style Visual AI Unik",
      "Filter Cyberpunk, Retro, Anime & Pelukis",
      "Proses Render Cetak < 10 Detik",
      "Dukungan Multi-Kamera & Tablet Desk",
    ],
    ctaText: "Lihat Layanan",
    ctaHref: "/layanan/photobooth",
  },
];

export default function ServicesSection() {
  return (
    <section id="layanan" className="w-full max-w-[100rem] mx-auto px-4 sm:px-6 py-10 flex flex-col items-center scroll-mt-18">
      {/* HEADER SECTION */}
      <div className="flex flex-col items-center text-center max-w-3xl mb-10 sm:mb-12">
        <span className="text-[11px] sm:text-xs font-bold tracking-[0.25em] uppercase text-purple-400 mb-3 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
          Apa yang Kami Tawarkan
        </span>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Layanan Kami
        </h2>

        <p className="text-md sm:text-md text-slate-300 font-normal leading-relaxed max-w-xl mt-3">
          Pilihan jenis layanan yang dirancang khusus untuk memenuhi segala kebutuhan dokumentasi visual acara Anda.
        </p>
      </div>

      {/* ================= 4 CARDS GRID (FULL IMAGE WITH GRADIENT OVERLAY) ================= */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {SERVICES_DATA.map((service) => {
          const Icon = service.icon;
          return (
            <div
              key={service.id}
              className="relative rounded-3xl overflow-hidden border border-purple-800/40 bg-neutral-900 h-[480px] sm:h-[520px] flex flex-col justify-end shadow-[0_0_30px_rgba(112,26,117,0.18)] hover:border-fuchsia-500/60 hover:shadow-[0_0_35px_rgba(217,70,239,0.25)] transition-all duration-500 group"
            >
              {/* Background Full Image */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={service.imageUrl}
                  alt={service.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 brightness-90"
                  style={{ objectPosition: service.imagePosition }}
                />
                {/* Gradasi Overlay Gelap dari Bawah ke Atas agar Teks Terbaca Jelas */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0518] via-[#0b0518]/80 to-transparent pointer-events-none" />
              </div>

              {/* Konten di Atas Gambar */}
              <div className="relative z-10 p-6 sm:p-8 flex flex-col justify-end h-full">

                {/* Header Kartu: Ikon & Judul */}
                <div className="flex items-center gap-3.5 mb-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#1e0f3d]/90 border border-purple-700/50 backdrop-blur-md flex items-center justify-center shrink-0 text-cyan-400 group-hover:scale-105 group-hover:border-cyan-400/60 transition shadow-inner">
                    <Icon className="w-5 h-5 fill-cyan-400/10" />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight group-hover:text-cyan-300 transition drop-shadow-md">
                      {service.title}
                    </h3>
                    <span className="text-xs sm:text-sm text-cyan-400/90 font-medium line-clamp-1">
                      {service.subtitle}
                    </span>
                  </div>
                </div>

                {/* Deskripsi Lengkap */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal mb-6 text-left drop-shadow">
                  {service.description}
                </p>

                {/* Tombol CTA Pesan Layanan */}
                <div className="pt-2 max-w-xs mx-auto w-full">
                  <Link
                    href={service.ctaHref}
                    className="relative overflow-hidden w-full py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-rose-600/50 via-purple-600/50 to-indigo-700/50 text-xs sm:text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all duration-300 active:scale-[0.99] group/btn shadow-[0_4px_20px_rgba(147,51,234,0.35)] border border-white/20"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <span>{service.ctaText}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-white group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </span>
                  </Link>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}