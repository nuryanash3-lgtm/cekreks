'use client';

import React, { useState, useRef, useEffect } from 'react';

interface ConceptItem {
  id: number;
  title: string;
  type: string;
  image: string;
  prompt: string;
  modelOverride: string;
}

interface TemplateItem {
  title: string;
  tag: string;
  image: string;
}

type AddConceptMethod =
  | 'CREATE YOUR OWN CONCEPT'
  | 'CREATE BY AI IMAGE'
  | 'SELECT BY TEMPLATE';

// Data awal konsep
const initialConcepts: ConceptItem[] = [
  {
    id: 1,
    title: 'SCHOOL PHOTOBOOK',
    type: 'TEMPLATE CONCEPT',
    image:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
    prompt: '',
    modelOverride: 'default',
  },
  {
    id: 2,
    title: 'PAPPER TOM & JERRY',
    type: 'TEMPLATE CONCEPT',
    image:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=600&auto=format&fit=crop',
    prompt: '',
    modelOverride: 'default',
  },
  {
    id: 3,
    title: 'FRAME ART',
    type: 'TEMPLATE CONCEPT',
    image:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=600&auto=format&fit=crop',
    prompt: '',
    modelOverride: 'default',
  },
  {
    id: 4,
    title: 'PAINT BRUSH',
    type: 'TEMPLATE CONCEPT',
    image:
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=600&auto=format&fit=crop',
    prompt: '',
    modelOverride: 'default',
  },
  {
    id: 5,
    title: 'DARK NEON STREET ANIME...',
    type: 'TEMPLATE CONCEPT',
    image:
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=600&auto=format&fit=crop',
    prompt: '',
    modelOverride: 'default',
  },
  {
    id: 6,
    title: 'PHOTO BOX CEWE',
    type: 'CUSTOM CONCEPT',
    image:
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=600&auto=format&fit=crop',
    prompt: '',
    modelOverride: 'default',
  },
  {
    id: 7,
    title: 'DECORATIVE FRAME - R',
    type: 'CUSTOM CONCEPT',
    image:
      'https://images.unsplash.com/photo-1609220136736-443140cffec6?q=80&w=600&auto=format&fit=crop',
    prompt: '',
    modelOverride: 'default',
  },
  {
    id: 8,
    title: 'STUDIO MINIMALIS',
    type: 'CUSTOM CONCEPT',
    image:
      'https://images.unsplash.com/photo-1581579438747-1dc8d1e27294?q=80&w=600&auto=format&fit=crop',
    prompt: '',
    modelOverride: 'default',
  },
  {
    id: 9,
    title: 'BATIK ART CONCEPT',
    type: 'CUSTOM CONCEPT',
    image:
      'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?q=80&w=600&auto=format&fit=crop',
    prompt: '',
    modelOverride: 'default',
  },
];

// Data Template Global & Saved
const globalTemplates: TemplateItem[] = [
  {
    title: 'BATIC ART CON...',
    tag: '3D RENDER (RECOMM...',
    image:
      'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?q=80&w=600&auto=format&fit=crop',
  },
  {
    title: 'STUDIO MINIMALI...',
    tag: '3D RENDER (RECOMM...',
    image:
      'https://images.unsplash.com/photo-1581579438747-1dc8d1e27294?q=80&w=600&auto=format&fit=crop',
  },
  {
    title: 'NEW STUDIO RE...',
    tag: '3D RENDER (RECOMM...',
    image:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=600&auto=format&fit=crop',
  },
  {
    title: 'DECORATIVE FR...',
    tag: '3D RENDER (RECOMM...',
    image:
      'https://images.unsplash.com/photo-1609220136736-443140cffec6?q=80&w=600&auto=format&fit=crop',
  },
  {
    title: 'PHOTO BOX CE...',
    tag: '3D RENDER (RECOMM...',
    image:
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=600&auto=format&fit=crop',
  },
  {
    title: 'PHOTO BOX CO...',
    tag: '3D RENDER (RECOMM...',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop',
  },
  {
    title: 'PHOTOBOX CEW...',
    tag: '3D RENDER (RECOMM...',
    image:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
  },
];

const savedTemplates: TemplateItem[] = [
  {
    title: 'SCHOOL PHOTOBOOK',
    tag: 'CUSTOM SAVED',
    image:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
  },
  {
    title: 'PAPPER TOM & JERRY',
    tag: 'CUSTOM SAVED',
    image:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=600&auto=format&fit=crop',
  },
];

export default function ConceptsSettingsPage() {
  // State Utama
  const [concepts, setConcepts] = useState<ConceptItem[]>(initialConcepts);
  const [activeNavTab, setActiveNavTab] = useState<string>('CONCEPTS');

  // State Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  // State Template Modal
  const [templateTab, setTemplateTab] = useState<'global' | 'saved'>('global');

  // State Edit / Create Modal
  const [editingConceptId, setEditingConceptId] = useState<number | null>(null);
  const [conceptName, setConceptName] = useState<string>('NEW CONCEPT');
  const [thumbnailImg, setThumbnailImg] = useState<string>(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop'
  );
  const [refImg, setRefImg] = useState<string | null>(null);
  const [promptText, setPromptText] = useState<string>('');
  const [modelOverride, setModelOverride] = useState<string>('default');

  // State Toast Notification
  const [toastMessage, setToastMessage] = useState<string>('');
  const [isToastVisible, setIsToastVisible] = useState<boolean>(false);

  // Refs untuk Input File & Timer
  const thumbnailInputRef = useRef<HTMLInputElement | null>(null);
  const refInputRef = useRef<HTMLInputElement | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  // Fungsi Toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setIsToastVisible(true);
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = setTimeout(() => {
      setIsToastVisible(false);
    }, 3000);
  };

  // Fungsi Hapus Konsep
  const handleDeleteConcept = (id: number, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setConcepts((prev) => prev.filter((item) => item.id !== id));
    showToast('Konsep telah dihapus.');
  };

  // Buka Modal Edit
  const handleOpenEditModal = (concept: ConceptItem | null = null) => {
    if (concept) {
      setEditingConceptId(concept.id);
      setConceptName(concept.title);
      setThumbnailImg(concept.image);
      setPromptText(concept.prompt || '');
      setModelOverride(concept.modelOverride || 'default');
      setRefImg(null);
    } else {
      setEditingConceptId(null);
      setConceptName('NEW CONCEPT');
      setThumbnailImg(
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop'
      );
      setPromptText('');
      setModelOverride('default');
      setRefImg(null);
    }
    setIsAddModalOpen(false);
    setIsEditModalOpen(true);
  };

  // Handler Upload Gambar Thumbnail
  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          setThumbnailImg(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  // Handler Upload Gambar Referensi
  const handleRefUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          setRefImg(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  // Optimasi Prompt AI
  const handleOptimizePrompt = () => {
    setPromptText(
      'Cinematic lighting, hyper-realistic 8k photo, ultra detailed aesthetic background, studio professional portrait, vibrant color tones.'
    );
    showToast('Prompt optimized with Coro AI!');
  };

  // Simpan Konsep Baru / Hasil Edit
  const handleSaveEditedConcept = () => {
    const finalName = conceptName.trim() || 'NEW CONCEPT';
    if (editingConceptId !== null) {
      setConcepts((prev) =>
        prev.map((item) =>
          item.id === editingConceptId
            ? {
                ...item,
                title: finalName,
                image: thumbnailImg,
                prompt: promptText,
                modelOverride,
              }
            : item
        )
      );
    } else {
      const newConcept: ConceptItem = {
        id: Date.now(),
        title: finalName,
        type: 'CUSTOM CONCEPT',
        image: thumbnailImg,
        prompt: promptText,
        modelOverride,
      };
      setConcepts((prev) => [...prev, newConcept]);
    }
    setIsEditModalOpen(false);
    setEditingConceptId(null);
    showToast(`Konsep "${finalName}" berhasil disimpan!`);
  };

  // Pilih Opsi di Add Concept Modal
  const handleSelectAddOption = (type: AddConceptMethod) => {
    setIsAddModalOpen(false);
    if (type === 'CREATE YOUR OWN CONCEPT') {
      handleOpenEditModal(null);
    } else if (type === 'CREATE BY AI IMAGE') {
      const newConcept: ConceptItem = {
        id: Date.now(),
        title: 'AI CONCEPT ' + Math.floor(Math.random() * 100),
        type: 'AI CONCEPT',
        image:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
        prompt: 'Generated by Coro AI',
        modelOverride: 'default',
      };
      setConcepts((prev) => [...prev, newConcept]);
      showToast(`Metode dipilih: ${type}`);
    } else if (type === 'SELECT BY TEMPLATE') {
      setTemplateTab('global');
      setIsTemplateModalOpen(true);
    }
  };

  // Muat Template ke Grid Utama
  const handleLoadTemplate = (tpl: TemplateItem) => {
    setIsTemplateModalOpen(false);
    const newConcept: ConceptItem = {
      id: Date.now(),
      title: tpl.title.replace('...', ''),
      type: 'TEMPLATE CONCEPT',
      image: tpl.image,
      prompt: '',
      modelOverride: 'default',
    };
    setConcepts((prev) => [...prev, newConcept]);
    showToast(`Template "${tpl.title}" berhasil dimuat!`);
  };

  const currentTemplatesList = templateTab === 'global' ? globalTemplates : savedTemplates;

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#070312] text-gray-200 font-sans relative overflow-x-hidden">
      {/* Custom Styles untuk Font Orbitron & Background Hexagon */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Orbitron:wght@600;800;900&display=swap');
        
        .font-orbitron {
          font-family: 'Orbitron', sans-serif;
        }
        .bg-hexagon-pattern {
          background-color: #070312;
          background-image: 
            radial-gradient(circle at 50% 50%, rgba(18, 19, 26, 0.8) 0%, rgba(7, 8, 11, 0.95) 100%),
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='98' viewBox='0 0 56 98'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='hexagon' fill='%23202327' fill-opacity='0.25' fill-rule='nonzero'%3E%3Cpath d='M28 66L0 50L0 18L28 2L56 18L56 50L28 66ZM28 63L53 48.5L53 20.5L28 6L3 20.5L3 48.5L28 63Z'/%3E%3Cpath d='M28 98L0 82L0 50L28 34L56 50L56 82L28 98ZM28 95L53 80.5L53 52.5L28 38L3 52.5L3 80.5L28 95Z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
          background-attachment: fixed;
        }
        .btn-neon-purple {
          background: linear-gradient(135deg, #a855f7 0%, #d946ef 100%);
          box-shadow: 0 0 15px rgba(217, 70, 239, 0.4);
          transition: all 0.3s ease;
        }
        .btn-neon-purple:hover {
          box-shadow: 0 0 25px rgba(217, 70, 239, 0.7);
          transform: translateY(-1px);
        }
      `}</style>

      {/* MAIN CONTENT CONTAINER */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {concepts.map((concept) => (
            <div
              key={concept.id}
              onClick={() => handleOpenEditModal(concept)}
              className="relative rounded-xl overflow-hidden flex flex-col h-[320px] bg-[#12141c] border border-white/10 hover:border-fuchsia-500/50 hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.6),0_0_15px_rgba(168,85,247,0.2)] group select-none cursor-pointer"
            >
              {/* Background Image */}
              <div className="absolute inset-0 z-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={concept.image}
                  alt={concept.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.src = `https://placehold.co/400x600/1e2029/ffffff?text=${encodeURIComponent(
                      concept.title
                    )}`;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/40" />
              </div>

              {/* Top Action Icons */}
              <div className="relative z-10 flex justify-between items-center p-3">
                <button
                  type="button"
                  onClick={(e) => e.stopPropagation()}
                  title="Drag to reorder"
                  className="w-8 h-8 rounded-md bg-black/50 backdrop-blur-md flex items-center justify-center text-gray-300 hover:text-white hover:bg-black/80 transition cursor-grab active:cursor-grabbing"
                >
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={(e) => handleDeleteConcept(concept.id, e)}
                  title="Delete Concept"
                  className="w-8 h-8 rounded-md bg-black/50 backdrop-blur-md flex items-center justify-center text-gray-300 hover:text-red-400 hover:bg-black/80 transition"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>

              {/* Bottom Info Label */}
              <div className="relative z-10 mt-auto p-4 flex flex-col">
                <h4 className="font-bold text-white text-sm tracking-wide uppercase line-clamp-1 font-orbitron">
                  {concept.title}
                </h4>
                <span className="text-[10px] tracking-wider text-gray-400 font-semibold uppercase mt-0.5">
                  {concept.type}
                </span>
              </div>
            </div>
          ))}

          {/* ADD CONCEPT CARD */}
          <div
            onClick={() => setIsAddModalOpen(true)}
            className="border-2 border-dashed border-zinc-800 hover:border-purple-500/60 rounded-xl h-[320px] flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all duration-300 bg-zinc-950/40 hover:bg-purple-950/10 group"
          >
            <div className="w-12 h-12 rounded-full bg-zinc-900 group-hover:bg-purple-600/20 text-gray-400 group-hover:text-purple-400 flex items-center justify-center mb-3 transition">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <span className="font-bold text-sm tracking-wider text-white font-orbitron group-hover:text-purple-300 transition">
              ADD CONCEPT
            </span>
            <span className="text-[11px] text-gray-500 mt-1">Choose method</span>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 py-4 text-center text-xs text-gray-500 border-t border-gray-900/60">
        &copy; 2026 Concepts Setting System • Created for AI Photo &amp; Interactive Booth Management
      </footer>

      {/* MODAL 1: ADD CONCEPT SELECTION */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121319] border border-purple-500/30 rounded-2xl w-full max-w-md p-6 shadow-[0_0_50px_rgba(168,85,247,0.15)] relative">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-fuchsia-500 shadow-[0_0_8px_#d946ef]" />
                <h3 className="text-base font-bold text-white font-orbitron tracking-wider">
                  ADD CONCEPT
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="w-7 h-7 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-gray-400 hover:text-white flex items-center justify-center transition"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5">
              {/* Option 1 */}
              <button
                type="button"
                onClick={() => handleSelectAddOption('CREATE YOUR OWN CONCEPT')}
                className="w-full text-left bg-[#181a24] hover:bg-[#202330] border border-zinc-800 hover:border-purple-500/50 rounded-xl p-4 transition group flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-lg bg-zinc-900/80 border border-zinc-700/60 flex items-center justify-center text-gray-300 group-hover:text-purple-400 group-hover:border-purple-500/40 transition shrink-0">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white font-orbitron tracking-wider group-hover:text-purple-300 transition">
                    CREATE YOUR OWN CONCEPT
                  </h4>
                  <p className="text-[11px] text-gray-400 mt-1 leading-snug">
                    Start from scratch with your own prompt, style, and optional reference images.
                  </p>
                </div>
              </button>

              {/* Option 2 */}
              <button
                type="button"
                onClick={() => handleSelectAddOption('CREATE BY AI IMAGE')}
                className="w-full text-left bg-[#181a24] hover:bg-[#202330] border border-zinc-800 hover:border-purple-500/50 rounded-xl p-4 transition group flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-lg bg-zinc-900/80 border border-zinc-700/60 flex items-center justify-center text-gray-300 group-hover:text-purple-400 group-hover:border-purple-500/40 transition shrink-0">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white font-orbitron tracking-wider group-hover:text-purple-300 transition">
                    CREATE BY AI IMAGE
                  </h4>
                  <p className="text-[11px] text-gray-400 mt-1 leading-snug">
                    Upload a reference, and let Coro AI write the perfect prompt for you.
                  </p>
                </div>
              </button>

              {/* Option 3 */}
              <button
                type="button"
                onClick={() => handleSelectAddOption('SELECT BY TEMPLATE')}
                className="w-full text-left bg-[#181a24] hover:bg-[#202330] border border-zinc-800 hover:border-purple-500/50 rounded-xl p-4 transition group flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-lg bg-zinc-900/80 border border-zinc-700/60 flex items-center justify-center text-gray-300 group-hover:text-purple-400 group-hover:border-purple-500/40 transition shrink-0">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white font-orbitron tracking-wider group-hover:text-purple-300 transition">
                    SELECT BY TEMPLATE
                  </h4>
                  <p className="text-[11px] text-gray-400 mt-1 leading-snug">
                    Load ready-to-use concepts from the global or your personal gallery.
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT CONCEPT */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#121319] border border-purple-500/30 rounded-2xl w-full max-w-xl p-6 shadow-[0_0_50px_rgba(168,85,247,0.15)] relative max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-fuchsia-500 shadow-[0_0_8px_#d946ef]" />
                <h3 className="text-base font-bold text-white font-orbitron tracking-wider">
                  EDIT CONCEPT
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-gray-400 hover:text-white flex items-center justify-center transition"
              >
                ✕
              </button>
            </div>

            <div className="space-y-5 text-left">
              {/* CONCEPT NAME */}
              <div>
                <label className="block text-[10px] font-bold text-fuchsia-400 font-orbitron tracking-wider uppercase mb-2">
                  CONCEPT NAME
                </label>
                <input
                  type="text"
                  value={conceptName}
                  onChange={(e) => setConceptName(e.target.value)}
                  className="w-full bg-[#181a24] border border-zinc-800 rounded-xl px-4 py-3 text-sm font-orbitron tracking-wider text-white focus:outline-none focus:border-purple-500 transition"
                />
              </div>

              {/* THUMBNAIL & REFERENCES */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="sm:col-span-4">
                  <label className="block text-[10px] font-bold text-fuchsia-400 font-orbitron tracking-wider uppercase mb-2">
                    THUMBNAIL
                  </label>
                  <div
                    onClick={() => thumbnailInputRef.current?.click()}
                    className="w-full h-36 rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden relative group cursor-pointer"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={thumbnailImg}
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-xs font-orbitron text-white">
                      CHANGE
                    </div>
                  </div>
                  <input
                    type="file"
                    ref={thumbnailInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={handleThumbnailUpload}
                  />
                </div>

                <div className="sm:col-span-8">
                  <label className="block text-[10px] font-bold text-fuchsia-400 font-orbitron tracking-wider uppercase mb-1">
                    REFERENCES (OPTIONAL)
                  </label>
                  <p className="text-[10px] text-gray-400 mb-2 leading-tight">
                    You can upload clothes, backgrounds, products, etc., and say what you want to
                    create, then click optimize.
                  </p>

                  <div className="flex items-center gap-2">
                    <div
                      onClick={() => refInputRef.current?.click()}
                      className="w-20 h-24 rounded-xl border border-zinc-800 bg-[#181a24] flex flex-col items-center justify-center cursor-pointer hover:border-purple-500/50 transition relative overflow-hidden group"
                    >
                      <span className="text-[8px] font-bold text-gray-500 font-orbitron absolute top-1 left-2 z-10">
                        REF 1
                      </span>
                      {refImg ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={refImg}
                          alt="Reference"
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-[9px] font-bold text-gray-400 font-orbitron">
                          UPLOAD
                        </span>
                      )}
                    </div>
                    <input
                      type="file"
                      ref={refInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={handleRefUpload}
                    />

                    <button
                      type="button"
                      onClick={() => refInputRef.current?.click()}
                      className="w-20 h-24 rounded-xl border border-dashed border-zinc-800 hover:border-purple-500/50 bg-[#181a24]/50 flex items-center justify-center text-gray-400 hover:text-white transition"
                    >
                      <span className="text-xl">+</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* PROMPT INSTRUCTIONS */}
              <div>
                <label className="block text-[10px] font-bold text-fuchsia-400 font-orbitron tracking-wider uppercase mb-2">
                  PROMPT INSTRUCTIONS
                </label>
                <textarea
                  rows={3}
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  className="w-full bg-[#181a24] border border-zinc-800 rounded-xl p-3 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-purple-500 transition resize-none"
                  placeholder="Describe the aesthetic, background, mood, lighting..."
                />

                <div className="flex items-center justify-between mt-2 gap-2 flex-wrap">
                  <button
                    type="button"
                    className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-gray-300 text-[10px] font-bold px-3 py-1.5 rounded-lg font-orbitron flex items-center gap-1.5 transition"
                  >
                    EDIT THIS PROMPT CONCEPT
                  </button>
                  <button
                    type="button"
                    onClick={handleOptimizePrompt}
                    className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-gray-300 hover:text-white text-[10px] font-bold px-3 py-1.5 rounded-lg font-orbitron flex items-center gap-1.5 transition"
                  >
                    <span className="text-purple-400">✦</span> OPTIMIZE
                  </button>
                </div>
              </div>

              {/* AI MODEL OVERRIDE */}
              <div>
                <label className="block text-[10px] font-bold text-fuchsia-400 font-orbitron tracking-wider uppercase mb-1">
                  AI MODEL OVERRIDE
                </label>
                <select
                  value={modelOverride}
                  onChange={(e) => setModelOverride(e.target.value)}
                  className="w-full bg-[#181a24] border border-zinc-800 rounded-xl px-4 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-purple-500 transition"
                >
                  <option value="default">Default (Matches Main App Settings)</option>
                  <option value="v2_realistic">Realistic Photo V2</option>
                  <option value="v3_anime">Cyberpunk / Anime Style</option>
                  <option value="v1_studio">Studio Lighting XL</option>
                </select>
                <p className="text-[10px] text-gray-500 mt-1">
                  Select an AI model for this concept specifically. Overrides global setting.
                </p>
              </div>

              {/* ACTION BUTTONS */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleSaveEditedConcept}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 rounded-xl text-xs font-orbitron tracking-wider flex items-center justify-center gap-2 transition shadow-lg shadow-blue-900/20"
                >
                  SAVE TO MY CONCEPTS
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="w-full bg-zinc-800 hover:bg-zinc-700 text-gray-200 hover:text-white font-bold py-2.5 rounded-xl text-xs font-orbitron tracking-wider transition"
                >
                  DONE EDITING
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: LOAD TEMPLATES */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#121319] border border-purple-500/30 rounded-2xl w-full max-w-4xl p-6 shadow-[0_0_50px_rgba(168,85,247,0.15)] relative max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-fuchsia-500 shadow-[0_0_8px_#d946ef]" />
                <h3 className="text-lg font-bold text-white font-orbitron tracking-wider">
                  LOAD TEMPLATES
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsTemplateModalOpen(false)}
                className="w-8 h-8 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-gray-400 hover:text-white flex items-center justify-center transition"
              >
                ✕
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="grid grid-cols-2 bg-zinc-900/90 rounded-xl p-1 border border-zinc-800/80 text-xs font-bold tracking-wider font-orbitron mb-6">
              <button
                type="button"
                onClick={() => setTemplateTab('global')}
                className={`py-2.5 rounded-lg text-center transition ${
                  templateTab === 'global'
                    ? 'text-white bg-zinc-800 shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                GLOBAL PRE-READY CONCEPTS
              </button>
              <button
                type="button"
                onClick={() => setTemplateTab('saved')}
                className={`py-2.5 rounded-lg text-center transition ${
                  templateTab === 'saved'
                    ? 'text-white bg-zinc-800 shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                MY SAVED CONCEPTS
              </button>
            </div>

            {/* Template Cards Grid */}
            <div className="overflow-y-auto pr-1 flex-1">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
                {currentTemplatesList.map((tpl, idx) => (
                  <div
                    key={idx}
                    className="bg-[#181a24] border border-zinc-800/80 rounded-xl p-2 flex flex-col items-center hover:border-purple-500/40 transition group"
                  >
                    <div className="w-full aspect-square rounded-lg overflow-hidden mb-2 bg-zinc-900">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={tpl.image}
                        alt={tpl.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src =
                            'https://placehold.co/300x300/181a24/ffffff?text=Template';
                        }}
                      />
                    </div>
                    <div className="w-full px-1 flex flex-col text-left mb-3">
                      <h5 className="font-bold text-white text-[11px] font-orbitron tracking-wide truncate">
                        {tpl.title}
                      </h5>
                      <span className="text-[9px] font-bold text-fuchsia-500 tracking-tight uppercase truncate mt-0.5">
                        {tpl.tag}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleLoadTemplate(tpl)}
                      className="w-full bg-[#232733] hover:bg-purple-600 text-gray-200 hover:text-white text-[10px] font-bold py-1.5 rounded-md font-orbitron tracking-wider transition border border-zinc-700/50 hover:border-purple-500"
                    >
                      LOAD
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      <div
        className={`fixed bottom-6 right-6 bg-purple-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 transition-all duration-300 z-50 ${
          isToastVisible
            ? 'translate-y-0 opacity-100'
            : 'translate-y-20 opacity-0 pointer-events-none'
        }`}
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
        <span className="text-xs font-semibold font-orbitron tracking-wider">
          {toastMessage}
        </span>
      </div>
    </div>
  );
}