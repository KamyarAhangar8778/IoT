"use client";

/**
 * @file ElementEngineSection.tsx
 * @description Main Settings section component for Element Engine management
 */

import React, { useState } from "react";
import { PresetSelector } from "./PresetSelector";
import { ProtocolFileManager } from "./ProtocolFileManager";
import { RegistryEditor } from "./RegistryEditor";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";

export const ElementEngineSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"presets" | "file" | "registry">("presets");
  const elementConfig = useIoTStore((s) => s.elementConfig);
  const resetConfig = useIoTStore((s) => s.resetElementConfig);
  const showToast = useIoTStore((s) => s.showToast);

  const handleReset = () => {
    resetConfig();
    showToast("تنظیمات موتور المنت به حالت پیش‌فرض بازگشت.", "success");
  };

  return (
    <div className="space-y-5 p-4 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base text-slate-100">موتور المنت (Element Engine)</h3>
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
              v{elementConfig.meta.version} Registry
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            موتور تفسیر فایل‌های استایل و سفارشی‌سازی کامل تمام اجزای داشبورد
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="text-xs text-red-400 hover:text-red-300 underline self-start sm:self-center"
        >
          بازنشانی به پیش‌فرض
        </button>
      </div>

      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("presets")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === "presets"
              ? "bg-amber-500 text-slate-950 font-semibold"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          تم‌ها و پریست‌ها
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("file")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === "file"
              ? "bg-amber-500 text-slate-950 font-semibold"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          ورودی/خروجی فایل UI
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("registry")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === "registry"
              ? "bg-amber-500 text-slate-950 font-semibold"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          ویرایشگر Registry
        </button>
      </div>

      <div className="pt-2">
        {activeTab === "presets" && <PresetSelector />}
        {activeTab === "file" && <ProtocolFileManager />}
        {activeTab === "registry" && <RegistryEditor />}
      </div>
    </div>
  );
};
