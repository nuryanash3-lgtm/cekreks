import { Camera } from "lucide-react";
import { PHOTOBOOTH_SERVICES_SCOPE } from "@/constants/photoboothData";

export default function PhotoboothScope() {
  return (
    <section className="py-16">
      <div className="text-left mb-10">
        <span className="text-xs font-bold tracking-widest uppercase text-cyan-400">
          Cakupan Layanan
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
          Layanan Photobooth Kami Meliputi
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PHOTOBOOTH_SERVICES_SCOPE.map((service, idx) => (
          <div
            key={idx}
            className="rounded-2xl bg-[#140b2b]/90 border border-white/10 overflow-hidden hover:border-cyan-400/50 transition-all duration-300 flex flex-col"
          >
            <div className="relative h-44 w-full bg-[#1c0f3d] flex items-center justify-center">
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-black/60 border border-cyan-400/30 text-cyan-300">
                  {service.tag}
                </span>
              </div>
              <Camera className="w-8 h-8 opacity-40 text-cyan-400" />
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {service.title}
                </h3>
                <p className="mt-2 text-xs text-gray-400 leading-relaxed">
                  {service.desc}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}