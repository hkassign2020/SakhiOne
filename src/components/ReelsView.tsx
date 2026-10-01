import React, { useState, useEffect } from "react";
import { Play, Pause, ChevronUp, ChevronDown, Heart, Volume2, VolumeX, ShieldCheck, CheckCircle2 } from "lucide-react";
import { LanguageCode } from "../types";
import { REEL_VIDEOS } from "../data/reels";
import { APP_TRANSLATIONS } from "../data/translations";
import { speakText, stopSpeech } from "../utils/speech";

interface ReelsViewProps {
  language: LanguageCode;
  onNavigateTab: (tab: string) => void;
}

export const ReelsView: React.FC<ReelsViewProps> = ({ language, onNavigateTab }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  const t = APP_TRANSLATIONS[language] || APP_TRANSLATIONS.hi;
  const currentReel = REEL_VIDEOS[currentIndex];

  const handleNext = () => {
    stopSpeech();
    setIsPlayingAudio(false);
    if (currentIndex < REEL_VIDEOS.length - 1) {
      setCurrentIndex((p) => p + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    stopSpeech();
    setIsPlayingAudio(false);
    if (currentIndex > 0) {
      setCurrentIndex((p) => p - 1);
    } else {
      setCurrentIndex(REEL_VIDEOS.length - 1);
    }
  };

  const toggleAudio = () => {
    if (isPlayingAudio) {
      stopSpeech();
      setIsPlayingAudio(false);
    } else {
      const script =
        currentReel.transcript[language] ||
        currentReel.transcript.hi;
      setIsPlayingAudio(true);
      speakText(
        script,
        language,
        () => {},
        () => setIsPlayingAudio(false)
      );
    }
  };

  const toggleLike = (id: string) => {
    setLikedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAction = () => {
    if (currentReel.id === "reel_1_pads") {
      onNavigateTab("essentials");
    } else if (currentReel.id === "reel_2_mudra") {
      onNavigateTab("schemes");
    }
  };

  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  const reelTitle = currentReel.titles[language] || currentReel.titles.hi;
  const reelSpeaker = currentReel.speakerRoles[language] || currentReel.speakerRoles.hi;
  const reelTakeaway = currentReel.takeaways[language] || currentReel.takeaways.hi;
  const reelAction = currentReel.actionTexts[language] || currentReel.actionTexts.hi;

  return (
    <div className="pb-20 max-w-md mx-auto">
      {/* Reel Card Container */}
      <div
        className={`relative w-full aspect-[9/16] min-h-[520px] max-h-[640px] rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-b ${currentReel.colorGradient} text-white flex flex-col justify-between p-5 select-none transition-all duration-300`}
      >
        {/* Top Header in Reel */}
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span className="p-1 bg-white/20 backdrop-blur-md rounded-full">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
            </span>
            <div className="text-left">
              <span className="text-[11px] font-bold text-white block">
                {reelSpeaker}
              </span>
              <span className="text-[10px] text-white/70">
                {t.verifiedGov} ({currentIndex + 1}/{REEL_VIDEOS.length})
              </span>
            </div>
          </div>

          <button
            onClick={toggleAudio}
            className={`p-2.5 rounded-full backdrop-blur-md transition-all ${
              isPlayingAudio ? "bg-red-600 text-white" : "bg-white/20 text-white hover:bg-white/30"
            }`}
            title={t.listenBtn}
          >
            {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Center Animated Visual / Reel Avatar */}
        <div className="my-auto text-center z-10 space-y-3">
          <div className="relative inline-block">
            <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-lg border-2 border-white/30 flex items-center justify-center mx-auto shadow-2xl">
              <button
                onClick={toggleAudio}
                className="w-14 h-14 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 flex items-center justify-center transition-transform active:scale-95 shadow-lg"
              >
                {isPlayingAudio ? (
                  <Pause className="w-6 h-6 fill-current" />
                ) : (
                  <Play className="w-6 h-6 fill-current ml-0.5" />
                )}
              </button>
            </div>

            {isPlayingAudio && (
              <div className="flex justify-center items-center gap-1 mt-3">
                {[12, 24, 16, 28, 10, 20].map((h, i) => (
                  <span
                    key={i}
                    style={{ height: `${h}px` }}
                    className="w-1 bg-amber-400 rounded-full animate-pulse"
                  />
                ))}
              </div>
            )}
          </div>

          <h3 className="text-lg font-extrabold tracking-tight px-2 leading-snug drop-shadow-md">
            {reelTitle}
          </h3>

          <div className="p-3 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 text-left text-xs space-y-1.5 max-w-xs mx-auto">
            <div className="font-semibold text-amber-300 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{t.keyTakeaway}</span>
            </div>
            <p className="text-white/90 leading-relaxed font-medium">
              {reelTakeaway}
            </p>
          </div>
        </div>

        {/* Right Floating Actions (Like, Share, Swipe Up/Down) */}
        <div className="absolute right-4 bottom-24 flex flex-col items-center gap-3 z-20">
          <button
            onClick={() => toggleLike(currentReel.id)}
            className="flex flex-col items-center gap-1 p-2 rounded-full bg-black/30 backdrop-blur-md hover:bg-black/50 text-white transition-all active:scale-90"
          >
            <Heart
              className={`w-6 h-6 ${
                likedMap[currentReel.id] ? "fill-rose-500 text-rose-500" : "text-white"
              }`}
            />
            <span className="text-[10px] font-bold">
              {likedMap[currentReel.id] ? currentReel.likes + 1 : currentReel.likes}
            </span>
          </button>

          <button
            onClick={handlePrev}
            className="p-2 rounded-full bg-black/30 backdrop-blur-md hover:bg-black/50 text-white transition-transform active:scale-90"
            title={t.previousReel}
          >
            <ChevronUp className="w-5 h-5" />
          </button>

          <button
            onClick={handleNext}
            className="p-2 rounded-full bg-amber-500 text-stone-950 font-bold hover:bg-amber-400 transition-transform active:scale-90 shadow-lg"
            title={t.nextReel}
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>

        {/* Bottom CTA / Action Bar */}
        <div className="z-10 pt-2">
          <button
            onClick={handleAction}
            className="w-full py-3 bg-white text-stone-950 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 hover:bg-amber-100 transition-all shadow-xl active:scale-[0.98]"
          >
            <span>{reelAction}</span>
          </button>

          <div className="flex items-center justify-between text-[11px] text-white/60 px-1 pt-2">
            <span>{t.swipeHint}</span>
            <span>{currentReel.views} {t.watchedCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
