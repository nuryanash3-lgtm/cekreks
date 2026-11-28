"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
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
import ScreenEditor from "@/components/event/settings/ScreenEditor";
import { useRegisterSettingsSave } from "@/components/event/EventSettingsContext";
import {
  DEFAULT_EVENT_IDENTITY_CONFIG,
  type EventSettingsApiResponse,
  type IdentityBackgroundType,
} from "@/lib/event-settings-types";

export default function EventSettingsPage() {
  const { kode } = useParams<{ kode: string }>();
  const [activeMenu, setActiveMenu] = useState("identity");
  const [eventName, setEventName] = useState("");
  const [eventDesc, setEventDesc] = useState("");
  const [isLoadingEvent, setIsLoadingEvent] = useState(() => Boolean(kode));
  const [eventLoadError, setEventLoadError] = useState<string | null>(() =>
    kode ? null : "Kode event tidak ditemukan."
  );
  const [autoReset, setAutoReset] = useState(DEFAULT_EVENT_IDENTITY_CONFIG.autoReset);
  const [countdown, setCountdown] = useState(`${DEFAULT_EVENT_IDENTITY_CONFIG.autoResetSeconds}s`);
  const [previewMode, setPreviewMode] = useState<"portrait" | "landscape">("portrait");
  const [outputRatio, setOutputRatio] = useState("2:3");

  // State background & overlay (Identity & Output)
  const [backgroundType, setBackgroundType] = useState<IdentityBackgroundType>(
    DEFAULT_EVENT_IDENTITY_CONFIG.backgroundType
  );
  const [backgroundValue, setBackgroundValue] = useState<string>(
    DEFAULT_EVENT_IDENTITY_CONFIG.backgroundValue
  );
  const [backgroundName, setBackgroundName] = useState<string>(
    DEFAULT_EVENT_IDENTITY_CONFIG.backgroundName
  );
  const [overlayUrl, setOverlayUrl] = useState("");
  const [overlayInfo, setOverlayInfo] = useState({ name: "custom_editor_frame.png", dimensions: "1205x1795 px" });

  useEffect(() => {
    if (!kode) {
      return;
    }

    let cancelled = false;

    async function loadEventDetails() {
      try {
        const res = await fetch(`/api/events/${encodeURIComponent(kode)}/settings`, {
          cache: "no-store",
        });
        const data = (await res.json().catch(() => null)) as EventSettingsApiResponse | null;

        if (cancelled) return;

        if (!res.ok || !data?.ok || !data.event) {
          setEventLoadError(data?.error || "Gagal memuat data event dari database.");
          return;
        }

        setEventLoadError(null);
        setEventName(data.event.title ?? "");
        setEventDesc(data.event.description ?? "");

        if (data.settings?.identityConfig) {
          const cfg = data.settings.identityConfig;
          setAutoReset(cfg.autoReset);
          setCountdown(`${cfg.autoResetSeconds}s`);
          setBackgroundType(cfg.backgroundType);
          setBackgroundValue(cfg.backgroundValue);
          setBackgroundName(cfg.backgroundName);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Gagal memuat detail event:", error);
          setEventLoadError("Terjadi kesalahan saat mengambil data event.");
        }
      } finally {
        if (!cancelled) {
          setIsLoadingEvent(false);
        }
      }
    }

    loadEventDetails();

    return () => {
      cancelled = true;
    };
  }, [kode]);

  const handleSaveSettings = useCallback(async () => {
    if (!kode) {
      return { ok: false, message: "Kode event tidak ditemukan." };
    }
    if (!eventName.trim()) {
      return { ok: false, message: "Nama event tidak boleh kosong." };
    }

    const parsedSeconds = parseInt(countdown, 10);
    const autoResetSeconds = Number.isFinite(parsedSeconds)
      ? Math.min(120, Math.max(15, parsedSeconds))
      : DEFAULT_EVENT_IDENTITY_CONFIG.autoResetSeconds;

    const res = await fetch(`/api/events/${encodeURIComponent(kode)}/settings`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: eventName.trim(),
        description: eventDesc,
        identityConfig: {
          autoReset,
          autoResetSeconds,
          backgroundType,
          backgroundValue,
          backgroundName,
        },
      }),
    });

    const data = (await res.json().catch(() => null)) as EventSettingsApiResponse | null;
    if (!res.ok || !data?.ok || !data.event) {
      return {
        ok: false,
        message: data?.error || "Gagal menyimpan pengaturan event.",
      };
    }

    setEventName(data.event.title ?? "");
    setEventDesc(data.event.description ?? "");
    if (data.settings?.identityConfig) {
      const saved = data.settings.identityConfig;
      setAutoReset(saved.autoReset);
      setCountdown(`${saved.autoResetSeconds}s`);
      setBackgroundType(saved.backgroundType);
      setBackgroundValue(saved.backgroundValue);
      setBackgroundName(saved.backgroundName);
    }

    return { ok: true, message: "Pengaturan Event Identity & UI disimpan!" };
  }, [
    kode,
    eventName,
    eventDesc,
    autoReset,
    countdown,
    backgroundType,
    backgroundValue,
    backgroundName,
  ]);

  useRegisterSettingsSave(handleSaveSettings);

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
          <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4 shrink-0">
            <h1 className="text-xl font-bold tracking-wider text-white">
              {getActiveTitle()}
            </h1>
            {kode && (
              <span className="text-xs font-mono font-bold tracking-wider text-purple-300 bg-[#130d22] border border-white/10 px-3 py-1 rounded-lg">
                {eventName ? `${eventName} (${kode})` : kode}
              </span>
            )}
          </div>

          {eventLoadError && (
            <div className="mb-4 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-xs text-rose-300 shrink-0">
              {eventLoadError}
            </div>
          )}

          <div className="flex-1 overflow-y-auto pr-3">
            {activeMenu === "identity" && (
              <EventIdentity
                eventCode={kode}
                eventName={eventName}
                setEventName={setEventName}
                eventDesc={eventDesc}
                setEventDesc={setEventDesc}
                isLoading={isLoadingEvent}
                autoReset={autoReset}
                setAutoReset={setAutoReset}
                countdown={countdown}
                setCountdown={setCountdown}
                backgroundType={backgroundType}
                setBackgroundType={setBackgroundType}
                backgroundValue={backgroundValue}
                setBackgroundValue={setBackgroundValue}
                backgroundName={backgroundName}
                setBackgroundName={setBackgroundName}
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
            {activeMenu === "screen" && <ScreenEditor />}
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
            selectedBackground={backgroundValue}
            backgroundType={backgroundType}
            backgroundValue={backgroundValue}
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
              const safeEventName = (eventName.trim() || 'Event').replace(/\s+/g, '_');
              const fileName = pattern.replace('[EventName]', safeEventName).replace('[Nama]', 'Guest01');
              alert(`Simulasi unduhan: ${fileName}.${type === 'Photo' ? 'jpg' : 'mp4'}`);
            }}
          />
        )}
      </div>
    </>
  );
}