import React, { Suspense } from 'react';
import NavbarEvent from '@/components/event/NavbarEvent';
import { EventSettingsSaveProvider } from '@/components/event/EventSettingsContext';
import { requireSession } from '@/lib/auth-guard';

async function SettingsAuthGuard({ children }: { children: React.ReactNode }) {
  await requireSession(['admin', 'user']);
  return (
    <EventSettingsSaveProvider>
      <NavbarEvent />
      <main className="flex-1">{children}</main>
    </EventSettingsSaveProvider>
  );
}

export default function SettingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#070312] text-gray-400 flex items-center justify-center text-sm">
          Memverifikasi akses pengaturan...
        </div>
      }
    >
      <SettingsAuthGuard>{children}</SettingsAuthGuard>
    </Suspense>
  );
}
