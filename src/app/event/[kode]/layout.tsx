import React, { Suspense } from "react";
import { requireSession } from "@/lib/auth-guard";

async function EventCodeAuthGuard({
  params,
  children,
}: {
  params: Promise<{ kode: string }>;
  children: React.ReactNode;
}) {
  const { kode } = await params;
  await requireSession(["admin", "user", "event_guest"], { eventCode: kode });
  return <>{children}</>;
}

export default function EventCodeLayout({
  params,
  children,
}: {
  params: Promise<{ kode: string }>;
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#07050d] text-gray-400 flex items-center justify-center text-sm">
          Memverifikasi akses sesi event...
        </div>
      }
    >
      <EventCodeAuthGuard params={params}>{children}</EventCodeAuthGuard>
    </Suspense>
  );
}
