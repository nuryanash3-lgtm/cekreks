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
  Smartphone,
  Code,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Image as ImageIcon,
  Upload,
  Film,
  BadgeCheck,
  ImagePlus,
  MousePointerClick,
  Monitor,
  Gamepad2,
  Grid,
} from "lucide-react";

type CaptureMode = "photo" | "gif" | "boomerang" | "video";
type LaunchType = "standard" | "video";
type ExitAnimationType = "split-h" | "split-v" | "zoom-fade" | "slide-up";
type LaunchLayoutType =
  | "launch-gallery"
  | "launch-only"
  | "custom-text"
  | "touch-anywhere";
type AlignType = "left" | "center" | "right";
type LogoPositionType = "top" | "below-title" | "bottom";
type ButtonSizeType = "sm" | "md" | "lg";
type ButtonWidthType = "auto" | "medium" | "wide" | "full";
type ButtonShapeType = "sharp" | "rounded" | "pill" | "square";
type ButtonPositionType = "below-title" | "bottom";
type BgMediaType = "default" | "image" | "video";
type PreviewDeviceType = "mobile" | "desktop";

interface BoothAiState {
  launchType: LaunchType;
  enableEventName: boolean;
  enableEventDesc: boolean;
  enableGalleryBtn: boolean;
  enableSettingsBtn: boolean;
  enableFullscreenBtn: boolean;
  enableEffectTransition: boolean;
  exitAnimation: ExitAnimationType;
  launchLayout: LaunchLayoutType;
  customStartText: string;
  launchLabel: string;
  galleryLabel: string;
  eventName: string;
  eventDesc: string;

  titleGlow: boolean;
  titleSize: number;
  titleFont: string;
  titleVPos: "top" | "center" | "bottom";
  titleAlign: AlignType;
  titleColor: string;
  titleOpacity: number;

  descSize: number;
  descFont: string;
  descSpacing: string;
  descAlign: AlignType;
  descColor: string;
  descOpacity: number;

  bgMediaType: BgMediaType;
  bgImageUrl: string;
  bgVideoUrl: string;
  bgVideoLabel: string;
  bgVideoSub: string;
  dimmer: number;

  logoUrl: string;
  logoSize: number;
  logoPos: LogoPositionType;
  logoAlign: AlignType;
  logoOpacity: number;

  btnSize: ButtonSizeType;
  btnWidth: ButtonWidthType;
  btnShape: ButtonShapeType;
  btnPos: ButtonPositionType;
  btnGlow: boolean;
  primaryBg: string;
  primaryText: string;
  primaryOpacity: number;
  primaryBorder: number;
  secondaryBg: string;
  secondaryText: string;
  secondaryOpacity: number;

  secTypographyEnabled: boolean;
  secBgMediaEnabled: boolean;
  secLogoEnabled: boolean;
  secButtonsEnabled: boolean;

  previewDevice: PreviewDeviceType;
}

const DEFAULT_BOOTH_AI_STATE: BoothAiState = {
  launchType: "standard",
  enableEventName: true,
  enableEventDesc: true,
  enableGalleryBtn: true,
  enableSettingsBtn: true,
  enableFullscreenBtn: true,
  enableEffectTransition: true,
  exitAnimation: "split-h",
  launchLayout: "launch-gallery",
  customStartText: "TAP SCREEN TO START",
  launchLabel: "LAUNCH",
  galleryLabel: "GALLERY",
  eventName: "JALANAN",
  eventDesc: "INTERACTIVE STREET EXPERIENCE",

  titleGlow: true,
  titleSize: 36,
  titleFont: "font-display",
  titleVPos: "center",
  titleAlign: "center",
  titleColor: "#ffffff",
  titleOpacity: 100,

  descSize: 12,
  descFont: "font-sans",
  descSpacing: "0.15em",
  descAlign: "center",
  descColor: "#d1d5db",
  descOpacity: 85,

  bgMediaType: "default",
  bgImageUrl: "",
  bgVideoUrl: "",
  bgVideoLabel: "Custom Looped Video",
  bgVideoSub: "MP4 / WebM • Active Loop",
  dimmer: 40,

  logoUrl: "",
  logoSize: 64,
  logoPos: "top",
  logoAlign: "center",
  logoOpacity: 100,

  btnSize: "md",
  btnWidth: "medium",
  btnShape: "sharp",
  btnPos: "below-title",
  btnGlow: true,
  primaryBg: "#9333ea",
  primaryText: "#ffffff",
  primaryOpacity: 100,
  primaryBorder: 1,
  secondaryBg: "#121216",
  secondaryText: "#ffffff",
  secondaryOpacity: 80,

  secTypographyEnabled: true,
  secBgMediaEnabled: true,
  secLogoEnabled: true,
  secButtonsEnabled: true,

  previewDevice: "mobile",
};

function hexToRgba(hex: string, opacityPercent: number): string {
  let cleanHex = hex.replace("#", "").trim();
  if (cleanHex.length === 3) {
    cleanHex = cleanHex
      .split("")
      .map((c) => c + c)
      .join("");
  }
  if (!/^[0-9A-Fa-f]{6}$/.test(cleanHex)) {
    return `rgba(147, 51, 234, ${opacityPercent / 100})`;
  }
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacityPercent / 100})`;
}

export default function ScreenEditor() {
  // Default active tab di Booth AI (kiri: Launch Screen Booth AI, kanan: Capture Screen Konvensional)
  const [editorTab, setEditorTab] = useState<"ai" | "konven">("ai");

  // ================= BOOTH AI STATE =================
  const [aiState, setAiState] = useState<BoothAiState>(DEFAULT_BOOTH_AI_STATE);
  const [aiImageUrlInput, setAiImageUrlInput] = useState("");
  const [aiVideoUrlInput, setAiVideoUrlInput] = useState("");
  const [aiLogoUrlInput, setAiLogoUrlInput] = useState("");
  const [aiHexTitle, setAiHexTitle] = useState("#FFFFFF");
  const [aiHexDesc, setAiHexDesc] = useState("#D1D5DB");
  const [aiHexPrimaryBg, setAiHexPrimaryBg] = useState("#9333EA");
  const [aiHexPrimaryText, setAiHexPrimaryText] = useState("#FFFFFF");
  const [aiHexSecondaryBg, setAiHexSecondaryBg] = useState("#121216");
  const [aiHexSecondaryText, setAiHexSecondaryText] = useState("#FFFFFF");

  const [aiLaunchExited, setAiLaunchExited] = useState(false);
  const [aiSplitActive, setAiSplitActive] = useState(false);
  const [aiGalleryModalOpen, setAiGalleryModalOpen] = useState(false);
  const [logoLoadError, setLogoLoadError] = useState(false);

  const aiBgImageInputRef = useRef<HTMLInputElement | null>(null);
  const aiBgVideoInputRef = useRef<HTMLInputElement | null>(null);
  const aiLogoInputRef = useRef<HTMLInputElement | null>(null);
  const exitAnimTimerRef = useRef<NodeJS.Timeout | null>(null);

  // ================= KONVENSIONAL STATE =================
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

  const [modesEnabled, setModesEnabled] = useState({
    photo: true,
    gif: false,
    boomerang: false,
    video: false,
  });

  const [photoSettings, setPhotoSettings] = useState({
    before1: 2,
    beforeOther: 4,
    preview: 2,
    alsoGif: false,
  });

  const [gifSettings, setGifSettings] = useState({
    size: "Regular (720x480)",
    before1: 5,
    beforeOther: 5,
    preview: 3,
    delay: 500,
    reverse: false,
    photosToCapture: 4,
  });

  const [boomSettings, setBoomSettings] = useState({
    size: "Regular (720x480)",
    countdown: 5,
    delay: 24,
    duration: 2,
  });

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

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [accordions, setAccordions] = useState({
    photo: true,
    gif: false,
    boomerang: false,
    video: false,
  });
  const [toast, setToast] = useState<{ msg: string; visible: boolean; type?: "info" | "error" }>({
    msg: "",
    visible: false,
    type: "info",
  });
  const [isSimulating, setIsSimulating] = useState(false);
  const [countdownValue, setCountdownValue] = useState(2);
  const [capturedThumbs, setCapturedThumbs] = useState<string[]>([]);
  const [flashActive, setFlashActive] = useState(false);
  const [sayCheeseActive, setSayCheeseActive] = useState(false);

  const simulationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = (msg: string, type: "info" | "error" = "info") => {
    setToast({ msg, visible: true, type });
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 2600);
  };

  useEffect(() => {
    return () => {
      if (simulationTimerRef.current) clearInterval(simulationTimerRef.current);
      if (exitAnimTimerRef.current) clearTimeout(exitAnimTimerRef.current);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  // ================= BOOTH AI HANDLERS =================
  const updateAiField = <K extends keyof BoothAiState>(key: K, value: BoothAiState[K]) => {
    setAiState((prev) => ({ ...prev, [key]: value }));
  };

  const toggleAiSection = (
    sectionKey: "typography" | "bgMedia" | "logo" | "buttons"
  ) => {
    const keyMap = {
      typography: "secTypographyEnabled",
      bgMedia: "secBgMediaEnabled",
      logo: "secLogoEnabled",
      buttons: "secButtonsEnabled",
    } as const;
    const labelMap = {
      typography: "Typography",
      bgMedia: "Background Media",
      logo: "Logo Configuration",
      buttons: "Buttons Styling",
    };
    const prop = keyMap[sectionKey];
    setAiState((prev) => {
      const nextVal = !prev[prop];
      showToast(
        `${labelMap[sectionKey]}: ${nextVal ? "ON (Ditampilkan)" : "OFF (Disembunyikan)"}`
      );
      return { ...prev, [prop]: nextVal };
    });
  };

  const handleAiSyncColor = (
    key: "titleColor" | "descColor" | "primaryBg" | "primaryText" | "secondaryBg" | "secondaryText",
    hexVal: string,
    setHex: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setHex(hexVal.toUpperCase());
    updateAiField(key, hexVal);
  };

  const handleAiSyncHex = (
    key: "titleColor" | "descColor" | "primaryBg" | "primaryText" | "secondaryBg" | "secondaryText",
    textVal: string,
    setHex: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const formatted = textVal.startsWith("#") ? textVal : "#" + textVal;
    setHex(formatted.toUpperCase());
    if (/^#[0-9A-Fa-f]{6}$/.test(formatted)) {
      updateAiField(key, formatted);
    }
  };

  const stepAiSelectOption = (
    currentVal: string | number,
    options: readonly (string | number)[],
    delta: number,
    onChange: (next: never) => void
  ) => {
    const idx = options.indexOf(currentVal);
    const nextIdx = idx + delta;
    if (nextIdx >= 0 && nextIdx < options.length) {
      onChange(options[nextIdx] as never);
    }
  };

  const handleAiBgImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast("Ukuran gambar maksimal 5MB!", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (typeof ev.target?.result === "string") {
        setAiState((prev) => ({
          ...prev,
          bgMediaType: "image",
          bgImageUrl: ev.target!.result as string,
        }));
        setAiImageUrlInput(file.name);
        showToast("Background image berhasil diterapkan");
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleAiBgImageUrl = (url: string) => {
    setAiImageUrlInput(url);
    const trimmed = url.trim();
    setAiState((prev) => ({
      ...prev,
      bgMediaType: trimmed ? "image" : prev.bgMediaType === "image" ? "default" : prev.bgMediaType,
      bgImageUrl: trimmed,
    }));
  };

  const handleAiBgVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setAiState((prev) => ({
      ...prev,
      bgMediaType: "video",
      bgVideoUrl: objectUrl,
      bgVideoLabel: file.name,
      bgVideoSub: `${(file.size / (1024 * 1024)).toFixed(2)} MB • Active Loop`,
    }));
    showToast("Video loop berhasil dimuat");
    e.target.value = "";
  };

  const handleAiBgVideoUrl = (url: string) => {
    setAiVideoUrlInput(url);
    const trimmed = url.trim();
    setAiState((prev) => ({
      ...prev,
      bgMediaType: trimmed ? "video" : prev.bgMediaType === "video" ? "default" : prev.bgMediaType,
      bgVideoUrl: trimmed,
      bgVideoLabel: trimmed ? "External Stream Video" : prev.bgVideoLabel,
    }));
  };

  const removeAiBgMedia = () => {
    setAiImageUrlInput("");
    setAiVideoUrlInput("");
    setAiState((prev) => ({
      ...prev,
      bgMediaType: "default",
      bgImageUrl: "",
      bgVideoUrl: "",
      bgVideoLabel: "Default Atmospheric Smoke",
      bgVideoSub: "Built-in Shader Loop",
    }));
    showToast("Background dikembalikan ke default");
  };

  const handleAiLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      showToast("Ukuran logo maksimal 2MB!", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (typeof ev.target?.result === "string") {
        setLogoLoadError(false);
        updateAiField("logoUrl", ev.target.result);
        showToast("Logo berhasil diunggah");
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleAiLogoUrl = (url: string) => {
    setAiLogoUrlInput(url);
    setLogoLoadError(false);
    updateAiField("logoUrl", url.trim());
  };

  const clearAiLogo = () => {
    setAiLogoUrlInput("");
    setLogoLoadError(false);
    updateAiField("logoUrl", "");
    showToast("Logo dihapus");
  };

  const restoreAiLaunchScreen = () => {
    if (exitAnimTimerRef.current) clearTimeout(exitAnimTimerRef.current);
    setAiSplitActive(false);
    setAiLaunchExited(false);
  };

  const triggerAiExitPreview = () => {
    if (exitAnimTimerRef.current) clearTimeout(exitAnimTimerRef.current);
    if (!aiState.enableEffectTransition) {
      setAiLaunchExited(true);
      return;
    }
    if (aiState.exitAnimation === "split-h" || aiState.exitAnimation === "split-v") {
      setAiSplitActive(true);
      exitAnimTimerRef.current = setTimeout(() => {
        setAiLaunchExited(true);
      }, 150);
    } else {
      setAiLaunchExited(true);
    }
  };

  const exportAiConfigJSON = () => {
    const jsonStr = JSON.stringify(aiState, null, 2);
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(jsonStr).catch(() => {});
    }
    showToast("Konfigurasi JSON berhasil disalin ke clipboard!");
  };

  const resetAllAiSettings = () => {
    setAiState(DEFAULT_BOOTH_AI_STATE);
    setAiImageUrlInput("");
    setAiVideoUrlInput("");
    setAiLogoUrlInput("");
    setLogoLoadError(false);
    setAiHexTitle("#FFFFFF");
    setAiHexDesc("#D1D5DB");
    setAiHexPrimaryBg("#9333EA");
    setAiHexPrimaryText("#FFFFFF");
    setAiHexSecondaryBg("#121216");
    setAiHexSecondaryText("#FFFFFF");
    setAiGalleryModalOpen(false);
    restoreAiLaunchScreen();
    showToast("Semua pengaturan telah dikembalikan ke default");
  };

  // ================= KONVENSIONAL HANDLERS =================
  const toggleCaptureMode = (mode: CaptureMode, enabled: boolean) => {
    setModesEnabled((prev) => ({ ...prev, [mode]: enabled }));
    setAccordions((prev) => ({ ...prev, [mode]: enabled }));
    if (!enabled && activeMode === mode) {
      const modes: CaptureMode[] = ["photo", "gif", "boomerang", "video"];
      const fallback = modes.find((m) => (m === mode ? false : modesEnabled[m]));
      if (fallback) setActiveMode(fallback);
    }
    showToast(`${mode.toUpperCase()} mode ${enabled ? "enabled" : "disabled"}`);
  };

  const toggleAccordion = (mode: keyof typeof accordions) => {
    if (!modesEnabled[mode]) {
      showToast(`Enable ${mode.toUpperCase()} first to adjust settings.`);
      return;
    }
    setAccordions((prev) => ({ ...prev, [mode]: !prev[mode] }));
  };

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

        const thumb =
          "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=150&q=80";
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

  useEffect(() => {
    if (!isSimulating) {
      if (activeMode === "photo") setCountdownValue(photoSettings.before1);
      if (activeMode === "gif") setCountdownValue(gifSettings.before1);
      if (activeMode === "boomerang") setCountdownValue(boomSettings.countdown);
      if (activeMode === "video") setCountdownValue(videoSettings.countdown1);
    }
  }, [
    activeMode,
    photoSettings.before1,
    gifSettings.before1,
    boomSettings.countdown,
    videoSettings.countdown1,
    isSimulating,
  ]);

  // ================= RENDER HELPERS FOR BOOTH AI =================
  const renderAiLogoElement = (slot: LogoPositionType) => {
    if (!aiState.secLogoEnabled || !aiState.logoUrl || aiState.logoPos !== slot) {
      return null;
    }
    const justifyClass =
      aiState.logoAlign === "left"
        ? "justify-start"
        : aiState.logoAlign === "right"
          ? "justify-end"
          : "justify-center";
    const spacingClass =
      slot === "top" ? "mb-3" : slot === "below-title" ? "mt-3" : "w-full";

    return (
      <div className={`${spacingClass} flex ${justifyClass}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={aiState.logoUrl}
          alt="Brand Logo"
          style={{ height: `${aiState.logoSize}px`, opacity: aiState.logoOpacity / 100 }}
          className="object-contain transition-all duration-200"
        />
      </div>
    );
  };

  const renderAiButtons = () => {
    if (!aiState.secButtonsEnabled) return null;

    if (aiState.launchType === "video") {
      return (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            triggerAiExitPreview();
          }}
          className="group flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-display text-xs font-bold tracking-widest uppercase shadow-[0_0_25px_rgba(147,51,234,0.7)] transition"
        >
          <Play className="w-4 h-4 fill-white" /> START VIDEO EXPERIENCE
        </button>
      );
    }

    if (aiState.launchLayout === "custom-text") {
      return (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            triggerAiExitPreview();
          }}
          className="px-4 py-2 text-xs font-display font-bold tracking-[0.22em] text-white uppercase animate-pulse hover:text-purple-300 transition"
        >
          {aiState.customStartText || "TAP TO START"}
        </button>
      );
    }

    if (aiState.launchLayout === "touch-anywhere") {
      return (
        <div className="flex flex-col items-center gap-1.5 text-gray-300 animate-pulse cursor-pointer">
          <Sparkles className="w-6 h-6 text-purple-400" />
          <span className="text-[10px] font-mono tracking-[0.2em] uppercase">
            TOUCH ANYWHERE TO START
          </span>
        </div>
      );
    }

    const sizeClasses = {
      sm: "py-1.5 px-3 text-[9px]",
      md: "py-2 px-4 text-[10px]",
      lg: "py-2.5 px-5 text-xs",
    }[aiState.btnSize];

    const widthClasses = {
      auto: "w-auto",
      medium: "min-w-[96px]",
      wide: "min-w-[130px]",
      full: "w-full",
    }[aiState.btnWidth];

    const radiusStyle = {
      sharp: "4px",
      rounded: "10px",
      pill: "9999px",
      square: "0px",
    }[aiState.btnShape];

    const primaryBgRgba = hexToRgba(aiState.primaryBg, aiState.primaryOpacity);
    const primaryGlow = aiState.btnGlow
      ? `0 0 18px ${hexToRgba(aiState.primaryBg, 0.75)}`
      : "none";

    const secBgRgba = hexToRgba(aiState.secondaryBg, aiState.secondaryOpacity);

    return (
      <>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            triggerAiExitPreview();
          }}
          style={{
            backgroundColor: primaryBgRgba,
            color: aiState.primaryText,
            borderRadius: radiusStyle,
            border: `${aiState.primaryBorder}px solid rgba(255,255,255,0.25)`,
            boxShadow: primaryGlow,
          }}
          className={`${sizeClasses} ${widthClasses} font-display font-bold tracking-wider uppercase transition-transform active:scale-95 hover:brightness-110 flex items-center justify-center`}
        >
          {aiState.launchLabel || "LAUNCH"}
        </button>

        {aiState.launchLayout === "launch-gallery" && aiState.enableGalleryBtn && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setAiGalleryModalOpen(true);
            }}
            style={{
              backgroundColor: secBgRgba,
              color: aiState.secondaryText,
              borderRadius: radiusStyle,
              border: "1px solid rgba(255,255,255,0.18)",
            }}
            className={`${sizeClasses} ${widthClasses} font-display font-semibold tracking-wider uppercase backdrop-blur-md transition-transform active:scale-95 hover:border-purple-400/60 flex items-center justify-center`}
          >
            {aiState.galleryLabel || "GALLERY"}
          </button>
        )}
      </>
    );
  };

  const getAiExitTransformStyle = (): React.CSSProperties => {
    if (!aiLaunchExited) {
      return { opacity: 1, pointerEvents: "auto" };
    }
    if (!aiState.enableEffectTransition) {
      return { opacity: 0, pointerEvents: "none" };
    }
    if (aiState.exitAnimation === "zoom-fade") {
      return {
        transform: "scale(1.35)",
        opacity: 0,
        transition: "all 0.65s ease-out",
        pointerEvents: "none",
      };
    }
    if (aiState.exitAnimation === "slide-up") {
      return {
        transform: "translateY(-100%)",
        transition: "transform 0.65s cubic-bezier(0.77, 0, 0.175, 1)",
        pointerEvents: "none",
      };
    }
    return {
      opacity: 0,
      transition: "opacity 0.5s ease 0.15s",
      pointerEvents: "none",
    };
  };

  return (
    <div className="bg-[#09090b] text-gray-200 font-sans h-screen flex flex-col overflow-hidden select-none">
      {/* TOP SWITCHER BAR: LAUNCH SCREEN BOOTH AI (KIRI) & CAPTURE SCREEN KONVENSIONAL (KANAN) */}
      <div className="bg-[#0b061a] border-b border-[#23232b] px-4 py-2 flex flex-wrap items-center justify-between gap-2 z-30 shrink-0">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setEditorTab("ai")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded text-xs font-display font-semibold uppercase tracking-wider transition cursor-pointer ${
              editorTab === "ai"
                ? "bg-[#9333ea] text-white shadow-[0_0_15px_rgba(147,51,234,0.4)]"
                : "bg-[#1e1e26] text-gray-300 hover:bg-[#272732]"
            }`}
          >
            <Sparkles size={14} />
            LAUNCH SCREEN BOOTH AI
          </button>
          <button
            type="button"
            onClick={() => setEditorTab("konven")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded text-xs font-display font-semibold uppercase tracking-wider transition cursor-pointer ${
              editorTab === "konven"
                ? "bg-[#8e24aa] text-white shadow-md"
                : "bg-[#1e1e26] text-gray-300 hover:bg-[#272732]"
            }`}
          >
            <Camera size={14} />
            CAPTURE SCREEN KONVENSIONAL
          </button>
        </div>

        <span className="text-[10px] font-mono text-gray-400 uppercase hidden sm:inline">
          {editorTab === "ai" ? "BOOTH AI LAUNCH SCREEN" : "CONVENTIONAL CAPTURE SCREEN"}
        </span>
      </div>

      {/* =====================================================================
          TAB 1 (DEFAULT): LAUNCH SCREEN BOOTH AI
         ===================================================================== */}
      {editorTab === "ai" ? (
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* LEFT SIDEBAR: SETTINGS PANEL */}
          <aside className="w-full lg:w-[460px] xl:w-[500px] bg-[#0f0f12] border-r border-[#23232b] flex-shrink-0 h-1/2 lg:h-full overflow-y-auto pb-16">
            {/* Top Header Bar */}
            <div className="sticky top-0 z-20 bg-[#0f0f12]/95 backdrop-blur-md border-b border-[#23232b] px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold tracking-widest text-gray-400 uppercase">
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                LAUNCH SCREEN
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={resetAllAiSettings}
                  title="Reset ke Pengaturan Awal"
                  className="text-[11px] px-2.5 py-1 rounded bg-[#1a1a22] hover:bg-[#252530] text-gray-300 border border-[#23232b] transition flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
                <button
                  type="button"
                  onClick={exportAiConfigJSON}
                  title="Salin Konfigurasi JSON"
                  className="text-[11px] px-2.5 py-1 rounded bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 transition flex items-center gap-1 cursor-pointer"
                >
                  <Code className="w-3 h-3" /> Export
                </button>
              </div>
            </div>

            <div className="p-5 space-y-6">
              {/* SECTION 1: LAUNCH SCREEN SETTINGS */}
              <section className="space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-md bg-purple-500/10 border border-purple-500/30 text-purple-400">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <h1 className="font-display text-sm sm:text-base font-bold tracking-wider text-white uppercase">
                    LAUNCH SCREEN SETTINGS
                  </h1>
                </div>

                {/* Launch Type Toggle */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
                    LAUNCH TYPE
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => updateAiField("launchType", "standard")}
                      className={`py-2.5 px-3 rounded-lg text-xs font-display font-semibold tracking-wider uppercase border transition-all duration-200 cursor-pointer ${
                        aiState.launchType === "standard"
                          ? "border-purple-500 bg-purple-600/15 text-white shadow-[0_0_15px_rgba(147,51,234,0.2)]"
                          : "border-[#23232b] bg-[#15151a] text-gray-400 hover:text-gray-200 hover:border-gray-700"
                      }`}
                    >
                      STANDARD LAUNCH
                    </button>
                    <button
                      type="button"
                      onClick={() => updateAiField("launchType", "video")}
                      className={`py-2.5 px-3 rounded-lg text-xs font-display font-semibold tracking-wider uppercase border transition-all duration-200 cursor-pointer ${
                        aiState.launchType === "video"
                          ? "border-purple-500 bg-purple-600/15 text-white shadow-[0_0_15px_rgba(147,51,234,0.2)]"
                          : "border-[#23232b] bg-[#15151a] text-gray-400 hover:text-gray-200 hover:border-gray-700"
                      }`}
                    >
                      VIDEO START
                    </button>
                  </div>
                </div>

                {/* Feature Checkboxes */}
                <div className="space-y-2.5 pt-2 border-t border-[#23232b]/70">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={aiState.enableEventName}
                      onChange={(e) => updateAiField("enableEventName", e.target.checked)}
                      className="cyber-checkbox"
                    />
                    <span className="text-xs font-medium text-gray-300 group-hover:text-white transition">
                      Enable Event Name
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={aiState.enableEventDesc}
                      onChange={(e) => updateAiField("enableEventDesc", e.target.checked)}
                      className="cyber-checkbox"
                    />
                    <span className="text-xs font-medium text-gray-300 group-hover:text-white transition">
                      Enable Event Description
                    </span>
                  </label>
                </div>

                <div className="space-y-2.5 pt-2.5 border-t border-[#23232b]/70">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={aiState.enableGalleryBtn}
                      onChange={(e) => updateAiField("enableGalleryBtn", e.target.checked)}
                      className="cyber-checkbox"
                    />
                    <span className="text-xs font-medium text-gray-300 group-hover:text-white transition">
                      Enable Gallery Button
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={aiState.enableSettingsBtn}
                      onChange={(e) => updateAiField("enableSettingsBtn", e.target.checked)}
                      className="cyber-checkbox"
                    />
                    <span className="text-xs font-medium text-gray-300 group-hover:text-white transition">
                      Enable Settings Gear Button
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={aiState.enableFullscreenBtn}
                      onChange={(e) => updateAiField("enableFullscreenBtn", e.target.checked)}
                      className="cyber-checkbox"
                    />
                    <span className="text-xs font-medium text-gray-300 group-hover:text-white transition">
                      Enable Fullscreen Button
                    </span>
                  </label>
                </div>

                <div className="pt-2.5 border-t border-[#23232b]/70">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={aiState.enableEffectTransition}
                      onChange={(e) => updateAiField("enableEffectTransition", e.target.checked)}
                      className="cyber-checkbox"
                    />
                    <span className="text-xs font-medium text-gray-300 group-hover:text-white transition">
                      Enable Effect Transition Mode (Launch &rarr; Gameplay)
                    </span>
                  </label>
                </div>

                {/* Launch Screen Exit Animation */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
                      LAUNCH SCREEN EXIT ANIMATION
                    </label>
                    <button
                      type="button"
                      onClick={triggerAiExitPreview}
                      className="text-[10px] text-purple-400 hover:text-purple-300 flex items-center gap-1 font-medium cursor-pointer"
                    >
                      <Play className="w-2.5 h-2.5" /> Test Animasi
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {(
                      [
                        { id: "split-h", label: "SPLIT H (DEFAULT)" },
                        { id: "split-v", label: "SPLIT V" },
                        { id: "zoom-fade", label: "ZOOM & FADE" },
                        { id: "slide-up", label: "SLIDE UP" },
                      ] as const
                    ).map((anim) => (
                      <button
                        key={anim.id}
                        type="button"
                        onClick={() => {
                          updateAiField("exitAnimation", anim.id);
                          showToast(`Animasi transisi diubah ke: ${anim.id.toUpperCase()}`);
                        }}
                        className={`py-2 px-2.5 rounded-md text-[10px] font-display font-semibold tracking-wider uppercase border transition cursor-pointer ${
                          aiState.exitAnimation === anim.id
                            ? "border-purple-500 bg-purple-600/15 text-white"
                            : "border-[#23232b] bg-[#15151a] text-gray-400 hover:text-gray-200"
                        }`}
                      >
                        {anim.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Standard Launch Layout */}
                <div className="space-y-2 pt-2">
                  <label className="block text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
                    STANDARD LAUNCH LAYOUT
                  </label>
                  <div className="space-y-2">
                    {(
                      [
                        { id: "launch-gallery", label: "USE LAUNCH & GALLERY BUTTON" },
                        { id: "launch-only", label: "USE LAUNCH BUTTON ONLY" },
                        { id: "custom-text", label: "USE CUSTOM TEXT TO START" },
                        { id: "touch-anywhere", label: "TOUCH ANYWHERE TO START" },
                      ] as const
                    ).map((lay) => (
                      <button
                        key={lay.id}
                        type="button"
                        onClick={() => updateAiField("launchLayout", lay.id)}
                        className={`w-full text-left py-2.5 px-3.5 rounded-lg text-[11px] font-display font-semibold tracking-wider uppercase border transition cursor-pointer ${
                          aiState.launchLayout === lay.id
                            ? "border-purple-500 bg-purple-600/15 text-white"
                            : "border-[#23232b] bg-[#15151a] text-gray-400 hover:text-gray-200"
                        }`}
                      >
                        {lay.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Text Input */}
                {aiState.launchLayout === "custom-text" && (
                  <div className="space-y-1.5 pt-1">
                    <label className="block text-[10px] font-semibold tracking-wider text-purple-400 uppercase">
                      CUSTOM START PROMPT TEXT
                    </label>
                    <input
                      type="text"
                      value={aiState.customStartText}
                      onChange={(e) => updateAiField("customStartText", e.target.value)}
                      className="w-full bg-[#15151a] border border-purple-500/40 rounded-md px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                )}

                {/* Button Labels */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
                      LAUNCH BUTTON LABEL
                    </label>
                    <input
                      type="text"
                      value={aiState.launchLabel}
                      onChange={(e) => updateAiField("launchLabel", e.target.value)}
                      className="w-full bg-[#15151a] border border-[#23232b] rounded-md px-3 py-2 text-xs font-medium text-white focus:outline-none focus:border-purple-500 transition"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
                      GALLERY BUTTON LABEL
                    </label>
                    <input
                      type="text"
                      value={aiState.galleryLabel}
                      onChange={(e) => updateAiField("galleryLabel", e.target.value)}
                      className="w-full bg-[#15151a] border border-[#23232b] rounded-md px-3 py-2 text-xs font-medium text-white focus:outline-none focus:border-purple-500 transition"
                    />
                  </div>
                </div>

                {/* Event Name & Description Content Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
                      EVENT NAME TEXT
                    </label>
                    <input
                      type="text"
                      value={aiState.eventName}
                      onChange={(e) => updateAiField("eventName", e.target.value)}
                      className="w-full bg-[#15151a] border border-[#23232b] rounded-md px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-purple-500 transition"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
                      EVENT DESCRIPTION TEXT
                    </label>
                    <input
                      type="text"
                      value={aiState.eventDesc}
                      onChange={(e) => updateAiField("eventDesc", e.target.value)}
                      className="w-full bg-[#15151a] border border-[#23232b] rounded-md px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-purple-500 transition"
                    />
                  </div>
                </div>
              </section>

              {/* SECTION 2: EVENT NAME & DESCRIPTION TYPOGRAPHY */}
              <section
                className={`bg-[#15151a] border border-[#23232b] rounded-xl p-4 transition-colors duration-200 ${
                  aiState.secTypographyEnabled ? "border-purple-500/30" : ""
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div
                    className="flex items-start gap-2.5 cursor-pointer flex-1"
                    onClick={() => toggleAiSection("typography")}
                  >
                    <div className="p-1.5 rounded-md bg-purple-500/10 border border-purple-500/30 text-purple-400 mt-0.5">
                      <Type className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h2 className="font-display text-xs sm:text-sm font-bold tracking-wider text-white uppercase">
                          EVENT NAME &amp; DESCRIPTION TYPOGRAPHY
                        </h2>
                        <ChevronDown
                          className={`w-3.5 h-3.5 text-purple-400 transition-transform duration-200 ${
                            aiState.secTypographyEnabled ? "" : "-rotate-90"
                          }`}
                        />
                      </div>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        Configure font sizes, alignment, colors, position, and opacity.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className={`text-[10px] font-mono font-bold uppercase ${
                        aiState.secTypographyEnabled ? "text-purple-400" : "text-gray-500 font-semibold"
                      }`}
                    >
                      {aiState.secTypographyEnabled ? "ON" : "OFF"}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleAiSection("typography")}
                      aria-label="Toggle Typography Section"
                      className={`cyber-switch cursor-pointer ${
                        aiState.secTypographyEnabled ? "active" : ""
                      }`}
                    >
                      <span className="cyber-switch-thumb" />
                    </button>
                  </div>
                </div>

                <div
                  className={`accordion-body mt-4 ${
                    aiState.secTypographyEnabled ? "" : "collapsed"
                  }`}
                >
                  <div className="accordion-inner space-y-4 pt-1 border-t border-[#23232b]/60">
                    {/* Sub-Card: EVENT NAME (TITLE) */}
                    <div className="bg-[#111115] border border-[#23232b] rounded-lg p-3.5 space-y-3.5 mt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold tracking-wider text-gray-200 uppercase">
                          EVENT NAME (TITLE)
                        </span>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={aiState.titleGlow}
                            onChange={(e) => updateAiField("titleGlow", e.target.checked)}
                            className="cyber-checkbox"
                          />
                          <span className="text-[11px] text-gray-300">Neon Glow</span>
                        </label>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="block text-[9px] font-semibold tracking-wider text-gray-400 uppercase">
                            SIZE PRESET
                          </label>
                          <div className="flex items-center bg-[#18181f] border border-[#23232b] rounded-md overflow-hidden">
                            <button
                              type="button"
                              onClick={() =>
                                stepAiSelectOption(
                                  aiState.titleSize,
                                  [22, 28, 36, 44],
                                  -1,
                                  (v) => updateAiField("titleSize", v)
                                )
                              }
                              className="px-2 py-1.5 text-gray-400 hover:text-white hover:bg-white/5 transition text-xs font-bold cursor-pointer"
                            >
                              -
                            </button>
                            <select
                              value={aiState.titleSize}
                              onChange={(e) => updateAiField("titleSize", Number(e.target.value))}
                              className="w-full bg-transparent text-[11px] text-gray-200 px-1 py-1.5 focus:outline-none"
                            >
                              <option value={22} className="bg-[#15151a]">
                                SM - Small (22px)
                              </option>
                              <option value={28} className="bg-[#15151a]">
                                MD - Medium (28px)
                              </option>
                              <option value={36} className="bg-[#15151a]">
                                XL - Extra Large (36px)
                              </option>
                              <option value={44} className="bg-[#15151a]">
                                2XL - Massive (44px)
                              </option>
                            </select>
                            <button
                              type="button"
                              onClick={() =>
                                stepAiSelectOption(
                                  aiState.titleSize,
                                  [22, 28, 36, 44],
                                  1,
                                  (v) => updateAiField("titleSize", v)
                                )
                              }
                              className="px-2 py-1.5 text-gray-400 hover:text-white hover:bg-white/5 transition text-xs font-bold cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[9px] font-semibold tracking-wider text-gray-400 uppercase">
                            FONT FAMILY
                          </label>
                          <select
                            value={aiState.titleFont}
                            onChange={(e) => updateAiField("titleFont", e.target.value)}
                            className="w-full bg-[#18181f] border border-[#23232b] rounded-md text-[11px] text-gray-200 px-2.5 py-1.5 focus:outline-none focus:border-purple-500"
                          >
                            <option value="font-display" className="bg-[#15151a]">
                              Orbitron (Cyber)
                            </option>
                            <option value="font-sans" className="bg-[#15151a]">
                              Inter (Modern)
                            </option>
                            <option value="font-mono" className="bg-[#15151a]">
                              JetBrains (Tech)
                            </option>
                            <option value="font-serif" className="bg-[#15151a]">
                              Cinzel (Luxury)
                            </option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="block text-[9px] font-semibold tracking-wider text-gray-400 uppercase">
                            VERTICAL POSITION
                          </label>
                          <select
                            value={aiState.titleVPos}
                            onChange={(e) =>
                              updateAiField(
                                "titleVPos",
                                e.target.value as "top" | "center" | "bottom"
                              )
                            }
                            className="w-full bg-[#18181f] border border-[#23232b] rounded-md text-[11px] text-gray-200 px-2.5 py-1.5 focus:outline-none focus:border-purple-500"
                          >
                            <option value="top" className="bg-[#15151a]">
                              Top / Upper
                            </option>
                            <option value="center" className="bg-[#15151a]">
                              Middle / Center
                            </option>
                            <option value="bottom" className="bg-[#15151a]">
                              Bottom / Lower
                            </option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[9px] font-semibold tracking-wider text-gray-400 uppercase">
                            HORIZONTAL ALIGN
                          </label>
                          <div className="grid grid-cols-3 gap-1 bg-[#18181f] p-0.5 rounded-md border border-[#23232b]">
                            {(
                              [
                                { id: "left", Icon: AlignLeft },
                                { id: "center", Icon: AlignCenter },
                                { id: "right", Icon: AlignRight },
                              ] as const
                            ).map(({ id, Icon }) => (
                              <button
                                key={id}
                                type="button"
                                onClick={() => updateAiField("titleAlign", id)}
                                className={`py-1 rounded flex items-center justify-center transition cursor-pointer ${
                                  aiState.titleAlign === id
                                    ? "bg-purple-600 text-white shadow"
                                    : "text-gray-400 hover:text-white"
                                }`}
                              >
                                <Icon className="w-3.5 h-3.5" />
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 items-end">
                        <div className="space-y-1">
                          <label className="block text-[9px] font-semibold tracking-wider text-gray-400 uppercase">
                            TEXT COLOR
                          </label>
                          <div className="flex items-center gap-2 bg-[#18181f] border border-[#23232b] rounded-md px-2 py-1">
                            <input
                              type="color"
                              value={aiState.titleColor}
                              onChange={(e) =>
                                handleAiSyncColor("titleColor", e.target.value, setAiHexTitle)
                              }
                              className="w-5 h-5 cursor-pointer"
                            />
                            <input
                              type="text"
                              value={aiHexTitle}
                              onChange={(e) =>
                                handleAiSyncHex("titleColor", e.target.value, setAiHexTitle)
                              }
                              className="w-full bg-transparent text-[11px] font-mono text-gray-200 uppercase focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center">
                            <label className="text-[9px] font-semibold tracking-wider text-gray-400 uppercase">
                              TEXT OPACITY
                            </label>
                            <span className="text-[9px] font-mono bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded">
                              {aiState.titleOpacity}%
                            </span>
                          </div>
                          <input
                            type="range"
                            min={10}
                            max={100}
                            value={aiState.titleOpacity}
                            onChange={(e) => updateAiField("titleOpacity", Number(e.target.value))}
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Sub-Card: EVENT DESCRIPTION (SUBTITLE) */}
                    <div className="bg-[#111115] border border-[#23232b] rounded-lg p-3.5 space-y-3.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold tracking-wider text-gray-200 uppercase">
                          EVENT DESCRIPTION (SUBTITLE)
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="block text-[9px] font-semibold tracking-wider text-gray-400 uppercase">
                            SIZE PRESET
                          </label>
                          <div className="flex items-center bg-[#18181f] border border-[#23232b] rounded-md overflow-hidden">
                            <button
                              type="button"
                              onClick={() =>
                                stepAiSelectOption(
                                  aiState.descSize,
                                  [10, 12, 15, 18],
                                  -1,
                                  (v) => updateAiField("descSize", v)
                                )
                              }
                              className="px-2 py-1.5 text-gray-400 hover:text-white hover:bg-white/5 transition text-xs font-bold cursor-pointer"
                            >
                              -
                            </button>
                            <select
                              value={aiState.descSize}
                              onChange={(e) => updateAiField("descSize", Number(e.target.value))}
                              className="w-full bg-transparent text-[11px] text-gray-200 px-1 py-1.5 focus:outline-none"
                            >
                              <option value={10} className="bg-[#15151a]">
                                XS - Micro (10px)
                              </option>
                              <option value={12} className="bg-[#15151a]">
                                SM - Small (12px)
                              </option>
                              <option value={15} className="bg-[#15151a]">
                                MD - Medium (15px)
                              </option>
                              <option value={18} className="bg-[#15151a]">
                                LG - Large (18px)
                              </option>
                            </select>
                            <button
                              type="button"
                              onClick={() =>
                                stepAiSelectOption(
                                  aiState.descSize,
                                  [10, 12, 15, 18],
                                  1,
                                  (v) => updateAiField("descSize", v)
                                )
                              }
                              className="px-2 py-1.5 text-gray-400 hover:text-white hover:bg-white/5 transition text-xs font-bold cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[9px] font-semibold tracking-wider text-gray-400 uppercase">
                            FONT FAMILY
                          </label>
                          <select
                            value={aiState.descFont}
                            onChange={(e) => updateAiField("descFont", e.target.value)}
                            className="w-full bg-[#18181f] border border-[#23232b] rounded-md text-[11px] text-gray-200 px-2.5 py-1.5 focus:outline-none focus:border-purple-500"
                          >
                            <option value="font-sans" className="bg-[#15151a]">
                              Inter (Clean Sans)
                            </option>
                            <option value="font-mono" className="bg-[#15151a]">
                              JetBrains (Mono)
                            </option>
                            <option value="font-display" className="bg-[#15151a]">
                              Orbitron (Tech)
                            </option>
                            <option value="font-editorial" className="bg-[#15151a]">
                              Playfair (Editorial)
                            </option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="block text-[9px] font-semibold tracking-wider text-gray-400 uppercase">
                            LETTER SPACING
                          </label>
                          <select
                            value={aiState.descSpacing}
                            onChange={(e) => updateAiField("descSpacing", e.target.value)}
                            className="w-full bg-[#18181f] border border-[#23232b] rounded-md text-[11px] text-gray-200 px-2.5 py-1.5 focus:outline-none focus:border-purple-500"
                          >
                            <option value="0.02em" className="bg-[#15151a]">
                              Normal (0.02em)
                            </option>
                            <option value="0.15em" className="bg-[#15151a]">
                              Wide (0.15em)
                            </option>
                            <option value="0.28em" className="bg-[#15151a]">
                              Ultra Wide (0.28em)
                            </option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[9px] font-semibold tracking-wider text-gray-400 uppercase">
                            HORIZONTAL ALIGN
                          </label>
                          <div className="grid grid-cols-3 gap-1 bg-[#18181f] p-0.5 rounded-md border border-[#23232b]">
                            {(
                              [
                                { id: "left", Icon: AlignLeft },
                                { id: "center", Icon: AlignCenter },
                                { id: "right", Icon: AlignRight },
                              ] as const
                            ).map(({ id, Icon }) => (
                              <button
                                key={id}
                                type="button"
                                onClick={() => updateAiField("descAlign", id)}
                                className={`py-1 rounded flex items-center justify-center transition cursor-pointer ${
                                  aiState.descAlign === id
                                    ? "bg-purple-600 text-white shadow"
                                    : "text-gray-400 hover:text-white"
                                }`}
                              >
                                <Icon className="w-3.5 h-3.5" />
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 items-end">
                        <div className="space-y-1">
                          <label className="block text-[9px] font-semibold tracking-wider text-gray-400 uppercase">
                            TEXT COLOR
                          </label>
                          <div className="flex items-center gap-2 bg-[#18181f] border border-[#23232b] rounded-md px-2 py-1">
                            <input
                              type="color"
                              value={aiState.descColor}
                              onChange={(e) =>
                                handleAiSyncColor("descColor", e.target.value, setAiHexDesc)
                              }
                              className="w-5 h-5 cursor-pointer"
                            />
                            <input
                              type="text"
                              value={aiHexDesc}
                              onChange={(e) =>
                                handleAiSyncHex("descColor", e.target.value, setAiHexDesc)
                              }
                              className="w-full bg-transparent text-[11px] font-mono text-gray-200 uppercase focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center">
                            <label className="text-[9px] font-semibold tracking-wider text-gray-400 uppercase">
                              TEXT OPACITY
                            </label>
                            <span className="text-[9px] font-mono bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded">
                              {aiState.descOpacity}%
                            </span>
                          </div>
                          <input
                            type="range"
                            min={10}
                            max={100}
                            value={aiState.descOpacity}
                            onChange={(e) => updateAiField("descOpacity", Number(e.target.value))}
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 3: BACKGROUND MEDIA (IMAGE & VIDEO LOOP) */}
              <section
                className={`bg-[#15151a] border border-[#23232b] rounded-xl p-4 transition-colors duration-200 ${
                  aiState.secBgMediaEnabled ? "border-purple-500/30" : ""
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div
                    className="flex items-start gap-2.5 cursor-pointer flex-1"
                    onClick={() => toggleAiSection("bgMedia")}
                  >
                    <div className="p-1.5 rounded-md bg-purple-500/10 border border-purple-500/30 text-purple-400 mt-0.5">
                      <ImageIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h2 className="font-display text-xs sm:text-sm font-bold tracking-wider text-white uppercase">
                          BACKGROUND MEDIA (IMAGE &amp; VIDEO LOOP)
                        </h2>
                        <ChevronDown
                          className={`w-3.5 h-3.5 text-purple-400 transition-transform duration-200 ${
                            aiState.secBgMediaEnabled ? "" : "-rotate-90"
                          }`}
                        />
                      </div>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        Upload an image or looping video specifically for the launch screen.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className={`text-[10px] font-mono font-bold uppercase ${
                        aiState.secBgMediaEnabled ? "text-purple-400" : "text-gray-500 font-semibold"
                      }`}
                    >
                      {aiState.secBgMediaEnabled ? "ON" : "OFF"}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleAiSection("bgMedia")}
                      aria-label="Toggle Background Media Section"
                      className={`cyber-switch cursor-pointer ${
                        aiState.secBgMediaEnabled ? "active" : ""
                      }`}
                    >
                      <span className="cyber-switch-thumb" />
                    </button>
                  </div>
                </div>

                <div
                  className={`accordion-body mt-4 ${
                    aiState.secBgMediaEnabled ? "" : "collapsed"
                  }`}
                >
                  <div className="accordion-inner space-y-4 pt-3 border-t border-[#23232b]/60">
                    <div className="space-y-2">
                      <label className="block text-[9px] font-semibold tracking-wider text-gray-400 uppercase">
                        BACKGROUND IMAGE
                      </label>
                      <input
                        ref={aiBgImageInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAiBgImageUpload}
                      />
                      <button
                        type="button"
                        onClick={() => aiBgImageInputRef.current?.click()}
                        className="w-full py-2.5 px-3 rounded-lg border border-dashed border-gray-600 hover:border-purple-500 bg-[#18181f] hover:bg-purple-600/10 text-xs text-gray-300 flex items-center justify-center gap-2 transition cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5 text-purple-400" />
                        Upload Image (Max 5MB)
                      </button>
                      <input
                        type="text"
                        placeholder="Or paste image URL (https://...)"
                        value={aiImageUrlInput}
                        onChange={(e) => handleAiBgImageUrl(e.target.value)}
                        className="w-full bg-[#18181f] border border-[#23232b] rounded-md px-3 py-1.5 text-[11px] text-gray-200 placeholder-gray-500 focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <div className="space-y-2 pt-1">
                      <label className="block text-[9px] font-semibold tracking-wider text-gray-400 uppercase">
                        BACKGROUND VIDEO LOOP
                      </label>
                      <input
                        ref={aiBgVideoInputRef}
                        type="file"
                        accept="video/mp4,video/webm"
                        className="hidden"
                        onChange={handleAiBgVideoUpload}
                      />

                      <div className="bg-[#18181f] border border-[#23232b] rounded-lg p-2.5 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-14 h-10 rounded bg-black border border-gray-800 overflow-hidden flex-shrink-0 relative flex items-center justify-center">
                            <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/40 via-slate-800/40 to-cyan-900/30 animate-pulse" />
                            <Film className="w-4 h-4 text-gray-400 relative z-10" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-white truncate">
                              {aiState.bgVideoLabel}
                            </p>
                            <p className="text-[10px] text-gray-400">{aiState.bgVideoSub}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <button
                                type="button"
                                onClick={() => aiBgVideoInputRef.current?.click()}
                                className="text-[10px] font-semibold text-purple-400 hover:text-purple-300 uppercase cursor-pointer"
                              >
                                REPLACE
                              </button>
                              <span className="text-gray-600 text-[10px]">•</span>
                              <button
                                type="button"
                                onClick={removeAiBgMedia}
                                className="text-[10px] font-semibold text-rose-400 hover:text-rose-300 uppercase cursor-pointer"
                              >
                                REMOVE
                              </button>
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={removeAiBgMedia}
                          title="Hapus Media"
                          className="p-1.5 text-gray-500 hover:text-rose-400 transition cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <input
                        type="text"
                        placeholder="https://example.com/loop-video.mp4"
                        value={aiVideoUrlInput}
                        onChange={(e) => handleAiBgVideoUrl(e.target.value)}
                        className="w-full bg-[#18181f] border border-[#23232b] rounded-md px-3 py-1.5 text-[11px] text-gray-300 placeholder-gray-500 focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between">
                        <label className="text-[9px] font-semibold tracking-wider text-gray-400 uppercase">
                          BACKGROUND DIMMER / OVERLAY
                        </label>
                        <span className="text-[10px] font-mono text-purple-400 font-semibold">
                          {aiState.dimmer}%
                        </span>
                      </div>
                      <div className="grid grid-cols-6 gap-1.5">
                        {[0, 20, 30, 40, 70, 90].map((dim) => (
                          <button
                            key={dim}
                            type="button"
                            onClick={() => updateAiField("dimmer", dim)}
                            className={`py-1.5 rounded text-[10px] font-mono border transition cursor-pointer ${
                              aiState.dimmer === dim
                                ? "border-purple-500 bg-purple-600/20 text-white font-bold"
                                : "border-[#23232b] bg-[#18181f] text-gray-400 hover:text-white"
                            }`}
                          >
                            {dim}%
                          </button>
                        ))}
                      </div>
                      <p className="text-[10px] text-gray-500">
                        Controls how dark the background overlay is (0% is fully clear).
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 4: LOGO (OPTIONAL) CONFIGURATION */}
              <section
                className={`bg-[#15151a] border border-[#23232b] rounded-xl p-4 transition-colors duration-200 ${
                  aiState.secLogoEnabled ? "border-purple-500/30" : ""
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div
                    className="flex items-start gap-2.5 cursor-pointer flex-1"
                    onClick={() => toggleAiSection("logo")}
                  >
                    <div className="p-1.5 rounded-md bg-purple-500/10 border border-purple-500/30 text-purple-400 mt-0.5">
                      <BadgeCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h2 className="font-display text-xs sm:text-sm font-bold tracking-wider text-white uppercase">
                          LOGO (OPTIONAL) CONFIGURATION
                        </h2>
                        <ChevronDown
                          className={`w-3.5 h-3.5 text-purple-400 transition-transform duration-200 ${
                            aiState.secLogoEnabled ? "" : "-rotate-90"
                          }`}
                        />
                      </div>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        Upload or link your brand logo, adjust size, position, and opacity.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className={`text-[10px] font-mono font-bold uppercase ${
                        aiState.secLogoEnabled ? "text-purple-400" : "text-gray-500 font-semibold"
                      }`}
                    >
                      {aiState.secLogoEnabled ? "ON" : "OFF"}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleAiSection("logo")}
                      aria-label="Toggle Logo Section"
                      className={`cyber-switch cursor-pointer ${
                        aiState.secLogoEnabled ? "active" : ""
                      }`}
                    >
                      <span className="cyber-switch-thumb" />
                    </button>
                  </div>
                </div>

                <div
                  className={`accordion-body mt-4 ${aiState.secLogoEnabled ? "" : "collapsed"}`}
                >
                  <div className="accordion-inner space-y-4 pt-3 border-t border-[#23232b]/60">
                    <div className="flex items-center gap-3.5">
                      <div className="w-20 h-20 rounded-lg bg-[#18181f] border border-dashed border-gray-700 flex flex-col items-center justify-center text-gray-500 flex-shrink-0 overflow-hidden relative">
                        {aiState.logoUrl && !logoLoadError ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={aiState.logoUrl}
                            alt="Logo preview"
                            className="w-full h-full object-contain p-1.5"
                            onError={() => setLogoLoadError(true)}
                          />
                        ) : logoLoadError ? (
                          <span className="text-[9px] text-rose-400">Invalid URL</span>
                        ) : (
                          <>
                            <ImagePlus className="w-5 h-5 mb-1" />
                            <span className="text-[9px] uppercase tracking-wider">NO LOGO</span>
                          </>
                        )}
                      </div>

                      <div className="flex-1 space-y-2">
                        <input
                          ref={aiLogoInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleAiLogoUpload}
                        />
                        <button
                          type="button"
                          onClick={() => aiLogoInputRef.current?.click()}
                          className="w-full py-2 px-3 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-200 text-[11px] font-semibold tracking-wider uppercase flex items-center justify-center gap-2 transition cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          UPLOAD LOGO FILE (MAX 2MB)
                        </button>
                        <div>
                          <label className="block text-[9px] font-semibold tracking-wider text-gray-400 uppercase mb-1">
                            OR DIRECT IMAGE URL
                          </label>
                          <div className="flex gap-1.5">
                            <input
                              type="text"
                              placeholder="https://example.com/logo.png"
                              value={aiLogoUrlInput}
                              onChange={(e) => handleAiLogoUrl(e.target.value)}
                              className="w-full bg-[#18181f] border border-[#23232b] rounded-md px-2.5 py-1.5 text-[11px] text-gray-200 placeholder-gray-500 focus:outline-none focus:border-purple-500"
                            />
                            <button
                              type="button"
                              onClick={clearAiLogo}
                              title="Hapus Logo"
                              className="px-2 bg-[#18181f] hover:bg-rose-500/20 border border-[#23232b] hover:border-rose-500/40 rounded-md text-gray-400 hover:text-rose-300 transition cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="block text-[9px] font-semibold tracking-wider text-gray-400 uppercase">
                          LOGO SIZE
                        </label>
                        <div className="flex items-center bg-[#18181f] border border-[#23232b] rounded-md overflow-hidden">
                          <button
                            type="button"
                            onClick={() =>
                              stepAiSelectOption(
                                aiState.logoSize,
                                [32, 48, 64, 88, 112],
                                -1,
                                (v) => updateAiField("logoSize", v)
                              )
                            }
                            className="px-2 py-1.5 text-gray-400 hover:text-white hover:bg-white/5 transition text-xs font-bold cursor-pointer"
                          >
                            -
                          </button>
                          <select
                            value={aiState.logoSize}
                            onChange={(e) => updateAiField("logoSize", Number(e.target.value))}
                            className="w-full bg-transparent text-[11px] text-gray-200 px-1 py-1.5 focus:outline-none"
                          >
                            <option value={32} className="bg-[#15151a]">
                              XS - 32px
                            </option>
                            <option value={48} className="bg-[#15151a]">
                              SM - 48px
                            </option>
                            <option value={64} className="bg-[#15151a]">
                              MD - 64px
                            </option>
                            <option value={88} className="bg-[#15151a]">
                              LG - 88px
                            </option>
                            <option value={112} className="bg-[#15151a]">
                              XL - 112px
                            </option>
                          </select>
                          <button
                            type="button"
                            onClick={() =>
                              stepAiSelectOption(
                                aiState.logoSize,
                                [32, 48, 64, 88, 112],
                                1,
                                (v) => updateAiField("logoSize", v)
                              )
                            }
                            className="px-2 py-1.5 text-gray-400 hover:text-white hover:bg-white/5 transition text-xs font-bold cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[9px] font-semibold tracking-wider text-gray-400 uppercase">
                          LOGO POSITION
                        </label>
                        <select
                          value={aiState.logoPos}
                          onChange={(e) =>
                            updateAiField("logoPos", e.target.value as LogoPositionType)
                          }
                          className="w-full bg-[#18181f] border border-[#23232b] rounded-md text-[11px] text-gray-200 px-2.5 py-1.5 focus:outline-none focus:border-purple-500"
                        >
                          <option value="top" className="bg-[#15151a]">
                            Top (Above Title)
                          </option>
                          <option value="below-title" className="bg-[#15151a]">
                            Below Title
                          </option>
                          <option value="bottom" className="bg-[#15151a]">
                            Bottom Footer
                          </option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 items-end">
                      <div className="space-y-1">
                        <label className="block text-[9px] font-semibold tracking-wider text-gray-400 uppercase">
                          ALIGNMENT
                        </label>
                        <div className="grid grid-cols-3 gap-1 bg-[#18181f] p-0.5 rounded-md border border-[#23232b]">
                          {(
                            [
                              { id: "left", Icon: AlignLeft },
                              { id: "center", Icon: AlignCenter },
                              { id: "right", Icon: AlignRight },
                            ] as const
                          ).map(({ id, Icon }) => (
                            <button
                              key={id}
                              type="button"
                              onClick={() => updateAiField("logoAlign", id)}
                              className={`py-1 rounded flex items-center justify-center transition cursor-pointer ${
                                aiState.logoAlign === id
                                  ? "bg-purple-600 text-white shadow"
                                  : "text-gray-400 hover:text-white"
                              }`}
                            >
                              <Icon className="w-3.5 h-3.5" />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <label className="text-[9px] font-semibold tracking-wider text-gray-400 uppercase">
                            LOGO OPACITY
                          </label>
                          <span className="text-[9px] font-mono bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded">
                            {aiState.logoOpacity}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min={10}
                          max={100}
                          value={aiState.logoOpacity}
                          onChange={(e) => updateAiField("logoOpacity", Number(e.target.value))}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 5: BUTTONS STYLING & SHAPE */}
              <section
                className={`bg-[#15151a] border border-[#23232b] rounded-xl p-4 transition-colors duration-200 ${
                  aiState.secButtonsEnabled ? "border-purple-500/30" : ""
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div
                    className="flex items-start gap-2.5 cursor-pointer flex-1"
                    onClick={() => toggleAiSection("buttons")}
                  >
                    <div className="p-1.5 rounded-md bg-purple-500/10 border border-purple-500/30 text-purple-400 mt-0.5">
                      <MousePointerClick className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h2 className="font-display text-xs sm:text-sm font-bold tracking-wider text-white uppercase">
                          BUTTONS STYLING &amp; SHAPE
                        </h2>
                        <ChevronDown
                          className={`w-3.5 h-3.5 text-purple-400 transition-transform duration-200 ${
                            aiState.secButtonsEnabled ? "" : "-rotate-90"
                          }`}
                        />
                      </div>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        Dimensions, shapes, borders, glow effects, opacity, and colors.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className={`text-[10px] font-mono font-bold uppercase ${
                        aiState.secButtonsEnabled ? "text-purple-400" : "text-gray-500 font-semibold"
                      }`}
                    >
                      {aiState.secButtonsEnabled ? "ON" : "OFF"}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleAiSection("buttons")}
                      aria-label="Toggle Buttons Section"
                      className={`cyber-switch cursor-pointer ${
                        aiState.secButtonsEnabled ? "active" : ""
                      }`}
                    >
                      <span className="cyber-switch-thumb" />
                    </button>
                  </div>
                </div>

                <div
                  className={`accordion-body mt-4 ${
                    aiState.secButtonsEnabled ? "" : "collapsed"
                  }`}
                >
                  <div className="accordion-inner space-y-4 pt-3 border-t border-[#23232b]/60">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="block text-[9px] font-semibold tracking-wider text-gray-400 uppercase">
                          BUTTON SIZE
                        </label>
                        <div className="flex items-center bg-[#18181f] border border-[#23232b] rounded-md overflow-hidden">
                          <button
                            type="button"
                            onClick={() =>
                              stepAiSelectOption(
                                aiState.btnSize,
                                ["sm", "md", "lg"],
                                -1,
                                (v) => updateAiField("btnSize", v)
                              )
                            }
                            className="px-2 py-1.5 text-gray-400 hover:text-white hover:bg-white/5 transition text-xs font-bold cursor-pointer"
                          >
                            -
                          </button>
                          <select
                            value={aiState.btnSize}
                            onChange={(e) =>
                              updateAiField("btnSize", e.target.value as ButtonSizeType)
                            }
                            className="w-full bg-transparent text-[11px] text-gray-200 px-1 py-1.5 focus:outline-none"
                          >
                            <option value="sm" className="bg-[#15151a]">
                              SM (Compact)
                            </option>
                            <option value="md" className="bg-[#15151a]">
                              MD (Standard)
                            </option>
                            <option value="lg" className="bg-[#15151a]">
                              LG (Large)
                            </option>
                          </select>
                          <button
                            type="button"
                            onClick={() =>
                              stepAiSelectOption(
                                aiState.btnSize,
                                ["sm", "md", "lg"],
                                1,
                                (v) => updateAiField("btnSize", v)
                              )
                            }
                            className="px-2 py-1.5 text-gray-400 hover:text-white hover:bg-white/5 transition text-xs font-bold cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[9px] font-semibold tracking-wider text-gray-400 uppercase">
                          BUTTON WIDTH
                        </label>
                        <select
                          value={aiState.btnWidth}
                          onChange={(e) =>
                            updateAiField("btnWidth", e.target.value as ButtonWidthType)
                          }
                          className="w-full bg-[#18181f] border border-[#23232b] rounded-md text-[11px] text-gray-200 px-2.5 py-1.5 focus:outline-none focus:border-purple-500"
                        >
                          <option value="auto" className="bg-[#15151a]">
                            Auto Fit
                          </option>
                          <option value="medium" className="bg-[#15151a]">
                            Medium (120px)
                          </option>
                          <option value="wide" className="bg-[#15151a]">
                            Wide (160px)
                          </option>
                          <option value="full" className="bg-[#15151a]">
                            Full Width
                          </option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="block text-[9px] font-semibold tracking-wider text-gray-400 uppercase">
                          CORNER RADIUS / SHAPE
                        </label>
                        <select
                          value={aiState.btnShape}
                          onChange={(e) =>
                            updateAiField("btnShape", e.target.value as ButtonShapeType)
                          }
                          className="w-full bg-[#18181f] border border-[#23232b] rounded-md text-[11px] text-gray-200 px-2.5 py-1.5 focus:outline-none focus:border-purple-500"
                        >
                          <option value="sharp" className="bg-[#15151a]">
                            Sharp / Cyber (4px)
                          </option>
                          <option value="rounded" className="bg-[#15151a]">
                            Rounded (10px)
                          </option>
                          <option value="pill" className="bg-[#15151a]">
                            Pill / Capsule (99px)
                          </option>
                          <option value="square" className="bg-[#15151a]">
                            Brutalist Square (0px)
                          </option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[9px] font-semibold tracking-wider text-gray-400 uppercase">
                          BUTTON POSITION
                        </label>
                        <select
                          value={aiState.btnPos}
                          onChange={(e) =>
                            updateAiField("btnPos", e.target.value as ButtonPositionType)
                          }
                          className="w-full bg-[#18181f] border border-[#23232b] rounded-md text-[11px] text-gray-200 px-2.5 py-1.5 focus:outline-none focus:border-purple-500"
                        >
                          <option value="below-title" className="bg-[#15151a]">
                            Center (Below Title)
                          </option>
                          <option value="bottom" className="bg-[#15151a]">
                            Bottom Docked
                          </option>
                        </select>
                      </div>
                    </div>

                    {/* Sub-Card: PRIMARY LAUNCH BUTTON COLORS */}
                    <div className="bg-[#111115] border border-[#23232b] rounded-lg p-3.5 space-y-3.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold tracking-wider text-gray-200 uppercase">
                          PRIMARY LAUNCH BUTTON COLORS
                        </span>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={aiState.btnGlow}
                            onChange={(e) => updateAiField("btnGlow", e.target.checked)}
                            className="cyber-checkbox"
                          />
                          <span className="text-[11px] text-gray-300">Button Glow</span>
                        </label>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="block text-[9px] font-semibold tracking-wider text-gray-400 uppercase">
                            BACKGROUND COLOR
                          </label>
                          <div className="flex items-center gap-2 bg-[#18181f] border border-[#23232b] rounded-md px-2 py-1">
                            <input
                              type="color"
                              value={aiState.primaryBg}
                              onChange={(e) =>
                                handleAiSyncColor("primaryBg", e.target.value, setAiHexPrimaryBg)
                              }
                              className="w-5 h-5 cursor-pointer"
                            />
                            <input
                              type="text"
                              value={aiHexPrimaryBg}
                              onChange={(e) =>
                                handleAiSyncHex("primaryBg", e.target.value, setAiHexPrimaryBg)
                              }
                              className="w-full bg-transparent text-[11px] font-mono text-gray-200 uppercase focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[9px] font-semibold tracking-wider text-gray-400 uppercase">
                            TEXT COLOR
                          </label>
                          <div className="flex items-center gap-2 bg-[#18181f] border border-[#23232b] rounded-md px-2 py-1">
                            <input
                              type="color"
                              value={aiState.primaryText}
                              onChange={(e) =>
                                handleAiSyncColor(
                                  "primaryText",
                                  e.target.value,
                                  setAiHexPrimaryText
                                )
                              }
                              className="w-5 h-5 cursor-pointer"
                            />
                            <input
                              type="text"
                              value={aiHexPrimaryText}
                              onChange={(e) =>
                                handleAiSyncHex("primaryText", e.target.value, setAiHexPrimaryText)
                              }
                              className="w-full bg-transparent text-[11px] font-mono text-gray-200 uppercase focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 items-end">
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center">
                            <label className="text-[9px] font-semibold tracking-wider text-gray-400 uppercase">
                              BACKGROUND OPACITY
                            </label>
                            <span className="text-[9px] font-mono bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded">
                              {aiState.primaryOpacity}%
                            </span>
                          </div>
                          <input
                            type="range"
                            min={10}
                            max={100}
                            value={aiState.primaryOpacity}
                            onChange={(e) =>
                              updateAiField("primaryOpacity", Number(e.target.value))
                            }
                            className="w-full"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[9px] font-semibold tracking-wider text-gray-400 uppercase">
                            BORDER WIDTH
                          </label>
                          <select
                            value={aiState.primaryBorder}
                            onChange={(e) =>
                              updateAiField("primaryBorder", Number(e.target.value))
                            }
                            className="w-full bg-[#18181f] border border-[#23232b] rounded-md text-[11px] text-gray-200 px-2.5 py-1.5 focus:outline-none focus:border-purple-500"
                          >
                            <option value={0} className="bg-[#15151a]">
                              None (0px)
                            </option>
                            <option value={1} className="bg-[#15151a]">
                              Standard (1px)
                            </option>
                            <option value={2} className="bg-[#15151a]">
                              Thick (2px)
                            </option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Sub-Card: SECONDARY GALLERY BUTTON COLORS */}
                    <div className="bg-[#111115] border border-[#23232b] rounded-lg p-3.5 space-y-3.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold tracking-wider text-gray-200 uppercase">
                          SECONDARY GALLERY BUTTON COLORS
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="block text-[9px] font-semibold tracking-wider text-gray-400 uppercase">
                            BACKGROUND COLOR
                          </label>
                          <div className="flex items-center gap-2 bg-[#18181f] border border-[#23232b] rounded-md px-2 py-1">
                            <input
                              type="color"
                              value={aiState.secondaryBg}
                              onChange={(e) =>
                                handleAiSyncColor(
                                  "secondaryBg",
                                  e.target.value,
                                  setAiHexSecondaryBg
                                )
                              }
                              className="w-5 h-5 cursor-pointer"
                            />
                            <input
                              type="text"
                              value={aiHexSecondaryBg}
                              onChange={(e) =>
                                handleAiSyncHex(
                                  "secondaryBg",
                                  e.target.value,
                                  setAiHexSecondaryBg
                                )
                              }
                              className="w-full bg-transparent text-[11px] font-mono text-gray-200 uppercase focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[9px] font-semibold tracking-wider text-gray-400 uppercase">
                            TEXT COLOR
                          </label>
                          <div className="flex items-center gap-2 bg-[#18181f] border border-[#23232b] rounded-md px-2 py-1">
                            <input
                              type="color"
                              value={aiState.secondaryText}
                              onChange={(e) =>
                                handleAiSyncColor(
                                  "secondaryText",
                                  e.target.value,
                                  setAiHexSecondaryText
                                )
                              }
                              className="w-5 h-5 cursor-pointer"
                            />
                            <input
                              type="text"
                              value={aiHexSecondaryText}
                              onChange={(e) =>
                                handleAiSyncHex(
                                  "secondaryText",
                                  e.target.value,
                                  setAiHexSecondaryText
                                )
                              }
                              className="w-full bg-transparent text-[11px] font-mono text-gray-200 uppercase focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <label className="text-[9px] font-semibold tracking-wider text-gray-400 uppercase">
                            BACKGROUND OPACITY
                          </label>
                          <span className="text-[9px] font-mono bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded">
                            {aiState.secondaryOpacity}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={aiState.secondaryOpacity}
                          onChange={(e) =>
                            updateAiField("secondaryOpacity", Number(e.target.value))
                          }
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </aside>

          {/* RIGHT PANEL: STICKY LIVE PREVIEW */}
          <main className="flex-1 dot-grid flex flex-col h-1/2 lg:h-full overflow-hidden">
            <div className="px-6 py-3.5 border-b border-[#23232b]/80 bg-[#0d0d11]/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <h2 className="font-display text-xs sm:text-sm font-bold tracking-widest text-white uppercase">
                  LIVE PREVIEW
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30">
                  {aiState.launchType === "standard" ? "STANDARD MODE" : "VIDEO START MODE"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center bg-[#16161d] p-1 rounded-lg border border-[#23232b]">
                  <button
                    type="button"
                    onClick={() => updateAiField("previewDevice", "mobile")}
                    className={`px-2.5 py-1 rounded text-[11px] font-medium flex items-center gap-1.5 transition cursor-pointer ${
                      aiState.previewDevice === "mobile"
                        ? "bg-purple-600 text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" /> Portrait
                  </button>
                  <button
                    type="button"
                    onClick={() => updateAiField("previewDevice", "desktop")}
                    className={`px-2.5 py-1 rounded text-[11px] font-medium flex items-center gap-1.5 transition cursor-pointer ${
                      aiState.previewDevice === "desktop"
                        ? "bg-purple-600 text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" /> Landscape
                  </button>
                </div>

                <button
                  type="button"
                  onClick={triggerAiExitPreview}
                  className="px-3 py-1.5 rounded-lg bg-[#181820] hover:bg-purple-600/20 border border-[#23232b] hover:border-purple-500/50 text-xs text-gray-200 flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Simulasi Launch
                </button>
              </div>
            </div>

            <div className="flex-1 flex items-center justify-center p-6 sm:p-10 overflow-auto">
              <div
                className={`relative border-[3px] border-[#262631] bg-[#070709] shadow-[0_25px_70px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(147,51,234,0.12)] overflow-hidden transition-all duration-300 flex flex-col ${
                  aiState.previewDevice === "mobile"
                    ? "w-[290px] sm:w-[320px] h-[540px] sm:h-[580px] rounded-[24px]"
                    : "w-full max-w-[680px] h-[390px] sm:h-[420px] rounded-[18px]"
                }`}
              >
                {/* Simulated Gameplay Layer Underneath */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#120b24] via-[#09090d] to-[#0a192f] flex flex-col items-center justify-center p-6 text-center z-0">
                  <div className="w-14 h-14 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 mb-3 animate-bounce">
                    <Gamepad2 className="w-7 h-7" />
                  </div>
                  <p className="font-display text-sm font-bold tracking-wider text-white uppercase">
                    EXPERIENCE STARTED
                  </p>
                  <p className="text-xs text-gray-400 mt-1 max-w-[220px]">
                    Transisi berhasil dijalankan menuju layar utama aplikasi/game.
                  </p>
                  <button
                    type="button"
                    onClick={restoreAiLaunchScreen}
                    className="mt-5 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold tracking-wider uppercase shadow-lg transition cursor-pointer"
                  >
                    Kembali ke Launch Screen
                  </button>
                </div>

                {/* LAUNCH SCREEN ACTIVE LAYER */}
                <div
                  onClick={() => {
                    if (aiState.launchLayout === "touch-anywhere") {
                      triggerAiExitPreview();
                    }
                  }}
                  style={getAiExitTransformStyle()}
                  className="relative z-10 w-full h-full flex flex-col justify-between overflow-hidden select-none"
                >
                  {/* Split Animation Halves */}
                  {aiState.exitAnimation === "split-h" ? (
                    <>
                      <div
                        className={`absolute inset-x-0 top-0 h-1/2 pointer-events-none z-30 bg-[#070709] ${
                          aiSplitActive ? "exit-split-h-top" : "hidden"
                        }`}
                      />
                      <div
                        className={`absolute inset-x-0 bottom-0 h-1/2 pointer-events-none z-30 bg-[#070709] ${
                          aiSplitActive ? "exit-split-h-bottom" : "hidden"
                        }`}
                      />
                    </>
                  ) : aiState.exitAnimation === "split-v" ? (
                    <>
                      <div
                        className={`absolute inset-y-0 left-0 w-1/2 pointer-events-none z-30 bg-[#070709] ${
                          aiSplitActive ? "exit-split-v-left" : "hidden"
                        }`}
                      />
                      <div
                        className={`absolute inset-y-0 right-0 w-1/2 pointer-events-none z-30 bg-[#070709] ${
                          aiSplitActive ? "exit-split-v-right" : "hidden"
                        }`}
                      />
                    </>
                  ) : null}

                  {/* BACKGROUND MEDIA LAYER */}
                  <div className="absolute inset-0 z-0 overflow-hidden bg-[#060608]">
                    {aiState.secBgMediaEnabled &&
                    aiState.bgMediaType === "image" &&
                    aiState.bgImageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={aiState.bgImageUrl}
                        alt="Background"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : aiState.secBgMediaEnabled &&
                      aiState.bgMediaType === "video" &&
                      aiState.bgVideoUrl ? (
                      <video
                        src={aiState.bgVideoUrl}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : aiState.secBgMediaEnabled ? (
                      <div className="absolute inset-0 opacity-90">
                        <div className="absolute -inset-10 animate-mist">
                          <svg
                            viewBox="0 0 400 700"
                            className="w-full h-full object-cover opacity-60"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <defs>
                              <radialGradient id="smoke1" cx="30%" cy="25%" r="55%">
                                <stop offset="0%" stopColor="#3b4252" stopOpacity="0.55" />
                                <stop offset="100%" stopColor="#050507" stopOpacity="0" />
                              </radialGradient>
                              <radialGradient id="smoke2" cx="75%" cy="65%" r="60%">
                                <stop offset="0%" stopColor="#4c1d95" stopOpacity="0.35" />
                                <stop offset="60%" stopColor="#1e293b" stopOpacity="0.3" />
                                <stop offset="100%" stopColor="#050507" stopOpacity="0" />
                              </radialGradient>
                              <radialGradient id="smoke3" cx="20%" cy="85%" r="50%">
                                <stop offset="0%" stopColor="#334155" stopOpacity="0.5" />
                                <stop offset="100%" stopColor="#050507" stopOpacity="0" />
                              </radialGradient>
                            </defs>
                            <rect width="400" height="700" fill="#060608" />
                            <circle cx="110" cy="180" r="220" fill="url(#smoke1)" />
                            <circle cx="300" cy="460" r="240" fill="url(#smoke2)" />
                            <circle cx="90" cy="600" r="200" fill="url(#smoke3)" />
                          </svg>
                        </div>
                      </div>
                    ) : null}

                    {/* Dimmer Overlay */}
                    <div
                      className="absolute inset-0 bg-black transition-opacity duration-200"
                      style={{
                        opacity: aiState.secBgMediaEnabled ? aiState.dimmer / 100 : 0.92,
                      }}
                    />
                  </div>

                  {/* TOP UTILITY ICONS */}
                  <div className="relative z-20 flex items-center justify-between p-4">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        showToast("Membuka Quick Settings Modal...");
                      }}
                      style={{
                        visibility: aiState.enableSettingsBtn ? "visible" : "hidden",
                      }}
                      className="w-8 h-8 rounded-full bg-black/40 hover:bg-purple-600/40 border border-white/15 backdrop-blur-md flex items-center justify-center text-gray-200 transition cursor-pointer"
                    >
                      <Settings className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const nextDevice =
                          aiState.previewDevice === "mobile" ? "desktop" : "mobile";
                        updateAiField("previewDevice", nextDevice);
                        showToast(
                          `Tampilan diubah ke mode ${
                            nextDevice === "mobile" ? "Portrait" : "Landscape"
                          }`
                        );
                      }}
                      style={{
                        visibility: aiState.enableFullscreenBtn ? "visible" : "hidden",
                      }}
                      className="w-8 h-8 rounded-full bg-black/40 hover:bg-purple-600/40 border border-white/15 backdrop-blur-md flex items-center justify-center text-gray-200 transition cursor-pointer"
                    >
                      <Monitor className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* MAIN CONTENT STACK */}
                  <div
                    className={`relative z-20 flex-1 flex flex-col px-6 py-4 transition-all duration-200 ${
                      (aiState.secTypographyEnabled ? aiState.titleVPos : "center") === "top"
                        ? "justify-start pt-6"
                        : (aiState.secTypographyEnabled ? aiState.titleVPos : "center") ===
                            "bottom"
                          ? "justify-end pb-6"
                          : "justify-center"
                    }`}
                  >
                    {renderAiLogoElement("top")}

                    <div className="space-y-1.5">
                      {aiState.enableEventName && (
                        <h3
                          style={
                            aiState.secTypographyEnabled
                              ? {
                                  fontSize: `${
                                    aiState.previewDevice === "mobile"
                                      ? Math.round(aiState.titleSize * 0.72)
                                      : aiState.titleSize
                                  }px`,
                                  color: aiState.titleColor,
                                  opacity: aiState.titleOpacity / 100,
                                  textAlign: aiState.titleAlign,
                                  textShadow: aiState.titleGlow
                                    ? `0 0 18px ${hexToRgba(
                                        aiState.primaryBg,
                                        0.85
                                      )}, 0 2px 10px rgba(0,0,0,0.9)`
                                    : "0 2px 8px rgba(0,0,0,0.8)",
                                }
                              : {
                                  fontSize:
                                    aiState.previewDevice === "mobile" ? "22px" : "28px",
                                  color: "#ffffff",
                                  opacity: 1,
                                  textAlign: "center",
                                  textShadow: "none",
                                }
                          }
                          className={`${
                            aiState.secTypographyEnabled ? aiState.titleFont : "font-sans"
                          } font-black uppercase tracking-wider leading-tight break-words transition-all duration-150`}
                        >
                          {aiState.eventName || "EVENT TITLE"}
                        </h3>
                      )}

                      {aiState.enableEventDesc && (
                        <p
                          style={
                            aiState.secTypographyEnabled
                              ? {
                                  fontSize: `${
                                    aiState.previewDevice === "mobile"
                                      ? Math.max(9, Math.round(aiState.descSize * 0.85))
                                      : aiState.descSize
                                  }px`,
                                  letterSpacing: aiState.descSpacing,
                                  color: aiState.descColor,
                                  opacity: aiState.descOpacity / 100,
                                  textAlign: aiState.descAlign,
                                }
                              : {
                                  fontSize: "11px",
                                  letterSpacing: "0.08em",
                                  color: "#9ca3af",
                                  opacity: 0.85,
                                  textAlign: "center",
                                }
                          }
                          className={`${
                            aiState.secTypographyEnabled ? aiState.descFont : "font-sans"
                          } uppercase leading-relaxed break-words transition-all duration-150`}
                        >
                          {aiState.eventDesc || ""}
                        </p>
                      )}
                    </div>

                    {renderAiLogoElement("below-title")}

                    {aiState.secButtonsEnabled && aiState.btnPos === "below-title" && (
                      <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
                        {renderAiButtons()}
                      </div>
                    )}
                  </div>

                  {/* BOTTOM DOCKED AREA */}
                  <div className="relative z-20 px-6 pb-6 flex flex-col items-center gap-3">
                    {aiState.secButtonsEnabled && aiState.btnPos === "bottom" && (
                      <div className="w-full flex flex-wrap items-center justify-center gap-2.5">
                        {renderAiButtons()}
                      </div>
                    )}
                    {renderAiLogoElement("bottom")}
                  </div>
                </div>

                {/* Gallery Modal Overlay inside Device Frame */}
                {aiGalleryModalOpen && (
                  <div className="absolute inset-0 z-40 bg-black/90 backdrop-blur-md p-5 flex flex-col">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <span className="font-display text-xs font-bold tracking-wider text-white uppercase flex items-center gap-1.5">
                        <Grid className="w-3.5 h-3.5 text-purple-400" /> EVENT GALLERY
                      </span>
                      <button
                        type="button"
                        onClick={() => setAiGalleryModalOpen(false)}
                        className="p-1 rounded-md bg-white/10 hover:bg-rose-500/30 text-white transition cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2.5 mt-4 overflow-y-auto flex-1">
                      <div className="rounded-lg bg-gradient-to-br from-purple-900/50 to-slate-900 border border-white/10 p-2 flex flex-col justify-end h-28">
                        <span className="text-[10px] font-mono text-purple-300">
                          #01 CAPTURE
                        </span>
                      </div>
                      <div className="rounded-lg bg-gradient-to-br from-cyan-900/40 to-slate-900 border border-white/10 p-2 flex flex-col justify-end h-28">
                        <span className="text-[10px] font-mono text-cyan-300">
                          #02 CAPTURE
                        </span>
                      </div>
                      <div className="rounded-lg bg-gradient-to-br from-fuchsia-900/40 to-slate-900 border border-white/10 p-2 flex flex-col justify-end h-28">
                        <span className="text-[10px] font-mono text-fuchsia-300">
                          #03 CAPTURE
                        </span>
                      </div>
                      <div className="rounded-lg bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-white/10 p-2 flex flex-col justify-end h-28">
                        <span className="text-[10px] font-mono text-indigo-300">
                          #04 CAPTURE
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      ) : (
        /* =====================================================================
           TAB 2: CAPTURE SCREEN KONVENSIONAL (EXISTING IMPLEMENTATION)
           ===================================================================== */
        <div className="bg-[#1b1b1b] text-gray-200 font-sans flex-1 flex flex-col overflow-hidden">
          <header className="bg-[#0b061a] border-b border-[#444] px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 z-20">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={startSimulation}
                disabled={isSimulating}
                className="flex items-center gap-1.5 bg-[#8e24aa] hover:bg-purple-600 disabled:opacity-50 text-white text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded shadow transition"
              >
                {isSimulating ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Play size={14} />
                )}
                Test Capture
              </button>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="bg-[#3a3a3a] hover:bg-[#4a4a4a] text-gray-300 p-1.5 rounded border border-[#444] transition"
              >
                <RotateCcw size={14} />
              </button>
            </div>
          </header>

          <div className="flex-1 flex overflow-hidden relative">
            {/* SIDEBAR */}
            <aside
              className={`bg-[#0f0f12] border-r border-[#444] flex flex-col transition-all duration-300 z-10 relative ${
                sidebarOpen ? "w-full md:w-[340px] lg:w-[370px]" : "w-0 overflow-hidden"
              }`}
            >
              <div className="py-2.5 px-4 border-b border-[#444] flex items-center justify-center gap-2 text-xs font-bold tracking-widest text-gray-200 uppercase font-display">
                <Settings size={14} className="text-purple-400" />
                SETTINGS
              </div>

              <button
                type="button"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="hidden md:flex items-center justify-center w-6 h-6 rounded-full bg-[#3a3a3a] border border-[#444] text-gray-300 hover:text-white absolute -right-3 top-12 z-30 shadow-md"
              >
                {sidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
              </button>

              <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
                {/* Capture Screen Settings */}
                <div className="space-y-3.5 pb-4 border-b border-[#444]">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-gray-100">
                    Capture Screen Settings
                  </h2>

                  {[
                    {
                      label: "Show live view",
                      desc: "Display video preview during countdown",
                      val: showLive,
                      set: setShowLive,
                    },
                    {
                      label: "Crop live view",
                      desc: "Match template aspect ratio",
                      val: cropLive,
                      set: setCropLive,
                    },
                    {
                      label: "Mirror live view",
                      desc: "Mirror guest movement",
                      val: mirrorLive,
                      set: setMirrorLive,
                    },
                    {
                      label: "Auto trigger camera",
                      desc: "Capture photo at end of countdown",
                      val: autoTrigger,
                      set: setAutoTrigger,
                    },
                    {
                      label: "Flash screen white",
                      desc: "White flash before capture",
                      val: flashWhite,
                      set: setFlashWhite,
                    },
                    {
                      label: "Cancel button",
                      desc: "Show cancel button during capture",
                      val: cancelBtn,
                      set: setCancelBtn,
                    },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-semibold uppercase tracking-wide text-gray-200">
                          {item.label}
                        </div>
                        <div className="text-[10px] text-gray-400">{item.desc}</div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => item.set(!item.val)}
                          className={`w-8 h-4 rounded-full relative transition-colors ${
                            item.val ? "bg-[#8e24aa]" : "bg-gray-600"
                          }`}
                        >
                          <div
                            className={`absolute top-[2px] w-3 h-3 bg-white rounded-full transition-all ${
                              item.val ? "left-4" : "left-[2px]"
                            }`}
                          />
                        </button>
                        <span className="text-[10px] font-semibold uppercase w-5 text-gray-300">
                          {item.val ? "On" : "Off"}
                        </span>
                      </div>
                    </div>
                  ))}

                  <div className="space-y-1">
                    <label className="block font-semibold uppercase tracking-wide text-gray-200">
                      Live view rotation
                    </label>
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
                    <span className="font-semibold uppercase tracking-wide text-gray-200">
                      Countdown color
                    </span>
                    <input
                      type="color"
                      value={countdownColor}
                      onChange={(e) => setCountdownColor(e.target.value)}
                      className="w-12 h-6 rounded border border-[#444] bg-transparent cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold uppercase tracking-wide text-gray-200">
                        Photo thumbnails
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setThumbnails(!thumbnails)}
                          className={`w-8 h-4 rounded-full relative transition-colors ${
                            thumbnails ? "bg-[#8e24aa]" : "bg-gray-600"
                          }`}
                        >
                          <div
                            className={`absolute top-[2px] w-3 h-3 bg-white rounded-full transition-all ${
                              thumbnails ? "left-4" : "left-[2px]"
                            }`}
                          />
                        </button>
                        <span className="text-[10px] font-semibold uppercase w-5 text-gray-300">
                          {thumbnails ? "On" : "Off"}
                        </span>
                      </div>
                    </div>
                    <select
                      value={thumbPos}
                      onChange={(e) => setThumbPos(e.target.value as "bottom" | "top")}
                      className="w-full bg-[#383838] border border-[#444] rounded px-2.5 py-1.5 text-gray-200 uppercase font-medium focus:outline-none"
                    >
                      <option value="bottom">Bottom</option>
                      <option value="top">Top</option>
                    </select>
                  </div>
                </div>

                {/* Active Mode Selector */}
                <div className="bg-[#232323] rounded-lg p-3 border border-[#444]">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2.5 text-center">
                    Active Capture Mode
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    {(
                      [
                        { id: "photo", icon: Camera, label: "Photo", sub: "Instant print" },
                        { id: "gif", icon: Images, label: "GIF", sub: "Animated" },
                        {
                          id: "boomerang",
                          icon: InfinityIcon,
                          label: "Boomerang",
                          sub: "Mini video",
                        },
                        { id: "video", icon: Video, label: "Video", sub: "Clip" },
                      ] as const
                    ).map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => modesEnabled[m.id] && setActiveMode(m.id)}
                        className={`flex flex-col items-center group transition ${
                          !modesEnabled[m.id] ? "opacity-30 pointer-events-none" : ""
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
                            activeMode === m.id
                              ? "bg-white text-gray-900 ring-2 ring-[#8e24aa]"
                              : "bg-white text-gray-900"
                          }`}
                        >
                          <m.icon size={20} />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white mt-1.5">
                          {m.label}
                        </span>
                        <span className="text-[8px] text-gray-400 leading-tight mt-0.5">
                          {m.sub}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Accordion Sections */}
                {(["photo", "gif", "boomerang", "video"] as const).map((mode) => (
                  <div key={mode} className="pb-3 border-b border-[#444]">
                    <div className="flex items-center justify-between py-1">
                      <button
                        type="button"
                        onClick={() => toggleAccordion(mode)}
                        className="flex items-center gap-1.5 text-left group"
                      >
                        <ChevronDown
                          size={16}
                          className={`text-gray-400 transition-transform ${
                            accordions[mode] ? "" : "-rotate-90"
                          }`}
                        />
                        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-100 group-hover:text-purple-400 transition">
                          {mode === "video" ? "Video/360" : mode.toUpperCase()}
                        </h3>
                      </button>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => toggleCaptureMode(mode, !modesEnabled[mode])}
                          className={`w-8 h-4 rounded-full relative transition-colors ${
                            modesEnabled[mode] ? "bg-[#8e24aa]" : "bg-gray-600"
                          }`}
                        >
                          <div
                            className={`absolute top-[2px] w-3 h-3 bg-white rounded-full transition-all ${
                              modesEnabled[mode] ? "left-4" : "left-[2px]"
                            }`}
                          />
                        </button>
                        <span className="text-[10px] font-semibold uppercase w-5 text-gray-300">
                          {modesEnabled[mode] ? "On" : "Off"}
                        </span>
                      </div>
                    </div>

                    {accordions[mode] && modesEnabled[mode] && (
                      <div className="space-y-2.5 pt-2.5 pl-1">
                        {mode === "photo" && (
                          <>
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-gray-300 w-28 shrink-0 font-medium uppercase text-[11px]">
                                Before photo 1
                              </span>
                              <input
                                type="range"
                                min="1"
                                max="15"
                                value={photoSettings.before1}
                                onChange={(e) =>
                                  setPhotoSettings((p) => ({
                                    ...p,
                                    before1: parseInt(e.target.value, 10),
                                  }))
                                }
                                className="flex-1 accent-purple-600"
                              />
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  value={photoSettings.before1}
                                  readOnly
                                  className="w-10 bg-[#383838] border border-[#444] rounded px-1 py-0.5 text-center text-gray-200"
                                />
                                <span className="text-gray-400 text-[10px] uppercase">sec</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-gray-300 w-28 shrink-0 font-medium uppercase text-[11px]">
                                Other photos
                              </span>
                              <input
                                type="range"
                                min="1"
                                max="15"
                                value={photoSettings.beforeOther}
                                onChange={(e) =>
                                  setPhotoSettings((p) => ({
                                    ...p,
                                    beforeOther: parseInt(e.target.value, 10),
                                  }))
                                }
                                className="flex-1 accent-purple-600"
                              />
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  value={photoSettings.beforeOther}
                                  readOnly
                                  className="w-10 bg-[#383838] border border-[#444] rounded px-1 py-0.5 text-center text-gray-200"
                                />
                                <span className="text-gray-400 text-[10px] uppercase">sec</span>
                              </div>
                            </div>
                          </>
                        )}
                        <div className="flex items-center gap-2 pt-1">
                          <span className="text-gray-300 font-medium uppercase text-[11px]">
                            Overlay PNG
                          </span>
                          <button
                            type="button"
                            className="px-3 py-0.5 rounded-full border border-purple-400 text-purple-300 text-[10px] font-semibold uppercase hover:bg-purple-900/40"
                          >
                            Choose
                          </button>
                          <Trash2
                            size={14}
                            className="text-gray-500 hover:text-red-400 cursor-pointer"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </aside>

            {/* PREVIEW CANVAS */}
            <main className="flex-1 bg-[#0f0f12] flex flex-col relative overflow-hidden">
              <div className="p-4 flex justify-end items-center gap-4 z-10">
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-300">
                    Aspect Ratio
                  </span>
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
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-300">
                    Orientation
                  </span>
                  <div className="flex items-center bg-[#333] border border-[#444] rounded p-0.5">
                    <button
                      type="button"
                      onClick={() => setOrientation("landscape")}
                      className={`p-1.5 rounded transition ${
                        orientation === "landscape"
                          ? "bg-[#8e24aa] text-white"
                          : "text-gray-400"
                      }`}
                    >
                      <div className="w-4 h-2.5 border border-current rounded-[1px]" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrientation("portrait")}
                      className={`p-1.5 rounded transition ${
                        orientation === "portrait"
                          ? "bg-[#8e24aa] text-white"
                          : "text-gray-400"
                      }`}
                    >
                      <div className="w-2.5 h-4 border border-current rounded-[1px]" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex-1 flex items-center justify-center p-4">
                <div
                  className={`bg-[#0d0d0d] border border-gray-600 shadow-2xl relative flex flex-col justify-between transition-all duration-300 overflow-hidden ${
                    orientation === "portrait"
                      ? "w-[310px] h-[550px]"
                      : "w-[550px] h-[310px]"
                  }`}
                >
                  <div
                    className={`absolute inset-0 bg-white z-50 pointer-events-none transition-opacity duration-500 ${
                      flashActive ? "opacity-100" : "opacity-0"
                    }`}
                  />

                  <div className="p-3 flex items-start justify-between z-20">
                    {cancelBtn && (
                      <button
                        type="button"
                        onClick={cancelSimulation}
                        className="text-white/80 hover:text-white p-1"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>

                  <div
                    className={`relative my-auto w-full bg-neutral-800 flex items-center justify-center transition-all duration-300 ${
                      aspectRatio === "9:16"
                        ? "aspect-[9/16]"
                        : aspectRatio === "3:4"
                          ? "aspect-[3/4]"
                          : "aspect-square"
                    }`}
                  >
                    {showLive && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80"
                        alt="Live preview"
                        className={`w-full h-full transition-all duration-300 ${
                          cropLive ? "object-cover" : "object-contain"
                        } ${mirrorLive ? "-scale-x-100" : ""}`}
                        style={{
                          transform: `${mirrorLive ? "scaleX(-1)" : ""} rotate(${rotation}deg)`,
                        }}
                      />
                    )}

                    {sayCheeseActive && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
                        <span className="text-white font-display font-bold text-lg tracking-widest uppercase animate-pulse">
                          SAY CHEESE! 📸
                        </span>
                      </div>
                    )}

                    {!sayCheeseActive && (
                      <div
                        onClick={startSimulation}
                        className="absolute z-20 w-16 h-16 rounded-full border-2 flex items-center justify-center cursor-pointer hover:scale-105 transition bg-black/20 backdrop-blur-[1px]"
                        style={{ borderColor: countdownColor }}
                      >
                        <span
                          className="text-3xl font-display font-semibold"
                          style={{ color: countdownColor }}
                        >
                          {countdownValue}
                        </span>
                      </div>
                    )}
                  </div>

                  {thumbnails && (
                    <div
                      className={`p-2.5 grid grid-cols-3 gap-2 z-20 transition-all ${
                        thumbPos === "top" ? "order-first" : ""
                      }`}
                    >
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="h-14 bg-[#333] rounded-sm flex items-center justify-center text-white text-xs font-bold overflow-hidden border border-white/10"
                        >
                          {capturedThumbs[i - 1] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={capturedThumbs[i - 1]}
                              alt={`Thumb ${i}`}
                              className={`w-full h-full object-cover ${
                                mirrorLive ? "-scale-x-100" : ""
                              }`}
                            />
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
        </div>
      )}

      {/* TOAST */}
      <div
        className={`fixed bottom-4 right-4 bg-[#16161e]/95 backdrop-blur-md border ${
          toast.type === "error"
            ? "border-rose-500/60 text-rose-200"
            : "border-purple-500/60 text-gray-100"
        } text-xs px-4 py-2.5 rounded-lg shadow-xl transition-all duration-300 z-50 flex items-center gap-2 ${
          toast.visible
            ? "translate-y-0 opacity-100"
            : "translate-y-20 opacity-0 pointer-events-none"
        }`}
      >
        {toast.type === "error" ? (
          <span className="w-2 h-2 rounded-full bg-rose-500" />
        ) : (
          <Info size={16} className="text-purple-400" />
        )}
        <span className="font-medium">{toast.msg}</span>
      </div>
    </div>
  );
}