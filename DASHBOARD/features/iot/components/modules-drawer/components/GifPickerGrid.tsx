import React, { useState } from "react";
import {
  COLOR_ANIMATED_GIFS,
  MONO_ANIMATED_GIFS,
} from "@/features/iot/utils/animatedGifs";
import { Search, Link } from "lucide-react";
import { WidgetIcon } from "@/components/icons";

interface GifPickerGridProps {
  mode?: "color" | "mono";
  selectedIcon: string;
  onSelectIcon: (val: string) => void;
  onClose: () => void;
}

export default function GifPickerGrid({
  mode = "color",
  selectedIcon,
  onSelectIcon,
  onClose,
}: GifPickerGridProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [customUrl, setCustomUrl] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const isMono = mode === "mono";
  const items = isMono ? MONO_ANIMATED_GIFS : COLOR_ANIMATED_GIFS;

  const filteredItems = items.filter((item) =>
    item.name.includes(searchTerm) || item.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApplyCustomUrl = () => {
    if (customUrl.trim()) {
      onSelectIcon(customUrl.trim());
      onClose();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder={isMono ? "جستجوی گیف بی‌رنگ..." : "جستجوی گیف رنگی..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-8 px-2.5 pl-7 text-[11px] bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-lg outline-none focus:border-[var(--accent3)] transition-colors text-right"
          />
          <Search className="w-3.5 h-3.5 absolute left-2 top-2.5 text-[var(--text-muted)] pointer-events-none" />
        </div>
        {!isMono && (
          <button
            type="button"
            onClick={() => setShowCustomInput(!showCustomInput)}
            className={`h-8 px-2 rounded-lg border text-[10px] flex items-center gap-1 transition-colors ${showCustomInput ? "bg-[var(--accent3)] text-black border-[var(--accent3)]" : "bg-[var(--bg-primary)] border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}
            title="لینک دلخواه گیف"
          >
            <Link className="w-3 h-3" />
          </button>
        )}
      </div>

      {showCustomInput && !isMono && (
        <div className="flex gap-1.5 p-1.5 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg">
          <input
            type="url"
            placeholder="https://.../sticker.gif"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            className="flex-1 h-7 px-2 text-[10px] bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border-color)] rounded outline-none font-mono text-left"
          />
          <button
            type="button"
            onClick={handleApplyCustomUrl}
            className="px-2 h-7 bg-[var(--accent3)] text-black text-[10px] font-bold rounded hover:opacity-90"
          >
            ثبت
          </button>
        </div>
      )}

      <div className="grid grid-cols-6 gap-2 max-h-40 overflow-y-auto custom-scrollbar p-1">
        {filteredItems.map((item) => {
          const isSelected = selectedIcon === item.id || (!isMono && selectedIcon === (item as any).url);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onSelectIcon(item.id);
                onClose();
              }}
              title={item.name}
              className={`relative p-1.5 rounded-xl flex items-center justify-center transition-all group ${
                isSelected
                  ? "bg-[var(--accent3-transparent)] border-2 border-[var(--accent3)] scale-105 shadow-sm"
                  : "hover:bg-[var(--card-bg)] border border-transparent hover:border-[var(--border-color)] hover:scale-105"
              }`}
            >
              {isMono ? (
                <WidgetIcon icon={item.id} className="w-5 h-5 text-[var(--accent3)]" />
              ) : (
                <img
                  src={(item as any).url}
                  alt={item.name}
                  className="w-7 h-7 object-contain pointer-events-none drop-shadow-xs"
                  loading="lazy"
                  decoding="async"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
