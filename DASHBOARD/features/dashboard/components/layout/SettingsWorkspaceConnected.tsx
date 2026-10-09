"use client";

import React from "react";
import SettingsWorkspace from "@/features/settings/components/SettingsWorkspace";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";

/**
 * Connected wrapper for SettingsWorkspace that maps IoT Store state and mutations.
 */
export default function SettingsWorkspaceConnected() {
  const animationsEnabled = useIoTStore((s) => s.animationsEnabled);
  const setAnimationsEnabled = useIoTStore((s) => s.setAnimationsEnabled);
  const isDark = useIoTStore((s) => s.isDark);
  const accent3 = useIoTStore((s) => s.accent3);
  const setAccent3 = useIoTStore((s) => s.setAccent3);
  const accent4 = useIoTStore((s) => s.accent4);
  const setAccent4 = useIoTStore((s) => s.setAccent4);
  const selectedFont = useIoTStore((s) => s.selectedFont);
  const setSelectedFont = useIoTStore((s) => s.setSelectedFont);
  const animationsFps = useIoTStore((s) => s.animationsFps);
  const setAnimationsFps = useIoTStore((s) => s.setAnimationsFps);
  const headerAnimationType = useIoTStore((s) => s.headerAnimationType);
  const setHeaderAnimationType = useIoTStore((s) => s.setHeaderAnimationType);
  const headerTitle = useIoTStore((s) => s.headerTitle);
  const setHeaderTitle = useIoTStore((s) => s.setHeaderTitle);
  const matrixDensity = useIoTStore((s) => s.matrixDensity);
  const setMatrixDensity = useIoTStore((s) => s.setMatrixDensity);
  const matrixSize = useIoTStore((s) => s.matrixSize);
  const setMatrixSize = useIoTStore((s) => s.setMatrixSize);
  const matrixHoverSize = useIoTStore((s) => s.matrixHoverSize);
  const setMatrixHoverSize = useIoTStore((s) => s.setMatrixHoverSize);
  const matrixOpacity = useIoTStore((s) => s.matrixOpacity);
  const setMatrixOpacity = useIoTStore((s) => s.setMatrixOpacity);
  const matrixColor = useIoTStore((s) => s.matrixColor);
  const setMatrixColor = useIoTStore((s) => s.setMatrixColor);
  const matrixMoving = useIoTStore((s) => s.matrixMoving);
  const setMatrixMoving = useIoTStore((s) => s.setMatrixMoving);
  const matrixMouseEffect = useIoTStore((s) => s.matrixMouseEffect);
  const setMatrixMouseEffect = useIoTStore((s) => s.setMatrixMouseEffect);
  const matrixTwinkleEffect = useIoTStore((s) => s.matrixTwinkleEffect);
  const setMatrixTwinkleEffect = useIoTStore((s) => s.setMatrixTwinkleEffect);
  const matrixTwinkleSpeed = useIoTStore((s) => s.matrixTwinkleSpeed);
  const setMatrixTwinkleSpeed = useIoTStore((s) => s.setMatrixTwinkleSpeed);
  const dashboardBgColor = useIoTStore((s) => s.dashboardBgColor);
  const setDashboardBgColor = useIoTStore((s) => s.setDashboardBgColor);
  const dashboardBgOpacity = useIoTStore((s) => s.dashboardBgOpacity);
  const setDashboardBgOpacity = useIoTStore((s) => s.setDashboardBgOpacity);
  const headerPosition = useIoTStore((s) => s.headerPosition);
  const setHeaderPosition = useIoTStore((s) => s.setHeaderPosition);
  const dashboardWidth = useIoTStore((s) => s.dashboardWidth);
  const setDashboardWidth = useIoTStore((s) => s.setDashboardWidth);
  const isGroupsCompactLayout = useIoTStore((s) => s.isGroupsCompactLayout);
  const setIsGroupsCompactLayout = useIoTStore((s) => s.setIsGroupsCompactLayout);
  const isSegmentsCompactLayout = useIoTStore((s) => s.isSegmentsCompactLayout);
  const setIsSegmentsCompactLayout = useIoTStore((s) => s.setIsSegmentsCompactLayout);
  const dashboardViewMode = useIoTStore((s) => s.dashboardViewMode);
  const setDashboardViewMode = useIoTStore((s) => s.setDashboardViewMode);

  return (
    <SettingsWorkspace
      animationsEnabled={animationsEnabled}
      setAnimationsEnabled={setAnimationsEnabled}
      isDark={isDark}
      accent3={accent3}
      setAccent3={setAccent3}
      accent4={accent4}
      setAccent4={setAccent4}
      selectedFont={selectedFont}
      setSelectedFont={setSelectedFont}
      animationsFps={animationsFps}
      setAnimationsFps={setAnimationsFps}
      headerAnimationType={headerAnimationType}
      setHeaderAnimationType={setHeaderAnimationType}
      headerTitle={headerTitle}
      setHeaderTitle={setHeaderTitle}
      matrixDensity={matrixDensity}
      setMatrixDensity={setMatrixDensity}
      matrixSize={matrixSize}
      setMatrixSize={setMatrixSize}
      matrixHoverSize={matrixHoverSize}
      setMatrixHoverSize={setMatrixHoverSize}
      matrixOpacity={matrixOpacity}
      setMatrixOpacity={setMatrixOpacity}
      matrixColor={matrixColor}
      setMatrixColor={setMatrixColor}
      matrixMoving={matrixMoving}
      setMatrixMoving={setMatrixMoving}
      matrixMouseEffect={matrixMouseEffect}
      setMatrixMouseEffect={setMatrixMouseEffect}
      matrixTwinkleEffect={matrixTwinkleEffect}
      setMatrixTwinkleEffect={setMatrixTwinkleEffect}
      matrixTwinkleSpeed={matrixTwinkleSpeed}
      setMatrixTwinkleSpeed={setMatrixTwinkleSpeed}
      dashboardBgColor={dashboardBgColor}
      setDashboardBgColor={setDashboardBgColor}
      dashboardBgOpacity={dashboardBgOpacity}
      setDashboardBgOpacity={setDashboardBgOpacity}
      headerPosition={headerPosition}
      setHeaderPosition={setHeaderPosition}
      dashboardWidth={dashboardWidth}
      setDashboardWidth={setDashboardWidth}
      isGroupsCompactLayout={isGroupsCompactLayout}
      setIsGroupsCompactLayout={setIsGroupsCompactLayout}
      isSegmentsCompactLayout={isSegmentsCompactLayout}
      setIsSegmentsCompactLayout={setIsSegmentsCompactLayout}
      dashboardViewMode={dashboardViewMode}
      setDashboardViewMode={setDashboardViewMode}
    />
  );
}
