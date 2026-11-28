"use client";

import { useState } from "react";
import NextImage from "next/image";
import { Info, Play, Film, ImagePlus, Loader2, RotateCcw, CheckCircle2, AlertCircle, Trash2 } from "lucide-react";
import type {
  CustomBackgroundMediaItem,
  DeletedEventMediaResponse,
  IdentityBackgroundType,
  UploadedEventMediaResponse,
} from "@/lib/event-settings-types";

interface EventIdentityProps {
  eventCode?: string;
  eventName: string;
  setEventName: (val: string) => void;
  eventDesc: string;
  setEventDesc: (val: string) => void;
  isLoading?: boolean;
  autoReset: boolean;
  setAutoReset: (val: boolean) => void;
  countdown: string;
  setCountdown: (val: string) => void;
  backgroundType: IdentityBackgroundType;
  setBackgroundType: (val: IdentityBackgroundType) => void;
  backgroundValue: string;
  setBackgroundValue: (val: string) => void;
  backgroundName: string;
  setBackgroundName: (val: string) => void;
  customBackgrounds: CustomBackgroundMediaItem[];
  setCustomBackgrounds: (items: CustomBackgroundMediaItem[]) => void;
}

export default function EventIdentity({
  eventCode = "",
  eventName,
  setEventName,
  eventDesc,
  setEventDesc,
  isLoading = false,
  autoReset,
  setAutoReset,
  countdown,
  setCountdown,
  backgroundType,
  setBackgroundType,
  backgroundValue,
  setBackgroundValue,
  backgroundName,
  setBackgroundName,
  customBackgrounds,
  setCustomBackgrounds,
}: EventIdentityProps) {
  const numericCountdown = parseInt(countdown) || 60;
  const countdownOptions = ["30s", "45s", "60s", "90s", "120s"];

  const [uploadingKind, setUploadingKind] = useState<"image" | "video" | null>(null);
  const [deletingUrl, setDeletingUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);

  const customVideos = customBackgrounds.filter((item) => item.type === "video");
  const customImages = customBackgrounds.filter((item) => item.type === "image");

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCountdown(`${e.target.value}s`);
  };

  const handleSelectTemplate = (tplClass: string) => {
    setBackgroundType("preset");
    setBackgroundValue(tplClass);
    setBackgroundName("");
    setUploadError(null);
    setUploadNotice(null);
  };

  const handleSelectCustomMedia = (item: CustomBackgroundMediaItem) => {
    setBackgroundType(item.type);
    setBackgroundValue(item.url);
    setBackgroundName(item.name);
    setUploadError(null);
    setUploadNotice(null);
  };

  const handleDeleteCustomMedia = async (item: CustomBackgroundMediaItem) => {
    if (!eventCode || deletingUrl) return;
    setUploadError(null);
    setUploadNotice(null);
    setDeletingUrl(item.url);

    try {
      const res = await fetch(
        `/api/events/${encodeURIComponent(eventCode)}/upload-media`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: item.url }),
        }
      );

      const data = (await res.json().catch(() => null)) as DeletedEventMediaResponse | null;
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || "Gagal menghapus media.");
      }

      if (data.identityConfig) {
        setCustomBackgrounds(data.identityConfig.customBackgrounds);
      } else {
        setCustomBackgrounds(customBackgrounds.filter((bg) => bg.url !== item.url));
      }

      if (backgroundValue === item.url) {
        setBackgroundType("preset");
        setBackgroundValue("tpl-hex");
        setBackgroundName("");
      }

      setUploadNotice(`"${item.name}" berhasil dihapus.`);
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : "Gagal menghapus media."
      );
    } finally {
      setDeletingUrl(null);
    }
  };

  const handleMediaUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "video" | "image",
    maxMB: number
  ) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploadError(null);
    setUploadNotice(null);

    if (!eventCode) {
      setUploadError("Kode event tidak ditemukan. Muat ulang halaman.");
      return;
    }

    const allowedImageTypes = ["image/png", "image/jpeg", "image/webp"];
    const allowedVideoTypes = ["video/mp4", "video/webm"];
    const mime = file.type.trim().toLowerCase();

    if (type === "image" && !allowedImageTypes.includes(mime)) {
      setUploadError("Format gambar harus PNG, JPG/JPEG, atau WEBP.");
      return;
    }

    if (type === "video" && !allowedVideoTypes.includes(mime)) {
      setUploadError("Format video harus MP4 atau WEBM.");
      return;
    }

    const maxBytes = maxMB * 1024 * 1024;
    if (file.size > maxBytes) {
      setUploadError(`Ukuran maksimal untuk ${type} adalah ${maxMB}MB.`);
      return;
    }

    setUploadingKind(type);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("kind", type);

      const res = await fetch(
        `/api/events/${encodeURIComponent(eventCode)}/upload-media`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = (await res.json().catch(() => null)) as UploadedEventMediaResponse | null;
      if (!res.ok || !data?.ok || !data.media) {
        throw new Error(data?.error || `Gagal mengunggah ${type}.`);
      }

      if (Array.isArray(data.customBackgrounds)) {
        setCustomBackgrounds(data.customBackgrounds);
      } else if (data.item) {
        setCustomBackgrounds([
          ...customBackgrounds.filter((bg) => bg.url !== data.item!.url),
          data.item,
        ]);
      }

      setBackgroundType(data.media.backgroundType);
      setBackgroundValue(data.media.url);
      setBackgroundName(data.media.originalName || data.media.fileName);
      setUploadNotice(
        `Berhasil ditambahkan ke template (${data.media.originalName}). Klik Save di kanan atas untuk mengaktifkan sebagai background event.`
      );
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : `Gagal mengunggah ${type}.`
      );
    } finally {
      setUploadingKind(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xs font-bold tracking-wider text-purple-400 uppercase mb-4">
          Event Identity
        </h2>

        {/* Input Event Name */}
        <div className="mb-4">
          <label className="block text-[11px] font-bold tracking-wider text-gray-400 uppercase mb-2">
            Event Name
          </label>
          <input
            type="text"
            value={eventName}
            disabled={isLoading}
            placeholder={isLoading ? "Memuat nama event..." : "Masukkan nama event"}
            onChange={(e) => setEventName(e.target.value)}
            className="w-full bg-[#130d22] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#8b35ff] transition-colors disabled:opacity-60"
          />
        </div>

        {/* Input Event Description */}
        <div className="mb-6">
          <label className="block text-[11px] font-bold tracking-wider text-gray-400 uppercase mb-2">
            Event Description
          </label>
          <input
            type="text"
            value={eventDesc}
            disabled={isLoading}
            placeholder={isLoading ? "Memuat deskripsi event..." : "Masukkan deskripsi event"}
            onChange={(e) => setEventDesc(e.target.value)}
            className="w-full bg-[#130d22] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#8b35ff] transition-colors disabled:opacity-60"
          />
        </div>
      </div>

      {/* Inactivity Auto-Reset */}
      <div className="bg-[#130d22] border border-white/10 rounded-2xl p-5 flex items-center justify-between">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-purple-400 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-white">INACTIVITY AUTO-RESET</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Automatically return to the start screen when guests abandon an unfinished session.
            </p>
          </div>
        </div>
        <button
          onClick={() => setAutoReset(!autoReset)}
          className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
            autoReset ? "bg-[#8b35ff]" : "bg-gray-700"
          }`}
        >
          <div
            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
              autoReset ? "translate-x-6" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Countdown Duration */}
      <div className={`space-y-4 transition-all ${!autoReset ? "opacity-40 pointer-events-none" : ""}`}>
        <div className="flex justify-between items-center mb-3">
          <label className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
            Auto-Reset Countdown Duration
          </label>
          <span className="bg-[#8b35ff]/20 text-purple-300 border border-purple-500/30 px-3 py-1 rounded-full text-xs font-bold">
            {numericCountdown} Seconds
          </span>
        </div>

        {/* Slider / Range */}
        <input
          type="range"
          min="15"
          max="120"
          value={numericCountdown}
          onChange={handleSliderChange}
          className="w-full accent-[#8b35ff] bg-gray-700 h-2 rounded-lg cursor-pointer mb-3"
        />

        {/* Pilihan Tombol Durasi */}
        <div className="grid grid-cols-5 gap-3">
          {countdownOptions.map((opt) => {
            const isActive = countdown === opt || countdown.startsWith(opt.replace("s", ""));
            return (
              <button
                key={opt}
                onClick={() => setCountdown(opt)}
                className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  isActive
                    ? "bg-[#8b35ff] border-purple-400 text-white shadow-[0_0_10px_rgba(139,53,255,0.4)]"
                    : "bg-[#130d22] border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      {/* BACKGROUND (APPLIES TO DISPLAY) */}
      <div className="bg-[#130d22] border border-white/10 rounded-2xl p-5 space-y-4">
        <h3 className="font-bold text-xs tracking-wider text-white uppercase">
          BACKGROUND (APPLIES TO DISPLAY)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* VIDEO TEMPLATES */}
          <div className="bg-[#09090b] border border-white/10 rounded-xl p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">VIDEO TEMPLATES</span>
              <span className="text-[10px] text-purple-400 font-mono">LOOP MP4</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: "tpl-hex", cls: "tpl-hex" },
                { id: "tpl-cybercar", cls: "tpl-cybercar" },
                { id: "tpl-shards-dark", cls: "tpl-shards-dark" },
                { id: "tpl-waterfall", cls: "tpl-waterfall" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectTemplate(item.cls)}
                  className={`group relative aspect-video rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    backgroundType === "preset" && backgroundValue === item.cls
                      ? "border-purple-500 shadow-[0_0_12px_rgba(139,53,255,0.4)] ring-2 ring-purple-500/50"
                      : "border-white/10 hover:border-white/30"
                  }`}
                >
                  <div className={`w-full h-full ${item.cls} bg-cover bg-center`} />
                  <span className="absolute bottom-1 right-1 bg-black/70 px-1.5 py-0.5 rounded text-[9px] font-mono text-white flex items-center gap-1">
                    <Play className="w-2.5 h-2.5 fill-current" /> VID
                  </span>
                </button>
              ))}

              {customVideos.map((item) => {
                const isSelected =
                  backgroundType === "video" && backgroundValue === item.url;
                const isDeleting = deletingUrl === item.url;
                return (
                  <div
                    key={item.id}
                    className={`group relative aspect-video rounded-lg overflow-hidden border-2 transition-all bg-black ${
                      isSelected
                        ? "border-purple-500 shadow-[0_0_12px_rgba(139,53,255,0.4)] ring-2 ring-purple-500/50"
                        : "border-white/10 hover:border-white/30"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleSelectCustomMedia(item)}
                      title={item.name}
                      className="w-full h-full block cursor-pointer"
                    >
                      <video
                        src={item.url}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 left-1 max-w-[65%] truncate bg-black/75 px-1.5 py-0.5 rounded text-[8px] font-medium text-gray-200">
                        {item.name}
                      </span>
                      <span className="absolute bottom-1 right-1 bg-black/70 px-1.5 py-0.5 rounded text-[9px] font-mono text-white flex items-center gap-1">
                        <Play className="w-2.5 h-2.5 fill-current" /> VID
                      </span>
                    </button>

                    <button
                      type="button"
                      disabled={Boolean(deletingUrl)}
                      onClick={() => void handleDeleteCustomMedia(item)}
                      title={`Hapus ${item.name}`}
                      aria-label={`Hapus ${item.name}`}
                      className="absolute top-1.5 right-1.5 z-10 p-1.5 rounded-md bg-black/75 hover:bg-rose-600 disabled:opacity-50 text-rose-300 hover:text-white border border-white/15 transition cursor-pointer"
                    >
                      {isDeleting ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Trash2 className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* IMAGE TEMPLATES */}
          <div className="bg-[#09090b] border border-white/10 rounded-xl p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">IMAGE TEMPLATES</span>
              <span className="text-[10px] text-gray-500 font-mono">STATIC HD</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: "tpl-blue-crystal", cls: "tpl-blue-crystal" },
                { id: "tpl-neon-poly", cls: "tpl-neon-poly" },
                { id: "tpl-cracked-obsidian", cls: "tpl-cracked-obsidian" },
                { id: "tpl-galaxy-sky", cls: "tpl-galaxy-sky" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectTemplate(item.cls)}
                  className={`group relative aspect-video rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    backgroundType === "preset" && backgroundValue === item.cls
                      ? "border-purple-500 shadow-[0_0_12px_rgba(139,53,255,0.4)] ring-2 ring-purple-500/50"
                      : "border-white/10 hover:border-white/30"
                  }`}
                >
                  <div className={`w-full h-full ${item.cls} bg-cover bg-center`} />
                </button>
              ))}

              {customImages.map((item) => {
                const isSelected =
                  backgroundType === "image" && backgroundValue === item.url;
                const isDeleting = deletingUrl === item.url;
                return (
                  <div
                    key={item.id}
                    className={`group relative aspect-video rounded-lg overflow-hidden border-2 transition-all bg-black ${
                      isSelected
                        ? "border-purple-500 shadow-[0_0_12px_rgba(139,53,255,0.4)] ring-2 ring-purple-500/50"
                        : "border-white/10 hover:border-white/30"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleSelectCustomMedia(item)}
                      title={item.name}
                      className="w-full h-full relative block cursor-pointer"
                    >
                      <NextImage
                        src={item.url}
                        alt={item.name}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                      <span className="absolute bottom-1 left-1 max-w-[75%] truncate bg-black/75 px-1.5 py-0.5 rounded text-[8px] font-medium text-gray-200">
                        {item.name}
                      </span>
                    </button>

                    <button
                      type="button"
                      disabled={Boolean(deletingUrl)}
                      onClick={() => void handleDeleteCustomMedia(item)}
                      title={`Hapus ${item.name}`}
                      aria-label={`Hapus ${item.name}`}
                      className="absolute top-1.5 right-1.5 z-10 p-1.5 rounded-md bg-black/75 hover:bg-rose-600 disabled:opacity-50 text-rose-300 hover:text-white border border-white/15 transition cursor-pointer"
                    >
                      {isDeleting ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Trash2 className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Custom Upload Buttons */}
        <div className="space-y-3 pt-1">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-400">
            <span>Custom Background Media:</span>
            {backgroundType !== "preset" && backgroundValue ? (
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-emerald-300">
                  Active ({backgroundType.toUpperCase()}): {backgroundName || "Custom Media"}
                </span>
                <button
                  type="button"
                  onClick={() => handleSelectTemplate("tpl-hex")}
                  className="inline-flex items-center gap-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 px-2 py-1 text-[10px] font-semibold text-gray-300 hover:text-white transition cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
              </div>
            ) : (
              <span className="text-[11px] font-mono text-purple-300">
                Template: {backgroundValue || "tpl-hex"}
              </span>
            )}
          </div>

          {backgroundType !== "preset" && backgroundValue && (
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#09090b] border border-purple-500/30">
              <div className="relative w-24 aspect-video rounded-lg overflow-hidden border border-white/10 bg-black shrink-0">
                {backgroundType === "image" ? (
                  <NextImage
                    src={backgroundValue}
                    alt={backgroundName || "Custom background preview"}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <video
                    src={backgroundValue}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-white truncate">
                  {backgroundName || backgroundValue}
                </p>
                <p className="text-[11px] text-gray-400 truncate">
                  Tersimpan di: {backgroundValue}
                </p>
              </div>
            </div>
          )}

          {uploadError && (
            <div className="flex items-start gap-2 rounded-xl border border-rose-500/40 bg-rose-500/10 px-3.5 py-2.5 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{uploadError}</span>
            </div>
          )}

          {uploadNotice && (
            <div className="flex items-start gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-2.5 text-xs text-emerald-300">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{uploadNotice}</span>
            </div>
          )}

          <input
            type="file"
            id="upload-video-input"
            accept="video/mp4,video/webm"
            className="hidden"
            onChange={(e) => void handleMediaUpload(e, "video", 8)}
          />
          <input
            type="file"
            id="upload-image-input"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={(e) => void handleMediaUpload(e, "image", 2)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              disabled={uploadingKind !== null || isLoading}
              onClick={() => document.getElementById("upload-video-input")?.click()}
              className="py-3 px-4 rounded-xl bg-[#18181b] hover:bg-zinc-800 disabled:opacity-60 border border-white/10 hover:border-purple-500/60 text-white font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {uploadingKind === "video" ? (
                <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
              ) : (
                <Film className="w-4 h-4 text-purple-400" />
              )}
              <span>
                {uploadingKind === "video" ? "UPLOADING VIDEO..." : "UPLOAD VIDEO (8MB)"}
              </span>
            </button>
            <button
              type="button"
              disabled={uploadingKind !== null || isLoading}
              onClick={() => document.getElementById("upload-image-input")?.click()}
              className="py-3 px-4 rounded-xl bg-[#18181b] hover:bg-zinc-800 disabled:opacity-60 border border-white/10 hover:border-purple-500/60 text-white font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {uploadingKind === "image" ? (
                <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
              ) : (
                <ImagePlus className="w-4 h-4 text-purple-400" />
              )}
              <span>
                {uploadingKind === "image" ? "UPLOADING IMAGE..." : "UPLOAD IMAGE (2MB)"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Info Panduan Bawah */}
      <div className="bg-[#130d22]/50 border border-white/5 rounded-xl p-4 flex items-start space-x-3 text-xs text-gray-400">
        <span className="text-yellow-400 font-bold">💡</span>
        <p>
          <strong className="text-white">How it works:</strong> If a guest touches the screen, chooses templates or begins session, but walks away without touching the screen for <strong className="text-white">{numericCountdown} seconds</strong>, the booth automatically cancels and returns to the initial home screen. Strictly exempt during AI rendering, photo processing, and the final render result screen.
        </p>
      </div>
    </div>
  );
}