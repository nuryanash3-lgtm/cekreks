'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Settings,
  Plus,
  Smartphone,
  QrCode,
  Monitor,
  Image as ImageIcon,
  Mic,
  Camera,
  Sparkles,
  CheckCircle2,
  CreditCard,
  ChevronRight,
  Layers,
  FileText,
  HelpCircle,
  Trash2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Lock,
  Unlock,
  Check,
  Sliders,
} from 'lucide-react';

interface CatalogNodeItem {
  type: string;
  label: string;
  subtitle: string;
  color: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
}

interface FlowNodeSettings {
  launchType?: string;
  enableEventName?: boolean;
  enableEventDescription?: boolean;
  enableGalleryButton?: boolean;
  enableSettingsGear?: boolean;
  enableFullscreenButton?: boolean;
  enableEffectTransition?: boolean;
  outAnimation?: string;
  overlayDarken?: number;
  standardLayout?: string;
  customButtonText?: string;
  eventName?: string;
  eventDesc?: string;
  columns?: number;
  showCategoryTabs?: boolean;
  autoAdvance?: boolean;
  selectionTimer?: number;
  countdownSeconds?: number;
  mirrorPreview?: boolean;
  flashEffect?: boolean;
  retakeAllowed?: boolean;
  modelEngine?: string;
  faceRestore?: boolean;
  upscale2x?: boolean;
  loadingStyle?: string;
  showQrDownload?: boolean;
  enablePrintButton?: boolean;
  enableEmailShare?: boolean;
  autoResetSeconds?: number;
  duration?: number;
  enableSound?: boolean;
  showProgress?: boolean;
  [key: string]: string | number | boolean | undefined;
}

interface FlowNode {
  id: string;
  type: string;
  label: string;
  subtitle: string;
  color: string;
  x: number;
  y: number;
  settings: FlowNodeSettings;
}

interface FlowEdge {
  id: string;
  source: string;
  target: string;
}

interface ConnectingState {
  nodeId: string;
  portType: 'top' | 'bottom';
}

interface AiStyleConcept {
  id: string;
  name: string;
  prompt: string;
  active: boolean;
}

interface BoothGlobalSettings {
  boothTitle: string;
  cameraDevice: string;
  printerName: string;
  qrServerUrl: string;
  kioskMode: boolean;
}

// Definisi katalog node sesuai dengan daftar di gambar
const NODE_CATALOG: CatalogNodeItem[] = [
  { type: 'CUSTOM_UI', label: 'CUSTOM UI', subtitle: 'CUSTOM STEP', color: '#a855f7', icon: Smartphone },
  { type: 'QR_BOOTH', label: 'QR BOOTH NODE', subtitle: 'QR SCAN', color: '#06b6d4', icon: QrCode },
  { type: 'LIVE_MONITOR', label: 'LIVE MONITOR', subtitle: 'DISPLAY', color: '#22d3ee', icon: Monitor },
  { type: 'LAUNCH_SCREEN', label: 'LAUNCH SCREEN', subtitle: 'CORE STEP', color: '#3b82f6', icon: Smartphone },
  { type: 'CONCEPT_SELECTION', label: 'CONCEPT SELECTION', subtitle: 'CONCEPT SELECT', color: '#ec4899', icon: ImageIcon },
  { type: 'AI_CONVERSATIONAL', label: 'AI CONVERSATIONAL', subtitle: 'VOICE AI', color: '#a855f7', icon: Mic },
  { type: 'CAMERA_CAPTURE', label: 'CAMERA / CAPTURE', subtitle: 'CORE STEP', color: '#f43f5e', icon: Camera },
  { type: 'AI_PROCESSING', label: 'AI PROCESSING', subtitle: 'CORE STEP', color: '#6366f1', icon: Sparkles },
  { type: 'RESULT_SCREEN', label: 'RESULT SCREEN', subtitle: 'CORE STEP', color: '#10b981', icon: CheckCircle2 },
  { type: 'GALLERY_SCREEN', label: 'GALLERY SCREEN', subtitle: 'MEDIA VIEW', color: '#ec4899', icon: ImageIcon },
  { type: 'PAYMENT_QRIS', label: 'PAYMENT (QRIS)', subtitle: 'TRANSACTION', color: '#22c55e', icon: CreditCard },
  { type: 'SWITCH_ROUTER', label: 'SWITCH ROUTER', subtitle: 'LOGIC BRANCH', color: '#06b6d4', icon: ChevronRight },
  { type: 'IMAGE_EDITOR', label: 'IMAGE RESULT EDITOR', subtitle: 'OVERLAY & FRAME', color: '#a855f7', icon: Layers },
  { type: 'FORM_EDITOR', label: 'FORM EDITOR', subtitle: 'USER DATA', color: '#9333ea', icon: FileText },
  { type: 'CHECK_IN', label: 'CHECK IN', subtitle: 'ATTENDANCE', color: '#10b981', icon: CheckCircle2 },
  { type: 'REGISTRATION', label: 'REGISTRATION', subtitle: 'ONBOARDING', color: '#a855f7', icon: CheckCircle2 },
  { type: 'QUIZ_EDITOR', label: 'QUIZ EDITOR', subtitle: 'INTERACTIVE QUIZ', color: '#eab308', icon: HelpCircle },
];

// Data awal node agar langsung terlihat seperti pada screenshot kedua
const INITIAL_NODES: FlowNode[] = [
  {
    id: 'node-1',
    type: 'LAUNCH_SCREEN',
    label: 'LAUNCH SCREEN',
    subtitle: 'CORE STEP',
    color: '#3b82f6',
    x: 410,
    y: 60,
    settings: {
      launchType: 'STANDARD LAUNCH',
      enableEventName: true,
      enableEventDescription: true,
      enableGalleryButton: true,
      enableSettingsGear: true,
      enableFullscreenButton: true,
      enableEffectTransition: true,
      outAnimation: 'SPLIT OUT (DEFAULT)',
      overlayDarken: 60,
      standardLayout: 'USE LAUNCH & GALLERY BUTTON',
      customButtonText: 'TAP TO START',
      eventName: 'ARTBOOTH',
      eventDesc: 'AI PHOTO EXPERIENCE',
    },
  },
  {
    id: 'node-2',
    type: 'CONCEPT_SELECTION',
    label: 'CONCEPT SELECTION',
    subtitle: 'CONCEPT SELECT',
    color: '#ec4899',
    x: 280,
    y: 255,
    settings: {
      columns: 3,
      showCategoryTabs: true,
      autoAdvance: false,
      selectionTimer: 30,
      overlayDarken: 50,
    },
  },
  {
    id: 'node-3',
    type: 'CAMERA_CAPTURE',
    label: 'CAMERA / CAPTURE',
    subtitle: 'CORE STEP',
    color: '#f43f5e',
    x: 225,
    y: 475,
    settings: {
      countdownSeconds: 3,
      mirrorPreview: true,
      flashEffect: true,
      retakeAllowed: true,
      overlayDarken: 40,
    },
  },
  {
    id: 'node-4',
    type: 'AI_PROCESSING',
    label: 'AI PROCESSING',
    subtitle: 'CORE STEP',
    color: '#6366f1',
    x: 360,
    y: 695,
    settings: {
      modelEngine: 'ARTBOOTH DIFFUSION XL',
      faceRestore: true,
      upscale2x: true,
      loadingStyle: 'CYBER PULSE',
      overlayDarken: 70,
    },
  },
  {
    id: 'node-5',
    type: 'RESULT_SCREEN',
    label: 'RESULT SCREEN',
    subtitle: 'CORE STEP',
    color: '#10b981',
    x: 685,
    y: 730,
    settings: {
      showQrDownload: true,
      enablePrintButton: true,
      enableEmailShare: false,
      autoResetSeconds: 45,
      overlayDarken: 50,
    },
  },
];

// Data kabel penghubung awal
const INITIAL_EDGES: FlowEdge[] = [
  { id: 'edge-1', source: 'node-1', target: 'node-2' },
  { id: 'edge-2', source: 'node-2', target: 'node-3' },
  { id: 'edge-3', source: 'node-3', target: 'node-4' },
  { id: 'edge-4', source: 'node-4', target: 'node-5' },
];

const NODE_WIDTH = 215;
const NODE_HEIGHT = 115;

export default function InteractiveFlowPage() {
  // Navigation & Global UI States
  const [activeTab, setActiveTab] = useState<string>('INTERACTIVE FLOW');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Flow Canvas States
  const [nodes, setNodes] = useState<FlowNode[]>(INITIAL_NODES);
  const [edges, setEdges] = useState<FlowEdge[]>(INITIAL_EDGES);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('node-1');
  const [isAddMenuOpen, setIsAddMenuOpen] = useState<boolean>(false);

  // Canvas Transform & Interaction States
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Node Dragging State
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Cable Connection Dragging State
  const [connectingFrom, setConnectingFrom] = useState<ConnectingState | null>(null);
  const [mouseCanvasPos, setMouseCanvasPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Live Preview Device Orientation
  const [previewOrientation, setPreviewOrientation] = useState<'PORTRAIT' | 'LANDSCAPE'>('PORTRAIT');

  // Extra tabs states (Concepts & Settings)
  const [concepts, setConcepts] = useState<AiStyleConcept[]>([
    { id: 'c1', name: 'CYBERPUNK NEON', prompt: 'Futuristic neon city portrait, glowing lights', active: true },
    { id: 'c2', name: 'ROYAL RENAISSANCE', prompt: 'Classic oil painting royal attire, dramatic lighting', active: true },
    { id: 'c3', name: 'ANIME STUDIO', prompt: 'High quality anime illustration style, vibrant colors', active: true },
    { id: 'c4', name: '3D PIXAR HERO', prompt: 'Cute 3D animated character style, soft studio light', active: false },
  ]);
  const [globalSettings, setGlobalSettings] = useState<BoothGlobalSettings>({
    boothTitle: 'ARTBOOTH STUDIO',
    cameraDevice: 'Canon EOS R5 (USB Tether)',
    printerName: 'DNP DS620A Thermal',
    qrServerUrl: 'https://artbooth.live/s/',
    kioskMode: true,
  });

  const canvasRef = useRef<HTMLDivElement | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  // Fungsi menghapus node beserta kabel yang terhubung
  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      if (isLocked) {
        showToast('Canvas is locked! Unlock to edit.');
        return;
      }
      setNodes((prev) => prev.filter((n) => n.id !== nodeId));
      setEdges((prev) => prev.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
      setSelectedNodeId((prev) => (prev === nodeId ? null : prev));
      showToast('Node removed from flow');
    },
    [isLocked, showToast]
  );

  // Keyboard listener untuk menghapus node yang dipilih dengan tombol Backspace / Delete
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName;
      if (activeTag === 'INPUT' || activeTag === 'TEXTAREA') {
        return;
      }

      if ((e.key === 'Backspace' || e.key === 'Delete') && selectedNodeId && !isLocked) {
        e.preventDefault();
        handleDeleteNode(selectedNodeId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNodeId, isLocked, handleDeleteNode]);

  // Fungsi menambah node baru dari dropdown menu
  const handleAddNode = (catalogItem: CatalogNodeItem) => {
    if (isLocked) {
      showToast('Canvas is locked! Unlock to add nodes.');
      return;
    }
    const newId = `node-${Date.now()}`;
    const offsetX = Math.floor(Math.random() * 60) - 30;
    const offsetY = Math.floor(Math.random() * 60) - 30;
    const centerX = (-pan.x + 420) / zoom + offsetX;
    const centerY = (-pan.y + 240) / zoom + offsetY;

    const defaultSettings: FlowNodeSettings =
      catalogItem.type === 'LAUNCH_SCREEN'
        ? {
            launchType: 'STANDARD LAUNCH',
            enableEventName: true,
            enableEventDescription: true,
            enableGalleryButton: true,
            enableSettingsGear: true,
            enableFullscreenButton: true,
            enableEffectTransition: true,
            outAnimation: 'SPLIT OUT (DEFAULT)',
            overlayDarken: 60,
            standardLayout: 'USE LAUNCH & GALLERY BUTTON',
            customButtonText: 'TAP TO START',
            eventName: 'ARTBOOTH',
            eventDesc: 'AI PHOTO EXPERIENCE',
          }
        : {
            overlayDarken: 50,
            autoAdvance: false,
            duration: 15,
            enableSound: true,
          };

    const newNode: FlowNode = {
      id: newId,
      type: catalogItem.type,
      label: catalogItem.label,
      subtitle: catalogItem.subtitle,
      color: catalogItem.color,
      x: Math.round(centerX),
      y: Math.round(centerY),
      settings: defaultSettings,
    };

    setNodes((prev) => [...prev, newNode]);
    setSelectedNodeId(newId);
    setIsAddMenuOpen(false);
    showToast(`Added ${catalogItem.label}`);
  };

  // Update pengaturan spesifik pada node yang dipilih
  const updateSelectedNodeSetting = (
    key: keyof FlowNodeSettings,
    value: string | number | boolean
  ) => {
    if (!selectedNodeId) return;
    setNodes((prev) =>
      prev.map((node) =>
        node.id === selectedNodeId
          ? { ...node, settings: { ...node.settings, [key]: value } }
          : node
      )
    );
  };

  // Konversi koordinat layar ke koordinat canvas
  const screenToCanvas = useCallback(
    (clientX: number, clientY: number) => {
      if (!canvasRef.current) return { x: 0, y: 0 };
      const rect = canvasRef.current.getBoundingClientRect();
      return {
        x: (clientX - rect.left - pan.x) / zoom,
        y: (clientY - rect.top - pan.y) / zoom,
      };
    },
    [pan, zoom]
  );

  // Event handler saat mulai mendrag node
  const handleNodeMouseDown = (e: React.MouseEvent<HTMLDivElement>, node: FlowNode) => {
    e.stopPropagation();
    setSelectedNodeId(node.id);
    setIsAddMenuOpen(false);
    if (isLocked) return;

    const canvasPos = screenToCanvas(e.clientX, e.clientY);
    setDraggingNodeId(node.id);
    setDragOffset({
      x: canvasPos.x - node.x,
      y: canvasPos.y - node.y,
    });
  };

  // Event handler saat mulai menarik kabel dari port output/input
  const handlePortMouseDown = (
    e: React.MouseEvent<HTMLDivElement>,
    nodeId: string,
    portType: 'top' | 'bottom'
  ) => {
    e.stopPropagation();
    if (isLocked) {
      showToast('Canvas is locked!');
      return;
    }
    const canvasPos = screenToCanvas(e.clientX, e.clientY);
    setConnectingFrom({ nodeId, portType });
    setMouseCanvasPos(canvasPos);
  };

  // Event handler saat melepas kabel di port target
  const handlePortMouseUp = (
    e: React.MouseEvent<HTMLDivElement>,
    targetNodeId: string,
    _targetPortType: 'top' | 'bottom'
  ) => {
    e.stopPropagation();
    if (!connectingFrom) return;

    if (connectingFrom.nodeId !== targetNodeId) {
      const sourceId =
        connectingFrom.portType === 'bottom' ? connectingFrom.nodeId : targetNodeId;
      const targetId =
        connectingFrom.portType === 'bottom' ? targetNodeId : connectingFrom.nodeId;

      const exists = edges.some(
        (edge) => edge.source === sourceId && edge.target === targetId
      );
      if (!exists) {
        setEdges((prev) => [
          ...prev,
          { id: `edge-${Date.now()}`, source: sourceId, target: targetId },
        ]);
        showToast('Cable connected!');
      }
    }
    setConnectingFrom(null);
  };

  // Event handler pergerakan mouse di atas canvas
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (draggingNodeId && !isLocked) {
      const canvasPos = screenToCanvas(e.clientX, e.clientY);
      setNodes((prev) =>
        prev.map((n) =>
          n.id === draggingNodeId
            ? { ...n, x: canvasPos.x - dragOffset.x, y: canvasPos.y - dragOffset.y }
            : n
        )
      );
    } else if (connectingFrom) {
      const canvasPos = screenToCanvas(e.clientX, e.clientY);
      setMouseCanvasPos(canvasPos);
    } else if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    }
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsAddMenuOpen(false);
    if (e.button === 0 || e.button === 1) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleCanvasMouseUp = () => {
    setDraggingNodeId(null);
    setConnectingFrom(null);
    setIsPanning(false);
  };

  // Zoom dengan scroll mouse
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
    setZoom((prev) => Math.min(Math.max(prev * zoomFactor, 0.4), 2.0));
  };

  // Reset tampilan canvas ke tengah (Fit View)
  const handleFitView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    showToast('View centered');
  };

  // Hapus kabel saat di-double click
  const handleEdgeDoubleClick = (e: React.MouseEvent<SVGGElement>, edgeId: string) => {
    e.stopPropagation();
    if (isLocked) {
      showToast('Canvas is locked!');
      return;
    }
    setEdges((prev) => prev.filter((edge) => edge.id !== edgeId));
    showToast('Cable removed');
  };

  // Kalkulasi path kurva Bezier yang melengkung mulus antar node
  const getBezierPath = (x1: number, y1: number, x2: number, y2: number) => {
    const deltaY = Math.abs(y2 - y1);
    const controlOffset = Math.max(deltaY * 0.55, 65);
    return `M ${x1} ${y1} C ${x1} ${y1 + controlOffset}, ${x2} ${y2 - controlOffset}, ${x2} ${y2}`;
  };

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || null;

  return (
    <div className="h-[100dvh] w-full overflow-hidden bg-[#101014] text-white flex flex-col select-none font-sans">
      {/* Custom Styles untuk Neon Font, Dotted Grid, dan Animasi Kabel Putus-putus */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:ital,wght@0,600;0,800;1,700&family=Inter:wght@400;500;600;700&display=swap');

        .font-cyber {
          font-family: 'Orbitron', sans-serif;
        }
        .font-ui {
          font-family: 'Inter', sans-serif;
        }
        .neon-title {
          text-shadow: 0 0 10px rgba(168, 85, 247, 0.8), 0 0 22px rgba(168, 85, 247, 0.45);
        }
        .canvas-dots {
          background-image: radial-gradient(rgba(255, 255, 255, 0.14) 1.5px, transparent 1.5px);
        }
        @keyframes dashFlow {
          to {
            stroke-dashoffset: -28;
          }
        }
        .animated-cable {
          stroke-dasharray: 7 7;
          animation: dashFlow 0.85s linear infinite;
        }
        /* Custom scrollbar untuk dropdown Add Node & Settings Panel */
        .purple-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .purple-scrollbar::-webkit-scrollbar-track {
          background: #141418;
        }
        .purple-scrollbar::-webkit-scrollbar-thumb {
          background: #6b21a8;
          border-radius: 999px;
        }
        .purple-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9333ea;
        }
      `}</style>

      {/* ==================== MAIN CONTENT AREA ==================== */}
      {activeTab === 'INTERACTIVE FLOW' ? (
        <div className="flex-1 min-h-0 flex overflow-hidden relative font-ui">
          {/* ---------- LEFT / CENTER NODE CANVAS (TETAP DIAM, TIDAK IKUT SCROLL) ---------- */}
          <div
            ref={canvasRef}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={handleCanvasMouseUp}
            onWheel={handleWheel}
            className={`flex-1 h-full min-h-0 relative overflow-hidden bg-[#121216] canvas-dots ${
              isPanning ? 'cursor-grabbing' : 'cursor-grab'
            }`}
            style={{
              backgroundSize: `${28 * zoom}px ${28 * zoom}px`,
              backgroundPosition: `${pan.x}px ${pan.y}px`,
            }}
          >
            {/* FLOATING LEFT PANEL: INTERACTIVE FLOW LEGEND & + ADD NODE */}
            <div
              onMouseDown={(e) => e.stopPropagation()}
              className="absolute top-5 left-5 z-20 w-64 bg-[#1c1c21]/95 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-2xl"
            >
              <div className="flex items-center gap-2 mb-3">
                <Settings className="w-4 h-4 text-purple-400" />
                <span className="font-cyber text-xs font-bold tracking-wider text-white">
                  INTERACTIVE FLOW
                </span>
              </div>

              <ul className="space-y-1.5 text-[11px] text-zinc-300 mb-4">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                  <span>Click node to edit</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                  <span>Backspace to remove node</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                  <span>Double click to remove cable</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <span>Scroll to zoom in &amp; out</span>
                </li>
              </ul>

              <button
                type="button"
                onClick={() => setIsAddMenuOpen((prev) => !prev)}
                className="w-full py-2.5 px-4 rounded-xl bg-[#27272d] hover:bg-[#32323a] border border-white/10 hover:border-purple-500/50 text-white font-cyber text-xs font-bold tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-inner"
              >
                <Plus className="w-4 h-4 text-purple-400" />
                <span>ADD NODE</span>
              </button>

              {/* DROPDOWN MENU: DAFTAR NODE (Sesuai Gambar 1) */}
              {isAddMenuOpen && (
                <div className="absolute left-full top-24 ml-3 w-64 max-h-[68vh] overflow-y-auto purple-scrollbar bg-[#18181d]/98 backdrop-blur-xl border border-white/15 rounded-xl shadow-[0_15px_50px_rgba(0,0,0,0.85)] z-50 divide-y divide-white/5">
                  {NODE_CATALOG.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <button
                        key={item.type}
                        type="button"
                        onClick={() => handleAddNode(item)}
                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-purple-600/20 text-left transition-colors group cursor-pointer"
                      >
                        <IconComponent
                          className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110"
                          style={{ color: item.color }}
                        />
                        <span
                          className="font-cyber text-[11px] font-bold tracking-wider transition-colors"
                          style={{
                            color: item.type === 'LIVE_MONITOR' ? '#22d3ee' : '#f4f4f5',
                          }}
                        >
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* FLOATING DEVICE PREVIEW OVERLAY (Tengah Kanan seperti di Gambar 2) */}
            <div
              onMouseDown={(e) => e.stopPropagation()}
              className="hidden xl:flex flex-col items-center absolute top-5 right-5 z-20 pointer-events-auto"
            >
              <div
                className={`relative rounded-2xl border-2 border-purple-500/40 bg-[#0d0d12] overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.8)] transition-all duration-300 flex flex-col items-center justify-center ${
                  previewOrientation === 'PORTRAIT' ? 'w-28 h-48' : 'w-48 h-28'
                }`}
              >
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle at 50% 50%, #581c87 0%, #09090b 85%)',
                  }}
                />
                <div
                  className="absolute inset-0 bg-black transition-opacity"
                  style={{
                    opacity: ((selectedNode?.settings?.overlayDarken ?? 60) / 100) * 0.85,
                  }}
                />

                <div className="relative z-10 flex flex-col items-center text-center px-2">
                  <span className="font-cyber text-[8px] font-extrabold tracking-widest text-white drop-shadow">
                    {selectedNode?.settings?.eventName || 'ARTBOOTH'}
                  </span>
                  {selectedNode?.settings?.enableEventDescription !== false && (
                    <span className="text-[5px] text-zinc-300 tracking-wider mt-0.5">
                      {selectedNode?.type === 'LAUNCH_SCREEN'
                        ? 'AI PHOTO BOOTH'
                        : selectedNode?.label || 'PREVIEW'}
                    </span>
                  )}
                  <div className="mt-2 flex items-center gap-1">
                    <span className="px-2 py-0.5 rounded bg-purple-600 text-[5px] font-bold tracking-wider text-white shadow-[0_0_8px_#9333ea]">
                      {selectedNode?.type === 'CAMERA_CAPTURE'
                        ? 'CAPTURE'
                        : selectedNode?.type === 'RESULT_SCREEN'
                          ? 'QR CODE'
                          : 'LAUNCH'}
                    </span>
                    {selectedNode?.settings?.enableGalleryButton !== false &&
                      selectedNode?.settings?.standardLayout !== 'USE LAUNCH BUTTON ONLY' && (
                        <span className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 text-[5px] text-zinc-200">
                          GALLERY
                        </span>
                      )}
                  </div>
                </div>
              </div>

              {/* Toggle Portrait / Landscape */}
              <div className="mt-2 flex items-center bg-[#18181d] border border-white/10 rounded-full p-0.5 shadow-lg">
                <button
                  type="button"
                  onClick={() => setPreviewOrientation('PORTRAIT')}
                  className={`px-2.5 py-1 rounded-full text-[9px] font-bold tracking-wider transition-all cursor-pointer ${
                    previewOrientation === 'PORTRAIT'
                      ? 'bg-purple-600 text-white shadow'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  PORTRAIT
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewOrientation('LANDSCAPE')}
                  className={`px-2.5 py-1 rounded-full text-[9px] font-bold tracking-wider transition-all cursor-pointer ${
                    previewOrientation === 'LANDSCAPE'
                      ? 'bg-purple-600 text-white shadow'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  LANDSCAPE
                </button>
              </div>
            </div>

            {/* FLOATING BOTTOM-LEFT ZOOM & LOCK CONTROLS */}
            <div
              onMouseDown={(e) => e.stopPropagation()}
              className="absolute bottom-25 left-5 z-20 flex flex-col bg-[#1c1c21]/95 border border-white/10 rounded-xl overflow-hidden shadow-xl"
            >
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(z + 0.15, 2.0))}
                title="Zoom In"
                className="p-2.5 hover:bg-white/10 text-zinc-300 hover:text-white border-b border-white/10 transition-colors cursor-pointer"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(z - 0.15, 0.4))}
                title="Zoom Out"
                className="p-2.5 hover:bg-white/10 text-zinc-300 hover:text-white border-b border-white/10 transition-colors cursor-pointer"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleFitView}
                title="Reset View"
                className="p-2.5 hover:bg-white/10 text-zinc-300 hover:text-white border-b border-white/10 transition-colors cursor-pointer"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsLocked((prev) => {
                    const nextLocked = !prev;
                    showToast(nextLocked ? 'Canvas locked' : 'Canvas unlocked');
                    return nextLocked;
                  });
                }}
                title={isLocked ? 'Unlock Canvas' : 'Lock Canvas'}
                className={`p-2.5 transition-colors cursor-pointer ${
                  isLocked
                    ? 'bg-purple-600/30 text-purple-400'
                    : 'hover:bg-white/10 text-zinc-300 hover:text-white'
                }`}
              >
                {isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
              </button>
            </div>

            {/* TRANSFORMABLE LAYER: EDGES (SVG) + NODES */}
            <div
              className="absolute inset-0 origin-top-left"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              }}
            >
              {/* SVG LAYER UNTUK KABEL ANIMASI */}
              <svg className="w-[4000px] h-[4000px] absolute top-0 left-0 pointer-events-none overflow-visible">
                <defs>
                  <filter id="cableGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {edges.map((edge) => {
                  const sourceNode = nodes.find((n) => n.id === edge.source);
                  const targetNode = nodes.find((n) => n.id === edge.target);
                  if (!sourceNode || !targetNode) return null;

                  const x1 = sourceNode.x + NODE_WIDTH / 2;
                  const y1 = sourceNode.y + NODE_HEIGHT;
                  const x2 = targetNode.x + NODE_WIDTH / 2;
                  const y2 = targetNode.y;

                  const pathData = getBezierPath(x1, y1, x2, y2);

                  return (
                    <g
                      key={edge.id}
                      onDoubleClick={(e) => handleEdgeDoubleClick(e, edge.id)}
                      className="pointer-events-auto cursor-pointer group"
                    >
                      <path d={pathData} fill="none" stroke="transparent" strokeWidth="18" />
                      <path
                        d={pathData}
                        fill="none"
                        stroke="#d946ef"
                        strokeWidth="4"
                        strokeLinecap="round"
                        filter="url(#cableGlow)"
                        className="animated-cable group-hover:stroke-rose-400 transition-colors"
                      />
                    </g>
                  );
                })}

                {/* Kabel sementara saat user sedang menarik garis koneksi */}
                {connectingFrom &&
                  (() => {
                    const fromNode = nodes.find((n) => n.id === connectingFrom.nodeId);
                    if (!fromNode) return null;
                    const startX = fromNode.x + NODE_WIDTH / 2;
                    const startY =
                      connectingFrom.portType === 'bottom'
                        ? fromNode.y + NODE_HEIGHT
                        : fromNode.y;
                    const pathData = getBezierPath(
                      startX,
                      startY,
                      mouseCanvasPos.x,
                      mouseCanvasPos.y
                    );
                    return (
                      <path
                        d={pathData}
                        fill="none"
                        stroke="#a855f7"
                        strokeWidth="3.5"
                        strokeDasharray="6 6"
                      />
                    );
                  })()}
              </svg>

              {/* NODE CARDS LAYER */}
              {nodes.map((node) => {
                const isSelected = node.id === selectedNodeId;
                return (
                  <div
                    key={node.id}
                    onMouseDown={(e) => handleNodeMouseDown(e, node)}
                    style={{
                      left: node.x,
                      top: node.y,
                      width: NODE_WIDTH,
                      height: NODE_HEIGHT,
                      borderColor: isSelected ? node.color : `${node.color}55`,
                      boxShadow: isSelected
                        ? `0 0 28px ${node.color}40, inset 0 0 18px ${node.color}18`
                        : '0 10px 25px rgba(0,0,0,0.6)',
                    }}
                    className={`absolute rounded-2xl bg-[#16161b]/95 backdrop-blur-md border-2 flex flex-col items-center justify-center px-4 text-center transition-shadow cursor-pointer ${
                      isSelected ? 'z-10' : 'z-0 hover:border-white/40'
                    }`}
                  >
                    {/* TOP INPUT PORT */}
                    <div
                      onMouseDown={(e) => handlePortMouseDown(e, node.id, 'top')}
                      onMouseUp={(e) => handlePortMouseUp(e, node.id, 'top')}
                      title="Input Port (Drag to connect)"
                      style={{ borderColor: node.color }}
                      className="w-3.5 h-3.5 rounded-full bg-[#101014] border-2 absolute -top-2 left-1/2 -translate-x-1/2 hover:scale-125 transition-transform cursor-crosshair"
                    />

                    {/* NODE TITLE & SUBTITLE */}
                    <h3 className="font-cyber text-xs font-extrabold tracking-wider text-white leading-snug">
                      {node.label}
                    </h3>
                    <span
                      style={{ color: node.color }}
                      className="font-cyber text-[10px] font-bold tracking-widest mt-1.5 uppercase"
                    >
                      {node.subtitle}
                    </span>

                    {/* BOTTOM OUTPUT PORT */}
                    <div
                      onMouseDown={(e) => handlePortMouseDown(e, node.id, 'bottom')}
                      onMouseUp={(e) => handlePortMouseUp(e, node.id, 'bottom')}
                      title="Output Port (Drag to connect)"
                      style={{ borderColor: node.color }}
                      className="w-3.5 h-3.5 rounded-full bg-[#101014] border-2 absolute -bottom-2 left-1/2 -translate-x-1/2 hover:scale-125 transition-transform cursor-crosshair"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* ---------- RIGHT SIDEBAR: SCROLLBAR KHUSUS DI SIDEBAR SAJA ---------- */}
          <aside className="w-80 lg:w-96 h-full min-h-0 bg-[#131317] border-l border-white/10 flex flex-col z-20 shrink-0 overflow-hidden">
            {selectedNode ? (
              <>
                <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between shrink-0">
                  <span className="text-[11px] font-bold tracking-widest text-zinc-400 uppercase">
                    {selectedNode.label}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteNode(selectedNode.id)}
                    title="Delete Node"
                    className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/30 text-rose-400 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto purple-scrollbar p-6 space-y-6">
                  <div className="flex items-center gap-2.5">
                    <Smartphone className="w-5 h-5" style={{ color: selectedNode.color }} />
                    <h2 className="font-cyber text-sm font-bold tracking-wider text-white">
                      {selectedNode.label} SETTINGS
                    </h2>
                  </div>

                  {selectedNode.type === 'LAUNCH_SCREEN' ? (
                    <>
                      <div className="space-y-2.5">
                        <label className="block font-cyber text-[10px] font-bold tracking-wider text-purple-400">
                          LAUNCH TYPE
                        </label>
                        <div className="grid grid-cols-2 gap-2.5">
                          {['STANDARD LAUNCH', 'VIDEO START'].map((type) => {
                            const active = selectedNode.settings.launchType === type;
                            return (
                              <button
                                key={type}
                                type="button"
                                onClick={() => updateSelectedNodeSetting('launchType', type)}
                                className={`py-2.5 px-3 rounded-lg text-[10px] font-bold tracking-wider border transition-all cursor-pointer ${
                                  active
                                    ? 'bg-purple-600/20 border-purple-500 text-white shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                                    : 'bg-[#1b1b20] border-white/10 text-zinc-400 hover:text-white'
                                }`}
                              >
                                {type}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="space-y-2.5 pt-1">
                        {[
                          { key: 'enableEventName', label: 'Enable Event Name' },
                          { key: 'enableEventDescription', label: 'Enable Event Description' },
                        ].map((item) => {
                          const checked = !!selectedNode.settings[item.key];
                          return (
                            <label
                              key={item.key}
                              onClick={() => updateSelectedNodeSetting(item.key, !checked)}
                              className="flex items-center gap-3 cursor-pointer group"
                            >
                              <div
                                className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${
                                  checked
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-[#1e1e24] border border-white/20'
                                }`}
                              >
                                {checked && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                              <span className="text-xs font-medium text-zinc-200 group-hover:text-white">
                                {item.label}
                              </span>
                            </label>
                          );
                        })}
                      </div>

                      <div className="border-t border-white/10" />

                      <div className="space-y-2.5">
                        {[
                          { key: 'enableGalleryButton', label: 'Enable Gallery Button' },
                          { key: 'enableSettingsGear', label: 'Enable Settings Gear Button' },
                          { key: 'enableFullscreenButton', label: 'Enable Fullscreen Button' },
                        ].map((item) => {
                          const checked = !!selectedNode.settings[item.key];
                          return (
                            <label
                              key={item.key}
                              onClick={() => updateSelectedNodeSetting(item.key, !checked)}
                              className="flex items-center gap-3 cursor-pointer group"
                            >
                              <div
                                className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${
                                  checked
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-[#1e1e24] border border-white/20'
                                }`}
                              >
                                {checked && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                              <span className="text-xs font-medium text-zinc-200 group-hover:text-white">
                                {item.label}
                              </span>
                            </label>
                          );
                        })}
                      </div>

                      <div className="border-t border-white/10" />

                      <div>
                        <label
                          onClick={() =>
                            updateSelectedNodeSetting(
                              'enableEffectTransition',
                              !selectedNode.settings.enableEffectTransition
                            )
                          }
                          className="flex items-center gap-3 cursor-pointer group"
                        >
                          <div
                            className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${
                              selectedNode.settings.enableEffectTransition
                                ? 'bg-purple-600 text-white'
                                : 'bg-[#1e1e24] border border-white/20'
                            }`}
                          >
                            {selectedNode.settings.enableEffectTransition && (
                              <Check className="w-3 h-3 stroke-[3]" />
                            )}
                          </div>
                          <span className="text-xs font-medium text-zinc-200 group-hover:text-white">
                            Enable Effect Transition Node (Launch &amp; Concepts)
                          </span>
                        </label>
                      </div>

                      <div className="space-y-2.5 pt-2">
                        <label className="block font-cyber text-[10px] font-bold tracking-wider text-purple-400">
                          LAUNCH SCREEN OUT ANIMATION
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {['SPLIT OUT (DEFAULT)', 'SPLIT 2', 'ZOOM ACTION', 'SPIN 3D'].map(
                            (anim) => {
                              const active = selectedNode.settings.outAnimation === anim;
                              return (
                                <button
                                  key={anim}
                                  type="button"
                                  onClick={() =>
                                    updateSelectedNodeSetting('outAnimation', anim)
                                  }
                                  className={`py-2.5 px-2 rounded-lg text-[10px] font-bold tracking-wider border transition-all cursor-pointer ${
                                    active
                                      ? 'bg-purple-600/20 border-purple-500 text-white'
                                      : 'bg-[#1b1b20] border-white/10 text-zinc-400 hover:text-white'
                                  }`}
                                >
                                  {anim}
                                </button>
                              );
                            }
                          )}
                        </div>
                      </div>

                      <div className="space-y-2 pt-1">
                        <label className="block font-cyber text-[10px] font-bold tracking-wider text-purple-400">
                          BACKGROUND OVERLAY DARKEN
                        </label>
                        <div className="grid grid-cols-6 gap-1.5">
                          {[0, 30, 50, 60, 70, 90].map((pct) => {
                            const active = selectedNode.settings.overlayDarken === pct;
                            return (
                              <button
                                key={pct}
                                type="button"
                                onClick={() =>
                                  updateSelectedNodeSetting('overlayDarken', pct)
                                }
                                className={`py-2 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                                  active
                                    ? 'bg-purple-600/25 border-purple-500 text-white'
                                    : 'bg-[#1b1b20] border-white/10 text-zinc-400 hover:text-white'
                                }`}
                              >
                                {pct}%
                              </button>
                            );
                          })}
                        </div>
                        <p className="text-[10px] text-zinc-500">
                          Controls how dark the background overlay is (0% is fully clear).
                        </p>
                      </div>

                      <div className="space-y-2 pt-1">
                        <label className="block font-cyber text-[10px] font-bold tracking-wider text-zinc-400">
                          STANDARD LAUNCH LAYOUT
                        </label>
                        <div className="space-y-2">
                          {[
                            'USE LAUNCH & GALLERY BUTTON',
                            'USE LAUNCH BUTTON ONLY',
                            'USE CUSTOM TEXT TO START',
                          ].map((layout) => {
                            const active = selectedNode.settings.standardLayout === layout;
                            return (
                              <button
                                key={layout}
                                type="button"
                                onClick={() =>
                                  updateSelectedNodeSetting('standardLayout', layout)
                                }
                                className={`w-full py-3 px-4 rounded-xl text-left text-[11px] font-bold tracking-wider border transition-all cursor-pointer ${
                                  active
                                    ? 'bg-purple-600/20 border-purple-500 text-white'
                                    : 'bg-[#1b1b20] border-white/10 text-zinc-300 hover:border-white/25'
                                }`}
                              >
                                {layout}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-5">
                      <div>
                        <label className="block font-cyber text-[10px] font-bold tracking-wider text-purple-400 mb-2">
                          NODE DISPLAY TITLE
                        </label>
                        <input
                          type="text"
                          value={selectedNode.label}
                          onChange={(e) => {
                            const val = e.target.value;
                            setNodes((prev) =>
                              prev.map((n) =>
                                n.id === selectedNode.id ? { ...n, label: val } : n
                              )
                            );
                          }}
                          className="w-full bg-[#1b1b20] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block font-cyber text-[10px] font-bold tracking-wider text-purple-400 mb-2">
                          STEP CATEGORY BADGE
                        </label>
                        <input
                          type="text"
                          value={selectedNode.subtitle}
                          onChange={(e) => {
                            const val = e.target.value;
                            setNodes((prev) =>
                              prev.map((n) =>
                                n.id === selectedNode.id ? { ...n, subtitle: val } : n
                              )
                            );
                          }}
                          className="w-full bg-[#1b1b20] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block font-cyber text-[10px] font-bold tracking-wider text-purple-400">
                          BACKGROUND OVERLAY DARKEN
                        </label>
                        <div className="grid grid-cols-6 gap-1.5">
                          {[0, 30, 50, 60, 70, 90].map((pct) => {
                            const active = (selectedNode.settings.overlayDarken ?? 50) === pct;
                            return (
                              <button
                                key={pct}
                                type="button"
                                onClick={() =>
                                  updateSelectedNodeSetting('overlayDarken', pct)
                                }
                                className={`py-2 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                                  active
                                    ? 'bg-purple-600/25 border-purple-500 text-white'
                                    : 'bg-[#1b1b20] border-white/10 text-zinc-400 hover:text-white'
                                }`}
                              >
                                {pct}%
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="space-y-3 pt-2 border-t border-white/10">
                        {[
                          { key: 'autoAdvance', label: 'Auto Advance to Next Node' },
                          { key: 'enableSound', label: 'Enable Interactive Sound FX' },
                          { key: 'showProgress', label: 'Show Step Progress Indicator' },
                        ].map((opt) => {
                          const checked = !!selectedNode.settings[opt.key];
                          return (
                            <label
                              key={opt.key}
                              onClick={() => updateSelectedNodeSetting(opt.key, !checked)}
                              className="flex items-center gap-3 cursor-pointer"
                            >
                              <div
                                className={`w-4 h-4 rounded flex items-center justify-center ${
                                  checked
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-[#1e1e24] border border-white/20'
                                }`}
                              >
                                {checked && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                              <span className="text-xs text-zinc-200">{opt.label}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-zinc-500">
                <Sliders className="w-10 h-10 mb-3 text-purple-500/40" />
                <p className="font-cyber text-xs font-bold tracking-wider text-zinc-300">
                  NO NODE SELECTED
                </p>
                <p className="text-xs mt-1.5">
                  Click any node on the canvas to configure its properties, animations, and layout.
                </p>
              </div>
            )}
          </aside>
        </div>
      ) : activeTab === 'CONCEPTS' ? (
        /* ==================== CONCEPTS TAB VIEW ==================== */
        <div className="flex-1 min-h-0 overflow-y-auto p-8 bg-[#121216] canvas-dots">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-cyber text-lg font-bold tracking-wider text-white">
                  AI STYLE CONCEPTS
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Manage AI prompts and presets available in the Concept Selection node.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const newConcept: AiStyleConcept = {
                    id: `c-${Date.now()}`,
                    name: `NEW AI STYLE #${concepts.length + 1}`,
                    prompt: 'Cinematic studio lighting, ultra detailed portrait',
                    active: true,
                  };
                  setConcepts((prev) => [...prev, newConcept]);
                  showToast('New AI concept added!');
                }}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 font-cyber text-xs font-bold tracking-wider flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>ADD CONCEPT</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {concepts.map((c) => (
                <div
                  key={c.id}
                  className="bg-[#18181e] border border-white/10 rounded-2xl p-5 flex items-start justify-between gap-4"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-pink-500" />
                      <span className="font-cyber text-xs font-bold tracking-wider text-white">
                        {c.name}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400">{c.prompt}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setConcepts((prev) =>
                        prev.map((item) =>
                          item.id === c.id ? { ...item, active: !item.active } : item
                        )
                      )
                    }
                    className={`px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider cursor-pointer ${
                      c.active
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {c.active ? 'ACTIVE' : 'DISABLED'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* ==================== GENERAL SETTINGS TAB VIEW ==================== */
        <div className="flex-1 min-h-0 overflow-y-auto p-8 bg-[#121216] canvas-dots">
          <div className="max-w-2xl mx-auto bg-[#18181e] border border-white/10 rounded-2xl p-6 space-y-5">
            <h2 className="font-cyber text-base font-bold tracking-wider text-white border-b border-white/10 pb-4">
              BOOTH HARDWARE &amp; SYSTEM SETTINGS
            </h2>

            <div>
              <label className="block font-cyber text-[10px] font-bold tracking-wider text-purple-400 mb-2">
                BOOTH EVENT TITLE
              </label>
              <input
                type="text"
                value={globalSettings.boothTitle}
                onChange={(e) =>
                  setGlobalSettings({ ...globalSettings, boothTitle: e.target.value })
                }
                className="w-full bg-[#121216] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white"
              />
            </div>

            <div>
              <label className="block font-cyber text-[10px] font-bold tracking-wider text-purple-400 mb-2">
                PRIMARY CAMERA SOURCE
              </label>
              <input
                type="text"
                value={globalSettings.cameraDevice}
                onChange={(e) =>
                  setGlobalSettings({ ...globalSettings, cameraDevice: e.target.value })
                }
                className="w-full bg-[#121216] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white"
              />
            </div>

            <div>
              <label className="block font-cyber text-[10px] font-bold tracking-wider text-purple-400 mb-2">
                THERMAL PRINTER DEVICE
              </label>
              <input
                type="text"
                value={globalSettings.printerName}
                onChange={(e) =>
                  setGlobalSettings({ ...globalSettings, printerName: e.target.value })
                }
                className="w-full bg-[#121216] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION POPUP */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1e1e26] border border-purple-500/50 text-white px-4 py-3 rounded-xl shadow-[0_0_25px_rgba(168,85,247,0.4)] flex items-center gap-2.5 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}