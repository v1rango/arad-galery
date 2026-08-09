"use client";

import { MapPin, Navigation, ExternalLink } from "lucide-react";

const STORE_LOCATION = {
  latitude: 35.72585016289182,
  longitude: 51.18738936292314,
  title: "آراد گالری",
  address: "تهران، منطقه ۲۱، شهرک چیتگر شمالی، خیابان جهاد، نبش کوچه صفین",
};

export default function StoreMap() {
  const mapSrc = `https://neshan.org/maps/embed#c${STORE_LOCATION.latitude}-${STORE_LOCATION.longitude}-18z-0p`;
  const neshanUrl = `https://neshan.org/maps/@${STORE_LOCATION.latitude},${STORE_LOCATION.longitude},18z,0p`;
  const directionUrl = `https://neshan.org/maps/routing/car/destination/${STORE_LOCATION.latitude},${STORE_LOCATION.longitude}`;

  return (
    <div className="relative w-full h-full">
      <iframe
        src={mapSrc}
        className="w-full h-full border-0"
        loading="lazy"
        title="موقعیت آراد گالری"
        allowFullScreen
      />

      <div className="absolute top-4 right-4 bg-white/95 dark:bg-black/95 backdrop-blur-md rounded-2xl shadow-2xl border border-royal-500/20 p-4 max-w-[280px] z-10">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-royal-500 to-blush-500 flex items-center justify-center shrink-0">
            <MapPin size={18} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-black text-gray-900 dark:text-white mb-1">
              {STORE_LOCATION.title}
            </h4>
            <p className="text-[11px] text-gray-500 leading-5">
              {STORE_LOCATION.address}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <a
            href={directionUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-xl bg-gradient-to-l from-royal-500 to-blush-500 text-white text-[11px] font-bold hover:shadow-lg transition-all"
          >
            <Navigation size={14} />
            <span>مسیریابی</span>
          </a>
          <a
            href={neshanUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl bg-royal-500/10 text-royal-500 text-[11px] font-bold hover:bg-royal-500/20 transition-all"
            title="مشاهده در نشان"
          >
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}