import React from "react";
import { SegmentData } from "../core/types";
import SegmentControls from "./SegmentControls";
import { SegmentDeleteIcon, SegmentGripIcon } from "@/components/icons";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";

interface SegmentActionsProps {
  segment: SegmentData;
  onRemove: (id: string) => void;
  attributes: any;
  listeners: any;
  onUpdateSegmentMode?: (id: string, mode: "switch" | "push") => void;
  onUpdateSegmentAutoOff?: (id: string, autoOff: number) => void;
  mode: "switch" | "push";
  countdown?: number | null;
  autoOffMenuProps: {
    showAutoOffMenu: boolean;
    setShowAutoOffMenu: (val: boolean) => void;
    autoOffButtonRef: React.RefObject<HTMLButtonElement | null>;
    autoOffMenuRef: React.RefObject<HTMLDivElement | null>;
  };
}

export default function SegmentActions({
  segment,
  onRemove,
  attributes,
  listeners,
  onUpdateSegmentMode,
  onUpdateSegmentAutoOff,
  mode,
  countdown,
  autoOffMenuProps,
}: SegmentActionsProps) {
  const animationsEnabled = useIoTStore((s) => s.animationsEnabled);

  return (
    <>
      <div className="flex items-center gap-1 bg-[var(--card-bg-solid)] border border-[var(--border-color)] p-[3px] rounded-full shadow-sm transition-colors mr-1.5">
        <button
          onClick={() => onRemove(segment.id)}
          className="group/del p-1.5 text-[var(--text-secondary)] md:hover:bg-rose-500/10 md:hover:text-rose-500 transition-all duration-200 cursor-pointer rounded-full active:scale-95 flex items-center justify-center"
          title="حذف این سگمنت"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <SegmentDeleteIcon
            size={14}
            animationsEnabled={animationsEnabled}
          />
        </button>
        <div
          {...attributes}
          {...listeners}
          className="group/grip p-1.5 text-[var(--text-secondary)] md:hover:bg-[var(--accent4-transparent)] md:hover:text-[var(--accent4)] cursor-grab active:cursor-grabbing transition-all duration-200 rounded-full active:scale-95 flex items-center justify-center"
          title="کشیدن برای جابه‌جایی"
        >
          <SegmentGripIcon
            size={14}
            animationsEnabled={animationsEnabled}
          />
        </div>
      </div>
      {onUpdateSegmentMode && segment.type !== "input" && (
        <div className="mr-1.5">
          <SegmentControls
            segment={segment}
            mode={mode}
            onUpdateSegmentMode={onUpdateSegmentMode}
            onUpdateSegmentAutoOff={onUpdateSegmentAutoOff}
            countdown={countdown}
            {...autoOffMenuProps}
          />
        </div>
      )}
    </>
  );
}

