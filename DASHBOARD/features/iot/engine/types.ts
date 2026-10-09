/**
 * @file types.ts
 * @description Core TypeScript definitions for the Element Engine Protocol (Registry Style Engine)
 */

export interface ElementMeta {
  id: string;
  name: string;
  author: string;
  version: string;
  description?: string;
  createdAt?: string;
}

export interface GlobalStyles {
  borderRadiusCard: string;
  borderRadiusButton: string;
  fontFamily: string;
  shadowIntensity: string;
  blurBackdrop: string;
  primaryAccent: string;
  secondaryAccent: string;
}

export interface HeaderStyles {
  background: string;
  borderBottom: string;
  clockColor: string;
  brandTitleColor: string;
  voiceButtonBg: string;
}

export interface GroupStyles {
  cardBg: string;
  cardBorder: string;
  headerTitleColor: string;
  headerBadgeBg: string;
  gapSpacing: string;
}

export interface SegmentStyles {
  activeCardBg: string;
  inactiveCardBg: string;
  activeBorder: string;
  inactiveBorder: string;
  activeGlow: string;
  iconActiveColor: string;
  iconInactiveColor: string;
  toggleOnBg: string;
  toggleOffBg: string;
}

export interface ButtonStyles {
  primaryBg: string;
  primaryText: string;
  secondaryBg: string;
  secondaryText: string;
  dangerBg: string;
  hoverScale: string;
}

export interface DrawerStyles {
  background: string;
  headerBg: string;
  tabActiveBg: string;
  tabActiveText: string;
  borderColor: string;
}

export interface MatrixBgStyles {
  color: string;
  opacity: number;
  gridSize: number;
  twinkleSpeed: number;
}

export interface ElementEngineConfig {
  meta: ElementMeta;
  global: GlobalStyles;
  header: HeaderStyles;
  groups: GroupStyles;
  segments: SegmentStyles;
  buttons: ButtonStyles;
  drawers: DrawerStyles;
  matrixBg: MatrixBgStyles;
  customVars?: Record<string, string>;
}

export interface ParseResult {
  success: boolean;
  config?: ElementEngineConfig;
  errors?: string[];
}
