"use client";

import { useState } from "react";
import { Info, Clock, Lightbulb, Play, Film, ImagePlus } from "lucide-react";

interface EventIdentityProps {
  eventName: string;
  setEventName: (val: string) => void;
  eventDesc: string;
  setEventDesc: (val: string) => void;
  autoReset: boolean;
  setAutoReset: (val: boolean) => void;
  countdown: string;
  setCountdown: (val: string) => void;
  selectedBackground?: string;
  setSelectedBackground?: (val: string) => void;
}

export default function EventIdentity({
  eventName,
  setEventName,
  eventDesc,
  setEventDesc,
  autoReset,
  setAutoReset,
  countdown,
  setCountdown,
  selectedBackground = "tpl-hex",
  setSelectedBackground,
}: EventIdentityProps) {
  const numericCountdown = parseInt(countdown) || 60;
  const countdownOptions = ["30s", "45s", "60s", "90s", "120s"];

  const [localBg, setLocalBg] = useState(selectedBackground);
  const [customFileStatus, setCustomFileStatus] = useState("");

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCountdown(`${e.target.value}s`);
  };

  const handleSelectTemplate = (tplClass: string) => {
    setLocalBg(tplClass);
    if (setSelectedBackground) {
      setSelectedBackground(tplClass);
    }
    setCustomFileStatus("");
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "video" | "image", maxMB: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxBytes = maxMB * 1024 * 1024;
    if (file.size > maxBytes) {
      alert(`Ukuran maksimal untuk ${type} adalah ${maxMB}MB.`);
      e.target.value = "";
      return;
    }

    const fileUrl = URL.createObjectURL(file);
    setCustomFileStatus(`Active: ${file.name}`);
    setLocalBg(fileUrl);
    if (setSelectedBackground) {
      setSelectedBackground(fileUrl);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xs font-bold tracking-wider text-purple-400 uppercase mb-4">
          Event Identity
        </h2>

        {/* Input Event Name */}
        <div className="mb-4">
          <label className="block text-[11px] font-bold tracking-wider text-gray-400 uppercase mb-2">
            Event Name
          </label>
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            className="w-full bg-[#130d22] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#8b35ff] transition-colors"
          />
        </div>

        {/* Input Event Description */}
        <div className="mb-6">
          <label className="block text-[11px] font-bold tracking-wider text-gray-400 uppercase mb-2">
            Event Description
          </label>
          <input
            type="text"
            value={eventDesc}
            onChange={(e) => setEventDesc(e.target.value)}
            className="w-full bg-[#130d22] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#8b35ff] transition-colors"
          />
        </div>
      </div>

      {/* Inactivity Auto-Reset */}
      <div className="bg-[#130d22] border border-white/10 rounded-2xl p-5 flex items-center justify-between">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-purple-400 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-white">INACTIVITY AUTO-RESET</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Automatically return to the start screen when guests abandon an unfinished session.
            </p>
          </div>
        </div>
        <button
          onClick={() => setAutoReset(!autoReset)}
          className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
            autoReset ? "bg-[#8b35ff]" : "bg-gray-700"
          }`}
        >
          <div
            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
              autoReset ? "translate-x-6" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Countdown Duration */}
      <div className={`space-y-4 transition-all ${!autoReset ? "opacity-40 pointer-events-none" : ""}`}>
        <div className="flex justify-between items-center mb-3">
          <label className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
            Auto-Reset Countdown Duration
          </label>
          <span className="bg-[#8b35ff]/20 text-purple-300 border border-purple-500/30 px-3 py-1 rounded-full text-xs font-bold">
            {numericCountdown} Seconds
          </span>
        </div>

        {/* Slider / Range */}
        <input
          type="range"
          min="15"
          max="120"
          value={numericCountdown}
          onChange={handleSliderChange}
          className="w-full accent-[#8b35ff] bg-gray-700 h-2 rounded-lg cursor-pointer mb-3"
        />

        {/* Pilihan Tombol Durasi */}
        <div className="grid grid-cols-5 gap-3">
          {countdownOptions.map((opt) => {
            const isActive = countdown === opt || countdown.startsWith(opt.replace("s", ""));
            return (
              <button
                key={opt}
                onClick={() => setCountdown(opt)}
                className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  isActive
                    ? "bg-[#8b35ff] border-purple-400 text-white shadow-[0_0_10px_rgba(139,53,255,0.4)]"
                    : "bg-[#130d22] border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      {/* BACKGROUND (APPLIES TO DISPLAY) */}
      <div className="bg-[#130d22] border border-white/10 rounded-2xl p-5 space-y-4">
        <h3 className="font-bold text-xs tracking-wider text-white uppercase">
          BACKGROUND (APPLIES TO DISPLAY)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* VIDEO TEMPLATES */}
          <div className="bg-[#09090b] border border-white/10 rounded-xl p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">VIDEO TEMPLATES</span>
              <span className="text-[10px] text-purple-400 font-mono">LOOP MP4</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: "tpl-hex", cls: "tpl-hex" },
                { id: "tpl-cybercar", cls: "tpl-cybercar" },
                { id: "tpl-shards-dark", cls: "tpl-shards-dark" },
                { id: "tpl-waterfall", cls: "tpl-waterfall" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectTemplate(item.cls)}
                  className={`group relative aspect-video rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    localBg === item.cls
                      ? "border-purple-500 shadow-[0_0_12px_rgba(139,53,255,0.4)] ring-2 ring-purple-500/50"
                      : "border-white/10 hover:border-white/30"
                  }`}
                >
                  <div className={`w-full h-full ${item.cls} bg-cover bg-center`} />
                  <span className="absolute bottom-1 right-1 bg-black/70 px-1.5 py-0.5 rounded text-[9px] font-mono text-white flex items-center gap-1">
                    <Play className="w-2.5 h-2.5 fill-current" /> VID
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* IMAGE TEMPLATES */}
          <div className="bg-[#09090b] border border-white/10 rounded-xl p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">IMAGE TEMPLATES</span>
              <span className="text-[10px] text-gray-500 font-mono">STATIC HD</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: "tpl-blue-crystal", cls: "tpl-blue-crystal" },
                { id: "tpl-neon-poly", cls: "tpl-neon-poly" },
                { id: "tpl-cracked-obsidian", cls: "tpl-cracked-obsidian" },
                { id: "tpl-galaxy-sky", cls: "tpl-galaxy-sky" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectTemplate(item.cls)}
                  className={`group relative aspect-video rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    localBg === item.cls
                      ? "border-purple-500 shadow-[0_0_12px_rgba(139,53,255,0.4)] ring-2 ring-purple-500/50"
                      : "border-white/10 hover:border-white/30"
                  }`}
                >
                  <div className={`w-full h-full ${item.cls} bg-cover bg-center`} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Custom Upload Buttons */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Custom Background Media (UI Only):</span>
            <span className="text-[11px] font-mono text-purple-400">{customFileStatus}</span>
          </div>

          <input
            type="file"
            id="upload-video-input"
            accept="video/mp4,video/webm"
            className="hidden"
            onChange={(e) => handleMediaUpload(e, "video", 8)}
          />
          <input
            type="file"
            id="upload-image-input"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={(e) => handleMediaUpload(e, "image", 2)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => document.getElementById("upload-video-input")?.click()}
              className="py-3 px-4 rounded-xl bg-[#18181b] hover:bg-zinc-800 border border-white/10 hover:border-purple-500/60 text-white font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Film className="w-4 h-4 text-purple-400" />
              <span>UPLOAD VIDEO (8MB)</span>
            </button>
            <button
              type="button"
              onClick={() => document.getElementById("upload-image-input")?.click()}
              className="py-3 px-4 rounded-xl bg-[#18181b] hover:bg-zinc-800 border border-white/10 hover:border-purple-500/60 text-white font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ImagePlus className="w-4 h-4 text-purple-400" />
              <span>UPLOAD IMAGE (2MB)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Info Panduan Bawah */}
      <div className="bg-[#130d22]/50 border border-white/5 rounded-xl p-4 flex items-start space-x-3 text-xs text-gray-400">
        <span className="text-yellow-400 font-bold">💡</span>
        <p>
          <strong className="text-white">How it works:</strong> If a guest touches the screen, chooses templates or begins session, but walks away without touching the screen for <strong className="text-white">{numericCountdown} seconds</strong>, the booth automatically cancels and returns to the initial home screen. Strictly exempt during AI rendering, photo processing, and the final render result screen.
        </p>
      </div>
    </div>
  );
}