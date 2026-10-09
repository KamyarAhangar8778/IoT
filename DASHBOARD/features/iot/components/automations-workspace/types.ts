/**
 * @file types.ts
 * @description Types and interfaces for AutomationsWorkspace group-segment view.
 */

export type AutomationsCategory = "all" | "builder" | "active" | "guide";

export interface AutomationsGroupMeta {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  badge?: string;
  category: AutomationsCategory;
}

export interface AutomationsWorkspaceProps {
  onClose?: () => void;
}
