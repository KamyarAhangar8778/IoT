"use client";

/**
 * @file ProtocolFileManager.tsx
 * @description File import and export manager for Element Engine Protocol JSON files
 */

import React, { useRef } from "react";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";
import { exportRegistryJSON } from "@/features/iot/engine";

export const ProtocolFileManager: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const elementConfig = useIoTStore((s) => s.elementConfig);
  const importProtocol = useIoTStore((s) => s.importElementProtocolJSON);
  const errors = useIoTStore((s) => s.elementValidationErrors);
  const showToast = useIoTStore((s) => s.showToast);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = importProtocol(content);
      if (res.success) {
        showToast("فایل پروتکل Element Engine با موفقیت اعمال شد.", "success");
      } else {
        showToast("تفسیر فایل پروتکل با خطا مواجه شد.", "error");
      }
    };
    reader.readAsText(file);
  };

  const handleExport = () => {
    const jsonStr = exportRegistryJSON(elementConfig);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${elementConfig.meta.id || "dashboard"}.element.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("فایل استایل داشبورد خروجی گرفته شد.", "success");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="file"
          ref={fileInputRef}
          accept=".json,.element,.element.json"
          onChange={handleFileUpload}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 px-4 py-3 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2"
        >
          <span>📥 بارگذاری فایل پروتکل UI (.element.json)</span>
        </button>

        <button
          type="button"
          onClick={handleExport}
          className="flex-1 px-4 py-3 bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 text-slate-200 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2"
        >
          <span>📤 خروجی گرفتن از فایل UI فعلی</span>
        </button>
      </div>

      {errors.length > 0 && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 space-y-1">
          <p className="font-semibold">خطاهای تفسیر پروتکل:</p>
          <ul className="list-disc list-inside space-y-0.5">
            {errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
