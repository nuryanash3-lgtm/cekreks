"use client";

import { useState } from "react";

export default function OutputOverlay() {
  const [aspectRatio, setAspectRatio] = useState("2:3");
  const [customSize, setCustomSize] = useState(false);
  const [mosaicPhoto, setMosaicPhoto] = useState(false);

  const ratios = [
    { id: "9:16", label: "9:16", sub: "PORTRAIT" },
    { id: "16:9", label: "16:9", sub: "LANDSCAPE" },
    { id: "2:3", label: "2:3", sub: "PHOTO PORTRAIT (4R)" },
    { id: "3:2", label: "3:2", sub: "PHOTO LANDSCAPE (4R)" },
    { id: "3:4", label: "3:4", sub: "ORIGINAL 3:4 (NO CROP)" },
    { id: "4:3", label: "4:3", sub: "ORIGINAL 4:3 (NO CROP)" },
  ];

  return (
    <div className="space-y-6 pb-4">
      <div>
        <h2 className="text-xs font-bold tracking-wider text-purple-400 uppercase mb-4">
          Output Aspect Ratio
        </h2>

        {/* Grid Pilihan Aspect Ratio */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {ratios.map((item) => {
            const isSelected = aspectRatio === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setAspectRatio(item.id)}
                className={`flex flex-col items-center justify-center py-4 px-3 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#8b35ff] border-purple-400 text-white shadow-[0_0_15px_rgba(139,53,255,0.4)]"
                    : "bg-[#130d22] border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className="text-base font-black tracking-wider">{item.label}</span>
                <span className={`text-[10px] font-semibold mt-1 ${isSelected ? "text-purple-200" : "text-gray-500"}`}>
                  {item.sub}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Enable Custom Output Size */}
      <div className="bg-[#130d22] border border-white/10 rounded-2xl p-5 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white tracking-wider">ENABLE CUSTOM OUTPUT SIZE</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Fine-tune the final render resolution independently from aspect ratio.
          </p>
        </div>
        <button
          onClick={() => setCustomSize(!customSize)}
          className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer shrink-0 ml-4 ${
            customSize ? "bg-[#8b35ff]" : "bg-gray-700"
          }`}
        >
          <div
            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
              customSize ? "translate-x-6" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Enable Mosaic Photo */}
      <div className="bg-[#130d22] border border-white/10 rounded-2xl p-5 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white tracking-wider">ENABLE MOSAIC PHOTO</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Prints coordinates (e.g. A1, B3) on photos for a physical mosaic board.
          </p>
        </div>
        <button
          onClick={() => setMosaicPhoto(!mosaicPhoto)}
          className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer shrink-0 ml-4 ${
            mosaicPhoto ? "bg-[#8b35ff]" : "bg-gray-700"
          }`}
        >
          <div
            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
              mosaicPhoto ? "translate-x-6" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Informasi Konfigurasi Bawah */}
      <div className="text-xs text-gray-400 space-y-1.5 pt-2 px-1">
        <p>
          Your current output configuration is <span className="text-purple-400 font-bold">{aspectRatio}</span>.
        </p>
        <p className="font-bold text-white uppercase tracking-wider text-[11px] pt-1">
          Digital Photo Size:
        </p>
        <ul className="list-disc list-inside space-y-1 text-gray-400 pl-1">
          <li>Portrait 9:16 - 1080x1920 px</li>
          <li>Landscape 16:9 - 1920x1080 px</li>
        </ul>
      </div>
    </div>
  );
}