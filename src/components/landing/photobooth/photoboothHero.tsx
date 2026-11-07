import { Sparkles } from "lucide-react";

export default function EventsHero() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center pb-16 border-b border-white/10">
      {/* Kolom Tengah (Mengambil seluruh lebar grid di lg: 12 kolom) */}
      <div className="lg:col-span-12 flex flex-col items-center text-center space-y-6">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold uppercase bg-[#180d38] text-cyan-300 border border-cyan-400/30">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Detail Layanan Photobooth
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight max-w-3xl">
          Layanan AI Photobooth &{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
            Konvensional Booth
          </span>
        </h1>

        {/* Paragraf */}
        <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-2xl">
          Buat acara Anda semakin meriah dan berkesan! Nikmati keseruan cetak foto kilat berkualitas tinggi lengkap dengan integrasi fitur AI Style, digital filter canggih, dan template kustom khusus untuk setiap momen spesial Anda.
        </p>

        {/* Tombol Aksi */}
        <div className="flex flex-wrap justify-center items-center gap-4 pt-3">
          <a
            href="#pricing"
            className="px-6 py-3 rounded-xl font-bold text-xs sm:text-sm bg-cyan-400 text-gray-950 hover:bg-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.3)] transition duration-300"
          >
            Lihat Pilihan Paket
          </a>
        </div>

      </div>
    </section>
  );
}