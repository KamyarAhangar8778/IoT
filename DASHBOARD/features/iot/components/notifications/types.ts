import type { ToastItem as BaseToastItem } from "@/features/iot/hooks/store/types";

export type ToastType = "success" | "error" | "info" | "warning";

export type ToastItem = BaseToastItem;

export interface ToastThemeStyles {
  containerStyle: React.CSSProperties;
  badgeBgStyle: React.CSSProperties;
  progressStyle: React.CSSProperties;
  iconColor: string;
  badgeTextColor: string;
}

export interface LowDataModeBannerProps {
  lowDataMode: boolean;
  animationsEnabled: boolean;
  refetchIot: () => void;
  headerPosition?: "top" | "left";
  manualSaveMode?: boolean;
  unsavedChangesCount?: number;
  triggerCloudflarePush?: () => void;
}
