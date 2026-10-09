/**
 * @file ModulesFilterSelector.tsx
 * @description Header control and category filter tabs for ModulesWorkspace.
 */

import React from "react";
import { Layers, Plus, Cpu, ArrowRight } from "lucide-react";
import { ModulesCategory } from "./types";

interface ModulesFilterSelectorProps {
  selectedCategory: ModulesCategory;
  setSelectedCategory: (cat: ModulesCategory) => void;
  onClose?: () => void;
}

const CATEGORIES: { id: ModulesCategory; label: string; icon: React.ElementType }[] = [
  { id: "all", label: "همه بخش‌های ماژول", icon: Layers },
  { id: "add", label: "افزودن سگمنت", icon: Plus },
  { id: "list", label: "لیست سگمنت‌ها", icon: Layers },
  { id: "guide", label: "راهنمای اتصال", icon: Cpu },
];

export function ModulesFilterSelector({
  selectedCategory,
  setSelectedCategory,
  onClose,
}: ModulesFilterSelectorProps) {
  return (
    <div className="w-full mb-6 space-y-4 font-sans text-right">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[var(--card-bg)] border border-[var(--border-color)] p-4 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-accent3/10 text-accent3 rounded-xl border border-accent3/20">
            <Layers className="w-5 h-5 text-[var(--accent3)]" />
          </div>
          <div>
            <h3 className="font-bold text-base text-[var(--text-primary)]">
              مدیریت ماژول‌ها و سگمنت‌های سخت‌افزاری
            </h3>
            <p className="text-xs theme-text-muted">
              افزودن، گروه بندی و پیکربندی سگمنت‌های سخت‌افزاری ESP32 به صورت مرکز محور
            </p>
          </div>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent3 text-black font-bold text-xs hover:opacity-90 transition-all cursor-pointer shadow-sm active:scale-95"
            style={{ backgroundColor: "var(--accent3)" }}
          >
            <span>بازگشت به داشبورد</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? "bg-[var(--accent3)] text-black shadow-sm"
                  : "bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent3)]"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
