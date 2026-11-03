export interface SubPlan {
  id: string;
  name: string;
  price: string;
  features: string[];
}

export interface EventPackage {
  categoryName: string;
  tagline: string;
  popular?: boolean;
  desc: string;
  tiers: SubPlan[];
}

export interface EventScopeItem {
  title: string;
  tag: string;
  desc: string;
  image: string;
}

export const EVENTS_SERVICES_SCOPE: EventScopeItem[] = [
  {
    title: "Corporate Gathering & Meeting",
    tag: "Corporate",
    desc: "Mendokumentasikan keseruan acara perusahaan, rapat tahunan, gala dinner, hingga peluncuran produk dengan standar profesional.",
    image: "/images/events/corporate.jpg",
  },
  {
    title: "Seminar, Workshop & Webinar",
    tag: "Educational",
    desc: "Mengabadikan momen edukatif, pembicara, interaksi peserta, serta suasana jalannya acara seminar atau workshop secara detail.",
    image: "/images/events/seminar.jpg",
  },
  {
    title: "Ulang Tahun & Perayaan Spesial",
    tag: "Celebration",
    desc: "Merayakan hari istimewa seperti ulang tahun, anniversary, atau pesta keluarga dengan hasil foto dan video yang meriah dan penuh warna.",
    image: "/images/events/birthday.jpg",
  },
];

export const EVENTS_PACKAGES: EventPackage[] = [
  {
    categoryName: "EVENT & SEMINAR COVERAGE",
    tagline: "Khusus Dokumentasi Fotografi Profesional",
    popular: false,
    desc: "Layanan murni fotografi untuk meliput jalannya event, seminar, workshop, maupun kegiatan instansi dengan hasil jernih dan tajam.",
    tiers: [
      {
        id: "event-half",
        name: "Half-Day",
        price: "750K",
        features: [
          "1 Fotografer Profesional",
          "Unlimited Shots",
          "All Files Edited Color Grading",
          "Online Storage / Drive Transfer",
          "1 Album Magnetik",
        ],
      },
      {
        id: "event-fullday",
        name: "Full-Day",
        price: "1.000K",
        features: [
          "1 Fotografer Profesional",
          "Unlimited Shots",
          "All Files Edited Color Grading",
          "Online Storage / Drive Transfer",
          "1 Album Magnetik",
        ],
      },
    ],
  },
  {
    categoryName: "FOTO & VIDEO PACKAGE",
    tagline: "Solusi lengkap dokumentasi visual sinematik",
    popular: true,
    desc: "Paket komprehensif memadukan keahlian fotografer dan videografer profesional untuk mengabadikan keseluruhan acara Anda secara megah.",
    tiers: [
      {
        id: "photo-video-1day",
        name: "1 Day Package",
        price: "2.500K",
        features: [
          "Fotografer & Videografer Profesional",
          "Album Magnetik / Kolase Eksklusif",
          "Video Cinematic Highlight durasi 45 Menit",
          "All Master Softcopy File (Via Google Drive / QR Code)",
        ],
      },
    ],
  },
];

export const EVENTS_ALBUM = [
  { id: 1, image: "/images/eventstestimoni/01.jpg", alt: "Testimoni Event 1" },
  { id: 2, image: "/images/eventstestimoni/02.jpg", alt: "Testimoni Event 2" },
  { id: 3, image: "/images/eventstestimoni/03.jpg", alt: "Testimoni Event 3" },
  { id: 4, image: "/images/eventstestimoni/04.jpg", alt: "Testimoni Event 4" },
  { id: 5, image: "/images/eventstestimoni/05.jpg", alt: "Testimoni Event 5" },
  { id: 6, image: "/images/eventstestimoni/06.jpg", alt: "Testimoni Event 6" },
  { id: 7, image: "/images/eventstestimoni/07.jpg", alt: "Testimoni Event 7" },
  { id: 8, image: "/images/eventstestimoni/08.jpg", alt: "Testimoni Event 8" },
  { id: 9, image: "/images/eventstestimoni/09.jpg", alt: "Testimoni Event 9" },
  { id: 10, image: "/images/eventstestimoni/10.jpg", alt: "Testimoni Event 10" },
  { id: 11, image: "/images/eventstestimoni/11.jpg", alt: "Testimoni Event 11" },
  { id: 12, image: "/images/eventstestimoni/12.jpg", alt: "Testimoni Event 12" },
];