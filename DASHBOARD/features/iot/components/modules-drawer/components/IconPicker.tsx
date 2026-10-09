import React, { useState } from "react";
import { ICON_MAP, AVAILABLE_ICONS, SUGGESTED_EMOJIS } from "@/features/iot/utils/icons";
import { isMonoGif, isGifIcon } from "@/features/iot/utils/animatedGifs";
import { ChevronDown, ChevronUp } from "lucide-react";
import { WidgetIcon } from "@/components/icons";
import GifPickerGrid from "./GifPickerGrid";

interface IconPickerProps {
  label: string;
  isOptional?: boolean;
  selectedIcon: string;
  onSelectIcon: (val: string) => void;
}

type TabMode = "gif-color" | "gif-mono" | "emoji" | "lucide";

export default function IconPicker({
  label,
  isOptional = true,
  selectedIcon,
  onSelectIcon,
}: IconPickerProps) {
  const [showIcons, setShowIcons] = useState(false);
  const [iconMode, setIconMode] = useState<TabMode>(() => {
    if (isMonoGif(selectedIcon)) return "gif-mono";
    if (isGifIcon(selectedIcon)) return "gif-color";
    if (selectedIcon && !ICON_MAP[selectedIcon]) return "emoji";
    return "gif-color";
  });

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        {isOptional && <span className="text-[9px] theme-text-muted">(اختیاری)</span>}
        <label className="text-[10px] theme-text-tertiary font-bold block">{label}</label>
      </div>

      <button
        type="button"
        onClick={() => setShowIcons(!showIcons)}
        className="w-full h-10 px-4 text-xs bg-[var(--bg-main)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-xl flex items-center justify-between hover:border-[var(--accent3)] transition-all font-sans shadow-sm cursor-pointer"
      >
        {showIcons ? <ChevronUp className="w-4 h-4 opacity-50" /> : <ChevronDown className="w-4 h-4 opacity-50" />}
        <div className="flex items-center gap-2">
          <span>{selectedIcon ? "آیکون انتخاب شد" : "انتخاب آیکون یا گیف"}</span>
          {selectedIcon && (
            <WidgetIcon icon={selectedIcon} className="w-5 h-5 object-contain" />
          )}
        </div>
      </button>

      {showIcons && (
        <div className="p-3 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl space-y-3 shadow-sm">
          <div className="grid grid-cols-4 gap-1 p-1 bg-[var(--card-bg)] rounded-xl border border-[var(--border-color)]">
            <button
              type="button"
              onClick={() => setIconMode("gif-color")}
              className={`text-[9.5px] font-bold py-1.5 px-1 rounded-lg transition-colors text-center truncate ${iconMode === "gif-color" ? "bg-[var(--accent3)] text-black shadow-sm" : "bg-[var(--bg-primary)] hover:text-[var(--accent3)] text-[var(--text-secondary)]"}`}
            >
              گیف رنگی
            </button>
            <button
              type="button"
              onClick={() => setIconMode("gif-mono")}
              className={`text-[9.5px] font-bold py-1.5 px-1 rounded-lg transition-colors text-center truncate ${iconMode === "gif-mono" ? "bg-[var(--accent3)] text-black shadow-sm" : "bg-[var(--bg-primary)] hover:text-[var(--accent3)] text-[var(--text-secondary)]"}`}
            >
              گیف بی‌رنگ
            </button>
            <button
              type="button"
              onClick={() => setIconMode("emoji")}
              className={`text-[9.5px] font-bold py-1.5 px-1 rounded-lg transition-colors text-center truncate ${iconMode === "emoji" ? "bg-[var(--accent3)] text-black shadow-sm" : "bg-[var(--bg-primary)] hover:text-[var(--accent3)] text-[var(--text-secondary)]"}`}
            >
              استیکر رنگی
            </button>
            <button
              type="button"
              onClick={() => setIconMode("lucide")}
              className={`text-[9.5px] font-bold py-1.5 px-1 rounded-lg transition-colors text-center truncate ${iconMode === "lucide" ? "bg-[var(--accent3)] text-black shadow-sm" : "bg-[var(--bg-primary)] hover:text-[var(--accent3)] text-[var(--text-secondary)]"}`}
            >
              آیکون بی‌رنگ
            </button>
          </div>

          <div className="flex justify-between items-center px-1">
            <span className="text-[10px] theme-text-muted">
              {iconMode === "gif-color" && "استیکرهای متحرک سه‌بعدی رنگی"}
              {iconMode === "gif-mono" && "آیکون‌های متحرک خطی و بی‌رنگ"}
              {iconMode === "emoji" && "استیکرهای ایموجی ثابت رنگی"}
              {iconMode === "lucide" && "آیکون‌های ساده وکتور Hugeicons"}
            </span>
            <button
              type="button"
              onClick={() => {
                onSelectIcon("");
                setShowIcons(false);
              }}
              className="text-[10px] text-rose-500 hover:underline cursor-pointer"
            >
              بدون آیکون
            </button>
          </div>

          {iconMode === "gif-color" && (
            <GifPickerGrid
              mode="color"
              selectedIcon={selectedIcon}
              onSelectIcon={onSelectIcon}
              onClose={() => setShowIcons(false)}
            />
          )}

          {iconMode === "gif-mono" && (
            <GifPickerGrid
              mode="mono"
              selectedIcon={selectedIcon}
              onSelectIcon={onSelectIcon}
              onClose={() => setShowIcons(false)}
            />
          )}

          {iconMode === "emoji" && (
            <div className="grid grid-cols-6 gap-1.5 max-h-36 overflow-y-auto custom-scrollbar pr-1">
              {SUGGESTED_EMOJIS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => {
                    onSelectIcon(icon);
                    setShowIcons(false);
                  }}
                  className={`p-2 rounded-lg flex items-center justify-center text-lg leading-none transition-all ${selectedIcon === icon ? "bg-[var(--accent3)] text-black" : "hover:bg-white/10 text-[var(--text-secondary)]"}`}
                >
                  {icon}
                </button>
              ))}
            </div>
          )}

          {iconMode === "lucide" && (
            <div className="grid grid-cols-6 gap-1.5 max-h-36 overflow-y-auto custom-scrollbar pr-1">
              {AVAILABLE_ICONS.map((iconName) => (
                <button
                  key={iconName}
                  type="button"
                  onClick={() => {
                    onSelectIcon(iconName);
                    setShowIcons(false);
                  }}
                  className={`p-2 rounded-lg flex items-center justify-center transition-all ${selectedIcon === iconName ? "bg-[var(--accent3)] text-black" : "hover:bg-white/10 text-[var(--text-secondary)]"}`}
                  title={iconName}
                >
                  <WidgetIcon icon={iconName} className="w-4 h-4" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
