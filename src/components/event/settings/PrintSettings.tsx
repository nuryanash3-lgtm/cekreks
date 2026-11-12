"use client";

import { useState } from "react";
import { Check } from "lucide-react";

export default function PrintSettings() {
  const [enablePrinting, setEnablePrinting] = useState(true);
  const [buttonAction, setButtonAction] = useState("PRINT"); // "PRINT" | "SHARE"
  const [printMethod, setPrintMethod] = useState("DIRECT PRINT"); // "DIRECT PRINT" | "PRINT SERVER"
  const [layoutMode, setLayoutMode] = useState("SINGLE (FULL)");
  const [orientation, setOrientation] = useState("PORTRAIT");

  return (
    <div className="space-y-6 pb-4">
      
      {/* 1. ENABLE PRINTING */}
      <div className="bg-[#130d22] border border-white/10 rounded-2xl p-5 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white tracking-wider">ENABLE PRINTING</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Show Print button in Result and Gallery screens.
          </p>
        </div>
        <button
          onClick={() => setEnablePrinting(!enablePrinting)}
          className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-colors cursor-pointer shrink-0 ml-4 ${
            enablePrinting
              ? "bg-[#8b35ff] border-purple-400 text-white shadow-[0_0_10px_rgba(139,53,255,0.4)]"
              : "bg-[#0b061a] border-white/20 text-transparent"
          }`}
        >
          <Check className="w-4 h-4 stroke-[3]" />
        </button>
      </div>

      {/* 2. BUTTON ACTION */}
      <div>
        <label className="block text-[11px] font-bold tracking-wider text-gray-400 uppercase mb-3">
          BUTTON ACTION
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setButtonAction("PRINT")}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              buttonAction === "PRINT"
                ? "bg-[#8b35ff] border-purple-400 text-white shadow-[0_0_15px_rgba(139,53,255,0.4)]"
                : "bg-[#130d22] border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <h4 className="text-sm font-black tracking-wider mb-1">PRINT</h4>
            <p className={`text-[10px] ${buttonAction === "PRINT" ? "text-purple-200" : "text-gray-500"}`}>
              Trigger Browser Print
            </p>
          </button>

          <button
            onClick={() => setButtonAction("SHARE")}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              buttonAction === "SHARE"
                ? "bg-[#8b35ff] border-purple-400 text-white shadow-[0_0_15px_rgba(139,53,255,0.4)]"
                : "bg-[#130d22] border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <h4 className="text-sm font-black tracking-wider mb-1">SHARE API</h4>
            <p className={`text-[10px] ${buttonAction === "SHARE" ? "text-purple-200" : "text-gray-500"}`}>
              Trigger Mobile Share Menu
            </p>
          </button>
        </div>
      </div>

      {/* 3. PRINT METHOD */}
      <div>
        <label className="block text-[11px] font-bold tracking-wider text-gray-400 uppercase mb-3">
          PRINT METHOD
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setPrintMethod("DIRECT PRINT")}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              printMethod === "DIRECT PRINT"
                ? "bg-[#8b35ff] border-purple-400 text-white shadow-[0_0_15px_rgba(139,53,255,0.4)]"
                : "bg-[#130d22] border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <h4 className="text-sm font-black tracking-wider mb-1">DIRECT PRINT</h4>
            <p className={`text-[10px] ${printMethod === "DIRECT PRINT" ? "text-purple-200" : "text-gray-500"}`}>
              Print from this device
            </p>
          </button>

          <button
            onClick={() => setPrintMethod("PRINT SERVER")}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              printMethod === "PRINT SERVER"
                ? "bg-[#8b35ff] border-purple-400 text-white shadow-[0_0_15px_rgba(139,53,255,0.4)]"
                : "bg-[#130d22] border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <h4 className="text-sm font-black tracking-wider mb-1">PRINT SERVER</h4>
            <p className={`text-[10px] ${printMethod === "PRINT SERVER" ? "text-purple-200" : "text-gray-500"}`}>
              Send to another laptop
            </p>
          </button>
        </div>
      </div>

      {/* 4. 4X6 PRINT LAYOUT MODES */}
      <div>
        <label className="block text-[11px] font-bold tracking-wider text-gray-400 uppercase mb-3">
          4X6 PRINT LAYOUT MODES
        </label>
        <div className="grid grid-cols-4 gap-3">
          {[
            { id: "SINGLE (FULL)", desc: "Print 1 photo per sheet (4x6 paper)." },
            { id: "SINGLE 2R (LEFT)", desc: "1 photo, left aligned, Right blank." },
            { id: "DUPLICATE", desc: "Print same photo 2x on one sheet." },
            { id: "QUEUE & MERGE", desc: "Wait for next guest, merge 2 photos." },
          ].map((mode) => {
            const isSelected = layoutMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setLayoutMode(mode.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "bg-[#8b35ff] border-purple-400 text-white shadow-[0_0_15px_rgba(139,53,255,0.4)]"
                    : "bg-[#130d22] border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <h4 className="text-xs font-black tracking-wider mb-1">{mode.id}</h4>
                <p className={`text-[9px] leading-tight ${isSelected ? "text-purple-200" : "text-gray-500"}`}>
                  {mode.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. PRINTER HARDWARE ORIENTATION */}
      <div>
        <label className="block text-[11px] font-bold tracking-wider text-gray-400 uppercase mb-3">
          PRINTER HARDWARE ORIENTATION
        </label>
        <div className="grid grid-cols-3 gap-3">
          {["AUTO", "PORTRAIT", "LANDSCAPE"].map((item) => {
            const isSelected = orientation === item;
            return (
              <button
                key={item}
                onClick={() => setOrientation(item)}
                className={`py-3 rounded-2xl border text-center text-xs font-black tracking-wider transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#8b35ff] border-purple-400 text-white shadow-[0_0_15px_rgba(139,53,255,0.4)]"
                    : "bg-[#130d22] border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}