"use client";

import { CloudUpload, WifiOff } from "lucide-react";
import { motion } from "motion/react";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";
import type { LowDataModeBannerProps } from "./types";

/**
 * بنر اعلان‌های سیستم اعم از حالت صرفه‌جویی در مصرف اینترنت و تغییرات ذخیره‌نشده
 */
export default function LowDataModeBanner({
  lowDataMode,
  animationsEnabled,
  refetchIot,
  headerPosition = "top",
  manualSaveMode = false,
  unsavedChangesCount = 0,
  triggerCloudflarePush,
}: LowDataModeBannerProps) {
  const isDark = useIoTStore((s) => s.isDark);

  if (!lowDataMode && !(manualSaveMode && unsavedChangesCount > 0)) return null;

  const containerLayoutClass =
    headerPosition === "left" ? "max-w-5xl md:mt-0 max-md:mt-6" : "max-w-6xl mt-4 md:mt-2";

  const roundedShapeClass =
    headerPosition === "left"
      ? "rounded-b-2xl md:rounded-tl-md md:rounded-tr-md max-md:rounded-2xl"
      : "rounded-2xl";

  return (
    <div className={`flex flex-col gap-2.5 ${containerLayoutClass} mx-auto w-full select-none`}>
      {lowDataMode && (
        <motion.div
          initial={animationsEnabled ? { opacity: 0, y: -10, scale: 0.98 } : {}}
          animate={animationsEnabled ? { opacity: 1, y: 0, scale: 1 } : {}}
          className={`flex flex-col sm:flex-row-reverse items-center justify-between px-6 py-3.5 bg-[var(--card-bg)] border border-[var(--accent3-medium)] text-right gap-4 w-full backdrop-blur-xl transition-all duration-300 shadow-lg md:hover:border-[var(--accent3)] ${roundedShapeClass}`}
        >
          <div className="flex items-center gap-3">
            <WifiOff className="w-5 h-5 text-[var(--accent3)] animate-pulse shrink-0" />
            <span className="text-xs font-sans font-extrabold text-[var(--text-primary)] leading-relaxed">
              حالت صرفه‌جویی در مصرف اینترنت فعال است. دریافت خودکار داده‌ها متوقف شده است.
            </span>
          </div>
          <motion.button
            onClick={refetchIot}
            whileHover={animationsEnabled ? { scale: 1.04 } : undefined}
            whileTap={animationsEnabled ? { scale: 0.96 } : undefined}
            className="px-5 py-2.5 bg-[var(--accent3)] text-black md:hover:opacity-90 font-sans font-extrabold transition-all text-xs cursor-pointer select-none rounded-xl shadow-md shrink-0"
          >
            به‌روزرسانی داده‌ها
          </motion.button>
        </motion.div>
      )}

      {manualSaveMode && unsavedChangesCount > 0 && (
        <motion.div
          initial={animationsEnabled ? { opacity: 0, y: -10, scale: 0.98 } : {}}
          animate={animationsEnabled ? { opacity: 1, y: 0, scale: 1 } : {}}
          className={`flex flex-col sm:flex-row-reverse items-center justify-between px-6 py-3.5 text-right gap-4 w-full backdrop-blur-xl transition-all duration-300 shadow-lg ${
            isDark
              ? "bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 md:hover:border-emerald-400"
              : "bg-emerald-50/90 border border-emerald-300 text-emerald-900 md:hover:border-emerald-400"
          } ${roundedShapeClass}`}
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-500 text-xs font-extrabold shrink-0">
              {unsavedChangesCount}
            </div>
            <span className="text-xs font-sans font-extrabold leading-relaxed">
              تغییرات جدید در داشبورد اعمال شده اما هنوز در حافظه ابری کلودفلر ثبت نشده است.
            </span>
          </div>
          <motion.button
            onClick={triggerCloudflarePush}
            whileHover={animationsEnabled ? { scale: 1.04 } : undefined}
            whileTap={animationsEnabled ? { scale: 0.96 } : undefined}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-slate-950 md:hover:bg-emerald-400 font-sans font-extrabold transition-all text-xs cursor-pointer select-none rounded-xl shadow-md shrink-0"
          >
            <CloudUpload className="w-4 h-4" />
            <span>ذخیره‌سازی در ابَر کلودفلر</span>
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
