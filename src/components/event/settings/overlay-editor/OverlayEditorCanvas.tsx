'use client';

import React, { useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Layers, Layers2, Camera } from 'lucide-react';
import type {
  CanvasElement,
  ResizeHandlePosition,
} from './overlay-editor.types';
import { SAMPLE_BOOTH_PHOTOS } from './useOverlayEditor';

export interface OverlayEditorCanvasProps {
  elements: CanvasElement[];
  selectedId: string | null;
  bgColor: string;
  canvasWidth: number;
  canvasHeight: number;
  displayScale: number;
  isTestPhotosActive: boolean;
  canvasRef: React.RefObject<HTMLDivElement | null>;
  elementRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
  onSelectElement: (id: string | null) => void;
  onDeselectAll: (targetId?: string) => void;
  onUpdateElementDirect: (
    id: string,
    patch: Partial<CanvasElement>,
    recordHistory?: boolean
  ) => void;
  onCommitHistory: () => void;
  onSwitchPreset: (dir: number) => void;
  onAdjustZoom: (delta: number) => void;
  onBringForward: () => void;
  onSendBackward: () => void;
  onToggleTestBoothPhotos: () => void;
  onShowToast: (message: string) => void;
}

interface ActiveGestureState {
  elementId: string;
  handle: ResizeHandlePosition | null;
  startX: number;
  startY: number;
  origX: number;
  origY: number;
  origW: number;
  origH: number;
  latestX: number;
  latestY: number;
  latestW: number;
  latestH: number;
  hasMoved: boolean;
}

const RESIZE_HANDLES: readonly ResizeHandlePosition[] = ['nw', 'ne', 'sw', 'se'];

export function OverlayEditorCanvas({
  elements,
  selectedId,
  bgColor,
  canvasWidth,
  canvasHeight,
  displayScale,
  isTestPhotosActive,
  canvasRef,
  elementRefs,
  onSelectElement,
  onDeselectAll,
  onUpdateElementDirect,
  onCommitHistory,
  onSwitchPreset,
  onAdjustZoom,
  onBringForward,
  onSendBackward,
  onToggleTestBoothPhotos,
  onShowToast,
}: OverlayEditorCanvasProps) {
  const gestureRef = useRef<ActiveGestureState | null>(null);
  const cleanupListenersRef = useRef<(() => void) | null>(null);

  // Keep latest scale & callbacks in ref to avoid stale closures during pointermove/pointerup
  const latestRef = useRef({
    displayScale,
    onUpdateElementDirect,
    onCommitHistory,
  });
  latestRef.current = {
    displayScale,
    onUpdateElementDirect,
    onCommitHistory,
  };

  // Ensure global pointer listeners are cleaned up if component unmounts mid-gesture
  useEffect(() => {
    return () => {
      if (cleanupListenersRef.current) {
        cleanupListenersRef.current();
        cleanupListenersRef.current = null;
      }
    };
  }, []);

  const scaleFactor = displayScale / 0.3333;
  const ratio = canvasWidth / canvasHeight;
  const displayCanvasWidth = ratio >= 1 ? 540 : Math.round(600 * ratio);
  const displayCanvasHeight = ratio >= 1 ? Math.round(540 / ratio) : 600;

  const handleElementPointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
    el: CanvasElement
  ) => {
    e.stopPropagation();

    if (el.id !== selectedId) {
      onSelectElement(el.id);
    }

    if (el.locked) {
      onShowToast('Layer ini dikunci');
      return;
    }

    // Only initiate drag/resize for primary mouse button or touch/pen
    if (e.pointerType === 'mouse' && e.button !== 0) {
      return;
    }

    const target = e.target as HTMLElement;
    const handleAttr = target.dataset.handle as ResizeHandlePosition | undefined;
    const handle: ResizeHandlePosition | null = handleAttr ?? null;

    // Clean up any leftover listeners before starting a new gesture
    if (cleanupListenersRef.current) {
      cleanupListenersRef.current();
      cleanupListenersRef.current = null;
    }

    gestureRef.current = {
      elementId: el.id,
      handle,
      startX: e.clientX,
      startY: e.clientY,
      origX: el.x,
      origY: el.y,
      origW: el.width,
      origH: el.height,
      latestX: el.x,
      latestY: el.y,
      latestW: el.width,
      latestH: el.height,
      hasMoved: false,
    };

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignore capture errors on synthetic events
    }

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const g = gestureRef.current;
      if (!g) return;

      const currentScale = latestRef.current.displayScale;
      // Match exact coordinate transformation formula from 03_overlay_editor.html:
      // dx = (curX - startX) / (this.displayScale * 3)
      const divisor = currentScale * 3;
      const dx = (moveEvent.clientX - g.startX) / divisor;
      const dy = (moveEvent.clientY - g.startY) / divisor;

      if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
        g.hasMoved = true;
      }

      if (g.handle) {
        if (g.handle.includes('e')) {
          g.latestW = Math.max(20, Math.round(g.origW + dx));
        }
        if (g.handle.includes('s')) {
          g.latestH = Math.max(20, Math.round(g.origH + dy));
        }
        if (g.handle.includes('w')) {
          const newW = Math.max(20, Math.round(g.origW - dx));
          g.latestX = g.origX + (g.origW - newW);
          g.latestW = newW;
        }
        if (g.handle.includes('n')) {
          const newH = Math.max(20, Math.round(g.origH - dy));
          g.latestY = g.origY + (g.origH - newH);
          g.latestH = newH;
        }
      } else {
        g.latestX = Math.round(g.origX + dx);
        g.latestY = Math.round(g.origY + dy);
      }

      // Smooth 60fps direct DOM update while dragging/resizing
      const domEl = elementRefs.current[g.elementId];
      if (domEl) {
        domEl.style.left = `${g.latestX}px`;
        domEl.style.top = `${g.latestY}px`;
        domEl.style.width = `${g.latestW}px`;
        domEl.style.height = `${g.latestH}px`;
      }
    };

    const finishGesture = () => {
      const g = gestureRef.current;
      gestureRef.current = null;

      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', finishGesture);
      window.removeEventListener('pointercancel', finishGesture);
      cleanupListenersRef.current = null;

      if (g && g.hasMoved) {
        latestRef.current.onUpdateElementDirect(
          g.elementId,
          {
            x: g.latestX,
            y: g.latestY,
            width: g.latestW,
            height: g.latestH,
          },
          true
        );
      }
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', finishGesture);
    window.addEventListener('pointercancel', finishGesture);

    cleanupListenersRef.current = () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', finishGesture);
      window.removeEventListener('pointercancel', finishGesture);
    };
  };

  const handleCanvasBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onSelectElement(null);
    }
  };

  const renderElementContent = (el: CanvasElement) => {
    if (el.type === 'photo') {
      const slotIdx = el.slotIndex ?? 1;
      if (isTestPhotosActive) {
        const photoUrl = SAMPLE_BOOTH_PHOTOS[(slotIdx - 1) % SAMPLE_BOOTH_PHOTOS.length];
        return (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photoUrl}
            className="w-full h-full object-cover pointer-events-none"
            alt={`Booth Photo ${slotIdx}`}
          />
        );
      }

      const bgTint =
        slotIdx === 1
          ? 'bg-rose-200/80'
          : slotIdx === 2
            ? 'bg-stone-200/80'
            : 'bg-teal-200/80';

      return (
        <div
          className={`w-full h-full ${bgTint} flex flex-col items-center justify-center text-white/90 font-bold text-2xl pointer-events-none`}
        >
          <span>{slotIdx}</span>
        </div>
      );
    }

    if (el.type === 'image') {
      return el.src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={el.src}
          className="w-full h-full object-fill pointer-events-none"
          alt={el.name}
        />
      ) : null;
    }

    if (el.type === 'text') {
      return (
        <div
          style={{
            color: el.color || '#ffffff',
            fontSize: `${el.fontSize ?? 22}px`,
            fontWeight: 'bold',
            textAlign: 'center',
            width: '100%',
            wordBreak: 'break-word',
          }}
          className="pointer-events-none"
        >
          {el.text}
        </div>
      );
    }

    if (el.type === 'shape') {
      if (el.shapeType === 'ketupat') {
        return (
          <div className="w-full h-full bg-lime-500 rotate-45 scale-75 border-2 border-lime-200 pointer-events-none" />
        );
      }
      return null;
    }

    if (el.type === 'qrcode') {
      return (
        <div className="w-full h-full bg-white p-1.5 rounded flex flex-col items-center justify-center pointer-events-none shadow">
          <svg viewBox="0 0 36 36" className="w-full h-full fill-zinc-900">
            <path d="M2,2 h10 v10 h-10 z M4,4 v6 h6 v-6 z M6,6 h2 v2 h-2 z M24,2 h10 v10 h-10 z M26,4 v6 h6 v-6 z M28,6 h2 v2 h-2 z M2,24 h10 v10 h-10 z M4,26 v6 h6 v-6 z M6,28 h2 v2 h-2 z M14,4 h4 v4 h-4 z M16,12 h6 v6 h-6 z M4,15 h6 v4 h-6 z M25,15 h7 v4 h-7 z M15,24 h5 v8 h-5 z M24,24 h4 v4 h-4 z M30,28 h4 v6 h-4 z" />
          </svg>
        </div>
      );
    }

    return null;
  };

  return (
    <main
      id="workspace-area"
      onClick={(e) => onDeselectAll((e.target as HTMLElement).id)}
      className="flex-1 canvas-workspace relative flex items-center justify-center overflow-hidden"
    >
      {/* Left / Right Preset Navigation Arrows */}
      <button
        type="button"
        onClick={() => onSwitchPreset(-1)}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-zinc-800/90 border border-zinc-700 flex items-center justify-center text-zinc-300 hover:text-white hover:bg-zinc-700 transition z-20 shadow-lg"
        title="Template Sebelumnya"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={() => onSwitchPreset(1)}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-zinc-800/90 border border-zinc-700 flex items-center justify-center text-zinc-300 hover:text-white hover:bg-zinc-700 transition z-20 shadow-lg"
        title="Template Berikutnya"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Zoom Indicator */}
      <div className="absolute top-3 right-4 bg-zinc-900/80 border border-[#323236] px-2.5 py-1 rounded text-[11px] text-zinc-400 flex items-center space-x-2 z-20">
        <button
          type="button"
          onClick={() => onAdjustZoom(-0.05)}
          className="hover:text-white"
        >
          -
        </button>
        <span>{Math.round(displayScale * 100)}%</span>
        <button
          type="button"
          onClick={() => onAdjustZoom(0.05)}
          className="hover:text-white"
        >
          +
        </button>
      </div>

      {/* ACTUAL PRINT CANVAS (Scaled to fit screen) */}
      <div
        id="canvas-scaler"
        style={{ transform: `scale(${scaleFactor})` }}
        className="transition-transform duration-150 ease-out flex items-center justify-center"
      >
        <div
          id="print-canvas"
          ref={canvasRef}
          onClick={handleCanvasBackgroundClick}
          style={{
            width: `${displayCanvasWidth}px`,
            height: `${displayCanvasHeight}px`,
            backgroundColor: bgColor,
          }}
          className="relative shadow-2xl overflow-hidden"
        >
          {/* Render elements from bottom (index 0) to top (last index) */}
          {elements.map((el) => {
            if (!el.visible) return null;

            const isSelected = selectedId === el.id;

            const style: React.CSSProperties = {
              left: `${el.x}px`,
              top: `${el.y}px`,
              width: `${el.width}px`,
              height: `${el.height}px`,
              transform: `rotate(${el.rotation || 0}deg)`,
            };

            if (el.strokeWidth > 0) {
              style.border = `${el.strokeWidth}px solid ${el.strokeColor || '#000000'}`;
            }

            if (el.dropShadow) {
              const rad = (el.shadowAngle * Math.PI) / 180;
              const offsetX = Math.round(Math.cos(rad) * el.shadowDist);
              const offsetY = Math.round(Math.sin(rad) * el.shadowDist);
              style.filter = `drop-shadow(${offsetX}px ${offsetY}px ${el.shadowBlur}px ${el.shadowColor})`;
            }

            if (el.type === 'text') {
              style.display = 'flex';
              style.alignItems = 'center';
              style.justifyContent = 'center';
            } else if (el.type === 'shape') {
              if (el.shapeType === 'circle') {
                style.borderRadius = '9999px';
                style.backgroundColor = el.fillColor || '#84cc16';
              } else if (el.shapeType !== 'ketupat') {
                style.backgroundColor = el.fillColor || '#0ea5e9';
              }
            }

            return (
              <div
                key={el.id}
                id={`el-${el.id}`}
                ref={(node) => {
                  elementRefs.current[el.id] = node;
                }}
                onPointerDown={(e) => handleElementPointerDown(e, el)}
                style={style}
                className={`canvas-element-item absolute cursor-move select-none group ${
                  isSelected ? 'element-selected' : ''
                }`}
              >
                {renderElementContent(el)}

                {/* 4 Corner Resize Handles */}
                {!el.locked &&
                  RESIZE_HANDLES.map((pos) => (
                    <div
                      key={pos}
                      data-handle={pos}
                      className={`resize-handle handle-${pos}`}
                    />
                  ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* BOTTOM FLOATING ACTION BAR */}
      {/* Bottom Left: Layer Ordering */}
      <div className="absolute bottom-4 left-4 bg-[#222225]/95 backdrop-blur border border-[#323236] rounded-lg px-2 py-1.5 flex items-center space-x-2 shadow-xl z-20">
        <button
          type="button"
          onClick={onBringForward}
          className="flex items-center space-x-1.5 px-2.5 py-1 rounded hover:bg-[#2d2d32] text-zinc-300 hover:text-white transition text-[11px]"
        >
          <Layers className="w-3.5 h-3.5 text-sky-400" />
          <span>Bring Forward</span>
        </button>
        <div className="h-4 w-[1px] bg-[#323236]" />
        <button
          type="button"
          onClick={onSendBackward}
          className="flex items-center space-x-1.5 px-2.5 py-1 rounded hover:bg-[#2d2d32] text-zinc-300 hover:text-white transition text-[11px]"
        >
          <Layers2 className="w-3.5 h-3.5 text-zinc-400" />
          <span>Send Backward</span>
        </button>
      </div>

      {/* Bottom Right: Test Isi Foto Booth */}
      <div className="absolute bottom-4 right-4 z-20">
        <button
          type="button"
          onClick={onToggleTestBoothPhotos}
          className={`${
            isTestPhotosActive
              ? 'bg-amber-600 hover:bg-amber-500'
              : 'bg-emerald-600 hover:bg-emerald-500'
          } text-white font-medium px-4 py-2 rounded-lg shadow-lg shadow-emerald-950/50 flex items-center space-x-2 transition transform active:scale-95`}
        >
          <Camera className="w-4 h-4" />
          <span>{isTestPhotosActive ? 'Reset Preview Foto' : 'Test Isi Foto Booth'}</span>
        </button>
      </div>
    </main>
  );
}