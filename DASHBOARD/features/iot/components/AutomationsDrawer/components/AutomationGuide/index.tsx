/**
 * @file index.tsx
 * @description Guide and metrics information view for AutomationsDrawer.
 */

import React from "react";
import { Info, Clock, Thermometer, Zap, ShieldCheck } from "lucide-react";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";

/**
 * AutomationGuide renders information, statistics, and advice regarding automated tasks.
 */
export default function AutomationGuide() {
  const automations = useIoTStore((state) => state.automations);
  const activeCount = automations.filter((a) => a.enabled).length;

  return (
    <div className="space-y-4 text-right font-sans">
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400 p-4 rounded-2xl text-xs flex gap-3 items-start leading-relaxed shadow-sm">
        <Info className="w-5 h-5 shrink-0 mt-0.5" />
        <p>
          در این بخش می‌توانید عملیات‌های زمانی و محیطی تعریف کنید. سرور ابری پادشاهی در زمان مشخص شده، دستورات را همزمان به دستگاه ارسال خواهد کرد.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-[var(--card-bg-solid)] border border-[var(--border-color)] rounded-xl space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--accent3)]">
            <Clock className="w-4 h-4" />
            <span>اتوماسیون‌های فعال</span>
          </div>
          <p className="text-xl font-mono font-black text-[var(--text-primary)]">{activeCount} / {automations.length}</p>
        </div>

        <div className="p-3 bg-[var(--card-bg-solid)] border border-[var(--border-color)] rounded-xl space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-500">
            <ShieldCheck className="w-4 h-4" />
            <span>وضعیت همگام‌سازی</span>
          </div>
          <p className="text-xs font-bold text-[var(--text-primary)]">برقرار و برخط</p>
        </div>
      </div>

      <div className="p-4 bg-[var(--card-bg-solid)] border border-[var(--border-color)] rounded-2xl space-y-3 text-xs">
        <h4 className="font-bold text-sm text-[var(--text-primary)] flex items-center gap-2">
          <Zap className="w-4 h-4 text-[var(--accent3)]" />
          راهنمای سریع مدل‌های اجرا:
        </h4>
        <ul className="space-y-2 text-[11px] theme-text-secondary leading-relaxed list-disc list-inside">
          <li><strong>زمان‌بندی دوره‌ای:</strong> اجرای خودکار در ساعت و روزهای انتخابی از هفته.</li>
          <li><strong>تایمر یک‌بار مصرف:</strong> شمارش معکوس بر حسب ساعت/دقیقه برای اجرای تکی.</li>
          <li><strong>شرط دما و آب‌وهوا:</strong> استعلام دمای شهر انتخابی و اجرای دستور در صورت صدق شرط.</li>
        </ul>
      </div>
    </div>
  );
}
