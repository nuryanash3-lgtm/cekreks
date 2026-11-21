"use client";

import React, { useState, useEffect } from "react";
import { 
  Check, 
  RotateCcw, 
  ChevronUp, 
  ChevronDown, 
  Printer, 
  Settings2, 
  X, 
  SlidersHorizontal,
  Share2
} from "lucide-react";

type PrinterSettings = {
  name: string;
  paper: string;
  finish: string;
  orientation: "AUTO" | "PORTRAIT" | "LANDSCAPE";
  fineTuningEnabled: boolean;
  brightness: number;
  fade: number;
  scale: number;
  yOffset: number;
  xOffset: number;
};

export default function PrintSettings() {
  // --- STATE ---
  const [enablePrinting, setEnablePrinting] = useState(true);
  const [buttonAction, setButtonAction] = useState("PRINT"); // PRINT | SHARE
  const [printMethod, setPrintMethod] = useState("DIRECT"); // DIRECT | SERVER
  const [layoutMode, setLayoutMode] = useState("4R");
  
  const [printAuto, setPrintAuto] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [bothPrinters, setBothPrinters] = useState(false);
  const [autorotate, setAutorotate] = useState(true);
  const [limitPrints, setLimitPrints] = useState(true);
  
  const [perEvent, setPerEvent] = useState(5000);
  const [perSession, setPerSession] = useState(1);
  const [maxCopies, setMaxCopies] = useState(6);
  const [sharpening, setSharpening] = useState("Low");

  const [activeTab, setActiveTab] = useState<"main" | "secondary">("main");
  
  const [printers, setPrinters] = useState<{ main: PrinterSettings; secondary: PrinterSettings }>({
    main: {
      name: "HiTi P525L",
      paper: "4x6 (10x15 cm)",
      finish: "Glossy",
      orientation: "AUTO",
      fineTuningEnabled: true,
      brightness: 0,
      fade: 0,
      scale: 0.0,
      yOffset: 1.2,
      xOffset: 0.0,
    },
    secondary: {
      name: "Canon PIXMA G500",
      paper: "4x6 (10x15 cm)",
      finish: "Glossy",
      orientation: "AUTO",
      fineTuningEnabled: false,
      brightness: 0,
      fade: 0,
      scale: 0.0,
      yOffset: 0.0,
      xOffset: 0.0,
    }
  });

  const [toast, setToast] = useState<{ msg: string; visible: boolean }>({ msg: "", visible: false });
  const [modals, setModals] = useState({ config: false, props: false, test: false });

  // --- HELPERS ---
  const showToast = (msg: string) => {
    setToast({ msg, visible: true });
    setTimeout(() => setToast({ msg: "", visible: false }), 2000);
  };

  const updatePrinter = (key: keyof PrinterSettings, value: any) => {
    setPrinters(prev => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], [key]: value }
    }));
  };

  const adjustFineTune = (key: keyof PrinterSettings, delta: number) => {
    const currentVal = printers[activeTab][key] as number;
    const newVal = Math.round((currentVal + delta) * 100) / 100;
    updatePrinter(key, newVal);
  };

  const resetDefaults = () => {
    setEnablePrinting(true);
    setButtonAction("PRINT");
    showToast("Settings reset to default");
  };

  const activeP = printers[activeTab];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 font-sans selection:bg-purple-500/30">
      
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-bold ${enablePrinting ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' : 'bg-zinc-800 border-white/10 text-zinc-500'}`}>
            {enablePrinting ? "ACTIVE" : "DISABLED"}
          </span>
        </div>
        <button 
          onClick={resetDefaults}
          className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Default
        </button>
      </div>

      {/* 1. ENABLE PRINTING CARD */}
      <div className="bg-[#121024] border border-white/5 rounded-2xl p-5 flex items-center justify-between shadow-xl">
        <div>
          <h3 className="text-sm font-bold text-white tracking-wide">ENABLE PRINTING</h3>
          <p className="text-xs text-zinc-400 mt-0.5">Show Print button in Result and Gallery screens.</p>
        </div>
        <button
          onClick={() => { setEnablePrinting(!enablePrinting); showToast(`Printing: ${!enablePrinting ? 'ON' : 'OFF'}`); }}
          className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none ${enablePrinting ? "bg-purple-600" : "bg-zinc-700"}`}
        >
          <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${enablePrinting ? "translate-x-6" : "translate-x-0"}`} />
        </button>
      </div>

      {/* MAIN CONTENT WRAPPER */}
      <div className={`space-y-6 transition-all duration-300 ${!enablePrinting ? "opacity-40 pointer-events-none grayscale" : ""}`}>
        
        {/* BUTTON ACTION & METHOD */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-500 tracking-widest uppercase">BUTTON ACTION</label>
            <div className="grid grid-cols-2 gap-2">
              {["PRINT", "SHARE"].map(opt => (
                <button
                  key={opt}
                  onClick={() => setButtonAction(opt)}
                  className={`p-4 rounded-xl border text-left transition-all ${buttonAction === opt ? "bg-purple-600 border-purple-400 shadow-[0_0_20px_rgba(147,51,234,0.3)]" : "bg-[#121024] border-white/5 hover:bg-white/5 text-zinc-400"}`}
                >
                  <div className="text-xs font-black text-white">{opt === 'PRINT' ? 'PRINT' : 'SHARE API'}</div>
                  <div className={`text-[10px] mt-1 ${buttonAction === opt ? 'text-purple-200' : 'text-zinc-500'}`}>
                    {opt === 'PRINT' ? 'Trigger direct print' : 'Trigger native share'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-500 tracking-widest uppercase">PRINT METHOD</label>
            <div className="grid grid-cols-2 gap-2">
              {["DIRECT", "SERVER"].map(opt => (
                <button
                  key={opt}
                  onClick={() => setPrintMethod(opt)}
                  className={`p-4 rounded-xl border text-left transition-all ${printMethod === opt ? "bg-purple-600 border-purple-400 shadow-[0_0_20px_rgba(147,51,234,0.3)]" : "bg-[#121024] border-white/5 hover:bg-white/5 text-zinc-400"}`}
                >
                  <div className="text-xs font-black text-white">{opt === 'DIRECT' ? 'DIRECT PRINT' : 'PRINT SERVER'}</div>
                  <div className={`text-[10px] mt-1 ${printMethod === opt ? 'text-purple-200' : 'text-zinc-500'}`}>
                    {opt === 'DIRECT' ? 'Print from this device' : 'Send to print station'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* LAYOUT MODES */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-zinc-500 tracking-widest uppercase">PRINT LAYOUT MODE</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {["4R", "6R", "8R", "QUEUE"].map(mode => (
              <button
                key={mode}
                onClick={() => setLayoutMode(mode)}
                className={`p-3 rounded-xl border text-left transition-all ${layoutMode === mode ? "bg-purple-600 border-purple-400" : "bg-[#121024] border-white/5 text-zinc-400"}`}
              >
                <div className="text-[11px] font-black text-white">
                  {mode === 'QUEUE' ? 'QUEUE & MERGE' : `SINGLE (FULL) ${mode}`}
                </div>
                <div className={`text-[9px] mt-1 leading-tight ${layoutMode === mode ? 'text-purple-200' : 'text-zinc-500'}`}>
                  {mode === 'QUEUE' ? 'Wait & merge 2 strips' : 'Print full image once'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* GENERAL BEHAVIOR CARD */}
        <div className="bg-[#121024] border border-white/5 rounded-2xl p-6 space-y-6">
          <ToggleRow label="Print automatically" sub="Automatically print each session" active={printAuto} onChange={setPrintAuto} />
          <ToggleRow label="Show print button" sub="Allow additional copies from sharing screen" active={showButton} onChange={setShowButton} />
          <ToggleRow label="Print to both printers" sub="Alternate printing to main and secondary" active={bothPrinters} onChange={setBothPrinters} />
          <ToggleRow label="Autorotate to fit" sub="Match template orientation automatically" active={autorotate} onChange={setAutorotate} />
          
          <div className="pt-2 space-y-4">
            <ToggleRow label="Limit prints" sub="Limit number of prints per event/session" active={limitPrints} onChange={setLimitPrints} />
            
            {limitPrints && (
              <div className="flex flex-wrap gap-6 pl-0 md:pl-4 transition-all">
                <CounterInput label="Per event" value={perEvent} onChange={setPerEvent} step={100} />
                <CounterInput label="Per session" value={perSession} onChange={setPerSession} />
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-white/5 flex flex-wrap gap-6 items-center">
            <CounterInput label="Print Copy max" value={maxCopies} onChange={setMaxCopies} />
            <div className="flex-1 min-w-[200px]">
              <label className="block text-[10px] font-black text-zinc-500 mb-1.5 uppercase">Print sharpening</label>
              <select 
                value={sharpening}
                onChange={(e) => setSharpening(e.target.value)}
                className="w-full bg-[#0b091a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
              >
                {["None", "Low", "Medium", "High"].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* PRINTER ALIGNMENT CARD */}
        <div className="bg-[#121024] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
          {/* TABS */}
          <div className="flex border-b border-white/5">
            {(['main', 'secondary'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab ? "text-white bg-white/5 border-b-2 border-purple-500" : "text-zinc-500 hover:text-zinc-300"}`}
              >
                {tab} printer
              </button>
            ))}
          </div>

          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-black text-white">{activeP.name}</h4>
                  <span className="flex items-center gap-1.5 text-[9px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Ready
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 mt-1">Status: Online • {activeP.paper}</p>
              </div>
              <button 
                onClick={() => setModals({ ...modals, config: true })}
                className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 text-[11px] font-bold text-white transition-all"
              >
                Configure
              </button>
            </div>

            <div className="bg-[#0b091a] border border-white/5 rounded-xl p-5 space-y-6">
              {/* ORIENTATION */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black text-purple-400 tracking-widest uppercase">Hardware Orientation</label>
                  <button 
                    onClick={() => setModals({...modals, props: true})}
                    className="flex items-center gap-1.5 text-[10px] font-black text-purple-300 bg-purple-500/10 px-3 py-1.5 rounded-lg border border-purple-500/20 hover:bg-purple-500/20 transition-all"
                  >
                    <SlidersHorizontal className="w-3 h-3" />
                    PRINTER SETTING
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {["AUTO", "PORTRAIT", "LANDSCAPE"].map(o => (
                    <button
                      key={o}
                      onClick={() => updatePrinter("orientation", o)}
                      className={`py-2.5 rounded-xl border text-[10px] font-black transition-all ${activeP.orientation === o ? "bg-purple-500/20 border-purple-500 text-purple-300 shadow-[inset_0_0_10px_rgba(168,85,247,0.1)]" : "bg-white/5 border-transparent text-zinc-500"}`}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              </div>

              {/* FINE TUNING */}
              <div className="space-y-4 pt-2 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black text-purple-400 tracking-widest uppercase">Color & Layout Fine-Tuning</label>
                  <button
                    onClick={() => updatePrinter("fineTuningEnabled", !activeP.fineTuningEnabled)}
                    className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${activeP.fineTuningEnabled ? "bg-purple-600" : "bg-zinc-700"}`}
                  >
                    <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${activeP.fineTuningEnabled ? "translate-x-5" : "translate-x-0"}`} />
                  </button>
                </div>

                {activeP.fineTuningEnabled && (
                  <div className="grid grid-cols-1 gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <FineTuneRow label="Brightness" value={activeP.brightness} onChange={(v) => updatePrinter("brightness", v)} sub="- Darken, + Lighten" />
                    <FineTuneRow label="Transparency" value={activeP.fade} onChange={(v) => updatePrinter("fade", v)} sub="Contrast vs Paper Blend" />
                    <FineTuneRow label="Scale / Padding" value={activeP.scale} onChange={(v) => updatePrinter("scale", v)} step={0.2} sub="- Crop, + Shrink" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <FineTuneRow label="Up / Down (Y)" value={activeP.yOffset} onChange={(v) => updatePrinter("yOffset", v)} step={0.2} sub="+ Up, - Down" />
                      <FineTuneRow label="Left / Right (X)" value={activeP.xOffset} onChange={(v) => updatePrinter("xOffset", v)} step={0.2} sub="+ Right, - Left" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button 
                onClick={() => setModals({...modals, test: true})}
                className="flex items-center gap-2.5 px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-sm font-black text-white transition-all active:scale-95"
              >
                <Printer className="w-4 h-4" />
                Print test page
              </button>
              <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Auto-saved locally</span>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL CONFIG (Minimal implementation) */}
      {modals.config && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#141129] border border-white/10 rounded-2xl w-full max-w-md p-6 space-y-6 shadow-2xl">
             <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <div className="flex items-center gap-2">
                  <Settings2 className="w-5 h-5 text-purple-400" />
                  <h3 className="text-base font-black text-white uppercase">Configure {activeTab}</h3>
                </div>
                <button onClick={() => setModals({...modals, config: false})}><X className="w-5 h-5 text-zinc-500 hover:text-white" /></button>
             </div>
             <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400">Select Printer</label>
                  <select className="w-full bg-[#0b091a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none">
                    <option>{activeP.name}</option>
                    <option>Microsoft Print to PDF</option>
                  </select>
                </div>
             </div>
             <button onClick={() => setModals({...modals, config: false})} className="w-full py-3 bg-purple-600 text-white font-black rounded-xl text-sm">SAVE SETTINGS</button>
          </div>
        </div>
      )}

      {/* TOAST */}
      <div className={`fixed bottom-8 right-8 z-[200] flex items-center gap-3 px-5 py-3 bg-[#1c1838] border border-purple-500/30 rounded-2xl shadow-2xl transition-all duration-300 transform ${toast.visible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
        <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
        <span className="text-xs font-black text-white uppercase tracking-wider">{toast.msg}</span>
      </div>

    </div>
  );
}

// --- SUB-COMPONENTS ---

function ToggleRow({ label, sub, active, onChange }: { label: string; sub: string; active: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex-1">
        <div className="text-sm font-bold text-white">{label}</div>
        <p className="text-[11px] text-zinc-500 mt-0.5">{sub}</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onChange(!active)}
          className={`relative w-11 h-6 rounded-full transition-all duration-200 ${active ? "bg-purple-600" : "bg-zinc-700"}`}
        >
          <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${active ? "translate-x-5" : "translate-x-0"}`} />
        </button>
        <span className={`text-[11px] font-black w-6 ${active ? 'text-white' : 'text-zinc-500'}`}>{active ? 'On' : 'Off'}</span>
      </div>
    </div>
  );
}

function CounterInput({ label, value, onChange, step = 1 }: { label: string; value: number; onChange: (v: number) => void; step?: number }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest">{label}</label>
      <div className="flex items-center gap-1.5">
        <button onClick={() => onChange(Math.max(0, value - step))} className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-all">-</button>
        <input 
          type="number" 
          value={value} 
          onChange={(e) => onChange(parseInt(e.target.value) || 0)}
          className="w-16 h-8 bg-transparent border border-white/10 rounded-lg text-center text-xs font-bold text-white focus:outline-none focus:border-purple-500"
        />
        <button onClick={() => onChange(value + step)} className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-all">+</button>
      </div>
    </div>
  );
}

function FineTuneRow({ label, value, sub, onChange, step = 1 }: { label: string; value: number; sub: string; onChange: (v: number) => void; step?: number }) {
  return (
    <div className="bg-white/5 border border-white/5 rounded-xl p-3.5 flex items-center justify-between gap-4">
      <div>
        <div className="text-[11px] font-bold text-white flex items-center gap-2">
          {label} <span className="text-purple-400 font-black">{value.toFixed(1)}</span>
        </div>
        <p className="text-[9px] text-zinc-500 mt-0.5">{sub}</p>
      </div>
      <div className="flex items-center gap-1.5">
        <button onClick={() => onChange(value - step)} className="w-7 h-7 rounded bg-white/5 text-[10px] font-bold text-zinc-400 hover:text-white">-</button>
        <input 
          type="text" 
          value={value} 
          onChange={(e) => onChange(parseFloat(e.target.value.replace(',', '.')) || 0)}
          className="w-12 h-7 bg-[#0b091a] border border-white/10 rounded text-center text-[10px] font-bold text-white focus:outline-none"
        />
        <button onClick={() => onChange(value + step)} className="w-7 h-7 rounded bg-white/5 text-[10px] font-bold text-zinc-400 hover:text-white">+</button>
      </div>
    </div>
  );
}