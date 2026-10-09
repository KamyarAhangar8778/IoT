/**
 * @file ModulesDrawerInner.tsx
 * @description Inner panel layout for ModulesDrawer matching SettingsDrawer architectural pattern.
 */

import React, { forwardRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import DrawerHeader from "./DrawerHeader";
import { ModulesTabsSlider } from "./ModulesTabsSlider";
import { ModulesTabContent } from "./ModulesTabContent";
import { ModulesFooter } from "./ModulesFooter";
import { ModulesDrawerProps } from "../core/types";

const ModulesDrawerInner = forwardRef<
  HTMLDivElement,
  Omit<ModulesDrawerProps, "isOpen" | "isDark"> & { isDark?: boolean }
>(
  (
    {
      onClose,
      onAddSegment,
      segments,
      onRemoveSegment,
      animationsEnabled = true,
      accent3,
      accent4,
      isDark = false,
    },
    ref
  ) => {
    const [activeTab, setActiveTab] = useState<string>("add");

    return (
      <motion.div
        ref={ref}
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ type: "spring", damping: 24, stiffness: 200 }}
        className="fixed top-0 left-0 h-full w-full max-w-sm bg-gradient-to-b from-[var(--drawer-gradient-from)] to-[var(--drawer-gradient-to)] border-r border-accent3-medium rounded-r-[2.5rem] shadow-2xl z-50 overflow-y-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none] px-6 py-8 text-right flex flex-col justify-between transition-colors duration-500 font-sans"
        dir="rtl"
      >
        <div className="space-y-6">
          <DrawerHeader onClose={onClose} animationsEnabled={animationsEnabled} />

          <ModulesTabsSlider
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
                <ModulesTabContent
                  activeTab={activeTab}
                  onAddSegment={onAddSegment}
                  onClose={onClose}
                  segments={segments}
                  onRemoveSegment={onRemoveSegment}
                  animationsEnabled={animationsEnabled}
                  accent3={accent3}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <ModulesFooter />
      </motion.div>
    );
  }
);

ModulesDrawerInner.displayName = "ModulesDrawerInner";

export default ModulesDrawerInner;
