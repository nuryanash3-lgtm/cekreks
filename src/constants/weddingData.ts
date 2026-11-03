export interface SubPlan {
  id: string;
  name: string;
  price: string;
  features: string[];
}

export interface WeddingPackage {
  categoryName: string;
  tagline: string;
  popular?: boolean;
  desc: string;
  tiers: SubPlan[];
}

export interface WeddingScopeItem {
  title: string;
  tag: string;
  desc: string;
  image: string;
}

export const WEDDING_SERVICES_SCOPE: WeddingScopeItem[] = [
  {
    title: "Foto Prewedding",
    tag: "Pre-Event",
    desc: "Langkah awal menuju perjalanan kebahagiaan bersama. Paket ini disiapkan untuk keperluan foto galeri di kartu undangan serta pigura dekorasi masuk gedung resepsi pernikahan.",
    image: "/images/weddingtestimoni/prewed2.jpg",
  },
  {
    title: "Pengajian & Siraman",
    tag: "Tradisi & Doa",
    desc: "Langkah sakral bermakna sebelum menuju hari pelaminan. Memohon ridho & restu kedua orang tua serta membersihkan diri sebelum ikrar suci pernikahan dilangsungkan.",
    image: "/images/weddingtestimoni/siraman.jpg",
  },
  {
    title: "Akad Nikah & Resepsi",
    tag: "Wedding Day",
    desc: "Janji suci akad nikah, upacara adat, hingga momen resepsi bahagia bersama tamu tercinta. Diabadikan sempurna agar emosi dan senyuman abadi selamanya.",
    image: "/images/weddingtestimoni/akadnikah.png",
  },
];

export const WEDDING_PACKAGES: WeddingPackage[] = [
  {
    categoryName: "BASIC WEDDING",
    tagline: "Cocok untuk intimate wedding & sakral",
    popular: false,
    desc: "Foto & Video dokumentasi acara Akad Nikah & Resepsi Pernikahan dengan File foto digital resolusi tinggi.",
    tiers: [
      {
        id: "akad-nikah",
        name: "Akad Nikah",
        price: "1.200k",
        features: [
          "1 Album 35 x 35 cm. 10 Sheets",
          "1 Pembesaran 10R + Lam + Frame",
          "1 Fotografer",
          "Durasi kerja selama 6 jam",
          "Softcopy dikirim dalam Drive",
        ],
      },
      {
        id: "basic-1",
        name: "Basic 1",
        price: "2.000k",
        features: [
          "1 Album 35 x 35 cm. 15 Sheets",
          "1 Pembesaran 12R + Lam + Frame",
          "2 Fotografer",
          "Durasi kerja selama 8 jam",
          "Softcopy dikirim dalam Drive",
        ],
      },
      {
        id: "basic-2",
        name: "Basic 2",
        price: "3.500k",
        features: [
          "1 Album Magazine Kolase Digital",
          "1 Pembesaran 16R + Lam + Frame",
          "2 Fotografer",
          "Softcopy dikirim dalam Drive",
          "Video Highlight 3 - 5 Menit",
        ],
      },
    ],
  },
  {
    categoryName: "PREMIUM WEDDING",
    tagline: "Layanan menyeluruh prosesi sakral",
    popular: true,
    desc: "Layanan foto & video lengkap dengan tim profesional mulai dari Siraman, Pengajian, Akad Nikah, hingga Resepsi.",
    tiers: [
      {
        id: "prem-1",
        name: "Silver",
        price: "4.500k",
        features: [
          "1 Album Magnetik + 1 Album Megazine",
          "1 Buah Pembesaran 16R",
          "3 Fotografer",
          "Softcopy dikirim dalam Drive",
          "Highlight + Full Video Editing",
        ],
      },
      {
        id: "prem-2",
        name: "Gold",
        price: "6.500k",
        features: [
          "2 Album Magazine Kulit + Eklusive Box",
          "1 Buah Pembesaran 20R",
          "3 Fotografer",
          "Softcopy dikirim dalam Drive",
          "Highlight + Full Video Editing",
        ],
      },
      {
        id: "prem-3",
        name: "Platinum",
        price: "8.000k",
        features: [
          "2 Album Magazine Kulit + Eklusive Box",
          "2 Buah Pembesaran 20R",
          "4 Fotografer + Kamera Drone",
          "Softcopy dikirim dalam Drive",
          "Highlight + Full Video Editing",
        ],
      },
    ],
  },
];

export const WEDDING_ALBUM = [
  { id: 1, image: "/images/weddingtestimoni/01.jpg", alt: "Testimoni Wedding 1" },
  { id: 2, image: "/images/weddingtestimoni/02.jpg", alt: "Testimoni Wedding 2" },
  { id: 3, image: "/images/weddingtestimoni/03.jpg", alt: "Testimoni Wedding 3" },
  { id: 4, image: "/images/weddingtestimoni/08.jpg", alt: "Testimoni Wedding 4" },
  { id: 5, image: "/images/weddingtestimoni/09.jpg", alt: "Testimoni Wedding 5" },
  { id: 6, image: "/images/weddingtestimoni/12.jpg", alt: "Testimoni Wedding 6" },
  { id: 7, image: "/images/weddingtestimoni/20.jpg", alt: "Testimoni Wedding 7" },
  { id: 8, image: "/images/weddingtestimoni/21.jpg", alt: "Testimoni Wedding 8" },
  { id: 9, image: "/images/weddingtestimoni/23.jpg", alt: "Testimoni Wedding 9" },
  { id: 10, image: "/images/weddingtestimoni/38.jpg", alt: "Testimoni Wedding 10" },
  { id: 11, image: "/images/weddingtestimoni/39.jpg", alt: "Testimoni Wedding 11" },
  { id: 12, image: "/images/weddingtestimoni/40.jpg", alt: "Testimoni Wedding 12" },
];