"use client";

import { useState, useRef, useEffect } from "react";
import { Wand2, Sparkles, CheckCircle2, Grid, X } from "lucide-react";

interface OutputOverlayProps {
  selectedRatio?: string;
  overlayUrl?: string;
  overlayInfo?: { name: string; dimensions: string };
  onOverlayApplied?: (dataUrl: string, name: string, dimensions: string) => void;
  onRatioChange?: (ratio: string, width: number, height: number) => void; // <-- Tambahan prop callback
}

export default function OutputOverlay({
  selectedRatio = "2:3",
  overlayUrl = "",
  overlayInfo = { name: "custom_editor_frame.png", dimensions: "1205x1795 px" },
  onOverlayApplied,
  onRatioChange,
}: OutputOverlayProps) {
  const [aspectRatio, setAspectRatio] = useState(selectedRatio);
  const [ratioLabel, setRatioLabel] = useState("PHOTO PORTRAIT (4R)");
  const [outputWidth, setOutputWidth] = useState(1205);
  const [outputHeight, setOutputHeight] = useState(1795);

  const [customSizeEnabled, setCustomSizeEnabled] = useState(false);
  const [mosaicEnabled, setMosaicEnabled] = useState(false);
  const [gridSize, setGridSize] = useState("10x10");

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorText, setEditorText] = useState("ARTBOOTH 2026");
  const [editorColor, setEditorColor] = useState("#8B5CF6");
  const [editorBorderWidth, setEditorBorderWidth] = useState(12);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const ratios = [
    { ratio: "9:16", label: "PORTRAIT", w: 1080, h: 1920 },
    { ratio: "16:9", label: "LANDSCAPE", w: 1920, h: 1080 },
    { ratio: "2:3", label: "PHOTO PORTRAIT (4R)", w: 1205, h: 1795 },
    { ratio: "3:2", label: "PHOTO LANDSCAPE (4R)", w: 1795, h: 1205 },
    { ratio: "3:4", label: "ORIGINAL 3:4 (NO CROP)", w: 1200, h: 1600 },
    { ratio: "4:3", label: "ORIGINAL 4:3 (NO CROP)", w: 1600, h: 1200 },
  ];

  const handleSelectRatio = (item: typeof ratios[0]) => {
    setAspectRatio(item.ratio);
    setRatioLabel(item.label);
    setOutputWidth(item.w);
    setOutputHeight(item.h);

    // Kirim perubahan rasio ke parent component agar Live Preview ikut berubah
    if (onRatioChange) {
      onRatioChange(item.ratio, item.w, item.h);
    }
  };

  const handlePngUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "image/png") {
      alert("Harap unggah file PNG transparan yang valid.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const dataUrl = event.target?.result as string;
        if (onOverlayApplied) {
          onOverlayApplied(dataUrl, file.name, `${img.width}x${img.height} px`);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const removeOverlay = () => {
    if (onOverlayApplied) {
      onOverlayApplied("", "", "");
    }
  };

  useEffect(() => {
    if (!isEditorOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isPortrait = outputHeight >= outputWidth;
    canvas.width = isPortrait ? 220 : 320;
    canvas.height = isPortrait ? 330 : 213;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = editorColor;
    ctx.lineWidth = editorBorderWidth;
    ctx.strokeRect(
      editorBorderWidth / 2,
      editorBorderWidth / 2,
      canvas.width - editorBorderWidth,
      canvas.height - editorBorderWidth
    );

    ctx.strokeStyle = "rgba(255, 255, 255, 0.45)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(
      editorBorderWidth + 6,
      editorBorderWidth + 6,
      canvas.width - (editorBorderWidth + 6) * 2,
      canvas.height - (editorBorderWidth + 6) * 2
    );

    if (editorText.trim() !== "") {
      const bannerH = 28;
      ctx.fillStyle = editorColor;
      ctx.fillRect(
        editorBorderWidth,
        canvas.height - editorBorderWidth - bannerH,
        canvas.width - editorBorderWidth * 2,
        bannerH
      );

      ctx.fillStyle = editorColor === "#FFFFFF" ? "#08050E" : "#FFFFFF";
      ctx.font = "bold 11px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        editorText.toUpperCase(),
        canvas.width / 2,
        canvas.height - editorBorderWidth - bannerH / 2
      );
    }
  }, [isEditorOpen, editorText, editorColor, editorBorderWidth, outputWidth, outputHeight]);

  const applyGeneratedOverlay = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");

    if (onOverlayApplied) {
      onOverlayApplied(dataUrl, "custom_editor_frame.png", `${outputWidth}x${outputHeight} px`);
    }

    setIsEditorOpen(false);
  };

  const downloadGeneratedPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `artbooth-overlay-${outputWidth}x${outputHeight}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="space-y-6 text-white">
      <div className="space-y-3">
        <label className="block text-[11px] font-bold tracking-wider uppercase text-purple-400">
          OUTPUT ASPECT RATIO
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {ratios.map((item) => {
            const isActive = aspectRatio === item.ratio;
            return (
              <button
                key={item.ratio}
                type="button"
                onClick={() => handleSelectRatio(item)}
                className={`flex flex-col items-center justify-center py-4 px-3 rounded-xl border transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#8b35ff]/30 border-purple-500 shadow-[0_0_15px_rgba(139,53,255,0.35)]"
                    : "bg-[#130d22] hover:bg-white/5 border-white/10"
                }`}
              >
                <span className="text-sm font-bold text-white">{item.ratio}</span>
                <span
                  className={`text-[10px] font-medium mt-1 tracking-wider ${
                    isActive ? "text-purple-200" : "text-gray-400"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl bg-[#130d22] border border-white/10 p-4 transition-all">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wide">
              ENABLE CUSTOM OUTPUT SIZE
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Fine-tune the final render resolution independently from aspect ratio.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCustomSizeEnabled(!customSizeEnabled)}
            className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 flex items-center cursor-pointer shrink-0 ${
              customSizeEnabled ? "bg-[#8b35ff]" : "bg-gray-700"
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform duration-200 ${
                customSizeEnabled ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {customSizeEnabled && (
          <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">
                Width (px)
              </label>
              <input
                type="number"
                value={outputWidth}
                onChange={(e) => setOutputWidth(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-[#09090b] border border-white/10 text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">
                Height (px)
              </label>
              <input
                type="number"
                value={outputHeight}
                onChange={(e) => setOutputHeight(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-[#09090b] border border-white/10 text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
        )}
      </div>

      <div className="rounded-xl bg-[#130d22] border border-white/10 p-4 transition-all">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wide">
              ENABLE MOSAIC PHOTO
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Prints coordinates (e.g. A1, B3) on photos for a physical mosaic board.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setMosaicEnabled(!mosaicEnabled)}
            className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 flex items-center cursor-pointer shrink-0 ${
              mosaicEnabled ? "bg-[#8b35ff]" : "bg-gray-700"
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform duration-200 ${
                mosaicEnabled ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {mosaicEnabled && (
          <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-purple-300">
              <Grid className="w-4 h-4" />
              <span>
                Sample Coordinate Badge:{" "}
                <strong className="text-white bg-purple-600/40 px-2 py-0.5 rounded">
                  {gridSize === "10x10" ? "A1" : gridSize === "15x20" ? "B12" : "C19"}
                </strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-[11px] text-gray-400">Grid Size:</label>
              <select
                value={gridSize}
                onChange={(e) => setGridSize(e.target.value)}
                className="px-2.5 py-1 rounded-lg bg-[#09090b] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
              >
                <option value="10x10">10 x 10 (100 Tiles)</option>
                <option value="15x20">15 x 20 (300 Tiles)</option>
                <option value="20x25">20 x 25 (500 Tiles)</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="pt-2 space-y-3 text-xs text-gray-300">
        <p>
          Your current output configuration is <strong className="text-white font-bold">select-by-concept</strong>.
        </p>
        <p className="text-gray-400">Upload a frame with the appropriate size.</p>

        <div className="space-y-2 pt-1">
          <div>
            <p className="font-bold text-white">Digital Photo Size</p>
            <ul className="list-disc list-inside text-gray-400 space-y-0.5 mt-0.5 pl-1">
              <li>Portrait 9:16 = 1080x1920</li>
              <li>Landscape 16:9 = 1920x1080</li>
            </ul>
          </div>

          <div className="pt-1">
            <p className="font-bold text-white">4R Photo Size</p>
            <ul className="list-disc list-inside text-gray-400 space-y-0.5 mt-0.5 pl-1">
              <li>2:3 = 1205 x 1795 px</li>
              <li>3:2 = 1795 x 1205 px</li>
            </ul>
          </div>
        </div>

        <p className="text-amber-400 font-semibold pt-1">
          Ensure the uploaded PNG file matches the output format size.
        </p>
      </div>

      {overlayUrl && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-purple-950/40 border border-purple-500/40 text-xs">
          <div className="flex items-center gap-2.5 truncate">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-gray-200 font-medium truncate">{overlayInfo.name}</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-purple-600/30 text-purple-200 shrink-0">
              {overlayInfo.dimensions}
            </span>
          </div>
          <button
            type="button"
            onClick={removeOverlay}
            className="text-rose-400 hover:text-rose-300 font-semibold px-2 py-1 rounded hover:bg-rose-500/10 transition-colors cursor-pointer"
          >
            Remove
          </button>
        </div>
      )}

      <div className="pt-2 flex flex-wrap items-center gap-3">
        <input
          type="file"
          id="png-upload-input"
          accept="image/png"
          className="hidden"
          onChange={handlePngUpload}
        />

        <button
          type="button"
          onClick={() => document.getElementById("png-upload-input")?.click()}
          className="flex-1 sm:flex-none min-w-[200px] flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#130d22] hover:bg-white/5 border border-white/10 hover:border-purple-500/50 text-white text-xs font-bold tracking-wider uppercase transition-all cursor-pointer active:scale-95"
        >
          <Wand2 className="w-4 h-4 text-purple-400" />
          <span>UPLOAD PNG OVERLAY</span>
        </button>

        <button
          type="button"
          onClick={() => setIsEditorOpen(true)}
          className="flex-1 sm:flex-none min-w-[200px] flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-purple-950/30 hover:bg-purple-900/40 border border-purple-500/40 hover:border-purple-400 text-purple-300 hover:text-white text-xs font-bold tracking-wider uppercase transition-all cursor-pointer active:scale-95"
        >
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>OVERLAY EDITOR</span>
        </button>
      </div>

      {isEditorOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#0b061a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                  PNG Overlay Frame Designer
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
              <div className="flex flex-col items-center justify-center bg-[#070312] border border-white/10 rounded-xl p-4">
                <canvas
                  ref={canvasRef}
                  className="rounded-lg shadow-lg border border-purple-500/30 bg-[#150B24]"
                />
                <span className="text-[10px] text-gray-400 mt-2 font-mono">
                  Target: {outputWidth} x {outputHeight} px ({aspectRatio})
                </span>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-gray-300 uppercase mb-1">
                    Frame Event Text
                  </label>
                  <input
                    type="text"
                    value={editorText}
                    onChange={(e) => setEditorText(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#130d22] border border-white/10 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-300 uppercase mb-1">
                    Border Accent Color
                  </label>
                  <div className="flex items-center gap-2">
                    {["#8B5CF6", "#F59E0B", "#EC4899", "#10B981", "#FFFFFF"].map((hex) => (
                      <button
                        key={hex}
                        type="button"
                        onClick={() => setEditorColor(hex)}
                        style={{ backgroundColor: hex }}
                        className={`w-7 h-7 rounded-full border-2 cursor-pointer transition-transform ${
                          editorColor === hex ? "border-white scale-110 shadow-lg" : "border-transparent"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-300 uppercase mb-1">
                    Frame Thickness
                  </label>
                  <input
                    type="range"
                    min="4"
                    max="24"
                    value={editorBorderWidth}
                    onChange={(e) => setEditorBorderWidth(Number(e.target.value))}
                    className="w-full accent-purple-500 cursor-pointer"
                  />
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={applyGeneratedOverlay}
                    className="w-full py-2.5 rounded-xl bg-[#8b35ff] hover:bg-purple-500 text-white font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(139,53,255,0.4)] transition-all cursor-pointer"
                  >
                    Apply Frame to Live Preview
                  </button>
                  <button
                    type="button"
                    onClick={downloadGeneratedPng}
                    className="w-full py-2 rounded-xl bg-[#130d22] hover:bg-white/5 border border-white/10 text-gray-300 font-semibold transition-all cursor-pointer"
                  >
                    Download Transparent PNG
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}