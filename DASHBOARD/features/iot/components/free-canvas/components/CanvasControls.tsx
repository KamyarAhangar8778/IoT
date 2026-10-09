import React from "react";
import { CanvasControlsProps } from "../core/types";

/**
 * Floating toolbar providing Zoom in, Zoom out, Scale percentage and Reset view buttons.
 */
export const CanvasControls: React.FC<CanvasControlsProps> = ({
  scale,
  onZoomIn,
  onZoomOut,
  onReset,
  className = "",
}) => {
  return (
    <div
      data-interactive="true"
      className={`absolute bottom-6 right-6 z-20 flex items-center gap-1.5 p-1.5 rounded-2xl bg-[var(--card-bg-solid)]/90 backdrop-blur-md border border-[var(--border-color)] shadow-xl select-none ${className}`}
      dir="ltr"
    >
      <button
        onClick={onZoomOut}
        title="Zoom Out"
        className="w-8 h-8 flex items-center justify-center rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-main)] transition-colors text-sm font-bold active:scale-95 cursor-pointer"
      >
        −
      </button>

      <div
        onClick={onReset}
        title="Click to reset canvas view"
        className="px-2 py-1 min-w-[50px] text-center text-xs font-mono font-semibold text-[var(--text-primary)] cursor-pointer hover:bg-[var(--bg-main)] rounded-lg transition-colors"
      >
        {Math.round(scale * 100)}%
      </div>

      <button
        onClick={onZoomIn}
        title="Zoom In"
        className="w-8 h-8 flex items-center justify-center rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-main)] transition-colors text-sm font-bold active:scale-95 cursor-pointer"
      >
        +
      </button>

      <div className="w-[1px] h-4 bg-[var(--border-color)] mx-0.5" />

      <button
        onClick={onReset}
        title="Reset Position and Zoom"
        className="px-2.5 h-8 flex items-center justify-center rounded-xl text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--accent3)] hover:bg-[var(--accent3-transparent)] transition-all active:scale-95 cursor-pointer"
      >
        بازنشانی
      </button>
    </div>
  );
};
