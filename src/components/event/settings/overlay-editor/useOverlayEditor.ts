'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import type React from 'react';
import type {
  CanvasElement,
  ElementType,
  DimensionUnit,
  PaperSizeOption,
  OrientationOption,
  AlignmentType,
  ShapeType,
  EditorSnapshot,
  ConfirmModalState,
  ToastItem,
  SavedTemplatePayload,
} from './overlay-editor.types';

export const SAMPLE_BOOTH_PHOTOS: readonly string[] = [
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&w=600&q=80',
];

const DEFAULT_BG_COLOR = '#1b4d3e';
const DEFAULT_TEMPLATE_NAME = 'Lebaran Momen 1447H';
const INITIAL_DISPLAY_SCALE = 0.3333;

const VALID_ELEMENT_TYPES: readonly ElementType[] = [
  'photo',
  'image',
  'text',
  'shape',
  'qrcode',
];

const VALID_PAPER_SIZES: readonly PaperSizeOption[] = ['4x6', '2x6', '5x7', 'A4'];

export function getLebaranOverlaySVG(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600">
    <defs>
      <pattern id="islamicGrid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 40 20 L 20 40 L 0 20 Z" fill="none" stroke="#256350" stroke-width="1"/>
      </pattern>
    </defs>
    <rect width="400" height="600" fill="url(#islamicGrid)" opacity="0.6"/>
    <line x1="55" y1="0" x2="55" y2="115" stroke="#d4af37" stroke-width="1.5"/>
    <line x1="130" y1="0" x2="130" y2="70" stroke="#d4af37" stroke-width="1.5"/>
    <line x1="200" y1="0" x2="200" y2="55" stroke="#d4af37" stroke-width="1.5"/>
    <line x1="275" y1="0" x2="275" y2="75" stroke="#d4af37" stroke-width="1.5"/>
    <line x1="345" y1="0" x2="345" y2="120" stroke="#d4af37" stroke-width="1.5"/>
    <g transform="translate(55, 135) rotate(45)">
      <rect x="-22" y="-22" width="44" height="44" fill="#84cc16" stroke="#bef264" stroke-width="1.5"/>
      <line x1="-22" y1="0" x2="22" y2="0" stroke="#4d7c0f" stroke-width="1"/>
      <line x1="0" y1="-22" x2="0" y2="22" stroke="#4d7c0f" stroke-width="1"/>
    </g>
    <g transform="translate(345, 145) rotate(45)">
      <rect x="-24" y="-24" width="48" height="48" fill="#84cc16" stroke="#bef264" stroke-width="1.5"/>
      <line x1="-24" y1="0" x2="24" y2="0" stroke="#4d7c0f" stroke-width="1"/>
      <line x1="0" y1="-24" x2="0" y2="24" stroke="#4d7c0f" stroke-width="1"/>
    </g>
    <rect x="122" y="68" width="16" height="24" rx="4" fill="#f59e0b"/>
    <rect x="186" y="48" width="28" height="42" rx="6" fill="#fbbf24" stroke="#fef3c7" stroke-width="2"/>
    <rect x="193" y="56" width="14" height="26" rx="2" fill="#fef3c7"/>
    <rect x="267" y="73" width="16" height="24" rx="4" fill="#f59e0b"/>
    <text x="235" y="135" fill="#ffffff" font-family="Georgia, serif" font-style="italic" font-weight="bold" font-size="24" text-anchor="middle">Lebaran Momen</text>
    <g transform="translate(115, 290) rotate(-3)">
      <rect x="-92" y="-115" width="184" height="225" rx="3" fill="#ffffff" filter="drop-shadow(0 6px 10px rgba(0,0,0,0.35))"/>
      <rect x="-80" y="-98" width="160" height="162" fill="#e5d4d6" opacity="0.25"/>
      <text x="-78" y="88" fill="#ef4444" font-size="14">♥</text>
      <circle cx="-55" cy="83" r="5" fill="none" stroke="#52525b" stroke-width="1.2"/>
      <polygon points="-42,79 -32,83 -42,87" fill="none" stroke="#52525b" stroke-width="1.2"/>
      <circle cx="-18" cy="83" r="1.2" fill="#71717a"/>
      <circle cx="-13" cy="83" r="1.2" fill="#71717a"/>
      <circle cx="-8" cy="83" r="1.2" fill="#71717a"/>
      <path d="M 70 78 L 78 78 L 78 90 L 74 86 L 70 90 Z" fill="none" stroke="#52525b" stroke-width="1.2"/>
      <circle cx="76" cy="-108" r="1.3" fill="#3f3f46"/>
      <circle cx="76" cy="-104" r="1.3" fill="#3f3f46"/>
      <circle cx="76" cy="-100" r="1.3" fill="#3f3f46"/>
    </g>
    <g transform="translate(290, 345)">
      <rect x="-88" y="-110" width="176" height="218" rx="3" fill="#ffffff" filter="drop-shadow(0 6px 10px rgba(0,0,0,0.35))"/>
      <rect x="-76" y="-94" width="152" height="156" fill="#d9e2d5" opacity="0.25"/>
      <text x="-74" y="84" fill="#ef4444" font-size="14">♥</text>
      <circle cx="-51" cy="79" r="5" fill="none" stroke="#52525b" stroke-width="1.2"/>
      <polygon points="-38,75 -28,79 -38,83" fill="none" stroke="#52525b" stroke-width="1.2"/>
      <circle cx="-14" cy="79" r="1.2" fill="#71717a"/>
      <circle cx="-9" cy="79" r="1.2" fill="#71717a"/>
      <circle cx="-4" cy="79" r="1.2" fill="#71717a"/>
      <path d="M 66 74 L 74 74 L 74 86 L 70 82 L 66 86 Z" fill="none" stroke="#52525b" stroke-width="1.2"/>
      <circle cx="72" cy="-103" r="1.3" fill="#3f3f46"/>
      <circle cx="72" cy="-99" r="1.3" fill="#3f3f46"/>
      <circle cx="72" cy="-95" r="1.3" fill="#3f3f46"/>
    </g>
    <text x="115" y="445" fill="#ffffff" font-family="Georgia, serif" font-style="italic" font-weight="bold" font-size="22" text-anchor="middle">Idul Fitri</text>
    <text x="115" y="465" fill="#fde047" font-family="sans-serif" font-weight="bold" font-size="12" text-anchor="middle">1447 H</text>
    <g transform="translate(95, 515) rotate(-14)">
      <line x1="-30" y1="15" x2="-40" y2="55" stroke="#92400e" stroke-width="5" stroke-linecap="round"/>
      <line x1="30" y1="15" x2="40" y2="55" stroke="#92400e" stroke-width="5" stroke-linecap="round"/>
      <line x1="-35" y1="40" x2="35" y2="40" stroke="#78350f" stroke-width="4"/>
      <rect x="-45" y="-22" width="90" height="46" rx="8" fill="#84cc16" stroke="#4d7c0f" stroke-width="2"/>
      <ellipse cx="-43" cy="1" rx="8" ry="22" fill="#fef3c7" stroke="#b45309" stroke-width="2"/>
      <ellipse cx="43" cy="1" rx="8" ry="22" fill="#fde68a" stroke="#b45309" stroke-width="2"/>
    </g>
    <text x="275" y="545" fill="#38bdf8" font-family="Inter, sans-serif" font-weight="800" font-size="22" text-anchor="middle">Cekreks.id</text>
  </svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

export function createDefaultLebaranElements(): CanvasElement[] {
  return [
    {
      id: 'photo-2',
      layerNumber: 2,
      badgeColor: '#84cc16',
      type: 'photo',
      name: 'Photo 2',
      slotIndex: 2,
      x: 214,
      y: 251,
      width: 152,
      height: 156,
      rotation: 0,
      visible: true,
      locked: false,
      strokeColor: '#000000',
      strokeWidth: 0,
      dropShadow: false,
      shadowColor: '#000000',
      shadowAngle: -45,
      shadowDist: 10,
      shadowBlur: 20,
    },
    {
      id: 'photo-1',
      layerNumber: 1,
      badgeColor: '#ef4444',
      type: 'photo',
      name: 'Photo 1',
      slotIndex: 1,
      x: 35,
      y: 192,
      width: 160,
      height: 162,
      rotation: -3,
      visible: true,
      locked: false,
      strokeColor: '#000000',
      strokeWidth: 0,
      dropShadow: false,
      shadowColor: '#000000',
      shadowAngle: -45,
      shadowDist: 10,
      shadowBlur: 20,
    },
    {
      id: 'photo-3',
      layerNumber: 3,
      badgeColor: '#14b8a6',
      type: 'photo',
      name: 'Photo 3',
      slotIndex: 3,
      x: 120,
      y: 220,
      width: 140,
      height: 140,
      rotation: 0,
      visible: false,
      locked: false,
      strokeColor: '#000000',
      strokeWidth: 0,
      dropShadow: false,
      shadowColor: '#000000',
      shadowAngle: -45,
      shadowDist: 10,
      shadowBlur: 20,
    },
    {
      id: 'overlay-8',
      layerNumber: 8,
      badgeColor: '#0ea5e9',
      type: 'image',
      name: '8',
      src: getLebaranOverlaySVG(),
      x: 0,
      y: 0,
      width: 400,
      height: 600,
      rotation: 0,
      visible: true,
      locked: false,
      strokeColor: '#000000',
      strokeWidth: 0,
      dropShadow: false,
      shadowColor: '#000000',
      shadowAngle: -45,
      shadowDist: 10,
      shadowBlur: 20,
    },
  ];
}

function cloneElements(items: CanvasElement[]): CanvasElement[] {
  return items.map((item) => ({ ...item }));
}

function areSnapshotsEqual(a: EditorSnapshot, b: EditorSnapshot): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

function validateAndNormalizeImportedTemplate(raw: unknown): SavedTemplatePayload | null {
  if (!raw || typeof raw !== 'object') return null;
  const record = raw as Record<string, unknown>;
  if (!Array.isArray(record.elements)) return null;

  const normalizedElements: CanvasElement[] = [];

  for (let i = 0; i < record.elements.length; i++) {
    const item = record.elements[i];
    if (!item || typeof item !== 'object') return null;
    const el = item as Record<string, unknown>;

    if (
      typeof el.id !== 'string' ||
      !VALID_ELEMENT_TYPES.includes(el.type as ElementType) ||
      typeof el.x !== 'number' ||
      !Number.isFinite(el.x) ||
      typeof el.y !== 'number' ||
      !Number.isFinite(el.y) ||
      typeof el.width !== 'number' ||
      !Number.isFinite(el.width) ||
      typeof el.height !== 'number' ||
      !Number.isFinite(el.height)
    ) {
      return null;
    }

    normalizedElements.push({
      id: el.id,
      layerNumber: typeof el.layerNumber === 'number' ? el.layerNumber : i + 1,
      badgeColor: typeof el.badgeColor === 'string' ? el.badgeColor : undefined,
      type: el.type as ElementType,
      name: typeof el.name === 'string' && el.name.trim() ? el.name : `Layer ${i + 1}`,
      x: Math.round(el.x),
      y: Math.round(el.y),
      width: Math.max(10, Math.round(el.width)),
      height: Math.max(10, Math.round(el.height)),
      rotation: typeof el.rotation === 'number' && Number.isFinite(el.rotation) ? el.rotation : 0,
      visible: typeof el.visible === 'boolean' ? el.visible : true,
      locked: typeof el.locked === 'boolean' ? el.locked : false,
      strokeColor: typeof el.strokeColor === 'string' ? el.strokeColor : '#000000',
      strokeWidth:
        typeof el.strokeWidth === 'number' && Number.isFinite(el.strokeWidth)
          ? Math.max(0, el.strokeWidth)
          : 0,
      dropShadow: typeof el.dropShadow === 'boolean' ? el.dropShadow : false,
      shadowColor: typeof el.shadowColor === 'string' ? el.shadowColor : '#000000',
      shadowAngle:
        typeof el.shadowAngle === 'number' && Number.isFinite(el.shadowAngle)
          ? el.shadowAngle
          : -45,
      shadowDist:
        typeof el.shadowDist === 'number' && Number.isFinite(el.shadowDist) ? el.shadowDist : 10,
      shadowBlur:
        typeof el.shadowBlur === 'number' && Number.isFinite(el.shadowBlur) ? el.shadowBlur : 20,
      slotIndex: typeof el.slotIndex === 'number' ? el.slotIndex : undefined,
      src: typeof el.src === 'string' ? el.src : undefined,
      text: typeof el.text === 'string' ? el.text : undefined,
      fontSize: typeof el.fontSize === 'number' ? el.fontSize : undefined,
      color: typeof el.color === 'string' ? el.color : undefined,
      shapeType:
        el.shapeType === 'rect' || el.shapeType === 'circle' || el.shapeType === 'ketupat'
          ? el.shapeType
          : undefined,
      fillColor: typeof el.fillColor === 'string' ? el.fillColor : undefined,
    });
  }

  const canvasWidth =
    typeof record.canvasWidth === 'number' &&
    Number.isFinite(record.canvasWidth) &&
    record.canvasWidth > 0
      ? Math.round(record.canvasWidth)
      : 1200;

  const canvasHeight =
    typeof record.canvasHeight === 'number' &&
    Number.isFinite(record.canvasHeight) &&
    record.canvasHeight > 0
      ? Math.round(record.canvasHeight)
      : 1800;

  const paperSize = VALID_PAPER_SIZES.includes(record.paperSize as PaperSizeOption)
    ? (record.paperSize as PaperSizeOption)
    : undefined;

  const dpi =
    typeof record.dpi === 'number' && [150, 300, 600].includes(record.dpi)
      ? record.dpi
      : undefined;

  return {
    name: typeof record.name === 'string' && record.name.trim() ? record.name.trim() : 'Imported Template',
    bgColor: typeof record.bgColor === 'string' && record.bgColor.trim() ? record.bgColor : DEFAULT_BG_COLOR,
    canvasWidth,
    canvasHeight,
    elements: normalizedElements,
    app: typeof record.app === 'string' ? record.app : undefined,
    version: typeof record.version === 'string' ? record.version : undefined,
    paperSize,
    dpi,
  };
}

export function useOverlayEditor() {
  const initialElements = createDefaultLebaranElements();
  const initialSnapshot: EditorSnapshot = {
    elements: cloneElements(initialElements),
    bgColor: DEFAULT_BG_COLOR,
    canvasWidth: 1200,
    canvasHeight: 1800,
  };

  const [canvasWidth, setCanvasWidth] = useState<number>(1200);
  const [canvasHeight, setCanvasHeight] = useState<number>(1800);
  const [displayScale, setDisplayScale] = useState<number>(INITIAL_DISPLAY_SCALE);
  const [unit, setUnit] = useState<DimensionUnit>('px');
  const [paperSize, setPaperSize] = useState<PaperSizeOption>('4x6');
  const [secondaryPrinter, setSecondaryPrinter] = useState<boolean>(false);
  const [dpi, setDpi] = useState<number>(300);
  const [orientation, setOrientation] = useState<OrientationOption>('vertical');
  const [bgColor, setBgColor] = useState<string>(DEFAULT_BG_COLOR);
  const [templateName, setTemplateName] = useState<string>(DEFAULT_TEMPLATE_NAME);

  const [elements, setElements] = useState<CanvasElement[]>(initialElements);
  const [selectedId, setSelectedId] = useState<string | null>('overlay-8');
  const [isTestPhotosActive, setIsTestPhotosActive] = useState<boolean>(false);
  const [presetIndex, setPresetIndex] = useState<number>(0);

  const [history, setHistory] = useState<EditorSnapshot[]>([initialSnapshot]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
  });

  const canvasRef = useRef<HTMLDivElement | null>(null);
  const elementRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Keep latest state in refs for keyboard shortcuts and async operations
  const stateRef = useRef({
    elements,
    selectedId,
    bgColor,
    canvasWidth,
    canvasHeight,
    displayScale,
    unit,
    dpi,
    paperSize,
    templateName,
    isTestPhotosActive,
    presetIndex,
    history,
    historyIndex,
  });

  stateRef.current = {
    elements,
    selectedId,
    bgColor,
    canvasWidth,
    canvasHeight,
    displayScale,
    unit,
    dpi,
    paperSize,
    templateName,
    isTestPhotosActive,
    presetIndex,
    history,
    historyIndex,
  };

  const showToast = useCallback((message: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((prev) => [...prev, { id, message }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, 2500);
  }, []);

  const openModal = useCallback((title: string, message: string, onConfirm: () => void) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      onConfirm,
    });
  }, []);

  const closeModal = useCallback(() => {
    setConfirmModal((prev) => ({
      ...prev,
      isOpen: false,
      onConfirm: null,
    }));
  }, []);

  const commitHistorySnapshot = useCallback(
    (
      nextElements: CanvasElement[],
      nextBgColor: string,
      nextWidth: number,
      nextHeight: number
    ) => {
      const snapshot: EditorSnapshot = {
        elements: cloneElements(nextElements),
        bgColor: nextBgColor,
        canvasWidth: nextWidth,
        canvasHeight: nextHeight,
      };
      const curHistory = stateRef.current.history;
      const curIndex = stateRef.current.historyIndex;
      const currentSnapshot = curHistory[curIndex];

      // Prevent duplicate consecutive history entries
      if (currentSnapshot && areSnapshotsEqual(currentSnapshot, snapshot)) {
        return;
      }

      const baseHistory = curHistory.slice(0, curIndex + 1);
      const updatedHistory = [...baseHistory, snapshot];
      setHistory(updatedHistory);
      setHistoryIndex(updatedHistory.length - 1);
    },
    []
  );

  const saveHistory = useCallback(() => {
    const cur = stateRef.current;
    commitHistorySnapshot(cur.elements, cur.bgColor, cur.canvasWidth, cur.canvasHeight);
  }, [commitHistorySnapshot]);

  const undo = useCallback(() => {
    const { history: hist, historyIndex: idx } = stateRef.current;
    if (idx > 0) {
      const nextIdx = idx - 1;
      const snap = hist[nextIdx];
      setHistoryIndex(nextIdx);
      setElements(cloneElements(snap.elements));
      setBgColor(snap.bgColor);
      setCanvasWidth(snap.canvasWidth);
      setCanvasHeight(snap.canvasHeight);
      setOrientation(snap.canvasWidth > snap.canvasHeight ? 'horizontal' : 'vertical');
      showToast('Undo dilakukan');
    }
  }, [showToast]);

  const redo = useCallback(() => {
    const { history: hist, historyIndex: idx } = stateRef.current;
    if (idx < hist.length - 1) {
      const nextIdx = idx + 1;
      const snap = hist[nextIdx];
      setHistoryIndex(nextIdx);
      setElements(cloneElements(snap.elements));
      setBgColor(snap.bgColor);
      setCanvasWidth(snap.canvasWidth);
      setCanvasHeight(snap.canvasHeight);
      setOrientation(snap.canvasWidth > snap.canvasHeight ? 'horizontal' : 'vertical');
      showToast('Redo dilakukan');
    }
  }, [showToast]);

  const selectElement = useCallback((id: string | null) => {
    setSelectedId(id);
  }, []);

  const deselectAll = useCallback((targetId?: string) => {
    if (targetId === 'workspace-area' || targetId === 'canvas-scaler') {
      setSelectedId(null);
    }
  }, []);

  // ================= ADD ELEMENTS =================
  const addPhotoSlot = useCallback(() => {
    const currentElements = stateRef.current.elements;
    const photoCount = currentElements.filter((e) => e.type === 'photo').length + 1;
    const colors = ['#ef4444', '#84cc16', '#14b8a6', '#f59e0b', '#8b5cf6'];
    const newEl: CanvasElement = {
      id: `photo-${Date.now()}`,
      layerNumber: photoCount,
      badgeColor: colors[(photoCount - 1) % colors.length],
      type: 'photo',
      name: `Photo ${photoCount}`,
      slotIndex: photoCount,
      x: 110 + photoCount * 15,
      y: 180 + photoCount * 15,
      width: 150,
      height: 150,
      rotation: 0,
      visible: true,
      locked: false,
      strokeColor: '#000000',
      strokeWidth: 0,
      dropShadow: false,
      shadowColor: '#000000',
      shadowAngle: -45,
      shadowDist: 10,
      shadowBlur: 20,
    };
    const next = [...currentElements, newEl];
    setElements(next);
    setSelectedId(newEl.id);
    commitHistorySnapshot(
      next,
      stateRef.current.bgColor,
      stateRef.current.canvasWidth,
      stateRef.current.canvasHeight
    );
    showToast(`Slot Photo ${photoCount} ditambahkan`);
  }, [commitHistorySnapshot, showToast]);

  const handleNewImageUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      if (!file.type.startsWith('image/')) {
        showToast('File harus berupa gambar');
        event.target.value = '';
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result !== 'string') {
          showToast('Gagal membaca file gambar');
          return;
        }
        const currentElements = stateRef.current.elements;
        const num = currentElements.length + 1;
        const newEl: CanvasElement = {
          id: `img-${Date.now()}`,
          layerNumber: num,
          type: 'image',
          name: file.name.slice(0, 14) || `Image ${num}`,
          src: result,
          x: 80,
          y: 140,
          width: 240,
          height: 240,
          rotation: 0,
          visible: true,
          locked: false,
          strokeColor: '#000000',
          strokeWidth: 0,
          dropShadow: false,
          shadowColor: '#000000',
          shadowAngle: -45,
          shadowDist: 10,
          shadowBlur: 20,
        };
        const next = [...currentElements, newEl];
        setElements(next);
        setSelectedId(newEl.id);
        commitHistorySnapshot(
          next,
          stateRef.current.bgColor,
          stateRef.current.canvasWidth,
          stateRef.current.canvasHeight
        );
        showToast('Gambar berhasil ditambahkan');
      };
      reader.onerror = () => {
        showToast('Gagal memuat file gambar');
      };
      reader.readAsDataURL(file);
      event.target.value = '';
    },
    [commitHistorySnapshot, showToast]
  );

  const replaceSelectedImage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      const targetId = stateRef.current.selectedId;
      if (!file || !targetId) return;
      if (!file.type.startsWith('image/')) {
        showToast('File harus berupa gambar');
        event.target.value = '';
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result !== 'string') {
          showToast('Gagal membaca file gambar');
          return;
        }
        const next = stateRef.current.elements.map((item) =>
          item.id === targetId && item.type === 'image' ? { ...item, src: result } : item
        );
        setElements(next);
        commitHistorySnapshot(
          next,
          stateRef.current.bgColor,
          stateRef.current.canvasWidth,
          stateRef.current.canvasHeight
        );
        showToast('Overlay/Gambar diperbarui');
      };
      reader.onerror = () => {
        showToast('Gagal mengganti gambar');
      };
      reader.readAsDataURL(file);
      event.target.value = '';
    },
    [commitHistorySnapshot, showToast]
  );

  const addTextElement = useCallback(
    (defaultText = 'Cekreks.id Event') => {
      const currentElements = stateRef.current.elements;
      const newEl: CanvasElement = {
        id: `text-${Date.now()}`,
        layerNumber: currentElements.length + 1,
        type: 'text',
        name: defaultText,
        text: defaultText,
        fontSize: 22,
        color: '#ffffff',
        x: 100,
        y: 280,
        width: 200,
        height: 45,
        rotation: 0,
        visible: true,
        locked: false,
        strokeColor: '#000000',
        strokeWidth: 0,
        dropShadow: true,
        shadowColor: '#000000',
        shadowAngle: 45,
        shadowDist: 4,
        shadowBlur: 6,
      };
      const next = [...currentElements, newEl];
      setElements(next);
      setSelectedId(newEl.id);
      commitHistorySnapshot(
        next,
        stateRef.current.bgColor,
        stateRef.current.canvasWidth,
        stateRef.current.canvasHeight
      );
      showToast('Teks ditambahkan');
    },
    [commitHistorySnapshot, showToast]
  );

  const addShape = useCallback(
    (shapeType: ShapeType) => {
      const currentElements = stateRef.current.elements;
      const newEl: CanvasElement = {
        id: `shape-${Date.now()}`,
        layerNumber: currentElements.length + 1,
        type: 'shape',
        shapeType,
        name: `Shape (${shapeType})`,
        fillColor: shapeType === 'ketupat' ? '#84cc16' : '#0ea5e9',
        x: 150,
        y: 250,
        width: 90,
        height: 90,
        rotation: 0,
        visible: true,
        locked: false,
        strokeColor: '#ffffff',
        strokeWidth: 0,
        dropShadow: false,
        shadowColor: '#000000',
        shadowAngle: -45,
        shadowDist: 10,
        shadowBlur: 20,
      };
      const next = [...currentElements, newEl];
      setElements(next);
      setSelectedId(newEl.id);
      commitHistorySnapshot(
        next,
        stateRef.current.bgColor,
        stateRef.current.canvasWidth,
        stateRef.current.canvasHeight
      );
    },
    [commitHistorySnapshot]
  );

  const addQRCode = useCallback(() => {
    const currentElements = stateRef.current.elements;
    const newEl: CanvasElement = {
      id: `qr-${Date.now()}`,
      layerNumber: currentElements.length + 1,
      type: 'qrcode',
      name: 'QR Code Softfile',
      x: 315,
      y: 515,
      width: 65,
      height: 65,
      rotation: 0,
      visible: true,
      locked: false,
      strokeColor: '#000000',
      strokeWidth: 0,
      dropShadow: false,
      shadowColor: '#000000',
      shadowAngle: -45,
      shadowDist: 10,
      shadowBlur: 20,
    };
    const next = [...currentElements, newEl];
    setElements(next);
    setSelectedId(newEl.id);
    commitHistorySnapshot(
      next,
      stateRef.current.bgColor,
      stateRef.current.canvasWidth,
      stateRef.current.canvasHeight
    );
    showToast('QR Code Download ditambahkan');
  }, [commitHistorySnapshot, showToast]);

  const addSessionData = useCallback(
    (tag: string) => {
      addTextElement(tag);
    },
    [addTextElement]
  );

  const setCanvasBgColor = useCallback(
    (hex: string) => {
      setBgColor(hex);
      commitHistorySnapshot(
        stateRef.current.elements,
        hex,
        stateRef.current.canvasWidth,
        stateRef.current.canvasHeight
      );
    },
    [commitHistorySnapshot]
  );

  // ================= ELEMENT MUTATIONS & STYLING =================
  const updateElementDirect = useCallback(
    (id: string, patch: Partial<CanvasElement>, recordHistory = false) => {
      setElements((prev) => {
        const next = prev.map((item) => (item.id === id ? { ...item, ...patch } : item));
        if (recordHistory) {
          commitHistorySnapshot(
            next,
            stateRef.current.bgColor,
            stateRef.current.canvasWidth,
            stateRef.current.canvasHeight
          );
        }
        return next;
      });
    },
    [commitHistorySnapshot]
  );

  const updateSelectedText = useCallback(
    (prop: 'text' | 'fontSize' | 'color', value: string) => {
      const id = stateRef.current.selectedId;
      if (!id) return;
      setElements((prev) =>
        prev.map((item) => {
          if (item.id !== id || item.type !== 'text') return item;
          if (prop === 'fontSize') {
            return { ...item, fontSize: Number(value) };
          }
          if (prop === 'color') {
            return { ...item, color: value };
          }
          return {
            ...item,
            text: value,
            name: value || 'Text',
          };
        })
      );
    },
    []
  );

  const updateStyle = useCallback(
    (
      prop:
        | 'strokeColor'
        | 'strokeWidth'
        | 'shadowColor'
        | 'shadowAngle'
        | 'shadowDist'
        | 'shadowBlur',
      value: string
    ) => {
      const id = stateRef.current.selectedId;
      if (!id) return;
      setElements((prev) =>
        prev.map((item) => {
          if (item.id !== id) return item;
          switch (prop) {
            case 'strokeColor':
              return { ...item, strokeColor: value };
            case 'strokeWidth':
              return { ...item, strokeWidth: Number(value) };
            case 'shadowColor':
              return { ...item, shadowColor: value };
            case 'shadowAngle':
              return { ...item, shadowAngle: Number(value) };
            case 'shadowDist':
              return { ...item, shadowDist: Number(value) };
            case 'shadowBlur':
              return { ...item, shadowBlur: Number(value) };
            default:
              return item;
          }
        })
      );
    },
    []
  );

  const toggleDropShadow = useCallback(() => {
    const id = stateRef.current.selectedId;
    if (!id) return;
    const next = stateRef.current.elements.map((item) =>
      item.id === id ? { ...item, dropShadow: !item.dropShadow } : item
    );
    setElements(next);
    commitHistorySnapshot(
      next,
      stateRef.current.bgColor,
      stateRef.current.canvasWidth,
      stateRef.current.canvasHeight
    );
  }, [commitHistorySnapshot]);

  const alignElement = useCallback(
    (type: AlignmentType) => {
      const id = stateRef.current.selectedId;
      if (!id) {
        showToast('Pilih elemen terlebih dahulu untuk mengatur Alignment');
        return;
      }
      const target = stateRef.current.elements.find((i) => i.id === id);
      if (!target) return;
      if (target.locked) {
        showToast('Elemen dikunci');
        return;
      }

      const canvasDom = canvasRef.current;
      const cW = canvasDom?.offsetWidth || 400;
      const cH = canvasDom?.offsetHeight || 600;

      let nextX = target.x;
      let nextY = target.y;

      switch (type) {
        case 'left':
          nextX = 0;
          break;
        case 'center-h':
          nextX = Math.round((cW - target.width) / 2);
          break;
        case 'right':
          nextX = cW - target.width;
          break;
        case 'top':
          nextY = 0;
          break;
        case 'middle-v':
          nextY = Math.round((cH - target.height) / 2);
          break;
        case 'bottom':
          nextY = cH - target.height;
          break;
        case 'distribute-v':
          nextY = Math.round((cH - target.height) / 2);
          break;
        case 'center-both':
          nextX = Math.round((cW - target.width) / 2);
          nextY = Math.round((cH - target.height) / 2);
          break;
      }

      const next = stateRef.current.elements.map((item) =>
        item.id === id ? { ...item, x: nextX, y: nextY } : item
      );
      setElements(next);
      commitHistorySnapshot(
        next,
        stateRef.current.bgColor,
        stateRef.current.canvasWidth,
        stateRef.current.canvasHeight
      );
    },
    [commitHistorySnapshot, showToast]
  );

  // ================= LAYER ORDERING & MANAGEMENT =================
  const toggleLayerVisibility = useCallback(
    (id: string) => {
      const next = stateRef.current.elements.map((item) =>
        item.id === id ? { ...item, visible: !item.visible } : item
      );
      setElements(next);
      commitHistorySnapshot(
        next,
        stateRef.current.bgColor,
        stateRef.current.canvasWidth,
        stateRef.current.canvasHeight
      );
    },
    [commitHistorySnapshot]
  );

  const renameLayer = useCallback(
    (id: string, newName: string) => {
      const trimmed = newName.trim();
      const target = stateRef.current.elements.find((i) => i.id === id);
      if (!trimmed || !target || trimmed === target.name) return;
      const next = stateRef.current.elements.map((item) =>
        item.id === id ? { ...item, name: trimmed } : item
      );
      setElements(next);
      commitHistorySnapshot(
        next,
        stateRef.current.bgColor,
        stateRef.current.canvasWidth,
        stateRef.current.canvasHeight
      );
      showToast(`Layer diubah menjadi "${trimmed}"`);
    },
    [commitHistorySnapshot, showToast]
  );

  const bringForward = useCallback(() => {
    const id = stateRef.current.selectedId;
    const list = [...stateRef.current.elements];
    const idx = list.findIndex((i) => i.id === id);
    if (idx === -1 || idx === list.length - 1) return;
    [list[idx], list[idx + 1]] = [list[idx + 1], list[idx]];
    setElements(list);
    commitHistorySnapshot(
      list,
      stateRef.current.bgColor,
      stateRef.current.canvasWidth,
      stateRef.current.canvasHeight
    );
    showToast('Layer dinaikkan (Bring Forward)');
  }, [commitHistorySnapshot, showToast]);

  const sendBackward = useCallback(() => {
    const id = stateRef.current.selectedId;
    const list = [...stateRef.current.elements];
    const idx = list.findIndex((i) => i.id === id);
    if (idx <= 0) return;
    [list[idx], list[idx - 1]] = [list[idx - 1], list[idx]];
    setElements(list);
    commitHistorySnapshot(
      list,
      stateRef.current.bgColor,
      stateRef.current.canvasWidth,
      stateRef.current.canvasHeight
    );
    showToast('Layer diturunkan (Send Backward)');
  }, [commitHistorySnapshot, showToast]);

  const toggleLockSelected = useCallback(() => {
    const id = stateRef.current.selectedId;
    if (!id) return;
    const target = stateRef.current.elements.find((i) => i.id === id);
    if (!target) return;
    const nextLocked = !target.locked;
    const next = stateRef.current.elements.map((item) =>
      item.id === id ? { ...item, locked: nextLocked } : item
    );
    setElements(next);
    commitHistorySnapshot(
      next,
      stateRef.current.bgColor,
      stateRef.current.canvasWidth,
      stateRef.current.canvasHeight
    );
    showToast(nextLocked ? 'Layer dikunci' : 'Kunci layer dibuka');
  }, [commitHistorySnapshot, showToast]);

  const deleteSelectedElement = useCallback(() => {
    const id = stateRef.current.selectedId;
    if (!id) return;
    const remaining = stateRef.current.elements.filter((i) => i.id !== id);
    const nextSelected = remaining.length > 0 ? remaining[remaining.length - 1].id : null;
    setElements(remaining);
    setSelectedId(nextSelected);
    commitHistorySnapshot(
      remaining,
      stateRef.current.bgColor,
      stateRef.current.canvasWidth,
      stateRef.current.canvasHeight
    );
    showToast('Elemen dihapus');
  }, [commitHistorySnapshot, showToast]);

  // ================= LAYOUT & PAPER SETTINGS =================
  const changePaperSize = useCallback(
    (size: PaperSizeOption) => {
      setPaperSize(size);
      const map: Record<PaperSizeOption, [number, number]> = {
        '4x6': [1200, 1800],
        '2x6': [600, 1800],
        '5x7': [1500, 2100],
        A4: [2480, 3508],
      };
      const dims = map[size];
      if (!dims) return;
      let [w, h] = dims;
      if (orientation === 'horizontal') {
        [w, h] = [h, w];
      }
      setCanvasWidth(w);
      setCanvasHeight(h);
      commitHistorySnapshot(stateRef.current.elements, stateRef.current.bgColor, w, h);
      showToast(`Ukuran kertas diubah ke ${size}`);
    },
    [commitHistorySnapshot, orientation, showToast]
  );

  const changeOrientation = useCallback(
    (orient: OrientationOption) => {
      setOrientation(orient);
      const isVert = orient === 'vertical';
      const curW = stateRef.current.canvasWidth;
      const curH = stateRef.current.canvasHeight;
      if ((isVert && curW > curH) || (!isVert && curH > curW)) {
        setCanvasWidth(curH);
        setCanvasHeight(curW);
        commitHistorySnapshot(stateRef.current.elements, stateRef.current.bgColor, curH, curW);
      }
    },
    [commitHistorySnapshot]
  );

  const changeUnit = useCallback((nextUnit: DimensionUnit) => {
    setUnit(nextUnit);
  }, []);

  const toggleSecondaryPrinter = useCallback(
    (checked: boolean) => {
      setSecondaryPrinter(checked);
      showToast(`Secondary Printer: ${checked ? 'Aktif' : 'Nonaktif'}`);
    },
    [showToast]
  );

  const changeDPI = useCallback(
    (nextDpi: number) => {
      setDpi(nextDpi);
      showToast(`Resolusi set ke ${nextDpi} DPI`);
    },
    [showToast]
  );

  const customDimensionChange = useCallback(
    (rawW: number, rawH: number) => {
      const w = Math.max(1, rawW || 1200);
      const h = Math.max(1, rawH || 1800);
      const curUnit = stateRef.current.unit;
      const curDpi = stateRef.current.dpi;

      let nextW: number;
      let nextH: number;

      if (curUnit === 'px') {
        nextW = Math.round(w);
        nextH = Math.round(h);
      } else if (curUnit === 'in') {
        nextW = Math.round(w * curDpi);
        nextH = Math.round(h * curDpi);
      } else {
        nextW = Math.round((w / 2.54) * curDpi);
        nextH = Math.round((h / 2.54) * curDpi);
      }

      setCanvasWidth(nextW);
      setCanvasHeight(nextH);
      setOrientation(nextW > nextH ? 'horizontal' : 'vertical');
      commitHistorySnapshot(stateRef.current.elements, stateRef.current.bgColor, nextW, nextH);
    },
    [commitHistorySnapshot]
  );

  const adjustZoom = useCallback((delta: number) => {
    setDisplayScale((prev) => Math.min(0.8, Math.max(0.15, prev + delta)));
  }, []);

  // ================= TEST ISI FOTO BOOTH =================
  const toggleTestBoothPhotos = useCallback(() => {
    const nextActive = !stateRef.current.isTestPhotosActive;
    setIsTestPhotosActive(nextActive);
    if (nextActive) {
      showToast('Simulasi foto booth dimasukkan ke frame!');
    } else {
      showToast('Kembali ke mode nomor slot');
    }
  }, [showToast]);

  // ================= TOOLBAR ACTIONS & EXPORT =================
  const newTemplate = useCallback(() => {
    openModal(
      'Buat Template Baru',
      'Kanvas saat ini akan dikosongkan untuk membuat layout baru. Lanjutkan?',
      () => {
        const emptyElements: CanvasElement[] = [];
        setElements(emptyElements);
        setSelectedId(null);
        setBgColor('#ffffff');
        setTemplateName('Untitled Template');
        commitHistorySnapshot(
          emptyElements,
          '#ffffff',
          stateRef.current.canvasWidth,
          stateRef.current.canvasHeight
        );
        showToast('Kanvas baru siap digunakan');
      }
    );
  }, [commitHistorySnapshot, openModal, showToast]);

  const saveAsNew = useCallback(() => {
    const name = `Cekreks_Template_${new Date().toISOString().slice(0, 10)}`;
    setTemplateName(name);
    const payload: SavedTemplatePayload = {
      name,
      bgColor: stateRef.current.bgColor,
      canvasWidth: stateRef.current.canvasWidth,
      canvasHeight: stateRef.current.canvasHeight,
      elements: stateRef.current.elements,
      paperSize: stateRef.current.paperSize,
      dpi: stateRef.current.dpi,
    };
    try {
      window.localStorage.setItem('cekreks_saved_template', JSON.stringify(payload));
      showToast(`Template "${name}" tersimpan di memori browser!`);
    } catch {
      showToast('Gagal menyimpan template ke memori browser');
    }
  }, [showToast]);

  const exportTemplate = useCallback(() => {
    try {
      const payload: SavedTemplatePayload = {
        app: 'Cekreks.id Photobooth',
        version: '1.0',
        name: stateRef.current.templateName,
        paperSize: stateRef.current.paperSize,
        dpi: stateRef.current.dpi,
        bgColor: stateRef.current.bgColor,
        canvasWidth: stateRef.current.canvasWidth,
        canvasHeight: stateRef.current.canvasHeight,
        elements: stateRef.current.elements,
      };
      const dataStr = JSON.stringify(payload, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'cekreks-print-template.json';
      a.click();
      URL.revokeObjectURL(url);
      showToast('File template JSON berhasil diunduh!');
    } catch {
      showToast('Gagal mengexport template JSON');
    }
  }, [showToast]);

  const exportOverlayPNG = useCallback(async () => {
    showToast('Merender template ke PNG...');
    try {
      const domCanvas = canvasRef.current;
      const displayW = domCanvas?.offsetWidth || 400;
      const displayH = domCanvas?.offsetHeight || 600;
      const targetW = stateRef.current.canvasWidth;
      const targetH = stateRef.current.canvasHeight;
      const scaleX = targetW / displayW;
      const scaleY = targetH / displayH;

      const offscreen = document.createElement('canvas');
      offscreen.width = targetW;
      offscreen.height = targetH;
      const ctx = offscreen.getContext('2d');
      if (!ctx) {
        showToast('Gagal mengexport PNG, silakan coba lagi.');
        return;
      }

      ctx.fillStyle = stateRef.current.bgColor;
      ctx.fillRect(0, 0, offscreen.width, offscreen.height);

      const loadImage = (src: string) =>
        new Promise<HTMLImageElement | null>((resolve) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => resolve(img);
          img.onerror = () => resolve(null);
          img.src = src;
        });

      for (const el of stateRef.current.elements) {
        if (!el.visible) continue;

        const x = el.x * scaleX;
        const y = el.y * scaleY;
        const w = el.width * scaleX;
        const h = el.height * scaleY;

        ctx.save();
        ctx.translate(x + w / 2, y + h / 2);
        ctx.rotate(((el.rotation || 0) * Math.PI) / 180);

        if (el.dropShadow) {
          const rad = (el.shadowAngle * Math.PI) / 180;
          ctx.shadowColor = el.shadowColor || '#000000';
          ctx.shadowOffsetX = Math.cos(rad) * el.shadowDist * scaleX;
          ctx.shadowOffsetY = Math.sin(rad) * el.shadowDist * scaleY;
          ctx.shadowBlur = el.shadowBlur * scaleX;
        }

        if (el.type === 'photo') {
          const slotIdx = el.slotIndex ?? 1;
          if (stateRef.current.isTestPhotosActive) {
            const photoUrl = SAMPLE_BOOTH_PHOTOS[(slotIdx - 1) % SAMPLE_BOOTH_PHOTOS.length];
            const img = await loadImage(photoUrl);
            if (img) {
              ctx.drawImage(img, -w / 2, -h / 2, w, h);
            }
          } else {
            ctx.fillStyle =
              slotIdx === 1 ? 'rgba(254, 205, 211, 0.7)' : 'rgba(231, 229, 228, 0.7)';
            ctx.fillRect(-w / 2, -h / 2, w, h);
            ctx.fillStyle = '#ffffff';
            ctx.font = `bold ${Math.round(32 * scaleX)}px Inter, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(String(slotIdx), 0, 0);
          }
        } else if (el.type === 'image' && el.src) {
          const img = await loadImage(el.src);
          if (img) {
            ctx.drawImage(img, -w / 2, -h / 2, w, h);
          }
        } else if (el.type === 'text') {
          ctx.fillStyle = el.color || '#ffffff';
          ctx.font = `bold ${Math.round((el.fontSize || 22) * scaleX)}px Inter, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(el.text || '', 0, 0);
        } else if (el.type === 'shape') {
          ctx.fillStyle = el.fillColor || '#84cc16';
          if (el.shapeType === 'circle') {
            ctx.beginPath();
            ctx.ellipse(0, 0, w / 2, h / 2, 0, 0, Math.PI * 2);
            ctx.fill();
          } else if (el.shapeType === 'ketupat') {
            ctx.rotate(Math.PI / 4);
            ctx.fillRect(-w * 0.35, -h * 0.35, w * 0.7, h * 0.7);
          } else {
            ctx.fillRect(-w / 2, -h / 2, w, h);
          }
        } else if (el.type === 'qrcode') {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(-w / 2, -h / 2, w, h);
          ctx.fillStyle = '#18181b';
          ctx.font = `bold ${Math.round(12 * scaleX)}px Inter, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('QR CODE', 0, 0);
        }

        if (el.strokeWidth > 0) {
          ctx.shadowColor = 'transparent';
          ctx.strokeStyle = el.strokeColor || '#000000';
          ctx.lineWidth = el.strokeWidth * scaleX;
          ctx.strokeRect(-w / 2, -h / 2, w, h);
        }

        ctx.restore();
      }

      const dataUrl = offscreen.toDataURL('image/png');
      const baseName =
        (stateRef.current.templateName || 'cekreks-overlay')
          .trim()
          .toLowerCase()
          .replace(/\s+/g, '-') + '.png';

      const link = document.createElement('a');
      link.download = baseName;
      link.href = dataUrl;
      link.click();

      showToast(`Berhasil mengunduh ${baseName} (${targetW}×${targetH}px)!`);
    } catch {
      showToast('Gagal mengexport PNG, silakan coba lagi.');
    }
  }, [showToast]);

  const importJSON = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const raw = e.target?.result;
          if (typeof raw !== 'string') {
            showToast('Format file JSON tidak valid');
            return;
          }
          const parsed: unknown = JSON.parse(raw);
          const validated = validateAndNormalizeImportedTemplate(parsed);
          if (!validated) {
            showToast('Struktur JSON template tidak valid atau korup');
            return;
          }

          setElements(validated.elements);
          setBgColor(validated.bgColor);
          setCanvasWidth(validated.canvasWidth);
          setCanvasHeight(validated.canvasHeight);
          setTemplateName(validated.name);
          setOrientation(
            validated.canvasWidth > validated.canvasHeight ? 'horizontal' : 'vertical'
          );
          if (validated.paperSize) setPaperSize(validated.paperSize);
          if (validated.dpi) setDpi(validated.dpi);
          setSelectedId(validated.elements[0]?.id || null);

          commitHistorySnapshot(
            validated.elements,
            validated.bgColor,
            validated.canvasWidth,
            validated.canvasHeight
          );
          showToast('Template berhasil di-import!');
        } catch {
          showToast('Format file JSON tidak valid');
        }
      };
      reader.onerror = () => {
        showToast('Gagal membaca file JSON');
      };
      reader.readAsText(file);
      event.target.value = '';
    },
    [commitHistorySnapshot, showToast]
  );

  const printTestCopy = useCallback(() => {
    setSelectedId(null);
    showToast('Membuka dialog print printer...');
    window.setTimeout(() => {
      window.print();
    }, 300);
  }, [showToast]);

  const deleteTemplate = useCallback(() => {
    openModal(
      'Hapus Template',
      'Semua layer dan pengaturan pada template ini akan dihapus dan dikembalikan ke default.',
      () => {
        const defaults = createDefaultLebaranElements();
        setTemplateName(DEFAULT_TEMPLATE_NAME);
        setBgColor(DEFAULT_BG_COLOR);
        setElements(defaults);
        setSelectedId('overlay-8');
        commitHistorySnapshot(
          defaults,
          DEFAULT_BG_COLOR,
          stateRef.current.canvasWidth,
          stateRef.current.canvasHeight
        );
        showToast('Template di-reset ke bawaan Lebaran Momen');
      }
    );
  }, [commitHistorySnapshot, openModal, showToast]);

  const switchPreset = useCallback(
    (dir: number) => {
      const nextPreset = (stateRef.current.presetIndex + dir + 2) % 2;
      setPresetIndex(nextPreset);
      if (nextPreset === 0) {
        const defaults = createDefaultLebaranElements();
        setTemplateName(DEFAULT_TEMPLATE_NAME);
        setBgColor(DEFAULT_BG_COLOR);
        setElements(defaults);
        setSelectedId('overlay-8');
        commitHistorySnapshot(
          defaults,
          DEFAULT_BG_COLOR,
          stateRef.current.canvasWidth,
          stateRef.current.canvasHeight
        );
        showToast('Preset 1: Lebaran Momen 1447H');
      } else {
        const weddingBg = '#f8fafc';
        const weddingElements: CanvasElement[] = [
          {
            id: 'w-p1',
            layerNumber: 1,
            badgeColor: '#ef4444',
            type: 'photo',
            name: 'Photo 1',
            slotIndex: 1,
            x: 40,
            y: 40,
            width: 320,
            height: 220,
            rotation: 0,
            visible: true,
            locked: false,
            strokeColor: '#cbd5e1',
            strokeWidth: 2,
            dropShadow: false,
            shadowColor: '#000000',
            shadowAngle: -45,
            shadowDist: 10,
            shadowBlur: 20,
          },
          {
            id: 'w-p2',
            layerNumber: 2,
            badgeColor: '#84cc16',
            type: 'photo',
            name: 'Photo 2',
            slotIndex: 2,
            x: 40,
            y: 280,
            width: 320,
            height: 220,
            rotation: 0,
            visible: true,
            locked: false,
            strokeColor: '#cbd5e1',
            strokeWidth: 2,
            dropShadow: false,
            shadowColor: '#000000',
            shadowAngle: -45,
            shadowDist: 10,
            shadowBlur: 20,
          },
          {
            id: 'w-txt',
            layerNumber: 3,
            type: 'text',
            name: 'Cekreks.id Wedding',
            text: 'THE WEDDING • CEKREKS.ID',
            fontSize: 16,
            color: '#1e293b',
            x: 50,
            y: 525,
            width: 300,
            height: 40,
            rotation: 0,
            visible: true,
            locked: false,
            strokeColor: '#000000',
            strokeWidth: 0,
            dropShadow: false,
            shadowColor: '#000000',
            shadowAngle: -45,
            shadowDist: 10,
            shadowBlur: 20,
          },
        ];
        setTemplateName('Minimalist Wedding Strip');
        setBgColor(weddingBg);
        setElements(weddingElements);
        setSelectedId('w-txt');
        commitHistorySnapshot(
          weddingElements,
          weddingBg,
          stateRef.current.canvasWidth,
          stateRef.current.canvasHeight
        );
        showToast('Preset 2: Minimalist Wedding');
      }
    },
    [commitHistorySnapshot, showToast]
  );

  // ================= GLOBAL KEYBOARD SHORTCUTS =================
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        undo();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        deleteSelectedElement();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, deleteSelectedElement]);

  const selectedElement = elements.find((item) => item.id === selectedId) || null;
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return {
    // State
    canvasWidth,
    canvasHeight,
    displayScale,
    unit,
    paperSize,
    secondaryPrinter,
    dpi,
    orientation,
    bgColor,
    templateName,
    elements,
    selectedId,
    selectedElement,
    isTestPhotosActive,
    canUndo,
    canRedo,
    toasts,
    confirmModal,
    // Refs
    canvasRef,
    elementRefs,
    // Selection & History
    selectElement,
    deselectAll,
    saveHistory,
    undo,
    redo,
    // Add & Canvas BG
    addPhotoSlot,
    handleNewImageUpload,
    replaceSelectedImage,
    addTextElement,
    addShape,
    addQRCode,
    addSessionData,
    setCanvasBgColor,
    // Element Updates & Alignment
    updateElementDirect,
    updateSelectedText,
    updateStyle,
    toggleDropShadow,
    alignElement,
    // Layers
    toggleLayerVisibility,
    renameLayer,
    bringForward,
    sendBackward,
    toggleLockSelected,
    deleteSelectedElement,
    // Layout & Zoom
    changePaperSize,
    changeOrientation,
    changeUnit,
    toggleSecondaryPrinter,
    changeDPI,
    customDimensionChange,
    adjustZoom,
    // Booth Preview & Toolbar Actions
    toggleTestBoothPhotos,
    newTemplate,
    saveAsNew,
    exportTemplate,
    exportOverlayPNG,
    importJSON,
    printTestCopy,
    deleteTemplate,
    switchPreset,
    // Modal & Toast
    openModal,
    closeModal,
    showToast,
  };
}