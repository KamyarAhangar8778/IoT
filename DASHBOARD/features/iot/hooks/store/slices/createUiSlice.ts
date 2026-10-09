import type { StateCreator } from "zustand";
import type { IoTStoreState, ToastItem, UiSlice } from "../types";

export const createUiSlice: StateCreator<IoTStoreState, [], [], UiSlice> = (set) => ({
  lowDataMode: false,
  toasts: [],
  toast: null,
  selectedGroupFilter: null,
  isPageVisible: true,
  isListening: false,
  voiceTranscript: "",
  activeSegmentId: null,
  activeGroupId: null,
  isLocal: false,
  localIp: null,

  setLowDataMode: (enabled) => {
    set({ lowDataMode: enabled });
  },

  showToast: (message, type = "info", options) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    const newToast: ToastItem = {
      id,
      message,
      type,
      title: options?.title,
      duration: options?.duration ?? 3500,
      timestamp: Date.now(),
    };
    set((state) => {
      const nextToasts = [newToast, ...state.toasts].slice(0, 4);
      return {
        toasts: nextToasts,
        toast: newToast,
      };
    });
  },

  clearToast: (id) => {
    set((state) => {
      if (!id) {
        return { toasts: [], toast: null };
      }
      const nextToasts = state.toasts.filter((t) => t.id !== id);
      return {
        toasts: nextToasts,
        toast: nextToasts[0] || null,
      };
    });
  },

  setSelectedGroupFilter: (group) => {
    set({ selectedGroupFilter: group });
  },

  setIsPageVisible: (visible) => {
    set({ isPageVisible: visible });
  },

  setIsListening: (b) => set({ isListening: b }),

  setVoiceTranscript: (t) => set({ voiceTranscript: t }),

  setActiveSegmentId: (id) => set({ activeSegmentId: id }),
  setActiveGroupId: (id) => set({ activeGroupId: id }),
  setIsLocal: (local) => set({ isLocal: local }),
  setLocalIp: (ip) => set({ localIp: ip }),
});
