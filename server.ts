import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: "10mb" }));

// Server-side Gemini initialization following gemini-api guidelines
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Multilingual Voice/Text AI Query Endpoint
app.post("/api/ai/ask", async (req, res) => {
  try {
    const { query, language = "Hindi", isEmergency = false, userLocation } = req.body;

    if (!query || typeof query !== "string") {
      res.status(400).json({ error: "Query is required" });
      return;
    }

    const systemInstruction = `
You are 'Sakhi' (सखी / தோழி / స్నేహితురాలు), a warm, caring, knowledgeable elder sister companion for rural Indian women who have never used technology or the internet before.
The user speaks ${language}.
Your core mandate:
1. Always respond in the requested language (${language}) using the appropriate native script (e.g. Tamil script for Tamil, Telugu script for Telugu, Devanagari for Hindi/Marathi/Rajasthani/Maithili, Malayalam script for Malayalam, Kannada script for Kannada, Bengali script for Bengali, Gurmukhi for Punjabi, Odia script for Odia, Gujarati script for Gujarati).
2. Use very simple, respectful, conversational language as if talking to a sister in the village courtyard. No complicated English words or confusing bureaucracy.
3. Be brief and actionable: 2 to 4 short sentences.
4. If the question is about government schemes (like Mudra loan, Ujjwala LPG, Matru Vandana, Lakhpati Didi, Sukanya Samriddhi, Jan Aushadhi pads), explain:
   - What benefit they will receive in cash/material.
   - Exact documents to carry (e.g. "Take your Aadhaar card and Bank Passbook").
   - Exactly where to go in the village (e.g. "Visit your nearest Gram Panchayat office, CSC Seva Kendra, or Anganwadi Didi").
5. ${
      isEmergency
        ? "CRITICAL EMERGENCY MODE: The woman is in distress or danger. Speak calmly and urgently. Reassure her she is safe. Provide national helpline numbers: Women Helpline 1091 and 181, Police 112, Childline 1098. Tell her to stay in a well-lit public space or reach a trusted neighbor or Anganwadi worker immediately."
        : "Provide clear, empowering guidance."
    }
6. Provide your reply in JSON format with fields:
   - "speechText": The exact short spoken text to read aloud in ${language} (maximum 3 short sentences, gentle and natural).
   - "simpleAdvice": Bullet-point or short 2-3 line breakdown of what to do.
   - "targetScheme": Name of relevant scheme if applicable (or null).
   - "recommendedGovPortal": Relevant URL if applicable (e.g. mudra.org.in, pmmvy.wcd.gov.in, pmuy.gov.in, janaushadhi.gov.in, nrlm.gov.in).
   - "nearestDestinationCategory": e.g. "jan_aushadhi", "anganwadi", "csc_centre", "hospital", "police" or null.
   - "suggestedFollowUp": A suggested question she can ask next in ${language}.
`;

    const fallbackSpeech: Record<string, string> = {
      Hindi: "नमस्ते बहन! मैं आपकी सखी हूँ। आप बिना किसी झिझक के सरकारी योजना, सिलाई हुनर, या जन औषधि केंद्र के बारे में पूछ सकती हैं।",
      Tamil: "வணக்கம் சகோதரி! நான் உங்கள் சகி. அரசு திட்டங்கள், தையல் பயிற்சி, அல்லது பெண்களுக்கு தேவையான உதவிகளை கேட்கலாம்.",
      Telugu: "నమస్కారం సోదరి! నేను మీ సఖిని. ప్రభుత్వ పథకాలు లేదా ఆరోగ్య సేవల గురించి నన్ను అడగండి.",
      Malayalam: "നമസ്കാരം സഹോദരി! സർക്കാർ പദ്ധതികളെക്കുറിച്ചോ ആരോഗ്യ സഹായങ്ങളെക്കുറിച്ചോ ചോദിക്കാം.",
      Kannada: "ನಮಸ್ಕಾರ ಸಹೋದರಿ! ನಾನು ನಿಮ್ಮ ಸಖಿ. ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು ಮತ್ತು ಮಹಿಳಾ ಸಹಾಯಕ್ಕಾಗಿ ನನ್ನನ್ನು ಕೇಳಿ.",
      Marathi: "नमस्कार ताई! मी तुमची सखी आहे. शासकीय योजना, आरोग्य केंद्र किंवा कौशल्य शिकण्यासाठी मला विचारा.",
      Bengali: "নমস্কার দিদি! আমি আপনার সখী। সরকারি প্রকল্প বা স্বাস্থ্য সহায়তা সম্পর্কে জানতে আমাকে বলুন।",
      Gujarati: "નમસ્તે બહેન! હું તમારી સખી છું. સરકારી યોજના અથવા સહાય માટે મને પૂછો.",
      Punjabi: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਭੈਣ ਜੀ! ਮੈਂ ਤੁਹਾਡੀ ਸਖੀ ਹਾਂ। ਸਰਕਾਰੀ ਸਕੀਮਾਂ ਬਾਰੇ ਮੈਨੂੰ ਪੁੱਛੋ।",
      Odia: "ନମସ୍କାର ଭଉଣୀ! ମୁଁ ଆପଣଙ୍କ ସଖୀ। ସରକାରୀ ଯୋଜନା ବିଷୟରେ ଜାଣିବାକୁ ମୋତେ ପଚାରନ୍ତୁ।",
      Rajasthani: "खम्मा घणी बाईसा! म्हूँ थारी सखी हूँ। सरकारी योजना अर हुनर खातर म्हाने पूछो।",
      Maithili: "प्रणाम दीदी! हम अहाँक सखी छी। सरकारी योजना आ हुनर लेल हमरा सँ पुछू।",
    };

    if (!process.env.GEMINI_API_KEY) {
      res.json({
        speechText: fallbackSpeech[language] || fallbackSpeech["Hindi"],
        simpleAdvice: "1. अपने पास का आधार कार्ड और बैंक पासबुक तैयार रखें।\n2. पंचायत भवन या आशा दीदी से संपर्क करें।",
        targetScheme: "PM Mudra & Lakhpati Didi",
        recommendedGovPortal: "https://www.mudra.org.in",
        nearestDestinationCategory: "csc_centre",
        suggestedFollowUp: "मुझे ₹50,000 का लोन कैसे मिलेगा?",
      });
      return;
    }

    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), 5000)
      );

      const geminiPromise = ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: `User asks: "${query}". Location context: ${userLocation || "Rural India"}.`,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
        },
      });

      const response: any = await Promise.race([geminiPromise, timeoutPromise]);
      const parsed = JSON.parse(response.text || "{}");
      res.json(parsed);
      return;
    } catch (apiError) {
      console.warn("Gemini API call returned error, serving contextual fallback:", apiError);
      
      const qLower = query.toLowerCase();
      let contextualSpeech = fallbackSpeech[language] || fallbackSpeech["Hindi"];
      let portal = "https://www.mudra.org.in";
      let dest = "csc_centre";
      let advice = "1. आधार कार्ड व बैंक पासबुक साथ रखें।\n2. नजदीकी पंचायत भवन या जन सेवा केंद्र जाएं।";

      if (qLower.includes("पैड") || qLower.includes("pad") || qLower.includes("कपड़ा") || qLower.includes("दवा")) {
        contextualSpeech = "दीदी, जन औषधि केंद्र पर ₹1 में 100% बायोडिग्रेडेबल सुविधा सैनिटरी पैड मिलता है। ₹4 में 4 पैड का पैकेट सीधे ले सकती हैं।";
        portal = "https://janaushadhi.gov.in";
        dest = "jan_aushadhi";
        advice = "1. जन औषधि केंद्र पर जाएं।\n2. किसी डॉक्टर की पर्ची की जरूरत नहीं है।";
      } else if (qLower.includes("लोन") || qLower.includes("loan") || qLower.includes("सिलाई") || qLower.includes("रुपय")) {
        contextualSpeech = "प्रधानमंत्री मुद्रा योजना में सिलाई मशीन या दुकान के लिए ₹50,000 तक का लोन बिना किसी गारंटी के मिलता है। बस आधार और बैंक पासबुक लेकर ग्रामीण बैंक जाएं।";
        portal = "https://www.mudra.org.in";
        dest = "csc_centre";
        advice = "1. आधार कार्ड, 2 फोटो और बैंक पासबुक लेकर जाएं।\n2. किसी दलाल को पैसा न दें।";
      } else if (qLower.includes("गर्भवती") || qLower.includes("बच्चा") || qLower.includes("5000") || qLower.includes("मातृ")) {
        contextualSpeech = "प्रधानमंत्री मातृ वंदना योजना में गर्भवती महिलाओं को पौष्टिक आहार के लिए ₹5,000 सीधे बैंक खाते में मिलते हैं। अपनी आंगनवाड़ी दीदी से मिलें।";
        portal = "https://pmmvy.wcd.gov.in";
        dest = "anganwadi";
        advice = "1. गर्भावस्था के पहले 3 महीने में आंगनवाड़ी में नाम दर्ज कराएं।\n2. एमसीपी कार्ड और बैंक पासबुक जरूरी है।";
      } else if (qLower.includes("गैस") || qLower.includes("चूल्हा") || qLower.includes("उज्ज्वला")) {
        contextualSpeech = "उज्ज्वला योजना में ग्रामीण महिलाओं को मुफ्त गैस कनेक्शन, भरा हुआ सिलेंडर और चूल्हा मिलता है। नजदीकी गैस एजेंसी या सीएससी केंद्र पर जाएं।";
        portal = "https://www.pmuy.gov.in";
        dest = "csc_centre";
        advice = "1. राशन कार्ड और आधार कार्ड लेकर जाएं।\n2. परिवार में पहले से कोई गैस कनेक्शन न हो।";
      }

      res.json({
        speechText: contextualSpeech,
        simpleAdvice: advice,
        targetScheme: "सरकारी महिला कल्याण योजना",
        recommendedGovPortal: portal,
        nearestDestinationCategory: dest,
        suggestedFollowUp: "इसके लिए कौन से कागजात चाहिए?",
      });
    }
  } catch (error: any) {
    console.error("Fatal in /api/ai/ask:", error);
    res.status(200).json({
      speechText: "नमस्ते दीदी! आप सरकारी योजना, सिलाई हुनर या ₹1 वाले सैनिटरी पैड के बारे में पूछ सकती हैं।",
      simpleAdvice: "आधार कार्ड और बैंक पासबुक तैयार रखें।",
      recommendedGovPortal: "https://www.mudra.org.in",
      nearestDestinationCategory: "csc_centre",
    });
  }
});

// Emergency SOS AI guidance endpoint
app.post("/api/ai/emergency", async (req, res) => {
  try {
    const { emergencyType = "general", language = "Hindi" } = req.body;

    const systemInstruction = `
You are the Emergency SOS AI responder for SakhiSetu, safeguarding rural women in India.
The user is facing: ${emergencyType}.
Language: ${language}.
Provide immediate, calming, lifesaving guidance in ${language}.
Crucial numbers:
- Women Helpline: 1091 / 181
- National Emergency: 112
- Domestic Violence Cell: 181
- Child Helpline: 1098
- Ambulance: 108

Return JSON:
{
  "urgentSpeech": "Short 2 sentences in ${language} to calm her and state the exact phone number to dial.",
  "immediateSteps": ["step 1", "step 2", "step 3"],
  "contacts": [
    {"name": "National Women Helpline", "number": "1091"},
    {"name": "Emergency Police", "number": "112"},
    {"name": "Women in Distress", "number": "181"}
  ]
}
`;

    if (!process.env.GEMINI_API_KEY) {
      res.json({
        urgentSpeech: "घबराएं नहीं, आप सुरक्षित हैं। तुरंत 112 या 1091 पर कॉल करें।",
        immediateSteps: [
          "1. सुरक्षित और रोशनी वाली जगह पर जाएं।",
          "2. तुरंत 1091 या 112 पर कॉल करें (मुफ्त कॉल)।",
          "3. नजदीकी आशा दीदी या भरोसेमंद पड़ोसी को आवाज़ दें।",
        ],
        contacts: [
          { name: "महिला हेल्पलाइन", number: "1091" },
          { name: "आपातकालीन पुलिस", number: "112" },
          { name: "महिला संकट केंद्र (181)", number: "181" },
        ],
      });
      return;
    }

    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), 3500)
      );

      const geminiPromise = ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: `Emergency trigger: ${emergencyType}`,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
        },
      });

      const response: any = await Promise.race([geminiPromise, timeoutPromise]);
      const parsed = JSON.parse(response.text || "{}");
      res.json(parsed);
      return;
    } catch (err) {
      console.warn("Emergency AI timeout or error, serving immediate lifesaving fallback");
      res.json({
        urgentSpeech: "घबराएं नहीं, आप बिल्कुल सुरक्षित हैं। तुरंत 1091 या 112 पर मुफ्त कॉल करें।",
        immediateSteps: [
          "1. किसी सुरक्षित, रोशनी वाली जगह या पड़ोसी के पास जाएं।",
          "2. तुरंत 1091 (महिला हेल्पलाइन) या 112 डायल करें।",
          "3. फोन का लाउडस्पीकर चालू रखें और मदद मांगें।",
        ],
        contacts: [
          { name: "महिला हेल्पलाइन", number: "1091" },
          { name: "पुलिस आपातकालीन", number: "112" },
          { name: "महिला संकट केंद्र (181)", number: "181" },
        ],
      });
    }
  } catch (error) {
    console.error("Emergency AI error:", error);
    res.status(200).json({
      urgentSpeech: "तुरंत 112 या 1091 पर कॉल करें।",
      immediateSteps: ["तुरंत 112 डायल करें"],
      contacts: [{ name: "महिला हेल्पलाइन", number: "1091" }],
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.resolve(__dirname, "dist")));
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SakhiSetu server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
