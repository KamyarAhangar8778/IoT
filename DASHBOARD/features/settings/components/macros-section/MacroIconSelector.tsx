import React from "react";
import { ICON_MAP, AVAILABLE_ICONS, SUGGESTED_EMOJIS } from "@/features/iot/utils/icons";
import { COLOR_ANIMATED_GIFS, MONO_ANIMATED_GIFS } from "@/features/iot/utils/animatedGifs";
import { WidgetIcon } from "@/components/icons";

interface Props {
  iconMode: "gif-color" | "gif-mono" | "emoji" | "lucide";
  setIconMode: (mode: "gif-color" | "gif-mono" | "emoji" | "lucide") => void;
  newMacroIcon: string;
  setNewMacroIcon: (icon: string) => void;
}

export function MacroIconSelector({ iconMode, setIconMode, newMacroIcon, setNewMacroIcon }: Props) {
  return (
    <div className="flex flex-col gap-2 bg-[var(--card-bg-solid)] p-2 rounded-xl border border-[var(--border-color)]">
      <div className="grid grid-cols-4 gap-1 mb-1 px-0.5">
        <button
          type="button"
          onClick={() => setIconMode("gif-color")}
          className={`text-[9.5px] font-bold py-1.5 rounded-lg transition-colors text-center truncate ${iconMode === "gif-color" ? "bg-[var(--accent3)] text-black shadow-sm" : "bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-[var(--accent3)] hover:text-[var(--accent3)] text-[var(--text-secondary)]"}`}
        >
          گیف رنگی
        </button>
        <button
          type="button"
          onClick={() => setIconMode("gif-mono")}
          className={`text-[9.5px] font-bold py-1.5 rounded-lg transition-colors text-center truncate ${iconMode === "gif-mono" ? "bg-[var(--accent3)] text-black shadow-sm" : "bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-[var(--accent3)] hover:text-[var(--accent3)] text-[var(--text-secondary)]"}`}
        >
          گیف بی‌رنگ
        </button>
        <button
          type="button"
          onClick={() => setIconMode("emoji")}
          className={`text-[9.5px] font-bold py-1.5 rounded-lg transition-colors text-center truncate ${iconMode === "emoji" ? "bg-[var(--accent3)] text-black shadow-sm" : "bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-[var(--accent3)] hover:text-[var(--accent3)] text-[var(--text-secondary)]"}`}
        >
          استیکر رنگی
        </button>
        <button
          type="button"
          onClick={() => setIconMode("lucide")}
          className={`text-[9.5px] font-bold py-1.5 rounded-lg transition-colors text-center truncate ${iconMode === "lucide" ? "bg-[var(--accent3)] text-black shadow-sm" : "bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-[var(--accent3)] hover:text-[var(--accent3)] text-[var(--text-secondary)]"}`}
        >
          آیکون بی‌رنگ
        </button>
      </div>

      {iconMode === "gif-color" && (
        <div className="grid grid-cols-6 gap-1.5 max-h-[140px] overflow-y-auto p-1 custom-scrollbar">
          {COLOR_ANIMATED_GIFS.map((gif) => (
            <button
              key={gif.id}
              type="button"
              onClick={() => setNewMacroIcon(gif.id)}
              title={gif.name}
              className={`p-1.5 flex items-center justify-center rounded-lg transition-all ${newMacroIcon === gif.id ? "bg-[var(--accent3-transparent)] border-2 border-[var(--accent3)] shadow-xs" : "hover:bg-[var(--card-bg-solid)] border border-transparent"}`}
            >
              <img src={gif.url} alt={gif.name} className="w-6 h-6 object-contain pointer-events-none" loading="lazy" />
            </button>
          ))}
        </div>
      )}

      {iconMode === "gif-mono" && (
        <div className="grid grid-cols-6 gap-1.5 max-h-[140px] overflow-y-auto p-1 custom-scrollbar">
          {MONO_ANIMATED_GIFS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setNewMacroIcon(item.id)}
              title={item.name}
              className={`p-1.5 flex items-center justify-center rounded-lg transition-all ${newMacroIcon === item.id ? "bg-[var(--accent3-transparent)] border-2 border-[var(--accent3)] shadow-xs" : "hover:bg-[var(--card-bg-solid)] border border-transparent"}`}
            >
              <WidgetIcon icon={item.id} className="w-5 h-5 text-[var(--accent3)]" />
            </button>
          ))}
        </div>
      )}

      {iconMode === "emoji" && (
        <div className="flex flex-wrap gap-1.5 justify-center max-h-[140px] overflow-y-auto p-1 custom-scrollbar">
          {SUGGESTED_EMOJIS.map((icon) => (
            <button
              key={icon}
              type="button"
              onClick={() => setNewMacroIcon(icon)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-lg transition-colors ${newMacroIcon === icon ? "bg-[var(--accent3)] text-black shadow-sm" : "hover:bg-[var(--card-bg-solid)] text-[var(--text-secondary)]"}`}
            >
              {icon}
            </button>
          ))}
        </div>
      )}

      {iconMode === "lucide" && (
        <div className="flex flex-wrap gap-1.5 justify-center max-h-[140px] overflow-y-auto p-1 custom-scrollbar">
          {AVAILABLE_ICONS.map((iconName) => (
            <button
              key={iconName}
              type="button"
              onClick={() => setNewMacroIcon(iconName)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${newMacroIcon === iconName ? "bg-[var(--accent3)] text-black shadow-sm" : "hover:bg-[var(--card-bg-solid)] text-[var(--text-secondary)]"}`}
              title={iconName}
            >
              <WidgetIcon icon={iconName} className="w-4 h-4" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
