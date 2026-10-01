import React, { useState, useEffect } from "react";
import {
  Mic,
  AlertTriangle,
  EyeOff,
  HelpCircle,
  Compass,
  FileText,
  Heart,
  Scissors,
  Tv,
  Users,
  Volume2,
  VolumeX,
  Sparkles,
  Globe,
  ChevronDown,
} from "lucide-react";
import { LanguageCode } from "./types";
import { LANGUAGES, UI_STRINGS } from "./data/languages";
import { APP_TRANSLATIONS } from "./data/translations";
import { SchemesView } from "./components/SchemesView";
import { EssentialsMapView } from "./components/EssentialsMapView";
import { SkillsView } from "./components/SkillsView";
import { ReelsView } from "./components/ReelsView";
import { SaheliCircleView } from "./components/SaheliCircleView";
import { VoiceAssistantModal } from "./components/VoiceAssistantModal";
import { EmergencySOSModal } from "./components/EmergencySOSModal";
import { DiscreetMode } from "./components/DiscreetMode";
import { AppTourModal } from "./components/AppTourModal";
import { NavigationTipsModal } from "./components/NavigationTipsModal";
import { speakText, stopSpeech, playChime } from "./utils/speech";

export default function App() {
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>("hi");
  const [activeTab, setActiveTab] = useState<
    "schemes" | "essentials" | "skills" | "reels" | "circle"
  >("schemes");

  // Modals
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isDiscreetActive, setIsDiscreetActive] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [isTipsOpen, setIsTipsOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isSpeakingGreeting, setIsSpeakingGreeting] = useState(false);

  const langInfo = LANGUAGES[selectedLanguage] || LANGUAGES.hi;
  const strings = UI_STRINGS[selectedLanguage] || UI_STRINGS.hi;
  const t = APP_TRANSLATIONS[selectedLanguage] || APP_TRANSLATIONS.hi;

  // Speak welcome when language changes
  const handleLanguageChange = (code: LanguageCode) => {
    setSelectedLanguage(code);
    setIsLangDropdownOpen(false);
    stopSpeech();
    const newLang = LANGUAGES[code];
    playChime("success");
    speakText(
      newLang.greeting,
      code,
      () => setIsSpeakingGreeting(true),
      () => setIsSpeakingGreeting(false)
    );
  };

  // Attempt auto-location detection for Indian states
  const detectUserLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        if (latitude > 8 && latitude < 13.5 && longitude > 76 && longitude < 80.5) {
          handleLanguageChange("ta"); // Tamil Nadu
        } else if (latitude > 13.5 && latitude < 19 && longitude > 77 && longitude < 84) {
          handleLanguageChange("te"); // Andhra / Telangana
        } else if (latitude > 8.3 && latitude < 12.8 && longitude > 74.8 && longitude < 77.5) {
          handleLanguageChange("ml"); // Kerala
        } else if (latitude > 11.5 && latitude < 18.5 && longitude > 74 && longitude < 78.5) {
          handleLanguageChange("kn"); // Karnataka
        } else if (latitude > 15.5 && latitude < 22 && longitude > 72.5 && longitude < 80.9) {
          handleLanguageChange("mr"); // Maharashtra
        } else if (latitude > 20 && latitude < 24.7 && longitude > 68 && longitude < 74.5) {
          handleLanguageChange("gu"); // Gujarat
        } else if (latitude > 23 && latitude < 30.2 && longitude > 69.5 && longitude < 78.3) {
          handleLanguageChange("raj"); // Rajasthan
        } else if (latitude > 21.5 && latitude < 27.5 && longitude > 85.5 && longitude < 89.8) {
          handleLanguageChange("bn"); // Bengal
        } else if (latitude > 29.5 && latitude < 32.5 && longitude > 73.8 && longitude < 76.9) {
          handleLanguageChange("pa"); // Punjab
        } else if (latitude > 17.8 && latitude < 22.5 && longitude > 81.3 && longitude < 87.5) {
          handleLanguageChange("or"); // Odisha
        }
      },
      (err) => {
        console.log("Location access not granted, using default language", err);
      }
    );
  };

  useEffect(() => {
    detectUserLocation();
  }, []);

  if (isDiscreetActive) {
    return <DiscreetMode language={selectedLanguage} onExit={() => setIsDiscreetActive(false)} />;
  }

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-500 ${langInfo.patternStyle} bg-amber-50/30 text-stone-900 selection:bg-amber-200`}
    >
      {/* Top Application Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
        <div className="max-w-2xl mx-auto px-4 py-2.5 flex items-center justify-between gap-2">
          {/* Brand Name & Voice Greeting */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (isSpeakingGreeting) {
                  stopSpeech();
                  setIsSpeakingGreeting(false);
                } else {
                  speakText(
                    langInfo.greeting,
                    selectedLanguage,
                    () => setIsSpeakingGreeting(true),
                    () => setIsSpeakingGreeting(false)
                  );
                }
              }}
              className="w-9 h-9 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-bold text-base shadow-sm hover:bg-amber-500 transition-transform active:scale-95 shrink-0"
              title={t.greetSakhi}
            >
              {isSpeakingGreeting ? (
                <VolumeX className="w-5 h-5 animate-pulse" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>

            <div>
              <h1 className="text-sm font-extrabold tracking-tight text-stone-900 flex items-center gap-1.5">
                <span>{strings.appName}</span>
              </h1>
              <span className="text-[10px] text-amber-800 font-semibold block truncate max-w-[140px] sm:max-w-none">
                {langInfo.motifName}
              </span>
            </div>
          </div>

          {/* Top Right Actions: Language Switcher, Discreet Mode, Emergency SOS */}
          <div className="flex items-center gap-1.5">
            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 rounded-xl text-xs font-bold text-stone-800 border border-stone-200 transition-colors"
                title={t.selectLanguage}
              >
                <Globe className="w-3.5 h-3.5 text-amber-700" />
                <span>{langInfo.nativeName}</span>
                <ChevronDown className="w-3 h-3 text-stone-500" />
              </button>

              {isLangDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-64 bg-white border border-stone-200 rounded-2xl shadow-2xl py-2 z-50 max-h-80 overflow-y-auto animate-in fade-in">
                  <div className="px-3 py-1 text-[11px] font-bold text-stone-400 uppercase tracking-wider border-b border-stone-100">
                    {t.selectLanguage}
                  </div>
                  <div className="grid grid-cols-1 gap-0.5 p-1">
                    {(Object.keys(LANGUAGES) as LanguageCode[]).map((code) => {
                      const l = LANGUAGES[code];
                      return (
                        <button
                          key={code}
                          onClick={() => handleLanguageChange(code)}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                            selectedLanguage === code
                              ? "bg-amber-100 text-amber-900 font-bold"
                              : "text-stone-700 hover:bg-stone-50"
                          }`}
                        >
                          <div>
                            <span className="font-bold text-stone-900 mr-1.5">
                              {l.nativeName}
                            </span>
                            <span className="text-[11px] text-stone-500">
                              ({l.name})
                            </span>
                          </div>
                          <span className="text-[10px] text-stone-400">
                            {l.region.split(" ")[0]}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Disguise / Discreet Mode */}
            <button
              onClick={() => setIsDiscreetActive(true)}
              className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-xl transition-colors shrink-0"
              title={t.discreetModeTitle}
            >
              <EyeOff className="w-4 h-4" />
            </button>

            {/* Emergency SOS Button */}
            <button
              onClick={() => setIsEmergencyOpen(true)}
              className="flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black shadow-sm transition-transform active:scale-95 shrink-0 animate-pulse"
              title={t.sosModalTitle}
            >
              <AlertTriangle className="w-3.5 h-3.5 fill-white" />
              <span>{t.sosTitle}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Quick Help & Tour Strip */}
      <div className="bg-amber-100/70 border-b border-amber-200/60 px-4 py-1.5">
        <div className="max-w-2xl mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsTourOpen(true)}
              className="flex items-center gap-1 font-bold text-amber-900 hover:text-amber-950 transition-colors"
            >
              <Compass className="w-3.5 h-3.5 text-amber-700" />
              <span>{t.appTour}</span>
            </button>

            <span className="text-amber-300">·</span>

            <button
              onClick={() => setIsTipsOpen(true)}
              className="flex items-center gap-1 font-medium text-stone-700 hover:text-stone-900 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5 text-stone-500" />
              <span>{t.phoneTips}</span>
            </button>
          </div>

          <button
            onClick={() => {
              speakText(langInfo.greeting, selectedLanguage);
            }}
            className="text-[11px] font-medium text-amber-900 hover:underline flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3 text-amber-600" />
            <span>{t.greetSakhi}</span>
          </button>
        </div>
      </div>

      {/* Main Screen Content */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 pt-4">
        {activeTab === "schemes" && (
          <SchemesView
            language={selectedLanguage}
            onOpenMapCategory={() => setActiveTab("essentials")}
          />
        )}

        {activeTab === "essentials" && (
          <EssentialsMapView language={selectedLanguage} />
        )}

        {activeTab === "skills" && (
          <SkillsView language={selectedLanguage} />
        )}

        {activeTab === "reels" && (
          <ReelsView
            language={selectedLanguage}
            onNavigateTab={(tab: any) => setActiveTab(tab)}
          />
        )}

        {activeTab === "circle" && (
          <SaheliCircleView language={selectedLanguage} />
        )}
      </main>

      {/* Persistent Bottom Floating Action Mic (Speak to Sakhi) */}
      <div className="fixed bottom-18 left-0 right-0 z-30 pointer-events-none flex justify-center px-4">
        <button
          onClick={() => setIsVoiceOpen(true)}
          className="pointer-events-auto flex items-center gap-2.5 px-5 py-3 rounded-full bg-gradient-to-r from-amber-600 via-amber-500 to-orange-600 text-stone-950 font-black text-sm shadow-xl shadow-amber-600/30 hover:scale-105 active:scale-95 transition-all border-2 border-white/80"
          title={t.speakToSakhi}
        >
          <span className="w-6 h-6 rounded-full bg-stone-950 text-amber-400 flex items-center justify-center animate-pulse">
            <Mic className="w-3.5 h-3.5" />
          </span>
          <span>{t.speakToSakhi}</span>
          <span className="text-[11px] font-bold text-stone-900/80 bg-white/40 px-2 py-0.5 rounded-full">
            {t.micBadge}
          </span>
        </button>
      </div>

      {/* Fixed Bottom 5-Tab Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 shadow-lg">
        <div className="max-w-2xl mx-auto grid grid-cols-5 items-center h-16 px-1">
          {/* Tab 1: Schemes */}
          <button
            onClick={() => setActiveTab("schemes")}
            className={`flex flex-col items-center justify-center h-full transition-colors ${
              activeTab === "schemes"
                ? "text-amber-700 font-bold"
                : "text-stone-500 hover:text-stone-800"
            }`}
          >
            <FileText className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight leading-none text-center">
              {t.tabSchemes}
            </span>
          </button>

          {/* Tab 2: Essentials & Pads */}
          <button
            onClick={() => setActiveTab("essentials")}
            className={`flex flex-col items-center justify-center h-full transition-colors ${
              activeTab === "essentials"
                ? "text-rose-600 font-bold"
                : "text-stone-500 hover:text-stone-800"
            }`}
          >
            <Heart className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight leading-none text-center">
              {t.tabEssentials}
            </span>
          </button>

          {/* Tab 3: Skills */}
          <button
            onClick={() => setActiveTab("skills")}
            className={`flex flex-col items-center justify-center h-full transition-colors ${
              activeTab === "skills"
                ? "text-teal-700 font-bold"
                : "text-stone-500 hover:text-stone-800"
            }`}
          >
            <Scissors className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight leading-none text-center">
              {t.tabSkills}
            </span>
          </button>

          {/* Tab 4: Reels / Education Videos */}
          <button
            onClick={() => setActiveTab("reels")}
            className={`flex flex-col items-center justify-center h-full transition-colors ${
              activeTab === "reels"
                ? "text-orange-600 font-bold"
                : "text-stone-500 hover:text-stone-800"
            }`}
          >
            <Tv className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight leading-none text-center">
              {t.tabReels}
            </span>
          </button>

          {/* Tab 5: Saheli Circle */}
          <button
            onClick={() => setActiveTab("circle")}
            className={`flex flex-col items-center justify-center h-full transition-colors ${
              activeTab === "circle"
                ? "text-teal-800 font-bold"
                : "text-stone-500 hover:text-stone-800"
            }`}
          >
            <Users className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight leading-none text-center">
              {t.tabCircle}
            </span>
          </button>
        </div>
      </nav>

      {/* Modals */}
      <VoiceAssistantModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        language={selectedLanguage}
        onNavigateTab={(tab) => {
          setActiveTab(tab as any);
          setIsVoiceOpen(false);
        }}
        onOpenMapsQuery={() => {
          setActiveTab("essentials");
          setIsVoiceOpen(false);
        }}
      />

      <EmergencySOSModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
        language={selectedLanguage}
        onTriggerDiscreet={() => {
          setIsEmergencyOpen(false);
          setIsDiscreetActive(true);
        }}
      />

      <AppTourModal
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        language={selectedLanguage}
      />

      <NavigationTipsModal
        isOpen={isTipsOpen}
        onClose={() => setIsTipsOpen(false)}
        language={selectedLanguage}
      />
    </div>
  );
}
