/**
 * @file ScheduleFields.tsx
 * @description Time and day-of-week inputs for scheduled automations.
 */

import React from "react";

const DAYS_MAP = [
  { value: 6, label: "شنبه" },
  { value: 0, label: "یکشنبه" },
  { value: 1, label: "دوشنبه" },
  { value: 2, label: "سه‌شنبه" },
  { value: 3, label: "چهارشنبه" },
  { value: 4, label: "پنج‌شنبه" },
  { value: 5, label: "جمعه" },
];

interface ScheduleFieldsProps {
  time: string;
  setTime: (val: string) => void;
  repeatCount: number | "";
  setRepeatCount: (val: number | "") => void;
  days: number[];
  setDays: (days: number[]) => void;
}

export function ScheduleFields({
  time,
  setTime,
  repeatCount,
  setRepeatCount,
  days,
  setDays,
}: ScheduleFieldsProps) {
  const toggleDay = (dayVal: number) => {
    if (days.includes(dayVal)) {
      setDays(days.filter((x) => x !== dayVal));
    } else {
      setDays([...days, dayVal].sort());
    }
  };

  return (
    <>
      <div className="col-span-2 md:col-span-1">
        <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
          زمان (ساعت):
        </label>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] p-2.5 rounded-xl focus:outline-none focus:border-[var(--accent3)] text-sm transition-colors text-[var(--text-primary)]"
          dir="ltr"
        />
      </div>
      <div className="col-span-2 md:col-span-1">
        <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
          تعداد تکرار:
        </label>
        <input
          type="number"
          min="0"
          value={repeatCount}
          onChange={(e) => setRepeatCount(e.target.value === "" ? "" : Number(e.target.value))}
          placeholder="0 (بی‌نهایت)"
          className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] p-2.5 rounded-xl focus:outline-none focus:border-[var(--accent3)] text-sm transition-colors text-[var(--text-primary)]"
        />
      </div>
      <div className="col-span-2">
        <label className="block text-xs font-medium text-[var(--text-secondary)] mb-2">
          روزهای هفته:
        </label>
        <div className="flex flex-wrap justify-center gap-1.5">
          {DAYS_MAP.map((d) => (
            <button
              key={d.value}
              type="button"
              onClick={() => toggleDay(d.value)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                days.includes(d.value)
                  ? "bg-[var(--accent3)] text-black shadow-md shadow-[var(--accent3-transparent)]"
                  : "bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--accent3)]"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
