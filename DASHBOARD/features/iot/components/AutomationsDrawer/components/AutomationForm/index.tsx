/**
 * @file index.tsx
 * @description Main form component for creating and editing automations.
 */

import React from "react";
import ActionBuilder from "./ActionBuilder";
import { FormHeader } from "./FormHeader";
import { TypeSelector } from "./TypeSelector";
import { ScheduleFields } from "./ScheduleFields";
import { TimerFields } from "./TimerFields";
import { WeatherFields } from "./WeatherFields";

interface AutomationFormProps {
  formHook: any;
}

export default function AutomationForm({ formHook }: AutomationFormProps) {
  const {
    editingId, title, setTitle, time, setTime, days, setDays, repeatCount, setRepeatCount,
    autoType, setAutoType, delayHours, setDelayHours, delayMinutes, setDelayMinutes,
    city, setCity, temperatureThreshold, setTemperatureThreshold, temperatureCondition, setTemperatureCondition,
    intervalMinutes, setIntervalMinutes, hasWeatherCondition, setHasWeatherCondition,
    isGettingLocation, actions, setActions, handleGetLocation, resetForm, handleSave
  } = formHook;

  return (
    <div className="bg-[var(--card-bg-solid)] p-5 rounded-2xl border border-[var(--border-color)] shadow-sm space-y-4 relative overflow-hidden font-sans text-right">
      <div className="absolute top-0 right-0 w-1 h-full bg-[var(--accent3)]" style={{ backgroundColor: "var(--accent3)" }} />
      <FormHeader editingId={editingId} />

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
            عنوان (دلخواه):
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="مثال: روشن کردن پمپ آبیاری"
            className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] p-2.5 rounded-xl focus:outline-none focus:border-[var(--accent3)] text-sm transition-colors text-[var(--text-primary)]"
          />
        </div>

        <TypeSelector autoType={autoType} setAutoType={setAutoType} />

        {autoType === "schedule" && (
          <ScheduleFields
            time={time}
            setTime={setTime}
            repeatCount={repeatCount}
            setRepeatCount={setRepeatCount}
            days={days}
            setDays={setDays}
          />
        )}

        {autoType === "timer" && (
          <TimerFields
            delayHours={delayHours}
            setDelayHours={setDelayHours}
            delayMinutes={delayMinutes}
            setDelayMinutes={setDelayMinutes}
          />
        )}

        {autoType === "weather" && (
          <div className="col-span-2">
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
              دوره بررسی (ساعت):
            </label>
            <select
              value={intervalMinutes ? intervalMinutes / 60 : ""}
              onChange={(e) => setIntervalMinutes(e.target.value === "" ? "" : Number(e.target.value) * 60)}
              className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] p-2.5 rounded-xl focus:outline-none focus:border-[var(--accent3)] text-sm transition-colors text-[var(--text-primary)]"
            >
              <option value="" disabled>انتخاب کنید...</option>
              {Array.from({ length: 24 }, (_, i) => i + 1).map((h) => (
                <option key={h} value={h}>هر {h} ساعت</option>
              ))}
            </select>
          </div>
        )}

        {(autoType === "timer" || autoType === "schedule") && (
          <div className="col-span-2 pt-2 border-t border-[var(--border-color)] mt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasWeatherCondition}
                onChange={(e) => setHasWeatherCondition(e.target.checked)}
                className="w-4 h-4 rounded text-[var(--accent3)] focus:ring-[var(--accent3)]"
              />
              <span className="text-xs font-medium text-[var(--text-primary)]">
                اضافه کردن شرط آب‌وهوایی (اختیاری)
              </span>
            </label>
          </div>
        )}

        {(autoType === "weather" || hasWeatherCondition) && (
          <WeatherFields
            city={city}
            setCity={setCity}
            temperatureThreshold={temperatureThreshold}
            setTemperatureThreshold={setTemperatureThreshold}
            temperatureCondition={temperatureCondition}
            setTemperatureCondition={setTemperatureCondition}
            isGettingLocation={isGettingLocation}
            handleGetLocation={handleGetLocation}
          />
        )}

        <ActionBuilder actions={actions} setActions={setActions} />
      </div>

      <div className="flex gap-2 pt-2">
        <button
          type="button"
          onClick={handleSave}
          className="flex-1 py-2.5 bg-accent3 text-black font-sans font-black rounded-xl text-xs transition-all shadow-md active:scale-[0.98] cursor-pointer"
          style={{ backgroundColor: "var(--accent3)" }}
        >
          {editingId ? "ذخیره تغییرات" : "افزودن به لیست"}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={resetForm}
            className="px-4 py-2.5 bg-[var(--card-hover-bg)] text-[var(--text-secondary)] border border-[var(--border-color)] font-bold rounded-xl text-xs transition-all cursor-pointer"
          >
            انصراف
          </button>
        )}
      </div>
    </div>
  );
}
