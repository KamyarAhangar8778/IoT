import { LucideIcon } from "lucide-react";

export type SettingsCategory = "all" | "network" | "appearance" | "layout" | "automation" | "audio";

export interface SettingsGroupMeta {
  id: string;
  title: string;
  subtitle: string;
  category: SettingsCategory;
  categoryLabel: string;
  Icon: LucideIcon;
}

export interface SettingsWorkspaceProps {
  animationsEnabled: boolean;
  isDark: boolean;
  accent3: string;
  accent4: string;
  selectedFont: string;
  setSelectedFont: (val: string) => void;
  setAccent3: (val: string) => void;
  setAccent4: (val: string) => void;
  animationsFps: number;
  setAnimationsFps: (val: number) => void;
  headerAnimationType: "fade" | "chase";
  setHeaderAnimationType: (val: "fade" | "chase") => void;
  headerTitle: string;
  setHeaderTitle: (val: string) => void;
  matrixDensity: number;
  setMatrixDensity: (val: number) => void;
  matrixSize: number;
  setMatrixSize: (val: number) => void;
  matrixHoverSize: number;
  setMatrixHoverSize: (val: number) => void;
  matrixOpacity: number;
  setMatrixOpacity: (val: number) => void;
  matrixColor: string;
  setMatrixColor: (val: string) => void;
  matrixMoving: boolean;
  setMatrixMoving: (val: boolean) => void;
  matrixMouseEffect: boolean;
  setMatrixMouseEffect: (val: boolean) => void;
  matrixTwinkleEffect: boolean;
  setMatrixTwinkleEffect: (val: boolean) => void;
  matrixTwinkleSpeed: number;
  setMatrixTwinkleSpeed: (val: number) => void;
  dashboardBgColor: string;
  setDashboardBgColor: (val: string) => void;
  dashboardBgOpacity: number;
  setDashboardBgOpacity: (val: number) => void;
  headerPosition: "top" | "left";
  setHeaderPosition: (val: "top" | "left") => void;
  dashboardWidth: 1 | 2 | 3 | 4 | 5;
  setDashboardWidth: (val: 1 | 2 | 3 | 4 | 5) => void;
  isGroupsCompactLayout: boolean;
  setIsGroupsCompactLayout: (val: boolean) => void;
  isSegmentsCompactLayout: boolean;
  setIsSegmentsCompactLayout: (val: boolean) => void;
  setAnimationsEnabled: (val: boolean) => void;
  dashboardViewMode: "grid" | "free_canvas";
  setDashboardViewMode: (val: "grid" | "free_canvas") => void;
}
