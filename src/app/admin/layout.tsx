import React, { Suspense } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import { requireSession } from '@/lib/auth-guard';

async function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  await requireSession(['admin']);
  return <AdminShell>{children}</AdminShell>;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#07050d] text-gray-400 flex items-center justify-center text-sm">
          Memverifikasi sesi admin...
        </div>
      }
    >
      <AdminAuthGuard>{children}</AdminAuthGuard>
    </Suspense>
  );
}
