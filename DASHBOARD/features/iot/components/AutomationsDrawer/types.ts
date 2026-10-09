/**
 * @file types.ts
 * @description Type definitions and tab configurations for AutomationsDrawer matching SettingsDrawer structure.
 */

export interface AutomationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  accent3?: string;
  accent4?: string;
  animationsEnabled?: boolean;
}

export interface AutomationTabItem {
  id: string;
  title: string;
  compactTitle: string;
  icon: string;
}

/**
 * List of tabs available in the AutomationsDrawer menu
 */
export const AUTOMATIONS_TABS: AutomationTabItem[] = [
  {
    id: "add",
    title: "افزودن اتوماسیون",
    compactTitle: "ایجاد جدید",
    icon: "Clock",
  },
  {
    id: "list",
    title: "لیست اتوماسیون‌ها",
    compactTitle: "مدیریت لیست",
    icon: "Sliders",
  },
  {
    id: "guide",
    title: "راهنما و استراتژی",
    compactTitle: "راهنما",
    icon: "Info",
  },
];
