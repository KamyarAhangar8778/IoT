import React from "react";
import { useCanvasZoomStore } from "@/features/iot/components/free-canvas/store/useCanvasZoomStore";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";
import { RotateCcw, ZoomIn, ZoomOut } from "lucide-react";

interface HeaderZoomControlsProps {
  variant?: "horizontal" | "vertical";
}

/**
 * Header-embedded Zoom & Viewport controls for Free-Canvas mode.
 * Displays current scale percentage, zoom in/out, and reset view buttons.
 */
export default function HeaderZoomControls({ variant = "horizontal" }: HeaderZoomControlsProps) {
  const dashboardViewMode = useIoTStore((s) => s.dashboardViewMode);
  const scale = useCanvasZoomStore((s) => s.scale);
  const zoomIn = useCanvasZoomStore((s) => s.zoomIn);
  const zoomOut = useCanvasZoomStore((s) => s.zoomOut);
  const resetZoom = useCanvasZoomStore((s) => s.resetZoom);

  // Only render when the dashboard is in free_canvas mode
  if (dashboardViewMode !== "free_canvas") {
    return null;
  }

  const isVertical = variant === "vertical";

  return (
    <div
      data-interactive="true"
      className={`flex items-center gap-1 p-1 rounded-xl bg-[var(--bg-main)]/80 border border-[var(--border-color)] select-none text-xs ${
        isVertical ? "w-full justify-between" : ""
      }`}
      dir="ltr"
    >
      <button
        type="button"
        onClick={zoomOut}
        title="کوچک‌نمایی (Zoom Out)"
        className="w-7 h-7 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--card-bg-solid)] transition-colors font-bold active:scale-95 cursor-pointer"
      >
        <ZoomOut className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        onClick={resetZoom}
        title="بازنشانی بزرگ‌نمایی (Reset Zoom)"
        className="px-2 h-7 flex items-center justify-center font-mono font-bold text-[var(--text-primary)] hover:bg-[var(--card-bg-solid)] rounded-lg transition-colors cursor-pointer text-xs"
      >
        {Math.round(scale * 100)}%
      </button>

      <button
        type="button"
        onClick={zoomIn}
        title="بزرگ‌نمایی (Zoom In)"
        className="w-7 h-7 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--card-bg-solid)] transition-colors font-bold active:scale-95 cursor-pointer"
      >
        <ZoomIn className="w-3.5 h-3.5" />
      </button>

      <div className="w-[1px] h-3.5 bg-[var(--border-color)] mx-0.5 opacity-60" />

      <button
        type="button"
        onClick={resetZoom}
        title="بازنشانی موقعیت و مقیاس"
        className="w-7 h-7 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:text-[var(--accent3)] hover:bg-[var(--accent3-transparent)] transition-all active:scale-95 cursor-pointer"
      >
        <RotateCcw className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
