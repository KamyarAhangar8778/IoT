import { CanvasBounds, CanvasTransform } from "./types";

/**
 * Default configuration constants for the Free Canvas engine.
 */
export const DEFAULT_CANVAS_TRANSFORM: CanvasTransform = {
  x: 0,
  y: 0,
  scale: 1,
};

export const CANVAS_BOUNDS: CanvasBounds = {
  minScale: 0.4,
  maxScale: 2.0,
  step: 0.1,
};

export const CANVAS_GRID_CONFIG = {
  spacing: 32,
  dotRadius: 1.5,
  defaultWidth: "100%",
  defaultHeight: "100%",
};
