import React from 'react';
import { notFound } from 'next/navigation';
import akunData from '@/data/daftarAkun.json';
import EventDetailClient from './EventDetailClient';

interface PageProps {
  params: Promise<{
    code: string;
  }>;
}

export default async function EventDetailPage({ params }: PageProps) {
  // Wajib melakukan await pada params di Next.js App Router versi terbaru
  const resolvedParams = await params;
  const kode = String(resolvedParams.code || '').trim().toUpperCase();

  // Validasi data berdasarkan JSON
  const currentEvent = akunData.events.find(ev => ev.code.toUpperCase() === kode);

  // Jika kode event tidak terdaftar, lempar ke not-found.tsx
  if (!currentEvent) {
    notFound();
  }

  return <EventDetailClient eventData={currentEvent} kode={kode} />;
}