import React from "react";

interface PinToggleProps {
  isPinOn: boolean;
  buttonProps: React.ButtonHTMLAttributes<HTMLButtonElement>;
  animationsEnabled?: boolean;
  isUltraCompact?: boolean;
  isVertical?: boolean;
}

export default function PinToggle({
  isPinOn,
  buttonProps,
  animationsEnabled = true,
  isUltraCompact = false,
  isVertical = false,
}: PinToggleProps) {
  return (
    <button
      {...(buttonProps as any)}
      className={`switch-toggle relative inline-flex ${isVertical ? "w-6 h-11 flex-col" : "h-6 w-11"} rounded-full p-0.5 items-center transition-all duration-300 shrink-0 cursor-pointer focus:outline-none select-none md:hover:scale-105 active:scale-95 ${
        isUltraCompact ? "shadow-inner" : ""
      } ${
        isPinOn
          ? "bg-[var(--accent4)] shadow-[0_0_12px_var(--accent4-transparent)]"
          : isUltraCompact
            ? "bg-black/40 border border-slate-700/50 dark:border-slate-800"
            : "bg-black/20 dark:bg-black/40 border border-slate-300/50 dark:border-slate-700/60"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white dark:bg-slate-100 shadow-md transform ${
          animationsEnabled ? "transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]" : ""
        } ${isVertical ? (isPinOn ? "translate-y-0" : "translate-y-5") : (isPinOn ? "-translate-x-5" : "translate-x-0")}`}
      />
    </button>
  );
}
