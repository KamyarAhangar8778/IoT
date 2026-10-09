import React from "react";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { motion } from "motion/react";
import LayoutPositionSwitcher from "../LayoutPositionSwitcher";
import LayoutColumnsSwitcher from "../LayoutColumnsSwitcher";
import QuickAccessControls from "../QuickAccessControls";
import ThemeToggle from "../ThemeToggle";
import ClockWidget from "../ClockWidget";
import HeaderZoomControls from "../HeaderZoomControls";

interface LeftIslandProps {
  props: any;
  isSubIslandOpen: boolean;
  setIsSubIslandOpen: (val: boolean) => void;
}

export default function LeftIsland({ props, isSubIslandOpen, setIsSubIslandOpen }: LeftIslandProps) {
  return (
    <div className="hidden md:flex flex-1 items-center justify-between gap-4 relative z-10 w-full">
      <div className="relative z-10 flex items-center flex-wrap justify-center gap-3 w-full md:w-auto">
        <LayoutPositionSwitcher
          headerPosition={props.headerPosition}
          setHeaderPosition={props.setHeaderPosition}
          variant="horizontal"
        />
        <LayoutColumnsSwitcher
          groupsCols={props.groupsCols}
          setGroupsCols={props.setGroupsCols}
          variant="horizontal"
        />

        {/* Free-Canvas Zoom Controls in Horizontal Header */}
        <HeaderZoomControls variant="horizontal" />

        <div className="flex items-center gap-2">
          <QuickAccessControls
            setIsModulesMenuOpen={props.setIsModulesMenuOpen}
            setIsMenuOpen={props.setIsMenuOpen}
            animationsEnabled={props.animationsEnabled}
            variant="horizontal"
          />
          <ThemeToggle
            isDark={props.isDark}
            setIsDark={props.setIsDark}
            animationsEnabled={props.animationsEnabled}
            variant="horizontal"
          />

          <motion.button
            type="button"
            whileHover={props.animationsEnabled ? { scale: 1.05 } : undefined}
            whileTap={props.animationsEnabled ? { scale: 0.95 } : undefined}
            onClick={() => setIsSubIslandOpen(!isSubIslandOpen)}
            className={`flex items-center justify-center w-10 h-10 rounded-xl border transition-all duration-300 relative group overflow-hidden ${
              isSubIslandOpen 
                ? "bg-[var(--accent3-transparent)] border-[var(--accent3)] text-[var(--accent3)] shadow-[0_0_12px_var(--accent3-transparent)]" 
                : "border-[var(--border-color)] bg-transparent text-[var(--text-secondary)] md:hover:text-[var(--accent3)] md:hover:border-[var(--accent3)] md:hover:bg-[var(--accent3-transparent)]"
            }`}
            title="امکانات بیشتر"
          >
            <div className="flex flex-col items-center justify-center gap-0.5">
              <SlidersHorizontal className={`w-4 h-4 transition-transform duration-300 ${isSubIslandOpen ? 'translate-y-[-2px]' : ''}`} />
              <ChevronDown className={`w-3 h-3 absolute transition-all duration-300 ${isSubIslandOpen ? 'bottom-0.5 rotate-180 opacity-100' : 'bottom-[-10px] opacity-0 md:group-hover:opacity-100 md:group-hover:bottom-0.5'}`} />
            </div>
          </motion.button>
        </div>
      </div>

      <div className="relative z-10 hidden md:block">
        <ClockWidget variant="horizontal" />
      </div>
    </div>
  );
}
