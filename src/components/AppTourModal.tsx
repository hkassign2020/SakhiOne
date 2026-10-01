import React, { useState, useEffect } from "react";
import { Sparkles, Mic, FileText, Heart, AlertTriangle, Users, ChevronRight, ChevronLeft, Volume2, X } from "lucide-react";
import { LanguageCode } from "../types";
import { APP_TRANSLATIONS } from "../data/translations";
import { speakText, stopSpeech } from "../utils/speech";

interface AppTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageCode;
}

export const AppTourModal: React.FC<AppTourModalProps> = ({ isOpen, onClose, language }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const t = APP_TRANSLATIONS[language] || APP_TRANSLATIONS.hi;

  const tourStepData: Record<
    LanguageCode,
    { title: string; desc: string; voiceNote: string }[]
  > = {
    hi: [
      {
        title: "1. सखी से बोलकर पूछें (Voice Assistant)",
        desc: "किसी अंग्रेजी या टाइपिंग की जरूरत नहीं। नीचे दिया बड़ा माइक बटन दबाएं और अपनी भाषा में सखी से बात करें।",
        voiceNote: "दीदी, नीचे दिए माइक बटन को छूकर आप कुछ भी पूछ सकती हैं।",
      },
      {
        title: "2. सरकारी योजनाएं (Gov Schemes)",
        desc: "मुद्रा लोन (₹50,000), मातृ वंदना (₹5,000), और मुफ्त गैस। हर योजना के साथ सीधे सरकारी पोर्टल का लिंक है।",
        voiceNote: "यहाँ सरकार की सभी योजनाएं हैं। आप 'सुनें' बटन दबाकर योजना समझ सकती हैं।",
      },
      {
        title: "3. ₹1 सैनिटरी पैड व स्वास्थ्य केंद्र",
        desc: "जन औषधि केंद्र पर ₹1 में मिलने वाले सुविधा पैड और अस्पताल का रास्ता एक टच में गूगल मैप्स पर देखें।",
        voiceNote: "सैनिटरी पैड और अस्पताल का रास्ता देखने के लिए गूगल नक्शा बटन दबाएं।",
      },
      {
        title: "4. आपातकालीन सुरक्षा (SOS & Disguise)",
        desc: "ऊपर का लाल बटन दबाते ही तेज सायरन, 1091/112 हेल्पलाइन, और तत्काल कैलकुलेटर में छिपाने का विकल्प मिलेगा।",
        voiceNote: "किसी भी संकट के समय लाल बटन दबाएं। 1091 पर मुफ्त कॉल करें।",
      },
      {
        title: "5. सहेली मंडल (5-7 km)",
        desc: "अपने आस-पास के 5 से 7 किलोमीटर की गांव की बहनों से बात करें, सिलाई के काम बांटें, और एक-दूसरे की मदद करें।",
        voiceNote: "सहेली मंडल में आस-पास के गांव की बहनें एक दूसरे को सलाह देती हैं।",
      },
    ],
    ta: [
      {
        title: "1. சகியிடம் பேசி கேளுங்கள் (Voice Assistant)",
        desc: "ஆங்கிலம் தேவையில்லை. கீழே உள்ள பெரிய மைக் பொத்தானை அழுத்தி உங்கள் தாய்மொழியில் பேசுங்கள்.",
        voiceNote: "சகோதரி, கீழே உள்ள மைக் பட்டனை தொட்டு அரசு திட்டம் அல்லது சானிட்டரி பேட் பற்றி கேளுங்கள்.",
      },
      {
        title: "2. அரசு திட்டங்கள் (Gov Schemes)",
        desc: "முத்ரா கடன் (₹50,000), மகப்பேறு உதவி (₹5,000) மற்றும் இலவச எரிவாயு அடுப்பு திட்டங்கள்.",
        voiceNote: "இங்கு அனைத்து அரசு திட்டங்களும் உள்ளன. கேளுங்கள் பட்டனை தொட்டு தெரிந்து கொள்ளுங்கள்.",
      },
      {
        title: "3. ₹1 சானிட்டரி நாப்கின் & மருத்துவம்",
        desc: "மக்கள் மருந்தகத்தில் ₹1 விலையில் சானிட்டரி நாப்கின் மற்றும் மருத்துவமனை வழியை கூகுள் மேப்பில் காணுங்கள்.",
        voiceNote: "சானிட்டரி பேட் மற்றும் மருத்துவமனை வழியை அறிய கூகுள் மேப் பட்டனை அழுத்தவும்.",
      },
      {
        title: "4. அவசர உதவி (SOS & Disguise)",
        desc: "சிவப்பு பட்டனை அழுத்தினால் உரத்த சைரன், 1091 உதவி எண் மற்றும் ரகசிய கால்குலேட்டர் திரை தோன்றும்.",
        voiceNote: "அவசர காலத்தில் சிவப்பு பட்டனை அழுத்தவும். 1091 எண்ணிற்கு இலவசமாக அழைக்கவும்.",
      },
      {
        title: "5. மகளிர் வட்டம் (5-7 km)",
        desc: "உங்கள் கிராமத்தை சுற்றியுள்ள 5-7 கி.மீ தோழிகளுடன் ஆலோசனைகளை பகிர்ந்து கொள்ளுங்கள்.",
        voiceNote: "மகளிர் வட்டத்தில் தோழிகள் ஒருவருக்கொருவர் உதவி செய்து கொள்ளலாம்.",
      },
    ],
    te: [
      {
        title: "1. సఖితో మాట్లాడండి (Voice Assistant)",
        desc: "ఇంగ్లీష్ అవసరం లేదు. క్రింద ఉన్న పెద్ద మైక్ బటన్ నొక్కి మీ స్వంత భాషలో సఖితో మాట్లాడండి.",
        voiceNote: "సోదరి, క్రింది మైక్ బటన్ నొక్కి ఏదైనా పథకం గురించి నేరుగా అడగండి.",
      },
      {
        title: "2. ప్రభుత్వ పథకాలు (Gov Schemes)",
        desc: "ముద్రా లోన్ (₹50,000), ప్రసూతి సహాయం (₹5,000) మరియు ఉచిత గ్యాస్ పథకాలు.",
        voiceNote: "ఇక్కడ అన్ని ప్రభుత్వ పథకాలు ఉన్నాయి. వినండి బటన్ నొక్కి తెలుసుకోండి.",
      },
      {
        title: "3. ₹1 శానిటరీ ప్యాడ్స్ & ఆరోగ్యం",
        desc: "జన ఔషధి కేంద్రంలో ₹1 కే లభించే ప్యాడ్లు మరియు ఆసుపత్రి మార్గాన్ని గూగుల్ మ్యాప్స్‌లో చూడండి.",
        voiceNote: "ప్యాడ్లు మరియు ఆసుపత్రి దారిని చూడటానికి మ్యాప్ బటన్ నొక్కండి.",
      },
      {
        title: "4. అత్యవసర రక్షణ (SOS & Disguise)",
        desc: "ఎరుపు బటన్ నొక్కితే సైరన్, 1091 హెల్ప్‌లైన్ మరియు కాలిక్యులేటర్ తెరపైకి వస్తాయి.",
        voiceNote: "ఆపదలో ఎరుపు బటన్ నొక్కండి. 1091 కి ఉచితంగా కాల్ చేయండి.",
      },
      {
        title: "5. చెలిమి బృందం (5-7 km)",
        desc: "మీ చుట్టుపక్కల 5 నుండి 7 కి.మీ పరిధిలోని మహిళలతో మాట్లాడి సలహాలు పొందండి.",
        voiceNote: "చెలిమి బృందంలో గ్రామ మహిళలు ఒకరికొకరు సహాయం చేసుకోవచ్చు.",
      },
    ],
    ml: [
      {
        title: "1. സഖിയോട് സംസാരിക്കൂ (Voice Assistant)",
        desc: "ഇംഗ്ലീഷ് ആവശ്യമില്ല. താഴെയുള്ള മൈക്ക് അമർത്തി സംസാരിക്കുക.",
        voiceNote: "മൈക്ക് അമർത്തി സംശയങ്ങൾ ചോദിക്കൂ.",
      },
      {
        title: "2. സർക്കാർ പദ്ധതികൾ (Gov Schemes)",
        desc: "മുദ്ര വായ്പ, മാതൃസഹായം, സൗജന്യ ഗ്യാസ് പദ്ധതികൾ.",
        voiceNote: "പദ്ധതി വിവരങ്ങൾ കേൾക്കാൻ സ്പീക്കർ അമർത്തുക.",
      },
      {
        title: "3. ₹1 സാനിറ്ററി പാഡുകൾ & കേന്ദ്രം",
        desc: "ജൻ ഔഷധി കേന്ദ്രങ്ങളും ആശുപത്രി വഴികളും മാപ്പിൽ കാണാം.",
        voiceNote: "മാപ്പിൽ വഴി കാണാൻ മാപ്പ് ബട്ടൺ അമർത്തുക.",
      },
      {
        title: "4. അടിയന്തര സുരക്ഷ (SOS & Disguise)",
        desc: "സൈറൺ, 1091 ഹെൽപ്പ്‌ലൈൻ, രഹസ്യ കാൽക്കുലേറ്റർ സംവിധാനം.",
        voiceNote: "അപകടത്തിൽ ചുവന്ന ബട്ടൺ അമർത്തുക.",
      },
      {
        title: "5. സഖി കൂട്ടായ്മ (5-7 km)",
        desc: "അടുത്തുള്ള സഹോദരിമാരുമായി സംവദിക്കാനുള്ള സുരക്ഷിത ഇടം.",
        voiceNote: "കൂട്ടായ്മയിൽ സഹായങ്ങൾ പങ്കിടാം.",
      },
    ],
    kn: [
      {
        title: "1. ಸಖಿ ಜೊತೆ ಮಾತನಾಡಿ (Voice Assistant)",
        desc: "ಇಂಗ್ಲಿಷ್ ಬೇಡ. ಕೆಳಗಿನ ಮೈಕ್ ಒತ್ತಿ ನಿಮ್ಮದೇ ಭಾಷೆಯಲ್ಲಿ ಮಾತನಾಡಿ.",
        voiceNote: "ಮೈಕ್ ಒತ್ತಿ ನಿಮಗೆ ಬೇಕಾದ ಮಾಹಿತಿ ಕೇಳಿ.",
      },
      {
        title: "2. ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು (Gov Schemes)",
        desc: "ಮುದ್ರಾ ಸಾಲ, ಮಾತೃತ್ವ ನೆರವು ಮತ್ತು ಉಚಿತ ಗ್ಯಾಸ್ ಯೋಜನೆಗಳು.",
        voiceNote: "ಕೇಳಿ ಬಟನ್ ಒತ್ತಿ ಯೋಜನೆಯ ಮಾಹಿತಿ ತಿಳಿಯಿರಿ.",
      },
      {
        title: "3. ₹1 ಸ್ಯಾನಿಟರಿ ಪ್ಯಾಡ್ & ಆಸ್ಪತ್ರೆ",
        desc: "ಜನೌಷಧಿ ಕೇಂದ್ರ ಮತ್ತು ಆಸ್ಪತ್ರೆ ದಾರಿಯನ್ನು ಗೂಗಲ್ ಮ್ಯಾಪ್‌ನಲ್ಲಿ ನೋಡಿ.",
        voiceNote: "ಮ್ಯಾಪ್ ಬಟನ್ ಒತ್ತಿ ದಾರಿ ತಿಳಿಯಿರಿ.",
      },
      {
        title: "4. ತುರ್ತು ರಕ್ಷಣೆ (SOS)",
        desc: "ಕೆಂಪು ಬಟನ್ ಒತ್ತಿದರೆ ಸೈರನ್ ಮತ್ತು 1091 ಸಹಾಯವಾಣಿ ಕರೆ ಲಭ್ಯ.",
        voiceNote: "ತುರ್ತು ಸಂದರ್ಭದಲ್ಲಿ ಕೆಂಪು ಬಟನ್ ಒತ್ತಿ.",
      },
      {
        title: "5. ಸಖಿ ಬಳಗ (5-7 km)",
        desc: "ಹತ್ತಿರದ ಮಹಿಳೆಯರೊಂದಿಗೆ ಮಾಹಿತಿ ಹಂಚಿಕೊಳ್ಳಿ.",
        voiceNote: "ಸಖಿ ಬಳಗದಲ್ಲಿ ಪರಸ್ಪರ ಸಹಾಯ ಪಡೆಯಿರಿ.",
      },
    ],
    mr: [
      {
        title: "1. सखीशी बोलून विचारा (Voice Assistant)",
        desc: "इंग्रजीची गरज नाही. खाली दिलेले माईक बटण दाबून आपल्या भाषेत बोला.",
        voiceNote: "माईक बटण दाबून तुम्ही काहीही विचारू शकता.",
      },
      {
        title: "2. शासकीय योजना (Gov Schemes)",
        desc: "मुद्रा कर्ज (₹50,000), मातृत्व सहाय्य आणि मोफत गॅस योजना.",
        voiceNote: "येथे सर्व शासकीय योजना आहेत. ऐका बटण दाबा.",
      },
      {
        title: "3. ₹1 सॅनिटरी पॅड्स व दवाखाना",
        desc: "जन औषधी केंद्र आणि रुग्णालयाचा मार्ग गुगल मॅप्सवर पहा.",
        voiceNote: "नकाशावर मार्ग पाहण्यासाठी मॅप बटण दाबा.",
      },
      {
        title: "4. तात्काळ सुरक्षा (SOS & Disguise)",
        desc: "लाल बटण दाबताच मोठा सायरन आणि 1091 हेल्पलाइन मिळेल.",
        voiceNote: "संकटाच्या वेळी लाल बटण दाबा.",
      },
      {
        title: "5. मैत्रीण मंडळ (5-7 km)",
        desc: "परिसरातील बहिणींशी संपर्क साधा आणि कामाची मदत मिळवा.",
        voiceNote: "मैत्रीण मंडळात एकमेकांना मदत करा.",
      },
    ],
    raj: [
      {
        title: "1. सखी सूं बात करो (Voice Assistant)",
        desc: "माइक दाब'र थारी बोली में बात करो।",
        voiceNote: "माइक दाब'र सवाल पूछो बाईसा।",
      },
      {
        title: "2. सरकारी योजनावां",
        desc: "मुद्रा लोन अर लाडो योजनावां।",
        voiceNote: "योजनावां री सीख सुणो।",
      },
      {
        title: "3. ₹1 सेनेटरी पैड",
        desc: "जन औषधि केंद्र रो रस्तो देखो।",
        voiceNote: "नक्शे पर रस्तो देखो।",
      },
      {
        title: "4. संकट सुरक्षा (SOS)",
        desc: "लाल बटन दाब'र सायरन बजाओ।",
        voiceNote: "1091 माथे फोन लगाओ।",
      },
      {
        title: "5. सहेली मंडळ (5-7 km)",
        desc: "गाँव री बहनां सूं बात करो।",
        voiceNote: "सहेली मंडळ में बात करो।",
      },
    ],
    gu: [
      {
        title: "1. સખી સાથે બોલીને પૂછો (Voice Assistant)",
        desc: "નીચે આપેલું માઇક દબાવીને તમારી ભાષામાં વાત કરો.",
        voiceNote: "માઇક દબાવીને યોજનાઓ વિશે પૂછો.",
      },
      {
        title: "2. સરકારી યોજનાઓ",
        desc: "મુદ્રા લોન અને પ્રસૂતિ સહાય યોજનાઓ.",
        voiceNote: "યોજનાઓની માહિતી સાંભળો.",
      },
      {
        title: "3. ₹1 સેનિટરી પેડ અને કેન્દ્ર",
        desc: "જન ઔષધિ કેન્દ્રનો રસ્તો ગુગલ મેપ્સ પર જુઓ.",
        voiceNote: "નકશા પર રસ્તો જુઓ.",
      },
      {
        title: "4. ઇમરજન્સી સુરક્ષા (SOS)",
        desc: "લાલ બટન દબાવવાથી સાયરન અને 1091 સહાય મળશે.",
        voiceNote: "મુસીબતમાં 1091 પર કોલ કરો.",
      },
      {
        title: "5. સહેલી મંડળ (5-7 km)",
        desc: "નજીકની બહેનો સાથે વાતચીત કરો.",
        voiceNote: "સહેલી મંડળમાં જોડાયેલા રહો.",
      },
    ],
    mai: [
      {
        title: "1. सखी सँ बाजि कऽ पुछू (Voice Assistant)",
        desc: "माइक दबा कऽ अपन भाषा मे बात करू।",
        voiceNote: "माइक दबा कऽ पुछू दीदी।",
      },
      {
        title: "2. सरकारी योजना",
        desc: "मुद्रा लोन आ मातृत्व योजना।",
        voiceNote: "योजनाक नियम सुनू।",
      },
      {
        title: "3. ₹1 सैनिटरी पैड",
        desc: "जन औषधि केंद्रक रस्ता देखू।",
        voiceNote: "नक्शा पर रस्ता देखू।",
      },
      {
        title: "4. आपदा सुरक्षा (SOS)",
        desc: "लाल बटन दबा कऽ 1091 पर फोन करू।",
        voiceNote: "संकट मे लाल बटन दबाउ।",
      },
      {
        title: "5. सहेली समाज (5-7 km)",
        desc: "गामक बहिन सभ सँ बात करू।",
        voiceNote: "सहेली समाज मे विचार साझा करू।",
      },
    ],
    bn: [
      {
        title: "1. সখীর সাথে কথা বলুন (Voice Assistant)",
        desc: "ইংরেজি লাগবে না। মাইক বোতাম টিপে বাংলায় কথা বলুন।",
        voiceNote: "মাইক টিপে যেকোনো প্রশ্ন জিজ্ঞাসা করুন দিদি।",
      },
      {
        title: "2. সরকারি প্রকল্প (Gov Schemes)",
        desc: "মুদ্রা ঋণ, মাতৃত্বকালীন সাহায্য ও অন্যান্য প্রকল্প।",
        voiceNote: "প্রকল্পের সমস্ত নিয়ম শুনুন।",
      },
      {
        title: "3. ₹১ স্যানিটারি প্যাড ও কেন্দ্র",
        desc: "জন ঔষধি কেন্দ্র এবং হাসপাতালের পথ ম্যাপে দেখুন।",
        voiceNote: "ম্যাপে পথ দেখতে বোতামে চাপ দিন।",
      },
      {
        title: "4. জরুরি নিরাপত্তা (SOS)",
        desc: "লাল বোতাম টিপলেই সাইরেন এবং ১০৯১ হেল্পলাইন।",
        voiceNote: "বিপদে লাল বোতাম টিপুন।",
      },
      {
        title: "5. সখী সমাজ (5-7 km)",
        desc: "কাছের গ্রামের মা-বোনেদের সাথে যুক্ত থাকুন।",
        voiceNote: "সখী সমাজে একে অপরকে সাহায্য করুন।",
      },
    ],
    pa: [
      {
        title: "1. ਸਖੀ ਨਾਲ ਬੋਲ ਕੇ ਪੁੱਛੋ (Voice Assistant)",
        desc: "ਮਾਈਕ ਦਬਾ ਕੇ ਆਪਣੀ ਬੋਲੀ ਵਿੱਚ ਗੱਲ ਕਰੋ।",
        voiceNote: "ਮਾਈਕ ਦਬਾ ਕੇ ਸਵਾਲ ਪੁੱਛੋ ਭੈਣ ਜੀ।",
      },
      {
        title: "2. ਸਰਕਾਰੀ ਸਕੀਮਾਂ",
        desc: "ਮੁਦਰਾ ਕਰਜ਼ਾ ਅਤੇ ਗਰਭਵਤੀ ਸਹਾਇਤਾ ਸਕੀਮਾਂ।",
        voiceNote: "ਸਕੀਮਾਂ ਦੀ ਜਾਣਕਾਰੀ ਸੁਣੋ।",
      },
      {
        title: "3. ₹1 ਸੈਨੇਟਰੀ ਪੈਡ",
        desc: "ਜਨ ਔਸ਼ਧੀ ਕੇਂਦਰ ਦਾ ਰਸਤਾ ਦੇਖੋ।",
        voiceNote: "ਨਕਸ਼ੇ 'ਤੇ ਰਾਹ ਦੇਖੋ।",
      },
      {
        title: "4. ਸੰਕਟ ਸੁਰੱਖਿਆ (SOS)",
        desc: "ਲਾਲ ਬਟਨ ਦਬਾ ਕੇ ਸਾਇਰਨ ਵਜਾਓ ਤੇ 1091 'ਤੇ ਕਾਲ ਕਰੋ।",
        voiceNote: "ਮੁਸੀਬਤ ਵੇਲੇ ਲਾਲ ਬਟਨ ਦਬਾਓ।",
      },
      {
        title: "5. ਸਹੇਲੀ ਮੰਡਲੀ (5-7 km)",
        desc: "ਪਿੰਡ ਦੀਆਂ ਭੈਣਾਂ ਨਾਲ ਗੱਲਬਾਤ ਕਰੋ।",
        voiceNote: "ਸਹੇਲੀ ਮੰਡਲੀ ਵਿੱਚ ਰਲ ਕੇ ਕੰਮ ਕਰੋ।",
      },
    ],
    or: [
      {
        title: "1. ସଖୀଙ୍କୁ କହି ପଚାରନ୍ତୁ (Voice Assistant)",
        desc: "ମାଇକ୍ ଚିପି ନିଜ ଭାଷାରେ କଥା ହୁଅନ୍ତୁ।",
        voiceNote: "ମାଇକ୍ ଚିପି ପ୍ରଶ୍ନ ପଚାରନ୍ତୁ।",
      },
      {
        title: "2. ସରକାରୀ ଯୋଜନା",
        desc: "ମୁଦ୍ରା ଋଣ ଓ ମାତୃତ୍ୱ ସହାୟତା ଯୋଜନା।",
        voiceNote: "ଯୋଜନା ବିଷୟରେ ଶୁଣନ୍ତୁ।",
      },
      {
        title: "3. ₹1 ସାନିଟାରୀ ପ୍ୟାଡ୍",
        desc: "ଜନ ଔଷଧି କେନ୍ଦ୍ରର ରାସ୍ତା ଦେଖନ୍ତୁ।",
        voiceNote: "ମ୍ୟାପରେ ରାସ୍ତା ଦେଖନ୍ତୁ।",
      },
      {
        title: "4. ଜରୁରୀ ସୁରକ୍ଷା (SOS)",
        desc: "ଲାଲ୍ ବଟନ୍ ଚିପି 1091 ରେ ମାଗଣା କଲ୍ କରନ୍ତୁ।",
        voiceNote: "ବିପଦରେ ଲାଲ୍ ବଟନ୍ ଚିପନ୍ତୁ।",
      },
      {
        title: "5. ସଖୀ ମଣ୍ଡଳ (5-7 km)",
        desc: "ଗାଁ ଭଉଣୀମାନଙ୍କ ସହ ସୁରକ୍ଷିତ ଆଲୋଚନା।",
        voiceNote: "ସଖୀ ମଣ୍ଡଳରେ ସହଯୋଗ କରନ୍ତୁ।",
      },
    ],
  };

  const stepsList = tourStepData[language] || tourStepData.hi;
  const current = stepsList[currentStep] || stepsList[0];
  const stepIcons = [Mic, FileText, Heart, AlertTriangle, Users];
  const stepColors = ["bg-amber-500", "bg-orange-600", "bg-rose-600", "bg-red-600", "bg-teal-600"];

  useEffect(() => {
    if (isOpen && current) {
      speakText(current.voiceNote, language);
    } else {
      stopSpeech();
      setCurrentStep(0);
    }
  }, [isOpen, currentStep, language]);

  if (!isOpen) return null;

  const IconComponent = stepIcons[currentStep] || Sparkles;
  const iconColor = stepColors[currentStep] || "bg-amber-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl p-6 text-stone-100 flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold text-amber-300">
              {t.appTour} ({t.tourStepCount} {currentStep + 1} / {stepsList.length})
            </span>
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

        {/* Card Content */}
        <div className="my-6 text-center">
          <div
            className={`w-16 h-16 rounded-2xl ${iconColor} text-white flex items-center justify-center mx-auto mb-4 shadow-lg`}
          >
            <IconComponent className="w-8 h-8" />
          </div>

          <h3 className="text-base font-bold text-white mb-2">{current.title}</h3>
          <p className="text-xs text-stone-300 leading-relaxed max-w-xs mx-auto">
            {current.desc}
          </p>

          <button
            onClick={() => speakText(current.voiceNote, language)}
            className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-amber-300 rounded-xl text-xs border border-stone-700"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{t.listenInVoice}</span>
          </button>
        </div>

        {/* Navigation Dots and Controls */}
        <div className="pt-4 border-t border-stone-800 flex items-center justify-between">
          <button
            disabled={currentStep === 0}
            onClick={() => setCurrentStep((p) => p - 1)}
            className={`p-2 rounded-xl text-xs font-medium flex items-center gap-1 ${
              currentStep === 0
                ? "text-stone-600 cursor-not-allowed"
                : "text-stone-300 hover:bg-stone-800"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{t.prevBtn}</span>
          </button>

          {/* Dots */}
          <div className="flex gap-1.5">
            {stepsList.map((_, i) => (
              <span
                key={i}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === currentStep ? "w-5 bg-amber-400" : "bg-stone-700"
                }`}
              />
            ))}
          </div>

          {currentStep < stepsList.length - 1 ? (
            <button
              onClick={() => setCurrentStep((p) => p + 1)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-xs font-bold flex items-center gap-1 shadow-md"
            >
              <span>{t.nextBtn}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => {
                stopSpeech();
                onClose();
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md"
            >
              <span>{t.understoodBtn}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
