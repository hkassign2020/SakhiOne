export type LanguageCode =
  | "hi" // Hindi
  | "ta" // Tamil
  | "te" // Telugu
  | "ml" // Malayalam
  | "kn" // Kannada
  | "mr" // Marathi
  | "raj" // Rajasthani
  | "gu" // Gujarati
  | "mai" // Maithili
  | "bn" // Bengali
  | "pa" // Punjabi
  | "or"; // Odia

export interface LanguageInfo {
  code: LanguageCode;
  name: string;
  nativeName: string;
  bcp47: string;
  region: string;
  greeting: string;
  motifName: string;
  primaryColor: string;
  accentColor: string;
  patternStyle: string;
}

export interface Scheme {
  id: string;
  category: "business" | "health" | "child" | "energy" | "hygiene";
  officialUrl: string;
  portalName: string;
  benefitAmount: string;
  iconName: string;
  titles: Record<LanguageCode, string>;
  benefits: Record<LanguageCode, string>;
  who: Record<LanguageCode, string>;
  documents: Record<LanguageCode, string[]>;
  steps: Record<LanguageCode, string>;
  badges: Record<LanguageCode, string>;
  listenScript: Record<LanguageCode, string>;
}

export interface EssentialSpot {
  id: string;
  category: "pads" | "maternity" | "medical" | "anganwadi" | "police";
  mapsQuery: string;
  officialSchemeRef?: string;
  names: Record<LanguageCode, string>;
  badges: Record<LanguageCode, string>;
  prices?: Record<LanguageCode, string>;
  description: Record<LanguageCode, string>;
}

export interface SkillItem {
  id: string;
  category: "textile" | "food" | "crafts" | "digital" | "agriculture";
  stepsCount: number;
  titles: Record<LanguageCode, string>;
  earnings: Record<LanguageCode, string>;
  durations: Record<LanguageCode, string>;
  materials: Record<LanguageCode, string[]>;
  steps: {
    stepNumber: number;
    titles: Record<LanguageCode, string>;
    descriptions: Record<LanguageCode, string>;
    tips: Record<LanguageCode, string>;
  }[];
  voiceSummary: Record<LanguageCode, string>;
}

export interface ReelVideo {
  id: string;
  duration: string;
  verifiedGov: boolean;
  views: string;
  likes: number;
  officialLink?: string;
  colorGradient: string;
  titles: Record<LanguageCode, string>;
  speakerRoles: Record<LanguageCode, string>;
  takeaways: Record<LanguageCode, string>;
  actionTexts: Record<LanguageCode, string>;
  transcript: Record<LanguageCode, string>;
}

export interface CommunityPost {
  id: string;
  authorNames: Record<LanguageCode, string>;
  villageZones: Record<LanguageCode, string>;
  distanceKm: number;
  timeAgos: Record<LanguageCode, string>;
  category: "pads_health" | "small_business" | "schemes_help" | "skills";
  contents: Record<LanguageCode, string>;
  likesCount: number;
  repliesCount: number;
  hasVoiceNote: boolean;
  voiceDuration?: string;
  isVerifiedSister: boolean;
  replies?: {
    id: string;
    authors: Record<LanguageCode, string>;
    texts: Record<LanguageCode, string>;
    timeAgos: Record<LanguageCode, string>;
  }[];
}
