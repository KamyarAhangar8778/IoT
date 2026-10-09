/**
 * @file constants.ts
 * @description Metadata definitions for AutomationsWorkspace groups matching Settings workspace pattern.
 */

import { AutomationsGroupMeta } from "./types";

export const AUTOMATIONS_GROUPS_META: Record<string, AutomationsGroupMeta> = {
  "automation-builder": {
    id: "automation-builder",
    title: "ساخت و ویرایش اتوماسیون جدید",
    subtitle: "تعریف زمان‌بندی، تایمر یا شرط‌های محیطی",
    icon: "PlusCircle",
    badge: "تعریف سناریو",
    category: "builder",
  },
  "automation-list": {
    id: "automation-list",
    title: "فهرست سناریوهای فعال و هوشمند",
    subtitle: "مدیریت، فعال‌سازی و ویرایش اتوماسیون‌های موجود",
    icon: "Clock",
    badge: "لیست فعال",
    category: "active",
  },
  "automation-guide": {
    id: "automation-guide",
    title: "وضعیت موتور ابری و راهنما",
    subtitle: "پایش وضعیت همگام‌سازی و آمارهای اجرا",
    icon: "Activity",
    badge: "آنالیز موتور",
    category: "guide",
  },
};

export const AUTOMATIONS_GROUPS_ORDER = [
  "automation-builder",
  "automation-list",
  "automation-guide",
];
