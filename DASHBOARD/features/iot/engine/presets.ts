/**
 * @file presets.ts
 * @description Built-in Element Engine configuration presets
 */

import { ElementEngineConfig } from "./types";

export const DEFAULT_ELEMENT_CONFIG: ElementEngineConfig = {
  meta: {
    id: "default-standard",
    name: "استاندارد داشبورد (پیش‌فرض)",
    author: "Achaemenid IoT",
    version: "1.0",
    description: "استایل کلاسیک مدرن با پس‌زمینه نیمه‌شفاف و هایلایت آبی",
    createdAt: "2026-08-15",
  },
  global: {
    borderRadiusCard: "16px",
    borderRadiusButton: "12px",
    fontFamily: "var(--font-vazir)",
    shadowIntensity: "0 10px 30px rgba(0,0,0,0.3)",
    blurBackdrop: "12px",
    primaryAccent: "#3b82f6",
    secondaryAccent: "#8b5cf6",
  },
  header: {
    background: "rgba(15, 23, 42, 0.75)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
    clockColor: "#38bdf8",
    brandTitleColor: "#f8fafc",
    voiceButtonBg: "rgba(59, 130, 246, 0.15)",
  },
  groups: {
    cardBg: "rgba(30, 41, 59, 0.5)",
    cardBorder: "1px solid rgba(255, 255, 255, 0.06)",
    headerTitleColor: "#f1f5f9",
    headerBadgeBg: "rgba(51, 65, 85, 0.6)",
    gapSpacing: "16px",
  },
  segments: {
    activeCardBg: "rgba(37, 99, 235, 0.2)",
    inactiveCardBg: "rgba(15, 23, 42, 0.4)",
    activeBorder: "1px solid rgba(59, 130, 246, 0.6)",
    inactiveBorder: "1px solid rgba(255, 255, 255, 0.05)",
    activeGlow: "0 0 20px rgba(59, 130, 246, 0.3)",
    iconActiveColor: "#60a5fa",
    iconInactiveColor: "#64748b",
    toggleOnBg: "#2563eb",
    toggleOffBg: "#334155",
  },
  buttons: {
    primaryBg: "#2563eb",
    primaryText: "#ffffff",
    secondaryBg: "rgba(51, 65, 85, 0.7)",
    secondaryText: "#e2e8f0",
    dangerBg: "#dc2626",
    hoverScale: "1.02",
  },
  drawers: {
    background: "rgba(15, 23, 42, 0.95)",
    headerBg: "rgba(30, 41, 59, 0.8)",
    tabActiveBg: "#2563eb",
    tabActiveText: "#ffffff",
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  matrixBg: {
    color: "#00ffcc",
    opacity: 0.15,
    gridSize: 32,
    twinkleSpeed: 3,
  },
  customVars: {},
};

export const CYBERPUNK_NEON_PRESET: ElementEngineConfig = {
  ...DEFAULT_ELEMENT_CONFIG,
  meta: {
    id: "cyberpunk-neon",
    name: "سایبرپانک نئون (Cyberpunk)",
    author: "Element Studio",
    version: "1.0",
    description: "رنگ‌های نئون درخشان، بنفش و فسفری با گلوی شدید",
  },
  global: {
    ...DEFAULT_ELEMENT_CONFIG.global,
    borderRadiusCard: "8px",
    borderRadiusButton: "6px",
    primaryAccent: "#ff007f",
    secondaryAccent: "#00f0ff",
    shadowIntensity: "0 0 25px rgba(255,0,127,0.4)",
  },
  segments: {
    ...DEFAULT_ELEMENT_CONFIG.segments,
    activeCardBg: "rgba(255, 0, 127, 0.15)",
    activeBorder: "1px solid #ff007f",
    activeGlow: "0 0 25px rgba(255, 0, 127, 0.6)",
    iconActiveColor: "#00f0ff",
    toggleOnBg: "#ff007f",
  },
  matrixBg: {
    color: "#ff007f",
    opacity: 0.25,
    gridSize: 28,
    twinkleSpeed: 5,
  },
};

export const PERSIAN_GOLD_PRESET: ElementEngineConfig = {
  ...DEFAULT_ELEMENT_CONFIG,
  meta: {
    id: "persian-gold",
    name: "طلاکاری هخامنشی (Achaemenid Gold)",
    author: "Royal Design",
    version: "1.0",
    description: "رنگ طلایی سلطنتی با حاشیه‌های ظریف و ظاهری لوکس",
  },
  global: {
    ...DEFAULT_ELEMENT_CONFIG.global,
    borderRadiusCard: "20px",
    borderRadiusButton: "14px",
    primaryAccent: "#d4af37",
    secondaryAccent: "#f3e5ab",
    shadowIntensity: "0 12px 35px rgba(212,175,55,0.25)",
  },
  header: {
    ...DEFAULT_ELEMENT_CONFIG.header,
    clockColor: "#f3e5ab",
    brandTitleColor: "#ffd700",
  },
  segments: {
    ...DEFAULT_ELEMENT_CONFIG.segments,
    activeCardBg: "rgba(212, 175, 55, 0.15)",
    activeBorder: "1px solid rgba(212, 175, 55, 0.7)",
    activeGlow: "0 0 20px rgba(212, 175, 55, 0.4)",
    iconActiveColor: "#ffd700",
    toggleOnBg: "#d4af37",
  },
  matrixBg: {
    color: "#d4af37",
    opacity: 0.2,
    gridSize: 36,
    twinkleSpeed: 2,
  },
};

export const BUILTIN_PRESETS: Record<string, ElementEngineConfig> = {
  "default-standard": DEFAULT_ELEMENT_CONFIG,
  "cyberpunk-neon": CYBERPUNK_NEON_PRESET,
  "persian-gold": PERSIAN_GOLD_PRESET,
};
