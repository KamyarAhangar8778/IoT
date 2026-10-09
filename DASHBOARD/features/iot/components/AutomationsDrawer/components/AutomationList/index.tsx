/**
 * @file index.tsx
 * @description Automation list container rendering cards or empty states.
 */

import React from "react";
import { Clock } from "lucide-react";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";
import { AutomationCard } from "./AutomationCard";

interface AutomationListProps {
  handleEdit: (auto: any) => void;
  handleDelete: (id: string) => void;
  handleToggle: (id: string, enabled: boolean) => void;
}

export default function AutomationList({
  handleEdit,
  handleDelete,
  handleToggle,
}: AutomationListProps) {
  const automations = useIoTStore((state) => state.automations);

  return (
    <div className="space-y-4 font-sans text-right">
      <div className="flex items-center justify-between px-1">
        <h3 className="font-bold text-[var(--text-primary)] text-xs">
          لیست اتوماسیون‌های تعریف شده
        </h3>
        <span className="text-[10px] font-mono bg-[var(--card-hover-bg)] text-[var(--text-secondary)] px-2 py-0.5 rounded-full">
          {automations.length} مورد
        </span>
      </div>

      {automations.length === 0 ? (
        <div className="text-center py-10 bg-[var(--card-bg-solid)] rounded-2xl border border-dashed border-[var(--border-color)] text-[var(--text-muted)] text-xs flex flex-col items-center justify-center gap-2">
          <Clock className="w-8 h-8 opacity-20" />
          <span>هیچ اتوماسیونی ثبت نشده است.</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {automations.map((auto) => (
            <AutomationCard
              key={auto.id}
              auto={auto}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              handleToggle={handleToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}
