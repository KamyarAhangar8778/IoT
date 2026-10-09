/**
 * @file AutomationsDrawer.tsx
 * @description Main AutomationsDrawer panel matching SettingsDrawer design system and architecture.
 */

"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AutomationsDrawerProps } from "./types";
import { useAutomationForm } from "./hooks/useAutomationForm";
import { AutomationsHeader } from "./AutomationsHeader";
import { AutomationsTabsSlider } from "./AutomationsTabsSlider";
import { AutomationsTabContent } from "./AutomationsTabContent";
import { AutomationsFooter } from "./AutomationsFooter";

export default function AutomationsDrawer({
  isOpen,
  onClose,
  isDark,
  accent3 = "var(--accent3)",
  accent4 = "var(--accent4)",
  animationsEnabled = true,
}: AutomationsDrawerProps) {
  const [activeTab, setActiveTab] = useState<string>("add");
  const formHook = useAutomationForm();

  const backdropBackground = isDark
    ? `radial-gradient(circle at center, ${accent3}15 0%, ${accent4}08 50%, rgba(5,6,9,0.65) 100%)`
    : `radial-gradient(circle at center, ${accent3}0a 0%, ${accent4}05 50%, rgba(244,245,247,0.7) 100%)`;

  const backdropStyle: React.CSSProperties = {
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    background: backdropBackground,
    transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="automations-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={backdropStyle}
          className="fixed inset-0 z-50 cursor-pointer"
        />
      )}
      {isOpen && (
        <motion.div
          key="automations-panel"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 24, stiffness: 200 }}
          className="fixed top-0 right-0 h-full w-full max-w-sm bg-gradient-to-b from-[var(--drawer-gradient-from)] to-[var(--drawer-gradient-to)] border-l border-accent3-medium rounded-l-[2.5rem] shadow-2xl z-50 overflow-y-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none] px-6 py-8 text-right flex flex-col justify-between transition-colors duration-500"
          dir="rtl"
        >
          <div className="space-y-6">
            <AutomationsHeader onClose={onClose} animationsEnabled={animationsEnabled} />

            <AutomationsTabsSlider
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              animationsEnabled={animationsEnabled}
              isDark={isDark}
            />

            <div className="space-y-4 pt-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.2 }}
                >
                  <AutomationsTabContent activeTab={activeTab} formHook={formHook} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <AutomationsFooter />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
