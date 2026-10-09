import React, { useState, useRef, useEffect } from "react";
import { Settings, Columns, MoreVertical } from "lucide-react";
import { ThemeAnimatedIcon, ModulesIcon } from "@/components/icons";
import LayoutColumnsSwitcher from "../LayoutColumnsSwitcher";
import { useIoTStore } from '@/features/iot/hooks/useIoTStore';
import { useDashboard } from "@/features/dashboard/context/DashboardContext";
import { AnimatePresence, motion } from "motion/react";
import { BrandBoxProps } from "./types";

interface MobileMenuProps extends Omit<BrandBoxProps, "headerTitle" | "variant" | "groupsOrder" | "selectedGroupFilter" | "setSelectedGroupFilter"> {}

export default function MobileDropdownMenu({
  isDark,
  setIsDark,
  animationsEnabled,
  setIsModulesMenuOpen,
  setIsMenuOpen,
  groupsCols,
  setGroupsCols,
}: MobileMenuProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const setIsAutomationsMenuOpen = useIoTStore(s => s.setIsAutomationsMenuOpen);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.addEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div className="md:hidden flex items-center gap-1 bg-[var(--bg-main)] p-1 border border-[var(--border-color)] rounded-lg relative" ref={dropdownRef}>
      {setIsDark && (
        <button
          onClick={() => setIsDark(!isDark)}
          className="p-1.5 text-[var(--text-secondary)] md:hover:text-[var(--accent4)] rounded transition-all flex items-center justify-center"
          title="تغییر تم پوسته"
          type="button"
        >
          <ThemeAnimatedIcon
            isDark={isDark}
            animationsEnabled={animationsEnabled}
            size={16}
          />
        </button>
      )}
      
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className={`p-1.5 rounded transition-all ${isDropdownOpen ? "bg-[var(--accent3-transparent)] text-[var(--accent3)]" : "text-[var(--text-secondary)] md:hover:text-[var(--accent3)]"}`}
        title="منوی دسترسی سریع"
        type="button"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={animationsEnabled ? { opacity: 0, scale: 0.95, originX: 0, originY: 0 } : false}
            animate={animationsEnabled ? { opacity: 1, scale: 1 } : false}
            exit={animationsEnabled ? { opacity: 0, scale: 0.95 } : undefined}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 w-64 max-w-[calc(100vw-32px)] bg-[var(--card-bg-solid)] backdrop-blur-xl border border-[var(--border-color)] rounded-xl shadow-2xl p-3 z-[100] flex flex-col gap-3 origin-top-left"
          >
            {/* Grid for Actions */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setIsAutomationsMenuOpen(true);
                  setIsDropdownOpen(false);
                }}
                type="button"
                className="flex flex-col items-center justify-center gap-2 p-3 bg-[var(--bg-main)] border border-[var(--border-color)] md:hover:border-[var(--accent3)] md:hover:bg-[var(--card-hover-bg)] rounded-xl transition-colors text-center group"
              >
                <div className="p-1.5 rounded-lg bg-[var(--accent3-transparent)] text-[var(--accent3)] flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/00/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="12" x2="12" y2="6" className={animationsEnabled ? "animate-[spin_1s_linear_infinite]" : ""} style={{ transformOrigin: "12px 12px" }} />
                    <line x1="12" y1="12" x2="16" y2="12" className={animationsEnabled ? "animate-[spin_12s_linear_infinite]" : ""} style={{ transformOrigin: "12px 12px" }} />
                  </svg>
                </div>
                <span className="text-[10px] font-bold text-[var(--text-primary)]">اتوماسیون‌ها</span>
              </button>

              {setIsMenuOpen && (
                <button
                  onClick={() => {
                    setIsMenuOpen(true);
                    setIsDropdownOpen(false);
                  }}
                  type="button"
                  className="flex flex-col items-center justify-center gap-2 p-3 bg-[var(--bg-main)] border border-[var(--border-color)] md:hover:border-indigo-500/50 md:hover:bg-[var(--card-hover-bg)] rounded-xl transition-colors text-center group"
                >
                  <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500">
                    <Settings className={`w-4 h-4 ${animationsEnabled ? "animate-[spin_10s_linear_infinite]" : ""}`} />
                  </div>
                  <span className="text-[10px] font-bold text-[var(--text-primary)]">تنظیمات</span>
                </button>
              )}

              {setIsModulesMenuOpen && (
                <button
                  onClick={() => {
                    setIsModulesMenuOpen(true);
                    setIsDropdownOpen(false);
                  }}
                  type="button"
                  className="col-span-2 flex flex-col items-center justify-center gap-2 p-3 bg-[var(--bg-main)] border border-[var(--border-color)] md:hover:border-[var(--accent4)] md:hover:bg-[var(--card-hover-bg)] rounded-xl transition-colors text-center group"
                >
                  <div className="p-1.5 rounded-lg bg-[var(--accent4-transparent)] text-[var(--accent4)] flex items-center justify-center">
                    <ModulesIcon
                      size={16}
                      animationsEnabled={animationsEnabled}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-[var(--text-primary)]">ماژول‌ها</span>
                </button>
              )}
            </div>

            {setGroupsCols && groupsCols !== undefined && (
              <div className="border-t border-[var(--border-color)] mt-1 pt-3 pb-1">
                <div className="px-1 mb-2 text-[10px] text-[var(--text-muted)] flex items-center justify-between">
                  <span>تعداد ستون‌ها</span>
                  <Columns className="w-3 h-3" />
                </div>
                <div className="flex justify-center" onClick={(e) => {
                  // Only close if a button was actually clicked
                  if ((e.target as HTMLElement).closest('button')) {
                    setIsDropdownOpen(false);
                  }
                }}>
                  <LayoutColumnsSwitcher
                    groupsCols={groupsCols}
                    setGroupsCols={setGroupsCols}
                    variant="horizontal"
                  />
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
