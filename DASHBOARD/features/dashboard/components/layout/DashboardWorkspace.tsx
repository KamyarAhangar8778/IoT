"use client";

import { AnimatePresence, motion } from "motion/react";
import React from "react";
import { useDashboard } from "@/features/dashboard/context/DashboardContext";
import AutomationsWorkspace from "@/features/iot/components/automations-workspace";
import IoTWorkspace from "@/features/iot/components/IoTWorkspace";
import ModulesWorkspace from "@/features/iot/components/modules-workspace";
import WelcomePortal from "@/features/iot/components/welcome-portal";
import { WorkspaceSkeleton } from "@/features/iot/components/workspace";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";
import { useDashboardLayout } from "../../hooks/useDashboardLayout";
import { useWorkspaceSwipe } from "../../hooks/useWorkspaceSwipe";
import MacroSidebar from "../widgets/MacroSidebar";
import SettingsWorkspaceConnected from "./SettingsWorkspaceConnected";

/**
 * Main interactive workspace component.
 * Dynamically switches between IoT workspace (vertical grid or full-screen canvas),
 * settings workspace, modules manager, or automations builder.
 */
export default function DashboardWorkspace() {
  const {
    sensors,
    isLoadingIoT,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleGroupColsChange,
    handleAddSegment,
    handleAddPlaceholder,
    handleRemoveGroup,
    handleRemoveSegment,
    handleTogglePin,
    handleSetPinState,
    handleUpdateSegmentMode,
    handleUpdateSegmentAutoOff,
    handleUpdateSegmentRule,
    handleSetupPlaceholder,
    isFullyReady,
  } = useDashboard();

  const isMenuOpen = useIoTStore((s) => s.isMenuOpen);
  const isModulesMenuOpen = useIoTStore((s) => s.isModulesMenuOpen);
  const setIsModulesMenuOpen = useIoTStore((s) => s.setIsModulesMenuOpen);
  const isAutomationsMenuOpen = useIoTStore((s) => s.isAutomationsMenuOpen);
  const setIsAutomationsMenuOpen = useIoTStore((s) => s.setIsAutomationsMenuOpen);
  const segments = useIoTStore((s) => s.segments);
  const isDark = useIoTStore((s) => s.isDark);
  const accent3 = useIoTStore((s) => s.accent3);
  const accent4 = useIoTStore((s) => s.accent4);
  const setIsMenuOpen = useIoTStore((s) => s.setIsMenuOpen);
  const animationsEnabled = useIoTStore((s) => s.animationsEnabled);
  const headerPosition = useIoTStore((s) => s.headerPosition);
  const dashboardWidth = useIoTStore((s) => s.dashboardWidth);
  const isGroupsCompactLayout = useIoTStore((s) => s.isGroupsCompactLayout);
  const isSegmentsCompactLayout = useIoTStore((s) => s.isSegmentsCompactLayout);
  const dashboardViewMode = useIoTStore((s) => s.dashboardViewMode);
  const activeSegmentId = useIoTStore((s) => s.activeSegmentId);
  const activeGroupId = useIoTStore((s) => s.activeGroupId);
  const selectedGroupFilter = useIoTStore((s) => s.selectedGroupFilter);
  const setSelectedGroupFilter = useIoTStore((s) => s.setSelectedGroupFilter);
  const groupsOrder = useIoTStore((s) => s.groupsOrder);
  const groupsCols = useIoTStore((s) => s.groupsCols);
  const groupConfigs = useIoTStore((s) => s.groupConfigs);

  const isFreeCanvas = dashboardViewMode === "free_canvas";
  const { onTouchStart, onTouchMove, onTouchEnd } = useWorkspaceSwipe(
    selectedGroupFilter,
    setSelectedGroupFilter,
    groupsOrder
  );
  const { innerWidthClass, outerWidthClass } = useDashboardLayout(dashboardWidth);
  const isLeftHeader = headerPosition === "left";

  if (!isFullyReady) {
    return (
      <div className="w-full flex flex-col gap-4">
        <WorkspaceSkeleton groupsCols={groupsCols} />
      </div>
    );
  }

  // Free-Canvas Fullscreen Mode (Direct edge-to-edge canvas plane)
  if (isFreeCanvas && !isMenuOpen && !isModulesMenuOpen && !isAutomationsMenuOpen && segments.length > 0) {
    return (
      <div className="fixed inset-0 w-full h-full z-0 overflow-hidden">
        <IoTWorkspace
          sensors={sensors}
          groupsOrder={groupsOrder}
          groupsCols={groupsCols}
          groupConfigs={groupConfigs}
          isLoadingIoT={isLoadingIoT}
          activeSegmentId={activeSegmentId}
          activeGroupId={activeGroupId}
          animationsEnabled={animationsEnabled}
          selectedGroupFilter={selectedGroupFilter}
          isGroupsCompactLayout={isGroupsCompactLayout}
          isSegmentsCompactLayout={isSegmentsCompactLayout}
          dashboardWidth={dashboardWidth}
          dashboardViewMode={dashboardViewMode}
          handleDragStart={handleDragStart}
          handleDragOver={handleDragOver}
          handleDragEnd={handleDragEnd}
          handleGroupColsChange={handleGroupColsChange}
          handleAddPlaceholder={handleAddPlaceholder}
          handleRemoveGroup={handleRemoveGroup}
          handleRemoveSegment={handleRemoveSegment}
          handleTogglePin={handleTogglePin}
          handleSetPinState={handleSetPinState}
          handleUpdateSegmentMode={handleUpdateSegmentMode}
          handleUpdateSegmentAutoOff={handleUpdateSegmentAutoOff}
          handleUpdateSegmentRule={handleUpdateSegmentRule}
          handleSetupPlaceholder={handleSetupPlaceholder}
        />
      </div>
    );
  }

  return (
    <div
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className={`w-full flex flex-col ${outerWidthClass} mx-auto transition-all duration-500`}
    >
      <main
        className={`flex-1 flex flex-col justify-center items-center text-center ${innerWidthClass} mx-auto space-y-8 py-4 w-full relative transition-all duration-500`}
      >
        <AnimatePresence mode="wait">
          {isMenuOpen ? (
            <motion.div
              key="settings-workspace-mode"
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="w-full"
            >
              <SettingsWorkspaceConnected />
            </motion.div>
          ) : isModulesMenuOpen ? (
            <motion.div
              key="modules-workspace-mode"
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="w-full"
            >
              <ModulesWorkspace
                onClose={() => setIsModulesMenuOpen(false)}
                onAddSegment={handleAddSegment}
                segments={segments}
                onRemoveSegment={handleRemoveSegment}
                animationsEnabled={animationsEnabled}
                accent3={accent3}
              />
            </motion.div>
          ) : isAutomationsMenuOpen ? (
            <motion.div
              key="automations-workspace-mode"
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="w-full"
            >
              <AutomationsWorkspace onClose={() => setIsAutomationsMenuOpen(false)} />
            </motion.div>
          ) : segments.length === 0 ? (
            <motion.div
              key="welcome-portal-mode"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <React.Suspense fallback={<div className="w-full h-96 flex items-center justify-center" />}>
                <WelcomePortal
                  setIsMenuOpen={setIsMenuOpen}
                  setIsModulesMenuOpen={setIsModulesMenuOpen}
                  accent3={accent3}
                  accent4={accent4}
                  animationsEnabled={animationsEnabled}
                  isDark={isDark}
                />
              </React.Suspense>
            </motion.div>
          ) : (
            <motion.div
              key="home-workspace-mode"
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="w-full flex flex-col gap-4"
            >
              <IoTWorkspace
                sensors={sensors}
                groupsOrder={groupsOrder}
                groupsCols={groupsCols}
                groupConfigs={groupConfigs}
                isLoadingIoT={isLoadingIoT}
                activeSegmentId={activeSegmentId}
                activeGroupId={activeGroupId}
                animationsEnabled={animationsEnabled}
                selectedGroupFilter={selectedGroupFilter}
                isGroupsCompactLayout={isGroupsCompactLayout}
                isSegmentsCompactLayout={isSegmentsCompactLayout}
                dashboardWidth={dashboardWidth}
                dashboardViewMode={dashboardViewMode}
                handleDragStart={handleDragStart}
                handleDragOver={handleDragOver}
                handleDragEnd={handleDragEnd}
                handleGroupColsChange={handleGroupColsChange}
                handleAddPlaceholder={handleAddPlaceholder}
                handleRemoveGroup={handleRemoveGroup}
                handleRemoveSegment={handleRemoveSegment}
                handleTogglePin={handleTogglePin}
                handleSetPinState={handleSetPinState}
                handleUpdateSegmentMode={handleUpdateSegmentMode}
                handleUpdateSegmentAutoOff={handleUpdateSegmentAutoOff}
                handleUpdateSegmentRule={handleUpdateSegmentRule}
                handleSetupPlaceholder={handleSetupPlaceholder}
              />

              <div className="w-full flex justify-center mt-6 pt-2">
                <React.Suspense fallback={<div className="h-12 w-full" />}>
                  <MacroSidebar />
                </React.Suspense>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
