'use client';

import React, { useEffect } from 'react';
import { useOverlayEditor } from '../../../types/useOverlayEditor';
import { OverlayEditorToolbar } from './overlay-editor/OverlayEditorToolbar';
import {
  OverlayEditorLeftSidebar,
  OverlayEditorRightSidebar,
} from './overlay-editor/OverlayEditorSidebar';
import { OverlayEditorCanvas } from './overlay-editor/OverlayEditorCanvas';
import './overlay-editor/overlay-editor.css';

export interface ModalOverlayEditorProps {
  isOpen?: boolean;
  onClose?: () => void;
  onApply?: (dataUrl: string, name: string, dimensions: string) => void;
  initialWidth?: number;
  initialHeight?: number;
}

export function ModalOverlayEditor({
  isOpen = true,
  onClose,
  onApply,
  initialWidth,
  initialHeight,
}: ModalOverlayEditorProps) {
  const editor = useOverlayEditor();

  useEffect(() => {
    if (!isOpen) return;
    if (
      typeof initialWidth === 'number' &&
      initialWidth > 0 &&
      typeof initialHeight === 'number' &&
      initialHeight > 0
    ) {
      editor.customDimensionChange(initialWidth, initialHeight);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialWidth, initialHeight]);

  if (!isOpen) return null;

  const handleApplyAndClose = async () => {
    await editor.exportOverlayPNG();
    const domCanvas = editor.canvasRef.current;
    const displayW = domCanvas?.offsetWidth || 400;
    const displayH = domCanvas?.offsetHeight || 600;
    const scaleX = editor.canvasWidth / displayW;
    const scaleY = editor.canvasHeight / displayH;

    const offscreen = document.createElement('canvas');
    offscreen.width = editor.canvasWidth;
    offscreen.height = editor.canvasHeight;
    const ctx = offscreen.getContext('2d');
    if (ctx) {
      ctx.fillStyle = editor.bgColor;
      ctx.fillRect(0, 0, offscreen.width, offscreen.height);

      for (const el of editor.elements) {
        if (!el.visible) continue;
        const x = el.x * scaleX;
        const y = el.y * scaleY;
        const w = el.width * scaleX;
        const h = el.height * scaleY;
        ctx.save();
        ctx.translate(x + w / 2, y + h / 2);
        ctx.rotate(((el.rotation || 0) * Math.PI) / 180);

        if (el.type === 'image' && el.src) {
          await new Promise<void>((resolve) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
              ctx.drawImage(img, -w / 2, -h / 2, w, h);
              resolve();
            };
            img.onerror = () => resolve();
            img.src = el.src as string;
          });
        } else if (el.type === 'text') {
          ctx.fillStyle = el.color || '#ffffff';
          ctx.font = `bold ${Math.round((el.fontSize || 22) * scaleX)}px Inter, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(el.text || '', 0, 0);
        } else if (el.type === 'shape') {
          ctx.fillStyle = el.fillColor || '#84cc16';
          ctx.fillRect(-w / 2, -h / 2, w, h);
        }
        ctx.restore();
      }

      const dataUrl = offscreen.toDataURL('image/png');
      const fileName =
        (editor.templateName || 'cekreks-overlay')
          .trim()
          .toLowerCase()
          .replace(/\s+/g, '-') + '.png';
      const dimensions = `${editor.canvasWidth}x${editor.canvasHeight} px`;

      if (onApply) {
        onApply(dataUrl, fileName, dimensions);
      }
    }

    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="overlay-editor-root fixed inset-0 z-50 bg-[#18181b] text-zinc-200 font-sans h-screen w-screen flex flex-col overflow-hidden select-none text-xs">
      {/* ================= TOP TOOLBAR ================= */}
      <OverlayEditorToolbar
        templateName={editor.templateName}
        canUndo={editor.canUndo}
        canRedo={editor.canRedo}
        onNewTemplate={editor.newTemplate}
        onSaveAsNew={editor.saveAsNew}
        onImportJSON={editor.importJSON}
        onExportTemplate={editor.exportTemplate}
        onUndo={editor.undo}
        onRedo={editor.redo}
        onPrintTestCopy={editor.printTestCopy}
        onDeleteTemplate={editor.deleteTemplate}
        onExportOverlayPNG={onApply ? handleApplyAndClose : editor.exportOverlayPNG}
        onClose={onClose}
      />

      {/* ================= MAIN WORKSPACE AREA ================= */}
      <div className="flex-1 flex overflow-hidden">
        {/* ================= LEFT SIDEBAR (ADD & LAYOUT) ================= */}
        <OverlayEditorLeftSidebar
          unit={editor.unit}
          paperSize={editor.paperSize}
          secondaryPrinter={editor.secondaryPrinter}
          dpi={editor.dpi}
          orientation={editor.orientation}
          canvasWidth={editor.canvasWidth}
          canvasHeight={editor.canvasHeight}
          bgColor={editor.bgColor}
          onAddPhotoSlot={editor.addPhotoSlot}
          onNewImageUpload={editor.handleNewImageUpload}
          onAddTextElement={editor.addTextElement}
          onAddShape={editor.addShape}
          onSetCanvasBgColor={editor.setCanvasBgColor}
          onAddQRCode={editor.addQRCode}
          onAddSessionData={editor.addSessionData}
          onChangeUnit={editor.changeUnit}
          onChangePaperSize={editor.changePaperSize}
          onToggleSecondaryPrinter={editor.toggleSecondaryPrinter}
          onChangeDPI={editor.changeDPI}
          onChangeOrientation={editor.changeOrientation}
          onCustomDimensionChange={editor.customDimensionChange}
        />

        {/* ================= CENTER CANVAS WORKSPACE ================= */}
        <OverlayEditorCanvas
          elements={editor.elements}
          selectedId={editor.selectedId}
          bgColor={editor.bgColor}
          canvasWidth={editor.canvasWidth}
          canvasHeight={editor.canvasHeight}
          displayScale={editor.displayScale}
          isTestPhotosActive={editor.isTestPhotosActive}
          canvasRef={editor.canvasRef}
          elementRefs={editor.elementRefs}
          onSelectElement={editor.selectElement}
          onDeselectAll={editor.deselectAll}
          onUpdateElementDirect={editor.updateElementDirect}
          onCommitHistory={editor.saveHistory}
          onSwitchPreset={editor.switchPreset}
          onAdjustZoom={editor.adjustZoom}
          onBringForward={editor.bringForward}
          onSendBackward={editor.sendBackward}
          onToggleTestBoothPhotos={editor.toggleTestBoothPhotos}
          onShowToast={editor.showToast}
        />

        {/* ================= RIGHT SIDEBAR (PROPERTIES, ALIGNMENT, LAYERS) ================= */}
        <OverlayEditorRightSidebar
          elements={editor.elements}
          selectedId={editor.selectedId}
          selectedElement={editor.selectedElement}
          onSelectElement={editor.selectElement}
          onReplaceSelectedImage={editor.replaceSelectedImage}
          onUpdateSelectedText={editor.updateSelectedText}
          onUpdateStyle={editor.updateStyle}
          onCommitHistory={editor.saveHistory}
          onToggleDropShadow={editor.toggleDropShadow}
          onAlignElement={editor.alignElement}
          onToggleLayerVisibility={editor.toggleLayerVisibility}
          onRenameLayer={editor.renameLayer}
          onToggleLockSelected={editor.toggleLockSelected}
          onDeleteSelectedElement={editor.deleteSelectedElement}
        />
      </div>

      {/* TOAST NOTIFICATION */}
      <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 pointer-events-none flex flex-col items-center space-y-2">
        {editor.toasts.map((toast) => (
          <div
            key={toast.id}
            className="bg-zinc-900/95 border border-zinc-700 text-zinc-100 px-4 py-2 rounded-full shadow-xl text-xs flex items-center space-x-2 animate-bounce"
          >
            <span className="w-2 h-2 rounded-full bg-sky-400" />
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

      {/* CUSTOM CONFIRMATION MODAL */}
      {editor.confirmModal.isOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#222225] border border-[#323236] rounded-xl max-w-sm w-full p-5 shadow-2xl">
            <h3 className="text-sm font-semibold text-white mb-2">
              {editor.confirmModal.title}
            </h3>
            <p className="text-xs text-zinc-300 mb-5 leading-relaxed">
              {editor.confirmModal.message}
            </p>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={editor.closeModal}
                className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  editor.confirmModal.onConfirm?.();
                  editor.closeModal();
                }}
                className="px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-medium transition"
              >
                Ya, Lanjutkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ModalOverlayEditor;