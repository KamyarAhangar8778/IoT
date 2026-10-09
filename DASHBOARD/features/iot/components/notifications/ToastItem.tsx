"use client";

import { AlertOctagon, AlertTriangle, CheckCircle2, Info, X } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";
import { soundManager } from "@/lib/audio";
import { getToastThemeStyles } from "./toastTheme";
import type { ToastItem as ToastItemType } from "./types";

interface ToastItemProps {
  toast: ToastItemType;
  onDismiss: (id: string) => void;
}

/**
 * کامپوننت تک‌اعلان با پترن شیشه‌ای، افکت بلور، هماهنگی با رنگ‌های ۳ و ۴ و انیمیشن
 */
export default function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const isDark = useIoTStore((s) => s.isDark);
  const accent3 = useIoTStore((s) => s.accent3);
  const accent4 = useIoTStore((s) => s.accent4);
  const animationsEnabled = useIoTStore((s) => s.animationsEnabled);

  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(100);
  const duration = toast.duration || 3500;
  const startTimeRef = useRef(Date.now());
  const remainingTimeRef = useRef(duration);

  // اجرای افکت صوتی متناسب با نوع اعلان
  useEffect(() => {
    if (toast.type === "success") {
      soundManager.playSuccess();
    } else if (toast.type === "error") {
      soundManager.playError();
    } else {
      soundManager.playClick();
    }
  }, [toast.type]);

  // مدیریت تایمر خودکار و نوار پیشرفت
  useEffect(() => {
    if (isHovered) return;

    startTimeRef.current = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const currentRemaining = remainingTimeRef.current - elapsed;

      if (currentRemaining <= 0) {
        clearInterval(interval);
        onDismiss(toast.id);
      } else {
        setProgress((currentRemaining / duration) * 100);
      }
    }, 30);

    return () => {
      clearInterval(interval);
      remainingTimeRef.current = Math.max(
        0,
        remainingTimeRef.current - (Date.now() - startTimeRef.current),
      );
    };
  }, [isHovered, duration, onDismiss, toast.id]);

  const theme = getToastThemeStyles(toast.type, isDark, accent3, accent4);

  const getIcon = () => {
    const className = "w-5 h-5 shrink-0 transition-transform duration-300 group-hover:scale-110";
    switch (toast.type) {
      case "success":
        return <CheckCircle2 className={className} style={{ color: theme.iconColor }} />;
      case "error":
        return <AlertOctagon className={className} style={{ color: theme.iconColor }} />;
      case "warning":
        return <AlertTriangle className={className} style={{ color: theme.iconColor }} />;
      default:
        return <Info className={className} style={{ color: theme.iconColor }} />;
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30, scale: 0.9, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -20, scale: 0.92, filter: "blur(4px)" }}
      transition={{ type: "spring", damping: 26, stiffness: 360 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative overflow-hidden rounded-2xl border p-4 shadow-xl transition-all duration-300 w-full max-w-md pointer-events-auto select-none backdrop-blur-xl"
      style={theme.containerStyle}
    >
      {/* Specular Top Rim Light (گروه‌ها و سگمنت‌ها) */}
      <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.18)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] pointer-events-none z-0" />

      {/* Ambient Corner Glow (رنگ سوم و چهارم داشبورد) */}
      <div
        className="absolute -top-10 -right-10 w-36 h-36 rounded-full blur-2xl opacity-20 dark:opacity-30 pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle, var(--accent3) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full blur-2xl opacity-20 dark:opacity-30 pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle, var(--accent4) 0%, transparent 70%)",
        }}
      />

      {/* Micro-Dot Grid SVG (مشابه پترن گروه‌ها) */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.03] dark:opacity-[0.05] transition-opacity duration-300 pointer-events-none z-0"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id={`toast-pattern-${toast.id}`}
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="10" cy="10" r="0.6" className="fill-[var(--accent3)]" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#toast-pattern-${toast.id})`} />
      </svg>

      <div className="relative z-10 flex items-center gap-3.5 dir-rtl">
        <div
          className="flex items-center justify-center p-2 rounded-xl border shrink-0 transition-colors shadow-xs"
          style={theme.badgeBgStyle}
        >
          {getIcon()}
        </div>

        <div className="flex-1 min-w-0 text-right">
          {toast.title && (
            <h4
              className="text-xs font-sans font-extrabold mb-0.5 truncate"
              style={{ color: theme.iconColor }}
            >
              {toast.title}
            </h4>
          )}
          <p className="text-xs font-sans font-bold leading-relaxed theme-text-primary break-words">
            {toast.message}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onDismiss(toast.id)}
          className="p-1.5 rounded-lg text-xs font-bold text-slate-400 hover:text-slate-100 hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer shrink-0"
          aria-label="بستن"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* نوار پیشرفت زمانی انیمیت‌شده با گرادینت رنگ‌های ۳ و ۴ */}
      {animationsEnabled && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10 dark:bg-white/10 overflow-hidden z-10">
          <div
            className="h-full transition-all duration-75 ease-linear"
            style={{
              width: `${progress}%`,
              ...theme.progressStyle,
            }}
          />
        </div>
      )}
    </motion.div>
  );
}
