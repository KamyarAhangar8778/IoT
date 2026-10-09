import type { StateCreator } from "zustand";
import type { IoTStoreState, SegmentsSlice } from "../types";

export const createSegmentsSlice: StateCreator<IoTStoreState, [], [], SegmentsSlice> = (set) => ({
  segments: [],
  pinsState: {},

  setSegments: (segments) => {
    set((state) => {
      const next = typeof segments === "function" ? segments(state.segments) : segments;
      return { segments: next };
    });
  },

  setPinsState: (pins) => {
    set((state) => {
      const nextPins = typeof pins === "function" ? pins(state.pinsState) : pins;
      return { pinsState: nextPins };
    });
  },

  updateSegmentMode: (id, mode) => {
    set((state) => {
      const updated = state.segments.map((seg) => (seg.id === id ? { ...seg, mode } : seg));
      return { segments: updated };
    });
  },

  updateSegmentRule: (id, rule) => {
    set((state) => {
      const updated = state.segments.map((seg) => (seg.id === id ? { ...seg, rule } : seg));
      return { segments: updated };
    });
  },

  updateSegmentLabels: (id, offLabel, onLabel) => {
    set((state) => {
      const updated = state.segments.map((seg) =>
        seg.id === id
          ? {
              ...seg,
              off_label: offLabel,
              on_label: onLabel,
              offLabel,
              onLabel,
            }
          : seg,
      );
      return { segments: updated };
    });
  },
});
