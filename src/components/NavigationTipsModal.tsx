import React from "react";
import { Hand, Volume2, ShieldCheck, ArrowDownUp, X } from "lucide-react";
import { LanguageCode } from "../types";
import { APP_TRANSLATIONS } from "../data/translations";
import { speakText, stopSpeech } from "../utils/speech";

interface NavigationTipsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageCode;
}

export const NavigationTipsModal: React.FC<NavigationTipsModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const t = APP_TRANSLATIONS[language] || APP_TRANSLATIONS.hi;

  if (!isOpen) return null;

  const tipText = `${t.tip1Title}: ${t.tip1Desc}. ${t.tip2Title}: ${t.tip2Desc}. ${t.tip3Title}: ${t.tip3Desc}. ${t.tip4Title}: ${t.tip4Desc}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl p-6 text-stone-100 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <Hand className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white">{t.phoneTipsTitle}</h3>
          </div>
          <button
            onClick={() => {
              stopSpeech();
              onClose();
            }}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex gap-3 p-3 bg-stone-800/80 rounded-2xl border border-stone-700/60">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Hand className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-stone-100 text-sm mb-0.5">{t.tip1Title}</h4>
              <p className="text-stone-300 leading-relaxed">
                {t.tip1Desc}
              </p>
            </div>
          </div>

          <div className="flex gap-3 p-3 bg-stone-800/80 rounded-2xl border border-stone-700/60">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-stone-100 text-sm mb-0.5">{t.tip2Title}</h4>
              <p className="text-stone-300 leading-relaxed">
                {t.tip2Desc}
              </p>
            </div>
          </div>

          <div className="flex gap-3 p-3 bg-stone-800/80 rounded-2xl border border-stone-700/60">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
              <ArrowDownUp className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-stone-100 text-sm mb-0.5">{t.tip3Title}</h4>
              <p className="text-stone-300 leading-relaxed">
                {t.tip3Desc}
              </p>
            </div>
          </div>

          <div className="flex gap-3 p-3 bg-stone-800/80 rounded-2xl border border-stone-700/60">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-stone-100 text-sm mb-0.5">{t.tip4Title}</h4>
              <p className="text-stone-300 leading-relaxed">
                {t.tip4Desc}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-2 flex gap-2">
          <button
            onClick={() => speakText(tipText, language)}
            className="flex-1 py-2.5 bg-stone-800 hover:bg-stone-700 text-amber-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border border-stone-700"
          >
            <Volume2 className="w-4 h-4" />
            <span>{t.listenInVoice}</span>
          </button>
          <button
            onClick={() => {
              stopSpeech();
              onClose();
            }}
            className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-xs font-bold"
          >
            {t.tipsOkBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
