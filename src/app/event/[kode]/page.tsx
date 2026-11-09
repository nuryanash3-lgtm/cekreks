import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import akunData from '@/data/daftarAkun.json';
import EventDetailClient from './EventDetailClient';

interface PageProps {
  params: Promise<{
    code: string;
  }>;
}

export async function generateStaticParams() {
  return akunData.events.map((ev) => ({
    code: ev.code,
  }));
}

// Komponen terpisah untuk menangani async params di dalam Suspense
async function EventContent({ params }: PageProps) {
  const resolvedParams = await params;
  const kode = String(resolvedParams.code || '').trim().toUpperCase();

  const currentEvent = akunData.events.find(ev => ev.code.toUpperCase() === kode);

  if (!currentEvent) {
    notFound();
  }

  return <EventDetailClient eventData={currentEvent} kode={kode} />;
}

export default function EventDetailPage({ params }: PageProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#07050d] text-white p-10 flex items-center justify-center">Memuat event...</div>}>
      <EventContent params={params} />
    </Suspense>
  );
}