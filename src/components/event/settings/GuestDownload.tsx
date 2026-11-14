"use client";

import { useState, useRef } from "react";
import { 
  RotateCcw, 
  Info, 
  X, 
  ImagePlus, 
  Film, 
  Trash2, 
  CheckCircle2 
} from "lucide-react";

interface GuestDownloadProps {
  headerText: string; setHeaderText: (val: string) => void;
  subText: string; setSubText: (val: string) => void;
  welcomeEnabled: boolean; setWelcomeEnabled: (val: boolean) => void;
  popupMessage: string; setPopupMessage: (val: string) => void;
  popupButtonText: string; setPopupButtonText: (val: string) => void;
  filePattern: string; setFilePattern: (val: string) => void;
  bgClass: string; setBgClass: (val: string) => void;
  customBgUrl: string | null; setCustomBgUrl: (val: string | null) => void;
  customBgType: 'image' | 'video' | null; setCustomBgType: (val: 'image' | 'video' | null) => void;
  originalPhotoEnabled: boolean; setOriginalPhotoEnabled: (val: boolean) => void;
  dlPhotoText: string; setDlPhotoText: (val: string) => void;
  dlVideoText: string; setDlVideoText: (val: string) => void;
  layoutStyle: 'neon' | 'minimal'; setLayoutStyle: (val: 'neon' | 'minimal') => void;
  orientation: 'portrait' | 'landscape'; setOrientation: (val: 'portrait' | 'landscape') => void;
}

export default function GuestDownload({
  headerText, setHeaderText,
  subText, setSubText,
  welcomeEnabled, setWelcomeEnabled,
  popupMessage, setPopupMessage,
  popupButtonText, setPopupButtonText,
  filePattern, setFilePattern,
  bgClass, setBgClass,
  setCustomBgUrl,
  setCustomBgType,
  originalPhotoEnabled, setOriginalPhotoEnabled,
  dlPhotoText, setDlPhotoText,
  dlVideoText, setDlVideoText,
  layoutStyle, setLayoutStyle,
  setOrientation,
}: GuestDownloadProps) {
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [formatModalOpen, setFormatModalOpen] = useState<boolean>(false);
  const [, setSelectedBgLabel] = useState<string>('Hexagon Dark');

  const fileInputImageRef = useRef<HTMLInputElement>(null);
  const fileInputVideoRef = useRef<HTMLInputElement>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const bgTemplates = [
    { id: 'tpl-hex', label: 'Hexagon Dark', className: 'tpl-hex' },
    { id: 'tpl-cybercar', label: 'Cyber Street', className: 'tpl-cybercar' },
    { id: 'tpl-bluecrystal', label: 'Blue Crystal', className: 'tpl-bluecrystal' },
    { id: 'tpl-purplefracture', label: 'Neon Fracture', className: 'tpl-purplefracture' },
    { id: 'tpl-darkprism', label: 'Dark Prism', className: 'tpl-darkprism' },
    { id: 'tpl-waterfall', label: 'Mystic Cascade', className: 'tpl-waterfall' },
    { id: 'tpl-magmacrack', label: 'Purple Cracks', className: 'tpl-magmacrack' },
    { id: 'tpl-starrynight', label: 'Starry Cosmos', className: 'tpl-starrynight' },
  ];

  const insertVariable = (variableText: string) => {
    setFilePattern(filePattern ? `${filePattern}_${variableText}` : variableText);
    showToast(`Variabel ${variableText} ditambahkan`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = type === 'image' ? 2 * 1024 * 1024 : 8 * 1024 * 1024;
    if (file.size > maxSize) {
      showToast(`Ukuran file melebihi batas maksimal (${type === 'image' ? '2MB' : '8MB'})`, 'error');
      e.target.value = '';
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setCustomBgUrl(objectUrl);
    setCustomBgType(type);
    setSelectedBgLabel(`Custom ${type === 'image' ? 'Image' : 'Video'}: ${file.name}`);
    showToast(`${type === 'image' ? 'Gambar' : 'Video'} latar berhasil diterapkan!`);
  };

  const removeGuestBackground = () => {
    setCustomBgUrl(null);
    setCustomBgType(null);
    setBgClass('bg-black');
    setSelectedBgLabel('None (Solid Black)');
    showToast('Latar belakang video/gambar dihapus');
  };

  const resetToDefaults = () => {
    setHeaderText('YOUR DIGITAL ART');
    setSubText('COROAI PHOTOBOOTH');
    setWelcomeEnabled(true);
    setPopupMessage('Thank you for attending! You can now download your photos.');
    setPopupButtonText('Agree & Continue');
    setFilePattern('');
    setBgClass('tpl-hex');
    setSelectedBgLabel('Hexagon Dark');
    setCustomBgUrl(null);
    setCustomBgType(null);
    setOriginalPhotoEnabled(true);
    setDlPhotoText('DOWNLOAD PHOTO');
    setDlVideoText('DOWNLOAD VIDEO');
    setLayoutStyle('neon');
    setOrientation('portrait');
    showToast('Pengaturan dikembalikan ke default');
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
          <div className={`pointer-events-auto flex items-center gap-2.5 bg-[#16161f]/95 backdrop-blur-md border px-4 py-3 rounded-xl shadow-2xl text-xs font-medium ${
            toastMessage.type === 'error' ? 'border-red-500/70 text-red-200' : 'border-purple-500/70 text-purple-100'
          }`}>
            {toastMessage.type === 'error' ? <Info className="w-4 h-4 text-red-400 shrink-0" /> : <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Format Info Modal */}
      {formatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-[#13131a] border border-purple-500/40 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-purple-400">
                <Info className="w-5 h-5" />
                <h3 className="font-cyber text-sm tracking-wider uppercase font-bold">File Name Pattern Variables</h3>
              </div>
              <button onClick={() => setFormatModalOpen(false)} className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-5">
              {[{ tag: '[EventName]', desc: 'Nama acara aktif' }, { tag: '[Nama]', desc: 'Nama tamu' }, { tag: '[Date]', desc: 'YYYY-MM-DD' }, { tag: '[SessionID]', desc: 'ID unik sesi' }].map((v) => (
                <button key={v.tag} onClick={() => insertVariable(v.tag)} className="text-left px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-purple-500 text-xs font-mono text-purple-300">
                  {v.tag}
                  <span className="block text-[10px] font-sans text-zinc-500">{v.desc}</span>
                </button>
              ))}
            </div>
            <div className="flex justify-end">
              <button onClick={() => setFormatModalOpen(false)} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-lg">Selesai</button>
            </div>
          </div>
        </div>
      )}

      <div className="border-b border-white/10 pb-4 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-purple-400 uppercase">GUEST DOWNLOAD PAGE SETTINGS</h2>
          <p className="text-xs text-zinc-400 mt-1">This is the page guests see on their mobile devices when scanning QR code.</p>
        </div>
        <button onClick={resetToDefaults} className="text-xs text-zinc-400 hover:text-purple-300 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
          <RotateCcw className="w-3.5 h-3.5" /><span>Reset</span>
        </button>
      </div>

      {/* Page Header Text */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-zinc-400 uppercase">PAGE HEADER TEXT</label>
        <input type="text" value={headerText} onChange={(e) => setHeaderText(e.target.value)} className="w-full bg-[#130d22] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-purple-500 outline-none" />
      </div>

      {/* Sub-Text */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-zinc-400 uppercase">SUB-TEXT / INSTRUCTION</label>
        <input type="text" value={subText} onChange={(e) => setSubText(e.target.value)} className="w-full bg-[#130d22] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-purple-500 outline-none" />
      </div>

      {/* Welcome Popup Card */}
      <div className="bg-[#130d22] border border-white/10 rounded-2xl p-4 space-y-4">
        <div className="flex items-start gap-3">
          <input type="checkbox" checked={welcomeEnabled} onChange={(e) => setWelcomeEnabled(e.target.checked)} className="w-4 h-4 rounded accent-purple-600 mt-0.5 cursor-pointer" />
          <div>
            <label className="text-xs font-semibold text-white cursor-pointer">Enable Welcome Popup Message</label>
            <p className="text-[11px] text-zinc-400">Show a popup message that guests must acknowledge before viewing their photos.</p>
          </div>
        </div>
        {welcomeEnabled && (
          <div className="space-y-3 pt-2">
            <textarea rows={2} value={popupMessage} onChange={(e) => setPopupMessage(e.target.value)} className="w-full bg-[#0b061a] border border-white/10 rounded-xl p-3 text-xs text-white" />
            <input type="text" value={popupButtonText} onChange={(e) => setPopupButtonText(e.target.value)} className="w-full bg-[#0b061a] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white" />
          </div>
        )}
      </div>

      {/* File Name Pattern */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <label className="block text-xs font-semibold text-zinc-400 uppercase">FILE NAME PATTERN</label>
          <button onClick={() => setFormatModalOpen(true)} className="text-xs text-purple-400 hover:underline">Format Info</button>
        </div>
        <input type="text" value={filePattern} onChange={(e) => setFilePattern(e.target.value)} placeholder="e.g. [EventName]_[Nama]" className="w-full bg-[#130d22] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-purple-500 outline-none" />
      </div>

      {/* Background Templates */}
      <div className="space-y-3">
        <label className="block text-xs font-semibold text-zinc-400 uppercase">BACKGROUND TEMPLATES</label>
        <div className="grid grid-cols-4 gap-2">
          {bgTemplates.map((tpl) => (
            <button key={tpl.id} onClick={() => { setCustomBgUrl(null); setBgClass(tpl.id); setSelectedBgLabel(tpl.label); }} className={`h-12 rounded-lg border transition ${bgClass === tpl.id ? 'border-purple-500 shadow-md' : 'border-white/10'}`}>
              <span className="text-[10px] text-zinc-300">{tpl.label}</span>
            </button>
          ))}
        </div>
        <input ref={fileInputImageRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'image')} />
        <input ref={fileInputVideoRef} type="file" accept="video/*" className="hidden" onChange={(e) => handleFileUpload(e, 'video')} />
        <div className="flex gap-2">
          <button onClick={() => fileInputImageRef.current?.click()} className="flex-1 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold"><ImagePlus className="w-3.5 h-3.5 inline mr-1" /> UPLOAD IMAGE</button>
          <button onClick={() => fileInputVideoRef.current?.click()} className="flex-1 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold"><Film className="w-3.5 h-3.5 inline mr-1" /> UPLOAD VIDEO</button>
        </div>
        <button onClick={removeGuestBackground} className="w-full py-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-xs font-bold"><Trash2 className="w-3.5 h-3.5 inline mr-1" /> REMOVE BACKGROUND</button>
      </div>

      {/* Enable Original Photo */}
      <div className="bg-[#130d22] border border-white/10 rounded-2xl p-4 flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold text-white uppercase">ENABLE ORIGINAL PHOTO</h4>
          <p className="text-[11px] text-zinc-400">Allow guests to view and download original unedited photo.</p>
        </div>
        <button onClick={() => setOriginalPhotoEnabled(!originalPhotoEnabled)} className={`w-11 h-6 rounded-full transition-colors relative ${originalPhotoEnabled ? 'bg-purple-600' : 'bg-zinc-700'}`}>
          <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${originalPhotoEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
        </button>
      </div>

      {/* Button Texts */}
      <div className="grid grid-cols-2 gap-3">
        <input type="text" value={dlPhotoText} onChange={(e) => setDlPhotoText(e.target.value)} className="bg-[#130d22] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white" />
        <input type="text" value={dlVideoText} onChange={(e) => setDlVideoText(e.target.value)} className="bg-[#130d22] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white" />
      </div>

      {/* Layout Style */}
      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => setLayoutStyle('neon')} className={`py-2.5 rounded-xl text-xs font-bold ${layoutStyle === 'neon' ? 'bg-purple-600 text-white' : 'bg-white/5 text-zinc-400'}`}>NEON GLOW</button>
        <button onClick={() => setLayoutStyle('minimal')} className={`py-2.5 rounded-xl text-xs font-bold ${layoutStyle === 'minimal' ? 'bg-purple-600 text-white' : 'bg-white/5 text-zinc-400'}`}>MINIMAL</button>
      </div>

      {/* Save Button */}
      <button onClick={() => showToast('Pengaturan Guest Download berhasil disimpan!')} className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-bold text-xs uppercase shadow-lg">
        SAVE SETTINGS
      </button>
    </div>
  );
}