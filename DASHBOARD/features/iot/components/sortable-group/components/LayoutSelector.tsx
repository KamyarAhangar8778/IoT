"use client";

import React from "react";
import { SingleColumnIcon, DoubleColumnIcon, TripleColumnIcon } from "@/components/icons";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";

interface LayoutSelectorProps {
  maxCols: number;
  onColsChange: (cols: number) => void;
  parentGroupsCols: number;
  fullWidth?: boolean;
}

export default function LayoutSelector({
  maxCols,
  onColsChange,
  parentGroupsCols,
  fullWidth = false,
}: LayoutSelectorProps) {
  const animationsEnabled = useIoTStore((s) => s.animationsEnabled);

  return (
    <div className={`flex ${parentGroupsCols === 3 ? "flex-row" : "flex-col sm:flex-row"} ${fullWidth ? "w-full *:flex-1" : ""} items-center bg-[var(--bg-main)] border border-[var(--border-color)] p-0.5 sm:p-1 rounded-xl text-xs gap-0.5 shrink-0 shadow-sm`}>
      <button
        onClick={() => onColsChange(1)}
        aria-label="تک ستون"
        className={`${parentGroupsCols === 3 ? "p-1" : "p-1.5"} flex items-center justify-center rounded-lg transition-all cursor-pointer select-none ${
          maxCols === 1
            ? "bg-[var(--accent3-transparent)] text-[var(--accent3)] shadow-inner"
            : "text-[var(--text-muted)] md:hover:text-[var(--text-primary)] md:hover:bg-[var(--card-bg-solid)]"
        }`}
        title="نمایش تک ستونه"
      >
        <SingleColumnIcon
          size={14}
          animationsEnabled={animationsEnabled}
          isActive={maxCols === 1}
        />
      </button>
      <button
        onClick={() => onColsChange(2)}
        aria-label="دو ستون"
        className={`${parentGroupsCols === 3 ? "p-1" : "p-1.5"} flex items-center justify-center rounded-lg transition-all cursor-pointer select-none ${
          maxCols === 2
            ? "bg-[var(--accent3-transparent)] text-[var(--accent3)] shadow-inner"
            : "text-[var(--text-muted)] md:hover:text-[var(--text-primary)] md:hover:bg-[var(--card-bg-solid)]"
        }`}
        title="نمایش دو ستونه"
      >
        <DoubleColumnIcon
          size={14}
          animationsEnabled={animationsEnabled}
          isActive={maxCols === 2}
        />
      </button>
      <button
        onClick={() => onColsChange(3)}
        aria-label="سه ستون"
        className={`${parentGroupsCols === 3 ? "p-1" : "p-1.5"} flex items-center justify-center rounded-lg transition-all cursor-pointer select-none ${
          maxCols === 3
            ? "bg-[var(--accent3-transparent)] text-[var(--accent3)] shadow-inner"
            : "text-[var(--text-muted)] md:hover:text-[var(--text-primary)] md:hover:bg-[var(--card-bg-solid)]"
        }`}
        title="نمایش سه ستونه"
      >
        <TripleColumnIcon
          size={14}
          animationsEnabled={animationsEnabled}
          isActive={maxCols === 3}
        />
      </button>
    </div>
  );
}

