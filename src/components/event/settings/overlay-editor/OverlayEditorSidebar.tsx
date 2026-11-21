'use client';

import React, { useRef, useState, useEffect } from 'react';
import {
  Camera,
  Image as ImageIcon,
  Type,
  Shapes,
  ChevronRight,
  PaintBucket,
  QrCode,
  UserSquare2,
  ChevronUp,
  Eye,
  EyeOff,
  Lock,
  Trash2,
} from 'lucide-react';
import type {
  CanvasElement,
  DimensionUnit,
  PaperSizeOption,
  OrientationOption,
  AlignmentType,
  ShapeType,
} from './overlay-editor.types';

/* ============================================================================
   LEFT SIDEBAR (ADD & LAYOUT)
   ============================================================================ */
export interface OverlayEditorLeftSidebarProps {
  unit: DimensionUnit;
  paperSize: PaperSizeOption;
  secondaryPrinter: boolean;
  dpi: number;
  orientation: OrientationOption;
  canvasWidth: number;
  canvasHeight: number;
  bgColor: string;
  onAddPhotoSlot: () => void;
  onNewImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAddTextElement: (defaultText?: string) => void;
  onAddShape: (shapeType: ShapeType) => void;
  onSetCanvasBgColor: (hex: string) => void;
  onAddQRCode: () => void;
  onAddSessionData: (tag: string) => void;
  onChangeUnit: (unit: DimensionUnit) => void;
  onChangePaperSize: (size: PaperSizeOption) => void;
  onToggleSecondaryPrinter: (checked: boolean) => void;
  onChangeDPI: (dpi: number) => void;
  onChangeOrientation: (orient: OrientationOption) => void;
  onCustomDimensionChange: (rawW: number, rawH: number) => void;
}

export function OverlayEditorLeftSidebar({
  unit,
  paperSize,
  secondaryPrinter,
  dpi,
  orientation,
  canvasWidth,
  canvasHeight,
  bgColor,
  onAddPhotoSlot,
  onNewImageUpload,
  onAddTextElement,
  onAddShape,
  onSetCanvasBgColor,
  onAddQRCode,
  onAddSessionData,
  onChangeUnit,
  onChangePaperSize,
  onToggleSecondaryPrinter,
  onChangeDPI,
  onChangeOrientation,
  onCustomDimensionChange,
}: OverlayEditorLeftSidebarProps) {
  const addImageInputRef = useRef<HTMLInputElement | null>(null);
  const [isShapeMenuOpen, setIsShapeMenuOpen] = useState(false);
  const [isSessionMenuOpen, setIsSessionMenuOpen] = useState(false);

  const formatDimension = (pxValue: number): string => {
    if (unit === 'px') return String(pxValue);
    if (unit === 'in') return (pxValue / dpi).toFixed(1);
    return ((pxValue / dpi) * 2.54).toFixed(1);
  };

  const [widthInputVal, setWidthInputVal] = useState<string>(() => formatDimension(canvasWidth));
  const [heightInputVal, setHeightInputVal] = useState<string>(() => formatDimension(canvasHeight));

  useEffect(() => {
    setWidthInputVal(formatDimension(canvasWidth));
    setHeightInputVal(formatDimension(canvasHeight));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasWidth, canvasHeight, unit, dpi]);

  const handleDimensionCommit = (nextWStr: string, nextHStr: string) => {
    const parsedW = parseFloat(nextWStr) || 1200;
    const parsedH = parseFloat(nextHStr) || 1800;
    onCustomDimensionChange(parsedW, parsedH);
  };

  return (
    <aside className="w-64 bg-[#222225] border-r border-[#323236] flex flex-col overflow-y-auto shrink-0 z-20">
      {/* ADD SECTION */}
      <div className="p-3 border-b border-[#323236]">
        <h2 className="font-semibold text-zinc-100 mb-2.5 text-xs tracking-wide">Add</h2>
        <div className="space-y-1">
          <button
            type="button"
            onClick={onAddPhotoSlot}
            className="w-full flex items-center space-x-3 px-2.5 py-2 rounded hover:bg-[#2d2d32] text-left transition group"
          >
            <Camera className="w-4 h-4 text-zinc-400 group-hover:text-sky-400" />
            <span className="text-zinc-300 group-hover:text-white">Photo From Booth</span>
          </button>

          <button
            type="button"
            onClick={() => addImageInputRef.current?.click()}
            className="w-full flex items-center space-x-3 px-2.5 py-2 rounded hover:bg-[#2d2d32] text-left transition group"
          >
            <ImageIcon className="w-4 h-4 text-zinc-400 group-hover:text-sky-400" />
            <span className="text-zinc-300 group-hover:text-white">Image / Overlay</span>
          </button>
          <input
            ref={addImageInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onNewImageUpload}
          />

          <button
            type="button"
            onClick={() => onAddTextElement()}
            className="w-full flex items-center space-x-3 px-2.5 py-2 rounded hover:bg-[#2d2d32] text-left transition group"
          >
            <Type className="w-4 h-4 text-zinc-400 group-hover:text-sky-400" />
            <span className="text-zinc-300 group-hover:text-white">Text</span>
          </button>

          {/* Shape Dropdown Trigger */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsShapeMenuOpen((prev) => !prev)}
              className="w-full flex items-center justify-between px-2.5 py-2 rounded hover:bg-[#2d2d32] text-left transition group"
            >
              <div className="flex items-center space-x-3">
                <Shapes className="w-4 h-4 text-zinc-400 group-hover:text-sky-400" />
                <span className="text-zinc-300 group-hover:text-white">Shape</span>
              </div>
              <ChevronRight
                className={`w-3.5 h-3.5 text-zinc-500 transition-transform ${
                  isShapeMenuOpen ? 'rotate-90' : ''
                }`}
              />
            </button>
            {isShapeMenuOpen && (
              <div className="pl-7 pr-2 py-1 space-y-1 bg-zinc-900/60 rounded mt-1">
                <button
                  type="button"
                  onClick={() => {
                    onAddShape('rect');
                    setIsShapeMenuOpen(false);
                  }}
                  className="w-full text-left py-1.5 px-2 rounded hover:bg-[#2d2d32] text-zinc-300 flex items-center gap-2"
                >
                  <span className="w-3 h-3 border border-zinc-400 inline-block" /> Rectangle
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onAddShape('circle');
                    setIsShapeMenuOpen(false);
                  }}
                  className="w-full text-left py-1.5 px-2 rounded hover:bg-[#2d2d32] text-zinc-300 flex items-center gap-2"
                >
                  <span className="w-3 h-3 border border-zinc-400 rounded-full inline-block" /> Circle
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onAddShape('ketupat');
                    setIsShapeMenuOpen(false);
                  }}
                  className="w-full text-left py-1.5 px-2 rounded hover:bg-[#2d2d32] text-zinc-300 flex items-center gap-2"
                >
                  <span className="w-2.5 h-2.5 bg-lime-500 rotate-45 inline-block" /> Ketupat
                  Ornament
                </button>
              </div>
            )}
          </div>

          {/* Background Color Picker */}
          <div className="flex items-center justify-between px-2.5 py-2 rounded hover:bg-[#2d2d32] transition">
            <div className="flex items-center space-x-3">
              <PaintBucket className="w-4 h-4 text-zinc-400" />
              <span className="text-zinc-300">Background Color</span>
            </div>
            <label
              className="w-5 h-5 rounded border border-zinc-500 cursor-pointer overflow-hidden shadow-inner"
              style={{ backgroundColor: bgColor }}
            >
              <input
                type="color"
                value={bgColor}
                className="opacity-0 w-full h-full cursor-pointer"
                onChange={(e) => onSetCanvasBgColor(e.target.value)}
              />
            </label>
          </div>

          <button
            type="button"
            onClick={onAddQRCode}
            className="w-full flex items-center space-x-3 px-2.5 py-2 rounded hover:bg-[#2d2d32] text-left transition group"
          >
            <QrCode className="w-4 h-4 text-zinc-400 group-hover:text-sky-400" />
            <span className="text-zinc-300 group-hover:text-white">QR Code (Softfile)</span>
          </button>

          {/* Session Data Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsSessionMenuOpen((prev) => !prev)}
              className="w-full flex items-center justify-between px-2.5 py-2 rounded hover:bg-[#2d2d32] text-left transition group"
            >
              <div className="flex items-center space-x-3">
                <UserSquare2 className="w-4 h-4 text-zinc-400 group-hover:text-sky-400" />
                <span className="text-zinc-300 group-hover:text-white">Session Data</span>
              </div>
              <ChevronRight
                className={`w-3.5 h-3.5 text-zinc-500 transition-transform ${
                  isSessionMenuOpen ? 'rotate-90' : ''
                }`}
              />
            </button>
            {isSessionMenuOpen && (
              <div className="pl-7 pr-2 py-1 space-y-1 bg-zinc-900/60 rounded mt-1">
                <button
                  type="button"
                  onClick={() => {
                    onAddSessionData('{{Event_Name}}');
                    setIsSessionMenuOpen(false);
                  }}
                  className="w-full text-left py-1 px-2 rounded hover:bg-[#2d2d32] text-zinc-300"
                >
                  Event Name
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onAddSessionData('{{Date_Time}}');
                    setIsSessionMenuOpen(false);
                  }}
                  className="w-full text-left py-1 px-2 rounded hover:bg-[#2d2d32] text-zinc-300"
                >
                  Date &amp; Time
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onAddSessionData('{{Session_ID}}');
                    setIsSessionMenuOpen(false);
                  }}
                  className="w-full text-left py-1 px-2 rounded hover:bg-[#2d2d32] text-zinc-300"
                >
                  Session ID (#001)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* LAYOUT SECTION */}
      <div className="p-3 space-y-3 flex-1">
        <h2 className="font-semibold text-zinc-100 text-xs tracking-wide">Layout</h2>

        <div>
          <label className="block text-[11px] text-zinc-400 mb-1">View Dimension In</label>
          <select
            value={unit}
            onChange={(e) => onChangeUnit(e.target.value as DimensionUnit)}
            className="w-full bg-zinc-900 border border-[#323236] rounded px-2.5 py-1.5 text-zinc-200 focus:outline-none focus:border-sky-500"
          >
            <option value="px">Pixels</option>
            <option value="in">Inches</option>
            <option value="cm">Centimeters</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] text-zinc-400 mb-1">Paper Size</label>
          <select
            value={paperSize}
            onChange={(e) => onChangePaperSize(e.target.value as PaperSizeOption)}
            className="w-full bg-zinc-900 border border-[#323236] rounded px-2.5 py-1.5 text-zinc-200 focus:outline-none focus:border-sky-500"
          >
            <option value="4x6">4 × 6 (Postcard)</option>
            <option value="2x6">2 × 6 (Photo Strip)</option>
            <option value="5x7">5 × 7</option>
            <option value="A4">A4 Document</option>
          </select>
        </div>

        <div className="flex items-center space-x-2 py-1">
          <input
            type="checkbox"
            id="secondary-printer"
            checked={secondaryPrinter}
            onChange={(e) => onToggleSecondaryPrinter(e.target.checked)}
            className="rounded bg-zinc-900 border-[#323236] text-sky-500 focus:ring-0"
          />
          <label htmlFor="secondary-printer" className="text-[11px] text-zinc-300 cursor-pointer">
            Print to Secondary Printer
          </label>
        </div>

        <div>
          <label className="block text-[11px] text-zinc-400 mb-1">Resolution</label>
          <select
            value={dpi}
            onChange={(e) => onChangeDPI(Number(e.target.value))}
            className="w-full bg-zinc-900 border border-[#323236] rounded px-2.5 py-1.5 text-zinc-200 focus:outline-none focus:border-sky-500"
          >
            <option value={300}>300 dpi (Print Quality)</option>
            <option value={150}>150 dpi (Draft)</option>
            <option value={600}>600 dpi (Ultra HD)</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] text-zinc-400 mb-1">Orientation</label>
          <select
            value={orientation}
            onChange={(e) => onChangeOrientation(e.target.value as OrientationOption)}
            className="w-full bg-zinc-900 border border-[#323236] rounded px-2.5 py-1.5 text-zinc-200 focus:outline-none focus:border-sky-500"
          >
            <option value="vertical">Vertical</option>
            <option value="horizontal">Horizontal</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <div>
            <label className="block text-[11px] text-zinc-400 mb-1">Width</label>
            <input
              type="number"
              value={widthInputVal}
              onChange={(e) => setWidthInputVal(e.target.value)}
              onBlur={() => handleDimensionCommit(widthInputVal, heightInputVal)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleDimensionCommit(widthInputVal, heightInputVal);
              }}
              className="w-full bg-zinc-900 border border-[#323236] rounded px-2 py-1 text-center text-zinc-200 focus:outline-none focus:border-sky-500"
            />
          </div>
          <div>
            <label className="block text-[11px] text-zinc-400 mb-1">Height</label>
            <input
              type="number"
              value={heightInputVal}
              onChange={(e) => setHeightInputVal(e.target.value)}
              onBlur={() => handleDimensionCommit(widthInputVal, heightInputVal)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleDimensionCommit(widthInputVal, heightInputVal);
              }}
              className="w-full bg-zinc-900 border border-[#323236] rounded px-2 py-1 text-center text-zinc-200 focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>
      </div>
    </aside>
  );
}

/* ============================================================================
   RIGHT SIDEBAR (PROPERTIES, DROP SHADOW, ALIGNMENT, LAYERS)
   ============================================================================ */
export interface OverlayEditorRightSidebarProps {
  elements: CanvasElement[];
  selectedId: string | null;
  selectedElement: CanvasElement | null;
  onSelectElement: (id: string) => void;
  onReplaceSelectedImage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onUpdateSelectedText: (prop: 'text' | 'fontSize' | 'color', value: string) => void;
  onUpdateStyle: (
    prop:
      | 'strokeColor'
      | 'strokeWidth'
      | 'shadowColor'
      | 'shadowAngle'
      | 'shadowDist'
      | 'shadowBlur',
    value: string
  ) => void;
  onCommitHistory: () => void;
  onToggleDropShadow: () => void;
  onAlignElement: (type: AlignmentType) => void;
  onToggleLayerVisibility: (id: string) => void;
  onRenameLayer: (id: string, newName: string) => void;
  onToggleLockSelected: () => void;
  onDeleteSelectedElement: () => void;
}

export function OverlayEditorRightSidebar({
  elements,
  selectedId,
  selectedElement,
  onSelectElement,
  onReplaceSelectedImage,
  onUpdateSelectedText,
  onUpdateStyle,
  onCommitHistory,
  onToggleDropShadow,
  onAlignElement,
  onToggleLayerVisibility,
  onRenameLayer,
  onToggleLockSelected,
  onDeleteSelectedElement,
}: OverlayEditorRightSidebarProps) {
  const replaceImgInputRef = useRef<HTMLInputElement | null>(null);

  const [isShadowOpen, setIsShadowOpen] = useState(true);
  const [isAlignmentOpen, setIsAlignmentOpen] = useState(true);
  const [isLayersOpen, setIsLayersOpen] = useState(true);

  // Inline layer rename state
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameDraft, setRenameDraft] = useState<string>('');

  const panelTitle = !selectedElement
    ? 'Canvas Background'
    : selectedElement.type === 'image'
      ? 'Image'
      : selectedElement.type === 'photo'
        ? 'Photo Slot'
        : selectedElement.type === 'text'
          ? 'Text Properties'
          : selectedElement.type.toUpperCase();

  const panelBadge = !selectedElement
    ? '-'
    : String(selectedElement.layerNumber || selectedElement.slotIndex || '1');

  const isShadowActive = Boolean(selectedElement?.dropShadow);

  // Display layers in reverse order (Top layer on top of UI list)
  const reversedLayers = [...elements].reverse();

  const commitRename = (el: CanvasElement) => {
    const trimmed = renameDraft.trim();
    if (trimmed && trimmed !== el.name) {
      onRenameLayer(el.id, trimmed);
    }
    setRenamingId(null);
  };

  return (
    <aside className="w-72 bg-[#222225] border-l border-[#323236] flex flex-col overflow-y-auto shrink-0 z-20">
      {/* PROPERTIES HEADER & THUMBNAIL */}
      <div className="p-3 border-b border-[#323236]">
        <div className="flex items-center justify-between mb-2.5">
          <span className="font-semibold text-zinc-100">{panelTitle}</span>
          <span className="bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded text-[10px]">
            {panelBadge}
          </span>
        </div>

        {/* Thumbnail & Replace Button (Only when Image selected) */}
        {selectedElement?.type === 'image' && (
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-12 h-14 rounded bg-zinc-900 border border-[#323236] overflow-hidden flex items-center justify-center shrink-0">
              {selectedElement.src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={selectedElement.src}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => replaceImgInputRef.current?.click()}
              className="flex-1 py-2 px-3 rounded-full border border-zinc-600 hover:border-zinc-400 hover:bg-[#2d2d32] text-zinc-200 font-medium transition text-center"
            >
              Choose Image
            </button>
            <input
              ref={replaceImgInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onReplaceSelectedImage}
            />
          </div>
        )}

        {/* Text Specific Controls (Hidden unless text selected) */}
        {selectedElement?.type === 'text' && (
          <div className="space-y-2.5 mb-3 pb-3 border-b border-[#323236]">
            <div>
              <label className="block text-[11px] text-zinc-400 mb-1">Text Content</label>
              <input
                type="text"
                value={selectedElement.text ?? ''}
                onChange={(e) => onUpdateSelectedText('text', e.target.value)}
                onBlur={onCommitHistory}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onCommitHistory();
                }}
                className="w-full bg-zinc-900 border border-[#323236] rounded px-2 py-1 text-zinc-100 focus:border-sky-500 focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Font Size</label>
                <input
                  type="number"
                  value={selectedElement.fontSize ?? 24}
                  onChange={(e) => onUpdateSelectedText('fontSize', e.target.value)}
                  onBlur={onCommitHistory}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') onCommitHistory();
                  }}
                  className="w-full bg-zinc-900 border border-[#323236] rounded px-2 py-1 text-zinc-100"
                />
              </div>
              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Text Color</label>
                <input
                  type="color"
                  value={selectedElement.color ?? '#ffffff'}
                  onChange={(e) => onUpdateSelectedText('color', e.target.value)}
                  onBlur={onCommitHistory}
                  className="w-full h-7 bg-zinc-900 border border-[#323236] rounded cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* Stroke Color & Width */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-zinc-300">Stroke Color</span>
            <label
              className="w-8 h-5 rounded border border-zinc-600 cursor-pointer overflow-hidden"
              style={{ backgroundColor: selectedElement?.strokeColor || '#000000' }}
            >
              <input
                type="color"
                value={selectedElement?.strokeColor || '#000000'}
                onChange={(e) => onUpdateStyle('strokeColor', e.target.value)}
                onBlur={onCommitHistory}
                className="opacity-0 w-full h-full cursor-pointer"
              />
            </label>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-zinc-300">Stroke Width</span>
              <div className="flex items-center space-x-1">
                <input
                  type="number"
                  min={0}
                  max={50}
                  value={selectedElement?.strokeWidth ?? 0}
                  onChange={(e) => onUpdateStyle('strokeWidth', e.target.value)}
                  onBlur={onCommitHistory}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') onCommitHistory();
                  }}
                  className="w-11 bg-zinc-900 border border-[#323236] rounded px-1 py-0.5 text-right text-zinc-200"
                />
                <span className="text-zinc-500 text-[10px]">px</span>
              </div>
            </div>
            <input
              type="range"
              min={0}
              max={30}
              value={selectedElement?.strokeWidth ?? 0}
              onChange={(e) => onUpdateStyle('strokeWidth', e.target.value)}
              onPointerUp={onCommitHistory}
              onKeyUp={onCommitHistory}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* DROP SHADOW ACCORDION */}
      <div className="border-b border-[#323236]">
        <button
          type="button"
          onClick={() => setIsShadowOpen((prev) => !prev)}
          className="w-full px-3 py-2.5 flex items-center justify-between hover:bg-[#2d2d32] transition"
        >
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-zinc-100">Drop Shadow</span>
            <span
              className={
                isShadowActive
                  ? 'text-[10px] px-1.5 py-0.5 rounded bg-purple-600/30 text-purple-300 border border-purple-500/40'
                  : 'text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400'
              }
            >
              {isShadowActive ? 'On' : 'Off'}
            </span>
          </div>
          <ChevronUp
            className={`w-4 h-4 text-zinc-400 transition-transform ${
              !isShadowOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {isShadowOpen && (
          <div className="px-3 pb-3 pt-1">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-zinc-300">Enable Shadow</span>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={onToggleDropShadow}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors flex items-center ${
                    isShadowActive ? 'bg-purple-600' : 'bg-zinc-700'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full bg-white transition-transform transform ${
                      isShadowActive ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
                <span className="text-[11px] text-zinc-400 w-5">
                  {isShadowActive ? 'On' : 'Off'}
                </span>
              </div>
            </div>

            {/* Shadow Sub-controls */}
            <div
              className={`space-y-2.5 transition-opacity ${
                isShadowActive ? '' : 'opacity-50 pointer-events-none'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Color</span>
                <label
                  className="w-8 h-5 rounded border border-zinc-600 cursor-pointer overflow-hidden"
                  style={{ backgroundColor: selectedElement?.shadowColor || '#000000' }}
                >
                  <input
                    type="color"
                    value={selectedElement?.shadowColor || '#000000'}
                    onChange={(e) => onUpdateStyle('shadowColor', e.target.value)}
                    onBlur={onCommitHistory}
                    className="opacity-0 w-full h-full cursor-pointer"
                  />
                </label>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-zinc-400">Angle</span>
                  <div className="flex items-center space-x-1">
                    <input
                      type="number"
                      min={-180}
                      max={180}
                      value={selectedElement?.shadowAngle ?? -45}
                      onChange={(e) => onUpdateStyle('shadowAngle', e.target.value)}
                      onBlur={onCommitHistory}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') onCommitHistory();
                      }}
                      className="w-11 bg-zinc-900 border border-[#323236] rounded px-1 py-0.5 text-right text-zinc-200"
                    />
                    <span className="text-zinc-500 text-[10px]">°</span>
                  </div>
                </div>
                <input
                  type="range"
                  min={-180}
                  max={180}
                  value={selectedElement?.shadowAngle ?? -45}
                  onChange={(e) => onUpdateStyle('shadowAngle', e.target.value)}
                  onPointerUp={onCommitHistory}
                  onKeyUp={onCommitHistory}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-zinc-400">Distance</span>
                  <div className="flex items-center space-x-1">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={selectedElement?.shadowDist ?? 10}
                      onChange={(e) => onUpdateStyle('shadowDist', e.target.value)}
                      onBlur={onCommitHistory}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') onCommitHistory();
                      }}
                      className="w-11 bg-zinc-900 border border-[#323236] rounded px-1 py-0.5 text-right text-zinc-200"
                    />
                    <span className="text-zinc-500 text-[10px]">px</span>
                  </div>
                </div>
                <input
                  type="range"
                  min={0}
                  max={50}
                  value={selectedElement?.shadowDist ?? 10}
                  onChange={(e) => onUpdateStyle('shadowDist', e.target.value)}
                  onPointerUp={onCommitHistory}
                  onKeyUp={onCommitHistory}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-zinc-400">Spread / Blur</span>
                  <div className="flex items-center space-x-1">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={selectedElement?.shadowBlur ?? 20}
                      onChange={(e) => onUpdateStyle('shadowBlur', e.target.value)}
                      onBlur={onCommitHistory}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') onCommitHistory();
                      }}
                      className="w-11 bg-zinc-900 border border-[#323236] rounded px-1 py-0.5 text-right text-zinc-200"
                    />
                    <span className="text-zinc-500 text-[10px]">px</span>
                  </div>
                </div>
                <input
                  type="range"
                  min={0}
                  max={60}
                  value={selectedElement?.shadowBlur ?? 20}
                  onChange={(e) => onUpdateStyle('shadowBlur', e.target.value)}
                  onPointerUp={onCommitHistory}
                  onKeyUp={onCommitHistory}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ALIGNMENT ACCORDION */}
      <div className="border-b border-[#323236]">
        <button
          type="button"
          onClick={() => setIsAlignmentOpen((prev) => !prev)}
          className="w-full px-3 py-2.5 flex items-center justify-between hover:bg-[#2d2d32] transition"
        >
          <span className="font-semibold text-zinc-100">Alignment</span>
          <ChevronUp
            className={`w-4 h-4 text-zinc-400 transition-transform ${
              !isAlignmentOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {isAlignmentOpen && (
          <div className="px-3 pb-3 pt-1">
            {/* 2 Rows x 4 Columns Alignment Icons */}
            <div className="grid grid-cols-4 gap-2">
              {/* Row 1: Vertical Alignments */}
              <button
                type="button"
                onClick={() => onAlignElement('top')}
                className="p-2 rounded hover:bg-purple-600/20 hover:text-purple-400 flex items-center justify-center text-zinc-300 transition"
                title="Align Top"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="3" y="3" width="18" height="2" />
                  <rect x="6" y="7" width="4" height="13" />
                  <rect x="14" y="7" width="4" height="8" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => onAlignElement('middle-v')}
                className="p-2 rounded hover:bg-purple-600/20 hover:text-purple-400 flex items-center justify-center text-zinc-300 transition"
                title="Align Vertical Middle"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="3" y="11" width="18" height="2" />
                  <rect x="6" y="5" width="4" height="14" />
                  <rect x="14" y="8" width="4" height="8" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => onAlignElement('bottom')}
                className="p-2 rounded hover:bg-purple-600/20 hover:text-purple-400 flex items-center justify-center text-zinc-300 transition"
                title="Align Bottom"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="3" y="19" width="18" height="2" />
                  <rect x="6" y="4" width="4" height="13" />
                  <rect x="14" y="9" width="4" height="8" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => onAlignElement('distribute-v')}
                className="p-2 rounded hover:bg-purple-600/20 hover:text-purple-400 flex items-center justify-center text-zinc-300 transition"
                title="Center Vertically on Canvas"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="4" y="6" width="16" height="1.5" />
                  <rect x="8" y="4" width="8" height="5.5" />
                  <rect x="4" y="16.5" width="16" height="1.5" />
                  <rect x="6" y="14.5" width="12" height="5.5" />
                </svg>
              </button>

              {/* Row 2: Horizontal Alignments */}
              <button
                type="button"
                onClick={() => onAlignElement('left')}
                className="p-2 rounded hover:bg-purple-600/20 hover:text-purple-400 flex items-center justify-center text-zinc-300 transition"
                title="Align Left"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="3" y="3" width="2" height="18" />
                  <rect x="7" y="6" width="8" height="4" />
                  <rect x="7" y="14" width="13" height="4" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => onAlignElement('center-h')}
                className="p-2 rounded hover:bg-purple-600/20 hover:text-purple-400 flex items-center justify-center text-zinc-300 transition"
                title="Align Horizontal Center"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="11" y="3" width="2" height="18" />
                  <rect x="8" y="6" width="8" height="4" />
                  <rect x="5" y="14" width="14" height="4" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => onAlignElement('right')}
                className="p-2 rounded hover:bg-purple-600/20 hover:text-purple-400 flex items-center justify-center text-zinc-300 transition"
                title="Align Right"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="19" y="3" width="2" height="18" />
                  <rect x="9" y="6" width="8" height="4" />
                  <rect x="4" y="14" width="13" height="4" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => onAlignElement('center-both')}
                className="p-2 rounded hover:bg-purple-600/20 hover:text-purple-400 flex items-center justify-center text-zinc-300 transition"
                title="Center Both (Canvas Center)"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="1.5" height="16" />
                  <rect x="4" y="6" width="5.5" height="12" />
                  <rect x="16.5" y="4" width="1.5" height="16" />
                  <rect x="14.5" y="8" width="5.5" height="8" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* LAYERS ACCORDION SECTION */}
      <div className="flex-1 flex flex-col min-h-[180px] border-b border-[#323236]">
        <button
          type="button"
          onClick={() => setIsLayersOpen((prev) => !prev)}
          className="w-full px-3 py-2.5 flex items-center justify-between hover:bg-[#2d2d32] transition border-b border-[#323236]/50"
        >
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-zinc-100">Layers</span>
            <span className="text-[10px] text-zinc-400">({elements.length} items)</span>
          </div>
          <ChevronUp
            className={`w-4 h-4 text-zinc-400 transition-transform ${
              !isLayersOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {isLayersOpen && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Layers List */}
            <div className="flex-1 overflow-y-auto divide-y divide-[#323236]/40">
              {reversedLayers.map((el) => {
                const isSelected = el.id === selectedId;
                const isRenaming = renamingId === el.id;

                return (
                  <div
                    key={el.id}
                    onClick={() => {
                      if (!isSelected) onSelectElement(el.id);
                    }}
                    className={`flex items-center justify-between px-3 py-2 cursor-pointer transition ${
                      isSelected
                        ? 'bg-purple-600 text-white shadow-inner'
                        : 'hover:bg-[#2d2d32] text-zinc-300'
                    }`}
                  >
                    {/* Left: Eye Icon + Badge/Thumb + Name */}
                    <div className="flex items-center space-x-2.5 overflow-hidden flex-1 pr-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleLayerVisibility(el.id);
                        }}
                        className={`p-0.5 rounded hover:bg-black/20 shrink-0 ${
                          !el.visible ? 'opacity-40' : ''
                        }`}
                      >
                        {el.visible ? (
                          <Eye className="w-3.5 h-3.5" />
                        ) : (
                          <EyeOff className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {/* Layer Icon/Thumbnail */}
                      {el.type === 'image' ? (
                        <div className="w-6 h-7 rounded bg-zinc-900 border border-white/20 overflow-hidden shrink-0">
                          {el.src ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={el.src} alt="" className="w-full h-full object-cover" />
                          ) : null}
                        </div>
                      ) : el.type === 'photo' ? (
                        <div
                          className="w-6 h-6 rounded flex items-center justify-center font-bold text-white text-[11px] shrink-0 shadow-sm"
                          style={{ backgroundColor: el.badgeColor || '#ef4444' }}
                        >
                          {el.slotIndex}
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded bg-zinc-800 flex items-center justify-center text-zinc-200 text-[10px] shrink-0">
                          {el.type === 'text' ? (
                            <Type className="w-3.5 h-3.5" />
                          ) : el.type === 'qrcode' ? (
                            <QrCode className="w-3.5 h-3.5" />
                          ) : (
                            <Shapes className="w-3.5 h-3.5" />
                          )}
                        </div>
                      )}

                      {isRenaming ? (
                        <input
                          type="text"
                          autoFocus
                          value={renameDraft}
                          onChange={(e) => setRenameDraft(e.target.value)}
                          onBlur={() => commitRename(el)}
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              commitRename(el);
                            } else if (e.key === 'Escape') {
                              setRenamingId(null);
                            }
                          }}
                          className="bg-zinc-950 text-white text-xs px-1.5 py-0.5 rounded border border-purple-300 outline-none w-full font-medium"
                        />
                      ) : (
                        <span
                          title="Double-click untuk rename layer"
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            onSelectElement(el.id);
                            setRenamingId(el.id);
                            setRenameDraft(el.name);
                          }}
                          className="truncate font-medium text-xs flex-1 py-0.5 rounded px-1"
                        >
                          {el.name}
                        </span>
                      )}
                    </div>

                    {/* Right: Lock indicator if locked */}
                    <div className="shrink-0">
                      {el.locked ? <Lock className="w-3 h-3 opacity-90" /> : null}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Layer Actions (Lock & Delete) */}
            <div className="p-2 border-t border-[#323236] flex items-center justify-between bg-zinc-900/50">
              <span className="text-[10px] text-zinc-500 pl-1">Double-click layer to rename</span>
              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  onClick={onToggleLockSelected}
                  className={`p-1.5 rounded hover:bg-[#2d2d32] transition ${
                    selectedElement?.locked
                      ? 'text-purple-400'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                  title="Kunci / Buka Kunci Layer"
                >
                  <Lock className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={onDeleteSelectedElement}
                  className="p-1.5 rounded hover:bg-red-950/60 text-zinc-400 hover:text-red-400 transition"
                  title="Hapus Layer Terpilih"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}