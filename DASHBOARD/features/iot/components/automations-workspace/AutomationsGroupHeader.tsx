/**
 * @file AutomationsGroupHeader.tsx
 * @description Header for Automations group card with title, badge, and collapse toggle.
 */

import { Activity, ChevronDown, ChevronUp, Clock, PlusCircle } from "lucide-react";
import type React from "react";
import type { AutomationsGroupMeta } from "./types";

interface AutomationsGroupHeaderProps {
  meta: AutomationsGroupMeta;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  PlusCircle,
  Clock,
  Activity,
};

export function AutomationsGroupHeader({
  meta,
  isCollapsed,
  onToggleCollapse,
}: AutomationsGroupHeaderProps) {
  const IconComponent = ICON_MAP[meta.icon] || Clock;

  return (
    <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)] bg-[var(--card-hover-bg)]/50 select-none">
      <div className="flex items-center gap-3 text-right">
        <div className="p-2 bg-[var(--accent3-transparent)] text-[var(--accent3)] rounded-full border border-[var(--accent3-medium)]">
          <IconComponent className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-sm text-[var(--text-primary)]">{meta.title}</h3>
            {meta.badge && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--accent3-transparent)] text-[var(--accent3)] border border-[var(--accent3-medium)]">
                {meta.badge}
              </span>
            )}
          </div>
          <p className="text-[11px] theme-text-muted mt-0.5">{meta.subtitle}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onToggleCollapse}
        className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--card-bg)] transition-colors cursor-pointer"
        title={isCollapsed ? "باز کردن" : "بستن"}
      >
        {isCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
      </button>
    </div>
  );
}
