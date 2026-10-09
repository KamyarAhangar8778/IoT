import React from "react";
import { ArrowRight, Sliders, LayoutDashboard } from "lucide-react";
import { CATEGORY_FILTERS } from "./constants";
import { SettingsCategory } from "./types";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";

interface SettingsFilterSelectorProps {
  selectedCategory: SettingsCategory;
  setSelectedCategory: (cat: SettingsCategory) => void;
}

export function SettingsFilterSelector({
  selectedCategory,
  setSelectedCategory,
}: SettingsFilterSelectorProps) {
  const setIsMenuOpen = useIoTStore((s) => s.setIsMenuOpen);

  return (
    <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 bg-[var(--card-bg-solid)] border border-[var(--border-color)] p-3 md:p-4 rounded-2xl shadow-sm mb-6 transition-all duration-300">
      <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
        <button
          onClick={() => setIsMenuOpen(false)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--accent3-transparent)] text-[var(--accent3)] hover:bg-[var(--accent3)] hover:text-white border border-[var(--accent3)] transition-all duration-300 text-xs font-bold active:scale-95 group cursor-pointer shadow-sm"
          title="بازگشت به داشبورد اصلی"
        >
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          <span>بازگشت به خانه</span>
        </button>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] text-xs text-[var(--text-secondary)]">
          <Sliders className="w-3.5 h-3.5 text-[var(--accent3)]" />
          <span className="font-semibold text-[11px] md:text-xs">پیکربندی داشبورد</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
        {CATEGORY_FILTERS.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-300 cursor-pointer ${
                isActive
                  ? "bg-[var(--accent3)] text-white shadow-md scale-105"
                  : "bg-[var(--card-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--card-hover-bg)] border border-[var(--border-color)]"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
