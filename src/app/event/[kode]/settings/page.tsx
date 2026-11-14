"use client";

import { useState } from "react";
import {
  Settings,
  Sparkles,
  Image as ImageIcon,
  Sliders,
  Smartphone,
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
import GuestDownload from "@/components/event/settings/GuestDownload";
import DataMaintenance from "@/components/event/settings/DataMaintenance";
import LivePreviewOverlay from "@/components/event/sidebar/LivePreviewOverlay";
import CameraSetup from "@/components/event/settings/CameraSetup";

export default function EventSettingsPage() {
  const [activeMenu, setActiveMenu] = useState("identity");
  const [eventName, setEventName] = useState("ARTBOOTH");
  const [eventDesc, setEventDesc] = useState("Semua bisa mengekspresikan disini");
  const [autoReset, setAutoReset] = useState(true);
  const [countdown, setCountdown] = useState("60s (Default)");
  const [previewMode, setPreviewMode] = useState<"portrait" | "landscape">("portrait");
  const [outputRatio, setOutputRatio] = useState("2:3");

  // State background & overlay (Identity & Output)
  const [selectedBackground, setSelectedBackground] = useState("tpl-hex");
  const [overlayUrl, setOverlayUrl] = useState("");
  const [overlayInfo, setOverlayInfo] = useState({ name: "custom_editor_frame.png", dimensions: "1205x1795 px" });

  // State Form Guest Download (Diangkat agar sinkron dengan Live Preview)
  const [headerText, setHeaderText] = useState<string>('YOUR DIGITAL ART');
  const [subText, setSubText] = useState<string>('COROAI PHOTOBOOTH');
  const [welcomeEnabled, setWelcomeEnabled] = useState<boolean>(true);
  const [popupMessage, setPopupMessage] = useState<string>('Thank you for attending! You can now download your photos.');
  const [popupButtonText, setPopupButtonText] = useState<string>('Agree & Continue');
  const [filePattern, setFilePattern] = useState<string>('');
  const [bgClass, setBgClass] = useState<string>('tpl-hex');
  const [customBgUrl, setCustomBgUrl] = useState<string | null>(null);
  const [customBgType, setCustomBgType] = useState<'image' | 'video' | null>(null);
  const [originalPhotoEnabled, setOriginalPhotoEnabled] = useState<boolean>(true);
  const [dlPhotoText, setDlPhotoText] = useState<string>('DOWNLOAD PHOTO');
  const [dlVideoText, setDlVideoText] = useState<string>('DOWNLOAD VIDEO');
  const [layoutStyle, setLayoutStyle] = useState<'neon' | 'minimal'>('neon');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

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
      case "camera":
        return <CameraSetup />;
      case "print":
        return <PrintSettings />;
      case "guest":
        return (
          <GuestDownload
            headerText={headerText} setHeaderText={setHeaderText}
            subText={subText} setSubText={setSubText}
            welcomeEnabled={welcomeEnabled} setWelcomeEnabled={setWelcomeEnabled}
            popupMessage={popupMessage} setPopupMessage={setPopupMessage}
            popupButtonText={popupButtonText} setPopupButtonText={setPopupButtonText}
            filePattern={filePattern} setFilePattern={setFilePattern}
            bgClass={bgClass} setBgClass={setBgClass}
            customBgUrl={customBgUrl} setCustomBgUrl={setCustomBgUrl}
            customBgType={customBgType} setCustomBgType={setCustomBgType}
            originalPhotoEnabled={originalPhotoEnabled} setOriginalPhotoEnabled={setOriginalPhotoEnabled}
            dlPhotoText={dlPhotoText} setDlPhotoText={setDlPhotoText}
            dlVideoText={dlVideoText} setDlVideoText={setDlVideoText}
            layoutStyle={layoutStyle} setLayoutStyle={setLayoutStyle}
            orientation={orientation} setOrientation={setOrientation}
          />
        );
      case "data":
        return <DataMaintenance />;
      default:
        return null;
    }
  };

  // Live preview tampil di tab identity, output, dan guest
  const showLivePreview = activeMenu === "identity" || activeMenu === "output" || activeMenu === "guest";

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

        {/* 1. SIDEBAR KIRI (Menu Navigasi) */}
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
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold tracking-wider transition-all cursor-pointer ${isActive
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
            {activeMenu === "identity" && (
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
            )}
            {activeMenu === "output" && (
              <OutputOverlay
                selectedRatio={outputRatio}
                overlayUrl={overlayUrl}
                overlayInfo={overlayInfo}
                onOverlayApplied={(url, name, dims) => {
                  setOverlayUrl(url);
                  setOverlayInfo({ name, dimensions: dims });
                }}
                onRatioChange={(ratio, w, h) => {
                  setOutputRatio(ratio);
                  // Otomatis sinkronkan mode portrait/landscape preview berdasarkan rasio
                  setPreviewMode(h >= w ? "portrait" : "landscape");
                }}
              />
            )}
            {activeMenu === "model" && <ImageModel />}
            {activeMenu === "remote" && <RemoteApp />}
            {activeMenu === "camera" && <CameraSetup />}
            {activeMenu === "print" && <PrintSettings />}
            {activeMenu === "guest" && (
              <GuestDownload
                headerText={headerText} setHeaderText={setHeaderText}
                subText={subText} setSubText={setSubText}
                welcomeEnabled={welcomeEnabled} setWelcomeEnabled={setWelcomeEnabled}
                popupMessage={popupMessage} setPopupMessage={setPopupMessage}
                popupButtonText={popupButtonText} setPopupButtonText={setPopupButtonText}
                filePattern={filePattern} setFilePattern={setFilePattern}
                bgClass={bgClass} setBgClass={setBgClass}
                customBgUrl={customBgUrl} setCustomBgUrl={setCustomBgUrl}
                customBgType={customBgType} setCustomBgType={setCustomBgType}
                originalPhotoEnabled={originalPhotoEnabled} setOriginalPhotoEnabled={setOriginalPhotoEnabled}
                dlPhotoText={dlPhotoText} setDlPhotoText={setDlPhotoText}
                dlVideoText={dlVideoText} setDlVideoText={setDlVideoText}
                layoutStyle={layoutStyle} setLayoutStyle={setLayoutStyle}
                orientation={orientation} setOrientation={setOrientation}
              />
            )}
            {activeMenu === "data" && <DataMaintenance />}
          </div>
        </main>

        {/* 3. KANAN: SATU LIVE PREVIEW TUNGGAL YANG DINAMIS */}
        {showLivePreview && (
          <LivePreviewOverlay
            previewMode={previewMode}
            setPreviewMode={setPreviewMode}
            selectedBackground={selectedBackground}
            overlayUrl={overlayUrl}
            eventName={eventName}
            eventDesc={eventDesc}
            activeTab={activeMenu}
            headerText={headerText}
            subText={subText}
            welcomeEnabled={welcomeEnabled}
            popupMessage={popupMessage}
            popupButtonText={popupButtonText}
            bgClass={bgClass}
            customBgUrl={customBgUrl}
            customBgType={customBgType}
            originalPhotoEnabled={originalPhotoEnabled}
            dlPhotoText={dlPhotoText}
            dlVideoText={dlVideoText}
            layoutStyle={layoutStyle}
            orientation={orientation}
            onOrientationChange={setOrientation}
            outputRatio={outputRatio} // <-- Pastikan LivePreviewOverlay menerima prop rasio ini
            onDownload={(type) => {
              const pattern = filePattern.trim() || '[EventName]_[Nama]';
              const fileName = pattern.replace('[EventName]', 'CoroAI_Event').replace('[Nama]', 'Guest01');
              alert(`Simulasi unduhan: ${fileName}.${type === 'Photo' ? 'jpg' : 'mp4'}`);
            }}
          />
        )}
      </div>
    </>
  );
}