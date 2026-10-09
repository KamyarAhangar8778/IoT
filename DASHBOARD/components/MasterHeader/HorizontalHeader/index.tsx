import React, { useState } from "react";
import { MasterHeaderProps } from "../types";
import BrandBox from "../BrandBox";
import { motion, AnimatePresence } from "motion/react";
import LeftIsland from "./LeftIsland";
import HeaderIslandPattern from "../HeaderIslandPattern";

export default function HorizontalHeader(props: MasterHeaderProps) {
  const [isSubIslandOpen, setIsSubIslandOpen] = useState(false);

  return (
    <header className="w-full flex flex-col gap-3 relative z-30 text-right font-sans" dir="rtl">
      <div
        id="horizontal-master-header"
        className="relative group w-full bg-[var(--card-bg-solid)]/90 backdrop-blur-md border border-[var(--border-color)] px-5 py-3.5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-300 shadow-sm md:hover:border-[var(--accent3)]/50"
      >
        <HeaderIslandPattern variant="horizontal" />
        {props.animationsEnabled && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-20 opacity-60" xmlns="http://www.w3.org/2000/svg">
            <rect 
              x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)" 
              rx="14" ry="14" 
              fill="none" 
              stroke="var(--accent3)" 
              strokeWidth="1.5" 
              pathLength="100"
              strokeDasharray="15 85"
              className="animate-[svg-border-spin_10s_linear_infinite]"
            />
          </svg>
        )}

        <BrandBox
          headerTitle={props.headerTitle}
          variant="horizontal"
          isDark={props.isDark}
          setIsDark={props.setIsDark}
          animationsEnabled={props.animationsEnabled}
          setIsModulesMenuOpen={props.setIsModulesMenuOpen}
          setIsMenuOpen={props.setIsMenuOpen}
          groupsCols={props.groupsCols}
          setGroupsCols={props.setGroupsCols}
          groupsOrder={props.groupsOrder}
          selectedGroupFilter={props.selectedGroupFilter}
          setSelectedGroupFilter={props.setSelectedGroupFilter}
        />

        <div className="hidden md:block h-8 w-px bg-[var(--border-color)] opacity-60 shrink-0" />

        <LeftIsland 
          props={props} 
          isSubIslandOpen={isSubIslandOpen} 
          setIsSubIslandOpen={setIsSubIslandOpen} 
        />
      </div>

      <AnimatePresence>
        {isSubIslandOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0, y: -10 }}
            animate={{ height: "auto", opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full bg-[var(--card-bg-solid)]/90 backdrop-blur-md border border-[var(--border-color)] px-5 py-3 rounded-2xl shadow-sm flex items-center justify-between gap-4 overflow-hidden relative"
          >
            <HeaderIslandPattern variant="horizontal" />
            <div className="relative z-10 w-full">
              {/* Extra features container */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
