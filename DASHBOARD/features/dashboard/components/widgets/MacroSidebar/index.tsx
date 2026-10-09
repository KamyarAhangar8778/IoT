"use client";

import React, { useRef, useState, useEffect } from "react";
import { useDashboard } from "@/features/dashboard/context/DashboardContext";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";
import { Play } from "lucide-react";
import { WidgetIcon } from "@/components/icons";

interface MacroSidebarProps {
  forceHorizontal?: boolean;
  className?: string;
}

/**
 * Custom button selector widget for macros and quick execution scenarios.
 * Displays marquee scrolling animation in a single row only when buttons overflow the container width.
 */
export default function MacroSidebar({ className = "" }: MacroSidebarProps) {
  const { handleBatchPinState } = useDashboard();
  const animationsEnabled = useIoTStore((s) => s.animationsEnabled);
  const macros = useIoTStore((s) => s.macros);
  const selectedGroupFilter = useIoTStore((s) => s.selectedGroupFilter);

  const containerRef = useRef<HTMLDivElement>(null);
  const singleSetRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  // Measure single-row content vs container width to determine if scrolling is necessary
  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current && singleSetRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const contentWidth = singleSetRef.current.scrollWidth;
        // Overflow if single row width exceeds available container width (accounting for padding)
        setIsOverflowing(contentWidth > containerWidth - 20);
      }
    };

    checkOverflow();

    const resizeObserver = new ResizeObserver(() => {
      checkOverflow();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    if (singleSetRef.current) {
      resizeObserver.observe(singleSetRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [macros]);

  if (selectedGroupFilter || !macros || macros.length === 0) {
    return null;
  }

  const handleExecuteMacro = (macroId: string) => {
    const macro = macros.find((m) => m.id === macroId);
    if (!macro) return;
    handleBatchPinState(macro.actions);
  };

  const shouldScroll = isOverflowing && animationsEnabled;

  return (
    <div
      className={`w-full flex justify-center items-center ${className}`}
      dir="rtl"
    >
      <div
        ref={containerRef}
        className="relative group w-full max-w-2xl bg-[var(--card-bg-solid)]/90 backdrop-blur-md border border-[var(--border-color)] px-4 py-2.5 rounded-2xl shadow-sm overflow-hidden hover:border-[var(--accent3)]/50 transition-all duration-300"
      >
        {shouldScroll ? (
          <div
            dir="ltr"
            className="flex flex-row items-center w-max animate-marquee-rtl group-hover:[animation-play-state:paused]"
          >
            {/* Copy 1 */}
            <div
              ref={singleSetRef}
              className="flex flex-row items-center gap-3 shrink-0 pr-3"
            >
              {macros.map((macro) => (
                <MacroButtonItem
                  key={`set0-${macro.id}`}
                  macro={macro}
                  onClick={() => handleExecuteMacro(macro.id)}
                />
              ))}
            </div>

            {/* Copy 2 (Exact duplicate twin for seamless infinite looping) */}
            <div
              className="flex flex-row items-center gap-3 shrink-0 pr-3"
              aria-hidden="true"
            >
              {macros.map((macro) => (
                <MacroButtonItem
                  key={`set1-${macro.id}`}
                  macro={macro}
                  onClick={() => handleExecuteMacro(macro.id)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="w-full flex justify-center items-center">
            <div
              ref={singleSetRef}
              className="flex flex-row items-center justify-center flex-nowrap gap-3 w-max shrink-0 mx-auto"
            >
              {macros.map((macro) => (
                <MacroButtonItem
                  key={macro.id}
                  macro={macro}
                  onClick={() => handleExecuteMacro(macro.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Individual Macro Button Item
 */
function MacroButtonItem({
  macro,
  onClick,
}: {
  macro: any;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      dir="rtl"
      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-primary)] hover:border-[var(--accent3)] hover:text-[var(--accent3)] hover:bg-[var(--accent3-transparent)] hover:scale-105 active:scale-95 transition-all duration-300 shrink-0 cursor-pointer shadow-sm group/btn select-none"
      title={macro.title}
    >
      {macro.icon ? (
        <span className="w-4 h-4 flex items-center justify-center shrink-0">
          <WidgetIcon
            icon={macro.icon}
            className="w-4 h-4 object-contain group-hover/btn:scale-110 transition-transform"
          />
        </span>
      ) : (
        <Play className="w-3.5 h-3.5 text-[var(--accent3)] shrink-0 group-hover/btn:scale-110 transition-transform" />
      )}
      <span className="text-xs font-bold whitespace-nowrap leading-none">
        {macro.title}
      </span>
    </button>
  );
}



