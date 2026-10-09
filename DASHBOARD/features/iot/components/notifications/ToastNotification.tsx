"use client";

import { AnimatePresence } from "motion/react";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";
import ToastItem from "./ToastItem";

/**
 * کامپوننت اصلی مدیریت و نمایش لیست اعلان‌های شناور داشبورد (Toast Stack)
 * موقعیت: شناور در پایین-چپ یا پایین-مرکز صفحه با قابلیت چیدمان عمودی
 */
export default function ToastNotification() {
  const toasts = useIoTStore((s) => s.toasts);
  const toast = useIoTStore((s) => s.toast);
  const clearToast = useIoTStore((s) => s.clearToast);

  // در صورت وجود نداشتن آرایه، استفاده از single toast به صورت فال‌بک
  const activeToasts = toasts && toasts.length > 0 ? toasts : toast ? [toast] : [];

  if (activeToasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-6 left-6 z-[200] flex flex-col-reverse gap-3 max-w-sm w-full pointer-events-none transition-all duration-300 max-sm:left-4 max-sm:right-4 max-sm:max-w-none"
    >
      <AnimatePresence mode="popLayout">
        {activeToasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={(id) => clearToast(id)} />
        ))}
      </AnimatePresence>
    </div>
  );
}
