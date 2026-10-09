import React from "react";
import { ThemeAnimatedIcon } from "@/components/icons";

interface ThemeToggleProps {
  isDark: boolean;
  setIsDark: (val: boolean) => void;
  animationsEnabled?: boolean;
  variant: "vertical" | "horizontal";
  isSidebarCollapsed?: boolean;
}

/**
 * Dashboard Theme Toggle button supporting horizontal and vertical layouts.
 */
export default function ThemeToggle({
  isDark,
  setIsDark,
  animationsEnabled = false,
  variant,
  isSidebarCollapsed,
}: ThemeToggleProps) {
  if (variant === "vertical" && !isSidebarCollapsed) {
    return (
      <div className="pt-4 border-t border-[var(--border-color)]">
        <button
          onClick={() => setIsDark(!isDark)}
          className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-main)] md:hover:bg-[var(--card-hover-bg)] border border-[var(--border-color)] transition-all text-xs font-medium group"
          title="تغییر حالت روز و شب"
        >
          <span className="text-[11px] text-[var(--text-secondary)] font-medium">
            {isDark ? "حالت شب (تیره)" : "حالت روز (روشن)"}
          </span>
          <div className="p-1.5 rounded-lg bg-[var(--card-bg-solid)] border border-[var(--border-color)] shadow-xs">
            <ThemeAnimatedIcon
              isDark={isDark}
              animationsEnabled={animationsEnabled}
              size={16}
            />
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className={variant === "vertical" ? "pt-4 border-t border-[var(--border-color)] flex justify-center" : ""}>
      <button
        onClick={() => setIsDark(!isDark)}
        className={`${variant === "vertical" ? "w-full flex justify-center items-center" : "hidden md:flex"} p-2 md:p-2.5 bg-transparent md:hover:bg-[var(--accent3-transparent)] border border-[var(--border-color)] rounded-xl text-[var(--text-secondary)] md:hover:text-[var(--text-primary)] md:hover:border-[var(--accent3)] transition-all active:scale-[0.97] group cursor-pointer`}
        title="تغییر رنگ پوسته"
      >
        <ThemeAnimatedIcon
          isDark={isDark}
          animationsEnabled={animationsEnabled}
          size={16}
        />
      </button>
    </div>
  );
}


