import React from "react";
import { MasterHeaderProps } from "../types";
import BrandBox from "../BrandBox";
import ControlsIsland from "./ControlsIsland";
import HeaderIslandPattern from "../HeaderIslandPattern";

export default function VerticalHeader(props: MasterHeaderProps) {
  const { isSidebarCollapsed, animationsEnabled } = props;

  return (
    <header
      id="vertical-master-header"
      className={`w-full h-full flex flex-col justify-stretch text-right font-sans bg-[var(--card-bg-solid)]/95 backdrop-blur-md border-r border-[var(--border-color)] ${
        isSidebarCollapsed ? "px-1.5 py-3" : "px-3.5 py-4"
      } shadow-sm transition-all duration-350 overflow-hidden relative`}
      dir="rtl"
    >
      <HeaderIslandPattern variant="vertical" />
      
      {animationsEnabled && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-20 opacity-60"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="1"
            y="1"
            width="calc(100% - 2px)"
            height="calc(100% - 2px)"
            fill="none"
            stroke="var(--accent3)"
            strokeWidth="1.5"
            pathLength="100"
            strokeDasharray="15 85"
            className="animate-[svg-border-spin_10s_linear_infinite]"
          />
        </svg>
      )}

      <div className="relative z-10 flex flex-col h-full justify-stretch gap-3">
        <BrandBox 
          headerTitle={props.headerTitle} 
          variant="vertical" 
          animationsEnabled={props.animationsEnabled}
          groupsOrder={props.groupsOrder}
          selectedGroupFilter={props.selectedGroupFilter}
          setSelectedGroupFilter={props.setSelectedGroupFilter}
          isSidebarCollapsed={props.isSidebarCollapsed}
          setIsSidebarCollapsed={props.setIsSidebarCollapsed}
        />

        <div className="w-full h-px bg-[var(--border-color)] opacity-40 shrink-0 my-1" />

        <ControlsIsland props={props} />
      </div>
    </header>
  );
}
