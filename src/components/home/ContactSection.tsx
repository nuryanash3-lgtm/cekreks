"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Send, CheckCircle2, ChevronDown } from "lucide-react";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    whatsapp: "",
    category: "Wedding",
    message: "",
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const categories = [
    { label: "Wedding", value: "Wedding" },
    { label: "Graduation", value: "Graduation" },
    { label: "Event & Seminar", value: "Event & Seminar" },
    { label: "Photobooth", value: "Photobooth" },
  ];

  // Menutup dropdown jika pengguna mengklik di luar elemen
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.whatsapp || !formData.message) return;

    const encodedMsg = encodeURIComponent(
      `Halo Tim CEKREKS.ID, saya ${formData.name}.\n\nSaya ingin memesan layanan untuk kategori: *${formData.category}*\n\nDetail/Catatan:\n${formData.message}\n\n(No WA: ${formData.whatsapp})`
    );
    window.open(`https://wa.me/6285801105140?text=${encodedMsg}`, "_blank");

    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 4000);
  };

  return (
    <section
      id="kontak"
      className="w-full max-w-[100rem] mx-auto px-4 sm:px-6 py-10 flex flex-col scroll-mt-18"
    >
      {/* Header Section */}
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-10 sm:mb-12">
        <span className="text-[11px] sm:text-xs font-bold tracking-[0.25em] uppercase text-purple-400 mb-3 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
          Temukan Solusinya di Sini
        </span>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Pesan Langsung Ke CS Kami
        </h2>

        <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-xl mt-3">
          Gunakan formulir ini khusus untuk pemesanan (booking) layanan. Untuk pertanyaan seputar info cepat, silakan gunakan CS AI di pojok kanan bawah.
        </p>
      </div>

      {/* Grid 2 Kolom: Gambar Sisi Kiri & Form Sisi Kanan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-stretch">
        {/* Kolom Kiri: Foto Dokumentasi Tim / Studio */}
        <div className="relative w-full h-[360px] sm:h-[440px] lg:h-auto min-h-[380px] rounded-3xl overflow-hidden border border-purple-800/40 bg-neutral-900 shadow-[0_0_35px_rgba(112,26,117,0.2)]">
          <Image
            src="/images/hero/crew.png"
            alt="Tim Dokumentasi Fotografi"
            fill
            className="object-cover object-center brightness-90 contrast-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e071e]/70 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Kolom Kanan: Card Formulir */}
        <div className="rounded-3xl border border-purple-800/40 bg-[#12072b]/85 backdrop-blur-md p-6 sm:p-9 flex flex-col justify-between shadow-[0_0_40px_rgba(112,26,117,0.18)]">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Input Nama Lengkap */}
            <div className="flex flex-col gap-2">
              <label className="text-base font-semibold text-slate-200 text-left">
                Nama Lengkap
              </label>
              <input
                type="text"
                placeholder="Masukkan nama Anda"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="w-full px-4 py-3 rounded-xl bg-[#0c051a]/90 border border-purple-800/60 text-white placeholder-slate-500 text-base focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
              />
            </div>

            {/* Input No WhatsApp */}
            <div className="flex flex-col gap-2">
              <label className="text-base font-semibold text-slate-200 text-left">
                No. WhatsApp <span className="text-pink-500">*</span>
              </label>
              <input
                type="tel"
                placeholder="Masukan No WA"
                value={formData.whatsapp}
                onChange={(e) =>
                  setFormData({ ...formData, whatsapp: e.target.value })
                }
                required
                className="w-full px-4 py-3 rounded-xl bg-[#0c051a]/90 border border-purple-800/60 text-white placeholder-slate-500 text-base focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
              />
            </div>

            {/* Custom Dropdown Kategori Layanan */}
            <div className="flex flex-col gap-2 relative" ref={dropdownRef}>
              <label className="text-base font-semibold text-slate-200 text-left">
                Pilih Kategori Layanan <span className="text-pink-500">*</span>
              </label>
              
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full px-4 py-3 rounded-xl bg-[#0c051a]/90 border border-purple-800/60 text-white text-base flex items-center justify-between focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition cursor-pointer"
              >
                <span>{formData.category}</span>
                <ChevronDown className={`w-4 h-4 text-purple-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 rounded-xl bg-[#12072b]/95 border border-purple-800/80 backdrop-blur-xl shadow-2xl z-50 overflow-hidden py-1">
                  {categories.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, category: item.value });
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left text-base transition flex items-center justify-between cursor-pointer ${
                        formData.category === item.value
                          ? 'bg-gradient-to-r from-[#6929d9]/40 to-[#0ea5e9]/20 text-cyan-300 font-medium border-l-4 border-cyan-400'
                          : 'text-slate-300 hover:bg-purple-950/50 hover:text-white'
                      }`}
                    >
                      <span>{item.label}</span>
                      {formData.category === item.value && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Textarea Pesan */}
            <div className="flex flex-col gap-2">
              <label className="text-base font-semibold text-slate-200 text-left">
                Detail / Catatan Pesanan <span className="text-pink-500">*</span>
              </label>
              <textarea
                rows={4}
                placeholder="Tulis detail atau tanggal acara di sini"
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                required
                className="w-full px-4 py-3 rounded-xl bg-[#0c051a]/90 border border-purple-800/60 text-white placeholder-slate-500 text-base focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition resize-none"
              />
            </div>

            {/* Tombol Submit */}
            <button
              type="submit"
              className="mt-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-[#6929d9] via-[#4f46e5] to-[#0ea5e9] text-white font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(14,165,233,0.45)] hover:shadow-[0_0_28px_rgba(14,165,233,0.65)] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Pesan Sekarang ( Booking )</span>
            </button>

            {isSubmitted && (
              <div className="flex items-center gap-2 text-xs text-emerald-400 justify-center mt-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Pesan berhasil dialihkan ke WhatsApp!</span>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}