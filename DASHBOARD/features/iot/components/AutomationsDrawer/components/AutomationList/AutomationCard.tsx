/**
 * @file AutomationCard.tsx
 * @description Single automation item card component for AutomationList.
 */

import React from "react";
import { Edit2, Trash2, Clock, Thermometer, Info, Layers } from "lucide-react";

const DAYS_MAP = [
  { value: 6, label: "شنبه" },
  { value: 0, label: "یکشنبه" },
  { value: 1, label: "دوشنبه" },
  { value: 2, label: "سه‌شنبه" },
  { value: 3, label: "چهارشنبه" },
  { value: 4, label: "پنج‌شنبه" },
  { value: 5, label: "جمعه" },
];

interface AutomationCardProps {
  auto: any;
  handleEdit: (auto: any) => void;
  handleDelete: (id: string) => void;
  handleToggle: (id: string, enabled: boolean) => void;
}

export function AutomationCard({
  auto,
  handleEdit,
  handleDelete,
  handleToggle,
}: AutomationCardProps) {
  const hasMacros = auto.actions?.some((a: any) => a.targetMacro);

  return (
    <div
      className={`flex flex-col p-4 rounded-2xl border transition-all shadow-sm ${
        auto.enabled
          ? "bg-[var(--card-bg-solid)] border-[var(--border-color)]"
          : "bg-[var(--card-bg)] border-[var(--border-color)] opacity-70"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className={`w-2.5 h-2.5 rounded-full shadow-sm ${
              auto.enabled
                ? hasMacros
                  ? "bg-indigo-500 shadow-indigo-500/40"
                  : auto.actions?.[0]?.actionOn
                    ? "bg-emerald-500 shadow-emerald-500/40"
                    : "bg-rose-500 shadow-rose-500/40"
                : "bg-slate-500 shadow-slate-500/40"
            }`}
          />
          <h4 className="font-bold text-[var(--text-primary)] text-xs">{auto.title}</h4>
        </div>

        <button
          type="button"
          onClick={() => handleToggle(auto.id, !auto.enabled)}
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${
            auto.enabled ? "bg-[var(--accent3)]" : "bg-[var(--border-color)]"
          }`}
          style={{ backgroundColor: auto.enabled ? "var(--accent3)" : undefined }}
        >
          <span
            className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
              auto.enabled ? "translate-x-1" : "translate-x-4"
            }`}
          />
        </button>
      </div>

      <div className="flex items-center justify-between mb-3 bg-[var(--card-hover-bg)] p-2.5 rounded-xl text-xs">
        {auto.intervalMinutes ? (
          <div className="flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-[var(--accent3)]" />
            <span className="font-bold text-[var(--text-primary)]">
              {auto.city}: دما {auto.temperatureCondition === "greater" ? "بیشتر از" : "کمتر از"}{" "}
              <span className="font-mono text-xs" dir="ltr">{auto.temperatureThreshold}°C</span>
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[var(--accent3)]" />
            <span className="font-bold font-mono text-sm text-[var(--text-primary)]" dir="ltr">
              {auto.time}
            </span>
          </div>
        )}

        <div className="flex flex-col items-end gap-1">
          {auto.intervalMinutes ? (
            <span className="text-[9px] bg-blue-500/15 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded font-bold">
              دما محور
            </span>
          ) : auto.repeatCount ? (
            <span className="text-[9px] font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded flex items-center gap-1">
              <Info className="w-3 h-3" />
              تایمر ({auto.repeatCount} بار)
            </span>
          ) : (
            <span className="text-[9px] bg-[var(--accent3-transparent)] text-[var(--accent3)] px-2 py-0.5 rounded font-bold">
              دوره‌ای
            </span>
          )}

          {!auto.intervalMinutes && auto.days && auto.days.length > 0 && (
            <div className="flex flex-wrap justify-end gap-1 max-w-[120px]">
              {auto.days.map((d: number) => (
                <span
                  key={d}
                  className="text-[8px] bg-[var(--card-bg)] text-[var(--text-secondary)] border border-[var(--border-color)] px-1 py-0.2 rounded"
                >
                  {DAYS_MAP.find((m) => m.value === d)?.label}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mt-auto pt-2 border-t border-[var(--border-color)]">
        <div className="text-[11px] text-[var(--text-secondary)] font-medium flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 opacity-70" />
          <span>{auto.actions?.length || 0} عملیات</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => handleEdit(auto)}
            className="p-1.5 text-[var(--text-muted)] hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors cursor-pointer"
            title="ویرایش"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleDelete(auto.id)}
            className="p-1.5 text-[var(--text-muted)] hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
            title="حذف"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
