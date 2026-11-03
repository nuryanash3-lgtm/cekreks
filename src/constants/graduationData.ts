export interface SubPlan {
  id: string;
  name: string;
  price: string;
  features: string[];
}

export interface GraduationPackage {
  categoryName: string;
  tagline: string;
  popular?: boolean;
  desc: string;
  tiers: SubPlan[];
}

export interface GraduationScopeItem {
  title: string;
  tag: string;
  desc: string;
  image: string;
}

export const GRADUATION_SERVICES_SCOPE: GraduationScopeItem[] = [
  {
    title: "Foto Personal & Toga",
    tag: "Individual",
    desc: "Sesi potret personal wisudawan dengan toga lengkap, pose elegan, dan arahan gaya terarah untuk portofolio kelulusan terbaik.",
    image: "/images/graduationtestimoni/personalfamily.png",
  },
  {
    title: "Momen Bersama",
    tag: "Family Portrait",
    desc: "Merekam kebanggaan dan pelukan hangat orang tua serta keluarga tercinta yang telah menemani perjuangan studi hingga wisuda.",
    image: "/images/graduationtestimoni/pesertagraduation.jpg",
  },
  {
    title: "Pembuatan Buku Tahunan",
    tag: "Besties & Squad",
    desc: "Satu buku, ribuan cerita. Abadikan momen epik, kekompakan squad, dan vibes terbaik masa sekolahmu dalam konsep visual yang super keren.",
    image: "/images/graduationtestimoni/yearbook.jpg",
  },
];

export const GRADUATION_PACKAGES: GraduationPackage[] = [
  {
    categoryName: "BASIC GRADUATION",
    tagline: "Cocok untuk foto personal & santai",
    popular: false,
    desc: "Sesi foto wisuda praktis dengan hasil instan resolusi tinggi untuk kebutuhan feed dan kartu kenangan.",
    tiers: [
      {
        id: "grad-basic-1",
        name: "Basic 1 (Solo)",
        price: "500k",
        features: [
          "Durasi sesi 45 Menit",
          "1 Fotografer Profesional",
          "Maksimal 2 Orang (Wisudawan + 1 Pendamping)",
          "Semua File Mentah (Google Drive)",
          "15 Foto Edited & Color Grading",
        ],
      },
      {
        id: "grad-basic-2",
        name: "Basic 2 (Duo/Couple)",
        price: "750k",
        features: [
          "Durasi sesi 60 Menit",
          "1 Fotografer Profesional",
          "Maksimal 4 Orang",
          "Semua File Mentah Resolusi Tinggi",
          "25 Foto Edited & Color Grading",
          "1 Cetak Foto 10R + Minimalist Frame",
        ],
      },
    ],
  },
  {
    categoryName: "PREMIUM GRADUATION",
    tagline: "Paket favorit wisudawan & keluarga",
    popular: true,
    desc: "Dokumentasi komprehensif bersama keluarga besar dan sahabat dengan durasi lebih lega dan cetakan premium.",
    tiers: [
      {
        id: "grad-prem-1",
        name: "Premium Silver",
        price: "1.200k",
        features: [
          "Durasi sesi 90 Menit",
          "1 Fotografer + 1 Assistant Lighting",
          "Maksimal 8 Orang Keluarga/Sahabat",
          "Unlimited Foto Files High-Resolution",
          "45+ Foto Edited Eksklusif",
          "1 Cetak Frame 12R Eksklusif",
        ],
      },
      {
        id: "grad-prem-2",
        name: "Premium Gold",
        price: "1.650k",
        features: [
          "Durasi sesi 120 Menit (2 Jam)",
          "1 Fotografer + 1 Videografer Reels",
          "Bebas Jumlah Orang (Keluarga & Sahabat)",
          "Unlimited Master File Foto & Video",
          "70+ Foto Edited Eksklusif",
          "1 Video Cinematic Reels 60 Detik",
          "2 Cetak Frame Minimalis 12R",
        ],
      },
    ],
  },
  {
    categoryName: "EXCLUSIVE GRADUATION",
    tagline: "Sesi seharian komplit + cinematic film",
    popular: false,
    desc: "Layanan dokumentasi VIP mulai dari persiapan kebaya/toga, seremonial gedung, hingga sesi foto keluarga besar.",
    tiers: [
      {
        id: "grad-exc-1",
        name: "Exclusive Squad",
        price: "2.500k",
        features: [
          "Half Day Coverage (4 Jam)",
          "2 Fotografer + 1 Videografer",
          "Bisa Gabungan 3–5 Wisudawan Sekaligus",
          "Semua Master Files + Edited Photos",
          "Video Cinematic Highlight 2–3 Menit",
          "Photobook Album Kenangan Wisuda",
        ],
      },
      {
        id: "grad-exc-2",
        name: "Exclusive VIP",
        price: "3.800k",
        features: [
          "Full Day Coverage (Persiapan hingga Acara Usai)",
          "Tim Lengkap: 2 Foto + 1 Video Cinematic",
          "Same Day Teaser Video untuk Instagram/TikTok",
          "VIP Priority Edit (Selesai dalam 3 Hari)",
          "Exclusive Hardcover Photobook Album",
          "Flashdisk Wooden Box + 2 Frame Kanvas Jumbo",
        ],
      },
    ],
  },
];

export const GRADUATION_ALBUM = [
  { id: 1, image: "/images/graduationtestimoni/01.png", alt: "Testimoni Graduation 1" },
  { id: 2, image: "/images/graduationtestimoni/02.png", alt: "Testimoni Graduation 2" },
  { id: 3, image: "/images/graduationtestimoni/03.png", alt: "Testimoni Graduation 3" },
  { id: 4, image: "/images/graduationtestimoni/04.png", alt: "Testimoni Graduation 4" },
  { id: 5, image: "/images/graduationtestimoni/05.jpg", alt: "Testimoni Graduation 5" },
  { id: 6, image: "/images/graduationtestimoni/06.png", alt: "Testimoni Graduation 6" },
  { id: 7, image: "/images/graduationtestimoni/07.png", alt: "Testimoni Graduation 7" },
  { id: 8, image: "/images/graduationtestimoni/08.png", alt: "Testimoni Graduation 8" },
  { id: 9, image: "/images/graduationtestimoni/09.png", alt: "Testimoni Graduation 9" },
  { id: 10, image: "/images/graduationtestimoni/10.jpg", alt: "Testimoni Graduation 10" },
  { id: 11, image: "/images/graduationtestimoni/11.png", alt: "Testimoni Graduation 11" },
  { id: 12, image: "/images/graduationtestimoni/12.png", alt: "Testimoni Graduation 12" },
  { id: 13, image: "/images/graduationtestimoni/13.png", alt: "Testimoni Graduation 13" },
  { id: 14, image: "/images/graduationtestimoni/14.png", alt: "Testimoni Graduation 14" },
  { id: 15, image: "/images/graduationtestimoni/15.png", alt: "Testimoni Graduation 15" },
  { id: 16, image: "/images/graduationtestimoni/16.jpg", alt: "Testimoni Graduation 16" },
];