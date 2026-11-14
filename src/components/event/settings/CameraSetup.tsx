"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ChevronLeft,
  Plug,
  PlugZap,
  User,
  Glasses,
  Star,
  Camera,
  Microchip,
  BatteryFull,
  ChevronDown,
  CircleCheck,
} from "lucide-react";

interface CameraModel {
  model: string;
  shutterCount: number;
  battery: number;
  firmware: string;
  shutterIdx: number;
  apertureIdx: number;
  isoIdx: number;
}

const CAMERAS_DB: CameraModel[] = [
  { model: "Nikon Corporation D7000", shutterCount: 14820, battery: 92, firmware: "v1.04", shutterIdx: 3, apertureIdx: 3, isoIdx: 4 },
  { model: "Canon EOS 80D DSLR", shutterCount: 8940, battery: 85, firmware: "v2.01", shutterIdx: 4, apertureIdx: 2, isoIdx: 2 },
  { model: "Nikon D850 Full Frame", shutterCount: 23110, battery: 100, firmware: "v1.20", shutterIdx: 5, apertureIdx: 1, isoIdx: 1 },
];

const SHUTTER_SPEEDS = ["1/4", "1/15", "1/30", "1/60", "1/125", "1/250", "1/500", "1/1000", "1/4000"];
const SHUTTER_EV_VALUES = [-3, -2, -1, 0, 1, 2, 3, 4, 5];

const APERTURES = ["1.8", "2.8", "3.5", "4.0", "5.6", "8.0", "11", "16"];
const APERTURE_EV_VALUES = [3, 2, 1, 0, -1, -2, -3, -4];
const APERTURE_BLUR_VALUES = [12, 8, 5, 3, 1, 0, 0, 0];

const ISO_VALUES = ["100", "200", "400", "800", "1600", "3200", "6400"];
const ISO_EV_VALUES = [-3, -2, -1, 0, 1, 2, 3];

const WB_PROFILES: Record<string, { color: string; label: string }> = {
  flash: { color: "rgba(255, 250, 240, 0.05)", label: "Flash (5500K)" },
  auto: { color: "rgba(0, 0, 0, 0)", label: "Auto (AWB)" },
  daylight: { color: "rgba(255, 240, 200, 0.08)", label: "Daylight (5200K)" },
  cloudy: { color: "rgba(255, 210, 150, 0.15)", label: "Cloudy (6000K)" },
  tungsten: { color: "rgba(100, 180, 255, 0.2)", label: "Tungsten (3200K)" },
  fluorescent: { color: "rgba(150, 255, 200, 0.12)", label: "Fluorescent (4000K)" },
};

export default function CameraSetup() {
  const [isCameraConnected, setIsCameraConnected] = useState<boolean>(false);
  const [connectedCamera, setConnectedCamera] = useState<CameraModel | null>(null);

  const [shutterIdx, setShutterIdx] = useState<number>(3);
  const [apertureIdx, setApertureIdx] = useState<number>(3);
  const [isoIdx, setIsoIdx] = useState<number>(4);

  const [wbMode, setWbMode] = useState<string>("flash");
  const [rotationDeg, setRotationDeg] = useState<string>("0");
  const [isMirrored, setIsMirrored] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"photo" | "video">("photo");

  const [ptpStatus, setPtpStatus] = useState<string>("PTP/IP Engine: Idle");
  const [toast, setToast] = useState<{ title: string; message: string; visible: boolean }>({
    title: "",
    message: "",
    visible: false,
  });

  const [doFlash, setDoFlash] = useState<boolean>(false);
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = (title: string, message: string) => {
    setToast({ title, message, visible: true });
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 3000);
  };

  const connectDSLRHardware = () => {
    const randomCam = CAMERAS_DB[Math.floor(Math.random() * CAMERAS_DB.length)];
    // Clone camera state with mutable count
    const camCopy = { ...randomCam };
    setConnectedCamera(camCopy);
    setIsCameraConnected(true);
    setShutterIdx(camCopy.shutterIdx);
    setApertureIdx(camCopy.apertureIdx);
    setIsoIdx(camCopy.isoIdx);
    setPtpStatus("PTP/IP Engine: Syncing Live View Stream (30fps)");
    showToast("DSLR Connected!", `${camCopy.model} bound successfully. SC: ${camCopy.shutterCount} shots.`);
  };

  const disconnectDSLRHardware = () => {
    setIsCameraConnected(false);
    setConnectedCamera(null);
    setPtpStatus("PTP/IP Engine: Idle");
    showToast("DSLR Disconnected", "Camera cable removed. Photobooth controls locked.");
  };

  const toggleCable = () => {
    if (isCameraConnected) {
      disconnectDSLRHardware();
    } else {
      showToast("Hardware Sensing...", "Detecting USB PTP/IP Device...");
      setTimeout(connectDSLRHardware, 500);
    }
  };

  useEffect(() => {
    // Initial mount auto-connect simulation
    const timer = setTimeout(() => {
      connectDSLRHardware();
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Calculate Exposure
  const ev = SHUTTER_EV_VALUES[shutterIdx] + APERTURE_EV_VALUES[apertureIdx] + ISO_EV_VALUES[isoIdx];
  const evFormatted = (ev >= 0 ? "+" : "") + (ev * 0.5).toFixed(1);

  let exposureBg = "rgba(0,0,0,0)";
  let exposureStatus = "Optimal Exposure";
  let exposureTextColor = "text-green-400";

  if (ev < 0) {
    const opacity = Math.min(Math.abs(ev) * 0.18, 0.85);
    exposureBg = `rgba(0, 0, 0, ${opacity})`;
    exposureStatus = ev < -4 ? "Severely Underexposed" : "Underexposed";
    exposureTextColor = "text-amber-400";
  } else if (ev > 0) {
    const opacity = Math.min(ev * 0.15, 0.85);
    exposureBg = `rgba(255, 255, 255, ${opacity})`;
    exposureStatus = ev > 4 ? "Severely Overexposed" : "Overexposed";
    exposureTextColor = "text-amber-400";
  }

  const blurAmount = APERTURE_BLUR_VALUES[apertureIdx];

  const handleTakePhoto = () => {
    if (!isCameraConnected || !connectedCamera) {
      showToast("Error", "No camera connected! Please plug in DSLR cable first.");
      return;
    }

    connectedCamera.shutterCount += 1;
    setConnectedCamera({ ...connectedCamera });

    setDoFlash(true);
    setTimeout(() => setDoFlash(false), 400);

    // Play beep/shutter sound
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(120, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);
    } catch {
      // AudioContext fallback
    }

    showToast("Shutter Triggered!", `Photo saved to Photobooth gallery. SC: ${connectedCamera.shutterCount}`);
  };

  const handleWizard = () => {
    if (!isCameraConnected) {
      showToast("Notice", "Plugging in camera cable automatically to run wizard...");
      connectDSLRHardware();
    }
    showToast("DSLR Wizard", "Auto-detecting optimal photobooth lighting conditions...");
    setTimeout(() => {
      setShutterIdx(4); // 1/125
      setApertureIdx(5); // f/8.0
      setIsoIdx(2); // ISO 400
      setWbMode("flash");
      showToast("Wizard Applied", "Optimal Photobooth Flash settings applied (1/125, f/8, ISO 400).");
    }, 600);
  };

  return (
    <div className="text-gray-200 h-screen overflow-hidden flex flex-col font-['Inter',sans-serif] select-none">
      {/* Flash Overlay for Test Photo */}
      <div
        className={`absolute inset-0 pointer-events-none z-50 transition-opacity duration-300 ${
          doFlash ? "opacity-100 bg-white animate-pulse" : "opacity-0 bg-transparent"
        }`}
      />

      {/* Top Header Navigation Bar */}
      <header className="h-14 border-b border-[#3a3b3c] flex items-center justify-between px-6 z-10">
        <button
          onClick={() => showToast("Navigation", "Returning to main capture settings...")}
          className="text-gray-400 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 font-bold" />
          <span>Capture Settings</span>
        </button>

        <h1 className="text-white text-base font-semibold tracking-wide">Camera Settings</h1>

        <div className="w-auto flex justify-end gap-3 items-center">
          <button
            onClick={toggleCable}
            className="text-xs px-3 py-1 rounded bg-[#3a3b3c] hover:bg-[#48494b] text-gray-200 border border-gray-600 flex items-center gap-2 font-medium transition-all active:scale-95 cursor-pointer"
          >
            {isCameraConnected ? <PlugZap className="w-3.5 h-3.5 text-green-400" /> : <Plug className="w-3.5 h-3.5 text-gray-400" />}
            <span>{isCameraConnected ? "Disconnect Cable" : "Plug-in DSLR Cable"}</span>
          </button>

          <span
            className={`text-xs px-2.5 py-1 rounded border flex items-center gap-1.5 font-medium transition-all ${
              isCameraConnected
                ? "bg-green-950 text-green-400 border-green-800"
                : "bg-red-950 text-red-400 border-red-800"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isCameraConnected ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
            <span>{isCameraConnected ? "Connected" : "Disconnected"}</span>
          </span>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Controls Left */}
        <aside className="w-80 border-r border-[#3a3b3c] flex flex-col justify-between overflow-y-auto">
          <div className="p-5 space-y-6">
            {/* Camera Info & Mode */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-white text-sm font-semibold tracking-wide">
                  {connectedCamera ? connectedCamera.model : "No Camera Detected"}
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {connectedCamera ? "DSLR Live Direct USB (PTP/IP Active)" : "Please connect USB Cable"}
                </p>
              </div>
              <div
                className={`w-9 h-9 border-2 rounded flex items-center justify-center font-bold text-base shadow-sm bg-[#18191a]/40 transition-colors ${
                  isCameraConnected ? "border-white/90 text-white" : "border-white/30 text-gray-500"
                }`}
              >
                M
              </div>
            </div>

            {/* Hardware Diagnostic Stats Panel */}
            {isCameraConnected && connectedCamera && (
              <div className="bg-[#18191a] p-3 rounded border border-[#3a3b3c] space-y-2 text-xs font-mono">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Shutter Count (SC):</span>
                  <span className="text-blue-400 font-bold">{connectedCamera.shutterCount.toLocaleString()} shots</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Battery Level:</span>
                  <span className="text-green-400 font-bold flex items-center">
                    <BatteryFull className="w-3.5 h-3.5 mr-1 text-green-400" /> {connectedCamera.battery}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Firmware:</span>
                  <span className="text-gray-300">{connectedCamera.firmware} (PTP/IP)</span>
                </div>
              </div>
            )}

            {/* Tabs (Photo / Video & Boomerang) */}
            <div className="border-b border-[#3a3b3c] flex gap-6 text-xs font-semibold">
              <button
                onClick={() => {
                  setActiveTab("photo");
                  showToast("Mode Switched", "Switched to Photo Mode");
                }}
                className={`pb-2.5 uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "photo" ? "text-white border-b-2 border-white" : "text-gray-500 hover:text-gray-300"
                }`}
              >
                PHOTO
              </button>
              <button
                onClick={() => {
                  setActiveTab("video");
                  showToast("Mode Switched", "Switched to Video & Boomerang Mode");
                }}
                className={`pb-2.5 uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "video" ? "text-white border-b-2 border-white" : "text-gray-500 hover:text-gray-300"
                }`}
              >
                VIDEO & BOOMERANG
              </button>
            </div>

            {/* Control Sliders & Dropdowns */}
            <div className="space-y-5">
              {/* Shutter Speed */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <label className="text-gray-300 font-medium">Shutter Speed</label>
                  <span className="text-white font-mono font-semibold">{SHUTTER_SPEEDS[shutterIdx]}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={SHUTTER_SPEEDS.length - 1}
                  step="1"
                  value={shutterIdx}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setShutterIdx(val);
                    if (isCameraConnected) setPtpStatus(`PTP Command: Shutter set to ${SHUTTER_SPEEDS[val]}`);
                  }}
                  className="w-full accent-[#0088ff] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                  <span>1/4</span>
                  <span>1/250</span>
                  <span>1/4000</span>
                </div>
              </div>

              {/* Aperture */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <label className="text-gray-300 font-medium">Aperture</label>
                  <span className="text-white font-mono font-semibold">f/{APERTURES[apertureIdx]}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={APERTURES.length - 1}
                  step="1"
                  value={apertureIdx}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setApertureIdx(val);
                    if (isCameraConnected) setPtpStatus(`PTP Command: Aperture set to f/${APERTURES[val]}`);
                  }}
                  className="w-full accent-[#0088ff] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                  <span>f/1.8</span>
                  <span>f/5.6</span>
                  <span>f/16</span>
                </div>
              </div>

              {/* ISO */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <label className="text-gray-300 font-medium">ISO</label>
                  <span className="text-white font-mono font-semibold">{ISO_VALUES[isoIdx]}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={ISO_VALUES.length - 1}
                  step="1"
                  value={isoIdx}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setIsoIdx(val);
                    if (isCameraConnected) setPtpStatus(`PTP Command: ISO set to ${ISO_VALUES[val]}`);
                  }}
                  className="w-full accent-[#0088ff] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                  <span>100</span>
                  <span>800</span>
                  <span>6400</span>
                </div>
              </div>

              {/* White Balance */}
              <div className="space-y-1.5">
                <label className="text-xs text-gray-300 font-medium block">White Balance</label>
                <div className="relative">
                  <select
                    value={wbMode}
                    onChange={(e) => {
                      const val = e.target.value;
                      setWbMode(val);
                      const profile = WB_PROFILES[val] || WB_PROFILES["auto"];
                      showToast("White Balance Updated", profile.label);
                    }}
                    className="w-full bg-[#18191a] border border-[#3a3b3c] rounded px-3 py-2 text-xs text-white appearance-none focus:outline-none focus:border-[#0088ff] cursor-pointer pr-8"
                  >
                    <option value="flash">Flash (5500K)</option>
                    <option value="auto">Auto (AWB)</option>
                    <option value="daylight">Daylight (5200K)</option>
                    <option value="cloudy">Cloudy (6000K)</option>
                    <option value="tungsten">Tungsten (3200K)</option>
                    <option value="fluorescent">Fluorescent (4000K)</option>
                  </select>
                  <div className="absolute right-3 top-2.5 pointer-events-none text-gray-400 text-xs">
                    <ChevronDown className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              <hr className="border-[#3a3b3c] my-2" />

              {/* Mirror Live View Toggle */}
              <div className="flex items-center justify-between py-1">
                <span className="text-xs text-gray-300 font-medium">Mirror Live View</span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={isMirrored}
                      onChange={(e) => setIsMirrored(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-9 h-5 rounded-full transition-colors duration-200 ${isMirrored ? "bg-[#0088ff]" : "bg-[#3a3b3c]"}`} />
                    <div
                      className={`absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform duration-200 ${
                        isMirrored ? "transform translate-x-4" : ""
                      }`}
                    />
                  </div>
                  <span className="text-xs text-white font-medium w-6">{isMirrored ? "On" : "Off"}</span>
                </label>
              </div>

              {/* Rotation Selector */}
              <div className="space-y-1.5">
                <label className="text-xs text-gray-300 font-medium block">Rotation</label>
                <div className="relative">
                  <select
                    value={rotationDeg}
                    onChange={(e) => {
                      const deg = e.target.value;
                      setRotationDeg(deg);
                      showToast("Camera Rotation", `Live view rotated to ${deg}°`);
                    }}
                    className="w-full bg-[#18191a] border border-[#3a3b3c] rounded px-3 py-2 text-xs text-white appearance-none focus:outline-none focus:border-[#0088ff] cursor-pointer pr-8"
                  >
                    <option value="0">0 degrees</option>
                    <option value="90">90 degrees (Portrait Right)</option>
                    <option value="180">180 degrees (Inverted)</option>
                    <option value="270">270 degrees (Portrait Left)</option>
                  </select>
                  <div className="absolute right-3 top-2.5 pointer-events-none text-gray-400 text-xs">
                    <ChevronDown className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Wizard Button Bottom Sidebar */}
          <div className="p-5 border-t border-[#3a3b3c]">
            <button
              onClick={handleWizard}
              className="w-full border border-gray-400 hover:border-white text-gray-200 hover:text-white rounded-full py-2 text-xs font-medium transition-all duration-200 hover:bg-white/5 active:scale-[0.98] cursor-pointer"
            >
              DSLR Camera Wizard
            </button>
          </div>
        </aside>

        {/* Right Preview & Live View Area */}
        <main className="flex-1 relative flex flex-col justify-between items-center p-6 overflow-hidden">
          {/* Live View Screen / Viewfinder Container */}
          <div className="flex-1 w-full flex items-center justify-center relative min-h-0">
            <div className="relative w-full max-w-4xl h-full max-h-[75vh] bg-black rounded-lg overflow-hidden shadow-2xl border border-white/10 flex items-center justify-center">
              {/* Simulated Live View Canvas Scene */}
              <div
                className="relative w-full h-full flex items-center justify-center overflow-hidden transition-transform duration-300"
                style={{
                  transform: `rotate(${rotationDeg}deg)`,
                  filter: isMirrored ? "scaleX(-1)" : "scaleX(1)",
                }}
              >
                {/* Background Environment */}
                <div
                  className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-purple-950 to-slate-800 transition-all duration-300 flex items-center justify-center"
                  style={{ filter: `blur(${blurAmount}px)` }}
                >
                  <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-pink-500/20 blur-xl" />
                  <div className="absolute bottom-12 right-20 w-48 h-48 rounded-full bg-blue-500/20 blur-2xl" />
                  <div className="absolute top-1/3 right-1/4 w-24 h-24 rounded-full bg-amber-400/20 blur-lg" />
                </div>

                {/* Main Subject */}
                <div className="relative z-10 flex flex-col items-center justify-center transition-all duration-300">
                  <div className="relative">
                    <div className="w-48 h-48 md:w-56 md:h-56 rounded-full bg-gradient-to-b from-amber-200 to-amber-500 flex items-center justify-center shadow-2xl border-4 border-white/20 overflow-hidden relative">
                      <User className="w-24 h-24 text-slate-900/80" />
                      <div className="absolute top-14 text-slate-900 text-4xl">
                        <Glasses className="w-10 h-10" />
                      </div>
                    </div>
                    <div className="absolute -top-3 -right-3 text-3xl text-yellow-400 animate-bounce">
                      <Star className="w-8 h-8 fill-yellow-400" />
                    </div>
                    <div className="absolute -bottom-2 -left-2 text-2xl text-pink-400">
                      <Camera className="w-6 h-6" />
                    </div>
                  </div>

                  <span className="mt-4 px-3 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-mono rounded-full border border-white/20">
                    Photobooth Model Frame
                  </span>
                </div>

                {/* Live View Exposure Overlay */}
                <div
                  className="absolute inset-0 pointer-events-none transition-all duration-150"
                  style={{ backgroundColor: exposureBg }}
                />

                {/* White Balance Tint Overlay */}
                <div
                  className="absolute inset-0 pointer-events-none transition-all duration-300"
                  style={{ backgroundColor: WB_PROFILES[wbMode]?.color || "transparent" }}
                />

                {/* Camera Grid Overlay (Rule of Thirds) */}
                <div className="absolute inset-0 border border-white/10 pointer-events-none grid grid-cols-3 grid-rows-3">
                  <div className="border-r border-b border-white/10" />
                  <div className="border-r border-b border-white/10" />
                  <div className="border-b border-white/10" />
                  <div className="border-r border-b border-white/10" />
                  <div className="border-r border-b border-white/10" />
                  <div className="border-b border-white/10" />
                  <div className="border-r border-white/10" />
                  <div className="border-r border-white/10" />
                  <div />
                </div>

                {/* Focus Rectangle Center */}
                <div className="absolute w-20 h-20 border border-green-400/70 rounded pointer-events-none flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                </div>

                {/* On-Screen Exposure Indicator Meter */}
                <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded text-[11px] font-mono text-white flex items-center gap-3 border border-white/10">
                  <div>
                    EV: <span className={`${exposureTextColor} font-bold`}>{evFormatted}</span>
                  </div>
                  <div className="text-gray-400">|</div>
                  <div className={exposureTextColor}>{exposureStatus}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Center Action Bar */}
          <div className="w-full flex justify-between items-center mt-4 px-6 max-w-4xl">
            <div className="text-xs text-gray-400 flex items-center gap-2">
              <Microchip className="w-4 h-4 text-blue-400" />
              <span>{ptpStatus}</span>
            </div>
            <button
              onClick={handleTakePhoto}
              disabled={!isCameraConnected}
              className={`font-medium text-sm px-8 py-2.5 rounded-full shadow-lg transition-all flex items-center gap-2 ${
                isCameraConnected
                  ? "bg-[#0088ff] hover:bg-[#0077ee] text-white hover:shadow-blue-500/25 active:scale-95 cursor-pointer"
                  : "bg-gray-700 text-gray-400 cursor-not-allowed opacity-60"
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Take test photo</span>
            </button>
          </div>
        </main>
      </div>

      {/* Notification Toast Modal */}
      <div
        className={`fixed top-16 right-6 bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded-lg shadow-xl transition-all duration-300 z-50 flex items-center gap-3 ${
          toast.visible ? "translate-y-0 opacity-100" : "translate-y-[-100px] opacity-0"
        }`}
      >
        <CircleCheck className="text-blue-400 w-5 h-5 flex-shrink-0" />
        <div>
          <div className="text-xs font-bold">{toast.title}</div>
          <div className="text-xs text-gray-300">{toast.message}</div>
        </div>
      </div>
    </div>
  );
}