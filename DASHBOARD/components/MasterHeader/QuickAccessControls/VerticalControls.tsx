import React from "react";
import { Settings as SettingsIcon } from "lucide-react";
import { ModulesIcon } from "@/components/icons";
import { useIoTStore } from '@/features/iot/hooks/useIoTStore';
import { QuickAccessControlsProps } from "./types";

export default function VerticalControls({
  setIsModulesMenuOpen,
  setIsMenuOpen,
  animationsEnabled,
  variant,
  isSidebarCollapsed,
}: QuickAccessControlsProps) {
  const setIsAutomationsMenuOpen = useIoTStore(s => s.setIsAutomationsMenuOpen);
  const isMenuOpen = useIoTStore(s => s.isMenuOpen);

  if (isSidebarCollapsed) {
    return (
      <div className="flex flex-col items-center gap-2.5 w-full mt-2">
        <button
          onClick={() => setIsModulesMenuOpen(true)}
          className="w-10 h-10 p-2 bg-[var(--card-bg-solid)] md:hover:bg-[var(--card-hover-bg)] border border-[var(--border-color)] md:hover:border-[var(--accent4)] rounded-xl text-[var(--accent4)] transition-all cursor-pointer flex justify-center items-center shadow-sm"
          title="پالایه و ماژول‌ها"
        >
          <ModulesIcon size={18} animationsEnabled={animationsEnabled} />
        </button>

        <button
          onClick={() => setIsAutomationsMenuOpen(true)}
          className="w-10 h-10 p-2 bg-[var(--card-bg-solid)] md:hover:bg-[var(--card-hover-bg)] border border-[var(--border-color)] md:hover:border-[var(--accent3)] rounded-xl text-[var(--accent3)] transition-all cursor-pointer flex justify-center items-center shadow-sm"
          title="اتوماسیون‌ها"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="12" x2="12" y2="6" className={animationsEnabled ? "animate-[spin_1s_linear_infinite]" : ""} style={{ transformOrigin: "12px 12px" }} />
            <line x1="12" y1="12" x2="16" y2="12" className={animationsEnabled ? "animate-[spin_12s_linear_infinite]" : ""} style={{ transformOrigin: "12px 12px" }} />
          </svg>
        </button>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`w-10 h-10 p-2 rounded-xl border transition-all cursor-pointer flex justify-center items-center shadow-sm ${
            isMenuOpen
              ? "bg-[var(--accent3-transparent)] border-[var(--accent3)] text-[var(--accent3)]"
              : "bg-[var(--card-bg-solid)] md:hover:bg-[var(--card-hover-bg)] border-[var(--border-color)] text-[var(--text-secondary)] md:hover:border-[var(--accent3)]"
          }`}
          title={isMenuOpen ? "بازگشت به خانه" : "تنظیمات اصلی"}
        >
          <SettingsIcon className={`w-4 h-4 ${isMenuOpen ? "rotate-90" : animationsEnabled ? "animate-[spin_10s_linear_infinite]" : ""}`} />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2 mt-4">
      <span className="text-[10px] text-[var(--text-muted)] font-black block text-right uppercase tracking-wider">
        بخش‌های کاربری
      </span>

      <button
        onClick={() => setIsModulesMenuOpen(true)}
        className="w-full flex items-center justify-between p-3 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg-solid)] md:hover:bg-[var(--card-hover-bg)] md:hover:border-[var(--accent4-medium)] text-[var(--text-secondary)] md:hover:text-[var(--text-primary)] transition-all duration-300 transform active:scale-[0.98] cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-[var(--accent4-transparent)] text-[var(--accent4)] flex items-center justify-center">
            <ModulesIcon
              size={16}
              animationsEnabled={animationsEnabled}
            />
          </div>
          <span className="text-xs font-semibold">پالایه و ماژول‌ها</span>
        </div>
        <span className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--border-color)] text-[var(--text-muted)] font-mono">
          Modules
        </span>
      </button>

      <button
        onClick={() => setIsAutomationsMenuOpen(true)}
        className="w-full flex items-center justify-between p-3 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg-solid)] md:hover:bg-[var(--card-hover-bg)] md:hover:border-[var(--accent3-medium)] text-[var(--text-secondary)] md:hover:text-[var(--text-primary)] transition-all duration-300 transform active:scale-[0.98] group cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-[var(--accent3-transparent)] text-[var(--accent3)]">
            <svg xmlns="http://www.w3.org/00/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="12" x2="12" y2="6" className={animationsEnabled ? "animate-[spin_1s_linear_infinite]" : ""} style={{ transformOrigin: "12px 12px" }} />
              <line x1="12" y1="12" x2="16" y2="12" className={animationsEnabled ? "animate-[spin_12s_linear_infinite]" : ""} style={{ transformOrigin: "12px 12px" }} />
            </svg>
          </div>
          <span className="text-xs font-semibold">اتوماسیون‌ها</span>
        </div>
        <span className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--border-color)] text-[var(--text-muted)] font-mono">
          Time
        </span>
      </button>

      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all duration-300 transform active:scale-[0.98] cursor-pointer ${
          isMenuOpen
            ? "bg-[var(--accent3-transparent)] border-[var(--accent3)] text-[var(--accent3)] shadow-md"
            : "bg-[var(--card-bg-solid)] md:hover:bg-[var(--card-hover-bg)] border-[var(--border-color)] md:hover:border-[var(--accent3-medium)] text-[var(--text-secondary)] md:hover:text-[var(--text-primary)]"
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div className={`p-1.5 rounded-lg transition-all ${isMenuOpen ? "bg-[var(--accent3)] text-white" : "bg-gray-500/10 text-[var(--text-tertiary)]"}`}>
            <SettingsIcon
              className={`w-4 h-4 ${isMenuOpen ? "rotate-90" : animationsEnabled ? "animate-[spin_10s_linear_infinite]" : ""}`}
            />
          </div>
          <span className="text-xs font-semibold">{isMenuOpen ? "بازگشت به خانه" : "تنظیمات اصلی"}</span>
        </div>
        <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${isMenuOpen ? "bg-[var(--accent3)] text-white" : "bg-[var(--border-color)] text-[var(--text-muted)]"}`}>
          {isMenuOpen ? "Active" : "Setup"}
        </span>
      </button>
    </div>
  );
}
