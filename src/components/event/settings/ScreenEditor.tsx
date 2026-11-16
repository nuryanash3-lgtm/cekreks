"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Camera,
  Play,
  RotateCcw,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  Info,
  Images,
  Infinity as InfinityIcon,
  Video,
  Trash2,
  Loader2,
} from "lucide-react";

type CaptureMode = "photo" | "gif" | "boomerang" | "video";

export default function ScreenEditor() {
  // App State
  const [editorTab, setEditorTab] = useState<"ai" | "konven">("konven");
  const [activeMode, setActiveMode] = useState<CaptureMode>("photo");
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait");
  const [aspectRatio, setAspectRatio] = useState("9:16");
  const [showLive, setShowLive] = useState(true);
  const [cropLive, setCropLive] = useState(true);
  const [mirrorLive, setMirrorLive] = useState(true);
  const [rotation, setRotation] = useState("0");
  const [autoTrigger, setAutoTrigger] = useState(true);
  const [flashWhite, setFlashWhite] = useState(true);
  const [cancelBtn, setCancelBtn] = useState(true);
  const [countdownColor, setCountdownColor] = useState("#ffffff");
  const [thumbnails, setThumbnails] = useState(true);
  const [thumbPos, setThumbPos] = useState<"bottom" | "top">("bottom");

  // Mode States (Enabled/Disabled)
  const [modesEnabled, setModesEnabled] = useState({
    photo: true,
    gif: false,
    boomerang: false,
    video: false,
  });

  // Photo Settings
  const [photoSettings, setPhotoSettings] = useState({
    before1: 2,
    beforeOther: 4,
    preview: 2,
    alsoGif: false,
  });

  // GIF Settings
  const [gifSettings, setGifSettings] = useState({
    size: "Regular (720x480)",
    before1: 5,
    beforeOther: 5,
    preview: 3,
    delay: 500,
    reverse: false,
    photosToCapture: 4,
  });

  // Boomerang Settings
  const [boomSettings, setBoomSettings] = useState({
    size: "Regular (720x480)",
    countdown: 5,
    delay: 24,
    duration: 2,
  });

  // Video Settings
  const [videoSettings, setVideoSettings] = useState({
    orientation: "0 degrees",
    size: "1280x720",
    quality: 80,
    type: "video" as "video" | "360",
    clips: 1,
    countdown1: 5,
    countdownOther: 3,
    recordOnMotion: false,
    duration: 10,
  });

  // UI States
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [accordions, setAccordions] = useState({
    photo: true,
    gif: false,
    boomerang: false,
    video: false,
  });
  const [toast, setToast] = useState<{ msg: string; visible: boolean }>({ msg: "", visible: false });
  const [isSimulating, setIsSimulating] = useState(false);
  const [countdownValue, setCountdownValue] = useState(2);
  const [shotIndex, setShotIndex] = useState(0);
  const [capturedThumbs, setCapturedThumbs] = useState<string[]>([]);
  const [flashActive, setFlashActive] = useState(false);
  const [sayCheeseActive, setSayCheeseActive] = useState(false);

  const simulationTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Helper: Show Toast
  const showToast = (msg: string) => {
    setToast({ msg, visible: true });
    setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 2500);
  };

  // Toggle capturing modes
  const toggleCaptureMode = (mode: CaptureMode, enabled: boolean) => {
    setModesEnabled((prev) => ({ ...prev, [mode]: enabled }));
    setAccordions((prev) => ({ ...prev, [mode]: enabled }));
    if (!enabled && activeMode === mode) {
      // Switch to first available mode
      const modes: CaptureMode[] = ["photo", "gif", "boomerang", "video"];
      const fallback = modes.find((m) => (m === mode ? false : modesEnabled[m]));
      if (fallback) setActiveMode(fallback);
    }
    showToast(`${mode.toUpperCase()} mode ${enabled ? "enabled" : "disabled"}`);
  };

  // Toggle Accordion
  const toggleAccordion = (mode: keyof typeof accordions) => {
    if (!modesEnabled[mode]) {
      showToast(`Enable ${mode.toUpperCase()} first to adjust settings.`);
      return;
    }
    setAccordions((prev) => ({ ...prev, [mode]: !prev[mode] }));
  };

  // Simulation Logic
  const startSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setCapturedThumbs([]);
    
    let currentShot = 1;
    const totalShots = 3;

    const runCountdown = (seconds: number) => {
      setCountdownValue(seconds);
      let current = seconds;
      
      simulationTimerRef.current = setInterval(() => {
        current--;
        if (current > 0) {
          setCountdownValue(current);
        } else {
          if (simulationTimerRef.current) clearInterval(simulationTimerRef.current);
          triggerShot();
        }
      }, 1000);
    };

    const triggerShot = () => {
      setSayCheeseActive(true);
      setTimeout(() => {
        setSayCheeseActive(false);
        if (flashWhite) {
          setFlashActive(true);
          setTimeout(() => setFlashActive(false), 500);
        }

        // Add dummy thumb
        const thumb = "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=150&q=80";
        setCapturedThumbs((prev) => [...prev, thumb]);

        if (currentShot < totalShots) {
          currentShot++;
          setTimeout(() => runCountdown(photoSettings.beforeOther), 800);
        } else {
          finishSimulation();
        }
      }, 700);
    };

    const finishSimulation = () => {
      setIsSimulating(false);
      setCountdownValue(photoSettings.before1);
      showToast("Simulation finished! 3 photos captured.");
    };

    runCountdown(photoSettings.before1);
  };

  const cancelSimulation = () => {
    if (!isSimulating) return;
    setIsSimulating(false);
    if (simulationTimerRef.current) clearInterval(simulationTimerRef.current);
    setSayCheeseActive(false);
    setCountdownValue(photoSettings.before1);
    showToast("Simulation cancelled.");
  };

  // Sync countdown number in preview with settings
  useEffect(() => {
    if (!isSimulating) {
      if (activeMode === "photo") setCountdownValue(photoSettings.before1);
      if (activeMode === "gif") setCountdownValue(gifSettings.before1);
      if (activeMode === "boomerang") setCountdownValue(boomSettings.countdown);
      if (activeMode === "video") setCountdownValue(videoSettings.countdown1);
    }
  }, [activeMode, photoSettings.before1, gifSettings.before1, boomSettings.countdown, videoSettings.countdown1, isSimulating]);

  return (
    <div className="bg-[#1b1b1b] text-gray-200 font-sans h-screen flex flex-col overflow-hidden select-none">
      {/* HEADER */}
      <header className="bg-[#232323] border-b border-[#444] px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 z-20">
        <div className="flex items-center gap-4">
          <h1 className="text-base font-bold uppercase tracking-wider font-display">Screen Editor</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setEditorTab("ai")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition ${
                editorTab === "ai" ? "bg-[#8e24aa] text-white shadow-md" : "bg-[#4a4a4a] text-gray-300 hover:bg-[#555]"
              }`}
            >
              <Sparkles size={14} />
              LAUNCH SCREEN BOOTH AI
            </button>
            <button
              onClick={() => setEditorTab("konven")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition ${
                editorTab === "konven" ? "bg-[#8e24aa] text-white shadow-md" : "bg-[#4a4a4a] text-gray-300 hover:bg-[#555]"
              }`}
            >
              <Camera size={14} />
              CAPTURE SCREEN KONVENSIONAL
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={startSimulation}
            disabled={isSimulating}
            className="flex items-center gap-1.5 bg-[#8e24aa] hover:bg-purple-600 disabled:opacity-50 text-white text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded shadow transition"
          >
            {isSimulating ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
            Test Capture
          </button>
          <button onClick={() => window.location.reload()} className="bg-[#3a3a3a] hover:bg-[#4a4a4a] text-gray-300 p-1.5 rounded border border-[#444] transition">
            <RotateCcw size={14} />
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        {/* SIDEBAR */}
        <aside
          className={`bg-[#2b2b2b] border-r border-[#444] flex flex-col transition-all duration-300 z-10 relative ${
            sidebarOpen ? "w-full md:w-[340px] lg:w-[370px]" : "w-0 overflow-hidden"
          }`}
        >
          <div className="bg-[#252525] py-2.5 px-4 border-b border-[#444] flex items-center justify-center gap-2 text-xs font-bold tracking-widest text-gray-200 uppercase font-display">
            <Settings size={14} className="text-purple-400" />
            SETTINGS
          </div>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden md:flex items-center justify-center w-6 h-6 rounded-full bg-[#3a3a3a] border border-[#444] text-gray-300 hover:text-white absolute -right-3 top-12 z-30 shadow-md"
          >
            {sidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
          </button>

          <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
            {/* Capture Screen Settings */}
            <div className="space-y-3.5 pb-4 border-b border-[#444]">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-100">Capture Screen Settings</h2>
              
              {/* Switches */}
              {[
                { label: "Show live view", desc: "Display video preview during countdown", val: showLive, set: setShowLive },
                { label: "Crop live view", desc: "Match template aspect ratio", val: cropLive, set: setCropLive },
                { label: "Mirror live view", desc: "Mirror guest movement", val: mirrorLive, set: setMirrorLive },
                { label: "Auto trigger camera", desc: "Capture photo at end of countdown", val: autoTrigger, set: setAutoTrigger },
                { label: "Flash screen white", desc: "White flash before capture", val: flashWhite, set: setFlashWhite },
                { label: "Cancel button", desc: "Show cancel button during capture", val: cancelBtn, set: setCancelBtn },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-semibold uppercase tracking-wide text-gray-200">{item.label}</div>
                    <div className="text-[10px] text-gray-400">{item.desc}</div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => item.set(!item.val)}
                      className={`w-8 h-4 rounded-full relative transition-colors ${item.val ? "bg-[#8e24aa]" : "bg-gray-600"}`}
                    >
                      <div className={`absolute top-[2px] w-3 h-3 bg-white rounded-full transition-all ${item.val ? "left-4" : "left-[2px]"}`} />
                    </button>
                    <span className="text-[10px] font-semibold uppercase w-5 text-gray-300">{item.val ? "On" : "Off"}</span>
                  </div>
                </div>
              ))}

              <div className="space-y-1">
                <label className="block font-semibold uppercase tracking-wide text-gray-200">Live view rotation</label>
                <select
                  value={rotation}
                  onChange={(e) => setRotation(e.target.value)}
                  className="w-full bg-[#383838] border border-[#444] rounded px-2.5 py-1.5 text-gray-200 uppercase font-medium focus:outline-none"
                >
                  <option value="0">0 degrees</option>
                  <option value="90">90 degrees</option>
                  <option value="180">180 degrees</option>
                  <option value="270">270 degrees</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-semibold uppercase tracking-wide text-gray-200">Countdown color</span>
                <input
                  type="color"
                  value={countdownColor}
                  onChange={(e) => setCountdownColor(e.target.value)}
                  className="w-12 h-6 rounded border border-[#444] bg-transparent cursor-pointer"
                />
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold uppercase tracking-wide text-gray-200">Photo thumbnails</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setThumbnails(!thumbnails)}
                      className={`w-8 h-4 rounded-full relative transition-colors ${thumbnails ? "bg-[#8e24aa]" : "bg-gray-600"}`}
                    >
                      <div className={`absolute top-[2px] w-3 h-3 bg-white rounded-full transition-all ${thumbnails ? "left-4" : "left-[2px]"}`} />
                    </button>
                    <span className="text-[10px] font-semibold uppercase w-5 text-gray-300">{thumbnails ? "On" : "Off"}</span>
                  </div>
                </div>
                <select
                  value={thumbPos}
                  onChange={(e) => setThumbPos(e.target.value as any)}
                  className="w-full bg-[#383838] border border-[#444] rounded px-2.5 py-1.5 text-gray-200 uppercase font-medium focus:outline-none"
                >
                  <option value="bottom">Bottom</option>
                  <option value="top">Top</option>
                </select>
              </div>
            </div>

            {/* Active Mode Selector */}
            <div className="bg-[#232323] rounded-lg p-3 border border-[#444]">
              <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2.5 text-center">Active Capture Mode</div>
              <div className="grid grid-cols-4 gap-2 text-center">
                {[
                  { id: "photo", icon: Camera, label: "Photo", sub: "Instant print" },
                  { id: "gif", icon: Images, label: "GIF", sub: "Animated" },
                  { id: "boomerang", icon: InfinityIcon, label: "Boomerang", sub: "Mini video" },
                  { id: "video", icon: Video, label: "Video", sub: "Clip" },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => modesEnabled[m.id as CaptureMode] && setActiveMode(m.id as CaptureMode)}
                    className={`flex flex-col items-center group transition ${!modesEnabled[m.id as CaptureMode] ? "opacity-30 pointer-events-none" : ""}`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition ${activeMode === m.id ? "bg-white text-gray-900 ring-2 ring-[#8e24aa]" : "bg-white text-gray-900"}`}>
                      <m.icon size={20} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white mt-1.5">{m.label}</span>
                    <span className="text-[8px] text-gray-400 leading-tight mt-0.5">{m.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Accordion Sections: Photo, GIF, etc. */}
            {(["photo", "gif", "boomerang", "video"] as const).map((mode) => (
              <div key={mode} className="pb-3 border-b border-[#444]">
                <div className="flex items-center justify-between py-1">
                  <button onClick={() => toggleAccordion(mode)} className="flex items-center gap-1.5 text-left group">
                    <ChevronDown size={16} className={`text-gray-400 transition-transform ${accordions[mode] ? "" : "-rotate-90"}`} />
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-100 group-hover:text-purple-400 transition">
                      {mode === "video" ? "Video/360" : mode.toUpperCase()}
                    </h3>
                  </button>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => toggleCaptureMode(mode, !modesEnabled[mode])}
                      className={`w-8 h-4 rounded-full relative transition-colors ${modesEnabled[mode] ? "bg-[#8e24aa]" : "bg-gray-600"}`}
                    >
                      <div className={`absolute top-[2px] w-3 h-3 bg-white rounded-full transition-all ${modesEnabled[mode] ? "left-4" : "left-[2px]"}`} />
                    </button>
                    <span className="text-[10px] font-semibold uppercase w-5 text-gray-300">{modesEnabled[mode] ? "On" : "Off"}</span>
                  </div>
                </div>

                {accordions[mode] && modesEnabled[mode] && (
                  <div className="space-y-2.5 pt-2.5 pl-1 animate-in slide-in-from-top-1 duration-200">
                    {mode === "photo" && (
                      <>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-gray-300 w-28 shrink-0 font-medium uppercase text-[11px]">Before photo 1</span>
                          <input
                            type="range"
                            min="1"
                            max="15"
                            value={photoSettings.before1}
                            onChange={(e) => setPhotoSettings((p) => ({ ...p, before1: parseInt(e.target.value) }))}
                            className="flex-1 accent-purple-600"
                          />
                          <div className="flex items-center gap-1">
                            <input type="number" value={photoSettings.before1} readOnly className="w-10 bg-[#383838] border border-[#444] rounded px-1 py-0.5 text-center text-gray-200" />
                            <span className="text-gray-400 text-[10px] uppercase">sec</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-gray-300 w-28 shrink-0 font-medium uppercase text-[11px]">Other photos</span>
                          <input
                            type="range"
                            min="1"
                            max="15"
                            value={photoSettings.beforeOther}
                            onChange={(e) => setPhotoSettings((p) => ({ ...p, beforeOther: parseInt(e.target.value) }))}
                            className="flex-1 accent-purple-600"
                          />
                          <div className="flex items-center gap-1">
                            <input type="number" value={photoSettings.beforeOther} readOnly className="w-10 bg-[#383838] border border-[#444] rounded px-1 py-0.5 text-center text-gray-200" />
                            <span className="text-gray-400 text-[10px] uppercase">sec</span>
                          </div>
                        </div>
                      </>
                    )}
                    {/* Add other mode settings as needed from HTML... */}
                    <div className="flex items-center gap-2 pt-1">
                        <span className="text-gray-300 font-medium uppercase text-[11px]">Overlay PNG</span>
                        <button className="px-3 py-0.5 rounded-full border border-purple-400 text-purple-300 text-[10px] font-semibold uppercase hover:bg-purple-900/40">Choose</button>
                        <Trash2 size={14} className="text-gray-500 hover:text-red-400 cursor-pointer" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>

        {/* PREVIEW CANVAS */}
        <main className="flex-1 bg-[#1e1e1e] flex flex-col relative overflow-hidden">
          <div className="p-4 flex justify-end items-center gap-4 z-10">
            <div className="flex flex-col items-end gap-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-300">Aspect Ratio</span>
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
                className="bg-[#333] border border-[#444] rounded px-2.5 py-1 text-xs font-semibold text-gray-200 focus:outline-none"
              >
                <option value="9:16">9:16</option>
                <option value="3:4">3:4</option>
                <option value="1:1">1:1</option>
                <option value="16:9">16:9</option>
              </select>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-300">Orientation</span>
              <div className="flex items-center bg-[#333] border border-[#444] rounded p-0.5">
                <button
                  onClick={() => setOrientation("landscape")}
                  className={`p-1.5 rounded transition ${orientation === "landscape" ? "bg-[#8e24aa] text-white" : "text-gray-400"}`}
                >
                  <div className="w-4 h-2.5 border border-current rounded-[1px]"></div>
                </button>
                <button
                  onClick={() => setOrientation("portrait")}
                  className={`p-1.5 rounded transition ${orientation === "portrait" ? "bg-[#8e24aa] text-white" : "text-gray-400"}`}
                >
                  <div className="w-2.5 h-4 border border-current rounded-[1px]"></div>
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center p-4">
            {/* Booth Screen Container */}
            <div
              className={`bg-[#0d0d0d] border border-gray-600 shadow-2xl relative flex flex-col justify-between transition-all duration-300 overflow-hidden ${
                orientation === "portrait" ? "w-[310px] h-[550px]" : "w-[550px] h-[310px]"
              }`}
            >
              {/* White Flash */}
              <div className={`absolute inset-0 bg-white z-50 pointer-events-none transition-opacity duration-500 ${flashActive ? "opacity-100" : "opacity-0"}`} />

              <div className="p-3 flex items-start justify-between z-20">
                {cancelBtn && (
                  <button onClick={cancelSimulation} className="text-white/80 hover:text-white p-1">
                    <X size={20} />
                  </button>
                )}
              </div>

              {/* Live View Area */}
              <div
                className={`relative my-auto w-full bg-neutral-800 flex items-center justify-center transition-all duration-300 ${
                  aspectRatio === "9:16" ? "aspect-[9/16]" : aspectRatio === "3:4" ? "aspect-[3/4]" : "aspect-square"
                }`}
              >
                {showLive && (
                  <img
                    src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80"
                    className={`w-full h-full transition-all duration-300 ${cropLive ? "object-cover" : "object-contain"} ${
                      mirrorLive ? "-scale-x-100" : ""
                    }`}
                    style={{ transform: `${mirrorLive ? "scaleX(-1)" : ""} rotate(${rotation}deg)` }}
                  />
                )}

                {sayCheeseActive && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
                    <span className="text-white font-display font-bold text-lg tracking-widest uppercase animate-pulse">SAY CHEESE! 📸</span>
                  </div>
                )}

                {!sayCheeseActive && (
                  <div
                    onClick={startSimulation}
                    className="absolute z-20 w-16 h-16 rounded-full border-2 flex items-center justify-center cursor-pointer hover:scale-105 transition bg-black/20 backdrop-blur-[1px]"
                    style={{ borderColor: countdownColor }}
                  >
                    <span className="text-3xl font-display font-semibold" style={{ color: countdownColor }}>
                      {countdownValue}
                    </span>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {thumbnails && (
                <div className={`p-2.5 grid grid-cols-3 gap-2 z-20 transition-all ${thumbPos === "top" ? "order-first" : ""}`}>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-14 bg-[#333] rounded-sm flex items-center justify-center text-white text-xs font-bold overflow-hidden border border-white/10">
                      {capturedThumbs[i - 1] ? (
                        <img src={capturedThumbs[i - 1]} className={`w-full h-full object-cover ${mirrorLive ? "-scale-x-100" : ""}`} />
                      ) : (
                        i
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* TOAST */}
      <div
        className={`fixed bottom-4 right-4 bg-[#333] border border-[#8e24aa] text-white text-xs px-4 py-2.5 rounded shadow-xl transition-all duration-300 z-50 flex items-center gap-2 ${
          toast.visible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
        }`}
      >
        <Info size={16} className="text-purple-400" />
        <span className="font-medium">{toast.msg}</span>
      </div>
    </div>
  );
}
