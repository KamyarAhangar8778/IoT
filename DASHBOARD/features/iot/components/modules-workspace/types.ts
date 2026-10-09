/**
 * @file types.ts
 * @description Types and interfaces for ModulesWorkspace group-segment view.
 */

import { Segment } from "../modules-drawer/core/types";

export type ModulesCategory = "all" | "add" | "list" | "guide";

export interface ModulesGroupMeta {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  badge?: string;
  category: ModulesCategory;
}

export interface ModulesWorkspaceProps {
  onClose?: () => void;
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
  animationsEnabled?: boolean;
  accent3?: string;
}
