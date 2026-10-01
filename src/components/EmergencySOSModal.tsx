import React, { useState, useEffect } from "react";
import { PhoneCall, AlertTriangle, Volume2, VolumeX, EyeOff, X, ShieldAlert, HeartPulse } from "lucide-react";
import { LanguageCode } from "../types";
import { startEmergencySiren, stopEmergencySiren, speakText, stopSpeech } from "../utils/speech";
import { LANGUAGES } from "../data/languages";
import { APP_TRANSLATIONS } from "../data/translations";

interface EmergencySOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageCode;
  onTriggerDiscreet: () => void;
}

export const EmergencySOSModal: React.FC<EmergencySOSModalProps> = ({
  isOpen,
  onClose,
  language,
  onTriggerDiscreet,
}) => {
  const [isSirenOn, setIsSirenOn] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [selectedEmergencyType, setSelectedEmergencyType] = useState<string | null>(null);

  const t = APP_TRANSLATIONS[language] || APP_TRANSLATIONS.hi;

  useEffect(() => {
    if (!isOpen) {
      if (isSirenOn) {
        stopEmergencySiren();
        setIsSirenOn(false);
      }
      stopSpeech();
      setAiAdvice(null);
      setSelectedEmergencyType(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleSiren = () => {
    if (isSirenOn) {
      stopEmergencySiren();
      setIsSirenOn(false);
    } else {
      startEmergencySiren();
      setIsSirenOn(true);
    }
  };

  const handleAskEmergencyAi = async (issueType: string, promptText: string) => {
    setSelectedEmergencyType(issueType);
    setIsLoadingAi(true);
    stopSpeech();

    try {
      const res = await fetch("/api/ai/emergency", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emergencyType: issueType + ": " + promptText,
          language: LANGUAGES[language].name,
        }),
      });

      const data = await res.json();
      const speech = data.urgentSpeech || "तुरंत 112 या 1091 पर मुफ्त कॉल करें।";
      setAiAdvice(speech);
      speakText(speech, language);
    } catch (e) {
      const fallback = "घबराएं नहीं। तुरंत 112 या 1091 पर मुफ्त कॉल करें। रोशनी वाली जगह में जाएं।";
      setAiAdvice(fallback);
      speakText(fallback, language);
    } finally {
      setIsLoadingAi(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-stone-900 border border-red-800/60 rounded-t-3xl sm:rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Top Emergency Bar */}
        <div className="bg-red-700 text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 bg-red-900/60 rounded-full animate-pulse">
              <AlertTriangle className="w-5 h-5 text-white" />
            </span>
            <div>
              <h2 className="text-base font-bold tracking-tight">{t.sosModalTitle}</h2>
              <p className="text-[11px] text-red-100">{t.sosModalSub}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onTriggerDiscreet}
              className="p-2 bg-red-900 hover:bg-red-800 rounded-xl text-white transition-colors"
              title={t.discreetModeTitle}
            >
              <EyeOff className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if (isSirenOn) stopEmergencySiren();
                stopSpeech();
                onClose();
              }}
              className="p-2 bg-red-900 hover:bg-red-800 rounded-xl text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-5 text-stone-100">
          {/* Siren Button */}
          <div className="text-center bg-stone-800/80 rounded-2xl p-4 border border-red-900/40">
            <p className="text-xs text-stone-300 mb-2 font-medium">
              {t.sirenDesc}
            </p>
            <button
              onClick={toggleSiren}
              className={`w-full py-3.5 px-4 rounded-xl flex items-center justify-center gap-2.5 font-bold text-base transition-all ${
                isSirenOn
                  ? "bg-red-600 text-white animate-bounce shadow-lg shadow-red-600/50"
                  : "bg-red-950/70 border border-red-700 text-red-300 hover:bg-red-900"
              }`}
            >
              {isSirenOn ? (
                <>
                  <VolumeX className="w-5 h-5" />
                  <span>{t.stopSirenBtn}</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-5 h-5" />
                  <span>{t.startSirenBtn}</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Helpline Numbers - Direct Click-to-Call */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2.5">
              {t.quickHelplines}
            </h3>
            <div className="grid grid-cols-2 gap-2.5">
              <a
                href="tel:1091"
                className="flex items-center gap-3 p-3.5 bg-red-950/60 border border-red-800/80 rounded-xl hover:bg-red-900/80 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center shrink-0 shadow-md">
                  <PhoneCall className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-base font-bold text-white">1091</div>
                  <div className="text-[11px] text-red-200">{t.womenHelpline}</div>
                </div>
              </a>

              <a
                href="tel:112"
                className="flex items-center gap-3 p-3.5 bg-red-950/60 border border-red-800/80 rounded-xl hover:bg-red-900/80 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center shrink-0 shadow-md">
                  <ShieldAlert className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-base font-bold text-white">112</div>
                  <div className="text-[11px] text-red-200">{t.policeEmergency}</div>
                </div>
              </a>

              <a
                href="tel:181"
                className="flex items-center gap-3 p-3.5 bg-stone-800 border border-stone-700 rounded-xl hover:bg-stone-700 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center shrink-0">
                  <PhoneCall className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-base font-bold text-white">181</div>
                  <div className="text-[11px] text-amber-200">{t.distressHelpline}</div>
                </div>
              </a>

              <a
                href="tel:108"
                className="flex items-center gap-3 p-3.5 bg-stone-800 border border-stone-700 rounded-xl hover:bg-stone-700 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center shrink-0">
                  <HeartPulse className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-base font-bold text-white">108</div>
                  <div className="text-[11px] text-emerald-200">{t.ambulance}</div>
                </div>
              </a>
            </div>
          </div>

          {/* Emergency Inbuilt AI Assistance */}
          <div className="bg-stone-800/60 rounded-2xl p-4 border border-stone-700">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
              {t.emergencyAiTitle}
            </h3>
            <p className="text-xs text-stone-300 mb-3">
              {t.emergencyAiDesc}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={() =>
                  handleAskEmergencyAi(
                    "domestic_violence",
                    "घर में मारपीट या हिंसा हो रही है, मुझे क्या करना चाहिए?"
                  )
                }
                className="px-3 py-2.5 rounded-xl bg-stone-700/80 hover:bg-stone-600 text-xs font-medium text-left border border-stone-600 text-stone-100"
              >
                {t.domesticViolenceBtn}
              </button>
              <button
                onClick={() =>
                  handleAskEmergencyAi(
                    "stalking_harassment",
                    "रास्ते में कोई पीछा कर रहा है या परेशान कर रहा है"
                  )
                }
                className="px-3 py-2.5 rounded-xl bg-stone-700/80 hover:bg-stone-600 text-xs font-medium text-left border border-stone-600 text-stone-100"
              >
                {t.harassmentBtn}
              </button>
              <button
                onClick={() =>
                  handleAskEmergencyAi(
                    "medical_pain",
                    "अचानक बहुत तेज पेट दर्द या ब्लीडिंग हो रही है"
                  )
                }
                className="px-3 py-2.5 rounded-xl bg-stone-700/80 hover:bg-stone-600 text-xs font-medium text-left border border-stone-600 text-stone-100"
              >
                {t.medicalPainBtn}
              </button>
            </div>

            {isLoadingAi && (
              <div className="mt-3 text-xs text-amber-300 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
                <span>{t.emergencyAiLoading}</span>
              </div>
            )}

            {aiAdvice && !isLoadingAi && (
              <div className="mt-3 p-3.5 bg-amber-950/50 border border-amber-600/60 rounded-xl text-xs text-amber-100 space-y-2">
                <div className="font-semibold text-amber-300 flex items-center justify-between">
                  <span>{t.sakhiEmergencyMsg}</span>
                  <button
                    onClick={() => speakText(aiAdvice, language)}
                    className="flex items-center gap-1 text-[11px] underline text-amber-200"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{t.listenAgain}</span>
                  </button>
                </div>
                <p className="leading-relaxed">{aiAdvice}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
