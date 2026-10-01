import React, { useState } from "react";
import { ExternalLink, Volume2, VolumeX, Briefcase, Baby, Flame, HeartHandshake, TrendingUp, GraduationCap, CheckCircle2, Calculator, MapPin } from "lucide-react";
import { LanguageCode, Scheme } from "../types";
import { SCHEMES } from "../data/schemes";
import { APP_TRANSLATIONS } from "../data/translations";
import { speakText, stopSpeech } from "../utils/speech";

interface SchemesViewProps {
  language: LanguageCode;
  onOpenMapCategory: (cat: string) => void;
}

export const SchemesView: React.FC<SchemesViewProps> = ({ language, onOpenMapCategory }) => {
  const [playingSchemeId, setPlayingSchemeId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // Loan Advisor Calculator State
  const [showCalculator, setShowCalculator] = useState(false);
  const [calcBusiness, setCalcBusiness] = useState("stitching");
  const [calcAmount, setCalcAmount] = useState("50000");
  const [calcResult, setCalcResult] = useState<string | null>(null);

  const t = APP_TRANSLATIONS[language] || APP_TRANSLATIONS.hi;

  const handleListen = (scheme: Scheme) => {
    if (playingSchemeId === scheme.id) {
      stopSpeech();
      setPlayingSchemeId(null);
      return;
    }

    const script = scheme.listenScript[language] || scheme.listenScript.hi;
    setPlayingSchemeId(scheme.id);
    speakText(
      script,
      language,
      () => {},
      () => setPlayingSchemeId(null)
    );
  };

  const handleCalculateLoan = () => {
    let result = "";
    if (calcAmount === "50000") {
      result = schemeLoanAnswers[language]?.small || schemeLoanAnswers.hi.small;
    } else if (calcAmount === "100000") {
      result = schemeLoanAnswers[language]?.medium || schemeLoanAnswers.hi.medium;
    } else {
      result = schemeLoanAnswers[language]?.large || schemeLoanAnswers.hi.large;
    }
    setCalcResult(result);
    speakText(result, language);
  };

  const schemeLoanAnswers: Record<LanguageCode, { small: string; medium: string; large: string }> = {
    hi: {
      small: "आपके लिए 'प्रधानमंत्री मुद्रा योजना (शिशु लोन)' सबसे उत्तम है। इसमें ₹50,000 तक बिना गारंटी लोन मिलता है। आधार कार्ड व बैंक पासबुक लेकर बैंक जाएं।",
      medium: "आपके लिए 'लखपति दीदी स्वयं सहायता समूह' और मुद्रा किशोर लोन उत्तम है। इसमें ₹1 से ₹2 लाख तक कम ब्याज पर मिलता है।",
      large: "आपके लिए मुद्रा तरुण लोन व स्टैंड-अप इंडिया योजना है। इसमें ₹5 लाख से अधिक व्यवसाय लोन मिलता है।",
    },
    ta: {
      small: "உங்களுக்கு 'முத்ரா சிசு கடன்' மிகவும் சிறந்தது. இதில் ₹50,000 வரை பிணையமில்லா கடன் கிடைக்கும். ஆதார் மற்றும் பாஸ்புக்குடன் வங்கிக்கு செல்லவும்.",
      medium: "உங்களுக்கு 'மகளிர் குழு கடன்' மற்றும் முத்ரா கிஷோர் கடன் ஏற்றது. குறைந்த வட்டியில் ₹1 முதல் ₹2 லட்சம் வரை கடன் பெறலாம்.",
      large: "உங்களுக்கு ஸ்டாண்ட்-அப் இந்தியா திட்டம் சிறந்தது. ₹5 லட்சத்திற்கும் மேல் தொழில் கடன் பெறலாம்.",
    },
    te: {
      small: "మీ కోసం 'ముద్రా శిశు లోన్' ఉత్తమమైనది. ఇందులో ₹50,000 వరకు ఎటువంటి హామీ లేకుండా రుణం లభిస్తుంది.",
      medium: "మీ కోసం స్వయం సహాయక సంఘం మరియు ముద్రా కిశోర్ లోన్ అనువైనది. ₹1 నుండి ₹2 లక్షల వరకు తక్కువ వడ్డీతో లభిస్తుంది.",
      large: "మీ కోసం ముద్రా తరుణ్ మరియు స్టాండప్ ఇండియా పథకాలు ఉన్నాయి. ₹5 లక్షలకు పైగా రుణం లభిస్తుంది.",
    },
    ml: {
      small: "നിങ്ങൾക്ക് 'മുദ്ര ശിശു വായ്പ' അനുയോജ്യമാണ്. ₹50,000 വരെ ഈടില്ലാതെ ലഭിക്കും. ആധാറുമായി ബാങ്കിൽ പോകുക.",
      medium: "കുടുംബശ്രീ ഗ്രൂപ്പുകൾ വഴി ₹1 മുതൽ ₹2 ലക്ഷം വരെ കുറഞ്ഞ പലിശയിൽ വായ്പ ലഭിക്കും.",
      large: "₹5 ലക്ഷത്തിന് മുകളിലുള്ള സംരംഭങ്ങൾക്ക് സ്റ്റാൻഡ് അപ്പ് ഇന്ത്യ വായ്പ ലഭ്യമാണ്.",
    },
    kn: {
      small: "ನಿಮಗೆ 'ಮುದ್ರಾ ಶಿಶು ಸಾಲ' ಸೂಕ್ತವಾಗಿದೆ. ಇದರಲ್ಲಿ ₹50,000 ವರೆಗೆ ಜಾಮೀನು ರಹಿತ ಸಾಲ ಸಿಗುತ್ತದೆ. ಆಧಾರ್‌ನೊಂದಿಗೆ ಬ್ಯಾಂಕ್‌ಗೆ ಭೇಟಿ ನೀಡಿ.",
      medium: "ಸ್ವಸಹಾಯ ಸಂಘಗಳ ಮೂಲಕ ₹1 ರಿಂದ ₹2 ಲಕ್ಷದವರೆಗೆ ಕಡಿಮೆ ಬಡ್ಡಿಯಲ್ಲಿ ಸಾಲ ಪಡೆಯಬಹುದು.",
      large: "₹5 ಲಕ್ಷಕ್ಕೂ ಹೆಚ್ಚಿನ ಉದ್ಯಮ ಸಾಲಕ್ಕೆ ಮುದ್ರಾ ತರುಣ್ ಯೋಜನೆ ಲಭ್ಯವಿದೆ.",
    },
    mr: {
      small: "तुमच्यासाठी 'मुद्रा शिशु कर्ज' सर्वोत्तम आहे. यात ₹50,000 पर्यंत हमीमुक्त कर्ज मिळते. आधार व पासबुक घेऊन बँकेत जा.",
      medium: "महिला बचत गट आणि मुद्रा किशोर कर्ज योजना योग्य आहे. यात ₹1 ते ₹2 लाखांपर्यंत कमी व्याजात कर्ज मिळते.",
      large: "स्टँड-अप इंडिया व मुद्रा तरुण योजनेतून ₹5 लाखांपेक्षा जास्त व्यवसाय कर्ज मिळते.",
    },
    raj: {
      small: "आपरे खातर मुद्रा शिशु लोन बढ़िया है। ₹50,000 ताईं बिना गारंटी लोन मिले।",
      medium: "महिला समूह री मदद सूं ₹1 सूं ₹2 लाख रो सस्तो लोन मिले।",
      large: "बड़ा धंधा खातर मुद्रा तरुण योजना में ₹5 लाख सूं बत्तो लोन मिले।",
    },
    gu: {
      small: "તમારા માટે 'મુદ્રા શિશુ લોન' ઉત્તમ છે. ₹50,000 સુધી ગેરંટી વગર લોન મળે છે. આધાર અને પાસબુક લઈને બેંક જાઓ.",
      medium: "સ્વસહાય જૂથ દ્વારા ₹1 થી ₹2 લાખ સુધી સસ્તા વ્યાજે લોન મળે છે.",
      large: "મોટા વેપાર માટે સ્ટેન્ડ-અપ ઇન્ડિયા યોજનામાંથી ₹5 લાખથી વધુ લોન મળે છે.",
    },
    mai: {
      small: "अहाँक लेल मुद्रा शिशु लोन नीक अछि। ₹50,000 धरि बिना गारंटी लोन भेटत।",
      medium: "महिला समूह सँ ₹1 सँ ₹2 लाख धरि कम ब्याज पर लोन भेटत।",
      large: "बड़का काज लेल ₹5 लाख सँ बेसी लोन भेटत।",
    },
    bn: {
      small: "আপনার জন্য 'মুদ্রা শিশু ঋণ' সবচেয়ে ভালো। ₹৫০,০০০ পর্যন্ত জামানতমুক্ত ঋণ পাবেন। আধার ও পাসবুক নিয়ে ব্যাংকে যান।",
      medium: "স্বনির্ভর গোষ্ঠীর মাধ্যমে ₹১ থেকে ₹২ লাখ পর্যন্ত অল্প সুদে ঋণ পাওয়া যায়।",
      large: "বড় ব্যবসার জন্য স্ট্যান্ড-আপ ইন্ডিয়া প্রকল্পে ₹৫ লাখের বেশি ঋণ পাবেন।",
    },
    pa: {
      small: "ਤੁਹਾਡੇ ਲਈ 'ਮੁਦਰਾ ਸ਼ਿਸ਼ੂ ਕਰਜ਼ਾ' ਵਧੀਆ ਹੈ। ₹50,000 ਤੱਕ ਬਿਨਾਂ ਗਾਰੰਟੀ ਕਰਜ਼ਾ ਮਿਲਦਾ ਹੈ।",
      medium: "ਸਵੈ-ਸਹਾਇਤਾ ਸਮੂਹ ਰਾਹੀਂ ₹1 ਤੋਂ ₹2 ਲੱਖ ਤੱਕ ਸਸਤਾ ਕਰਜ਼ਾ ਮਿਲਦਾ ਹੈ।",
      large: "ਵੱਡੇ ਕੰਮ ਲਈ ਮੁਦਰਾ ਤਰੁਣ ਸਕੀਮ ਵਿੱਚ ₹5 ਲੱਖ ਤੋਂ ਵੱਧ ਕਰਜ਼ਾ ਮਿਲਦਾ ਹੈ।",
    },
    or: {
      small: "ଆପଣଙ୍କ ପାଇଁ 'ମୁଦ୍ରା ଶିଶୁ ଋଣ' ସବୁଠାରୁ ଭଲ। ₹50,000 ପର୍ଯ୍ୟନ୍ତ ବିନା ବନ୍ଧକରେ ଋଣ ମିଳିବ।",
      medium: "ମହିଳା ଗୋଷ୍ଠୀ ମାଧ୍ୟମରେ ₹1 ରୁ ₹2 ଲକ୍ଷ ପର୍ଯ୍ୟନ୍ତ କମ୍ ସୁଧରେ ଋଣ ମିଳିବ।",
      large: "ବଡ଼ ବ୍ୟବସାୟ ପାଇଁ ₹5 ଲକ୍ଷରୁ ଅଧିକ ଋଣ ଉପଲବ୍ଧ।",
    },
  };

  const filteredSchemes =
    activeCategory === "all"
      ? SCHEMES
      : SCHEMES.filter((s) => s.category === activeCategory);

  const getSchemeIcon = (name: string) => {
    switch (name) {
      case "Briefcase":
        return Briefcase;
      case "TrendingUp":
        return TrendingUp;
      case "HeartHandshake":
        return HeartHandshake;
      case "Baby":
        return Baby;
      case "Flame":
        return Flame;
      case "GraduationCap":
        return GraduationCap;
      default:
        return Briefcase;
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Banner / Intro */}
      <div className="bg-gradient-to-br from-amber-600 to-orange-700 rounded-3xl p-5 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-md">
          <span className="text-[11px] font-bold tracking-wider uppercase bg-white/20 px-2.5 py-1 rounded-md mb-2 inline-block">
            {t.schemesBannerTag}
          </span>
          <h2 className="text-xl font-bold mb-1">{t.schemesBannerTitle}</h2>
          <p className="text-xs text-amber-100 leading-relaxed mb-4">
            {t.schemesBannerDesc}
          </p>

          <button
            onClick={() => setShowCalculator(!showCalculator)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-stone-900 text-amber-300 rounded-2xl text-xs font-bold hover:bg-stone-800 transition-colors shadow-lg active:scale-95"
          >
            <Calculator className="w-4 h-4 text-amber-400" />
            <span>{showCalculator ? t.closeCalcButton : t.loanCalcButton}</span>
          </button>
        </div>

        <div className="absolute -bottom-6 -right-6 opacity-15 pointer-events-none text-white">
          <Briefcase className="w-40 h-40" />
        </div>
      </div>

      {/* Interactive Business Loan Calculator Modal / Dropdown */}
      {showCalculator && (
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 border-2 border-amber-500/40 shadow-xl space-y-4 animate-in slide-in-from-top-2">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-amber-600" />
              <span>{t.calcHeader}</span>
            </h3>
            <span className="text-[10px] text-stone-500 font-medium">{t.calcSafeBadge}</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                {t.calcQ1}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: "stitching", label: "सिलाई / தையல்" },
                  { id: "grocery", label: "किराना / கடை" },
                  { id: "dairy", label: "पशुपालन / பால்" },
                  { id: "papad", label: "पापड़ / ஊறுகாய்" },
                ].map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setCalcBusiness(b.id)}
                    className={`p-2.5 rounded-xl border text-center font-medium transition-all ${
                      calcBusiness === b.id
                        ? "bg-amber-500 text-stone-950 border-amber-500 font-bold"
                        : "bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700"
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                {t.calcQ2}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "50000", label: "₹50,000" },
                  { id: "100000", label: "₹1L - ₹2L" },
                  { id: "500000", label: "₹5L+" },
                ].map((a) => (
                  <button
                    key={a.id}
                    onClick={() => setCalcAmount(a.id)}
                    className={`p-2.5 rounded-xl border text-center font-medium transition-all ${
                      calcAmount === a.id
                        ? "bg-amber-500 text-stone-950 border-amber-500 font-bold"
                        : "bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700"
                    }`}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleCalculateLoan}
              className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold text-xs shadow-md transition-transform active:scale-95"
            >
              {t.calcSubmit}
            </button>

            {calcResult && (
              <div className="p-3.5 bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 rounded-2xl text-xs space-y-2">
                <div className="font-bold text-amber-900 dark:text-amber-200 flex items-center justify-between">
                  <span>{t.calcSakhiSuggest}</span>
                  <button
                    onClick={() => speakText(calcResult, language)}
                    className="flex items-center gap-1 text-[11px] text-amber-700 dark:text-amber-300 underline"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{t.listenBtn}</span>
                  </button>
                </div>
                <p className="text-stone-800 dark:text-stone-200 leading-relaxed font-medium">
                  {calcResult}
                </p>
                <div className="pt-1 flex gap-2">
                  <a
                    href="https://www.mudra.org.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-600 text-white rounded-lg text-[11px] font-semibold"
                  >
                    <span>{t.calcOpenPortal}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <button
                    onClick={() => onOpenMapCategory("csc_centre")}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-stone-800 text-amber-300 rounded-lg text-[11px] font-semibold"
                  >
                    <MapPin className="w-3 h-3" />
                    <span>{t.calcNearestBank}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: "all", label: t.filterAll },
          { id: "business", label: t.filterBusiness },
          { id: "health", label: t.filterHealth },
          { id: "hygiene", label: t.filterHygiene },
          { id: "energy", label: t.filterEnergy },
          { id: "child", label: t.filterChild },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeCategory === cat.id
                ? "bg-amber-600 text-white shadow-sm"
                : "bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Scheme Cards Grid */}
      <div className="space-y-4">
        {filteredSchemes.map((scheme) => {
          const IconComp = getSchemeIcon(scheme.iconName);
          const isPlaying = playingSchemeId === scheme.id;
          const schemeTitle = scheme.titles[language] || scheme.titles.hi;
          const schemeBadge = scheme.badges[language] || scheme.badges.hi;
          const schemeBenefit = scheme.benefits[language] || scheme.benefits.hi;
          const schemeWho = scheme.who[language] || scheme.who.hi;
          const schemeDocs = scheme.documents[language] || scheme.documents.hi;
          const schemeStep = scheme.steps[language] || scheme.steps.hi;

          return (
            <div
              key={scheme.id}
              className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
            >
              {/* Header of Scheme Card */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 flex items-center justify-center shrink-0 text-amber-700 dark:text-amber-400">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                      {schemeBadge}
                    </span>
                    <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                      {schemeTitle}
                    </h3>
                  </div>
                </div>

                {/* Listen button for zero literacy users */}
                <button
                  onClick={() => handleListen(scheme)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isPlaying
                      ? "bg-red-600 text-white animate-pulse"
                      : "bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 hover:bg-amber-200"
                  }`}
                  title={t.listenBtn}
                >
                  {isPlaying ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  <span>{isPlaying ? t.stopBtn : t.listenBtn}</span>
                </button>
              </div>

              {/* Benefit Highlight Box */}
              <div className="p-3 bg-stone-50 dark:bg-stone-800/50 rounded-2xl mb-3 text-xs">
                <div className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 mb-0.5">
                  {t.benefitLabel}
                </div>
                <div className="text-sm font-bold text-amber-700 dark:text-amber-400 mb-1">
                  {scheme.benefitAmount}
                </div>
                <p className="text-stone-700 dark:text-stone-300 leading-relaxed font-medium">
                  {schemeBenefit}
                </p>
              </div>

              {/* Who can apply and Documents */}
              <div className="space-y-2 text-xs mb-4 text-stone-600 dark:text-stone-300">
                <div>
                  <span className="font-semibold text-stone-900 dark:text-stone-100">{t.whoLabel} </span>
                  <span>{schemeWho}</span>
                </div>

                <div>
                  <span className="font-semibold text-stone-900 dark:text-stone-100">{t.docsLabel} </span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {schemeDocs.map((doc, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 text-[11px] bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-md text-stone-700 dark:text-stone-300"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>{doc}</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-1">
                  <span className="font-semibold text-stone-900 dark:text-stone-100">{t.stepLabel} </span>
                  <span className="text-stone-700 dark:text-stone-300">{schemeStep}</span>
                </div>
              </div>

              {/* Bottom Actions: Official Link & Map route */}
              <div className="flex items-center justify-between pt-3 border-t border-stone-100 dark:border-stone-800 text-xs">
                <a
                  href={scheme.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-stone-900 dark:bg-stone-800 text-stone-100 hover:text-white rounded-xl font-medium transition-colors"
                >
                  <span>{t.openPortalBtn} ({scheme.portalName})</span>
                  <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
                </a>

                <button
                  onClick={() => onOpenMapCategory("csc_centre")}
                  className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-400 font-semibold hover:underline"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{t.nearestCentreBtn}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
