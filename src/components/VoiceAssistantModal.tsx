import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Volume2, VolumeX, X, Sparkles, ArrowRight, ExternalLink, MapPin } from "lucide-react";
import { LanguageCode } from "../types";
import { LANGUAGES } from "../data/languages";
import { speakText, stopSpeech, isSpeaking, playChime, createSpeechRecognizer } from "../utils/speech";

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageCode;
  onNavigateTab: (tabId: string) => void;
  onOpenMapsQuery: (query: string) => void;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  language,
  onNavigateTab,
  onOpenMapsQuery,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [aiSpeechResponse, setAiSpeechResponse] = useState<string | null>(null);
  const [aiDetails, setAiDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeakingNow, setIsSpeakingNow] = useState(false);

  const recognizerRef = useRef<any>(null);
  const langInfo = LANGUAGES[language] || LANGUAGES.hi;

  // Localized suggested prompts for first-time rural women
  const quickQuestions: Record<LanguageCode, { text: string; actionTab?: string; mapCategory?: string }[]> = {
    hi: [
      { text: "सिलाई मशीन के लिए ₹50,000 लोन कैसे मिलेगा?", actionTab: "schemes" },
      { text: "₹1 वाले जन औषधि सैनिटरी पैड कहाँ मिलेंगे?", actionTab: "essentials" },
      { text: "गर्भवती महिलाओं को ₹5,000 वाली योजना", actionTab: "schemes" },
      { text: "घर बैठे कमाई का हुनर सीखना है", actionTab: "skills" },
      { text: "नजदीकी अस्पताल या जन सेवा केंद्र का रास्ता", mapCategory: "csc_centre" },
    ],
    ta: [
      { text: "தையல் இயந்திரத்திற்கு கடன் பெறுவது எப்படி?", actionTab: "schemes" },
      { text: "₹1 சானிட்டரி பேட் எங்கு கிடைக்கும்?", actionTab: "essentials" },
      { text: "கர்ப்பிணி பெண்களுக்கு அரசு உதவித்தொகை", actionTab: "schemes" },
      { text: "சுயதொழில் பயிற்சி பெற வேண்டும்", actionTab: "skills" },
    ],
    te: [
      { text: "కుట్టు మిషన్ కోసం రుణం ఎలా పొందాలి?", actionTab: "schemes" },
      { text: "₹1 శానిటరీ ప్యాడ్లు ఎక్కడ దొరుకుతాయి?", actionTab: "essentials" },
      { text: "గర్భిణీ స్త్రీలకు ₹5,000 పథకం", actionTab: "schemes" },
      { text: "ఇంట్లోనే ఉండి నైపుణ్యం నేర్చుకోవాలి", actionTab: "skills" },
    ],
    ml: [
      { text: "തയ്യൽ മെഷീൻ വായ്പ എങ്ങനെ ലഭിക്കും?", actionTab: "schemes" },
      { text: "₹1 സാനിറ്ററി പാഡുകൾ എവിടെ ലഭിക്കും?", actionTab: "essentials" },
      { text: "ഗർഭിണികൾക്കുള്ള സാമ്പത്തിക സഹായം", actionTab: "schemes" },
    ],
    kn: [
      { text: "ಹೊಲಿಗೆ ಯಂತ್ರಕ್ಕೆ ಸಾಲ ಹೇಗೆ ಪಡೆಯುವುದು?", actionTab: "schemes" },
      { text: "₹1 ಕ್ಕೆ ಸ್ಯಾನಿಟರಿ ಪ್ಯಾಡ್ ಎಲ್ಲಿ ಸಿಗುತ್ತದೆ?", actionTab: "essentials" },
      { text: "ಗರ್ಭಿಣಿ ಮಹಿಳೆಯರಿಗೆ ₹5,000 ಯೋಜನೆ", actionTab: "schemes" },
    ],
    mr: [
      { text: "शिवणकामासाठी ₹50,000 चे कर्ज कसे मिळेल?", actionTab: "schemes" },
      { text: "₹1 चे सॅनिटरी नॅपकिन कोठे मिळेल?", actionTab: "essentials" },
      { text: "मातृ वंदना योजनेचे ₹5,000 कसे मिळतील?", actionTab: "schemes" },
    ],
    raj: [
      { text: "सिलाई खातर ₹50,000 रो लोन कियां मिले?", actionTab: "schemes" },
      { text: "₹1 वाळा सेनेटरी पैड कनै मिलेला?", actionTab: "essentials" },
      { text: "लाडली बहना अर मातृ वंदना योजना", actionTab: "schemes" },
    ],
    gu: [
      { text: "સિલાઈ મશીન માટે લોન કેવી રીતે મળે?", actionTab: "schemes" },
      { text: "₹1 વાળા સેનિટરી પેડ ક્યાં મળશે?", actionTab: "essentials" },
      { text: "સગર્ભા બહેનો માટે સરકારી સહાય", actionTab: "schemes" },
    ],
    mai: [
      { text: "सिलाई मशीन लेल लोन कोना भेटत?", actionTab: "schemes" },
      { text: "₹1 बला सैनिटरी पैड कतय भेटत?", actionTab: "essentials" },
      { text: "गर्भवती महिला लेल ₹5,000 योजना", actionTab: "schemes" },
    ],
    bn: [
      { text: "সেলাই মেশিনের জন্য ঋণ কিভাবে পাব?", actionTab: "schemes" },
      { text: "₹১ স্যানিটারি প্যাড কোথায় পাওয়া যায়?", actionTab: "essentials" },
      { text: "গর্ভবতী মহিলাদের জন্য ₹৫,০০০ প্রকল্প", actionTab: "schemes" },
    ],
    pa: [
      { text: "ਸਿਲਾਈ ਮਸ਼ੀਨ ਲਈ ਕਰਜ਼ਾ ਕਿਵੇਂ ਮਿਲੇਗਾ?", actionTab: "schemes" },
      { text: "₹1 ਵਾਲੇ ਸੈਨੇਟਰੀ ਪੈਡ ਕਿੱਥੋਂ ਮਿਲਣਗੇ?", actionTab: "essentials" },
      { text: "ਗਰਭਵਤੀ ਔਰਤਾਂ ਲਈ ₹5,000 ਸਕੀਮ", actionTab: "schemes" },
    ],
    or: [
      { text: "ସିଲେଇ ମେସିନ ପାଇଁ ଋଣ କିପରି ମିଳିବ?", actionTab: "schemes" },
      { text: "₹1 ରେ ସାନିଟାରୀ ପ୍ୟାଡ୍ କେଉଁଠି ମିଳିବ?", actionTab: "essentials" },
      { text: "ଗର୍ଭବତୀ ମହିଳାଙ୍କ ପାଇଁ ₹5,000 ଯୋଜନା", actionTab: "schemes" },
    ],
  };

  const currentQuestions = quickQuestions[language] || quickQuestions.hi;

  useEffect(() => {
    if (isOpen) {
      // Start greeting
      setTranscript("");
      setAiSpeechResponse(null);
      setAiDetails(null);
      const greeting = langInfo.greeting + " आप बोलकर या नीचे दिए सवाल छूकर पूछ सकती हैं।";
      setAiSpeechResponse(greeting);
      speakText(greeting, language, () => setIsSpeakingNow(true), () => setIsSpeakingNow(false));
    } else {
      stopListening();
      stopSpeech();
    }
  }, [isOpen, language]);

  const startListening = () => {
    stopSpeech();
    setIsSpeakingNow(false);
    playChime("listen");

    if (recognizerRef.current) {
      try {
        recognizerRef.current.abort();
      } catch (e) {}
    }

    const rec = createSpeechRecognizer(
      language,
      (text) => {
        setTranscript(text);
        handleSendQuery(text);
      },
      (err) => {
        console.warn("Speech recognition error:", err);
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
    );

    if (rec) {
      recognizerRef.current = rec;
      try {
        rec.start();
        setIsListening(true);
      } catch (e) {
        setIsListening(false);
      }
    } else {
      // Fallback: Web speech not supported or denied
      setIsListening(false);
      const fallbackMsg = "माइक की अनुमति नहीं मिल सकी। आप नीचे दिए गए किसी भी बटन को छूकर सीधे पूछ सकती हैं।";
      setAiSpeechResponse(fallbackMsg);
      speakText(fallbackMsg, language);
    }
  };

  const stopListening = () => {
    if (recognizerRef.current) {
      try {
        recognizerRef.current.stop();
      } catch (e) {}
      recognizerRef.current = null;
    }
    setIsListening(false);
  };

  const handleSendQuery = async (queryText: string) => {
    stopListening();
    setIsLoading(true);
    stopSpeech();
    setTranscript(queryText);

    // Automated Voice Navigation keyword checks
    const qLower = queryText.toLowerCase();
    if (qLower.includes("पैड") || qLower.includes("pad") || qLower.includes("மருந்து") || qLower.includes("ప్యాడ్") || qLower.includes("hospital") || qLower.includes("दवा")) {
      setTimeout(() => onNavigateTab("essentials"), 1800);
    } else if (qLower.includes("लोन") || qLower.includes("loan") || qLower.includes("योजना") || qLower.includes("scheme") || qLower.includes("திட்டம்") || qLower.includes("పథకం") || qLower.includes("मुद्रा")) {
      setTimeout(() => onNavigateTab("schemes"), 1800);
    } else if (qLower.includes("सिलाई") || qLower.includes("हुनर") || qLower.includes("skill") || qLower.includes("தொழில்") || qLower.includes("నైపుణ్యం") || qLower.includes("अचार")) {
      setTimeout(() => onNavigateTab("skills"), 1800);
    } else if (qLower.includes("वीडियो") || qLower.includes("reel") || qLower.includes("रील्स") || qLower.includes("விடியோ")) {
      setTimeout(() => onNavigateTab("reels"), 1800);
    }

    try {
      const res = await fetch("/api/ai/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: queryText,
          language: langInfo.name,
        }),
      });

      const data = await res.json();
      setAiDetails(data);
      const speech = data.speechText || "दीदी, आपकी बात समझ गई। सरकारी योजना व सहायता की पूरी जानकारी यहाँ उपलब्ध है।";
      setAiSpeechResponse(speech);
      playChime("success");
      speakText(speech, language, () => setIsSpeakingNow(true), () => setIsSpeakingNow(false));
    } catch (e) {
      const fallback = "दीदी, आप अपनी नजदीकी आशा दीदी या जन सेवा केंद्र से संपर्क कर सकती हैं।";
      setAiSpeechResponse(fallback);
      speakText(fallback, language);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-stone-900 border border-stone-800 rounded-t-3xl sm:rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-800 flex items-center justify-between bg-stone-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-600/30 border border-amber-500/40 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">सखी आवाज़ साथी (Sakhi Voice AI)</h2>
              <p className="text-[11px] text-amber-400">{langInfo.nativeName} ({langInfo.name})</p>
            </div>
          </div>
          <button
            onClick={() => {
              stopListening();
              stopSpeech();
              onClose();
            }}
            className="p-2 text-stone-400 hover:text-white rounded-xl hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Assistant Main Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Voice Visualization / Status */}
          <div className="text-center py-4 bg-stone-950/60 rounded-2xl border border-stone-800/80">
            {/* Big Mic Button */}
            <div className="relative inline-block mb-3">
              {isListening && (
                <div className="absolute inset-0 rounded-full bg-amber-500/20 animate-ping"></div>
              )}
              <button
                onClick={isListening ? stopListening : startListening}
                className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-xl active:scale-95 ${
                  isListening
                    ? "bg-red-600 text-white shadow-red-600/40"
                    : isSpeakingNow
                    ? "bg-amber-600 text-white shadow-amber-600/40"
                    : "bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-amber-500/30"
                }`}
                title={isListening ? "सुनना बंद करें" : "माइक दबाकर बोलें"}
              >
                {isListening ? (
                  <MicOff className="w-8 h-8 animate-pulse" />
                ) : (
                  <Mic className="w-8 h-8" />
                )}
              </button>
            </div>

            <p className="text-xs font-semibold text-stone-200">
              {isListening
                ? "दीदी बोलिए, मैं ध्यान से सुन रही हूँ..."
                : isSpeakingNow
                ? "सखी बोल रही है..."
                : "माइक दबाकर अपनी भाषा में कुछ भी पूछें"}
            </p>

            {transcript && (
              <div className="mt-3 px-4 py-2 bg-stone-900 rounded-xl max-w-sm mx-auto text-xs text-amber-300 italic border border-stone-800">
                &ldquo;{transcript}&rdquo;
              </div>
            )}
          </div>

          {/* AI Answer Speech Bubble */}
          {isLoading && (
            <div className="p-4 bg-stone-800/60 rounded-2xl border border-stone-700/80 flex items-center justify-center gap-3">
              <span className="w-3 h-3 rounded-full bg-amber-500 animate-bounce"></span>
              <span className="text-xs text-stone-300">सखी सरकारी नियम देख रही है...</span>
            </div>
          )}

          {aiSpeechResponse && !isLoading && (
            <div className="p-4 bg-amber-950/40 border border-amber-600/50 rounded-2xl space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-amber-400">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>सखी का जवाब:</span>
                </span>
                <button
                  onClick={() => {
                    if (isSpeakingNow) {
                      stopSpeech();
                      setIsSpeakingNow(false);
                    } else {
                      speakText(
                        aiSpeechResponse,
                        language,
                        () => setIsSpeakingNow(true),
                        () => setIsSpeakingNow(false)
                      );
                    }
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 bg-amber-900/60 hover:bg-amber-800/80 text-amber-200 rounded-lg text-[11px] transition-colors"
                >
                  {isSpeakingNow ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                  <span>{isSpeakingNow ? "आवाज़ रोकें" : "दोबारा सुनें"}</span>
                </button>
              </div>

              <p className="text-sm text-stone-100 leading-relaxed font-medium">
                {aiSpeechResponse}
              </p>

              {aiDetails?.simpleAdvice && (
                <div className="p-3 bg-stone-900/90 rounded-xl text-xs text-stone-300 whitespace-pre-line border border-stone-800">
                  {aiDetails.simpleAdvice}
                </div>
              )}

              {/* Action buttons if AI suggested a portal or map */}
              <div className="flex flex-wrap gap-2 pt-1">
                {aiDetails?.recommendedGovPortal && (
                  <a
                    href={aiDetails.recommendedGovPortal}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs rounded-xl border border-stone-700"
                  >
                    <span>सरकारी पोर्टल खोलें</span>
                    <ExternalLink className="w-3 h-3 text-stone-400" />
                  </a>
                )}
                {aiDetails?.nearestDestinationCategory && (
                  <button
                    onClick={() => {
                      onOpenMapsQuery(aiDetails.nearestDestinationCategory);
                      onClose();
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs rounded-xl"
                  >
                    <MapPin className="w-3 h-3" />
                    <span>रास्ता देखें (नक्शा)</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Quick Tap Prompts */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2.5">
              या उंगली से छूकर सवाल चुनें (Zero English)
            </h3>
            <div className="space-y-2">
              {currentQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    handleSendQuery(q.text);
                    if (q.actionTab) {
                      setTimeout(() => onNavigateTab(q.actionTab!), 2500);
                    }
                  }}
                  className="w-full text-left p-3 rounded-xl bg-stone-800/80 hover:bg-stone-800 border border-stone-700/60 hover:border-amber-500/50 flex items-center justify-between text-xs text-stone-200 transition-all active:scale-[0.98]"
                >
                  <span>{q.text}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-stone-500 shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
