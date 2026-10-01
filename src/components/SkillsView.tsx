import React, { useState } from "react";
import { Scissors, Utensils, Smartphone, Volume2, VolumeX, CheckCircle, ChevronDown, ChevronUp, BookOpen } from "lucide-react";
import { LanguageCode, SkillItem } from "../types";
import { SKILL_ITEMS } from "../data/skills";
import { APP_TRANSLATIONS } from "../data/translations";
import { speakText, stopSpeech } from "../utils/speech";

interface SkillsViewProps {
  language: LanguageCode;
}

export const SkillsView: React.FC<SkillsViewProps> = ({ language }) => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string>("tailoring_stitching");
  const [completedSteps, setCompletedSteps] = useState<Record<string, number[]>>({});

  const t = APP_TRANSLATIONS[language] || APP_TRANSLATIONS.hi;

  const handleListen = (skill: SkillItem) => {
    if (playingId === skill.id) {
      stopSpeech();
      setPlayingId(null);
      return;
    }

    const script =
      skill.voiceSummary[language] ||
      skill.voiceSummary.hi ||
      "सिलाई और अचार का हुनर सीखकर आप घर बैठे अच्छी कमाई कर सकती हैं।";

    setPlayingId(skill.id);
    speakText(
      script,
      language,
      () => {},
      () => setPlayingId(null)
    );
  };

  const toggleStep = (skillId: string, stepNum: number) => {
    setCompletedSteps((prev) => {
      const current = prev[skillId] || [];
      const updated = current.includes(stepNum)
        ? current.filter((s) => s !== stepNum)
        : [...current, stepNum];
      return { ...prev, [skillId]: updated };
    });
  };

  const getSkillIcon = (category: string) => {
    switch (category) {
      case "textile":
        return Scissors;
      case "food":
        return Utensils;
      case "digital":
        return Smartphone;
      default:
        return BookOpen;
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Banner */}
      <div className="bg-gradient-to-br from-teal-700 via-teal-800 to-emerald-900 rounded-3xl p-5 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-md">
          <span className="text-[11px] font-bold tracking-wider uppercase bg-white/20 px-2.5 py-1 rounded-md mb-2 inline-block">
            {t.skillsBannerTag}
          </span>
          <h2 className="text-xl font-bold mb-1">{t.skillsBannerTitle}</h2>
          <p className="text-xs text-teal-100 leading-relaxed">
            {t.skillsBannerDesc}
          </p>
        </div>

        <div className="absolute -bottom-6 -right-6 opacity-15 pointer-events-none text-white">
          <Scissors className="w-40 h-40" />
        </div>
      </div>

      {/* Skills Accordion List */}
      <div className="space-y-4">
        {SKILL_ITEMS.map((skill) => {
          const IconComp = getSkillIcon(skill.category);
          const isPlaying = playingId === skill.id;
          const isExpanded = expandedId === skill.id;
          const completed = completedSteps[skill.id] || [];
          const skillTitle = skill.titles[language] || skill.titles.hi;
          const skillEarning = skill.earnings[language] || skill.earnings.hi;
          const skillDuration = skill.durations[language] || skill.durations.hi;
          const skillMaterials = skill.materials[language] || skill.materials.hi;

          return (
            <div
              key={skill.id}
              className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-5 shadow-sm"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div
                  className="flex items-center gap-3 cursor-pointer flex-1"
                  onClick={() => setExpandedId(isExpanded ? "" : skill.id)}
                >
                  <div className="w-11 h-11 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-900/60 flex items-center justify-center shrink-0 text-teal-700 dark:text-teal-400">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                      {skillTitle}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                        {skillEarning}
                      </span>
                      <span className="text-[10px] text-stone-400">· {skillDuration}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleListen(skill)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isPlaying
                        ? "bg-red-600 text-white animate-pulse"
                        : "bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-200 hover:bg-teal-100"
                    }`}
                  >
                    {isPlaying ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    <span>{isPlaying ? t.stopBtn : t.listenBtn}</span>
                  </button>

                  <button
                    onClick={() => setExpandedId(isExpanded ? "" : skill.id)}
                    className="p-1.5 text-stone-400 hover:text-stone-600 rounded-lg"
                  >
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Collapsed summary / Expanded steps */}
              {isExpanded ? (
                <div className="space-y-4 pt-2 border-t border-stone-100 dark:border-stone-800 animate-in fade-in">
                  {/* Materials Required */}
                  <div className="bg-stone-50 dark:bg-stone-800/60 p-3 rounded-2xl text-xs">
                    <span className="font-semibold text-stone-800 dark:text-stone-200 block mb-1">
                      {t.materialsNeeded}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {skillMaterials.map((m, idx) => (
                        <span
                          key={idx}
                          className="bg-white dark:bg-stone-700 border border-stone-200 dark:border-stone-600 px-2 py-0.5 rounded-md text-stone-700 dark:text-stone-300 text-[11px]"
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Step by step guide */}
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-stone-900 dark:text-stone-100 block">
                      {t.stepByStepLearn}
                    </span>

                    {skill.steps.map((st) => {
                      const isDone = completed.includes(st.stepNumber);
                      const stTitle = st.titles[language] || st.titles.hi;
                      const stDesc = st.descriptions[language] || st.descriptions.hi;
                      const stTip = st.tips[language] || st.tips.hi;

                      return (
                        <div
                          key={st.stepNumber}
                          onClick={() => toggleStep(skill.id, st.stepNumber)}
                          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                            isDone
                              ? "bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800"
                              : "bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 text-[11px] font-bold flex items-center justify-center shrink-0">
                                {st.stepNumber}
                              </span>
                              <span>{stTitle}</span>
                            </h4>
                            <CheckCircle
                              className={`w-4 h-4 ${
                                isDone ? "text-emerald-600" : "text-stone-300 dark:text-stone-600"
                              }`}
                            />
                          </div>

                          <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed mb-1.5 pl-7">
                            {stDesc}
                          </p>

                          <div className="pl-7 text-[11px] text-amber-700 dark:text-amber-400 font-medium">
                            💡 {t.secretTip} {stTip}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Progress info */}
                  <div className="text-[11px] text-stone-500 flex items-center justify-between pt-1">
                    <span>
                      {t.stepsLearned} {completed.length} / {skill.steps.length}
                    </span>
                    <button
                      onClick={() =>
                        speakText(
                          skill.steps.map((s) => `${s.titles[language] || s.titles.hi}. ${s.descriptions[language] || s.descriptions.hi}`).join(". "),
                          language
                        )
                      }
                      className="text-teal-700 dark:text-teal-400 font-semibold underline flex items-center gap-1"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{t.listenAllSteps}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                  {skill.stepsCount} {t.stepByStepLearn}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
