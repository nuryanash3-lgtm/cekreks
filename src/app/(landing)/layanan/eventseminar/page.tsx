"use client";

import EventsHero from "@/components/landing/eventseminar/eventsHero";
import EventsScope from "@/components/landing/eventseminar/eventsScope";
import EventsAlbum from "@/components/landing/eventseminar/eventsAlbum";
import EventsPricing from "@/components/landing/eventseminar/eventsPricing";

export default function EventsDetailPage() {
  return (
    <div className="min-h-screen bg-[#0b0518] text-white selection:bg-cyan-500 selection:text-black relative">
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-10 left-1/4 w-[500px] h-[350px] bg-cyan-500/10 rounded-full blur-[140px]" />
        <div className="absolute top-[40%] right-[-5%] w-[450px] h-[450px] bg-purple-600/15 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-[100rem] mx-auto px-5 sm:px-6 pt-10 pb-24">
        <EventsHero />
        <EventsScope />
        <EventsAlbum />
        <EventsPricing />
      </div>
    </div>
  );
}