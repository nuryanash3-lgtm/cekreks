'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronLeft,
  Search,
  Unplug,
  VideoOff,
  Camera,
  Cpu,
  Usb,
  X,
  Loader2,
  CheckCircle2,
  BatteryFull,
  ChevronDown,
  Plug,
} from 'lucide-react';

interface SupportedCamera {
  brand: string;
  type: string;
  model: string;
  shutterCount: number;
  battery: number;
  firmware: string;
  shutterIdx: number;
  apertureIdx: number;
  isoIdx: number;
}

type WhiteBalanceKey =
  | 'flash'
  | 'auto'
  | 'daylight'
  | 'cloudy'
  | 'tungsten'
  | 'fluorescent';

interface ToastState {
  visible: boolean;
  title: string;
  message: string;
}

// Konstanta Parameter Kamera
const SHUTTER_SPEEDS = [
  '1/4',
  '1/15',
  '1/30',
  '1/60',
  '1/125',
  '1/250',
  '1/500',
  '1/1000',
  '1/4000',
];
const SHUTTER_EV_VALUES = [-3, -2, -1, 0, 1, 2, 3, 4, 5];

const APERTURES = ['1.8', '2.8', '3.5', '4.0', '5.6', '8.0', '11', '16'];
const APERTURE_EV_VALUES = [3, 2, 1, 0, -1, -2, -3, -4];

const ISO_VALUES = ['100', '200', '400', '800', '1600', '3200', '6400'];
const ISO_EV_VALUES = [-3, -2, -1, 0, 1, 2, 3];

const WB_PROFILES: Record<WhiteBalanceKey, { color: string; label: string }> = {
  flash: { color: 'rgba(255, 250, 240, 0.05)', label: 'Flash (5500K)' },
  auto: { color: 'rgba(0, 0, 0, 0)', label: 'Auto (AWB)' },
  daylight: { color: 'rgba(255, 240, 200, 0.08)', label: 'Daylight (5200K)' },
  cloudy: { color: 'rgba(255, 210, 150, 0.15)', label: 'Cloudy (6000K)' },
  tungsten: { color: 'rgba(100, 180, 255, 0.2)', label: 'Tungsten (3200K)' },
  fluorescent: { color: 'rgba(150, 255, 200, 0.12)', label: 'Fluorescent (4000K)' },
};

// Database Perangkat DSLR & Mirrorless yang didukung
const SUPPORTED_CAMERAS_DB: SupportedCamera[] = [
  {
    brand: 'NIKON DSLR',
    type: 'DSLR',
    model: 'Nikon Corporation D7000',
    shutterCount: 14820,
    battery: 92,
    firmware: 'PTP v1.04',
    shutterIdx: 3,
    apertureIdx: 3,
    isoIdx: 4,
  },
  {
    brand: 'CANON DSLR',
    type: 'DSLR',
    model: 'Canon EOS 80D / 90D',
    shutterCount: 8940,
    battery: 88,
    firmware: 'EOS-PTP v2.1',
    shutterIdx: 4,
    apertureIdx: 2,
    isoIdx: 2,
  },
  {
    brand: 'SONY MIRRORLESS',
    type: 'MIRRORLESS',
    model: 'Sony Alpha A7 III / A6400',
    shutterCount: 6410,
    battery: 95,
    firmware: 'PC Remote v3.0',
    shutterIdx: 4,
    apertureIdx: 1,
    isoIdx: 1,
  },
  {
    brand: 'FUJIFILM MIRRORLESS',
    type: 'MIRRORLESS',
    model: 'Fujifilm X-T4 / X-S10',
    shutterCount: 4120,
    battery: 84,
    firmware: 'Fuji-PTP v1.5',
    shutterIdx: 3,
    apertureIdx: 2,
    isoIdx: 2,
  },
  {
    brand: 'CANON MIRRORLESS',
    type: 'MIRRORLESS',
    model: 'Canon EOS R6 / M50 Mark II',
    shutterCount: 5390,
    battery: 91,
    firmware: 'EOS-PTP v2.4',
    shutterIdx: 4,
    apertureIdx: 2,
    isoIdx: 3,
  },
  {
    brand: 'NIKON MIRRORLESS',
    type: 'MIRRORLESS',
    model: 'Nikon Z6 II / Z50',
    shutterCount: 7250,
    battery: 96,
    firmware: 'Nikon-MTP v1.3',
    shutterIdx: 5,
    apertureIdx: 1,
    isoIdx: 1,
  },
  {
    brand: 'PANASONIC / LUMIX',
    type: 'MIRRORLESS',
    model: 'Panasonic Lumix GH5 / S5',
    shutterCount: 11200,
    battery: 89,
    firmware: 'Lumix-PTP v2.0',
    shutterIdx: 3,
    apertureIdx: 3,
    isoIdx: 2,
  },
];

export default function CameraSetup() {
  // State Koneksi Kamera (Default: OFF / Mati)
  const [connectedCamera, setConnectedCamera] = useState<SupportedCamera | null>(null);
  const isCameraConnected = Boolean(connectedCamera);

  // State Pengaturan Kamera
  const [activeTab, setActiveTab] = useState<'photo' | 'video'>('photo');
  const [shutterIdx, setShutterIdx] = useState<number>(3);
  const [apertureIdx, setApertureIdx] = useState<number>(3);
  const [isoIdx, setIsoIdx] = useState<number>(4);
  const [whiteBalance, setWhiteBalance] = useState<WhiteBalanceKey>('flash');
  const [mirrorLiveView, setMirrorLiveView] = useState<boolean>(true);
  const [rotation, setRotation] = useState<string>('0');

  // State Modal Pemindai Perangkat USB
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);

  // State Efek Flash & Notifikasi Toast
  const [isFlashing, setIsFlashing] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastState>({
    visible: false,
    title: '',
    message: '',
  });
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scanTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wizardTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      if (scanTimerRef.current) clearTimeout(scanTimerRef.current);
      if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
      if (wizardTimerRef.current) clearTimeout(wizardTimerRef.current);
    };
  }, []);

  // Fungsi Menampilkan Notifikasi Toast
  const showToast = (title: string, message: string) => {
    setToast({ visible: true, title, message });
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 3000);
  };

  // Membuka Modal Pemindai USB
  const handleOpenScanner = () => {
    setIsScannerOpen(true);
    setIsScanning(true);
    if (scanTimerRef.current) clearTimeout(scanTimerRef.current);
    scanTimerRef.current = setTimeout(() => {
      setIsScanning(false);
    }, 700);
  };

  // Menghubungkan Kamera & Mengaktifkan Semua Setingan
  const handleConnectCamera = (camData: SupportedCamera) => {
    setConnectedCamera({ ...camData });
    setShutterIdx(camData.shutterIdx);
    setApertureIdx(camData.apertureIdx);
    setIsoIdx(camData.isoIdx);
    setIsScannerOpen(false);
    showToast('Perangkat Terhubung!', `${camData.model} siap digunakan.`);
  };

  // Pemindaian WebUSB Fisik Browser (Nikon, Canon, Sony, Fujifilm, Panasonic, Olympus)
  const handleNativeWebUSB = async () => {
    const navWithUsb = navigator as Navigator & {
      usb?: {
        requestDevice: (options: {
          filters: Array<{ vendorId: number }>;
        }) => Promise<{
          manufacturerName?: string;
          productName?: string;
        }>;
      };
    };

    if (typeof navigator === 'undefined' || !navWithUsb.usb) {
      showToast(
        'Browser Info',
        'Gunakan daftar perangkat terdeteksi di atas untuk menghubungkan.'
      );
      return;
    }

    try {
      const device = await navWithUsb.usb.requestDevice({
        filters: [
          { vendorId: 0x04b0 }, // Nikon
          { vendorId: 0x04a9 }, // Canon
          { vendorId: 0x054c }, // Sony
          { vendorId: 0x04cb }, // Fujifilm
          { vendorId: 0x04da }, // Panasonic
          { vendorId: 0x07b4 }, // Olympus
        ],
      });
      handleConnectCamera({
        brand: (device.manufacturerName || 'USB CAMERA').toUpperCase(),
        type: 'USB-PTP',
        model: device.productName || 'Connected DSLR / Mirrorless',
        shutterCount: 10240,
        battery: 94,
        firmware: 'WebUSB PTP',
        shutterIdx: 3,
        apertureIdx: 3,
        isoIdx: 2,
      });
    } catch {
      showToast(
        'USB Scan',
        'Pemilihan USB dibatalkan atau tidak ada izin port.'
      );
    }
  };

  // Memutus Kabel & Mematikan Semua Setingan
  const handleDisconnectCable = () => {
    if (!isCameraConnected) return;
    setConnectedCamera(null);
    showToast('Kabel Diputus', 'Semua setingan kamera dimatikan (OFF).');
  };

  // Efek Suara Shutter DSLR Menggunakan Web Audio API
  const playShutterSound = () => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const audioCtx = new AudioCtx();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(120, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);

      setTimeout(() => {
        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(150, audioCtx.currentTime);
        osc2.frequency.exponentialRampToValueAtTime(30, audioCtx.currentTime + 0.06);
        gain2.gain.setValueAtTime(0.25, audioCtx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.06);
        osc2.connect(gain2);
        gain2.connect(audioCtx.destination);
        osc2.start();
        osc2.stop(audioCtx.currentTime + 0.06);
      }, 100);
    } catch {
      // AudioContext fallback
    }
  };

  // Tombol Jepret (Take Test Photo)
  const handleTakePhoto = () => {
    if (!isCameraConnected || !connectedCamera) {
      showToast('Kamera Mati', 'Klik "Cari Perangkat" terlebih dahulu.');
      return;
    }

    const updatedSC = connectedCamera.shutterCount + 1;
    setConnectedCamera((prev) => (prev ? { ...prev, shutterCount: updatedSC } : null));

    setIsFlashing(false);
    if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
    setTimeout(() => setIsFlashing(true), 10);
    flashTimerRef.current = setTimeout(() => setIsFlashing(false), 450);

    playShutterSound();
    showToast(
      'Shutter Triggered!',
      `Photo captured. SC: ${updatedSC.toLocaleString()}`
    );
  };

  // DSLR Camera Wizard Preset
  const handleApplyWizard = () => {
    if (!isCameraConnected) return;
    showToast('DSLR Wizard', 'Auto-configuring photobooth optimal presets...');
    if (wizardTimerRef.current) clearTimeout(wizardTimerRef.current);
    wizardTimerRef.current = setTimeout(() => {
      setShutterIdx(4); // 1/125
      setApertureIdx(5); // f/8.0
      setIsoIdx(2); // ISO 400
      setWhiteBalance('flash');
      showToast('Wizard Applied', 'Flash Preset (1/125, f/8, ISO 400) applied.');
    }, 600);
  };

  // Kalkulasi Exposure Value (EV) Live View
  const ev =
    SHUTTER_EV_VALUES[shutterIdx] +
    APERTURE_EV_VALUES[apertureIdx] +
    ISO_EV_VALUES[isoIdx];
  const evFormatted = `${ev >= 0 ? '+' : ''}${(ev * 0.5).toFixed(1)}`;

  let exposureOverlayColor = 'rgba(0, 0, 0, 0)';
  let exposureStatusText = 'Optimal Exposure';
  let exposureStatusClass = 'text-green-400 font-bold';

  if (ev < 0) {
    const opacity = Math.min(Math.abs(ev) * 0.18, 0.85);
    exposureOverlayColor = `rgba(0, 0, 0, ${opacity})`;
    exposureStatusText = ev < -4 ? 'Severely Underexposed' : 'Underexposed';
    exposureStatusClass = 'text-amber-400 font-bold';
  } else if (ev > 0) {
    const opacity = Math.min(ev * 0.15, 0.85);
    exposureOverlayColor = `rgba(255, 255, 255, ${opacity})`;
    exposureStatusText = ev > 4 ? 'Severely Overexposed' : 'Overexposed';
    exposureStatusClass = 'text-amber-400 font-bold';
  }

  return (
    <div className="text-gray-200 h-screen overflow-hidden flex flex-col select-none font-sans">

      {/* Flash Overlay */}
      <div
        className={`fixed inset-0 pointer-events-none z-50 ${
          isFlashing ? 'do-flash' : ''
        }`}
      />

      {/* Top Header Navigation Bar */}
      <header className="h-16 border-b border-[#3a3b3c] flex items-center justify-between px-6 z-10">

        <div className="flex items-center gap-3">
          {/* Tombol Cari Perangkat (Sebelah kiri Disconnect Cable) */}
          <button
            type="button"
            onClick={handleOpenScanner}
            className="text-xs md:text-sm px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2 font-bold transition-all active:scale-95 shadow-lg shadow-purple-900/30 cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>Cari Perangkat</span>
          </button>

          {/* Tombol Disconnect Cable */}
          <button
            type="button"
            onClick={handleDisconnectCable}
            disabled={!isCameraConnected}
            className={`text-xs md:text-sm px-4 py-2 rounded-lg border flex items-center gap-2 font-bold transition-all ${
              isCameraConnected
                ? 'bg-red-900/60 hover:bg-red-800 text-red-200 border-red-700 active:scale-95 cursor-pointer'
                : 'text-gray-500 border-gray-700 cursor-not-allowed opacity-60'
            }`}
          >
            <Unplug className="w-4 h-4" />
            <span>Disconnect Cable</span>
          </button>

          {/* Badge Status */}
          <span
            className={`text-xs md:text-sm px-3.5 py-1.5 rounded-lg border flex items-center gap-2 font-bold transition-all ${
              isCameraConnected
                ? 'bg-green-950 text-green-400 border-green-800'
                : 'bg-red-950 text-red-400 border-red-800'
            }`}
          >
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isCameraConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
              }`}
            />
            <span>{isCameraConnected ? 'CONNECTED' : 'OFFLINE'}</span>
          </span>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Controls Left */}
        <aside className="w-96 border-r border-[#3a3b3c] flex flex-col justify-between overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Camera Info & Mode */}
            <div className="flex items-center justify-between">
              <div>
                <h2
                  className={`tech-heading text-sm md:text-base font-black tracking-wider ${
                    isCameraConnected ? 'text-white' : 'text-gray-400'
                  }`}
                >
                  {isCameraConnected && connectedCamera
                    ? connectedCamera.model
                    : 'CAMERA OFF'}
                </h2>
                <p
                  className={`text-xs mt-1 ${
                    isCameraConnected
                      ? 'text-purple-400 font-bold'
                      : 'text-gray-500 font-semibold'
                  }`}
                >
                  {isCameraConnected && connectedCamera
                    ? `${connectedCamera.brand} • USB Direct Active`
                    : 'Klik "Cari Perangkat" untuk mendeteksi USB'}
                </p>
              </div>

              <div
                className={`w-11 h-11 border-2 rounded flex items-center justify-center font-black text-base shadow-sm transition-colors ${
                  isCameraConnected
                    ? 'border-purple-500 text-white bg-purple-950/40'
                    : 'border-white/20 text-gray-600'
                }`}
              >
                M
              </div>
            </div>

            {/* Hardware Diagnostic Stats Panel */}
            {isCameraConnected && connectedCamera && (
              <div className="p-4 rounded-lg border border-[#3a3b3c] space-y-2.5 text-sm font-mono font-bold">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Brand / Mount:</span>
                  <span className="text-white">{connectedCamera.brand}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Shutter Count (SC):</span>
                  <span className="text-purple-400">
                    {connectedCamera.shutterCount.toLocaleString()} shots
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Battery Level:</span>
                  <span className="text-green-400 flex items-center gap-1.5">
                    <BatteryFull className="w-4 h-4" /> {connectedCamera.battery}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Protocol:</span>
                  <span className="text-gray-200">{connectedCamera.firmware}</span>
                </div>
              </div>
            )}

            {/* Controls Wrapper (Disabled saat Kamera OFF) */}
            <div
              className={`space-y-6 transition-opacity duration-300 ${
                isCameraConnected
                  ? 'opacity-100'
                  : 'opacity-40 pointer-events-none select-none'
              }`}
            >
              {/* Tabs */}
              <div className="border-b border-[#3a3b3c] flex gap-8 text-sm font-bold">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('photo');
                    showToast('Mode Switched', 'Switched to Photo Mode');
                  }}
                  className={`pb-3 transition-all tracking-widest cursor-pointer ${
                    activeTab === 'photo'
                      ? 'text-white border-b-2 border-white'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  PHOTO
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('video');
                    showToast('Mode Switched', 'Switched to Video & Boomerang Mode');
                  }}
                  className={`pb-3 transition-all tracking-widest cursor-pointer ${
                    activeTab === 'video'
                      ? 'text-white border-b-2 border-white'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  VIDEO &amp; BOOMERANG
                </button>
              </div>

              {/* Sliders & Selectors */}
              <div className="space-y-6">
                {/* Shutter Speed */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-bold">
                    <label className="text-gray-200">Shutter Speed</label>
                    <span className="text-white font-mono font-black text-base">
                      {isCameraConnected ? SHUTTER_SPEEDS[shutterIdx] : '--'}
                    </span>
                  </div>
                  <input
                    type="range"
                    className="purple-slider"
                    disabled={!isCameraConnected}
                    min={0}
                    max={8}
                    step={1}
                    value={shutterIdx}
                    onChange={(e) => setShutterIdx(Number(e.target.value))}
                  />
                  <div className="flex justify-between text-xs text-gray-400 font-mono font-bold">
                    <span>1/4</span>
                    <span>1/250</span>
                    <span>1/4000</span>
                  </div>
                </div>

                {/* Aperture */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-bold">
                    <label className="text-gray-200">Aperture</label>
                    <span className="text-white font-mono font-black text-base">
                      {isCameraConnected ? `f/${APERTURES[apertureIdx]}` : '--'}
                    </span>
                  </div>
                  <input
                    type="range"
                    className="purple-slider"
                    disabled={!isCameraConnected}
                    min={0}
                    max={7}
                    step={1}
                    value={apertureIdx}
                    onChange={(e) => setApertureIdx(Number(e.target.value))}
                  />
                  <div className="flex justify-between text-xs text-gray-400 font-mono font-bold">
                    <span>f/1.8</span>
                    <span>f/5.6</span>
                    <span>f/16</span>
                  </div>
                </div>

                {/* ISO */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-bold">
                    <label className="text-gray-200">ISO</label>
                    <span className="text-white font-mono font-black text-base">
                      {isCameraConnected ? ISO_VALUES[isoIdx] : '--'}
                    </span>
                  </div>
                  <input
                    type="range"
                    className="purple-slider"
                    disabled={!isCameraConnected}
                    min={0}
                    max={6}
                    step={1}
                    value={isoIdx}
                    onChange={(e) => setIsoIdx(Number(e.target.value))}
                  />
                  <div className="flex justify-between text-xs text-gray-400 font-mono font-bold">
                    <span>100</span>
                    <span>800</span>
                    <span>6400</span>
                  </div>
                </div>

                {/* White Balance */}
                <div className="space-y-2">
                  <label className="text-sm text-gray-200 font-bold block">
                    White Balance
                  </label>
                  <div className="relative">
                    <select
                      disabled={!isCameraConnected}
                      value={whiteBalance}
                      onChange={(e) => {
                        const nextWb = e.target.value as WhiteBalanceKey;
                        setWhiteBalance(nextWb);
                        showToast('White Balance Updated', WB_PROFILES[nextWb]?.label);
                      }}
                      className="w-full border border-[#3a3b3c] rounded-lg px-4 py-2.5 text-sm font-bold text-white appearance-none focus:outline-none focus:border-purple-500 cursor-pointer transition-colors pr-10 bg-transparent"
                    >
                      <option value="flash" className="bg-[#18191a]">
                        Flash (5500K)
                      </option>
                      <option value="auto" className="bg-[#18191a]">
                        Auto (AWB)
                      </option>
                      <option value="daylight" className="bg-[#18191a]">
                        Daylight (5200K)
                      </option>
                      <option value="cloudy" className="bg-[#18191a]">
                        Cloudy (6000K)
                      </option>
                      <option value="tungsten" className="bg-[#18191a]">
                        Tungsten (3200K)
                      </option>
                      <option value="fluorescent" className="bg-[#18191a]">
                        Fluorescent (4000K)
                      </option>
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-3.5 top-3.5 pointer-events-none text-gray-400" />
                  </div>
                </div>

                <hr className="border-[#3a3b3c] my-3" />

                {/* Mirror Live View Toggle */}
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-sm text-gray-200 font-bold">
                    Mirror Live View
                  </span>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        disabled={!isCameraConnected}
                        checked={mirrorLiveView}
                        onChange={(e) => setMirrorLiveView(e.target.checked)}
                        className="sr-only"
                      />
                      <div
                        className={`w-11 h-6 rounded-full transition-colors duration-200 ${
                          mirrorLiveView ? 'bg-purple-600' : 'bg-[#3a3b3c]'
                        }`}
                      />
                      <div
                        className={`absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full transition-transform duration-200 transform ${
                          mirrorLiveView ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </div>
                    <span className="text-sm text-white font-bold w-8">
                      {mirrorLiveView ? 'On' : 'Off'}
                    </span>
                  </label>
                </div>

                {/* Rotation Selector */}
                <div className="space-y-2">
                  <label className="text-sm text-gray-200 font-bold block">
                    Rotation
                  </label>
                  <div className="relative">
                    <select
                      disabled={!isCameraConnected}
                      value={rotation}
                      onChange={(e) => {
                        setRotation(e.target.value);
                        showToast(
                          'Camera Rotation',
                          `Live view rotated to ${e.target.value}°`
                        );
                      }}
                      className="w-full border border-[#3a3b3c] rounded-lg px-4 py-2.5 text-sm font-bold text-white appearance-none focus:outline-none focus:border-purple-500 cursor-pointer transition-colors pr-10 bg-transparent"
                    >
                      <option value="0" className="bg-[#18191a]">
                        0 degrees
                      </option>
                      <option value="90" className="bg-[#18191a]">
                        90 degrees (Portrait Right)
                      </option>
                      <option value="180" className="bg-[#18191a]">
                        180 degrees (Inverted)
                      </option>
                      <option value="270" className="bg-[#18191a]">
                        270 degrees (Portrait Left)
                      </option>
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-3.5 top-3.5 pointer-events-none text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Wizard Button Bottom Sidebar */}
          <div className="p-6 border-t border-[#3a3b3c]">
            <button
              type="button"
              onClick={handleApplyWizard}
              disabled={!isCameraConnected}
              className={`w-full border-2 rounded-xl py-3.5 text-sm font-black tracking-wider transition-all duration-200 ${
                isCameraConnected
                  ? 'border-purple-500 hover:bg-purple-600 text-white cursor-pointer active:scale-[0.98]'
                  : 'border-gray-700 text-gray-500 cursor-not-allowed opacity-50'
              }`}
            >
              DSLR Camera Wizard
            </button>
          </div>
        </aside>

        {/* Right Preview & Live View Area */}
        <main className="flex-1 relative flex flex-col justify-between items-center p-8 overflow-hidden">
          {/* Viewfinder Container */}
          <div className="flex-1 w-full flex items-center justify-center relative min-h-0">
            <div className="relative w-full max-w-5xl h-full max-h-[78vh] rounded-xl overflow-hidden shadow-2xl border border-white/10 flex items-center justify-center transition-all duration-300">
              {!isCameraConnected ? (
                /* Offline Placeholder Screen */
                <div className="flex flex-col items-center justify-center text-center p-8 z-20 space-y-4">
                  <div className="w-20 h-20 rounded-full border border-gray-700 flex items-center justify-center text-gray-500">
                    <VideoOff className="w-9 h-9" />
                  </div>
                  <h3 className="tech-heading text-white text-lg md:text-xl font-black tracking-widest">
                    NO CAMERA SIGNAL
                  </h3>
                  <p className="text-gray-400 text-xs md:text-sm max-w-md font-semibold leading-relaxed">
                    Sambungkan kabel USB kamera DSLR atau Mirrorless (Nikon, Canon,
                    Sony, Fujifilm, Panasonic) ke PC/Laptop, lalu tekan tombol{' '}
                    <span className="text-purple-400 font-bold">
                      &quot;CARI PERANGKAT&quot;
                    </span>{' '}
                    di pojok kanan atas.
                  </p>
                </div>
              ) : (
                /* Live View Canvas Scene (Polos Tanpa Gambar Model) */
                <div
                  style={{
                    transform: `rotate(${rotation}deg) scaleX(${
                      mirrorLiveView ? -1 : 1
                    })`,
                  }}
                  className="relative w-full h-full flex items-center justify-center overflow-hidden transition-transform duration-300"
                >
                  {/* Plain Background + Center Reticle */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 border border-white/20 rounded-full flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white/40 rounded-full" />
                    </div>
                  </div>

                  {/* Exposure Overlay */}
                  <div
                    style={{ backgroundColor: exposureOverlayColor }}
                    className="absolute inset-0 pointer-events-none transition-all duration-150"
                  />

                  {/* White Balance Overlay */}
                  <div
                    style={{ backgroundColor: WB_PROFILES[whiteBalance]?.color }}
                    className="absolute inset-0 pointer-events-none transition-all duration-300"
                  />

                  {/* Rule of Thirds Grid */}
                  <div className="absolute inset-0 border border-white/10 pointer-events-none grid grid-cols-3 grid-rows-3">
                    <div className="border-r border-b border-white/10" />
                    <div className="border-r border-b border-white/10" />
                    <div className="border-b border-white/10" />
                    <div className="border-r border-b border-white/10" />
                    <div className="border-r border-b border-white/10" />
                    <div className="border-b border-white/10" />
                    <div className="border-r border-white/10" />
                    <div className="border-r border-white/10" />
                    <div />
                  </div>

                  {/* Focus Rectangle Center */}
                  <div className="absolute w-24 h-24 border-2 border-green-400/80 rounded-lg pointer-events-none flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                  </div>

                  {/* On-Screen Exposure Meter */}
                  <div
                    style={{ transform: `scaleX(${mirrorLiveView ? -1 : 1})` }}
                    className="absolute bottom-6 left-6 bg-black/85 backdrop-blur-md px-4 py-2.5 rounded-lg text-xs md:text-sm font-mono font-black text-white flex items-center gap-4 border border-white/15 shadow-xl"
                  >
                    <div>
                      EV:{' '}
                      <span className={exposureStatusClass}>{evFormatted}</span>
                    </div>
                    <div className="text-gray-500">|</div>
                    <div className={exposureStatusClass}>{exposureStatusText}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Center Action Bar */}
          <div className="w-full flex justify-between items-center mt-6 px-4 max-w-5xl">
            <div className="text-sm font-bold text-gray-400 flex items-center gap-2">
              <Cpu
                className={`w-5 h-5 ${
                  isCameraConnected ? 'text-purple-400' : 'text-gray-500'
                }`}
              />
              <span
                className={
                  isCameraConnected ? 'text-green-400' : 'text-gray-400'
                }
              >
                {isCameraConnected && connectedCamera
                  ? `USB PTP/IP Engine: Syncing ${connectedCamera.model} (Live)`
                  : 'USB PTP/IP Engine: Standby (Off)'}
              </span>
            </div>

            <button
              type="button"
              onClick={handleTakePhoto}
              disabled={!isCameraConnected}
              className={`text-base px-5 py-1 ml-3 rounded-full shadow-xl transition-all flex items-center gap-3 ${
                isCameraConnected
                  ? 'bg-purple-600 hover:bg-purple-700 text-white active:scale-95 cursor-pointer'
                  : 'bg-gray-800 text-gray-500 cursor-not-allowed opacity-50'
              }`}
            >
              <Camera className="w-5 h-5" />
              <span>Test Photo</span>
            </button>
          </div>
        </main>
      </div>

      {/* Modal USB Camera Scanner */}
      {isScannerOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="border border-[#3a3b3c] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 bg-[#18191a]">
            <div className="flex justify-between items-center border-b border-[#3a3b3c] pb-4">
              <div className="flex items-center gap-3">
                <Usb className="w-6 h-6 text-purple-400" />
                <h3 className="text-white text-base md:text-lg font-black tracking-wider">
                  USB CAMERA SCANNER
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsScannerOpen(false)}
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3.5 rounded-xl border border-purple-500/30">
                {isScanning ? (
                  <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                )}
                <div className="text-xs md:text-sm font-bold text-gray-200">
                  {isScanning
                    ? 'Memindai port USB PC/Laptop untuk DSLR & Mirrorless...'
                    : 'Ditemukan perangkat kamera yang terhubung via USB!'}
                </div>
              </div>

              {!isScanning && (
                <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                  <p className="text-xs text-gray-400 font-bold mb-2">
                    PILIH PERANGKAT KAMERA YANG TERDETEKSI DI USB:
                  </p>
                  {SUPPORTED_CAMERAS_DB.map((cam, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleConnectCamera(cam)}
                      className="w-full text-left p-3.5 rounded-xl hover:bg-purple-950/40 border border-[#3a3b3c] hover:border-purple-500 transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg border border-gray-700 group-hover:border-purple-500 flex items-center justify-center text-purple-400">
                          <Camera className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-white text-sm font-black tracking-wide">
                            {cam.model}
                          </div>
                          <div className="text-xs text-gray-400 font-semibold">
                            {cam.brand} • SC: {cam.shutterCount.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs px-3 py-1.5 rounded-lg bg-purple-600 text-white font-bold group-hover:bg-purple-500">
                        Hubungkan
                      </span>
                    </button>
                  ))}
                </div>
              )}

              <div className="pt-2 border-t border-[#3a3b3c] flex justify-between items-center">
                <span className="text-xs text-gray-400 font-semibold">
                  Tidak muncul otomatis?
                </span>
                <button
                  type="button"
                  onClick={handleNativeWebUSB}
                  className="text-xs px-3.5 py-2 rounded-lg border border-gray-600 hover:border-purple-500 text-purple-300 font-bold transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Plug className="w-3.5 h-3.5" /> Pindai Port USB Browser
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      <div
        className={`fixed top-20 right-8 bg-slate-900 border border-purple-500/40 text-white px-6 py-4 rounded-xl shadow-2xl transition-all duration-300 z-50 flex items-center gap-4 ${
          toast.visible
            ? 'translate-y-0 opacity-100'
            : '-translate-y-28 opacity-0 pointer-events-none'
        }`}
      >
        <CheckCircle2 className="w-6 h-6 text-purple-400" />
        <div>
          <div className="text-sm font-black tracking-wider">{toast.title}</div>
          <div className="text-xs md:text-sm font-semibold text-gray-300">
            {toast.message}
          </div>
        </div>
      </div>
    </div>
  );
}