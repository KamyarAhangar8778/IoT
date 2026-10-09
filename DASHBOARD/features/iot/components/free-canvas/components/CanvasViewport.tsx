import React from "react";
import { CanvasGridBackground } from "./CanvasGridBackground";
import { useCanvasPanZoom } from "../hooks/useCanvasPanZoom";
import { CanvasViewportProps } from "../core/types";
import { Move } from "lucide-react";

/**
 * Main viewport container that orchestrates pan/zoom transformations,
 * renders background animated twinkle grid, handles Right-Click & Middle-Scroll navigation
 * and mouse wheel zoom.
 */
export const CanvasViewport: React.FC<CanvasViewportProps> = ({
  children,
  className = "",
}) => {
  const {
    transform,
    isPanning,
    panMode,
    middleLockOrigin,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleContextMenu,
    handleWheel,
  } = useCanvasPanZoom();

  return (
    <div
      className={`relative w-full h-full min-h-[70vh] overflow-hidden select-none touch-none ${
        panMode === "middle_locked"
          ? "cursor-all-scroll"
          : isPanning
          ? "cursor-grabbing"
          : "cursor-default"
      } ${className}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onContextMenu={handleContextMenu}
      onWheel={handleWheel}
    >
      {/* Animated Matrix/Twinkle Canvas Background */}
      <CanvasGridBackground transform={transform} />

      {/* Middle Click Locked Origin Anchor Indicator */}
      {panMode === "middle_locked" && middleLockOrigin && (
        <div
          className="fixed z-50 pointer-events-none -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[var(--accent3)]/20 border border-[var(--accent3)] backdrop-blur-md flex items-center justify-center text-[var(--accent3)] shadow-lg animate-pulse"
          style={{ left: middleLockOrigin.x, top: middleLockOrigin.y }}
        >
          <Move className="w-4 h-4" />
        </div>
      )}

      {/* Infinite Canvas Interactive Plane driven by Damped Physics */}
      <div
        className="absolute inset-0 origin-top-left will-change-transform pointer-events-none"
        style={{
          transform: `translate3d(${transform.x}px, ${transform.y}px, 0px) scale(${transform.scale})`,
        }}
      >
        <div className="relative pointer-events-auto min-w-[6000px] min-h-[6000px]">
          {children}
        </div>
      </div>
    </div>
  );
};
