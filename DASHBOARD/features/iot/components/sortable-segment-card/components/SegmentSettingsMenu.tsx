import { Cpu, Tag, X } from "lucide-react";
import { motion } from "motion/react";
import type React from "react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { WidgetIcon } from "@/components/icons";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";
import type { SegmentData } from "../core/types";
import SegmentControls from "./SegmentControls";

interface SegmentSettingsMenuProps {
  segment: SegmentData;
  isSettingsOpen: boolean;
  menuRef: React.RefObject<HTMLDivElement | null>;
  buttonRef?: React.RefObject<HTMLButtonElement | null>;
  showIconInMenu: boolean;
  isPinOn: boolean;
  isUltraCompact: boolean;
  onRemove: (id: string) => void;
  onUpdateSegmentMode?: (id: string, mode: "switch" | "push") => void;
  onUpdateSegmentAutoOff?: (id: string, autoOff: number) => void;
  mode: "switch" | "push";
  countdown?: number | null;
  autoOffMenuProps: {
    showAutoOffMenu: boolean;
    setShowAutoOffMenu: (val: boolean) => void;
    autoOffButtonRef: React.RefObject<HTMLButtonElement | null>;
    autoOffMenuRef: React.RefObject<HTMLDivElement | null>;
  };
}

export default function SegmentSettingsMenu({
  segment,
  isSettingsOpen,
  menuRef,
  buttonRef,
  showIconInMenu,
  isPinOn,
  isUltraCompact: _isUltraCompact,
  onRemove,
  onUpdateSegmentMode,
  onUpdateSegmentAutoOff,
  mode,
  countdown,
  autoOffMenuProps,
}: SegmentSettingsMenuProps) {
  const updateSegmentLabels = useIoTStore((s) => s.updateSegmentLabels);
  const [offLabel, setOffLabel] = useState(segment.off_label || segment.offLabel || "");
  const [onLabel, setOnLabel] = useState(segment.on_label || segment.onLabel || "");
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setOffLabel(segment.off_label || segment.offLabel || "");
    setOnLabel(segment.on_label || segment.onLabel || "");
  }, [segment.off_label, segment.offLabel, segment.on_label, segment.onLabel]);

  useEffect(() => {
    if (!isSettingsOpen) return;

    const updateCoords = () => {
      if (buttonRef?.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        let left = rect.left + rect.width / 2;
        let top = rect.bottom + 8;

        const menuWidth = 340;
        const halfWidth = menuWidth / 2;
        const padding = 16;

        if (left - halfWidth < padding) {
          left = halfWidth + padding;
        } else if (left + halfWidth > window.innerWidth - padding) {
          left = window.innerWidth - halfWidth - padding;
        }

        const estimatedHeight = 320;
        if (top + estimatedHeight > window.innerHeight - padding) {
          top = Math.max(padding, rect.top - estimatedHeight - 8);
        }

        setCoords({ top, left });
      }
    };

    updateCoords();
    window.addEventListener("resize", updateCoords);
    window.addEventListener("scroll", updateCoords, true);

    return () => {
      window.removeEventListener("resize", updateCoords);
      window.removeEventListener("scroll", updateCoords, true);
    };
  }, [isSettingsOpen, buttonRef]);

  if (!isSettingsOpen || !mounted) return null;

  const handleSaveLabels = (newOff: string, newOn: string) => {
    setOffLabel(newOff);
    setOnLabel(newOn);
    if (updateSegmentLabels) {
      updateSegmentLabels(segment.id, newOff.trim() || undefined, newOn.trim() || undefined);
    }
  };

  const menuContent = (
    <motion.div
      ref={menuRef}
      style={{
        position: "fixed",
        top: coords ? `${coords.top}px` : "50%",
        left: coords ? `${coords.left}px` : "50%",
        zIndex: 99999,
      }}
      onPointerDown={(e) => e.stopPropagation()}
      initial={{ opacity: 0, scale: 0.95, x: "-50%", y: -10 }}
      animate={{ opacity: 1, scale: 1, x: "-50%", y: 0 }}
      exit={{ opacity: 0, scale: 0.95, x: "-50%", y: -10 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
    >
      <div className="relative w-[290px] sm:w-[350px] bg-[var(--card-bg-solid)] backdrop-blur-2xl border border-[var(--border-color)] rounded-2xl shadow-2xl p-4 flex flex-col gap-3.5 cursor-default">
        {/* Glow & Border */}
        <div className="absolute inset-0 rounded-2xl border border-[var(--accent3)] shadow-[0_0_20px_rgba(255,165,0,0.25)] opacity-100 pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between border-b border-[var(--border-color)] pb-3">
          <div className="flex items-center gap-2.5 text-right">
            {showIconInMenu && (
              <div
                className={`p-2 rounded-full transition-colors flex items-center justify-center ${
                  isPinOn
                    ? "bg-[var(--accent4-transparent)] text-[var(--accent4)]"
                    : "bg-gray-800/20 text-gray-500"
                }`}
              >
                <WidgetIcon icon={segment.icon} defaultIcon="Cpu" className="w-4 h-4" />
              </div>
            )}

            <div className="flex flex-col text-right">
              <span className="font-sans font-extrabold theme-text-primary text-sm">
                {segment.title}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onRemove(segment.id)}
            className="flex items-center gap-1.5 p-1.5 px-2.5 bg-red-500/10 text-red-600 md:hover:bg-red-500 md:hover:text-white transition-colors cursor-pointer rounded-lg shadow-sm"
            title="حذف سگمنت"
          >
            <span className="text-[10px] font-bold">حذف سگمنت</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* اطلاعات پایه GPIO */}
        <div className="relative z-10 flex items-center justify-between py-1.5 px-3 bg-[var(--bg-main)] rounded-xl border border-[var(--border-color)]">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <Cpu className="w-3.5 h-3.5 text-[var(--accent3)]" />
            <span className="text-xs font-bold font-sans">پایه سخت‌افزاری متصل:</span>
          </div>
          <span className="text-xs font-mono font-extrabold text-[var(--accent3)]">
            GPIO {segment.pin}
          </span>
        </div>

        {/* تنظیمات عنوان حالت‌های خاموش و روشن */}
        <div className="relative z-10 space-y-1.5 pt-1">
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <Tag className="w-3.5 h-3.5 text-[var(--accent3)]" />
            <span className="text-xs font-bold font-sans">برچسب حالت‌های کلید:</span>
          </div>
          <div className="grid grid-cols-2 gap-2 dir-rtl">
            <div className="space-y-1">
              <span className="text-[9px] text-slate-400 block font-bold">حالت خاموش (LOW):</span>
              <input
                type="text"
                value={offLabel}
                placeholder="LOW (مثلاً در بسته)"
                onChange={(e) => handleSaveLabels(e.target.value, onLabel)}
                className="w-full h-8 px-2.5 text-xs bg-[var(--bg-main)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-lg focus:border-[var(--accent3)] outline-none font-sans"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[9px] text-slate-400 block font-bold">حالت روشن (HIGH):</span>
              <input
                type="text"
                value={onLabel}
                placeholder="HIGH (مثلاً در باز)"
                onChange={(e) => handleSaveLabels(offLabel, e.target.value)}
                className="w-full h-8 px-2.5 text-xs bg-[var(--bg-main)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-lg focus:border-[var(--accent3)] outline-none font-sans"
              />
            </div>
          </div>
        </div>

        {onUpdateSegmentMode && segment.type !== "input" && (
          <div className="relative z-10 flex items-center justify-between pt-2 border-t border-[var(--border-color)]">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 font-sans">
              حالت عملکرد:
            </span>
            <SegmentControls
              segment={segment}
              mode={mode}
              onUpdateSegmentMode={onUpdateSegmentMode}
              onUpdateSegmentAutoOff={onUpdateSegmentAutoOff}
              countdown={countdown}
              {...autoOffMenuProps}
            />
          </div>
        )}
      </div>
    </motion.div>
  );

  return createPortal(menuContent, document.body);
}
