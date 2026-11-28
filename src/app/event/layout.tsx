import React, { Suspense } from "react";
import { requireSession } from "@/lib/auth-guard";

async function EventAuthGuard({ children }: { children: React.ReactNode }) {
  await requireSession(["admin", "user", "event_guest"]);
  return <>{children}</>;
}

export default function EventLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#07050d] text-gray-400 flex items-center justify-center text-sm">
          Memverifikasi akses event...
        </div>
      }
    >
      <EventAuthGuard>{children}</EventAuthGuard>
    </Suspense>
  );
}
