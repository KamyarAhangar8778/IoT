import React, { useState } from "react";
import { Settings2, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import LayoutPositionSwitcher from "../LayoutPositionSwitcher";
import LayoutColumnsSwitcher from "../LayoutColumnsSwitcher";
import QuickAccessControls from "../QuickAccessControls";
import ThemeToggle from "../ThemeToggle";
import ClockWidget from "../ClockWidget";
import HeaderZoomControls from "../HeaderZoomControls";

export default function ControlsIsland({ props }: { props: any }) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { isSidebarCollapsed } = props;

  return (
    <div className="relative flex-1 flex flex-col justify-between gap-3 overflow-hidden">
      <div className="relative z-10 flex flex-col gap-3 overflow-y-auto custom-scrollbar pr-0.5 -mr-0.5">
        <div className="space-y-3">
          <QuickAccessControls
            setIsModulesMenuOpen={props.setIsModulesMenuOpen}
            setIsMenuOpen={props.setIsMenuOpen}
            animationsEnabled={props.animationsEnabled}
            variant="vertical"
            isSidebarCollapsed={isSidebarCollapsed}
          />
        </div>

        {/* Free-Canvas Zoom Controls in Vertical Header */}
        <div className="w-full flex justify-center">
          <HeaderZoomControls variant="vertical" />
        </div>

        {isSidebarCollapsed ? (
          <div className="space-y-2.5 pt-2.5 border-t border-[var(--border-color)]/60 w-full flex flex-col items-center">
            <LayoutPositionSwitcher
              headerPosition={props.headerPosition}
              setHeaderPosition={props.setHeaderPosition}
              variant="vertical"
              isSidebarCollapsed={isSidebarCollapsed}
            />
            <LayoutColumnsSwitcher
              groupsCols={props.groupsCols}
              setGroupsCols={props.setGroupsCols}
              variant="vertical"
              isSidebarCollapsed={isSidebarCollapsed}
            />
          </div>
        ) : (
          <div className="space-y-2.5 pt-3 border-t border-[var(--border-color)]/60">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full flex items-center justify-between text-[var(--text-secondary)] md:hover:text-[var(--text-primary)] transition-colors cursor-pointer"
              title="قابلیت‌های بیشتر"
            >
              <div className="flex items-center gap-2">
                <Settings2 className="w-4 h-4" />
                <span className="text-xs font-bold">قابلیت‌های بیشتر</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showAdvanced ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {showAdvanced && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-2.5 pt-2 pb-1">
                    <LayoutPositionSwitcher
                      headerPosition={props.headerPosition}
                      setHeaderPosition={props.setHeaderPosition}
                      variant="vertical"
                      isSidebarCollapsed={isSidebarCollapsed}
                    />
                    <LayoutColumnsSwitcher
                      groupsCols={props.groupsCols}
                      setGroupsCols={props.setGroupsCols}
                      variant="vertical"
                      isSidebarCollapsed={isSidebarCollapsed}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      <div className="relative z-10 space-y-3 pt-3 border-t border-[var(--border-color)]/60 shrink-0">
        <ClockWidget variant="vertical" isSidebarCollapsed={isSidebarCollapsed} />

        <ThemeToggle
          isDark={props.isDark}
          setIsDark={props.setIsDark}
          animationsEnabled={props.animationsEnabled}
          variant="vertical"
          isSidebarCollapsed={isSidebarCollapsed}
        />
      </div>
    </div>
  );
}
