/**
 * @file TimerFields.tsx
 * @description One-time timer delay fields for AutomationForm.
 */

import React from "react";

interface TimerFieldsProps {
  delayHours: number | "";
  setDelayHours: (val: number | "") => void;
  delayMinutes: number | "";
  setDelayMinutes: (val: number | "") => void;
}

export function TimerFields({
  delayHours,
  setDelayHours,
  delayMinutes,
  setDelayMinutes,
}: TimerFieldsProps) {
  return (
    <>
      <div className="col-span-2 md:col-span-1">
        <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
          تاخیر (ساعت):
        </label>
        <input
          type="number"
          min="0"
          value={delayHours}
          onChange={(e) => setDelayHours(e.target.value === "" ? "" : Number(e.target.value))}
          placeholder="مثال: 1"
          className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] p-2.5 rounded-xl focus:outline-none focus:border-[var(--accent3)] text-sm transition-colors text-[var(--text-primary)]"
        />
      </div>
      <div className="col-span-2 md:col-span-1">
        <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
          تاخیر (دقیقه):
        </label>
        <input
          type="number"
          min="0"
          max="59"
          value={delayMinutes}
          onChange={(e) => setDelayMinutes(e.target.value === "" ? "" : Number(e.target.value))}
          placeholder="مثال: 30"
          className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] p-2.5 rounded-xl focus:outline-none focus:border-[var(--accent3)] text-sm transition-colors text-[var(--text-primary)]"
        />
      </div>
    </>
  );
}
