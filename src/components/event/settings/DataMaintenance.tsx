"use client";

import { useState, useEffect, useRef } from "react";
import {
  HardDrive,
  Folder,
  CloudDownload,
  Printer,
  Share2,
  AlertCircle,
  Search,
  X,
  RefreshCw,
  Download,
  Image as ImageIcon,
  Camera,
  Video,
  FileSpreadsheet,
  LayoutGrid,
  List,
  Info,
  Maximize2,
  ExternalLink,
  Copy,
  Trash2,
  AlertTriangle,
  FolderOpen,
  FileText,
  CheckCircle2,
  Settings,
} from "lucide-react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

// Helper untuk membuat SVG Poster/Foto realistis secara dinamis agar tampil tajam
function createMockArt(type: string, title: string, subtitle: string, bg1: string, bg2: string, accent: string) {
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800">
      <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="${bg1}"/>
              <stop offset="100%" stop-color="${bg2}"/>
          </linearGradient>
      </defs>
      <rect width="600" height="800" fill="url(#g)"/>
      <rect x="28" y="28" width="544" height="744" fill="none" stroke="${accent}" stroke-width="3" stroke-opacity="0.6"/>
      ${type === 'koran' ? `
          <rect x="45" y="45" width="510" height="710" fill="#e6dec8"/>
          <text x="300" y="105" font-family="Georgia, serif" font-size="34" font-weight="bold" fill="#1c1917" text-anchor="middle">DE PREANGER BODE</text>
          <line x1="65" y1="122" x2="535" y2="122" stroke="#1c1917" stroke-width="3"/>
          <text x="300" y="148" font-family="sans-serif" font-size="14" font-weight="bold" fill="#44403c" text-anchor="middle">ART DECO ARCHITECTURE: THE PARIS OF JAVA</text>
          <rect x="145" y="175" width="310" height="430" fill="#a8a29e" stroke="#292524" stroke-width="2"/>
          <circle cx="300" cy="310" r="55" fill="#44403c"/>
          <path d="M210 550 Q300 410 390 550 Z" fill="#292524"/>
          <text x="95" y="240" font-family="serif" font-size="12" fill="#292524">COLONIAL</text>
          <text x="95" y="258" font-family="serif" font-size="12" fill="#292524">HERITAGE</text>
          <text x="468" y="240" font-family="serif" font-size="12" fill="#292524">BANDUNG</text>
          <text x="468" y="258" font-family="serif" font-size="12" fill="#292524">1926</text>
          <text x="300" y="675" font-family="Georgia, serif" font-size="22" font-weight="bold" fill="#1c1917" text-anchor="middle">BANDUNG: THE PARIS OF JAVA</text>
      ` : type === 'magazine' ? `
          <rect x="35" y="35" width="530" height="730" fill="#facc15"/>
          <text x="65" y="115" font-family="Impact, sans-serif" font-size="68" fill="#dc2626">HALLO</text>
          <text x="65" y="178" font-family="Impact, sans-serif" font-size="68" fill="#dc2626">BRAGA</text>
          <circle cx="320" cy="400" r="115" fill="#78350f"/>
          <path d="M170 720 Q320 510 470 720 Z" fill="#1d4ed8"/>
          <rect x="55" y="540" width="230" height="110" fill="#111827" opacity="0.88"/>
          <text x="70" y="575" font-family="sans-serif" font-size="18" font-weight="bold" fill="#facc15">BANDUNG</text>
          <text x="70" y="602" font-family="sans-serif" font-size="16" font-weight="bold" fill="#ffffff">LAUTAN GAGASAN</text>
          <text x="70" y="628" font-family="sans-serif" font-size="14" fill="#93c5fd">EDISI SPESIAL 2026</text>
      ` : type === 'ronaldo' ? `
          <circle cx="300" cy="360" r="180" fill="#f59e0b" opacity="0.22"/>
          <circle cx="300" cy="270" r="62" fill="#d6d3d1"/>
          <path d="M180 650 Q300 420 420 650 Z" fill="#18181b" stroke="#f59e0b" stroke-width="3"/>
          <text x="300" y="545" font-family="Impact, sans-serif" font-size="92" fill="#fbbf24" text-anchor="middle">7</text>
          <text x="300" y="720" font-family="sans-serif" font-size="22" font-weight="bold" fill="#fef3c7" letter-spacing="4" text-anchor="middle">CR7 LEGEND EDITION</text>
      ` : `
          <circle cx="300" cy="290" r="78" fill="#e2e8f0" opacity="0.9"/>
          <path d="M165 680 Q300 430 435 680 Z" fill="#1e293b" stroke="${accent}" stroke-width="3"/>
          <text x="300" y="100" font-family="sans-serif" font-size="22" font-weight="bold" fill="${accent}" letter-spacing="3" text-anchor="middle">${title}</text>
          <text x="300" y="735" font-family="monospace" font-size="16" fill="#cbd5e1" text-anchor="middle">${subtitle}</text>
      `}
  </svg>`;
  return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
}

const INITIAL_FILES = [
  {
    id: 'f1',
    name: 'JALANAN_photo_session_1790910023112.jpg',
    type: 'photo',
    concept: 'SCHOOL PHOTOBOOK',
    date: '9/29/2026',
    time: '02:15 PM',
    size: '~2.1 MB',
    sessionId: 'session_1790910023112',
    guestName: 'Hendra Wijaya',
    guestContact: '+62 812-2091-8831',
    guestEmail: 'hendra.w@school.id',
    image: createMockArt('portrait', 'SCHOOL PHOTOBOOK', 'CLASS OF 2026 • PORTRAIT', '#1e3a5f', '#0f172a', '#60a5fa')
  },
  {
    id: 'f2',
    name: 'JALANAN_original_session_1790910023112.jpg',
    type: 'original',
    concept: 'SCHOOL PHOTOBOOK',
    date: '9/29/2026',
    time: '02:14 PM',
    size: '~1.4 MB',
    sessionId: 'session_1790910023112',
    guestName: 'Hendra Wijaya',
    guestContact: '+62 812-2091-8831',
    guestEmail: 'hendra.w@school.id',
    image: createMockArt('portrait', 'RAW CAMERA CAPTURE', 'ORIGINAL SENSOR INPUT', '#27272a', '#18181b', '#a1a1aa')
  },
  {
    id: 'f3',
    name: 'JALANAN_photo_session_session_1790442376365.jpg',
    type: 'photo',
    concept: 'KORAN JADUL',
    date: '9/27/2026',
    time: '12:06 AM',
    size: '~1.8 MB',
    sessionId: 'session_1790442376365',
    guestName: 'Raden Suryana',
    guestContact: '+62 811-2234-990',
    guestEmail: 'suryana.bdg@gmail.com',
    image: createMockArt('koran', 'DE PREANGER BODE', 'KORAN JADUL', '#78716c', '#292524', '#d6d3d1')
  },
  {
    id: 'f4',
    name: 'JALANAN_original_session_1790442376365.jpg',
    type: 'original',
    concept: 'KORAN JADUL',
    date: '9/27/2026',
    time: '12:05 AM',
    size: '~1.3 MB',
    sessionId: 'session_1790442376365',
    guestName: 'Raden Suryana',
    guestContact: '+62 811-2234-990',
    guestEmail: 'suryana.bdg@gmail.com',
    image: createMockArt('portrait', 'RAW CAMERA CAPTURE', 'SESSION 1790442376365', '#3f3f46', '#18181b', '#d4d4d8')
  },
  {
    id: 'f5',
    name: 'JALANAN_photo_session_1790398112044.jpg',
    type: 'photo',
    concept: 'KORAN JADUL',
    date: '9/26/2026',
    time: '09:42 PM',
    size: '~1.9 MB',
    sessionId: 'session_1790398112044',
    guestName: 'Asep Kurniawan',
    guestContact: '+62 857-9910-4412',
    guestEmail: 'asep.kurnia@yahoo.com',
    image: createMockArt('koran', 'DE PREANGER BODE', 'BANDUNG HERITAGE', '#57534e', '#1c1917', '#e7e5e4')
  },
  {
    id: 'f6',
    name: 'JALANAN_original_session_1790398112044.jpg',
    type: 'original',
    concept: 'KORAN JADUL',
    date: '9/26/2026',
    time: '09:41 PM',
    size: '~1.2 MB',
    sessionId: 'session_1790398112044',
    guestName: 'Asep Kurniawan',
    guestContact: '+62 857-9910-4412',
    guestEmail: 'asep.kurnia@yahoo.com',
    image: createMockArt('portrait', 'RAW CAMERA CAPTURE', 'SESSION 1790398112044', '#334155', '#0f172a', '#94a3b8')
  },
  {
    id: 'f7',
    name: 'JALANAN_photo_session_1790385501928.jpg',
    type: 'photo',
    concept: 'NEW CONCEPT',
    date: '9/26/2026',
    time: '08:18 PM',
    size: '~2.2 MB',
    sessionId: 'session_1790385501928',
    guestName: 'Dedi Mulyana',
    guestContact: '+62 813-8821-0091',
    guestEmail: 'dedi.braga@gmail.com',
    image: createMockArt('magazine', 'HALLO BRAGA', 'NEW CONCEPT', '#ca8a04', '#713f12', '#fef08a')
  },
  {
    id: 'f8',
    name: 'JALANAN_original_session_1790385501928.jpg',
    type: 'original',
    concept: 'NEW CONCEPT',
    date: '9/26/2026',
    time: '08:17 PM',
    size: '~1.5 MB',
    sessionId: 'session_1790385501928',
    guestName: 'Dedi Mulyana',
    guestContact: '+62 813-8821-0091',
    guestEmail: 'dedi.braga@gmail.com',
    image: createMockArt('portrait', 'RAW CAMERA CAPTURE', 'SESSION 1790385501928', '#3f3f46', '#18181b', '#e4e4e7')
  },
  {
    id: 'f9',
    name: 'JALANAN_photo_session_1790371190482.jpg',
    type: 'photo',
    concept: 'RONALDO',
    date: '9/26/2026',
    time: '07:05 PM',
    size: '~2.0 MB',
    sessionId: 'session_1790371190482',
    guestName: 'Ilham Pratama',
    guestContact: '+62 821-1567-3320',
    guestEmail: 'ilham.cr7@gmail.com',
    image: createMockArt('ronaldo', 'CR7 GOLDEN AURA', 'RONALDO', '#451a03', '#09090b', '#f59e0b')
  },
  {
    id: 'f10',
    name: 'JALANAN_original_session_1790371190482.jpg',
    type: 'original',
    concept: 'RONALDO',
    date: '9/26/2026',
    time: '07:04 PM',
    size: '~1.4 MB',
    sessionId: 'session_1790371190482',
    guestName: 'Ilham Pratama',
    guestContact: '+62 821-1567-3320',
    guestEmail: 'ilham.cr7@gmail.com',
    image: createMockArt('portrait', 'RAW CAMERA CAPTURE', 'SESSION 1790371190482', '#292524', '#0c0a09', '#a8a29e')
  },
  {
    id: 'f11',
    name: 'JALANAN_photo_session_1790364409123.jpg',
    type: 'photo',
    concept: 'SCHOOL PHOTOBOOK',
    date: '9/26/2026',
    time: '06:30 PM',
    size: '~1.7 MB',
    sessionId: 'session_1790364409123',
    guestName: 'Nadia Putri',
    guestContact: '+62 878-4412-9087',
    guestEmail: 'nadia.putri@outlook.com',
    image: createMockArt('portrait', 'SCHOOL PHOTOBOOK', 'ALUMNI YEARBOOK', '#1e1b4b', '#09090b', '#818cf8')
  },
  {
    id: 'f12',
    name: 'JALANAN_original_session_1790364409123.jpg',
    type: 'original',
    concept: 'SCHOOL PHOTOBOOK',
    date: '9/26/2026',
    time: '06:29 PM',
    size: '~1.3 MB',
    sessionId: 'session_1790364409123',
    guestName: 'Nadia Putri',
    guestContact: '+62 878-4412-9087',
    guestEmail: 'nadia.putri@outlook.com',
    image: createMockArt('portrait', 'RAW CAMERA CAPTURE', 'SESSION 1790364409123', '#1f2937', '#111827', '#9ca3af')
  },
  {
    id: 'f13',
    name: 'JALANAN_photo_session_1790351120987.jpg',
    type: 'photo',
    concept: 'KORAN JADUL',
    date: '9/26/2026',
    time: '05:12 PM',
    size: '~1.8 MB',
    sessionId: 'session_1790351120987',
    guestName: 'Bambang Hermawan',
    guestContact: '+62 812-9001-2231',
    guestEmail: 'bambang.h@gmail.com',
    image: createMockArt('koran', 'DE PREANGER BODE', 'EDISI SORE', '#57534e', '#1c1917', '#d6d3d1')
  },
  {
    id: 'f14',
    name: 'JALANAN_original_session_1790351120987.jpg',
    type: 'original',
    concept: 'KORAN JADUL',
    date: '9/26/2026',
    time: '05:11 PM',
    size: '~1.2 MB',
    sessionId: 'session_1790351120987',
    guestName: 'Bambang Hermawan',
    guestContact: '+62 812-9001-2231',
    guestEmail: 'bambang.h@gmail.com',
    image: createMockArt('portrait', 'RAW CAMERA CAPTURE', 'SESSION 1790351120987', '#27272a', '#09090b', '#a1a1aa')
  },
  {
    id: 'f15',
    name: 'JALANAN_photo_session_1790340098121.jpg',
    type: 'photo',
    concept: 'NEW CONCEPT',
    date: '9/26/2026',
    time: '04:05 PM',
    size: '~2.1 MB',
    sessionId: 'session_1790340098121',
    guestName: 'Tari Lestari',
    guestContact: '+62 856-7712-1109',
    guestEmail: 'tari.lestari@gmail.com',
    image: createMockArt('magazine', 'HALLO BRAGA', 'COVER STAR', '#b45309', '#451a03', '#fde047')
  },
  {
    id: 'f16',
    name: 'JALANAN_original_session_1790340098121.jpg',
    type: 'original',
    concept: 'NEW CONCEPT',
    date: '9/26/2026',
    time: '04:04 PM',
    size: '~1.4 MB',
    sessionId: 'session_1790340098121',
    guestName: 'Tari Lestari',
    guestContact: '+62 856-7712-1109',
    guestEmail: 'tari.lestari@gmail.com',
    image: createMockArt('portrait', 'RAW CAMERA CAPTURE', 'SESSION 1790340098121', '#334155', '#0f172a', '#cbd5e1')
  }
];

export default function DataMaintenance() {
  const [files, setFiles] = useState(INITIAL_FILES);
  const [selectedFileId, setSelectedFileId] = useState<string>('f3');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [conceptFilter, setConceptFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [inspectorOpen, setInspectorOpen] = useState<boolean>(true);

  // Modals state
  const [isDataModalOpen, setIsDataModalOpen] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [previewFile, setPreviewFile] = useState<any | null>(null);

  // Confirm modal state
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    actionText: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    actionText: '',
    onConfirm: () => { }
  });

  const [toasts, setToasts] = useState<Array<{ id: number; message: string; type: 'success' | 'error' | 'info' }>>([]);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [printImageSrc, setPrintImageSrc] = useState<string>('');

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3200);
  };

  const currentFile = files.find(f => f.id === selectedFileId) || files[0];

  const filteredFiles = files.filter(f => {
    if (categoryFilter === 'photo' && f.type !== 'photo') return false;
    if (categoryFilter === 'original' && f.type !== 'original') return false;
    if (categoryFilter === 'video' && f.type !== 'video') return false;

    if (conceptFilter !== 'ALL' && f.concept !== conceptFilter) return false;

    if (searchQuery) {
      const hay = `${f.name} ${f.concept} ${f.sessionId} ${f.guestName} ${f.guestContact} ${f.guestEmail}`.toLowerCase();
      if (!hay.includes(searchQuery.toLowerCase())) return false;
    }
    return true;
  });

  const totalFiles = files.length;
  const photoCount = files.filter(f => f.type === 'photo').length;
  const origCount = files.filter(f => f.type === 'original').length;
  const videoCount = files.filter(f => f.type === 'video').length;
  const estMB = (totalFiles * 1.54).toFixed(1);

  const handleDownloadSingle = (file: any) => {
    const img = new window.Image();
    img.onload = function () {
      const canvas = document.createElement('canvas');
      canvas.width = 600;
      canvas.height = 800;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(function (blob) {
          if (blob) {
            saveAs(blob, file.name);
            showToast(`Downloaded: ${file.name}`, 'success');
          }
        }, 'image/jpeg', 0.92);
      }
    };
    img.src = file.image;
  };

  const handlePrintSingle = (file: any) => {
    setPrintImageSrc(file.image);
    showToast(`Preparing borderless print for ${file.name}...`, 'info');
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const handleBulkDownload = async () => {
    if (files.length === 0) {
      showToast('No files available to download.', 'error');
      return;
    }
    showToast(`Generating ZIP archive for ${files.length} files...`, 'info');

    try {
      const zip = new JSZip();
      const photoFolder = zip.folder('JALANAN_Photos');
      const origFolder = zip.folder('JALANAN_Original_Captures');

      let csvContent = 'File Name,Type,Concept,Guest Name,Phone,Email,Session ID,Date,Time\n';
      files.forEach(f => {
        csvContent += `"${f.name}","${f.type}","${f.concept}","${f.guestName}","${f.guestContact}","${f.guestEmail}","${f.sessionId}","${f.date}","${f.time}"\n`;
      });
      zip.file('Guest_Leads_Report.csv', csvContent);

      const promises = files.map(file => {
        return new Promise<void>((resolve) => {
          const img = new window.Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 600;
            canvas.height = 800;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0);
              canvas.toBlob(blob => {
                if (blob) {
                  if (file.type === 'photo') {
                    photoFolder?.file(file.name, blob);
                  } else {
                    origFolder?.file(file.name, blob);
                  }
                }
                resolve();
              }, 'image/jpeg', 0.85);
            } else {
              resolve();
            }
          };
          img.src = file.image;
        });
      });

      await Promise.all(promises);
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, 'JALANAN_Event_Files_2026.zip');
      showToast('Bulk ZIP download completed!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to generate ZIP file.', 'error');
    }
  };

  const exportLeadsCSV = () => {
    let csvContent = 'Guest Name,Phone,Email,Selected Concept,Session ID,File Name,Date,Time\n';
    files.forEach(f => {
      csvContent += `"${f.guestName}","${f.guestContact}","${f.guestEmail}","${f.concept}","${f.sessionId}","${f.name}","${f.date}","${f.time}"\n`;
    });
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'JALANAN_Guest_Form_Leads.csv');
    showToast('Guest Form Data exported as CSV!', 'success');
  };

  const confirmDeleteSingle = (file: any) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Delete File Permanently?',
      message: `Are you sure you want to delete "${file.name}"? This file will be removed from cloud storage.`,
      actionText: 'Delete File',
      onConfirm: () => {
        setFiles(prev => prev.filter(f => f.id !== file.id));
        if (selectedFileId === file.id) {
          const remaining = files.filter(f => f.id !== file.id);
          setSelectedFileId(remaining[0]?.id || '');
        }
        setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        showToast(`Deleted ${file.name}`, 'success');
      }
    });
  };

  const openClearConfirmModal = () => {
    setConfirmConfig({
      isOpen: true,
      title: 'CLEAR ALL EVENT DATA?',
      message: 'WARNING: This will permanently delete ALL photos, original captures, and guest session leads from the database and cloud storage.',
      actionText: 'Yes, Clear Everything',
      onConfirm: () => {
        setFiles([]);
        setSelectedFileId('');
        setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        showToast('All event gallery data has been permanently cleared.', 'error');
      }
    });
  };

  const restoreDemoData = () => {
    setFiles(INITIAL_FILES);
    setSelectedFileId('f3');
    showToast('16 Demo event files restored!', 'success');
  };

  return (
    <div className="space-y-6 pb-4 font-sans text-gray-200">
      <div className="w-full">
        {/* Header Section */}
        <div>
          <button
            onClick={() => { setCategoryFilter('all'); setIsDataModalOpen(true); }}
            className="px-3.5 py-1.5 bg-[#1e1e26] hover:bg-[#2a2a35] text-gray-300 text-xs flex items-center gap-2 font-semibold tracking-wider uppercase rounded-lg border border-[#2f2f3d] transition-all cursor-pointer"
          >
            <Settings className="w-4 h-4" />
            FILE MANAGER
          </button>
        </div>

        {/* Card 1: Data Management & Storage */}
        <div className="mt-5 p-6 border border-[#2a1f2b]/40 rounded-2xl">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#221c2e] border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 mt-1">
              <HardDrive className="w-6 h-6" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2.5 mb-2">
                <span className="px-2.5 py-0.5 bg-[#252530] text-gray-300 text-[11px] font-bold tracking-wider uppercase rounded-md">
                  CLOUD STORAGE
                </span>
                <span className="text-xs text-gray-400 font-medium">Direct Shareable</span>
              </div>
              <h2 className="font-display text-base sm:text-lg font-bold text-white tracking-wide uppercase mb-2">
                DATA MANAGEMENT &amp; STORAGE
              </h2>
              <p className="text-sm text-gray-400 leading-relaxed">
                Manage all photo results, raw camera captures, rendered videos, and guest lead entries in a clean file manager. Share access with clients or event organizers via direct link.
              </p>
            </div>
          </div>

          {/* 3 Mini Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
            <button
              onClick={() => { setCategoryFilter('all'); setIsDataModalOpen(true); }}
              className="flex items-center gap-3 p-3.5 bg-[#121217] hover:bg-[#1c1c24] border border-[#24242f] hover:border-blue-500/40 rounded-xl text-left transition-all group cursor-pointer"
            >
              <div className="text-blue-400 group-hover:scale-110 transition-transform">
                <Folder className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-gray-200 truncate">Folder Explorer</div>
                <div className="text-[11px] text-gray-500 truncate">Photos, Videos, Leads</div>
              </div>
            </button>

            <button
              onClick={handleBulkDownload}
              className="flex items-center gap-3 p-3.5 bg-[#121217] hover:bg-[#1c1c24] border border-[#24242f] hover:border-purple-500/40 rounded-xl text-left transition-all group cursor-pointer"
            >
              <div className="text-purple-400 group-hover:scale-110 transition-transform">
                <CloudDownload className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-gray-200 truncate">Bulk ZIP Download</div>
                <div className="text-[11px] text-gray-500 truncate">Auto-formatted archive</div>
              </div>
            </button>

            <button
              onClick={() => { setCategoryFilter('photo'); setIsDataModalOpen(true); showToast('Select any photo and click Print', 'info'); }}
              className="flex items-center gap-3 p-3.5 bg-[#121217] hover:bg-[#1c1c24] border border-[#24242f] hover:border-emerald-500/40 rounded-xl text-left transition-all group cursor-pointer"
            >
              <div className="text-emerald-400 group-hover:scale-110 transition-transform">
                <Printer className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-gray-200 truncate">Instant Print</div>
                <div className="text-[11px] text-gray-500 truncate">Borderless photo print</div>
              </div>
            </button>
          </div>

          {/* Primary Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-6">
            <button
              onClick={() => { setCategoryFilter('all'); setIsDataModalOpen(true); }}
              className="flex items-center justify-center gap-2.5 py-3.5 px-5 bg-white hover:bg-gray-100 active:scale-[0.99] text-black font-bold text-xs tracking-wider uppercase rounded-xl shadow-lg transition-all cursor-pointer"
            >
              <HardDrive className="w-4 h-4" />
              <span>OPEN DATA MANAGEMENT</span>
            </button>

            <button
              onClick={() => setIsShareModalOpen(true)}
              className="flex items-center justify-center gap-2.5 py-3.5 px-5 bg-[#202028] hover:bg-[#2a2a35] active:scale-[0.99] text-gray-200 border border-[#32323e] font-bold text-xs tracking-wider uppercase rounded-xl transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-purple-400" />
              <span>SHARE DRIVE ACCESS</span>
            </button>
          </div>
        </div>

        {/* Card 2: Danger Zone */}
        <div className="mt-6 bg-[#1c1316]/80 border border-red-900/40 rounded-2xl p-5 sm:p-6">
          <h3 className="font-display text-sm sm:text-base font-bold text-red-400 tracking-wider uppercase mb-2">
            CLEAR EVENT GALLERY (DANGER ZONE)
          </h3>
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed mb-5">
            This action will permanently delete all photos and sessions associated with this event from both the database and cloud storage. Guests will no longer be able to view or download their files.
          </p>
          <button
            onClick={openClearConfirmModal}
            className="w-full py-3.5 px-5 bg-[#451a1d] hover:bg-[#5c2226] active:scale-[0.99] border border-red-500/40 text-red-100 font-bold text-xs tracking-wider uppercase rounded-xl flex items-center justify-center gap-2.5 transition-all cursor-pointer"
          >
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span>CLEAR ALL DATA</span>
          </button>
        </div>

        {/* Status Footer */}
        <div className="mt-5 flex items-center justify-between text-[11px] text-gray-500 px-1">
          <span>Active Event: JALANAN • {totalFiles} Files Stored (~{estMB} MB)</span>
          {totalFiles === 0 && (
            <button onClick={restoreDemoData} className="text-purple-400 hover:underline cursor-pointer">
              Restore Demo Data
            </button>
          )}
        </div>
      </div>

      {isDataModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-0 sm:p-4 md:p-6">
          <div className="w-full h-full max-w-[1440px] bg-[#111115] sm:border sm:border-[#282834] sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden">

            {/* TOP BAR */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3.5 bg-[#15151b] border-b border-[#24242e]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#20202a] border border-[#2f2f3d] flex items-center justify-center text-gray-300">
                  <HardDrive className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-sm sm:text-base text-white tracking-wide">JALANAN Files</span>
                    <span className="px-2 py-0.5 bg-[#23232e] text-gray-300 text-[11px] font-semibold rounded-md">{totalFiles} Files</span>
                  </div>
                  <div className="text-[11px] text-gray-400">
                    Storage &gt; JALANAN &gt; {categoryFilter.toUpperCase()}
                  </div>
                </div>
              </div>

              {/* Search Bar */}
              <div className="order-3 lg:order-2 w-full lg:w-96 xl:w-[440px] relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search files, guest leads, concepts, session ID..."
                  className="w-full bg-[#1b1b22] border border-[#2b2b36] focus:border-purple-500 rounded-xl pl-10 pr-8 py-2 text-xs text-gray-200 placeholder-gray-500 outline-none transition-colors"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Right Controls */}
              <div className="order-2 lg:order-3 flex items-center gap-2">
                <button
                  onClick={() => setIsShareModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-[#1e1e26] hover:bg-[#282833] border border-[#2f2f3c] rounded-xl text-xs font-medium text-gray-200 transition-colors cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-purple-400" />
                  <span className="hidden sm:inline">Share Link</span>
                </button>

                <button
                  onClick={() => {
                    setIsRefreshing(true);
                    setTimeout(() => setIsRefreshing(false), 600);
                  }}
                  title="Refresh Data"
                  className="p-2 bg-[#1e1e26] hover:bg-[#282833] border border-[#2f2f3c] rounded-xl text-gray-300 hover:text-white transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                </button>

                <button
                  onClick={handleBulkDownload}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-gray-200 text-black font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>DOWNLOAD ALL (ZIP)</span>
                </button>

                <button
                  onClick={() => setIsDataModalOpen(false)}
                  title="Close"
                  className="p-2 text-gray-400 hover:text-white hover:bg-[#24242e] rounded-xl transition-colors ml-1 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* FILTER TABS & VIEW CONTROLS BAR */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3 bg-[#131318] border-b border-[#22222b]">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                <button
                  onClick={() => setCategoryFilter('all')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer whitespace-nowrap ${categoryFilter === 'all' ? 'bg-[#272732] text-white border-[#3e3e4e]' : 'bg-[#18181f] text-gray-400 border-[#252530]'}`}
                >
                  <Folder className="w-3.5 h-3.5" />
                  <span>All Files</span>
                  <span className="px-1.5 py-0.2 bg-white/15 rounded text-[10px]">{totalFiles}</span>
                </button>

                <button
                  onClick={() => setCategoryFilter('photo')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer whitespace-nowrap ${categoryFilter === 'photo' ? 'bg-[#272732] text-white border-[#3e3e4e]' : 'bg-[#18181f] text-gray-400 border-[#252530]'}`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Photos</span>
                  <span className="px-1.5 py-0.2 bg-white/10 rounded text-[10px]">{photoCount}</span>
                </button>

                <button
                  onClick={() => setCategoryFilter('original')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer whitespace-nowrap ${categoryFilter === 'original' ? 'bg-[#272732] text-white border-[#3e3e4e]' : 'bg-[#18181f] text-gray-400 border-[#252530]'}`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Original Captures</span>
                  <span className="px-1.5 py-0.2 bg-white/10 rounded text-[10px]">{origCount}</span>
                </button>

                <button
                  onClick={() => setCategoryFilter('video')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer whitespace-nowrap ${categoryFilter === 'video' ? 'bg-[#272732] text-white border-[#3e3e4e]' : 'bg-[#18181f] text-gray-400 border-[#252530]'}`}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Videos</span>
                  <span className="px-1.5 py-0.2 bg-white/10 rounded text-[10px]">{videoCount}</span>
                </button>

                <button
                  onClick={() => setCategoryFilter('leads')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer whitespace-nowrap ${categoryFilter === 'leads' ? 'bg-[#272732] text-white border-[#3e3e4e]' : 'bg-[#18181f] text-gray-400 border-[#252530]'}`}
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Guest Form Data</span>
                  <span className="px-1.5 py-0.2 bg-white/10 rounded text-[10px]">{totalFiles}</span>
                </button>
              </div>

              <div className="flex items-center gap-2.5 ml-auto">
                <select
                  value={conceptFilter}
                  onChange={(e) => setConceptFilter(e.target.value)}
                  className="bg-[#1b1b22] border border-[#2c2c38] text-gray-200 text-xs rounded-lg px-3 py-1.5 outline-none focus:border-purple-500 cursor-pointer"
                >
                  <option value="ALL">All Concepts</option>
                  <option value="SCHOOL PHOTOBOOK">SCHOOL PHOTOBOOK</option>
                  <option value="KORAN JADUL">KORAN JADUL</option>
                  <option value="NEW CONCEPT">NEW CONCEPT</option>
                  <option value="RONALDO">RONALDO</option>
                </select>

                <div className="flex items-center bg-[#1b1b22] border border-[#2c2c38] rounded-lg p-0.5">
                  <button
                    onClick={() => setViewMode('grid')}
                    title="Grid View"
                    className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-[#2d2d3a] text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    title="List View"
                    className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === 'list' ? 'bg-[#2d2d3a] text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => setInspectorOpen(!inspectorOpen)}
                  title="Toggle File Details Panel"
                  className={`p-1.5 border rounded-lg transition-colors cursor-pointer ${inspectorOpen ? 'bg-[#2d2d3a] border-[#3a3a4a] text-white' : 'bg-[#1b1b22] border-[#2c2c38] text-gray-400'}`}
                >
                  <Info className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* MAIN WORKSPACE */}
            <div className="flex-1 flex overflow-hidden relative">
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                {categoryFilter === 'leads' ? (
                  // LEADS TABLE
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 bg-[#181820] border border-[#282834] p-4 rounded-xl">
                      <div>
                        <h3 className="text-sm font-bold text-white">Guest Form Data &amp; Leads ({filteredFiles.length} Entries)</h3>
                        <p className="text-xs text-gray-400">Data formulir tamu yang terdaftar pada sesi pemotretan event JALANAN.</p>
                      </div>
                      <button onClick={exportLeadsCSV} className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer">
                        <FileSpreadsheet className="w-4 h-4" />
                        <span>EXPORT CSV</span>
                      </button>
                    </div>

                    <div className="bg-[#16161d] border border-[#262632] rounded-xl overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-[#262632] text-[11px] font-bold uppercase tracking-wider text-gray-400 bg-[#1a1a22]">
                              <th className="py-3 px-4">Guest Name</th>
                              <th className="py-3 px-3">WhatsApp / Phone</th>
                              <th className="py-3 px-3">Email</th>
                              <th className="py-3 px-3">Selected Concept</th>
                              <th className="py-3 px-3">Session ID</th>
                              <th className="py-3 px-4 text-right">File</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#22222c] text-xs">
                            {filteredFiles.map(f => (
                              <tr
                                key={f.id}
                                onClick={() => setSelectedFileId(f.id)}
                                className={`hover:bg-[#1e1e28] cursor-pointer ${f.id === selectedFileId ? 'bg-purple-500/15' : ''}`}
                              >
                                <td className="py-3 px-4 font-semibold text-white">{f.guestName}</td>
                                <td className="py-3 px-3 text-gray-300 font-mono">{f.guestContact}</td>
                                <td className="py-3 px-3 text-gray-400">{f.guestEmail}</td>
                                <td className="py-3 px-3"><span className="px-2 py-0.5 bg-[#252532] rounded text-[11px] font-semibold text-purple-300">{f.concept}</span></td>
                                <td className="py-3 px-3 font-mono text-[11px] text-gray-400">{f.sessionId}</td>
                                <td className="py-3 px-4 text-right">
                                  <button onClick={(e) => { e.stopPropagation(); setPreviewFile(f); }} className="text-xs text-purple-400 hover:underline font-medium cursor-pointer">View Photo</button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ) : filteredFiles.length === 0 ? (
                  // EMPTY STATE
                  <div className="h-full min-h-[320px] flex flex-col items-center justify-center text-center p-8 border border-dashed border-[#2a2a36] rounded-2xl bg-[#14141a]/50">
                    <div className="w-12 h-12 rounded-xl bg-[#1f1f29] text-gray-400 flex items-center justify-center mb-3">
                      <FolderOpen className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-bold text-gray-200 mb-1">No Files Found</h4>
                    <p className="text-xs text-gray-500 max-w-xs mb-4">
                      {categoryFilter === 'video' ? 'No rendered videos have been recorded in this event session yet.' : 'No matching files found for your current filter or search query.'}
                    </p>
                    {files.length === 0 ? (
                      <button onClick={restoreDemoData} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl cursor-pointer">
                        Restore 16 Demo Files
                      </button>
                    ) : (
                      <button onClick={() => { setCategoryFilter('all'); setConceptFilter('ALL'); setSearchQuery(''); }} className="px-4 py-2 bg-[#252532] hover:bg-[#303040] text-gray-200 text-xs font-semibold rounded-xl cursor-pointer">
                        Reset Filters
                      </button>
                    )}
                  </div>
                ) : viewMode === 'list' ? (
                  // LIST VIEW
                  <div className="bg-[#16161d] border border-[#262632] rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-[#262632] text-[11px] font-bold uppercase tracking-wider text-gray-400 bg-[#1a1a22]">
                            <th className="py-3 px-4">Preview &amp; File Name</th>
                            <th className="py-3 px-3">Type</th>
                            <th className="py-3 px-3">Concept</th>
                            <th className="py-3 px-3">Date</th>
                            <th className="py-3 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#22222c] text-xs">
                          {filteredFiles.map(file => {
                            const isSelected = file.id === selectedFileId;
                            return (
                              <tr
                                key={file.id}
                                onClick={() => setSelectedFileId(file.id)}
                                className={`cursor-pointer transition-colors ${isSelected ? 'bg-purple-500/15' : 'hover:bg-[#1e1e27]'}`}
                              >
                                <td className="py-2.5 px-4">
                                  <div className="flex items-center gap-3">
                                    <img src={file.image} alt={file.name} className="w-10 h-12 object-cover rounded-md border border-[#30303d] shrink-0" />
                                    <div className="min-w-0">
                                      <div className="font-medium text-gray-200 truncate max-w-[220px] sm:max-w-[300px]">{file.name}</div>
                                      <div className="text-[11px] text-gray-500">{file.size} • {file.guestName}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-2.5 px-3">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${file.type === 'photo' ? 'bg-blue-500/20 text-blue-300' : 'bg-gray-700/60 text-gray-300'}`}>
                                    {file.type}
                                  </span>
                                </td>
                                <td className="py-2.5 px-3 text-gray-300 font-medium">{file.concept}</td>
                                <td className="py-2.5 px-3 text-gray-400">{file.date}</td>
                                <td className="py-2.5 px-4 text-right">
                                  <div className="inline-flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                                    <button onClick={() => setPreviewFile(file)} title="View" className="p-1.5 text-gray-400 hover:text-white hover:bg-[#2a2a36] rounded-lg cursor-pointer"><EyeIcon className="w-3.5 h-3.5" /></button>
                                    <button onClick={() => handleDownloadSingle(file)} title="Download" className="p-1.5 text-gray-400 hover:text-white hover:bg-[#2a2a36] rounded-lg cursor-pointer"><Download className="w-3.5 h-3.5" /></button>
                                    <button onClick={() => handlePrintSingle(file)} title="Print" className="p-1.5 text-gray-400 hover:text-white hover:bg-[#2a2a36] rounded-lg cursor-pointer"><Printer className="w-3.5 h-3.5" /></button>
                                    <button onClick={() => confirmDeleteSingle(file)} title="Delete" className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  // GRID VIEW
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3.5">
                    {filteredFiles.map(file => {
                      const isSelected = file.id === selectedFileId;
                      return (
                        <div
                          key={file.id}
                          onClick={() => setSelectedFileId(file.id)}
                          className={`group bg-[#181820] rounded-xl overflow-hidden border transition-all cursor-pointer flex flex-col ${isSelected ? 'border-white ring-2 ring-white/25 shadow-lg shadow-black/50' : 'border-[#262632] hover:border-[#3e3e50]'}`}
                        >
                          <div className="relative aspect-[3/4] bg-[#0f0f13] overflow-hidden">
                            <img src={file.image} alt={file.name} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300" />
                            <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 backdrop-blur-md border border-white/15 rounded text-[9px] font-bold tracking-wider uppercase text-white">
                              {file.type}
                            </span>
                          </div>

                          <div className="p-2.5 flex-1 flex flex-col justify-between bg-[#17171e]">
                            <div>
                              <div className="text-[11px] font-semibold text-gray-200 truncate" title={file.name}>
                                {file.name}
                              </div>
                              <div className="flex items-center justify-between text-[10px] text-gray-400 mt-1">
                                <span className="truncate uppercase font-medium text-gray-400">{file.concept}</span>
                                <span className="shrink-0 ml-1 text-gray-500">{file.date}</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-end gap-2.5 pt-2.5 mt-2 border-t border-[#24242f]" onClick={(e) => e.stopPropagation()}>
                              <button onClick={() => setPreviewFile(file)} title="View Photo" className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                                <EyeIcon className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => handleDownloadSingle(file)} title="Download File" className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                                <Download className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => handlePrintSingle(file)} title="Print Photo" className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                                <Printer className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => confirmDeleteSingle(file)} title="Delete File" className="text-gray-400 hover:text-red-400 transition-colors cursor-pointer">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* RIGHT INSPECTOR SIDEBAR */}
              {inspectorOpen && currentFile && (
                <div className="w-full sm:w-[340px] lg:w-[370px] bg-[#15151b] border-l border-[#24242e] flex flex-col shrink-0 overflow-y-auto absolute sm:static inset-0 z-20">
                  <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#24242e]">
                    <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-gray-300">
                      <Info className="w-4 h-4 text-gray-400" />
                      <span>FILE DETAILS</span>
                    </div>
                    <button onClick={() => setInspectorOpen(false)} className="text-gray-400 hover:text-white p-1 rounded-lg cursor-pointer">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between gap-5">
                    <div className="space-y-4">
                      <div className="w-full aspect-[4/3] bg-[#0b0b0e] border border-[#252530] rounded-xl overflow-hidden flex items-center justify-center p-2 cursor-pointer group relative" onClick={() => setPreviewFile(currentFile)}>
                        <img src={currentFile.image} alt={currentFile.name} className="h-full w-auto object-contain rounded shadow" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="px-3 py-1.5 bg-black/80 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5">
                            <Maximize2 className="w-3.5 h-3.5" /> Full Preview
                          </span>
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">RESOLVED FILE NAME</div>
                        <div className="text-xs font-mono text-gray-200 break-all bg-[#1b1b22] px-3 py-2 rounded-lg border border-[#282834]">
                          {currentFile.name}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500">CONCEPT / THEME</div>
                          <div className="text-xs font-bold text-white mt-0.5">{currentFile.concept}</div>
                        </div>
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500">ESTIMATED SIZE</div>
                          <div className="text-xs font-semibold text-gray-200 mt-0.5">{currentFile.size}</div>
                        </div>
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500">SESSION ID</div>
                          <div className="text-[11px] font-mono text-gray-300 mt-0.5 truncate" title={currentFile.sessionId}>{currentFile.sessionId}</div>
                        </div>
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500">CREATED TIME</div>
                          <div className="text-xs font-semibold text-gray-200 mt-0.5">{currentFile.time}</div>
                        </div>
                      </div>

                      <div className="pt-1">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                          <FileText className="w-3.5 h-3.5" />
                          <span>GUEST SUBMITTED DATA</span>
                        </div>
                        <div className="bg-[#1b1b23] border border-[#292935] rounded-xl p-3 space-y-2">
                          <div>
                            <div className="text-[9px] font-bold uppercase tracking-wider text-gray-500">SELECTED CONCEPT</div>
                            <div className="text-xs font-bold text-white">{currentFile.concept}</div>
                          </div>
                          <div className="pt-1.5 border-t border-[#262632] flex items-center justify-between text-[11px]">
                            <span className="text-gray-400">{currentFile.guestName}</span>
                            <span className="font-mono text-gray-300">{currentFile.guestContact}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2.5 pt-3 border-t border-[#24242e]">
                      <div className="grid grid-cols-2 gap-2.5">
                        <button onClick={() => handleDownloadSingle(currentFile)} className="py-2.5 px-3 bg-white hover:bg-gray-200 active:scale-[0.98] text-black font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer">
                          <Download className="w-3.5 h-3.5" />
                          <span>DOWNLOAD</span>
                        </button>
                        <button onClick={() => handlePrintSingle(currentFile)} className="py-2.5 px-3 bg-[#22222b] hover:bg-[#2c2c38] active:scale-[0.98] border border-[#323240] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer">
                          <Printer className="w-3.5 h-3.5" />
                          <span>PRINT PHOTO</span>
                        </button>
                      </div>

                      <button onClick={() => setPreviewFile(currentFile)} className="w-full py-2.5 px-4 bg-[#1c1c24] hover:bg-[#252530] border border-[#2e2e3b] text-gray-200 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer">
                        <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                        <span>OPEN GUEST DOWNLOAD PAGE</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(currentFile.name);
                            showToast(`Copied file name: ${currentFile.name}`, 'success');
                          }}
                          className="flex-1 py-2.5 px-3 bg-[#1c1c24] hover:bg-[#252530] border border-[#2e2e3b] text-gray-300 font-medium text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5 text-gray-400" />
                          <span>Copy File Name</span>
                        </button>
                        <button onClick={() => confirmDeleteSingle(currentFile)} title="Delete File" className="p-2.5 bg-[#2a1619] hover:bg-[#3d1e22] border border-red-500/30 text-red-400 rounded-xl transition-colors cursor-pointer">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {previewFile && (
        <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-3xl w-full bg-[#16161d] border border-[#2d2d3a] rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#262632]">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded text-[10px] font-bold uppercase">{previewFile.type}</span>
                <span className="text-xs font-mono text-gray-200 truncate">{previewFile.name}</span>
              </div>
              <button onClick={() => setPreviewFile(null)} className="text-gray-400 hover:text-white p-1 rounded-lg cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-[#0b0b0e] flex items-center justify-center p-4 max-h-[70vh] overflow-hidden">
              <img src={previewFile.image} alt="Preview" className="max-h-[65vh] w-auto object-contain rounded-lg shadow-lg" />
            </div>
            <div className="px-5 py-3.5 bg-[#1a1a22] flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-gray-400">
                Concept: <span className="text-white font-semibold">{previewFile.concept}</span> • Guest: <span className="text-gray-200">{previewFile.guestName}</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handlePrintSingle(previewFile)} className="px-3.5 py-2 bg-[#252530] hover:bg-[#323240] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer">
                  <Printer className="w-3.5 h-3.5" /> Print
                </button>
                <button onClick={() => handleDownloadSingle(previewFile)} className="px-4 py-2 bg-white hover:bg-gray-200 text-black text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer">
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isShareModalOpen && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#16161d] border border-[#2c2c38] rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Share Drive Access</h3>
                  <p className="text-[11px] text-gray-400">Direct link for clients &amp; event organizers</p>
                </div>
              </div>
              <button onClick={() => setIsShareModalOpen(false)} className="text-gray-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Public Gallery &amp; Storage URL</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value="https://drive.jalanan-event.id/s/JALANAN-2026-VIP"
                    className="flex-1 bg-[#101015] border border-[#2a2a36] rounded-xl px-3 py-2.5 text-xs text-gray-200 font-mono outline-none"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText("https://drive.jalanan-event.id/s/JALANAN-2026-VIP");
                      showToast('Shareable drive link copied to clipboard!', 'success');
                    }}
                    className="px-3.5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shrink-0"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div className="p-3.5 bg-[#111116] border border-[#24242f] rounded-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-300">Allow Bulk ZIP Download</span>
                  <input type="checkbox" defaultChecked className="accent-purple-500 w-4 h-4 cursor-pointer" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-300">Show Original Camera Captures</span>
                  <input type="checkbox" defaultChecked className="accent-purple-500 w-4 h-4 cursor-pointer" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-300">Hide Guest Personal Leads (CSV)</span>
                  <input type="checkbox" className="accent-purple-500 w-4 h-4 cursor-pointer" />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button onClick={() => setIsShareModalOpen(false)} className="px-5 py-2 bg-[#252530] hover:bg-[#30303e] text-white text-xs font-semibold rounded-xl cursor-pointer">
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmConfig.isOpen && (
        <div className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#181316] border border-red-500/30 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400 mb-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">{confirmConfig.title}</h3>
            </div>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-6">
              {confirmConfig.message}
            </p>
            <div className="flex items-center justify-end gap-3">
              <button onClick={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))} className="px-4 py-2.5 bg-[#24242e] hover:bg-[#2f2f3c] text-gray-200 text-xs font-semibold rounded-xl cursor-pointer">
                Cancel
              </button>
              <button onClick={confirmConfig.onConfirm} className="px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl cursor-pointer">
                {confirmConfig.actionText}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-5 right-5 z-[80] flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-xl border shadow-xl text-xs font-medium backdrop-blur-md transition-all duration-300 ${t.type === 'success' ? 'bg-[#17261e] border-emerald-500/40 text-emerald-200' :
                t.type === 'error' ? 'bg-[#29171a] border-red-500/40 text-red-200' :
                  'bg-[#1c1c26] border-purple-500/40 text-gray-200'
              }`}
          >
            {t.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> :
              t.type === 'error' ? <AlertCircle className="w-4 h-4 shrink-0" /> :
                <Info className="w-4 h-4 shrink-0" />}
            <span>{t.message}</span>
          </div>
        ))}
      </div>

      {/* Print Area for window.print() */}
      <div className="hidden print:block fixed inset-0 z-[99999] bg-white flex items-center justify-center">
        {printImageSrc && <img src={printImageSrc} style={{ maxHeight: '95vh', maxWidth: '95vw', objectFit: 'contain' }} alt="Print preview" />}
      </div>
    </div>
  );
}

function EyeIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}