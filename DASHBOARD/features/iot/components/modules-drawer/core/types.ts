/**
 * @file types.ts
 * @description Type definitions and tab constants for ModulesDrawer.
 */

export interface Segment {
  id: string;
  type: string;
  pin: string;
  title: string;
  group?: string;
  icon?: string;
  mode?: "switch" | "push";
  auto_off?: number;
}

export interface ModulesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSegment: (
    type: string,
    pin: string,
    title?: string,
    group?: string,
    mode?: "switch" | "push",
    auto_off?: number,
    icon?: string,
    groupIcon?: string
  ) => void;
  segments: Segment[];
  onRemoveSegment: (id: string) => void;
  isDark: boolean;
  accent3: string;
  accent4: string;
  animationsEnabled?: boolean;
}

export interface ModuleTabItem {
  id: string;
  title: string;
  compactTitle: string;
  icon: string;
}

/**
 * List of tabs available in the ModulesDrawer menu
 */
export const MODULES_TABS: ModuleTabItem[] = [
  {
    id: "add",
    title: "افزودن سگمنت جدید",
    compactTitle: "ایجاد ماژول",
    icon: "Plus",
  },
  {
    id: "list",
    title: "لیست سگمنت‌های مستقر",
    compactTitle: "مدیریت لیست",
    icon: "Layers",
  },
  {
    id: "config",
    title: "پیکربندی پایه و راهنما",
    compactTitle: "راهنما",
    icon: "Cpu",
  },
];
