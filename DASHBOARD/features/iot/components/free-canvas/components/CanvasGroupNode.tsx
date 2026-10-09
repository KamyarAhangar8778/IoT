import React, { useCallback, useMemo } from "react";
import SortableGroup from "../../SortableGroup";
import SortableSegmentCard from "../../SortableSegmentCard";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";
import { useShallow } from "zustand/react/shallow";
import { useCanvasNodeDrag } from "../hooks/useCanvasNodeDrag";

const GROUP_WIDTH_LUT: Record<number, string> = {
  1: "380px",
  2: "680px",
  3: "980px",
};

interface CanvasSegmentCardProps {
  segmentId: string;
  [key: string]: any;
}

const CanvasSegmentCard = React.memo((props: any) => {
  const segment = useIoTStore(
    useCallback((s) => s.segments.find((seg) => seg.id === props.segmentId), [props.segmentId])
  );
  if (!segment) return null;
  return <SortableSegmentCard {...props} segment={segment} />;
});

interface CanvasGroupNodeProps {
  groupName: string;
  index: number;
  groupConfigs: Record<string, any>;
  handleGroupColsChange: (groupId: string, cols: number) => void;
  handleAddPlaceholder: (groupId: string) => void;
  handleRemoveGroup: (groupId: string) => void;
  animationsEnabled: boolean;
  isSegmentsCompactLayout?: boolean;
  segmentProps: any;
  onPositionSave: (groupId: string, x: number, y: number) => void;
}

/**
 * Renders an independent, freely-draggable 2D spatial group node on the canvas plane.
 * Moving this node alters only its individual (x, y) coordinates and persists them to Cloudflare.
 */
export const CanvasGroupNode = React.memo(function CanvasGroupNode({
  groupName,
  index,
  groupConfigs,
  handleGroupColsChange,
  handleAddPlaceholder,
  handleRemoveGroup,
  animationsEnabled,
  isSegmentsCompactLayout,
  segmentProps,
  onPositionSave,
}: CanvasGroupNodeProps) {
  const segmentIds = useIoTStore(
    useShallow((state) =>
      state.segments.filter((seg) => (seg.group || "Test") === groupName).map((seg) => seg.id)
    )
  );

  const config = groupConfigs[groupName];
  const maxCols = config?.maxCols || 2;

  // Default coordinate if not yet saved: clean 3-column spatial layout
  const defaultX = useMemo(() => 40 + (index % 3) * 440, [index]);
  const defaultY = useMemo(() => 40 + Math.floor(index / 3) * 620, [index]);

  const initialX = config?.x !== undefined ? config.x : defaultX;
  const initialY = config?.y !== undefined ? config.y : defaultY;

  const { x, y, isDragging, dragListeners, dragAttributes } = useCanvasNodeDrag({
    id: groupName,
    initialX,
    initialY,
    onPositionSave,
  });

  const cardWidth = GROUP_WIDTH_LUT[maxCols] || GROUP_WIDTH_LUT[1];

  return (
    <div
      data-canvas-node="true"
      style={{
        position: "absolute",
        left: `${x}px`,
        top: `${y}px`,
        width: cardWidth,
        zIndex: isDragging ? 40 : 10,
      }}
      className={`select-none transition-shadow ${
        isDragging ? "shadow-2xl opacity-95 cursor-grabbing" : "shadow-md"
      }`}
    >
      <SortableGroup
        id={groupName}
        items={segmentIds}
        segmentCount={segmentIds.length}
        maxCols={maxCols}
        icon={config?.icon}
        onColsChange={(cols: number) => handleGroupColsChange(groupName, cols)}
        onAddPlaceholder={handleAddPlaceholder}
        onDeleteGroup={handleRemoveGroup}
        parentGroupsCols={1}
        animationsEnabled={animationsEnabled}
        isSegmentsCompactLayout={isSegmentsCompactLayout}
        isFreeCanvas={true}
        customDragListeners={dragListeners}
        customDragAttributes={dragAttributes}
      >
        {segmentIds.map((id: string, sIndex: number) => (
          <CanvasSegmentCard
            {...segmentProps}
            key={id}
            segmentId={id}
            index={sIndex}
            groupItemsCount={segmentIds.length}
            parentGroupsCols={1}
            groupMaxCols={maxCols}
            animationsEnabled={animationsEnabled}
            isMobilePortrait={false}
          />
        ))}
      </SortableGroup>
    </div>
  );
});
