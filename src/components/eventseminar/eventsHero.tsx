import { Sparkles } from "lucide-react";
import Image from "next/image";

export default function EventsHero() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center pb-16 border-b border-white/10">
      {/* Kolom Kiri */}
      <div className="lg:col-span-7 space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold uppercase bg-[#180d38] text-cyan-300 border border-cyan-400/30">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Detail Layanan Event
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
          Layanan Dokumentasi{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
            Event & Acara
          </span>
        </h1>

        <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
          Setiap momen penting dalam acara Anda layak untuk diabadikan secara profesional. Kami siap mendokumentasikan setiap keseruan, energi, dan kemeriahan dalam karya visual yang berkesan dan berkualitas tinggi.
        </p>

        <div className="flex flex-wrap items-center gap-4 pt-3">
          <a
            href="#pricing"
            className="px-6 py-3 rounded-xl font-bold text-xs sm:text-sm bg-cyan-400 text-gray-950 hover:bg-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.3)] transition duration-300"
          >
            Lihat Pilihan Paket
          </a>
        </div>
      </div>

      {/* Kolom Kanan: Murni Gambar Full Showcase */}
      <div className="lg:col-span-5">
        <div className="relative aspect-square sm:aspect-[4/3] lg:aspect-[4/4] w-full rounded-3xl overflow-hidden border border-cyan-400/30 shadow-[0_0_35px_rgba(34,211,238,0.18)] group">
          <Image
            src="/images/hero/events.jpg"
            alt="Dokumentasi Event Cekreks.id"
            fill
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            priority
          />
        </div>
      </div>
    </section>
  );
}