"use client";

import { useState, useRef, useEffect } from "react";
import EventsHero from "@/components/eventseminar/eventsHero";
import EventsScope from "@/components/eventseminar/eventsScope";
import EventsAlbum from "@/components/eventseminar/eventsAlbum";
import EventsPricing from "@/components/eventseminar/eventsPricing";
import { Music, VolumeX } from "lucide-react";

export default function EventsDetailPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Inisialisasi audio (sesuaikan path file audio untuk event jika ada)
    const audio = new Audio("/audio/musikevent.mpeg");
    audio.loop = true;
    audio.volume = 0.4;
    audioRef.current = audio;

    // Fungsi untuk mencoba memutar musik secara otomatis pada interaksi pertama user
    const handleFirstInteraction = () => {
      if (audioRef.current) {
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
            cleanupListeners();
          })
          .catch((err) => {
            console.log("Autoplay dicegah browser:", err);
          });
      }
    };

    const cleanupListeners = () => {
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("scroll", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
    };

    // Daftarkan listener interaksi awal
    window.addEventListener("click", handleFirstInteraction);
    window.addEventListener("scroll", handleFirstInteraction);
    window.addEventListener("keydown", handleFirstInteraction);
    window.addEventListener("touchstart", handleFirstInteraction);

    // Sinkronisasi status audio agar state selalu akurat
    const updatePlayState = () => {
      if (audioRef.current) {
        setIsPlaying(!audioRef.current.paused);
      }
    };

    audio.addEventListener("play", updatePlayState);
    audio.addEventListener("pause", updatePlayState);

    return () => {
      cleanupListeners();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener("play", updatePlayState);
        audioRef.current.removeEventListener("pause", updatePlayState);
        audioRef.current = null;
      }
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.error("Gagal memutar audio:", err);
        });
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0518] text-white selection:bg-cyan-500 selection:text-black relative">
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-10 left-1/4 w-[500px] h-[350px] bg-cyan-500/10 rounded-full blur-[140px]" />
        <div className="absolute top-[40%] right-[-5%] w-[450px] h-[450px] bg-purple-600/15 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-[100rem] mx-auto px-5 sm:px-6 pt-10 pb-24">
        <EventsHero />
        <EventsScope />
        <EventsAlbum />
        <EventsPricing />
      </div>

      {/* Floating Music Player Button */}
      <div className="fixed bottom-24 sm:bottom-6 right-6 sm:right-auto sm:left-6 z-50">
        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? "Matikan Musik" : "Putar Musik"}
          className={`flex items-center gap-2.5 px-4 py-3 rounded-full shadow-2xl backdrop-blur-md border transition-all duration-300 cursor-pointer ${
            isPlaying
              ? "bg-[#180d38]/90 border-cyan-400/50 text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.3)] animate-pulse"
              : "bg-[#140b2b]/90 border-white/10 text-gray-400 hover:text-white hover:border-white/30"
          }`}
        >
          <div className="relative flex items-center justify-center w-5 h-5">
            {isPlaying ? (
              <Music className="w-5 h-5 text-cyan-400 animate-bounce" />
            ) : (
              <VolumeX className="w-5 h-5" />
            )}
          </div>
          <span className="text-xs font-medium tracking-wide">
            {isPlaying ? "BGM Playing" : "Play Event BGM"}
          </span>
        </button>
      </div>
    </div>
  );
}