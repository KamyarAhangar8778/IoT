"use client";

import React from "react";
import { MotionConfig } from "motion/react";
import DashboardStyles from "@/features/iot/components/DashboardStyles";
import { ElementEngineStyleProvider } from "@/features/iot/components/styles/ElementEngineStyleProvider";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";
import { usePageVisibility } from "@/features/iot/hooks/usePageVisibility";
import DashboardFreeCanvasLayout from "./DashboardFreeCanvasLayout";
import DashboardGridLayout from "./DashboardGridLayout";

/**
 * Root Dashboard Container.
 * Orchestrates dynamic theming, element engine styles, and switches between
 * 1D vertical grid layout and fullscreen 2D free-canvas (N8N-style) layout.
 */
export default function DashboardContainer() {
  usePageVisibility();

  const accent3 = useIoTStore((s) => s.accent3);
  const accent4 = useIoTStore((s) => s.accent4);
  const isDark = useIoTStore((s) => s.isDark);
  const selectedFont = useIoTStore((s) => s.selectedFont);
  const animationsEnabled = useIoTStore((s) => s.animationsEnabled);
  const dashboardBgColor = useIoTStore((s) => s.dashboardBgColor);
  const dashboardBgOpacity = useIoTStore((s) => s.dashboardBgOpacity);
  const dashboardViewMode = useIoTStore((s) => s.dashboardViewMode);

  const isFreeCanvas = dashboardViewMode === "free_canvas";

  return (
    <MotionConfig reducedMotion={animationsEnabled ? "user" : "always"}>
      <div
        className={`theme-bg-main theme-text-secondary relative font-sans leading-relaxed selection:bg-[var(--accent3-transparent)] selection:text-[var(--accent3)] transition-colors duration-500 ${
          isFreeCanvas
            ? "h-screen w-screen overflow-hidden"
            : "min-h-screen overflow-x-clip flex flex-col justify-between"
        }`}
      >
        <DashboardStyles
          accent3={accent3}
          accent4={accent4}
          isDark={isDark}
          selectedFont={selectedFont}
          animationsEnabled={animationsEnabled}
          dashboardBgColor={dashboardBgColor}
          dashboardBgOpacity={dashboardBgOpacity}
        />
        <ElementEngineStyleProvider />

        {isFreeCanvas ? <DashboardFreeCanvasLayout /> : <DashboardGridLayout />}
      </div>
    </MotionConfig>
  );
}
