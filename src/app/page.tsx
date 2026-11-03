import Navbar from "@/components/layout/Navbar";
import HeroSlider from "@/components/home/HeroSlider";
import ExperienceHero from "@/components/home/ExperienceHero";
import AiPreviewContent from "@/components/home/AiPreviewContent";
import ServiceSection from "@/components/home/ServicesSection";
import PricingSection from "@/components/home/PricingSection";
import { SlideItem } from "@/types";
import Footer from "@/components/layout/Footer";
import ContactSection from "@/components/home/ContactSection";

const HERO_SLIDES: SlideItem[] = [
  {
    id: "1",
    tag: "CEKREKS HIGHLIGHT",
    title: "Abadikan Momen Sakral Anda!",
    description: "Kami abadikan, mulai dari pengajian & siraman, penyambutan, akad nikah, sungkeman, adat sawer, dan resepsi.",
    imageUrl: "/images/hero/wedding.jpeg",
    imagePosition: "center 25%",
  },
  {
    id: "2",
    tag: "CEKREKS HIGHLIGHT",
    title: "Abadikan Momen wisuda Anda",
    description: "Pengambilan foto video peliputan prosesi wisuda, pembuatan buku tahunan, dan photobooth wisuda.",
    imageUrl: "/images/hero/graduation.jpeg",
    imagePosition: "center 15%",
  },
  {
    id: "3",
    tag: "CEKREKS HIGHLIGHT",
    title: "Abadikan Acara & Seminar Anda",
    description: "Kami mengemas setiap rangkaian acara dan seminar Anda ke dalam visual yang bercerita, elegan, dan penuh makna.",
    imageUrl: "/images/hero/event.jpeg",
    imagePosition: "center 25%",
  },
  {
    id: "4",
    tag: "CEKREKS HIGHLIGHT",
    title: "Abadikan Momen Seru Anda",
    description: "Layanan sewa photobooth profesional dengan kualitas cetak premium, desain kustom, dan hasil instan di tempat.",
    imageUrl: "/images/hero/photobooth.jpeg",
    imagePosition: "center 80%",
  },
];

export default function HomePage() {
  return (
    <div id="beranda" className="min-h-screen bg-[#0e071e] text-white flex flex-col items-center font-sans scroll-mt-18">     
      {/* Container Konten Utama Vertikal (Column) */}
      <main className="w-full flex flex-col items-center gap-4 sm:gap-16 px-4 sm:px-6 pt-2 pb-20">
        <HeroSlider slides={HERO_SLIDES} />
        <ExperienceHero />
        <AiPreviewContent />
        <ServiceSection />
        <PricingSection />
        <ContactSection />
      </main>
    </div>
  );
}