/**
 * @file ModulesTabsSlider.tsx
 * @description Slider component for tab navigation inside ModulesDrawer matching SettingsDrawer style.
 */

import React from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MODULES_TABS } from "../core/types";

interface ModulesTabsSliderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  animationsEnabled?: boolean;
  isDark: boolean;
}

export function ModulesTabsSlider({
  activeTab,
  setActiveTab,
  animationsEnabled = true,
  isDark,
}: ModulesTabsSliderProps) {
  const handleNext = () => {
    const currIndex = MODULES_TABS.findIndex((t) => t.id === activeTab);
    const nextIndex = (currIndex + 1) % MODULES_TABS.length;
    setActiveTab(MODULES_TABS[nextIndex].id);
  };

  const handlePrev = () => {
    const currIndex = MODULES_TABS.findIndex((t) => t.id === activeTab);
    const prevIndex = (currIndex - 1 + MODULES_TABS.length) % MODULES_TABS.length;
    setActiveTab(MODULES_TABS[prevIndex].id);
  };

  const currIndex = MODULES_TABS.findIndex((t) => t.id === activeTab);
  const activeTabObj = MODULES_TABS[currIndex] || MODULES_TABS[0];

  return (
    <div className="space-y-3 font-sans">
      <div
        className={`border rounded-2xl p-2.5 flex items-center justify-between gap-1 shadow-inner relative overflow-hidden transition-colors duration-300 ${
          isDark ? "bg-slate-950/40 border-accent3-medium/50" : "bg-white/60 border-slate-200/90"
        }`}
      >
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-accent3 to-transparent opacity-80" />

        <motion.button
          onClick={handlePrev}
          whileHover={animationsEnabled ? { scale: 1.12, rotate: 3 } : undefined}
          whileTap={animationsEnabled ? { scale: 0.9 } : undefined}
          className={`p-1.5 rounded-xl border transition-all duration-300 cursor-pointer shrink-0 ${
            isDark
              ? "border-accent3-medium/30 bg-black/50 text-accent3 hover:text-accent4 hover:border-accent4"
              : "border-slate-200 bg-slate-50 text-slate-700 hover:text-accent3 hover:border-accent3 shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
          }`}
          title="بخش قبلی"
        >
          <ChevronRight className="w-4 h-4" />
        </motion.button>

        <div className="flex-1 text-center px-2 select-none overflow-hidden min-h-[44px] flex flex-col justify-center items-center">
          <span className="text-xs font-black font-sans text-accent3" style={{ color: "var(--accent3)" }}>
            {activeTabObj.title}
          </span>
          <span className="text-[9px] theme-text-muted font-sans uppercase tracking-wider">
            {activeTabObj.compactTitle}
          </span>
        </div>

        <motion.button
          onClick={handleNext}
          whileHover={animationsEnabled ? { scale: 1.12, rotate: -3 } : undefined}
          whileTap={animationsEnabled ? { scale: 0.9 } : undefined}
          className={`p-1.5 rounded-xl border transition-all duration-300 cursor-pointer shrink-0 ${
            isDark
              ? "border-accent3-medium/30 bg-black/50 text-accent3 hover:text-accent4 hover:border-accent4"
              : "border-slate-200 bg-slate-50 text-slate-700 hover:text-accent3 hover:border-accent3 shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
          }`}
          title="بخش بعدی"
        >
          <ChevronLeft className="w-4 h-4" />
        </motion.button>
      </div>

      <div className="flex items-center justify-center gap-2 pb-1">
        {MODULES_TABS.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1 rounded-xl text-[11px] font-bold font-sans transition-all duration-300 cursor-pointer ${
                isActive
                  ? "bg-accent3 text-black font-black shadow-sm"
                  : isDark
                    ? "bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800"
                    : "bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200"
              }`}
            >
              {tab.compactTitle}
            </button>
          );
        })}
      </div>
    </div>
  );
}
