import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface PricingPlan {
  id: string;
  name: string;
  category: string;
  price: string;
  period: string;
  description: string;
  buttonText: string;
  buttonHref: string;
}

const PRICING_PLANS: PricingPlan[] = [
  {
    id: "wedding",
    name: "Wedding Package",
    category: "WEDDING",
    price: "500k",
    period: "/ paket",
    description: "Abadikan momen sakral pernikahan Anda dengan liputan akad dan resepsi cinematic terbaik. Klik untuk melihat rincian paket selengkapnya!",
    buttonText: "Lihat Selengkapnya",
    buttonHref: "/layanan/wedding#pricing",
  },
  {
    id: "graduation",
    name: "Graduation Package",
    category: "GRADUATION",
    price: "300k",
    period: "/ sesi",
    description: "Rayakan kelulusan penuh kebahagiaan bersama keluarga tercinta dengan hasil foto studio atau outdoor yang elegan dan berkesan.",
    buttonText: "Lihat Selengkapnya",
    buttonHref: "/layanan/graduation#pricing",
  },
  {
    id: "event",
    name: "Event & Seminar",
    category: "EVENT & SEMINAR",
    price: "750k",
    period: "/ acara",
    description: "Solusi dokumentasi profesional full coverage untuk seminar, pameran, atau corporate gathering Anda agar tampil lebih interaktif.",
    buttonText: "Lihat Selengkapnya",
    buttonHref: "/layanan/eventseminar#pricing",
  },
  {
    id: "photobooth",
    name: "Photobooth Studio",
    category: "PHOTOBOOTH",
    price: "1.250k",
    period: "/ 2 jam",
    description: "Hadirkan keseruan cetak foto instan tanpa batas dan template kustom interaktif yang membuat tamu acara Anda semakin terkesan.",
    buttonText: "Lihat Selengkapnya",
    buttonHref: "/layanan/photobooth#pricing",
  },
];

export default function PricingSection() {
  return (
    <section id="harga" className="w-full max-w-[100rem] mx-auto px-4 sm:px-6 py-10 flex flex-col items-center scroll-mt-18">
      {/* CSS untuk Animasi Border Berganti Sesuai Tema Logo */}
      <style>{`
        @keyframes pulseCoral {
          0%, 100% { border-color: rgba(244, 63, 94, 0.2); box-shadow: 0 0 25px rgba(244, 63, 94, 0.15); }
          50% { border-color: rgba(244, 63, 94, 0.8); box-shadow: 0 0 35px rgba(244, 63, 94, 0.35); }
        }
        @keyframes pulsePink {
          0%, 100% { border-color: rgba(236, 72, 153, 0.2); box-shadow: 0 0 25px rgba(236, 72, 153, 0.15); }
          50% { border-color: rgba(236, 72, 153, 0.8); box-shadow: 0 0 35px rgba(236, 72, 153, 0.35); }
        }
        @keyframes pulsePurple {
          0%, 100% { border-color: rgba(168, 85, 247, 0.2); box-shadow: 0 0 25px rgba(168, 85, 247, 0.15); }
          50% { border-color: rgba(168, 85, 247, 0.8); box-shadow: 0 0 35px rgba(168, 85, 247, 0.35); }
        }
        @keyframes pulseIndigo {
          0%, 100% { border-color: rgba(99, 102, 241, 0.2); box-shadow: 0 0 25px rgba(99, 102, 241, 0.15); }
          50% { border-color: rgba(99, 102, 241, 0.8); box-shadow: 0 0 35px rgba(99, 102, 241, 0.35); }
        }

        .pricing-anim-0 { animation: pulseCoral 6s infinite ease-in-out; }
        .pricing-anim-1 { animation: pulsePink 6s infinite ease-in-out 1.5s; }
        .pricing-anim-2 { animation: pulsePurple 6s infinite ease-in-out 3s; }
        .pricing-anim-3 { animation: pulseIndigo 6s infinite ease-in-out 4.5s; }
      `}</style>

      {/* ================= HEADER SECTION ================= */}
      <div className="flex flex-col items-center text-center mb-10 sm:mb-12">
        <span className="text-[11px] sm:text-xs font-bold tracking-[0.25em] uppercase text-pink-400 mb-3">
          Pilih Paket Anda
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Pilihan Paket Layanan
        </h2>
        <p className="text-md sm:text-md text-gray-400 mt-3 max-w-xl">
          Temukan layanan dokumentasi terbaik untuk setiap momen berharga Anda dengan standar visual profesional.
        </p>
      </div>

      {/* ================= 4 CARDS PRICING GRID ================= */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch pt-2">
        {PRICING_PLANS.map((plan, index) => {
          // Mapping warna kustom spesifik per card mengikuti gradasi logo (Kiri ke Kanan)
          const themeStyles = [
            {
              // 1. Wedding (Kiri: Coral/Rose)
              bgCard: "bg-gradient-to-b from-[#1f101d] via-[#140b17] to-[#110815]",
              badgeBg: "bg-[#30111a] border-rose-500/30 text-rose-400",
              priceColor: "text-rose-400",
              hoverBorder: "hover:border-rose-400 hover:shadow-[0_10px_40px_rgba(244,63,94,0.3)]",
              btnBg: "bg-[#281017]/90 hover:bg-[#3b1522] border-rose-700/40 hover:border-rose-400/50",
              arrowHover: "group-hover/btn:text-rose-300",
            },
            {
              // 2. Graduation (Mid-Left: Pink/Magenta)
              bgCard: "bg-gradient-to-b from-[#200f1f] via-[#150a17] to-[#120715]",
              badgeBg: "bg-[#33112b] border-pink-500/30 text-pink-400",
              priceColor: "text-pink-400",
              hoverBorder: "hover:border-pink-400 hover:shadow-[0_10px_40px_rgba(236,72,153,0.3)]",
              btnBg: "bg-[#2b1025]/90 hover:bg-[#3e1436] border-pink-700/40 hover:border-pink-400/50",
              arrowHover: "group-hover/btn:text-pink-300",
            },
            {
              // 3. Event & Seminar (Mid-Right: Purple)
              bgCard: "bg-gradient-to-b from-[#1b0d24] via-[#130919] to-[#100714]",
              badgeBg: "bg-[#221033] border-purple-500/30 text-purple-300",
              priceColor: "text-purple-400",
              hoverBorder: "hover:border-purple-400 hover:shadow-[0_10px_40px_rgba(168,85,247,0.3)]",
              btnBg: "bg-[#1d0e2c]/90 hover:bg-[#2b1440] border-purple-700/40 hover:border-purple-400/50",
              arrowHover: "group-hover/btn:text-purple-300",
            },
            {
              // 4. Photobooth (Kanan: Indigo/Blue-Purple)
              bgCard: "bg-gradient-to-b from-[#101026] via-[#0a0a1a] to-[#070713]",
              badgeBg: "bg-[#111633] border-indigo-500/30 text-indigo-300",
              priceColor: "text-indigo-400",
              hoverBorder: "hover:border-indigo-400 hover:shadow-[0_10px_40px_rgba(99,102,241,0.3)]",
              btnBg: "bg-[#10132b]/90 hover:bg-[#181d42] border-indigo-700/40 hover:border-indigo-400/50",
              arrowHover: "group-hover/btn:text-indigo-300",
            },
          ][index];

          const animClass = `pricing-anim-${index}`;

          return (
            <div
              key={plan.id}
              className={`rounded-3xl p-5 sm:p-6 flex flex-col justify-between border border-white/10 hover:-translate-y-2 transition-all duration-500 group ${themeStyles.bgCard} ${themeStyles.hoverBorder} ${animClass}`}
            >
              <div>
                {/* Badge Kategori Acara */}
                <div className="mb-3">
                  <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border ${themeStyles.badgeBg}`}>
                    {plan.category}
                  </span>
                </div>

                {/* Nama Paket */}
                <h3 className="text-lg sm:text-xl font-black text-white tracking-tight mb-3">
                  {plan.name}
                </h3>

                {/* Harga dengan Label "Mulai dari" */}
                <div className="mb-4 pb-4 border-b border-white/10">
                  <span className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">
                    Mulai dari
                  </span>
                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    <span className={`text-xl sm:text-2xl font-black tracking-tight ${themeStyles.priceColor}`}>
                      {plan.price}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">
                      {plan.period}
                    </span>
                  </div>
                </div>

                {/* Deskripsi Singkat Kategori */}
                <div className="mb-4">
                  <p className="text-base text-gray-300 font-normal leading-relaxed">
                    {plan.description}
                  </p>
                </div>
              </div>

              {/* Tombol Aksi */}
              <div className="pt-2">
                <Link
                  href={plan.buttonHref}
                  className={`w-full py-2.5 rounded-full border text-xs sm:text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.99] group/btn ${themeStyles.btnBg}`}
                >
                  <span>{plan.buttonText}</span>
                  <ArrowRight className={`w-3.5 h-3.5 text-slate-400 transition-all group-hover/btn:translate-x-1 ${themeStyles.arrowHover}`} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}