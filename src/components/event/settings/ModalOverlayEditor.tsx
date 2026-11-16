"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  LayoutTemplate,
  Save,
  Download,
  Upload,
  Undo2,
  Redo2,
  Printer,
  Trash2,
  Camera,
  Image as ImageIcon,
  Type,
  Shapes,
  ChevronRight,
  ChevronLeft,
  PaintBucket,
  QrCode,
  UserSquare2,
  Layers,
  Lock,
  Eye,
  EyeOff,
  X,
  ChevronUp,
} from "lucide-react";

interface Element {
  id: string;
  layerNumber: number;
  type: "photo" | "image" | "text" | "shape" | "qrcode";
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  visible: boolean;
  locked: boolean;
  strokeColor: string;
  strokeWidth: number;
  dropShadow: boolean;
  shadowColor: string;
  shadowAngle: number;
  shadowDist: number;
  shadowBlur: number;
  // Specific props
  src?: string; // for image
  slotIndex?: number; // for photo
  badgeColor?: string; // for photo
  text?: string; // for text
  fontSize?: number; // for text
  color?: string; // for text
  shapeType?: "rect" | "circle" | "ketupat"; // for shape
  fillColor?: string; // for shape
}

interface ModalOverlayEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (dataUrl: string, name: string, dimensions: string) => void;
  initialWidth?: number;
  initialHeight?: number;
}

export default function ModalOverlayEditor({
  isOpen,
  onClose,
  onApply,
  initialWidth = 1200,
  initialHeight = 1800,
}: ModalOverlayEditorProps) {
  const [elements, setElements] = useState<Element[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [canvasWidth, setCanvasWidth] = useState(initialWidth);
  const [canvasHeight, setCanvasHeight] = useState(initialHeight);
  const [bgColor, setBgColor] = useState("#1b4d3e");
  const [displayScale, setDisplayScale] = useState(0.3333);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [unit, setUnit] = useState("px");
  const [dpi, setDpi] = useState(300);
  const [isTestPhotosActive, setIsTestPhotosActive] = useState(false);
  const [activeSubmenus, setActiveSubmenus] = useState<Record<string, boolean>>({});
  const [activeAccordions, setActiveAccordions] = useState<Record<string, boolean>>({
    shadow: true,
    alignment: true,
    layers: true,
  });

  const canvasRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);

  const sampleBoothPhotos = [
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&w=600&q=80",
  ];

  // ================= INITIALIZATION =================
  useEffect(() => {
    if (isOpen) {
      initDefaultLebaranTemplate();
    }
  }, [isOpen]);

  const initDefaultLebaranTemplate = () => {
    const defaultElements: Element[] = [
      {
        id: "photo-2",
        layerNumber: 2,
        badgeColor: "#84cc16",
        type: "photo",
        name: "Photo 2",
        slotIndex: 2,
        x: 214,
        y: 251,
        width: 152,
        height: 156,
        rotation: 0,
        visible: true,
        locked: false,
        strokeColor: "#000000",
        strokeWidth: 0,
        dropShadow: false,
        shadowColor: "#000000",
        shadowAngle: -45,
        shadowDist: 10,
        shadowBlur: 20,
      },
      {
        id: "photo-1",
        layerNumber: 1,
        badgeColor: "#ef4444",
        type: "photo",
        name: "Photo 1",
        slotIndex: 1,
        x: 35,
        y: 192,
        width: 160,
        height: 162,
        rotation: -3,
        visible: true,
        locked: false,
        strokeColor: "#000000",
        strokeWidth: 0,
        dropShadow: false,
        shadowColor: "#000000",
        shadowAngle: -45,
        shadowDist: 10,
        shadowBlur: 20,
      },
      {
        id: "photo-3",
        layerNumber: 3,
        badgeColor: "#14b8a6",
        type: "photo",
        name: "Photo 3",
        slotIndex: 3,
        x: 120,
        y: 220,
        width: 140,
        height: 140,
        rotation: 0,
        visible: false,
        locked: false,
        strokeColor: "#000000",
        strokeWidth: 0,
        dropShadow: false,
        shadowColor: "#000000",
        shadowAngle: -45,
        shadowDist: 10,
        shadowBlur: 20,
      },
      {
        id: "overlay-8",
        layerNumber: 8,
        type: "image",
        name: "8",
        src: getLebaranOverlaySVG(),
        x: 0,
        y: 0,
        width: 400,
        height: 600,
        rotation: 0,
        visible: true,
        locked: false,
        strokeColor: "#000000",
        strokeWidth: 0,
        dropShadow: false,
        shadowColor: "#000000",
        shadowAngle: -45,
        shadowDist: 10,
        shadowBlur: 20,
      },
    ];

    setElements(defaultElements);
    setSelectedId("overlay-8");
    setBgColor("#1b4d3e");
    saveHistory(defaultElements, "#1b4d3e", canvasWidth, canvasHeight);
  };

  function getLebaranOverlaySVG() {
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
            <rect x="-92" y="-115" width="184" height="225" rx="3" fill="#ffffff" />
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
            <rect x="-88" y="-110" width="176" height="218" rx="3" fill="#ffffff" />
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
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }

  // ================= HISTORY =================
  const saveHistory = (
    currentElements: Element[],
    currentBgColor: string,
    width: number,
    height: number
  ) => {
    const snapshot = JSON.stringify({
      elements: currentElements,
      bgColor: currentBgColor,
      canvasWidth: width,
      canvasHeight: height,
    });
    setHistory((prev) => [...prev.slice(0, historyIndex + 1), snapshot]);
    setHistoryIndex((prev) => prev + 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const data = JSON.parse(history[newIndex]);
      setElements(data.elements);
      setBgColor(data.bgColor);
      setCanvasWidth(data.canvasWidth);
      setCanvasHeight(data.canvasHeight);
      setHistoryIndex(newIndex);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const data = JSON.parse(history[newIndex]);
      setElements(data.elements);
      setBgColor(data.bgColor);
      setCanvasWidth(data.canvasWidth);
      setCanvasHeight(data.canvasHeight);
      setHistoryIndex(newIndex);
    }
  };

  // ================= ELEMENT ACTIONS =================
  const addPhotoSlot = () => {
    const photoCount = elements.filter((e) => e.type === "photo").length + 1;
    const colors = ["#ef4444", "#84cc16", "#14b8a6", "#f59e0b", "#8b5cf6"];
    const newEl: Element = {
      id: "photo-" + Date.now(),
      layerNumber: photoCount,
      badgeColor: colors[(photoCount - 1) % colors.length],
      type: "photo",
      name: `Photo ${photoCount}`,
      slotIndex: photoCount,
      x: 110 + photoCount * 15,
      y: 180 + photoCount * 15,
      width: 150,
      height: 150,
      rotation: 0,
      visible: true,
      locked: false,
      strokeColor: "#000000",
      strokeWidth: 0,
      dropShadow: false,
      shadowColor: "#000000",
      shadowAngle: -45,
      shadowDist: 10,
      shadowBlur: 20,
    };
    const newElements = [...elements, newEl];
    setElements(newElements);
    setSelectedId(newEl.id);
    saveHistory(newElements, bgColor, canvasWidth, canvasHeight);
  };

  const addTextElement = (defaultText = "Cekreks.id Event") => {
    const newEl: Element = {
      id: "text-" + Date.now(),
      layerNumber: elements.length + 1,
      type: "text",
      name: defaultText,
      text: defaultText,
      fontSize: 22,
      color: "#ffffff",
      x: 100,
      y: 280,
      width: 200,
      height: 45,
      rotation: 0,
      visible: true,
      locked: false,
      strokeColor: "#000000",
      strokeWidth: 0,
      dropShadow: true,
      shadowColor: "#000000",
      shadowAngle: 45,
      shadowDist: 4,
      shadowBlur: 6,
    };
    const newElements = [...elements, newEl];
    setElements(newElements);
    setSelectedId(newEl.id);
    saveHistory(newElements, bgColor, canvasWidth, canvasHeight);
  };

  const addShape = (shapeType: "rect" | "circle" | "ketupat") => {
    const newEl: Element = {
      id: "shape-" + Date.now(),
      layerNumber: elements.length + 1,
      type: "shape",
      shapeType: shapeType,
      name: `Shape (${shapeType})`,
      fillColor: shapeType === "ketupat" ? "#84cc16" : "#0ea5e9",
      x: 150,
      y: 250,
      width: 90,
      height: 90,
      rotation: 0,
      visible: true,
      locked: false,
      strokeColor: "#ffffff",
      strokeWidth: 0,
      dropShadow: false,
      shadowColor: "#000000",
      shadowAngle: -45,
      shadowDist: 10,
      shadowBlur: 20,
    };
    const newElements = [...elements, newEl];
    setElements(newElements);
    setSelectedId(newEl.id);
    saveHistory(newElements, bgColor, canvasWidth, canvasHeight);
    toggleSubmenu("shape");
  };

  const addQRCode = () => {
    const newEl: Element = {
      id: "qr-" + Date.now(),
      layerNumber: elements.length + 1,
      type: "qrcode",
      name: "QR Code Softfile",
      x: 315,
      y: 515,
      width: 65,
      height: 65,
      rotation: 0,
      visible: true,
      locked: false,
      strokeColor: "#000000",
      strokeWidth: 0,
      dropShadow: false,
      shadowColor: "#000000",
      shadowAngle: -45,
      shadowDist: 10,
      shadowBlur: 20,
    };
    const newElements = [...elements, newEl];
    setElements(newElements);
    setSelectedId(newEl.id);
    saveHistory(newElements, bgColor, canvasWidth, canvasHeight);
  };

  const deleteSelectedElement = () => {
    if (!selectedId) return;
    const newElements = elements.filter((el) => el.id !== selectedId);
    setElements(newElements);
    setSelectedId(newElements.length > 0 ? newElements[newElements.length - 1].id : null);
    saveHistory(newElements, bgColor, canvasWidth, canvasHeight);
  };

  const toggleLockSelected = () => {
    if (!selectedId) return;
    const newElements = elements.map((el) =>
      el.id === selectedId ? { ...el, locked: !el.locked } : el
    );
    setElements(newElements);
    saveHistory(newElements, bgColor, canvasWidth, canvasHeight);
  };

  const toggleVisibility = (id: string) => {
    const newElements = elements.map((el) => (el.id === id ? { ...el, visible: !el.visible } : el));
    setElements(newElements);
    saveHistory(newElements, bgColor, canvasWidth, canvasHeight);
  };

  const updateElement = (id: string, updates: Partial<Element>) => {
    const newElements = elements.map((el) => (el.id === id ? { ...el, ...updates } : el));
    setElements(newElements);
  };

  const commitUpdate = () => {
    saveHistory(elements, bgColor, canvasWidth, canvasHeight);
  };

  // ================= DRAG & RESIZE =================
  const [dragInfo, setDragInfo] = useState<{
    id: string;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    origW: number;
    origH: number;
    handle: string | null;
  } | null>(null);

  const startDragOrResize = (e: React.MouseEvent | React.TouchEvent, el: Element, handle: string | null = null) => {
    e.stopPropagation();
    if (el.locked) return;
    setSelectedId(el.id);

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    setDragInfo({
      id: el.id,
      startX: clientX,
      startY: clientY,
      origX: el.x,
      origY: el.y,
      origW: el.width,
      origH: el.height,
      handle,
    });
  };

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!dragInfo) return;

      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      const dx = (clientX - dragInfo.startX) / displayScale;
      const dy = (clientY - dragInfo.startY) / displayScale;

      const el = elements.find((item) => item.id === dragInfo.id);
      if (!el) return;

      const updates: Partial<Element> = {};

      if (dragInfo.handle) {
        if (dragInfo.handle.includes("e")) updates.width = Math.max(20, Math.round(dragInfo.origW + dx));
        if (dragInfo.handle.includes("s")) updates.height = Math.max(20, Math.round(dragInfo.origH + dy));
        if (dragInfo.handle.includes("w")) {
          const newW = Math.max(20, Math.round(dragInfo.origW - dx));
          updates.x = dragInfo.origX + (dragInfo.origW - newW);
          updates.width = newW;
        }
        if (dragInfo.handle.includes("n")) {
          const newH = Math.max(20, Math.round(dragInfo.origH - dy));
          updates.y = dragInfo.origY + (dragInfo.origH - newH);
          updates.height = newH;
        }
      } else {
        updates.x = Math.round(dragInfo.origX + dx);
        updates.y = Math.round(dragInfo.origY + dy);
      }

      updateElement(dragInfo.id, updates);
    };

    const handleUp = () => {
      if (dragInfo) {
        commitUpdate();
        setDragInfo(null);
      }
    };

    if (dragInfo) {
      window.addEventListener("mousemove", handleMove);
      window.addEventListener("mouseup", handleUp);
      window.addEventListener("touchmove", handleMove);
      window.addEventListener("touchend", handleUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleUp);
    };
  }, [dragInfo, elements, displayScale]);

  // ================= EXPORT PNG =================
  const exportOverlayPNG = async () => {
    const canvas = document.createElement("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const scaleX = canvasWidth / (canvasRef.current?.offsetWidth || 400);
    const scaleY = canvasHeight / (canvasRef.current?.offsetHeight || 600);

    const loadImage = (src: string) =>
      new Promise<HTMLImageElement | null>((resolve) => {
        const img = new window.Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = src;
      });

    for (const el of elements) {
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
        ctx.shadowColor = el.shadowColor;
        ctx.shadowOffsetX = Math.cos(rad) * el.shadowDist * scaleX;
        ctx.shadowOffsetY = Math.sin(rad) * el.shadowDist * scaleY;
        ctx.shadowBlur = el.shadowBlur * scaleX;
      }

      if (el.type === "photo") {
        if (isTestPhotosActive) {
          const photoUrl = sampleBoothPhotos[(el.slotIndex! - 1) % sampleBoothPhotos.length];
          const img = await loadImage(photoUrl);
          if (img) ctx.drawImage(img, -w / 2, -h / 2, w, h);
        } else {
          ctx.fillStyle = "rgba(200, 200, 200, 0.5)";
          ctx.fillRect(-w / 2, -h / 2, w, h);
          ctx.fillStyle = "#ffffff";
          ctx.font = `bold ${Math.round(40 * scaleX)}px sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(String(el.slotIndex), 0, 0);
        }
      } else if (el.type === "image" && el.src) {
        const img = await loadImage(el.src);
        if (img) ctx.drawImage(img, -w / 2, -h / 2, w, h);
      } else if (el.type === "text") {
        ctx.fillStyle = el.color || "#ffffff";
        ctx.font = `bold ${Math.round((el.fontSize || 22) * scaleX)}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(el.text || "", 0, 0);
      } else if (el.type === "shape") {
        ctx.fillStyle = el.fillColor || "#84cc16";
        if (el.shapeType === "circle") {
          ctx.beginPath();
          ctx.ellipse(0, 0, w / 2, h / 2, 0, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-w / 2, -h / 2, w, h);
        }
      }

      if (el.strokeWidth > 0) {
        ctx.strokeStyle = el.strokeColor;
        ctx.lineWidth = el.strokeWidth * scaleX;
        ctx.strokeRect(-w / 2, -h / 2, w, h);
      }

      ctx.restore();
    }

    const dataUrl = canvas.toDataURL("image/png");
    onApply(dataUrl, "custom_overlay.png", `${canvasWidth}x${canvasHeight} px`);
    onClose();
  };

  // ================= UI HELPERS =================
  const toggleSubmenu = (menu: string) => {
    setActiveSubmenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  const toggleAccordion = (acc: string) => {
    setActiveAccordions((prev) => ({ ...prev, [acc]: !prev[acc] }));
  };

  const selectedElement = elements.find((el) => el.id === selectedId);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-zinc-950 flex flex-col text-xs font-sans select-none overflow-hidden">
      {/* TOP TOOLBAR */}
      <header className="h-14 bg-[#222225] border-b border-[#323236] px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => initDefaultLebaranTemplate()}
            className="flex flex-col items-center p-1.5 rounded hover:bg-[#2d2d32] text-zinc-300"
          >
            <LayoutTemplate size={16} className="mb-0.5" />
            <span className="text-[10px]">New Template</span>
          </button>
          <button className="flex flex-col items-center p-1.5 rounded hover:bg-[#2d2d32] text-zinc-300">
            <Save size={16} className="mb-0.5" />
            <span className="text-[10px]">Save</span>
          </button>
          <div className="h-6 w-[1px] bg-[#323236] mx-1"></div>
          <button
            onClick={undo}
            disabled={historyIndex <= 0}
            className="flex flex-col items-center p-1.5 rounded hover:bg-[#2d2d32] text-zinc-300 disabled:opacity-30"
          >
            <Undo2 size={16} className="mb-0.5" />
            <span className="text-[10px]">Undo</span>
          </button>
          <button
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            className="flex flex-col items-center p-1.5 rounded hover:bg-[#2d2d32] text-zinc-300 disabled:opacity-30"
          >
            <Redo2 size={16} className="mb-0.5" />
            <span className="text-[10px]">Redo</span>
          </button>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={exportOverlayPNG}
            className="bg-[#d926ef] hover:bg-[#c026d3] text-white font-bold text-[10px] px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Download size={14} />
            <span>APPLY & SAVE OVERLAY</span>
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full text-zinc-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* LEFT SIDEBAR */}
        <aside className="w-64 bg-[#222225] border-r border-[#323236] flex flex-col overflow-y-auto">
          <div className="p-4 border-b border-[#323236]">
            <h2 className="font-bold text-zinc-100 mb-3 uppercase tracking-wider">Add</h2>
            <div className="space-y-1">
              <button
                onClick={addPhotoSlot}
                className="w-full flex items-center space-x-3 p-2 rounded hover:bg-[#2d2d32] text-zinc-300 group"
              >
                <Camera size={16} className="group-hover:text-sky-400" />
                <span>Photo From Booth</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-2 rounded hover:bg-[#2d2d32] text-zinc-300 group">
                <ImageIcon size={16} className="group-hover:text-sky-400" />
                <span>Image / Overlay</span>
              </button>
              <button
                onClick={() => addTextElement()}
                className="w-full flex items-center space-x-3 p-2 rounded hover:bg-[#2d2d32] text-zinc-300 group"
              >
                <Type size={16} className="group-hover:text-sky-400" />
                <span>Text</span>
              </button>
              <div className="relative">
                <button
                  onClick={() => toggleSubmenu("shape")}
                  className="w-full flex items-center justify-between p-2 rounded hover:bg-[#2d2d32] text-zinc-300 group"
                >
                  <div className="flex items-center space-x-3">
                    <Shapes size={16} className="group-hover:text-sky-400" />
                    <span>Shape</span>
                  </div>
                  <ChevronRight size={14} />
                </button>
                {activeSubmenus["shape"] && (
                  <div className="ml-8 mt-1 space-y-1 bg-black/20 p-1 rounded">
                    <button
                      onClick={() => addShape("rect")}
                      className="w-full text-left p-1.5 hover:bg-white/5 rounded"
                    >
                      Rectangle
                    </button>
                    <button
                      onClick={() => addShape("circle")}
                      className="w-full text-left p-1.5 hover:bg-white/5 rounded"
                    >
                      Circle
                    </button>
                    <button
                      onClick={() => addShape("ketupat")}
                      className="w-full text-left p-1.5 hover:bg-white/5 rounded"
                    >
                      Ketupat
                    </button>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between p-2 rounded hover:bg-[#2d2d32] text-zinc-300">
                <div className="flex items-center space-x-3">
                  <PaintBucket size={16} />
                  <span>BG Color</span>
                </div>
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => {
                    setBgColor(e.target.value);
                    saveHistory(elements, e.target.value, canvasWidth, canvasHeight);
                  }}
                  className="w-6 h-6 rounded bg-transparent border-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="p-4 space-y-4">
            <h2 className="font-bold text-zinc-100 uppercase tracking-wider">Layout</h2>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-zinc-500 block mb-1">Paper Size</label>
                <select className="w-full bg-zinc-900 border border-[#323236] p-2 rounded text-zinc-200">
                  <option>4 × 6 (Postcard)</option>
                  <option>2 × 6 (Strip)</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-zinc-500 block mb-1">Width</label>
                  <input
                    type="number"
                    value={canvasWidth}
                    onChange={(e) => setCanvasWidth(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-[#323236] p-2 rounded text-zinc-200"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-500 block mb-1">Height</label>
                  <input
                    type="number"
                    value={canvasHeight}
                    onChange={(e) => setCanvasHeight(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-[#323236] p-2 rounded text-zinc-200"
                  />
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* CENTER WORKSPACE */}
        <main
          ref={workspaceRef}
          onClick={() => setSelectedId(null)}
          className="flex-1 bg-[#161618] relative flex items-center justify-center overflow-hidden"
          style={{
            backgroundImage: "radial-gradient(#323236 1.2px, transparent 1.2px)",
            backgroundSize: "20px 20px",
          }}
        >
          <div
            className="absolute top-4 right-4 bg-zinc-900/80 border border-[#323236] px-3 py-1.5 rounded flex items-center space-x-3 z-10"
          >
            <button onClick={() => setDisplayScale((s) => Math.max(0.1, s - 0.05))} className="hover:text-white">
              -
            </button>
            <span className="text-zinc-400">{Math.round(displayScale * 100)}%</span>
            <button onClick={() => setDisplayScale((s) => Math.min(1, s + 0.05))} className="hover:text-white">
              +
            </button>
          </div>

          <div
            style={{ transform: `scale(${displayScale})`, transition: "transform 0.1s ease-out" }}
            className="flex items-center justify-center"
          >
            <div
              ref={canvasRef}
              style={{
                width: 400,
                height: 600,
                backgroundColor: bgColor,
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {elements.map((el) => {
                if (!el.visible) return null;
                const isSelected = selectedId === el.id;

                return (
                  <div
                    key={el.id}
                    onMouseDown={(e) => startDragOrResize(e, el)}
                    onTouchStart={(e) => startDragOrResize(e, el)}
                    style={{
                      position: "absolute",
                      left: el.x,
                      top: el.y,
                      width: el.width,
                      height: el.height,
                      transform: `rotate(${el.rotation}deg)`,
                      border: el.strokeWidth > 0 ? `${el.strokeWidth}px solid ${el.strokeColor}` : "none",
                      filter: el.dropShadow
                        ? `drop-shadow(${Math.cos((el.shadowAngle * Math.PI) / 180) * el.shadowDist}px ${
                            Math.sin((el.shadowAngle * Math.PI) / 180) * el.shadowDist
                          }px ${el.shadowBlur}px ${el.shadowColor})`
                        : "none",
                      outline: isSelected ? "2px solid #9333ea" : "none",
                      cursor: el.locked ? "default" : "move",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {el.type === "photo" && (
                      <div
                        className={`w-full h-full flex items-center justify-center font-bold text-2xl text-white/90 ${
                          el.slotIndex === 1 ? "bg-rose-400/40" : el.slotIndex === 2 ? "bg-emerald-400/40" : "bg-sky-400/40"
                        }`}
                      >
                        {isTestPhotosActive ? (
                          <img
                            src={sampleBoothPhotos[(el.slotIndex! - 1) % sampleBoothPhotos.length]}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          el.slotIndex
                        )}
                      </div>
                    )}
                    {el.type === "image" && el.src && (
                      <img src={el.src} className="w-full h-full object-fill pointer-events-none" />
                    )}
                    {el.type === "text" && (
                      <span
                        style={{
                          fontSize: el.fontSize,
                          color: el.color,
                          fontWeight: "bold",
                          textAlign: "center",
                          wordBreak: "break-word",
                        }}
                      >
                        {el.text}
                      </span>
                    )}
                    {el.type === "shape" && (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          backgroundColor: el.fillColor,
                          borderRadius: el.shapeType === "circle" ? "50%" : "0",
                          transform: el.shapeType === "ketupat" ? "rotate(45deg) scale(0.7)" : "none",
                        }}
                      />
                    )}

                    {isSelected && !el.locked && (
                      <>
                        <div
                          onMouseDown={(e) => startDragOrResize(e, el, "nw")}
                          className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-white border border-purple-600 cursor-nw-resize"
                        />
                        <div
                          onMouseDown={(e) => startDragOrResize(e, el, "ne")}
                          className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white border border-purple-600 cursor-ne-resize"
                        />
                        <div
                          onMouseDown={(e) => startDragOrResize(e, el, "sw")}
                          className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-white border border-purple-600 cursor-sw-resize"
                        />
                        <div
                          onMouseDown={(e) => startDragOrResize(e, el, "se")}
                          className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-white border border-purple-600 cursor-se-resize"
                        />
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="absolute bottom-4 right-4">
            <button
              onClick={() => setIsTestPhotosActive(!isTestPhotosActive)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-bold shadow-lg transition-all ${
                isTestPhotosActive ? "bg-amber-600 hover:bg-amber-500" : "bg-emerald-600 hover:bg-emerald-500"
              }`}
            >
              <Camera size={16} />
              <span>{isTestPhotosActive ? "Reset Preview" : "Test Isi Foto Booth"}</span>
            </button>
          </div>
        </main>

        {/* RIGHT SIDEBAR */}
        <aside className="w-72 bg-[#222225] border-l border-[#323236] flex flex-col overflow-y-auto">
          <div className="p-4 border-b border-[#323236]">
            <div className="flex items-center justify-between mb-4">
              <span className="font-bold text-zinc-100 uppercase tracking-wider">Properties</span>
              {selectedElement && (
                <span className="bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded text-[10px]">
                  ID: {selectedElement.id.slice(-4)}
                </span>
              )}
            </div>

            {!selectedElement ? (
              <p className="text-zinc-500 text-center py-8 italic">Pilih elemen untuk mengedit properties</p>
            ) : (
              <div className="space-y-4">
                {selectedElement.type === "text" && (
                  <>
                    <div>
                      <label className="text-[10px] text-zinc-500 block mb-1">Text Content</label>
                      <input
                        type="text"
                        value={selectedElement.text}
                        onChange={(e) => updateElement(selectedElement.id, { text: e.target.value })}
                        onBlur={commitUpdate}
                        className="w-full bg-zinc-900 border border-[#323236] p-2 rounded text-zinc-200"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-zinc-500 block mb-1">Font Size</label>
                        <input
                          type="number"
                          value={selectedElement.fontSize}
                          onChange={(e) => updateElement(selectedElement.id, { fontSize: Number(e.target.value) })}
                          onBlur={commitUpdate}
                          className="w-full bg-zinc-900 border border-[#323236] p-2 rounded text-zinc-200"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-zinc-500 block mb-1">Color</label>
                        <input
                          type="color"
                          value={selectedElement.color}
                          onChange={(e) => updateElement(selectedElement.id, { color: e.target.value })}
                          onBlur={commitUpdate}
                          className="w-full h-8 bg-zinc-900 border border-[#323236] p-1 rounded cursor-pointer"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] text-zinc-500">Stroke Width</label>
                    <span className="text-zinc-400">{selectedElement.strokeWidth}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={selectedElement.strokeWidth}
                    onChange={(e) => updateElement(selectedElement.id, { strokeWidth: Number(e.target.value) })}
                    onBlur={commitUpdate}
                    className="w-full accent-purple-500"
                  />
                </div>

                <div className="border-t border-[#323236] pt-4">
                  <button
                    onClick={() => toggleAccordion("shadow")}
                    className="flex items-center justify-between w-full mb-2"
                  >
                    <span className="font-bold text-zinc-300">Drop Shadow</span>
                    <ChevronUp className={`transition-transform ${activeAccordions["shadow"] ? "" : "rotate-180"}`} size={14} />
                  </button>
                  {activeAccordions["shadow"] && (
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-400">Enabled</span>
                        <button
                          onClick={() => {
                            updateElement(selectedElement.id, { dropShadow: !selectedElement.dropShadow });
                            commitUpdate();
                          }}
                          className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                            selectedElement.dropShadow ? "bg-purple-600" : "bg-zinc-700"
                          }`}
                        >
                          <div
                            className={`w-4 h-4 bg-white rounded-full transition-transform ${
                              selectedElement.dropShadow ? "translate-x-4" : ""
                            }`}
                          />
                        </button>
                      </div>
                      {selectedElement.dropShadow && (
                        <>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[10px] text-zinc-500 block mb-1">Angle</label>
                              <input
                                type="number"
                                value={selectedElement.shadowAngle}
                                onChange={(e) => updateElement(selectedElement.id, { shadowAngle: Number(e.target.value) })}
                                onBlur={commitUpdate}
                                className="w-full bg-zinc-900 border border-[#323236] p-2 rounded text-zinc-200"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-zinc-500 block mb-1">Blur</label>
                              <input
                                type="number"
                                value={selectedElement.shadowBlur}
                                onChange={(e) => updateElement(selectedElement.id, { shadowBlur: Number(e.target.value) })}
                                onBlur={commitUpdate}
                                className="w-full bg-zinc-900 border border-[#323236] p-2 rounded text-zinc-200"
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* LAYERS LIST */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <button
              onClick={() => toggleAccordion("layers")}
              className="flex items-center justify-between w-full p-4 border-b border-[#323236]"
            >
              <div className="flex items-center space-x-2">
                <span className="font-bold text-zinc-100 uppercase tracking-wider">Layers</span>
                <span className="text-zinc-500 text-[10px]">({elements.length})</span>
              </div>
              <ChevronUp className={`transition-transform ${activeAccordions["layers"] ? "" : "rotate-180"}`} size={14} />
            </button>
            {activeAccordions["layers"] && (
              <div className="flex-1 overflow-y-auto bg-black/10">
                {[...elements].reverse().map((el) => (
                  <div
                    key={el.id}
                    onClick={() => setSelectedId(el.id)}
                    className={`flex items-center justify-between p-2.5 border-b border-[#323236]/30 cursor-pointer ${
                      selectedId === el.id ? "bg-purple-600/20 border-l-2 border-l-purple-500" : "hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center space-x-2 overflow-hidden">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleVisibility(el.id);
                        }}
                        className="p-1 hover:bg-white/10 rounded"
                      >
                        {el.visible ? <Eye size={12} /> : <EyeOff size={12} className="text-zinc-600" />}
                      </button>
                      <span className={`truncate ${el.visible ? "text-zinc-300" : "text-zinc-600"}`}>{el.name}</span>
                    </div>
                    {el.locked && <Lock size={10} className="text-zinc-500" />}
                  </div>
                ))}
              </div>
            )}
            <div className="p-2 border-t border-[#323236] flex items-center justify-end space-x-1">
              <button
                onClick={toggleLockSelected}
                className={`p-2 rounded hover:bg-[#2d2d32] ${
                  selectedElement?.locked ? "text-purple-400" : "text-zinc-500"
                }`}
              >
                <Lock size={16} />
              </button>
              <button
                onClick={deleteSelectedElement}
                className="p-2 rounded hover:bg-rose-950/30 text-zinc-500 hover:text-rose-400"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
