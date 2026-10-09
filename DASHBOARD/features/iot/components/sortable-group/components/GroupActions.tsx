import React from "react";
import { Trash2 } from "lucide-react";
import { SegmentGripIcon } from "@/components/icons";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";
import GroupPattern from "./GroupPattern";

interface GroupActionsProps {
  id: string;
  onDeleteGroup: (groupId: string) => void;
  parentGroupsCols: number;
  attributes: any;
  listeners: any;
}

export default function GroupActions({
  id,
  onDeleteGroup,
  parentGroupsCols,
  attributes,
  listeners,
}: GroupActionsProps) {
  const animationsEnabled = useIoTStore((s) => s.animationsEnabled);

  return (
    <div className="flex items-stretch shrink-0 pointer-events-auto relative bg-[var(--card-bg)] backdrop-blur-md border border-[var(--border-color)] shadow-sm rounded-2xl overflow-hidden transition-all duration-300">
      <GroupPattern variant="actions" />
      {/* Hover glow overlay */}
      <div className="absolute inset-0 rounded-2xl border border-[var(--accent3)] shadow-xl opacity-0 transition-opacity duration-350 md:group-hover/group-card:opacity-100 pointer-events-none" />
      {/* Delete Group Handle */}
      <button
        onClick={() => onDeleteGroup(id)}
        className={`relative z-10 flex items-center justify-center text-[var(--text-secondary)] md:hover:text-rose-600 dark:md:hover:text-rose-400 md:hover:bg-rose-500/10 transition-all duration-300 cursor-pointer border-l border-[var(--border-color)] group/del ${parentGroupsCols === 3 ? "w-10" : "w-12 sm:w-14"}`}
        title="حذف کامل این گروه و تمامی سگمنت‌های داخل آن"
      >
        <Trash2
          className={`transition-transform duration-300 ${animationsEnabled ? "md:group-hover/del:scale-110 md:group-hover/del:-rotate-6" : ""} ${parentGroupsCols === 3 ? "w-4 h-4" : "w-5 h-5"}`}
        />
      </button>

      {/* Group Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className={`relative z-10 flex items-center justify-center text-[var(--text-secondary)] md:hover:text-[var(--accent4)] md:hover:bg-[var(--accent4-transparent)] transition-all duration-300 cursor-grab active:cursor-grabbing group/grip ${parentGroupsCols === 3 ? "w-10" : "w-12 sm:w-14"}`}
        title="کشیدن کل گروه برای جابه‌جایی"
      >
        <SegmentGripIcon
          size={parentGroupsCols === 3 ? 16 : 18}
          animationsEnabled={animationsEnabled}
          className="transition-transform duration-300 md:group-hover/grip:scale-110"
        />
      </div>
    </div>
  );
}

