'use client';

import React, { useState } from 'react';
import { Download, Clock } from 'lucide-react';

const initialLogs = [
  {
    id: 'LOG-1001',
    user: 'Budi Santoso',
    activity: 'Generate AI Photo (Cyberpunk Style)',
    tokens: '-5',
    status: 'Success',
    time: '18 Mei 2026, 14:20:15',
    ip: '182.253.44.12'
  },
  {
    id: 'LOG-1002',
    user: 'Rian Pratama',
    activity: 'Top-up Token (Budi Santoso +500)',
    tokens: '0',
    status: 'Success',
    time: '18 Mei 2026, 13:45:00',
    ip: '36.85.12.90'
  },
  {
    id: 'LOG-1003',
    user: 'Siti Rahma',
    activity: 'Generate AI Photo (Vintage Wedding)',
    tokens: '-5',
    status: 'Success',
    time: '18 Mei 2026, 11:05:22',
    ip: '114.124.205.8'
  },
  {
    id: 'LOG-1004',
    user: 'Studio Kreatif Bali',
    activity: 'Failed Generation (API Timeout)',
    tokens: '0',
    status: 'Failed',
    time: '17 Mei 2026, 18:30:10',
    ip: '180.252.88.5'
  },
  {
    id: 'LOG-1005',
    user: 'Dewi Lestari',
    activity: 'Login Attempt (Account Suspended)',
    tokens: '0',
    status: 'Denied',
    time: '10 Mei 2026, 09:12:00',
    ip: '202.152.19.4'
  },
];

export default function ActivityLogsPage() {
  const [logs] = useState(initialLogs);

  const handleExportCSV = () => {
    alert('Mengunduh laporan log aktivitas dalam format CSV...');
  };

  return (
    <div className="p-4 md:p-8 text-white min-h-screen">
      
      {/* HEADER PAGE */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-wide">
            Rekapan & Activity Logs
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Audit trail pengguna yang menguji dan menggunakan webapp AI photobooth.
          </p>
        </div>
        <button 
          onClick={handleExportCSV}
          className="px-5 py-2.5 text-xs font-bold uppercase bg-[#161324] hover:bg-white/10 border border-white/10 rounded-xl transition flex items-center justify-center gap-2 self-start md:self-auto shadow-lg"
        >
          <Download className="w-4 h-4 text-purple-400" /> Ekspor Laporan (CSV)
        </button>
      </div>

      {/* SECTION: REAL-TIME ACCESS STREAM */}
      <div className="bg-[#0d0b14] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        
        {/* Table Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#13111c]/50 text-xs text-gray-400">
          <div className="flex items-center gap-2 font-medium text-gray-300">
            <Clock className="w-4 h-4 text-purple-400" /> Real-Time Access Stream
          </div>
          <span className="text-[11px] font-mono text-gray-500">Menampilkan 5 aktivitas terakhir</span>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-[11px] text-gray-400 uppercase tracking-wider">
                <th className="py-4 px-6">ID Log</th>
                <th className="py-4 px-6">Pengguna</th>
                <th className="py-4 px-6">Aktivitas / Event</th>
                <th className="py-4 px-6">Token Digunakan</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Waktu</th>
                <th className="py-4 px-6">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-white/[0.02] transition">
                  <td className="py-4 px-6 font-mono text-gray-400">{log.id}</td>
                  <td className="py-4 px-6 font-bold text-white">{log.user}</td>
                  <td className="py-4 px-6 text-gray-300">{log.activity}</td>
                  <td className="py-4 px-6 font-bold font-mono text-yellow-400">{log.tokens}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${
                      log.status === 'Success' 
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                        : log.status === 'Failed'
                        ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                        : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-400 font-mono text-[11px]">{log.time}</td>
                  <td className="py-4 px-6 text-gray-400 font-mono text-[11px]">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}