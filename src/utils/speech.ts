import { LANGUAGES } from "../data/languages";
import { LanguageCode } from "../types";

let currentUtterance: SpeechSynthesisUtterance | null = null;

// Speech Synthesis Helper
export function speakText(
  text: string,
  langCode: LanguageCode,
  onStart?: () => void,
  onEnd?: () => void
): boolean {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    console.warn("SpeechSynthesis not supported");
    return false;
  }

  // Cancel any ongoing speech
  stopSpeech();

  const langInfo = LANGUAGES[langCode] || LANGUAGES.hi;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = langInfo.bcp47;
  utterance.rate = 0.88; // Slightly slower, clear and gentle for first-time rural listeners
  utterance.pitch = 1.05;

  // Try to find native voice
  const voices = window.speechSynthesis.getVoices();
  const match = voices.find(
    (v) =>
      v.lang.toLowerCase().startsWith(langInfo.bcp47.toLowerCase()) ||
      v.lang.toLowerCase().includes(langInfo.code)
  );
  if (match) {
    utterance.voice = match;
  }

  utterance.onstart = () => {
    onStart?.();
  };

  utterance.onend = () => {
    currentUtterance = null;
    onEnd?.();
  };

  utterance.onerror = (e) => {
    console.warn("Speech synthesis error", e);
    currentUtterance = null;
    onEnd?.();
  };

  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopSpeech(): void {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
  currentUtterance = null;
}

export function isSpeaking(): boolean {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return false;
  return window.speechSynthesis.speaking;
}

// Emergency Loud Siren using Web Audio API
let sirenOscillator: OscillatorNode | null = null;
let sirenGain: GainNode | null = null;
let sirenAudioCtx: AudioContext | null = null;
let sirenInterval: any = null;

export function startEmergencySiren(): void {
  if (typeof window === "undefined") return;
  stopEmergencySiren();

  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    sirenAudioCtx = new AudioCtx();

    sirenOscillator = sirenAudioCtx.createOscillator();
    sirenGain = sirenAudioCtx.createGain();

    sirenOscillator.type = "sawtooth";
    sirenOscillator.frequency.setValueAtTime(650, sirenAudioCtx.currentTime);

    sirenGain.gain.setValueAtTime(0.3, sirenAudioCtx.currentTime);

    sirenOscillator.connect(sirenGain);
    sirenGain.connect(sirenAudioCtx.destination);

    sirenOscillator.start();

    // Modulate pitch up and down like Indian police/ambulance siren
    let pitchUp = true;
    sirenInterval = setInterval(() => {
      if (!sirenOscillator || !sirenAudioCtx) return;
      const targetFreq = pitchUp ? 1100 : 650;
      sirenOscillator.frequency.exponentialRampToValueAtTime(
        targetFreq,
        sirenAudioCtx.currentTime + 0.35
      );
      pitchUp = !pitchUp;
    }, 400);
  } catch (err) {
    console.error("AudioContext error for siren:", err);
  }
}

export function stopEmergencySiren(): void {
  if (sirenInterval) {
    clearInterval(sirenInterval);
    sirenInterval = null;
  }
  try {
    if (sirenOscillator) {
      sirenOscillator.stop();
      sirenOscillator.disconnect();
      sirenOscillator = null;
    }
    if (sirenGain) {
      sirenGain.disconnect();
      sirenGain = null;
    }
    if (sirenAudioCtx && sirenAudioCtx.state !== "closed") {
      sirenAudioCtx.close();
      sirenAudioCtx = null;
    }
  } catch (e) {
    // Ignore close errors
  }
}

// Gentle pleasant chime when starting or ending voice recording
export function playChime(type: "listen" | "success" | "alert" = "listen"): void {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    const freq = type === "listen" ? 587.33 : type === "success" ? 783.99 : 440;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    if (type === "listen") {
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
    } else if (type === "success") {
      osc.frequency.exponentialRampToValueAtTime(1046.5, ctx.currentTime + 0.2);
    }

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch (e) {
    // Audio context may be restricted before user gesture
  }
}

// Web Speech Recognition wrapper
export function createSpeechRecognizer(
  langCode: LanguageCode,
  onResult: (transcript: string) => void,
  onError: (err: any) => void,
  onEnd: () => void
) {
  if (typeof window === "undefined") return null;

  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    return null;
  }

  const recognition = new SpeechRecognition();
  const langInfo = LANGUAGES[langCode] || LANGUAGES.hi;
  recognition.lang = langInfo.bcp47;
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event: any) => {
    let finalTranscript = "";
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript;
      }
    }
    if (finalTranscript) {
      onResult(finalTranscript);
    }
  };

  recognition.onerror = (event: any) => {
    onError(event);
  };

  recognition.onend = () => {
    onEnd();
  };

  return recognition;
}
