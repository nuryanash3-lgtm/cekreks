"use client";

import { useState, useEffect } from "react";
import { Monitor, Smartphone, Sparkles, MessageSquare, UserCheck, Download, Video } from "lucide-react";

interface LivePreviewOverlayProps {
  // Properti untuk Booth Identity & Output
  previewMode: "portrait" | "landscape";
  setPreviewMode: (mode: "portrait" | "landscape") => void;
  selectedBackground?: string;
  overlayUrl?: string;
  eventName?: string;
  eventDesc?: string;
  outputRatio?: string; // <-- Tambahan prop untuk rasio dinamis (9:16, 16:9, 2:3, dll)

  // Properti khusus untuk Guest Download Page (Opsional)
  activeTab?: string; // "identity", "output", "guest", dll.
  headerText?: string;
  subText?: string;
  welcomeEnabled?: boolean;
  popupMessage?: string;
  popupButtonText?: string;
  bgClass?: string;
  customBgUrl?: string | null;
  customBgType?: 'image' | 'video' | null;
  originalPhotoEnabled?: boolean;
  dlPhotoText?: string;
  dlVideoText?: string;
  layoutStyle?: 'neon' | 'minimal';
  orientation?: 'portrait' | 'landscape';
  onOrientationChange?: (mode: 'portrait' | 'landscape') => void;
  onDownload?: (type: 'Photo' | 'Video') => void;
}

export default function LivePreviewOverlay({
  previewMode,
  setPreviewMode,
  selectedBackground = "tpl-hex",
  overlayUrl = "",
  eventName = "ARTBOOTH",
  eventDesc = "Semua bisa mengekspresikan disini",
  outputRatio = "2:3", // Default rasio
  activeTab = "identity",
  headerText = "YOUR DIGITAL ART",
  subText = "COROAI PHOTOBOOTH",
  welcomeEnabled = true,
  popupMessage = "Thank you for attending! You can now download your photos.",
  popupButtonText = "Agree & Continue",
  bgClass = "tpl-hex",
  customBgUrl = null,
  customBgType = null,
  originalPhotoEnabled = true,
  dlPhotoText = "DOWNLOAD PHOTO",
  dlVideoText = "DOWNLOAD VIDEO",
  layoutStyle = "neon",
  orientation = "portrait",
  onOrientationChange,
  onDownload,
}: LivePreviewOverlayProps) {
  const isGuestMode = activeTab === "guest";

  // State khusus interaksi Live Preview Guest Download
  const [showPopup, setShowPopup] = useState<boolean>(true);
  const [photoTab, setPhotoTab] = useState<'ai' | 'orig'>('ai');

  useEffect(() => {
    if (!welcomeEnabled) {
      setShowPopup(false);
    } else {
      setShowPopup(true);
    }
  }, [welcomeEnabled]);

  const isNeon = layoutStyle === 'neon';
  const isPortrait = isGuestMode ? orientation === 'portrait' : previewMode === 'portrait';

  // Helper untuk menentukan ukuran kotak preview secara mulus berdasarkan outputRatio
  const getDynamicPreviewStyle = () => {
    if (!isGuestMode) {
      switch (outputRatio) {
        case "9:16":
          return "w-[150px] h-[266px]"; // Portrait tinggi
        case "16:9":
          return "w-[260px] h-[146px]"; // Landscape lebar
        case "2:3":
          return "w-[180px] h-[270px]"; // Portrait 4R
        case "3:2":
          return "w-[250px] h-[166px]"; // Landscape 4R
        case "3:4":
          return "w-[180px] h-[240px]"; // 3:4 No Crop
        case "4:3":
          return "w-[240px] h-[180px]"; // 4:3 No Crop
        default:
          return previewMode === "portrait" ? "w-[200px] h-[300px]" : "w-[260px] h-[173px]";
      }
    } else {
      // Untuk Guest Mode berdasarkan orientation
      return isPortrait ? "w-[200px] h-[300px]" : "w-[260px] h-[173px]";
    }
  };

  return (
    <aside className="w-80 flex flex-col bg-[#0b061a] border border-white/10 rounded-2xl p-5 shrink-0 h-full overflow-y-auto">
      {/* Header Live Preview */}
      <div className="flex items-center justify-between mb-4 shrink-0 px-1">
        <div className="flex items-center space-x-2 text-gray-400 text-xs font-bold tracking-wider">
          <Monitor className="w-4 h-4" />
          <span>LIVE PREVIEW</span>
        </div>
        {isGuestMode && welcomeEnabled && !showPopup && (
          <button
            type="button"
            onClick={() => setShowPopup(true)}
            title="Tampilkan Welcome Popup"
            className="text-purple-300 hover:text-white transition p-1 cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Simulator Container */}
      <div className="flex-1 bg-[#130d22] border border-white/10 rounded-2xl flex flex-col items-center justify-center p-4 relative overflow-hidden shadow-inner min-h-[380px]">
        
        {/* --- TAMPILAN 1: IDENTITY & OUTPUT MODE --- */}
        {!isGuestMode && (
          <div
            className={`border border-white/10 rounded-xl p-4 flex flex-col items-center justify-between text-center relative transition-all duration-300 ease-in-out bg-cover bg-center ${selectedBackground} ${getDynamicPreviewStyle()}`}
          >
            {overlayUrl && (
              <img
                src={overlayUrl}
                alt="Custom Overlay Frame"
                className="absolute inset-0 w-full h-full object-fill pointer-events-none z-20 rounded-xl"
              />
            )}
            <div className="absolute inset-0 bg-black/40 rounded-xl z-0 pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center justify-center my-auto space-y-2">
              <h3 className="font-black tracking-widest text-white transition-all duration-300 drop-shadow-md text-sm sm:text-base">
                {eventName || "ARTBOOTH"}
              </h3>
              <p className="text-[10px] text-gray-200 max-w-[180px] drop-shadow">
                {eventDesc || "Semua bisa mengekspresikan disini"}
              </p>
              <div className="flex space-x-2 pt-1">
                <span className="bg-[#8b35ff] text-white px-2.5 py-0.5 rounded-md text-[9px] font-bold shadow">
                  LAUNCH
                </span>
                <span className="bg-black/60 text-white px-2.5 py-0.5 rounded-md text-[9px] font-bold border border-white/20 backdrop-blur-sm">
                  GALLERY
                </span>
              </div>
            </div>

            <div className="relative z-10 text-[8px] text-purple-300 font-mono tracking-wider drop-shadow">
              CORDAI IMAGE 1 • {outputRatio}
            </div>
          </div>
        )}

        {/* --- TAMPILAN 2: GUEST DOWNLOAD PAGE MODE --- */}
        {isGuestMode && (
          <div
            className={`rounded-2xl border border-purple-500/40 overflow-hidden relative transition-all duration-300 flex flex-col justify-between p-3.5 shadow-inner ${bgClass} ${getDynamicPreviewStyle()}`}
          >
            {customBgType === 'image' && customBgUrl && (
              <img src={customBgUrl} alt="Custom Background" className="absolute inset-0 w-full h-full object-cover z-0" />
            )}
            {customBgType === 'video' && customBgUrl && (
              <video src={customBgUrl} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0" />
            )}
            <div className="absolute inset-0 bg-black/45 z-0 pointer-events-none" />

            {/* Welcome Popup Overlay */}
            {welcomeEnabled && showPopup && (
              <div className="absolute inset-0 z-20 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 transition-opacity duration-200">
                <div className={`rounded-xl p-3 text-center space-y-2 w-full ${isNeon ? 'bg-[#14141c] border border-purple-500/70 shadow-[0_0_20px_rgba(168,85,247,0.4)]' : 'bg-zinc-900 border border-zinc-700'}`}>
                  <div className="w-6 h-6 rounded-full bg-purple-600/20 border border-purple-500/50 flex items-center justify-center mx-auto text-purple-400">
                    <Sparkles className="w-3 h-3" />
                  </div>
                  <p className="text-[9px] text-zinc-200 leading-tight">
                    {popupMessage || 'Thank you for attending! You can now download your photos.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowPopup(false)}
                    className="w-full py-1 px-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[9px] font-bold tracking-wide transition cursor-pointer"
                  >
                    {popupButtonText || 'Agree & Continue'}
                  </button>
                </div>
              </div>
            )}

            {/* Top Header */}
            <div className="relative z-10 text-center pt-0.5">
              <h4 className="font-cyber text-[10px] font-extrabold tracking-wider text-white uppercase drop-shadow">
                {headerText || 'YOUR DIGITAL ART'}
              </h4>
              <p className="text-[7px] tracking-widest text-purple-300/90 uppercase font-medium mt-0.5">
                {subText || 'COROAI PHOTOBOOTH'}
              </p>
            </div>

            {/* Center Photo Card Mockup */}
            <div className="relative z-10 my-auto flex flex-col items-center justify-center gap-1.5">
              <div className={`rounded-xl p-1.5 transition-all ${isPortrait ? 'w-24' : 'w-20'} ${isNeon ? 'bg-zinc-950/90 border border-purple-500/60 shadow-[0_0_15px_rgba(168,85,247,0.35)]' : 'bg-zinc-900/95 border border-zinc-700'}`}>
                <div className="flex items-center justify-between px-1 pb-0.5">
                  <span className="text-[5px] font-cyber text-zinc-300 tracking-wider">AI PHOTO</span>
                  <span className="text-[5px] px-1 rounded bg-purple-600/40 text-purple-200">
                    {photoTab === 'ai' ? 'AI' : 'ORIG'}
                  </span>
                </div>
                <div className={`w-full rounded-lg relative overflow-hidden flex items-center justify-center ${isPortrait ? 'h-14' : 'h-8'} ${photoTab === 'ai' ? 'bg-gradient-to-tr from-cyan-400 via-purple-500 to-amber-300' : 'bg-gradient-to-tr from-zinc-700 via-zinc-600 to-stone-500'}`}>
                  {photoTab === 'ai' && (
                    <>
                      <div className="absolute -bottom-3 -left-3 w-12 h-12 rounded-full bg-fuchsia-600/60 blur-md" />
                      <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-sky-400/70 blur-md" />
                    </>
                  )}
                  <UserCheck className="w-5 h-5 text-white/90 relative z-10 drop-shadow" />
                </div>

                {originalPhotoEnabled && (
                  <div className="grid grid-cols-2 gap-1 mt-1">
                    <button type="button" onClick={() => setPhotoTab('ai')} className={`py-0.5 text-[5px] font-bold rounded transition cursor-pointer ${photoTab === 'ai' ? 'bg-purple-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
                      AI
                    </button>
                    <button type="button" onClick={() => setPhotoTab('orig')} className={`py-0.5 text-[5px] font-bold rounded transition cursor-pointer ${photoTab === 'orig' ? 'bg-purple-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
                      ORIG
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Action Buttons */}
            <div className="relative z-10 space-y-1 pb-0.5">
              <button
                type="button"
                onClick={() => onDownload && onDownload('Photo')}
                className={`w-full py-1 px-2 rounded-lg text-[8px] font-bold tracking-wider uppercase flex items-center justify-center gap-1 transition cursor-pointer ${isNeon ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_0_10px_rgba(168,85,247,0.5)]' : 'bg-white text-zinc-950 rounded-md'}`}
              >
                <Download className="w-2.5 h-2.5" />
                <span>{dlPhotoText || 'DOWNLOAD PHOTO'}</span>
              </button>
              <button
                type="button"
                onClick={() => onDownload && onDownload('Video')}
                className={`w-full py-1 px-2 rounded-lg text-[8px] font-bold tracking-wider uppercase flex items-center justify-center gap-1 transition cursor-pointer ${isNeon ? 'bg-zinc-900/90 border border-purple-500/60 text-purple-200' : 'bg-zinc-800 border border-zinc-700 text-zinc-200 rounded-md'}`}
              >
                <Video className="w-2.5 h-2.5" />
                <span>{dlVideoText || 'DOWNLOAD VIDEO'}</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </aside>
  );
}