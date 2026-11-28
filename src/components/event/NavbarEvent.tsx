"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { Save, ArrowLeft, Loader2, CheckCircle2, AlertCircle, X } from "lucide-react";
import { useEventSettingsSave } from "@/components/event/EventSettingsContext";

function NavLinks() {
  const pathname = usePathname();

  // Ekstrak kode event dari URL (misal: /event/4S03UZ/settings)
  const pathSegments = pathname.split("/");
  const eventCode = pathSegments[2] || "4S03UZ";

  const navItems = [
    { name: "Settings", href: `/event/${eventCode}/settings` },
    { name: "Concepts", href: `/event/${eventCode}/settings/concepts` },
    { name: "Interactive Flow", href: `/event/${eventCode}/settings/interactive-flow` },
  ];

  return (
    <nav className="hidden md:flex items-center bg-[#130d22] border border-white/10 rounded-full p-1.5 space-x-1 shadow-inner">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`px-5 py-2 rounded-full text-xs font-bold tracking-wider transition-all duration-200 ${
              isActive
                ? "bg-gradient-to-r from-[#9d4edd] to-[#7b2cbf] text-white shadow-[0_0_15px_rgba(157,78,221,0.5)]"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}

export default function NavbarEvent() {
  const saveCtx = useEventSettingsSave();
  const isSaving = saveCtx?.isSaving ?? false;
  const saveStatus = saveCtx?.saveStatus ?? null;

  return (
    <header className="w-full bg-[#070312] border-b border-white/10 px-6 py-4 flex items-center justify-between text-white select-none relative">
      {/* Kiri: Judul / Logo */}
      <div className="flex items-center">
        <span className="font-black tracking-wider text-xl text-white">
          Settings
        </span>
      </div>

      {/* Tengah: Menu Navigasi dibungkus Suspense */}
      <Suspense fallback={<div className="h-10 w-72 bg-white/5 rounded-full animate-pulse" />}>
        <NavLinks />
      </Suspense>

      {/* Kanan: Tombol Aksi (Save & Back) */}
      <div className="flex items-center space-x-3">
        {saveStatus && (
          <div
            className={`hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border ${
              saveStatus.type === "success"
                ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
                : "bg-rose-500/15 border-rose-500/40 text-rose-300"
            }`}
          >
            {saveStatus.type === "success" ? (
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            )}
            <span className="max-w-[220px] truncate">{saveStatus.message}</span>
            <button
              type="button"
              onClick={() => saveCtx?.clearSaveStatus()}
              className="opacity-70 hover:opacity-100 cursor-pointer"
              aria-label="Tutup status simpan"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <button
          type="button"
          disabled={isSaving}
          onClick={() => {
            if (saveCtx) {
              void saveCtx.triggerSave();
            } else {
              alert("Settings context belum tersedia.");
            }
          }}
          className="flex items-center space-x-2 bg-gradient-to-r from-[#9d4edd] to-[#7b2cbf] hover:opacity-90 disabled:opacity-60 text-white px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider shadow-[0_0_20px_rgba(157,78,221,0.4)] transition-all cursor-pointer disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{isSaving ? "Saving..." : "Save"}</span>
        </button>

        <button
          type="button"
          onClick={() => (window.location.href = "/event")}
          className="flex items-center space-x-2 bg-[#130d22] hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      </div>
    </header>
  );
}