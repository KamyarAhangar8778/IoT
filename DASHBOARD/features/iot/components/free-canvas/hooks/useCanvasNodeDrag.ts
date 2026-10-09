import { useState, useRef, useCallback, useEffect } from "react";
import { useCanvasZoomStore } from "../store/useCanvasZoomStore";

interface UseCanvasNodeDragOptions {
  /** Unique identifier of the canvas node (e.g., group name) */
  id: string;
  /** Current X coordinate on the canvas */
  initialX: number;
  /** Current Y coordinate on the canvas */
  initialY: number;
  /** Callback fired when dragging completes to persist the final coordinates */
  onPositionSave: (id: string, x: number, y: number) => void;
}

/**
 * Custom hook providing smooth, scale-aware 2D drag capabilities for canvas nodes.
 * Allows independent spatial translation of groups without displacing neighboring nodes.
 *
 * @param options Configuration options including ID, initial coordinates, and save callback.
 * @returns Node coordinates, dragging state, and pointer event listeners.
 */
export function useCanvasNodeDrag({
  id,
  initialX,
  initialY,
  onPositionSave,
}: UseCanvasNodeDragOptions) {
  const [pos, setPos] = useState({ x: initialX, y: initialY });
  const [isDragging, setIsDragging] = useState(false);

  const isDraggingRef = useRef(false);
  isDraggingRef.current = isDragging;

  const dragRef = useRef({
    startX: 0,
    startY: 0,
    originX: initialX,
    originY: initialY,
    currentX: initialX,
    currentY: initialY,
  });

  // Keep internal coordinates synchronized with external updates when not dragging
  useEffect(() => {
    if (!isDraggingRef.current) {
      setPos({ x: initialX, y: initialY });
      dragRef.current.originX = initialX;
      dragRef.current.originY = initialY;
      dragRef.current.currentX = initialX;
      dragRef.current.currentY = initialY;
    }
  }, [initialX, initialY]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      // Allow only primary (left) button
      if (e.button !== 0) return;
      e.stopPropagation();

      const target = e.currentTarget as HTMLElement;
      try {
        target.setPointerCapture(e.pointerId);
      } catch {}

      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        originX: pos.x,
        originY: pos.y,
        currentX: pos.x,
        currentY: pos.y,
      };

      setIsDragging(true);
    },
    [pos.x, pos.y]
  );

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    e.stopPropagation();

    const scale = useCanvasZoomStore.getState().scale || 1;
    const dx = (e.clientX - dragRef.current.startX) / scale;
    const dy = (e.clientY - dragRef.current.startY) / scale;

    const newX = Math.round(dragRef.current.originX + dx);
    const newY = Math.round(dragRef.current.originY + dy);

    dragRef.current.currentX = newX;
    dragRef.current.currentY = newY;
    setPos({ x: newX, y: newY });
  }, []);

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!isDraggingRef.current) return;
      e.stopPropagation();

      const target = e.currentTarget as HTMLElement;
      try {
        target.releasePointerCapture(e.pointerId);
      } catch {}

      setIsDragging(false);
      onPositionSave(id, dragRef.current.currentX, dragRef.current.currentY);
    },
    [id, onPositionSave]
  );

  return {
    x: pos.x,
    y: pos.y,
    isDragging,
    dragListeners: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      onPointerCancel: handlePointerUp,
    },
    dragAttributes: {
      "data-canvas-draggable": "true",
      style: {
        touchAction: "none",
      },
    },
  };
}
