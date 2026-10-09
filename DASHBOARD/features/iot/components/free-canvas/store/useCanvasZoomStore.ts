import { create } from "zustand";
import { CanvasTransform } from "../core/types";
import { DEFAULT_CANVAS_TRANSFORM, CANVAS_BOUNDS } from "../core/constants";

interface CanvasZoomState {
  scale: number;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  setScale: (scale: number) => void;
  registeredZoomIn: (() => void) | null;
  registeredZoomOut: (() => void) | null;
  registeredReset: (() => void) | null;
  registerActions: (actions: {
    zoomIn: () => void;
    zoomOut: () => void;
    reset: () => void;
    scale: number;
  }) => void;
  syncScale: (scale: number) => void;
}

/**
 * Global store for Free-Canvas Zoom & Transform state,
 * enabling Header controls to seamlessly interact with the Canvas viewport.
 */
export const useCanvasZoomStore = create<CanvasZoomState>((set, get) => ({
  scale: 1,
  registeredZoomIn: null,
  registeredZoomOut: null,
  registeredReset: null,

  registerActions: ({ zoomIn, zoomOut, reset, scale }) => {
    set({
      registeredZoomIn: zoomIn,
      registeredZoomOut: zoomOut,
      registeredReset: reset,
      scale,
    });
  },

  syncScale: (scale) => set({ scale }),

  setScale: (scale) => set({ scale }),

  zoomIn: () => {
    const fn = get().registeredZoomIn;
    if (fn) {
      fn();
    } else {
      set((s) => ({
        scale: Math.min(CANVAS_BOUNDS.maxScale, +(s.scale + CANVAS_BOUNDS.step).toFixed(2)),
      }));
    }
  },

  zoomOut: () => {
    const fn = get().registeredZoomOut;
    if (fn) {
      fn();
    } else {
      set((s) => ({
        scale: Math.max(CANVAS_BOUNDS.minScale, +(s.scale - CANVAS_BOUNDS.step).toFixed(2)),
      }));
    }
  },

  resetZoom: () => {
    const fn = get().registeredReset;
    if (fn) {
      fn();
    } else {
      set({ scale: 1 });
    }
  },
}));
