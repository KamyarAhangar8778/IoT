import React from "react";
import { SegmentData } from "../core/types";
import PinToggle from "./PinToggle";

interface CardBodyProps {
  segment: SegmentData;
  isPinOn: boolean;
  isCompact: boolean;
  isUltraCompact: boolean;
  isMobileTwoCol?: boolean;
  densityFactor?: number;
  mode: "switch" | "push";
  buttonProps: any;
  animationsEnabled?: boolean;
}

export default function CardBody({
  segment,
  isPinOn,
  isCompact,
  isUltraCompact,
  buttonProps,
  animationsEnabled = true,
}: CardBodyProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center w-full p-2.5 sm:p-3 min-h-0">
      {segment.type === "input" ? (
        /* Digital Input Segment (0/1): Simplified to just Title + Colored Status Circle Indicator */
        <div className="flex items-center justify-between w-full bg-[var(--card-bg-solid)]/70 backdrop-blur-xs px-3.5 py-2.5 border border-[var(--border-color)] rounded-xl transition-all duration-300 md:group-hover/segment:border-[var(--accent3-medium)]/40">
          <div className="flex items-center gap-2 shrink-0">
            <div
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                isPinOn
                  ? "bg-[var(--accent4)] shadow-[0_0_12px_var(--accent4)] scale-110"
                  : "bg-slate-400/40 dark:bg-slate-600/40 border border-slate-400/50 dark:border-slate-600/50 scale-95"
              }`}
              title={isPinOn ? "ورودی فعال (1 / HIGH)" : "ورودی غیرفعال (0 / LOW)"}
            />
          </div>
          <span
            className="text-xs font-sans font-bold theme-text-primary truncate text-right flex-1 pr-2"
            title={segment.title}
          >
            {segment.title}
          </span>
        </div>
      ) : isUltraCompact ? (
        <div className="flex items-center justify-center w-full my-auto">
          <PinToggle
            isPinOn={isPinOn}
            buttonProps={buttonProps}
            animationsEnabled={animationsEnabled}
            isUltraCompact={true}
          />
        </div>
      ) : (
        /* Switch / Push Segment: Perfectly centered vertically and horizontally with balanced spacing */
        <div className="flex items-center justify-between w-full bg-[var(--card-bg-solid)]/70 backdrop-blur-xs px-3.5 py-2.5 border border-[var(--border-color)] rounded-xl transition-all duration-300 md:group-hover/segment:border-[var(--accent3-medium)]/40 gap-2.5 my-auto">
          <div className="shrink-0 flex items-center justify-center">
            <PinToggle
              isPinOn={isPinOn}
              buttonProps={buttonProps}
              animationsEnabled={animationsEnabled}
              isUltraCompact={isCompact}
            />
          </div>
          <span
            className="text-xs font-sans font-bold theme-text-primary truncate text-right flex-1"
            title={segment.title}
          >
            {segment.title}
          </span>
        </div>
      )}
    </div>
  );
}

