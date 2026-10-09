"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { SETTINGS_TABS } from "./types";
import { WidgetIcon } from "@/components/icons";

interface TabActiveLabelProps {
  activeTab: string;
  isDark: boolean;
}

const TAB_ICON_MAP: Record<string, string> = {
  layout: "Layers",
  wifi: "Wifi",
  conditions: "Settings",
  colors: "Sun",
  fonts: "Book",
  animations: "Activity",
  macros: "Play",
  "voice-commands": "Mic",
  "header-settings": "Menu",
  matrix: "Sparkles",
  audio: "Music",
  mqtt: "Radio",
};

export function TabActiveLabel({ activeTab, isDark }: TabActiveLabelProps) {
  const currIndex = SETTINGS_TABS.findIndex((t) => t.id === activeTab);
  const tab = SETTINGS_TABS[currIndex];

  return (
    <div className="col-span-6 flex flex-col items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, scale: 0.95, y: 5 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -5 }}
          transition={{ duration: 0.15 }}
          className="flex flex-col items-center gap-0.5 w-full"
        >
          <div className="flex items-center gap-1.5 justify-center w-full max-w-full">
            <WidgetIcon
              icon={TAB_ICON_MAP[activeTab] || "Settings"}
              className={`w-4 h-4 shrink-0 ${isDark ? "text-accent4" : "text-accent3"}`}
            />
            <span
              className={`font-sans font-extrabold text-[12px] truncate leading-normal ${
                isDark ? "text-[var(--accent3)]" : "text-slate-800"
              }`}
              style={isDark ? { color: "var(--accent3)" } : {}}
            >
              {tab ? tab.title : ""}
            </span>
          </div>
          <span
            className={`text-[9px] font-sans font-medium line-clamp-1 opacity-80 ${
              isDark ? "theme-text-muted" : "text-slate-500"
            }`}
          >
            {tab ? tab.compactTitle : ""}
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
