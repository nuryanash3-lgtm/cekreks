"use client";

import { useState } from "react";

export default function DataMaintenance() {
  const [isCleared, setIsCleared] = useState(false);

  const handleClearCache = () => {
    setIsCleared(true);
    // Tambahkan logika hapus cache / API di sini jika diperlukan
    setTimeout(() => setIsCleared(false), 3000); // Reset status setelah 3 detik
  };

  return (
    <div className="space-y-6 pb-4">
      {/* Card Data & Maintenance */}
      <div className="bg-[#130d22] border border-white/10 rounded-2xl p-6 flex flex-col justify-between space-y-4">
        <div>
          <p className="text-xs text-gray-400">
            Clear temporary photo cache, reset session databases, or export event log diagnostic files.
          </p>
        </div>

        <div>
          <button
            onClick={handleClearCache}
            className="px-5 py-3 rounded-xl bg-[#ff2a85]/20 border border-[#ff2a85]/50 text-[#ff2a85] hover:bg-[#ff2a85] hover:text-white text-xs font-black tracking-wider transition-all cursor-pointer shadow-[0_0_15px_rgba(255,42,133,0.2)]"
          >
            {isCleared ? "CACHE CLEARED SUCCESSFULLY!" : "CLEAR SESSION CACHE"}
          </button>
        </div>
      </div>
    </div>
  );
}