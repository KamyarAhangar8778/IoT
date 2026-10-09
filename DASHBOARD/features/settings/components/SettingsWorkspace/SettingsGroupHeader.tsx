import { ChevronDown, ChevronUp, GripVertical } from "lucide-react";
import type { SettingsGroupMeta } from "./types";

interface SettingsGroupHeaderProps {
  meta: SettingsGroupMeta;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  dragHandleProps?: Record<string, any>;
}

export function SettingsGroupHeader({
  meta,
  isCollapsed,
  onToggleCollapse,
  dragHandleProps,
}: SettingsGroupHeaderProps) {
  const Icon = meta.Icon;

  return (
    <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)] bg-[var(--card-bg-solid)] rounded-t-2xl select-none">
      <div className="flex items-center gap-3">
        <div
          {...dragHandleProps}
          className="p-1.5 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--border-color)] cursor-grab active:cursor-grabbing transition-colors"
          title="جابه‌جایی گروه تنظیمات"
        >
          <GripVertical className="w-4 h-4" />
        </div>

        <div className="p-2 rounded-full bg-[var(--accent3-transparent)] text-[var(--accent3)]">
          <Icon className="w-4 h-4" />
        </div>

        <div className="text-right">
          <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
            {meta.title}
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--border-color)] text-[var(--text-secondary)] font-normal">
              {meta.categoryLabel}
            </span>
          </h3>
          <p className="text-[11px] text-[var(--text-muted)] font-medium mt-0.5">{meta.subtitle}</p>
        </div>
      </div>

      <button
        onClick={onToggleCollapse}
        className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border-color)] transition-colors cursor-pointer"
        title={isCollapsed ? "باز کردن" : "بستن"}
      >
        {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
      </button>
    </div>
  );
}
