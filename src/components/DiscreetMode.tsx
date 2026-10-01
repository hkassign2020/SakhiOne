import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { LanguageCode } from "../types";
import { APP_TRANSLATIONS } from "../data/translations";

interface DiscreetModeProps {
  language: LanguageCode;
  onExit: () => void;
}

export const DiscreetMode: React.FC<DiscreetModeProps> = ({ language, onExit }) => {
  const [display, setDisplay] = useState("0");
  const t = APP_TRANSLATIONS[language] || APP_TRANSLATIONS.hi;

  const handleKey = (key: string) => {
    if (key === "C") {
      setDisplay("0");
    } else if (key === "=") {
      try {
        const sanitized = display.replace(/[^0-9+\-*/.]/g, "");
        // eslint-disable-next-line no-eval
        const res = Function(`'use strict'; return (${sanitized})`)();
        setDisplay(String(res));
      } catch (e) {
        setDisplay("0");
      }
    } else {
      setDisplay((prev) => (prev === "0" ? key : prev + key));
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900 text-stone-100 flex flex-col justify-between p-6 select-none">
      {/* Top Disguise Header */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-xs text-stone-500 font-mono">12:45 PM · Calculator</span>
        <button
          onClick={onExit}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-stone-300 bg-stone-800 rounded-lg hover:text-white transition-colors"
          title={t.exitSafeMode}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t.exitSafeMode}</span>
        </button>
      </div>

      {/* Calculator Display */}
      <div className="my-8 text-right px-4">
        <div className="text-5xl font-mono tracking-tight text-white overflow-hidden text-ellipsis">
          {display}
        </div>
      </div>

      {/* Keypad */}
      <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto w-full pb-6">
        {["C", "±", "%", "/"].map((k) => (
          <button
            key={k}
            onClick={() => handleKey(k)}
            className="h-16 rounded-2xl bg-stone-800 text-xl font-medium text-amber-400 active:scale-95 transition-transform"
          >
            {k}
          </button>
        ))}
        {["7", "8", "9", "*"].map((k) => (
          <button
            key={k}
            onClick={() => handleKey(k)}
            className="h-16 rounded-2xl bg-stone-800 text-2xl font-medium text-stone-100 active:scale-95 transition-transform"
          >
            {k}
          </button>
        ))}
        {["4", "5", "6", "-"].map((k) => (
          <button
            key={k}
            onClick={() => handleKey(k)}
            className="h-16 rounded-2xl bg-stone-800 text-2xl font-medium text-stone-100 active:scale-95 transition-transform"
          >
            {k}
          </button>
        ))}
        {["1", "2", "3", "+"].map((k) => (
          <button
            key={k}
            onClick={() => handleKey(k)}
            className="h-16 rounded-2xl bg-stone-800 text-2xl font-medium text-stone-100 active:scale-95 transition-transform"
          >
            {k}
          </button>
        ))}
        <button
          onClick={() => handleKey("0")}
          className="col-span-2 h-16 rounded-2xl bg-stone-800 text-2xl font-medium text-stone-100 pl-6 text-left active:scale-95 transition-transform"
        >
          0
        </button>
        <button
          onClick={() => handleKey(".")}
          className="h-16 rounded-2xl bg-stone-800 text-2xl font-medium text-stone-100 active:scale-95 transition-transform"
        >
          .
        </button>
        <button
          onClick={() => handleKey("=")}
          className="h-16 rounded-2xl bg-amber-600 text-2xl font-medium text-white active:scale-95 transition-transform"
        >
          =
        </button>
      </div>

      <div className="text-center text-[11px] text-stone-500 pb-2">
        <span>{t.tapToExitHint}</span>
      </div>
    </div>
  );
};
