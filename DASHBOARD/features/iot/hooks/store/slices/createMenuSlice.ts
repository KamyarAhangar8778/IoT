import { StateCreator } from "zustand";
import { IoTStoreState, MenuSlice } from "../types";

export const DEFAULT_SETTINGS_GROUPS_ORDER = [
  "mqtt",
  "wifi",
  "colors",
  "fonts",
  "matrix",
  "layout",
  "header-settings",
  "macros",
  "voice-commands",
  "conditions",
  "animations",
  "audio",
];

export const createMenuSlice: StateCreator<IoTStoreState, [], [], MenuSlice> = (set) => ({
  isMenuOpen: false,
  isModulesMenuOpen: false,
  isEspDrawerOpen: false,
  isAutomationsMenuOpen: false,
  activeSettingsTab: "colors",
  settingsGroupsOrder: DEFAULT_SETTINGS_GROUPS_ORDER,

  setIsMenuOpen: (o) => set({ isMenuOpen: o }),
  setIsModulesMenuOpen: (o) => set({ isModulesMenuOpen: o }),
  setIsEspDrawerOpen: (o) => set({ isEspDrawerOpen: o }),
  setIsAutomationsMenuOpen: (o) => set({ isAutomationsMenuOpen: o }),
  setActiveSettingsTab: (t) => set({ activeSettingsTab: t }),
  setSettingsGroupsOrder: (order) =>
    set((state) => ({
      settingsGroupsOrder: typeof order === "function" ? order(state.settingsGroupsOrder) : order,
    })),
});
