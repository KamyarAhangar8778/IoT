import React, { useCallback } from "react";
import { CanvasViewport } from "./CanvasViewport";
import { CanvasGroupNode } from "./CanvasGroupNode";
import { IoTWorkspaceProps } from "../../workspace/core/types";
import { useWorkspaceGrid } from "../../workspace/hooks/useWorkspaceGrid";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";

type FreeCanvasGridProps = Omit<
  IoTWorkspaceProps,
  | "sensors"
  | "handleDragStart"
  | "handleDragOver"
  | "handleDragEnd"
  | "activeSegmentId"
  | "activeGroupId"
>;

/**
 * Free-Canvas view mode rendering independently positionable 2D spatial groups
 * on an infinite pan/zoom canvas. Custom group coordinates are automatically saved to Cloudflare.
 */
export function FreeCanvasGrid({
  groupsOrder,
  groupsCols: initialGroupsCols,
  groupConfigs,
  isLoadingIoT,
  animationsEnabled = true,
  selectedGroupFilter,
  handleGroupColsChange,
  handleAddPlaceholder,
  handleRemoveGroup,
  handleRemoveSegment,
  handleTogglePin,
  handleSetPinState,
  handleUpdateSegmentMode,
  handleUpdateSegmentAutoOff,
  handleUpdateSegmentRule,
  handleSetupPlaceholder,
  isSegmentsCompactLayout,
  dashboardWidth = 1,
}: FreeCanvasGridProps) {
  const { filteredGroupsOrder } = useWorkspaceGrid({
    groupsOrder,
    initialGroupsCols,
    selectedGroupFilter,
  });

  const setGroupConfigs = useIoTStore((s) => s.setGroupConfigs);

  const handlePositionSave = useCallback(
    (groupId: string, x: number, y: number) => {
      setGroupConfigs((prev) => ({
        ...prev,
        [groupId]: {
          ...prev[groupId],
          x,
          y,
        },
      }));
    },
    [setGroupConfigs]
  );

  return (
    <CanvasViewport className="w-full h-full bg-[var(--bg-main)]">
      <div className="relative w-[5000px] h-[5000px] pointer-events-auto">
        {filteredGroupsOrder.map((groupName, index) => (
          <CanvasGroupNode
            key={groupName}
            groupName={groupName}
            index={index}
            groupConfigs={groupConfigs}
            handleGroupColsChange={handleGroupColsChange}
            handleAddPlaceholder={handleAddPlaceholder}
            handleRemoveGroup={handleRemoveGroup}
            animationsEnabled={animationsEnabled}
            isSegmentsCompactLayout={isSegmentsCompactLayout}
            onPositionSave={handlePositionSave}
            segmentProps={{
              onRemove: handleRemoveSegment,
              onTogglePin: handleTogglePin,
              onSetPinState: handleSetPinState,
              onUpdateSegmentMode: handleUpdateSegmentMode,
              onUpdateSegmentAutoOff: handleUpdateSegmentAutoOff,
              onUpdateSegmentRule: handleUpdateSegmentRule,
              isLoadingIoT,
              onSetupPlaceholder: handleSetupPlaceholder,
              dashboardWidth,
            }}
          />
        ))}
      </div>
    </CanvasViewport>
  );
}
