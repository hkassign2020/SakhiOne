import React, { useState } from "react";
import { Navigation, ExternalLink, HeartHandshake, Baby, Building2, Store, Shield, Volume2, VolumeX, Sparkles, MapPin } from "lucide-react";
import { EssentialSpot, LanguageCode } from "../types";
import { ESSENTIAL_SPOTS } from "../data/essentials";
import { APP_TRANSLATIONS } from "../data/translations";
import { speakText, stopSpeech } from "../utils/speech";

interface EssentialsMapViewProps {
  language: LanguageCode;
}

export const EssentialsMapView: React.FC<EssentialsMapViewProps> = ({ language }) => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const t = APP_TRANSLATIONS[language] || APP_TRANSLATIONS.hi;

  const handleListen = (spot: EssentialSpot) => {
    if (playingId === spot.id) {
      stopSpeech();
      setPlayingId(null);
      return;
    }

    const script =
      spot.description[language] ||
      spot.description.hi ||
      "नजदीकी केंद्र पर जाने के लिए गूगल नक्शा बटन दबाएं।";

    setPlayingId(spot.id);
    speakText(
      script,
      language,
      () => {},
      () => setPlayingId(null)
    );
  };

  const getSpotIcon = (category: string) => {
    switch (category) {
      case "pads":
        return HeartHandshake;
      case "anganwadi":
        return Baby;
      case "maternity":
        return Building2;
      case "medical":
        return Store;
      case "police":
        return Shield;
      default:
        return MapPin;
    }
  };

  const openGoogleMaps = (query: string) => {
    const encoded = encodeURIComponent(query);
    const url = `https://www.google.com/maps/search/?api=1&query=${encoded}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Featured Jan Aushadhi ₹1 Pad Banner */}
      <div className="bg-gradient-to-br from-rose-700 via-rose-800 to-pink-900 rounded-3xl p-5 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-md">
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1 bg-white/20 rounded-md">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-md">
              {t.padsBannerTag}
            </span>
          </div>

          <h2 className="text-xl font-bold mb-1">{t.padsBannerTitle}</h2>
          <p className="text-xs text-rose-100 leading-relaxed mb-4">
            {t.padsBannerDesc}
          </p>

          <button
            onClick={() =>
              openGoogleMaps("Pradhan Mantri Bhartiya Janaushadhi Kendra near me sanitary pads")
            }
            className="inline-flex items-center gap-2 px-4 py-3 bg-white text-rose-900 rounded-2xl text-xs font-bold hover:bg-rose-50 shadow-md transition-all active:scale-95"
          >
            <Navigation className="w-4 h-4 text-rose-700" />
            <span>{t.padsBannerBtn}</span>
          </button>
        </div>

        <div className="absolute -bottom-6 -right-6 opacity-15 pointer-events-none text-white">
          <HeartHandshake className="w-48 h-48" />
        </div>
      </div>

      {/* Intro text */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
            {t.spotsHeading}
          </h3>
          <p className="text-[11px] text-stone-500">
            {t.spotsSubheading}
          </p>
        </div>
      </div>

      {/* Spot Cards */}
      <div className="space-y-4">
        {ESSENTIAL_SPOTS.map((spot) => {
          const IconComp = getSpotIcon(spot.category);
          const isPlaying = playingId === spot.id;
          const spotName = spot.names[language] || spot.names.hi;
          const spotBadge = spot.badges[language] || spot.badges.hi;
          const spotPrice = spot.prices?.[language] || spot.prices?.hi;
          const desc = spot.description[language] || spot.description.hi;

          return (
            <div
              key={spot.id}
              className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow relative"
            >
              <div className="flex items-start justify-between gap-3 mb-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 flex items-center justify-center shrink-0 text-rose-700 dark:text-rose-400">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
                        {spotBadge}
                      </span>
                      {spotPrice && (
                        <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full">
                          {spotPrice}
                        </span>
                      )}
                    </div>
                    <h4 className="text-base font-bold text-stone-900 dark:text-stone-100">
                      {spotName}
                    </h4>
                  </div>
                </div>

                <button
                  onClick={() => handleListen(spot)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isPlaying
                      ? "bg-red-600 text-white animate-pulse"
                      : "bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200"
                  }`}
                  title={t.listenBtn}
                >
                  {isPlaying ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  <span>{isPlaying ? t.stopBtn : t.listenBtn}</span>
                </button>
              </div>

              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed mb-4">
                {desc}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-stone-100 dark:border-stone-800">
                <button
                  onClick={() => openGoogleMaps(spot.mapsQuery)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-rose-700 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>{t.mapsRouteBtn}</span>
                </button>

                {spot.officialSchemeRef && (
                  <a
                    href={spot.officialSchemeRef}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-stone-600 dark:text-stone-400 hover:text-stone-900 underline"
                  >
                    <span>{t.govInfoBtn}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
