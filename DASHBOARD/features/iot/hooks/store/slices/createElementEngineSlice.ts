/**
 * @file createElementEngineSlice.ts
 * @description Zustand slice for Element Engine state management
 */

import { StateCreator } from "zustand";
import { IoTStoreState, ElementEngineSlice } from "../types";
import {
  ElementEngineConfig,
  DEFAULT_ELEMENT_CONFIG,
  setRegistryValue,
  parseElementProtocol,
  BUILTIN_PRESETS,
} from "@/features/iot/engine";

export const createElementEngineSlice: StateCreator<IoTStoreState, [], [], ElementEngineSlice> = (set) => ({
  elementConfig: DEFAULT_ELEMENT_CONFIG,
  activeElementPreset: "default-standard",
  elementValidationErrors: [],

  setElementConfig: (config) =>
    set((state) => ({
      elementConfig: typeof config === "function" ? config(state.elementConfig) : config,
    })),

  updateRegistryValue: (keyPath, value) =>
    set((state) => ({
      elementConfig: setRegistryValue(state.elementConfig, keyPath, value),
    })),

  applyElementPreset: (presetId) =>
    set(() => {
      const preset = BUILTIN_PRESETS[presetId] || DEFAULT_ELEMENT_CONFIG;
      return {
        elementConfig: preset,
        activeElementPreset: presetId,
        elementValidationErrors: [],
      };
    }),

  importElementProtocolJSON: (jsonString) => {
    const parseResult = parseElementProtocol(jsonString);
    if (parseResult.success && parseResult.config) {
      set({
        elementConfig: parseResult.config,
        activeElementPreset: "custom",
        elementValidationErrors: [],
      });
      return { success: true };
    }
    set({
      elementValidationErrors: parseResult.errors || ["فایل نامعتبر است."],
    });
    return { success: false, errors: parseResult.errors };
  },

  resetElementConfig: () =>
    set({
      elementConfig: DEFAULT_ELEMENT_CONFIG,
      activeElementPreset: "default-standard",
      elementValidationErrors: [],
    }),
});
