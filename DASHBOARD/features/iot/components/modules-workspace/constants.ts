/**
 * @file constants.ts
 * @description Metadata definitions for ModulesWorkspace groups.
 */

import { ModulesGroupMeta } from "./types";

export const MODULES_GROUPS_META: Record<string, ModulesGroupMeta> = {
  "module-add": {
    id: "module-add",
    title: "تعریف و افزودن سگمنت جدید",
    subtitle: "تنظیم پایه GPIO، عنوان، گروه و حالت عملکرد ماژول",
    icon: "PlusCircle",
    badge: "تعریف ماژول",
    category: "add",
  },
  "module-list": {
    id: "module-list",
    title: "لیست سگمنت‌ها و ماژول‌های مستقر",
    subtitle: "مشاهده و مدیریت سگمنت‌های فعال بر روی سخت‌افزار",
    icon: "Layers",
    badge: "لیست مستقر",
    category: "list",
  },
  "module-guide": {
    id: "module-guide",
    title: "راهنمای اتصال و پایداری سخت‌افزار",
    subtitle: "اطلاعات تایپیک‌های MQTT و اتصالات پین‌های ESP32",
    icon: "Cpu",
    badge: "راهنما",
    category: "guide",
  },
};

export const MODULES_GROUPS_ORDER = [
  "module-add",
  "module-list",
  "module-guide",
];
