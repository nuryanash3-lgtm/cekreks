"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function ImageModel() {
  const [selectedModel, setSelectedModel] = useState("CORDAI IMAGE 1");

  const models = [
    {
      id: "CORDAI IMAGE ULTRA",
      title: "CORDAI IMAGE ULTRA",
      desc: "Model terkini, generator Nano-Banana-2.1 (13 credit / image), kualitas visual ultra-tinggi, generasi terbaru, fotorealistik memukau, akurasi wajah dan tekstur paling tajam dan presisi.",
    },
    {
      id: "CORDAI IMAGE 1",
      title: "CORDAI IMAGE 1",
      desc: "Best, faster image generation, 15-30 seconds, can generate up to 5 images simultaneously. Accurate images, accurate faces, and characters like /NANO BANANA GEMINI have better detail and are more realistic. Can be used for dozens of people.",
    },
    {
      id: "CORDAI 2.5",
      title: "CORDAI 2.5",
      desc: "Next-Gen Flare AI Model (13 credit / image), ultra-realistic portrait quality, accurate skin texture, and precision masking/inpainting support with seamless background preservation.",
    },
    {
      id: "CORDAI GPT 2",
      title: "CORDAI GPT 2",
      desc: "Price is more than 3x cheaper than CORDAI IMAGE 1. Results remain excellent. Rendering time is 35-45 seconds.",
    },
    {
      id: "CORDAI IMAGE 3",
      title: "CORDAI IMAGE 3",
      desc: "Currently the fastest model, results take just 8 to 10 seconds while remaining accurate. Recommended maximum of 5-6 people per group photo.",
    },
  ];

  return (
    <div className="space-y-6 pb-4">
      <div>
        <h2 className="text-xs font-bold tracking-wider text-purple-400 uppercase mb-4">
          IMAGE AI MODEL
        </h2>

        {/* Dropdown Pilihan Model Utama */}
        <div className="relative mb-6">
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full bg-[#130d22] border border-white/10 rounded-xl px-4 py-3.5 text-sm font-semibold text-white focus:outline-none focus:border-[#8b35ff] appearance-none transition-colors cursor-pointer"
          >
            {models.map((m) => (
              <option key={m.id} value={m.id} className="bg-[#130d22] text-white">
                {m.title} - 10 CREDIT / IMAGE
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* List Kartu Model AI */}
      <div className="space-y-3">
        {models.map((model) => {
          const isSelected = selectedModel === model.id;
          return (
            <div
              key={model.id}
              onClick={() => setSelectedModel(model.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                isSelected
                  ? "bg-[#130d22] border-[#8b35ff] shadow-[0_0_15px_rgba(139,53,255,0.25)]"
                  : "bg-[#130d22]/60 border-white/10 hover:border-white/20"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <h3 className="text-sm font-black tracking-wider text-white">
                  {model.title}
                </h3>
                {isSelected && (
                  <span className="bg-[#8b35ff]/20 text-purple-300 border border-purple-500/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                    ACTIVE
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                {model.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}