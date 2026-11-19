'use client';

import React, { useRef } from 'react';
import {
  LayoutTemplate,
  Save,
  Download,
  Upload,
  Undo2,
  Redo2,
  Printer,
  Trash2,
  X,
} from 'lucide-react';

export interface OverlayEditorToolbarProps {
  templateName: string;
  canUndo: boolean;
  canRedo: boolean;
  onNewTemplate: () => void;
  onSaveAsNew: () => void;
  onImportJSON: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onExportTemplate: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onPrintTestCopy: () => void;
  onDeleteTemplate: () => void;
  onExportOverlayPNG: () => void;
  onClose?: () => void;
}

export function OverlayEditorToolbar({
  templateName,
  canUndo,
  canRedo,
  onNewTemplate,
  onSaveAsNew,
  onImportJSON,
  onExportTemplate,
  onUndo,
  onRedo,
  onPrintTestCopy,
  onDeleteTemplate,
  onExportOverlayPNG,
  onClose,
}: OverlayEditorToolbarProps) {
  const importInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <header className="h-14 bg-[#222225] border-b border-[#323236] px-4 flex items-center justify-between shrink-0 z-30">
      {/* Left Actions */}
      <div className="flex items-center space-x-1 sm:space-x-2">
        <button
          type="button"
          onClick={onNewTemplate}
          className="top-btn flex flex-col items-center justify-center px-2.5 py-1.5 rounded hover:bg-[#2d2d32] transition text-zinc-300 hover:text-white"
          title="Buat Template Baru"
        >
          <LayoutTemplate className="w-4 h-4 mb-1" />
          <span className="text-[10px] whitespace-nowrap">New Template</span>
        </button>

        <button
          type="button"
          onClick={onSaveAsNew}
          className="top-btn flex flex-col items-center justify-center px-2.5 py-1.5 rounded hover:bg-[#2d2d32] transition text-zinc-300 hover:text-white"
          title="Simpan sebagai Template Baru"
        >
          <Save className="w-4 h-4 mb-1" />
          <span className="text-[10px] whitespace-nowrap">Save as New</span>
        </button>

        <button
          type="button"
          onClick={() => importInputRef.current?.click()}
          className="top-btn flex flex-col items-center justify-center px-2.5 py-1.5 rounded hover:bg-[#2d2d32] transition text-zinc-300 hover:text-white"
          title="Import JSON Template"
        >
          <Download className="w-4 h-4 mb-1" />
          <span className="text-[10px] whitespace-nowrap">Import</span>
        </button>
        <input
          ref={importInputRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={onImportJSON}
        />

        <button
          type="button"
          onClick={onExportTemplate}
          className="top-btn flex flex-col items-center justify-center px-2.5 py-1.5 rounded hover:bg-[#2d2d32] transition text-zinc-300 hover:text-white"
          title="Export Template JSON / PNG"
        >
          <Upload className="w-4 h-4 mb-1" />
          <span className="text-[10px] whitespace-nowrap">Export</span>
        </button>

        <div className="h-6 w-[1px] bg-[#323236] mx-1" />

        <button
          type="button"
          disabled={!canUndo}
          onClick={onUndo}
          className="top-btn flex flex-col items-center justify-center px-2.5 py-1.5 rounded hover:bg-[#2d2d32] transition text-zinc-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
          title="Undo (Ctrl+Z)"
        >
          <Undo2 className="w-4 h-4 mb-1" />
          <span className="text-[10px]">Undo</span>
        </button>

        <button
          type="button"
          disabled={!canRedo}
          onClick={onRedo}
          className="top-btn flex flex-col items-center justify-center px-2.5 py-1.5 rounded hover:bg-[#2d2d32] transition text-zinc-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
          title="Redo (Ctrl+Y)"
        >
          <Redo2 className="w-4 h-4 mb-1" />
          <span className="text-[10px]">Redo</span>
        </button>

        <div className="h-6 w-[1px] bg-[#323236] mx-1" />

        <button
          type="button"
          onClick={onPrintTestCopy}
          className="top-btn flex flex-col items-center justify-center px-2.5 py-1.5 rounded hover:bg-[#2d2d32] transition text-zinc-300 hover:text-white"
          title="Cetak Uji Coba"
        >
          <Printer className="w-4 h-4 mb-1" />
          <span className="text-[10px] whitespace-nowrap">Print Test Copy</span>
        </button>

        <button
          type="button"
          onClick={onDeleteTemplate}
          className="top-btn flex flex-col items-center justify-center px-2.5 py-1.5 rounded hover:bg-red-950/50 transition text-zinc-300 hover:text-red-400"
          title="Hapus Semua Elemen"
        >
          <Trash2 className="w-4 h-4 mb-1" />
          <span className="text-[10px] whitespace-nowrap">Delete Template</span>
        </button>
      </div>

      {/* Right Header Area: Export Overlay PNG Button + Brand Badge + Optional Modal Close */}
      <div className="flex items-center space-x-3">
        <button
          type="button"
          onClick={onExportOverlayPNG}
          className="bg-[#d926ef] hover:bg-[#c026d3] active:scale-95 text-white font-bold text-[11px] tracking-wide px-4 py-2 rounded-lg shadow-lg shadow-fuchsia-950/50 flex items-center space-x-2 transition cursor-pointer"
          title="Download Template sebagai PNG Resolusi Tinggi"
        >
          <Download className="w-4 h-4 stroke-[2.5]" />
          <span className="whitespace-nowrap">EXPORT OVERLAY PNG</span>
        </button>

        <div className="hidden md:flex items-center space-x-2 bg-zinc-900/80 px-3 py-1.5 rounded-full border border-[#323236]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold tracking-wide text-zinc-200">Cekreks.id</span>
          <span className="text-zinc-500">|</span>
          <span className="text-zinc-400 text-[11px]">{templateName}</span>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-[#323236] text-zinc-400 hover:text-white transition"
            title="Tutup Editor"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
}