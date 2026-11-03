export interface SubPlan {
  id: string;
  name: string;
  price: string;
  features: string[];
}

export interface PhotoboothPackage {
  categoryName: string;
  tagline: string;
  popular?: boolean;
  desc: string;
  tiers: SubPlan[];
}

export interface PhotoboothScopeItem {
  title: string;
  tag: string;
  desc: string;
  image: string;
}

export const PHOTOBOOTH_SERVICES_SCOPE: PhotoboothScopeItem[] = [
  {
    title: "Konvensional Photobooth",
    tag: "Standard Booth",
    desc: "Layanan photobooth cetak kilat dengan mesin high-speed, hasil foto jernih menggunakan kamera profesional, serta bingkai kertas eksklusif.",
    image: "/images/photobooth/konvensional.jpg",
  },
  {
    title: "AI Photobooth Integration",
    tag: "AI Tech",
    desc: "Inovasi photobooth modern dengan integrasi fitur AI Style, digital filter canggih, serta live QR code download foto secara instan.",
    image: "/images/photobooth/ai-booth.jpg",
  },
  {
    title: "Custom Event & Wedding Booth",
    tag: "Event Session",
    desc: "Cocok untuk berbagai acara seperti wedding, corporate gathering, ulang tahun, hingga pameran dengan operator handal dan ramah.",
    image: "/images/photobooth/gathering.jpg",
  },
];

export const PHOTOBOOTH_PACKAGES: PhotoboothPackage[] = [
  {
    categoryName: "PHOTOBOOTH PACKAGES",
    tagline: "Pilihan Durasi & Fitur AI Booth",
    popular: true,
    desc: "Layanan photobooth fleksibel (Konvensional atau AI Booth) lengkap dengan cetak high-speed, voucher, dan crew profesional.",
    tiers: [
      {
        id: "booth-silver",
        name: "Silver 2 Jam",
        price: "1.250K",
        features: [
          "Durasi Layanan 2 Jam Print High-Speed",
          "Touchscreen Display & Kamera Profesional",
          "Template Layout Custom (Nama Event)",
          "Tersedia 50 Voucher Photobooth",
          "1 Crew / Operator Photobooth",
        ],
      },
      {
        id: "booth-gold-3h",
        name: "Gold 3 Jam",
        price: "2.000K",
        features: [
          "Durasi Layanan 3 Jam Print High-Speed",
          "Tersedia 100 Voucher Photobooth",
          "Integrasi Fitur AI (AI Style / Digital Filter)",
          "Custom Backdrop / Frame Roll-up",
          "Live QR Code Download Instan",
          "2 Crew Operator & Technician",
        ],
      },
      {
        id: "booth-gold-4h",
        name: "Gold 4 Jam",
        price: "3.200K",
        features: [
          "Layanan 4 Jam Print High-Speed",
          "Tersedia 200 Voucher Photobooth",
          "Integrasi Fitur AI (AI Style / Digital Filter)",
          "Custom Backdrop / Frame Roll-up",
          "Live QR Code Download Instan",
          "3 Crew Operator & Technician",
        ],
      },
    ],
  },
];

export const PHOTOBOOTH_ALBUM = [
  { id: 1, image: "/images/photoboothtestimoni/01.jpg", alt: "Testimoni Photobooth 1" },
  { id: 2, image: "/images/photoboothtestimoni/02.jpg", alt: "Testimoni Photobooth 2" },
  { id: 3, image: "/images/photoboothtestimoni/03.jpg", alt: "Testimoni Photobooth 3" },
  { id: 4, image: "/images/photoboothtestimoni/04.jpg", alt: "Testimoni Photobooth 4" },
  { id: 5, image: "/images/photoboothtestimoni/05.jpg", alt: "Testimoni Photobooth 5" },
  { id: 6, image: "/images/photoboothtestimoni/06.jpg", alt: "Testimoni Photobooth 6" },
  { id: 7, image: "/images/photoboothtestimoni/07.jpg", alt: "Testimoni Photobooth 7" },
  { id: 8, image: "/images/photoboothtestimoni/08.jpg", alt: "Testimoni Photobooth 8" },
];