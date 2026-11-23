'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Orbitron, Inter } from 'next/font/google';
import { useParams } from 'next/navigation';
import {
  ChevronLeft,
  ChevronRight,
  Settings,
  ArrowRight,
  TriangleAlert,
  Wand2,
  Camera,
  Upload,
  Plus,
  Download,
  Maximize,
  Minimize,
} from 'lucide-react';

// --- KONFIGURASI FONT NEXT.JS ---
const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['500', '700', '900'],
  variable: '--font-orbitron',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-inter',
});

// --- TYPES & INTERFACES ---
export type ScreenType = 'opening' | 'concept' | 'capture' | 'gallery';

export interface ConceptItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  styleFilter: string;
  cssFilterClass: string;
}

export interface GalleryPhoto {
  id: number;
  concept: string;
  url: string;
  date: string;
}

// --- DATA KONSEP DEFAULT ---
const DEFAULT_CONCEPTS: ConceptItem[] = [
  {
    id: 'portrait-monochrome',
    title: 'PORTRAIT MONOCHROME',
    subtitle: 'CLASSIC BLACK & WHITE AI',
    image:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    styleFilter: 'grayscale(100%) contrast(115%)',
    cssFilterClass: 'grayscale contrast-125',
  },
  {
    id: 'koran-jadul',
    title: 'KORAN JADUL',
    subtitle: 'VINTAGE NEWSPAPER STYLE',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    styleFilter: 'sepia(85%) contrast(120%) brightness(95%)',
    cssFilterClass: 'sepia contrast-125 brightness-95',
  },
  {
    id: 'school-photobook',
    title: 'SCHOOL PHOTOBOOK',
    subtitle: 'YEARBOOK ACADEMIC VIBES',
    image:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    styleFilter: 'contrast(115%) saturate(110%) brightness(105%)',
    cssFilterClass: 'contrast-110 saturate-110 brightness-105',
  },
  {
    id: 'paint-brush',
    title: 'PAINT BRUSH',
    subtitle: 'ARTISTIC CANVAS AI',
    image:
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
    styleFilter: 'saturate(180%) contrast(110%)',
    cssFilterClass: 'saturate-150 contrast-110',
  },
  {
    id: 'cyberpunk-neon',
    title: 'CYBERPUNK NEON',
    subtitle: 'FUTURISTIC GLOW',
    image:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
    styleFilter: 'hue-rotate(280deg) saturate(160%) contrast(120%)',
    cssFilterClass: 'hue-rotate-[280deg] saturate-150 contrast-125',
  },
];

const INITIAL_GALLERY: GalleryPhoto[] = [
  {
    id: 1,
    concept: 'PORTRAIT MONOCHROME',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    date: 'JUST NOW',
  },
  {
    id: 2,
    concept: 'SCHOOL PHOTOBOOK',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    date: 'TODAY',
  },
];

export default function PhotoboothLaunchingPage() {
  // --- STATE NAVIGASI & UI ---
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('opening');
  const [previousScreen, setPreviousScreen] = useState<ScreenType>('opening');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // --- STATE CAROUSEL KONSEP ---
  const [activeConceptIndex, setActiveConceptIndex] = useState<number>(0);

  // --- STATE KAMERA & CAPTURE ---
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraReady, setIsCameraReady] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isFlashing, setIsFlashing] = useState<boolean>(false);
  const [capturedImageData, setCapturedImageData] = useState<string | null>(null);
  const [isProcessingAI, setIsProcessingAI] = useState<boolean>(false);

  // --- STATE GALERI ---
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhoto[]>(INITIAL_GALLERY);

  // --- REFS ---
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const activeConcept = DEFAULT_CONCEPTS[activeConceptIndex];

  const { kode } = useParams<{ kode: string }>();
  const [eventTitle, setEventTitle] = useState('Memuat event...');

  useEffect(() => {
    const savedEvents = localStorage.getItem('cekreks_events_state');

    if (!savedEvents) {
      setEventTitle('Event tidak ditemukan');
      return;
    }

    try {
      const parsed: unknown = JSON.parse(savedEvents);

      if (!Array.isArray(parsed)) {
        throw new Error('Format data event tidak valid');
      }

      const event = parsed.find(
        (item): item is { code: string; title: string } =>
          typeof item === 'object' &&
          item !== null &&
          'code' in item &&
          typeof item.code === 'string' &&
          'title' in item &&
          typeof item.title === 'string' &&
          item.code.toUpperCase() === kode.toUpperCase()
      );

      setEventTitle(event?.title ?? 'Event tidak ditemukan');
    } catch (error) {
      console.error('Gagal membaca data event dari localStorage', error);
      setEventTitle('Event tidak ditemukan');
    }
  }, [kode]);

  // --- FULLSCREEN LISTENER ---
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullScreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else if (document.exitFullscreen) {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.warn('Fullscreen request failed:', err);
    }
  };

  // --- CLEANUP TIMERS & CAMERA ---
  const clearCountdownTimer = useCallback(() => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    setCountdown(null);
  }, []);

  const stopCamera = useCallback(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraReady(false);
  }, []);

  const startCamera = useCallback(async () => {
    stopCamera();
    setCameraError(null);

    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setCameraError('Browser does not support webcam access.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
        audio: false,
      });
      mediaStreamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsCameraReady(true);
      }
    } catch (err: unknown) {
      console.warn('Camera Access Failed:', err);
      const message =
        err instanceof Error
          ? err.message
          : 'Failed to access camera or permission denied.';
      setCameraError(message);
      setIsCameraReady(false);
    }
  }, [stopCamera]);

  // --- EFEK LIFECYCLE KAMERA BERDASARKAN SCREEN ---
  useEffect(() => {
    if (currentScreen === 'capture') {
      startCamera();
    } else {
      stopCamera();
      clearCountdownTimer();
    }

    return () => {
      stopCamera();
      clearCountdownTimer();
    };
  }, [currentScreen, startCamera, stopCamera, clearCountdownTimer]);

  // --- HANDLER NAVIGASI ---
  const navigateTo = (target: ScreenType) => {
    setPreviousScreen(currentScreen);
    setCurrentScreen(target);
  };

  const handleGoBack = () => {
    if (currentScreen === 'concept') {
      navigateTo('opening');
    } else if (currentScreen === 'capture') {
      setCapturedImageData(null);
      navigateTo('concept');
    } else if (currentScreen === 'gallery') {
      navigateTo(previousScreen !== 'gallery' ? previousScreen : 'opening');
    } else {
      navigateTo('opening');
    }
  };

  // --- HANDLER CAROUSEL ---
  const handlePrevConcept = () => {
    setActiveConceptIndex((prev) => (prev - 1 + DEFAULT_CONCEPTS.length) % DEFAULT_CONCEPTS.length);
  };

  const handleNextConcept = () => {
    setActiveConceptIndex((prev) => (prev + 1) % DEFAULT_CONCEPTS.length);
  };

  // --- HANDLER CAPTURE & SNAPSHOT ---
  const takePhoto = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Trigger flash effect
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 400);

    const width = video?.videoWidth || 640;
    const height = video?.videoHeight || 480;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (video && isCameraReady && video.readyState >= 2) {
      // Mirror horizontal agar natural seperti cermin selfie
      ctx.save();
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, width, height);
      ctx.restore();
    } else {
      // Fallback Demo Snapshot jika kamera gagal/tidak tersedia
      ctx.fillStyle = '#111827';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = '#a855f7';
      ctx.font = 'bold 28px Orbitron, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('DEMO SNAPSHOT', width / 2, height / 2);
    }

    const dataUrl = canvas.toDataURL('image/png');
    setCapturedImageData(dataUrl);
  }, [isCameraReady]);

  const triggerCaptureSequence = () => {
    if (countdown !== null) return;
    let count = 3;
    setCountdown(count);

    countdownTimerRef.current = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdown(count);
      } else {
        clearCountdownTimer();
        takePhoto();
      }
    }, 1000);
  };

  const handleRetakePhoto = () => {
    setCapturedImageData(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setCapturedImageData(event.target.result);
      }
    };
    reader.readAsDataURL(file);
    // Reset input agar file yang sama bisa dipilih ulang jika user klik Retake
    e.target.value = '';
  };

  // --- HANDLER SIMULASI / INTEGRASI AI GENERATION ---
  const applyConceptFilterToCanvas = async (
    baseImageUrl: string,
    filterCss: string
  ): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const offCanvas = document.createElement('canvas');
        offCanvas.width = img.width;
        offCanvas.height = img.height;
        const ctx = offCanvas.getContext('2d');
        if (ctx) {
          ctx.filter = filterCss;
          ctx.drawImage(img, 0, 0, img.width, img.height);
          resolve(offCanvas.toDataURL('image/png'));
        } else {
          resolve(baseImageUrl);
        }
      };
      img.onerror = () => resolve(baseImageUrl);
      img.src = baseImageUrl;
    });
  };

  const handleProcessAIGeneration = async () => {
    setIsProcessingAI(true);

    try {
      const sourceImage = capturedImageData || activeConcept.image;
      // Menerapkan filter visual konsep aktif pada hasil foto (siap diganti API AI endpoint)
      const processedImageUrl = await applyConceptFilterToCanvas(
        sourceImage,
        activeConcept.styleFilter
      );

      await new Promise((resolve) => setTimeout(resolve, 2200));

      const newPhoto: GalleryPhoto = {
        id: Date.now(),
        concept: activeConcept.title,
        url: processedImageUrl,
        date: 'JUST NOW',
      };

      setGalleryPhotos((prev) => [newPhoto, ...prev]);
      setCapturedImageData(null);
      navigateTo('gallery');
    } finally {
      setIsProcessingAI(false);
    }
  };

  const handleDownloadPhoto = (url: string, conceptName: string) => {
    const a = document.createElement('a');
    a.href = url;
    const slug = conceptName.toLowerCase().replace(/\s+/g, '-');
    a.download = `cekreks-${slug}-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div
      className={`${orbitron.variable} ${inter.variable} poly-bg min-h-screen w-full flex flex-col justify-between select-none font-sans text-white overflow-x-hidden`}
    >
      {/* GLOBAL CUSTOM STYLES FOR NEON & POLYGONAL THEME */}
      <style jsx global>{`
        .font-tech {
          font-family: var(--font-orbitron), sans-serif;
        }
        .font-sans {
          font-family: var(--font-inter), sans-serif;
        }
        .poly-bg {
          background-color: #08090d;
          background-image: radial-gradient(
              circle at 50% 50%,
              rgba(168, 85, 247, 0.15) 0%,
              transparent 60%
            ),
            radial-gradient(
              circle at 20% 80%,
              rgba(16, 185, 129, 0.08) 0%,
              transparent 40%
            ),
            linear-gradient(to bottom, rgba(5, 6, 9, 0.85), rgba(5, 6, 9, 0.95)),
            url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><polygon points='0,0 50,30 0,60' fill='none' stroke='rgba(255,255,255,0.03)' stroke-width='1'/><polygon points='50,30 100,0 100,60' fill='none' stroke='rgba(255,255,255,0.03)' stroke-width='1'/><polygon points='0,60 50,30 100,60' fill='none' stroke='rgba(255,255,255,0.03)' stroke-width='1'/><polygon points='0,60 50,100 100,60' fill='none' stroke='rgba(255,255,255,0.03)' stroke-width='1'/></svg>");
          background-size: cover, cover, cover, 120px 120px;
        }
        .neon-text-purple {
          color: #e9d5ff;
          text-shadow: 0 0 10px rgba(168, 85, 247, 0.8),
            0 0 20px rgba(168, 85, 247, 0.4);
        }
        .neon-border-purple {
          box-shadow: 0 0 15px rgba(168, 85, 247, 0.6),
            inset 0 0 15px rgba(168, 85, 247, 0.3);
          border: 2px solid #a855f7;
        }
        .neon-btn-purple {
          background: linear-gradient(135deg, #9333ea 0%, #a855f7 100%);
          box-shadow: 0 0 20px rgba(168, 85, 247, 0.5);
          transition: all 0.3s ease;
        }
        .neon-btn-purple:hover {
          box-shadow: 0 0 30px rgba(168, 85, 247, 0.8);
          transform: translateY(-2px);
        }
        .carousel-perspective {
          perspective: 1000px;
        }
        .carousel-card {
          transition: all 0.5s cubic-bezier(0.25, 1, 0.5, 1);
          transform-style: preserve-3d;
        }
        @keyframes flashAnim {
          0% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
        .animate-flash {
          animation: flashAnim 0.4s ease-out forwards;
        }
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #090a0f;
        }
        ::-webkit-scrollbar-thumb {
          background: #a855f7;
          border-radius: 4px;
        }
      `}</style>

      {/* TOP HEADER NAVBAR (Tersembunyi di Opening Screen) */}
      <header
        className={`w-full px-6 py-4 flex justify-between items-center z-50 transition-opacity duration-300 ${currentScreen === 'opening'
            ? 'opacity-0 pointer-events-none'
            : 'opacity-100 pointer-events-auto'
          }`}
      >
        <button
          onClick={handleGoBack}
          className="flex items-center space-x-2 bg-black/60 hover:bg-black/90 border border-white/20 px-4 py-2 rounded-lg text-xs font-tech tracking-wider uppercase transition"
        >
          <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
          <span>BACK</span>
        </button>

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleFullScreen}
            className="hidden sm:flex items-center gap-1.5 text-xs font-tech text-gray-400 hover:text-white uppercase tracking-wider transition"
          >
            {isFullscreen ? (
              <>
                <Minimize className="w-3.5 h-3.5" />
                <span>EXIT FULL SCREEN</span>
              </>
            ) : (
              <>
                <Maximize className="w-3.5 h-3.5" />
                <span>FULL SCREEN</span>
              </>
            )}
          </button>

          <button
            onClick={() => navigateTo('gallery')}
            className="bg-black/60 hover:bg-black/90 border border-white/20 px-4 py-2 rounded-lg text-xs font-tech tracking-wider uppercase transition"
          >
            GALLERY
          </button>

          <button
            type="button"
            aria-label="Settings"
            className="text-gray-400 hover:text-white transition p-1"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER FOR SCREENS */}
      <main className="flex-1 flex items-center justify-center relative w-full px-4 py-2">
        {/* 1. OPENING SCREEN */}
        {currentScreen === 'opening' && (
          <section className="w-full max-w-4xl flex flex-col items-center justify-center text-center space-y-8 py-12 transition-all duration-500">
            <div className="space-y-2">
              <h1 className="text-5xl md:text-7xl font-black font-tech tracking-wider italic neon-text-purple">
                {eventTitle}
              </h1>
              <p className="text-xs md:text-sm font-tech tracking-[0.3em] text-gray-400 uppercase">
                CEKREKS.ID • AI PHOTOBOOTH
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md pt-6">
              <button
                onClick={() => navigateTo('concept')}
                className="w-full sm:w-1/2 py-3.5 px-6 neon-btn-purple text-white font-tech font-bold text-sm tracking-widest uppercase rounded-md"
              >
                LAUNCH
              </button>
              <button
                onClick={() => navigateTo('gallery')}
                className="w-full sm:w-1/2 py-3.5 px-6 bg-transparent hover:bg-white/5 border border-white/30 text-white font-tech font-bold text-sm tracking-widest uppercase rounded-md transition"
              >
                GALLERY
              </button>
            </div>
          </section>
        )}

        {/* 2. CHOOSE CONCEPT SCREEN */}
        {currentScreen === 'concept' && (
          <section className="w-full max-w-6xl flex flex-col items-center justify-center text-center space-y-6 transition-all duration-500">
            <div>
              <h2 className="text-2xl md:text-4xl font-extrabold font-tech tracking-wider neon-text-purple uppercase">
                CHOOSE CONCEPT
              </h2>
              <p className="text-xs font-tech text-purple-300/70 tracking-widest uppercase mt-1">
                SELECT YOUR TRANSFORMATION
              </p>
            </div>

            {/* 3D CAROUSEL AREA */}
            <div className="relative w-full flex items-center justify-center min-h-[420px] md:min-h-[480px] my-4 overflow-hidden carousel-perspective">
              {/* Nav Prev */}
              <button
                onClick={handlePrevConcept}
                aria-label="Previous Concept"
                className="absolute left-2 md:left-8 z-30 w-12 h-12 rounded-full bg-black/60 border border-white/20 hover:border-purple-500 text-white flex items-center justify-center transition"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Carousel Cards */}
              <div className="relative w-full max-w-4xl h-[420px] flex items-center justify-center">
                {DEFAULT_CONCEPTS.map((concept, idx) => {
                  const total = DEFAULT_CONCEPTS.length;
                  const offset = idx - activeConceptIndex;

                  const isCenter = offset === 0;
                  const isLeft =
                    offset === -1 || (offset === total - 1 && activeConceptIndex === 0);
                  const isRight =
                    offset === 1 || (offset === -(total - 1) && activeConceptIndex === total - 1);

                  let transformStyle = `translateX(${offset * 100}%) scale(0.6)`;
                  let zIndex = 0;
                  let opacity = 0;

                  if (isCenter) {
                    transformStyle = 'translateX(0) scale(1) translateZ(0)';
                    zIndex = 20;
                    opacity = 1;
                  } else if (isLeft) {
                    transformStyle = 'translateX(-70%) scale(0.85) rotateY(15deg)';
                    zIndex = 10;
                    opacity = 0.6;
                  } else if (isRight) {
                    transformStyle = 'translateX(70%) scale(0.85) rotateY(-15deg)';
                    zIndex = 10;
                    opacity = 0.6;
                  }

                  return (
                    <div
                      key={concept.id}
                      onClick={() => setActiveConceptIndex(idx)}
                      style={{
                        transform: transformStyle,
                        zIndex,
                        opacity,
                      }}
                      className={`carousel-card absolute w-64 md:w-80 h-[360px] md:h-[420px] rounded-2xl overflow-hidden cursor-pointer shadow-2xl flex flex-col justify-end p-4 border ${isCenter ? 'neon-border-purple' : 'border-white/10'
                        }`}
                    >
                      <img
                        src={concept.image}
                        alt={concept.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                      <div className="relative z-10 text-center space-y-1">
                        <h3 className="font-tech font-bold text-lg md:text-xl text-white tracking-wider leading-tight">
                          {concept.title}
                        </h3>
                        <p className="text-[10px] font-tech text-purple-300 tracking-widest opacity-80 uppercase">
                          {concept.subtitle}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Nav Next */}
              <button
                onClick={handleNextConcept}
                aria-label="Next Concept"
                className="absolute right-2 md:right-8 z-30 w-12 h-12 rounded-full bg-black/60 border border-white/20 hover:border-purple-500 text-white flex items-center justify-center transition"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            <button
              onClick={() => navigateTo('capture')}
              className="py-3 px-8 neon-btn-purple text-white font-tech font-bold text-sm tracking-widest uppercase rounded-md transition transform hover:scale-105 inline-flex items-center gap-2"
            >
              <span>CONFIRM CONCEPT</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </section>
        )}

        {/* 3. CAPTURE CAMERA SCREEN */}
        {currentScreen === 'capture' && (
          <section className="w-full max-w-4xl flex flex-col items-center justify-center text-center space-y-4 transition-all duration-500">
            <div className="space-y-1">
              <h2 className="text-xl md:text-2xl font-bold font-tech tracking-wider neon-text-purple uppercase">
                STRIKE A POSE
              </h2>
              <p className="text-[11px] font-tech text-purple-300/80 tracking-widest uppercase">
                CONCEPT: {activeConcept.title}
              </p>
            </div>

            {/* CAMERA VIEWPORT CONTAINER */}
            <div className="relative w-full max-w-2xl aspect-[4/3] sm:aspect-[16/10] bg-black rounded-2xl neon-border-purple overflow-hidden flex items-center justify-center">
              {/* Live Video Element (Mirrored) */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover -scale-x-100 ${isCameraReady && !cameraError ? 'block' : 'hidden'
                  }`}
              />
              <canvas ref={canvasRef} className="hidden" />

              {/* Camera Error / Initial Loading UI */}
              {(!isCameraReady || cameraError) && (
                <div className="flex flex-col items-center justify-center p-6 text-center space-y-4 z-10">
                  <div className="w-14 h-14 rounded-xl bg-red-900/30 border border-red-500/50 flex items-center justify-center text-red-500">
                    <TriangleAlert className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-tech font-bold text-lg text-white tracking-wider uppercase">
                      {cameraError ? 'CAMERA ERROR' : 'INITIALIZING CAMERA...'}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1 max-w-sm">
                      {cameraError || 'Please allow camera access in your browser.'}
                    </p>
                  </div>
                  {cameraError && (
                    <button
                      onClick={startCamera}
                      className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-tech text-xs tracking-wider uppercase rounded-md font-bold transition"
                    >
                      RETRY CAMERA
                    </button>
                  )}
                </div>
              )}

              {/* Flash Overlay */}
              {isFlashing && (
                <div className="absolute inset-0 bg-white z-40 animate-flash pointer-events-none" />
              )}

              {/* Countdown Overlay */}
              {countdown !== null && (
                <div className="absolute inset-0 bg-black/50 z-30 flex items-center justify-center">
                  <span
                    key={countdown}
                    className="font-tech text-8xl font-black text-purple-400 animate-ping"
                  >
                    {countdown}
                  </span>
                </div>
              )}

              {/* Captured Result Preview Overlay */}
              {capturedImageData && (
                <div className="absolute inset-0 bg-black/90 z-20 flex flex-col items-center justify-center p-4">
                  <img
                    src={capturedImageData}
                    alt="Captured preview"
                    className={`max-h-[75%] rounded-lg border border-purple-500/50 mb-4 object-contain ${activeConcept.cssFilterClass}`}
                  />
                  <div className="flex gap-4">
                    <button
                      onClick={handleRetakePhoto}
                      className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-white font-tech text-xs uppercase tracking-wider rounded-md border border-white/20 transition"
                    >
                      RETAKE
                    </button>
                    <button
                      onClick={handleProcessAIGeneration}
                      className="px-6 py-2.5 neon-btn-purple text-white font-tech text-xs font-bold uppercase tracking-wider rounded-md inline-flex items-center gap-1.5"
                    >
                      <span>GENERATE AI</span>
                      <Wand2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* AI Processing Overlay */}
              {isProcessingAI && (
                <div className="absolute inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-6 space-y-4">
                  <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                  <h3 className="font-tech text-lg text-purple-300 tracking-wider">
                    GENERATING AI PHOTO...
                  </h3>
                  <p className="text-xs text-gray-400 font-tech">
                    Applying {activeConcept.title} transformation
                  </p>
                </div>
              )}

              {/* Bottom Controls Bar Inside Viewport */}
              {!capturedImageData && !isProcessingAI && (
                <div className="absolute bottom-4 left-0 right-0 z-10 flex justify-center items-center px-4">
                  <div className="bg-black/70 backdrop-blur-md border border-white/10 rounded-xl p-2 flex items-center space-x-3">
                    <button
                      onClick={triggerCaptureSequence}
                      disabled={countdown !== null}
                      className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 px-5 py-2.5 rounded-lg font-tech text-xs tracking-wider uppercase font-bold transition"
                    >
                      <Camera className="w-4 h-4" />
                      <div className="text-left">
                        <div className="leading-none">TAKE PHOTO</div>
                        <div className="text-[9px] opacity-70 leading-tight">Use Camera</div>
                      </div>
                    </button>

                    <label className="flex items-center space-x-2 bg-gray-900 hover:bg-gray-800 border border-white/10 px-5 py-2.5 rounded-lg font-tech text-xs tracking-wider uppercase cursor-pointer transition">
                      <Upload className="w-4 h-4" />
                      <div className="text-left">
                        <div className="leading-none">UPLOAD</div>
                        <div className="text-[9px] opacity-70 leading-tight">From Gallery</div>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* 4. GALLERY SCREEN */}
        {currentScreen === 'gallery' && (
          <section className="w-full max-w-6xl flex flex-col items-center justify-center text-center space-y-6 transition-all duration-500">
            <div className="flex flex-col md:flex-row justify-between items-center w-full px-4">
              <div className="text-left">
                <h2 className="text-2xl md:text-3xl font-bold font-tech tracking-wider neon-text-purple uppercase">
                  CEKREKS.ID GALLERY
                </h2>
                <p className="text-xs font-tech text-gray-400 uppercase tracking-widest mt-1">
                  YOUR AI TRANSFORMATIONS & SAVED BOOTH PHOTOS
                </p>
              </div>
              <button
                onClick={() => navigateTo('concept')}
                className="mt-4 md:mt-0 neon-btn-purple px-5 py-2.5 text-xs font-tech font-bold tracking-widest uppercase rounded-md inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>NEW PHOTO</span>
              </button>
            </div>

            {/* GALLERY GRID */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4 max-h-[60vh] overflow-y-auto">
              {galleryPhotos.length === 0 ? (
                <div className="col-span-full py-12 text-center text-gray-500 font-tech">
                  NO PHOTOS TAKEN YET.
                </div>
              ) : (
                galleryPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    className="relative group bg-black/50 border border-white/10 rounded-xl overflow-hidden shadow-lg hover:border-purple-500 transition duration-300"
                  >
                    <div className="aspect-[3/4] w-full overflow-hidden">
                      <img
                        src={photo.url}
                        alt={photo.concept}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    </div>
                    <div className="p-3 text-left bg-black/80">
                      <div className="font-tech font-bold text-xs text-white truncate">
                        {photo.concept}
                      </div>
                      <div className="font-tech text-[9px] text-gray-400 mt-0.5">
                        {photo.date}
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-purple-900/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center space-x-2">
                      <button
                        onClick={() => handleDownloadPhoto(photo.url, photo.concept)}
                        className="p-2.5 bg-black/80 hover:bg-black text-white rounded-full transition"
                        title="Download"
                        aria-label={`Download ${photo.concept}`}
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        )}
      </main>

      {/* FOOTER */}
      <footer className="w-full py-4 text-center text-gray-500 text-[10px] font-tech tracking-widest uppercase">
        © CEKREKS.ID • ALL RIGHTS RESERVED
      </footer>
    </div>
  );
}