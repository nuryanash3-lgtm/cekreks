"use client";

import { QrCode } from "lucide-react";

export default function RemoteApp() {
  const remoteUrl = "https://booth.cordai.app/remote/2f9edd62-cf25-434a-afcd-85df1dde7551";

  return (
    <div className="space-y-6 pb-4 flex flex-col items-center justify-center h-full text-center">
      <div>
        <h2 className="text-xs font-bold tracking-wider text-purple-400 uppercase mb-1">
          REMOTE APP
        </h2>
        <p className="text-xs text-gray-400">
          Scan this QR code with your phone to use it as a remote control for the photobooth.
        </p>
      </div>

      {/* Kotak QR Code Container */}
      <div className="bg-[#130d22] border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center shadow-inner my-2 w-full max-w-md">
        <div className="bg-white p-4 rounded-xl shadow-lg border border-white/20 flex items-center justify-center">
          {/* Mockup QR Code menggunakan SVG / Icon atau Gambar QR asli */}
          <div className="w-48 h-48 bg-white flex items-center justify-center relative">
            {/* Simulasi QR Code pattern artistik */}
            <div className="absolute inset-2 border-4 border-black flex flex-col justify-between p-2">
              <div className="flex justify-between">
                <div className="w-10 h-10 bg-black border-2 border-white"></div>
                <div className="w-10 h-10 bg-black border-2 border-white"></div>
              </div>
              <div className="flex justify-between items-end">
                <div className="w-10 h-10 bg-black border-2 border-white"></div>
                <div className="w-6 h-6 bg-black"></div>
              </div>
            </div>
            <div className="absolute inset-6 bg-black/90 m-6 flex items-center justify-center">
              <QrCode className="w-16 h-16 text-white" />
            </div>
          </div>
        </div>

        {/* URL Link Remote */}
        <div className="mt-6 w-full">
          <a
            href={remoteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-gray-400 hover:text-purple-300 break-all transition-colors underline decoration-white/20 hover:decoration-purple-300"
          >
            {remoteUrl}
          </a>
        </div>
      </div>
    </div>
  );
}