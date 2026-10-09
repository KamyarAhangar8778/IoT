/**
 * @file TypeSelector.tsx
 * @description Type selector tab buttons for AutomationForm (Schedule, Timer, Weather).
 */

import React from "react";

interface TypeSelectorProps {
  autoType: "schedule" | "timer" | "weather";
  setAutoType: (type: "schedule" | "timer" | "weather") => void;
}

export function TypeSelector({ autoType, setAutoType }: TypeSelectorProps) {
  return (
    <div className="col-span-2 flex bg-[var(--card-bg)] p-1 rounded-xl border border-[var(--border-color)] overflow-hidden">
      <button
        type="button"
        onClick={() => setAutoType("schedule")}
        className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
          autoType === "schedule"
            ? "bg-[var(--accent3)] text-black shadow-sm"
            : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
        }`}
      >
        زمان‌بندی دوره‌ای
      </button>
      <button
        type="button"
        onClick={() => setAutoType("timer")}
        className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
          autoType === "timer"
            ? "bg-[var(--accent3)] text-black shadow-sm"
            : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
        }`}
      >
        تایمر یک‌بار مصرف
      </button>
      <button
        type="button"
        onClick={() => setAutoType("weather")}
        className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
          autoType === "weather"
            ? "bg-[var(--accent3)] text-black shadow-sm"
            : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
        }`}
      >
        مبتنی بر دما
      </button>
    </div>
  );
}
