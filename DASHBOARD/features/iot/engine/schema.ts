/**
 * @file schema.ts
 * @description Zod validation schema for the Element Engine Protocol file parsing
 */

import { z } from "zod";

export const ElementMetaSchema = z.object({
  id: z.string().default("default-element"),
  name: z.string().default("Standard Element Theme"),
  author: z.string().default("System"),
  version: z.string().default("1.0"),
  description: z.string().optional(),
  createdAt: z.string().optional(),
});

export const GlobalStylesSchema = z.object({
  borderRadiusCard: z.string().default("16px"),
  borderRadiusButton: z.string().default("12px"),
  fontFamily: z.string().default("var(--font-vazir)"),
  shadowIntensity: z.string().default("0 10px 30px rgba(0,0,0,0.3)"),
  blurBackdrop: z.string().default("12px"),
  primaryAccent: z.string().default("#3b82f6"),
  secondaryAccent: z.string().default("#8b5cf6"),
});

export const HeaderStylesSchema = z.object({
  background: z.string().default("rgba(15, 23, 42, 0.75)"),
  borderBottom: z.string().default("1px solid rgba(255, 255, 255, 0.08)"),
  clockColor: z.string().default("#38bdf8"),
  brandTitleColor: z.string().default("#f8fafc"),
  voiceButtonBg: z.string().default("rgba(59, 130, 246, 0.15)"),
});

export const GroupStylesSchema = z.object({
  cardBg: z.string().default("rgba(30, 41, 59, 0.5)"),
  cardBorder: z.string().default("1px solid rgba(255, 255, 255, 0.06)"),
  headerTitleColor: z.string().default("#f1f5f9"),
  headerBadgeBg: z.string().default("rgba(51, 65, 85, 0.6)"),
  gapSpacing: z.string().default("16px"),
});

export const SegmentStylesSchema = z.object({
  activeCardBg: z.string().default("rgba(37, 99, 235, 0.2)"),
  inactiveCardBg: z.string().default("rgba(15, 23, 42, 0.4)"),
  activeBorder: z.string().default("1px solid rgba(59, 130, 246, 0.6)"),
  inactiveBorder: z.string().default("1px solid rgba(255, 255, 255, 0.05)"),
  activeGlow: z.string().default("0 0 20px rgba(59, 130, 246, 0.3)"),
  iconActiveColor: z.string().default("#60a5fa"),
  iconInactiveColor: z.string().default("#64748b"),
  toggleOnBg: z.string().default("#2563eb"),
  toggleOffBg: z.string().default("#334155"),
});

export const ButtonStylesSchema = z.object({
  primaryBg: z.string().default("#2563eb"),
  primaryText: z.string().default("#ffffff"),
  secondaryBg: z.string().default("rgba(51, 65, 85, 0.7)"),
  secondaryText: z.string().default("#e2e8f0"),
  dangerBg: z.string().default("#dc2626"),
  hoverScale: z.string().default("1.02"),
});

export const DrawerStylesSchema = z.object({
  background: z.string().default("rgba(15, 23, 42, 0.95)"),
  headerBg: z.string().default("rgba(30, 41, 59, 0.8)"),
  tabActiveBg: z.string().default("#2563eb"),
  tabActiveText: z.string().default("#ffffff"),
  borderColor: z.string().default("rgba(255, 255, 255, 0.1)"),
});

export const MatrixBgStylesSchema = z.object({
  color: z.string().default("#00ffcc"),
  opacity: z.number().min(0).max(1).default(0.15),
  gridSize: z.number().min(10).max(100).default(32),
  twinkleSpeed: z.number().min(1).max(10).default(3),
});

export const ElementEngineSchema = z.object({
  meta: ElementMetaSchema,
  global: GlobalStylesSchema,
  header: HeaderStylesSchema,
  groups: GroupStylesSchema,
  segments: SegmentStylesSchema,
  buttons: ButtonStylesSchema,
  drawers: DrawerStylesSchema,
  matrixBg: MatrixBgStylesSchema,
  customVars: z.record(z.string(), z.string()).optional(),
});
