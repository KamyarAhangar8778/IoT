/**
 * @file WeatherFields.tsx
 * @description Weather and temperature condition inputs for AutomationForm.
 */

import React from "react";
import { MapPin } from "lucide-react";

interface WeatherFieldsProps {
  city: string;
  setCity: (city: string) => void;
  temperatureThreshold: number | "";
  setTemperatureThreshold: (val: number | "") => void;
  temperatureCondition: "greater" | "less";
  setTemperatureCondition: (cond: "greater" | "less") => void;
  isGettingLocation: boolean;
  handleGetLocation: () => void;
}

export function WeatherFields({
  city,
  setCity,
  temperatureThreshold,
  setTemperatureThreshold,
  temperatureCondition,
  setTemperatureCondition,
  isGettingLocation,
  handleGetLocation,
}: WeatherFieldsProps) {
  return (
    <>
      <div className="col-span-2">
        <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
          نام شهر یا مختصات (انگلیسی):
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="مثال: Tehran یا 36.26,59.61"
            className="flex-1 bg-[var(--card-bg)] border border-[var(--border-color)] p-2.5 rounded-xl focus:outline-none focus:border-[var(--accent3)] text-sm transition-colors text-[var(--text-primary)]"
            dir="ltr"
          />
          <button
            type="button"
            onClick={handleGetLocation}
            disabled={isGettingLocation}
            className={`p-2.5 rounded-xl text-xs font-bold transition-all border flex items-center justify-center min-w-[44px] cursor-pointer ${
              isGettingLocation
                ? "bg-[var(--card-bg)] border-[var(--border-color)] text-[var(--text-muted)] cursor-not-allowed"
                : "bg-[var(--card-hover-bg)] border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--accent3)] hover:text-[var(--accent3)]"
            }`}
            title="دریافت مکان فعلی"
          >
            {isGettingLocation ? (
              <div className="w-4 h-4 border-2 border-[var(--accent3)] border-t-transparent rounded-full animate-spin" />
            ) : (
              <MapPin className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
      <div className="col-span-2 flex gap-3">
        <div className="flex-1">
          <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
            شرط دما:
          </label>
          <select
            value={temperatureCondition}
            onChange={(e) => setTemperatureCondition(e.target.value as "greater" | "less")}
            className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] p-2.5 rounded-xl focus:outline-none focus:border-[var(--accent3)] text-sm transition-colors text-[var(--text-primary)]"
          >
            <option value="greater">بیشتر از</option>
            <option value="less">کمتر از</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
            دما (°C):
          </label>
          <input
            type="number"
            value={temperatureThreshold}
            onChange={(e) => setTemperatureThreshold(e.target.value === "" ? "" : Number(e.target.value))}
            placeholder="مثال: 30"
            className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] p-2.5 rounded-xl focus:outline-none focus:border-[var(--accent3)] text-sm transition-colors text-[var(--text-primary)]"
            dir="ltr"
          />
        </div>
      </div>
    </>
  );
}
