"use client";

/**
 * @file PresetSelector.tsx
 * @description Preset selection UI for Element Engine presets
 */

import React from "react";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";
import { BUILTIN_PRESETS } from "@/features/iot/engine";

export const PresetSelector: React.FC = () => {
  const activePreset = useIoTStore((s) => s.activeElementPreset);
  const applyPreset = useIoTStore((s) => s.applyElementPreset);
  const showToast = useIoTStore((s) => s.showToast);

  const handleSelect = (presetId: string) => {
    applyPreset(presetId);
    const preset = BUILTIN_PRESETS[presetId];
    showToast(`تم ${preset?.meta.name || presetId} با موفقیت اعمال شد.`, "success");
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {Object.entries(BUILTIN_PRESETS).map(([id, config]) => {
        const isActive = activePreset === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => handleSelect(id)}
            className={`p-4 rounded-xl text-right transition-all border flex flex-col justify-between gap-3 ${
              isActive
                ? "bg-amber-500/10 border-amber-500/60 shadow-lg shadow-amber-500/10"
                : "bg-slate-900/50 border-white/5 hover:border-white/20 hover:bg-slate-800/40"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-sm text-slate-200">{config.meta.name}</span>
                {isActive && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                    فعال
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 line-clamp-2">{config.meta.description}</p>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-white/5">
              <div
                className="w-4 h-4 rounded-full border border-white/20"
                style={{ backgroundColor: config.global.primaryAccent }}
              />
              <div
                className="w-4 h-4 rounded-full border border-white/20"
                style={{ backgroundColor: config.global.secondaryAccent }}
              />
              <span className="text-[10px] text-slate-500 font-mono mr-auto">v{config.meta.version}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
};
