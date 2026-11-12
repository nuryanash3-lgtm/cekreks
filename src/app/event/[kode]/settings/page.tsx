"use client";

import { useState } from "react";
import { 
  Settings, 
  Sparkles, 
  Image as ImageIcon, 
  Sliders, 
  Smartphone, 
  Download, 
  Monitor, 
  Video, 
  Printer, 
  Database, 
  HelpCircle,
  ToggleLeft,
  Info
} from "lucide-react";

export default function EventSettingsPage() {
  const [activeMenu, setActiveMenu] = useState("identity");
  const [eventName, setEventName] = useState("ARTBOOTH");
  const [eventDesc, setEventDesc] = useState("Semua bisa mengekspresikan disini");
  const [autoReset, setAutoReset] = useState(true);
  const [countdown, setCountdown] = useState("60s (Default)");
  const [previewMode, setPreviewMode] = useState<"portrait" | "landscape">("portrait");

  const sidebarMenus = [
    { id: "identity", name: "EVENT IDENTITY & UI", icon: Sparkles },
    { id: "output", name: "OUTPUT & OVERLAY (PNG)", icon: ImageIcon },
    { id: "model", name: "IMAGE MODEL SETTINGS", icon: Sliders },
    { id: "remote", name: "REMOTE APP", icon: Smartphone },
    { id: "guest", name: "GUEST DOWNLOAD PAGE", icon: Download },
    { id: "monitor", name: "EXTERNAL MONITOR CONFIG", icon: Monitor },
    { id: "video", name: "VIDEO SETTINGS", icon: Video },
    { id: "print", name: "PRINT SETTINGS", icon: Printer },
    { id: "data", name: "DATA & MAINTENANCE", icon: Database },
  ];

  const countdownOptions = ["30s", "45s", "60s (Default)", "90s", "120s"];

  return (
    <div className="flex flex-1 w-full bg-[#070312] text-white p-6 gap-6 overflow-hidden">
      {/* 1. SIDEBAR KIRI (Booth Settings Menu) */}
      <aside className="w-72 flex flex-col bg-[#0b061a] border border-white/10 rounded-2xl p-4 shrink-0 overflow-y-auto">
        <div className="flex items-center space-x-2 text-gray-400 text-xs font-bold tracking-wider mb-4 px-2">
          <Settings className="w-4 h-4" />
          <span>BOOTH SETTINGS</span>
        </div>

        <nav className="space-y-1">
          {sidebarMenus.map((menu) => {
            const Icon = menu.icon;
            const isActive = activeMenu === menu.id;
            return (
              <button
                key={menu.id}
                onClick={() => setActiveMenu(menu.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-[#8b35ff] to-[#7b2cbf] text-white shadow-[0_0_15px_rgba(139,53,255,0.4)]"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-4 h-4" />
                  <span className="text-left">{menu.name}</span>
                </div>
                <span>›</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* 2. KONTEN UTAMA TENGAH (Event Identity & UI Form) */}
      <main className="flex-1 bg-[#0b061a] border border-white/10 rounded-2xl p-8 overflow-y-auto">
        <h1 className="text-xl font-bold tracking-wider mb-6 text-white border-b border-white/10 pb-4">
          EVENT IDENTITY & UI
        </h1>

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
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                Auto-Reset Countdown Duration
              </label>
              <span className="bg-[#8b35ff]/20 text-purple-300 border border-purple-500/30 px-3 py-1 rounded-full text-xs font-bold">
                {countdown}
              </span>
            </div>

            {/* Slider / Range */}
            <input
              type="range"
              min="15"
              max="120"
              defaultValue="60"
              className="w-full accent-[#8b35ff] bg-gray-700 h-2 rounded-lg cursor-pointer mb-3"
            />

            {/* Pilihan Tombol Durasi */}
            <div className="grid grid-cols-5 gap-3">
              {countdownOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setCountdown(opt)}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    countdown === opt
                      ? "bg-[#8b35ff] border-purple-400 text-white shadow-[0_0_10px_rgba(139,53,255,0.4)]"
                      : "bg-[#130d22] border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Info Panduan Bawah */}
          <div className="bg-[#130d22]/50 border border-white/5 rounded-xl p-4 flex items-start space-x-3 text-xs text-gray-400">
            <span className="text-yellow-400 font-bold">💡</span>
            <p>
              <strong className="text-white">How it works:</strong> If a guest touches the screen, chooses templates or begins session, but walks away without touching the screen for <strong className="text-white">60 seconds</strong>, the booth automatically cancels and returns to the initial home screen. Strictly exempt during AI rendering, photo processing, and the final render result screen.
            </p>
          </div>
        </div>
      </main>

      {/* 3. KANAN: LIVE PREVIEW (Mockup Smartphone) */}
      <aside className="w-80 flex flex-col bg-[#0b061a] border border-white/10 rounded-2xl p-5 shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 text-gray-400 text-xs font-bold tracking-wider">
            <Monitor className="w-4 h-4" />
            <span>LIVE PREVIEW</span>
          </div>
        </div>

        {/* Tombol Toggle Portrait / Landscape */}
        <div className="grid grid-cols-2 gap-2 bg-[#130d22] p-1 rounded-xl border border-white/10 mb-4">
          <button
            onClick={() => setPreviewMode("portrait")}
            className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              previewMode === "portrait"
                ? "bg-[#8b35ff] text-white shadow-[0_0_10px_rgba(139,53,255,0.4)]"
                : "text-gray-400 hover:text-white"
            }`}
          >
            PORTRAIT
          </button>
          <button
            onClick={() => setPreviewMode("landscape")}
            className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              previewMode === "landscape"
                ? "bg-[#8b35ff] text-white shadow-[0_0_10px_rgba(139,53,255,0.4)]"
                : "text-gray-400 hover:text-white"
            }`}
          >
            LANDSCAPE
          </button>
        </div>

        {/* Layar Simulasi Mockup Handphone */}
        <div className="flex-1 bg-[#130d22] border border-white/10 rounded-2xl flex flex-col items-center justify-center p-4 relative overflow-hidden shadow-inner">
          <div className="w-full h-full border border-white/10 rounded-xl bg-gradient-to-b from-purple-950/20 to-black p-4 flex flex-col items-center justify-between text-center relative">
            
            {/* Kamera kecil mockup */}
            <div className="w-3 h-3 bg-black rounded-full border border-white/20 mb-2" />

            {/* Isi Preview */}
            <div className="flex flex-col items-center justify-center my-auto space-y-3">
              <h3 className="font-black tracking-widest text-lg text-white">
                {eventName || "ARTBOOTH"}
              </h3>
              <p className="text-[10px] text-gray-400 max-w-[180px]">
                {eventDesc || "Semua bisa mengekspresikan disini"}
              </p>
              <div className="flex space-x-2 pt-2">
                <span className="bg-[#8b35ff] text-white px-3 py-1 rounded-md text-[10px] font-bold shadow">
                  LAUNCH
                </span>
                <span className="bg-white/10 text-white px-3 py-1 rounded-md text-[10px] font-bold border border-white/10">
                  GALLERY
                </span>
              </div>
            </div>

            {/* Indikator bawah layar */}
            <div className="w-16 h-1 bg-white/20 rounded-full mt-2" />
          </div>
        </div>
      </aside>
    </div>
  );
}