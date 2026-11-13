"use client";

import { useState } from "react";
import { 
  Settings, 
  Sparkles, 
  Image as ImageIcon, 
  Sliders, 
  Smartphone, 
  Monitor, 
  Printer, 
  Database, 
  Camera,
  CloudDownload,
  ScreenShare
} from "lucide-react";

import EventIdentity from "@/components/event/settings/EventIdentity";
import OutputOverlay from "@/components/event/settings/OutputOverlay";
import ImageModel from "@/components/event/settings/ImageModel";
import RemoteApp from "@/components/event/settings/RemoteApp";
import PrintSettings from "@/components/event/settings/PrintSettings";
import DataMaintenance from "@/components/event/settings/DataMaintenance";

export default function EventSettingsPage() {
  const [activeMenu, setActiveMenu] = useState("identity");
  const [eventName, setEventName] = useState("ARTBOOTH");
  const [eventDesc, setEventDesc] = useState("Semua bisa mengekspresikan disini");
  const [autoReset, setAutoReset] = useState(true);
  const [countdown, setCountdown] = useState("60s (Default)");
  const [previewMode, setPreviewMode] = useState<"portrait" | "landscape">("portrait");
  
  // State background & overlay diangkat ke parent agar persisten saat pindah tab
  const [selectedBackground, setSelectedBackground] = useState("tpl-hex");
  const [overlayUrl, setOverlayUrl] = useState("");
  const [overlayInfo, setOverlayInfo] = useState({ name: "custom_editor_frame.png", dimensions: "1205x1795 px" });

  const sidebarMenus = [
    { id: "identity", name: "EVENT IDENTITY & UI", icon: Sparkles },
    { id: "output", name: "OUTPUT & OVERLAY (PNG)", icon: ImageIcon },
    { id: "model", name: "IMAGE MODEL SETTINGS", icon: Sliders },
    { id: "remote", name: "REMOTE APP", icon: Smartphone },
    { id: "camera", name: "CAMERA SETUP", icon: Camera },
    { id: "screen", name: "SCREEN EDITOR", icon: ScreenShare },
    { id: "print", name: "PRINT SETTINGS", icon: Printer },
    { id: "guest", name: "GUEST DOWNLOAD PAGE", icon: CloudDownload },
    { id: "data", name: "DATA & MAINTENANCE", icon: Database },
  ];

  const getActiveTitle = () => {
    const current = sidebarMenus.find((m) => m.id === activeMenu);
    return current ? current.name : "SETTINGS";
  };

  const renderMainContent = () => {
    switch (activeMenu) {
      case "identity":
        return (
          <EventIdentity
            eventName={eventName}
            setEventName={setEventName}
            eventDesc={eventDesc}
            setEventDesc={setEventDesc}
            autoReset={autoReset}
            setAutoReset={setAutoReset}
            countdown={countdown}
            setCountdown={setCountdown}
            selectedBackground={selectedBackground}
            setSelectedBackground={setSelectedBackground}
          />
        );
      case "output":
        return (
          <OutputOverlay 
            selectedRatio={previewMode === "portrait" ? "2:3" : "16:9"}
            overlayUrl={overlayUrl}
            overlayInfo={overlayInfo}
            onOverlayApplied={(url, name, dims) => {
              setOverlayUrl(url);
              setOverlayInfo({ name, dimensions: dims });
            }}
          />
        );
      case "model":
        return <ImageModel />;
      case "remote":
        return <RemoteApp />;
      case "print":
        return <PrintSettings />;
      case "data":
        return <DataMaintenance />;
      default:
        return null;
    }
  };

  return (
    <>
      <style jsx global>{`
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        ::-webkit-scrollbar-track {
          background: #0b061a;
          border-radius: 8px;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(141, 53, 255, 0.14);
          border-radius: 8px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 53, 255, 0.6);
        }
      `}</style>

      <div className="flex h-[calc(100vh-85px)] w-full bg-[#070312] text-white px-6 pb-6 gap-6 overflow-hidden">
        
        {/* 1. SIDEBAR KIRI */}
        <aside className="w-72 flex flex-col bg-[#0b061a] border border-white/10 rounded-2xl p-4 shrink-0 h-full overflow-y-auto">
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

        {/* 2. KONTEN UTAMA TENGAH */}
        <main className="flex-1 flex flex-col bg-[#0b061a] border border-white/10 rounded-2xl p-8 h-full overflow-hidden">
          <h1 className="text-xl font-bold tracking-wider mb-6 text-white border-b border-white/10 pb-4 shrink-0">
            {getActiveTitle()}
          </h1>

          <div className="flex-1 overflow-y-auto pr-3">
            {renderMainContent()}
          </div>
        </main>

        {/* 3. KANAN: LIVE PREVIEW */}
        <aside className="w-80 flex flex-col bg-[#0b061a] border border-white/10 rounded-2xl p-5 shrink-0 h-full">
          <div className="flex items-center justify-between mb-4 shrink-0">
            <div className="flex items-center space-x-2 text-gray-400 text-xs font-bold tracking-wider">
              <Monitor className="w-4 h-4" />
              <span>LIVE PREVIEW</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 bg-[#130d22] p-1 rounded-xl border border-white/10 mb-4 shrink-0">
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

          <div className="flex-1 bg-[#130d22] border border-white/10 rounded-2xl flex flex-col items-center justify-center p-4 relative overflow-hidden shadow-inner">
            <div 
              className={`border border-white/10 rounded-xl p-4 flex flex-col items-center justify-between text-center relative transition-all duration-300 ease-in-out bg-cover bg-center ${selectedBackground} ${
                previewMode === "portrait" 
                  ? "w-[210px] h-[360px]" 
                  : "w-[280px] h-[160px]"
              }`}
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
                <h3 className={`font-black tracking-widest text-white transition-all duration-300 drop-shadow-md ${previewMode === "portrait" ? "text-lg" : "text-sm"}`}>
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
                CORDAI IMAGE 1
              </div>

            </div>
          </div>
        </aside>
      </div>
    </>
  );
}