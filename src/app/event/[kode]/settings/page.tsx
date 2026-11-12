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
  Database 
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

  const sidebarMenus = [
    { id: "identity", name: "EVENT IDENTITY & UI", icon: Sparkles },
    { id: "output", name: "OUTPUT & OVERLAY (PNG)", icon: ImageIcon },
    { id: "model", name: "IMAGE MODEL SETTINGS", icon: Sliders },
    { id: "remote", name: "REMOTE APP", icon: Smartphone },
    { id: "print", name: "PRINT SETTINGS", icon: Printer },
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
          />
        );
      case "output":
        return <OutputOverlay />;
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
      {/* Tambahan style CSS lokal untuk mempercantik scrollbar agar tidak putih */}
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

      {/* Kontainer utama menggunakan tinggi pas layar dikurangi jarak navbar atas */}
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

          {/* Tombol Toggle Portrait / Landscape */}
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
    </>
  );
}