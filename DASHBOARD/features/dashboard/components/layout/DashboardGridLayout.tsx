"use client";

import React from "react";
import CuneiformBackground from "@/features/iot/components/cuneiform-background";
import DashboardHeader from "./DashboardHeader";
import DashboardMain from "./DashboardMain";
import DashboardFooter from "./DashboardFooter";
import DashboardDrawers from "./DashboardDrawers";
import ToastNotification from "@/features/iot/components/notifications/ToastNotification";
import ScrollToTopButton from "../widgets/ScrollToTopButton";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";
import { useDashboardLayout } from "../../hooks/useDashboardLayout";

/**
 * Standard 1D Vertical Grid Layout.
 * Renders structured multi-column vertical scrolling workspace with background animations.
 */
export default function DashboardGridLayout() {
  const accent3 = useIoTStore((s) => s.accent3);
  const isDark = useIoTStore((s) => s.isDark);
  const animationsEnabled = useIoTStore((s) => s.animationsEnabled);
  const animationsFps = useIoTStore((s) => s.animationsFps);
  const matrixDensity = useIoTStore((s) => s.matrixDensity);
  const matrixSize = useIoTStore((s) => s.matrixSize);
  const matrixHoverSize = useIoTStore((s) => s.matrixHoverSize);
  const matrixOpacity = useIoTStore((s) => s.matrixOpacity);
  const matrixColor = useIoTStore((s) => s.matrixColor);
  const matrixMoving = useIoTStore((s) => s.matrixMoving);
  const matrixMouseEffect = useIoTStore((s) => s.matrixMouseEffect);
  const matrixTwinkleEffect = useIoTStore((s) => s.matrixTwinkleEffect);
  const matrixTwinkleSpeed = useIoTStore((s) => s.matrixTwinkleSpeed);
  const headerPosition = useIoTStore((s) => s.headerPosition);
  const dashboardWidth = useIoTStore((s) => s.dashboardWidth);

  const { topHeaderContainerWidth, leftHeaderContentWidth } = useDashboardLayout(dashboardWidth);

  return (
    <div className="animate-fade-in flex flex-col flex-1 min-h-screen justify-between">
      {/* Background Matrix/Cuneiform Animations (Vertical Grid Mode Only) */}
      <CuneiformBackground
        isDark={isDark}
        matrixDensity={matrixDensity}
        matrixSize={matrixSize}
        matrixHoverSize={matrixHoverSize}
        matrixOpacity={matrixOpacity}
        matrixColor={matrixColor}
        matrixMoving={matrixMoving}
        matrixMouseEffect={matrixMouseEffect}
        matrixTwinkleEffect={matrixTwinkleEffect}
        matrixTwinkleSpeed={matrixTwinkleSpeed}
        accent3={accent3}
        animationsEnabled={animationsEnabled}
        animationsFps={animationsFps}
      />

      <div
        className={`relative z-10 w-full flex-1 transition-all duration-500 ${
          headerPosition === "left"
            ? "flex flex-col md:flex-row-reverse items-stretch"
            : `flex flex-col ${topHeaderContainerWidth} mx-auto px-6 py-6 md:py-8 justify-start gap-12`
        }`}
      >
        {headerPosition === "left" && <DashboardHeader position="left" />}

        <div
          className={`flex-1 flex flex-col justify-start gap-12 ${
            headerPosition === "left"
              ? `p-6 md:pt-1 md:pb-8 md:px-8 ${leftHeaderContentWidth} w-full mx-auto`
              : "w-full"
          }`}
        >
          <DashboardHeader position="topOrMobile" />
          <DashboardMain />
        </div>
      </div>

      <DashboardFooter />
      <DashboardDrawers />
      <ToastNotification />
      <ScrollToTopButton />
    </div>
  );
}
