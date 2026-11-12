"use client";

import { Info } from "lucide-react";

interface EventIdentityProps {
  eventName: string;
  setEventName: (val: string) => void;
  eventDesc: string;
  setEventDesc: (val: string) => void;
  autoReset: boolean;
  setAutoReset: (val: boolean) => void;
  countdown: string;
  setCountdown: (val: string) => void;
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
}: EventIdentityProps) {
  const countdownOptions = ["30s", "45s", "60s (Default)", "90s", "120s"];

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
  );
}