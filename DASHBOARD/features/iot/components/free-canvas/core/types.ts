/**
 * @file types.ts
 * @description Type definitions for the 2D Free Canvas (N8N-style) engine.
 */

export interface CanvasPosition {
  x: number;
  y: number;
}

export interface CanvasTransform {
  x: number;
  y: number;
  scale: number;
}

export interface CanvasBounds {
  minScale: number;
  maxScale: number;
  step: number;
}

export interface CanvasControlsProps {
  scale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  className?: string;
}

export interface CanvasGridBackgroundProps {
  transform: CanvasTransform;
  dotSize?: number;
  gridSpacing?: number;
  className?: string;
}

export interface CanvasViewportProps {
  children: React.ReactNode;
  className?: string;
}
