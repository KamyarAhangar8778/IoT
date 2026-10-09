"use client";

import { AnimatePresence } from "motion/react";
import { WidgetIcon } from "@/components/icons";
import { useMediaQuery } from "@/features/iot/hooks/useMediaQuery";
import { useGroupHeaderLayout } from "../hooks/useGroupHeaderLayout";
import GroupActions from "./GroupActions";
import GroupPattern from "./GroupPattern";
import GroupSettingsMenu from "./GroupSettingsMenu";
import LayoutSelector from "./LayoutSelector";

interface GroupHeaderProps {
  id: string;
  segmentCount: number;
  maxCols: number;
  icon?: string;
  onColsChange: (cols: number) => void;
  onAddPlaceholder: (groupId: string) => void;
  onDeleteGroup: (groupId: string) => void;
  parentGroupsCols: number;
  attributes: any;
  listeners: any;
}

export default function GroupHeader({
  id,
  segmentCount,
  maxCols,
  icon,
  onColsChange,
  onAddPlaceholder,
  onDeleteGroup,
  parentGroupsCols,
  attributes,
  listeners,
}: GroupHeaderProps) {
  const isMobile = useMediaQuery("(max-width: 639px)");
  const {
    isCompact,
    isSettingsOpen,
    setIsSettingsOpen,
    titleContainerRef,
    titleTextRef,
    buttonRef,
    menuRef,
  } = useGroupHeaderLayout();

  return (
    <div
      className={`flex items-stretch justify-between w-full gap-2 sm:gap-4 relative pointer-events-none ${isSettingsOpen ? "z-[100]" : "z-10"}`}
    >
      {/* Right Part: Title and Layout Selector */}
      <div
        data-group-menu-open={isSettingsOpen ? "true" : undefined}
        className={`flex items-center justify-between flex-1 min-w-0 pointer-events-auto bg-[var(--card-bg)] backdrop-blur-md border border-[var(--border-color)] shadow-sm rounded-2xl relative transition-all duration-300 ${isSettingsOpen ? "z-[100]" : ""} ${parentGroupsCols === 3 ? "p-1.5 pr-3 gap-2" : "p-2 pr-4 gap-3 sm:p-2.5 sm:pr-5 sm:gap-4"}`}
      >
        <GroupPattern variant="header" />
        <div className="absolute inset-0 rounded-2xl border border-[var(--accent3)] shadow-xl opacity-0 transition-opacity duration-350 md:group-hover/group-card:opacity-100 pointer-events-none" />
        <div
          ref={titleContainerRef}
          className="flex items-center gap-2 min-w-0 flex-1 relative z-10"
        >
          <div className="relative flex justify-center items-center">
            <div
              ref={buttonRef}
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className={`flex items-center justify-center transition-all cursor-pointer rounded-full md:hover:opacity-80 ${isSettingsOpen ? "bg-[var(--accent3)] text-black shadow-[0_0_8px_rgba(255,165,0,0.3)]" : "bg-[var(--accent3-transparent)] text-[var(--accent3)]"} shrink-0 ${
                parentGroupsCols === 3 ? "p-1 w-6 h-6" : "p-1.5 w-7 h-7 sm:p-2 sm:w-8 sm:h-8"
              }`}
              title="تنظیمات گروه"
            >
              <WidgetIcon
                icon={icon}
                defaultIcon="Layers"
                className={parentGroupsCols === 3 ? "w-3.5 h-3.5" : "w-4 h-4 sm:w-5 sm:h-5"}
              />
            </div>

            <AnimatePresence>
              <GroupSettingsMenu
                id={id}
                isSettingsOpen={isSettingsOpen}
                isCompact={isCompact}
                isMobile={isMobile}
                maxCols={maxCols}
                onColsChange={onColsChange}
                onAddPlaceholder={onAddPlaceholder}
                setIsSettingsOpen={setIsSettingsOpen}
                menuRef={menuRef}
              />
            </AnimatePresence>
          </div>

          <div className="min-w-0 flex-1 text-right leading-tight">
            <h4
              ref={titleTextRef}
              className={`font-sans font-extrabold text-slate-900 dark:text-[var(--accent3)] truncate ${
                parentGroupsCols === 3 ? "text-[11px]" : "text-xs sm:text-base"
              }`}
            >
              {id}
            </h4>
            <span className="text-[9px] theme-text-muted mt-0.5 whitespace-nowrap block">
              ({segmentCount} دستگاه)
            </span>
          </div>
        </div>

        {!(isCompact || isMobile) && (
          <div className="shrink-0">
            <LayoutSelector
              maxCols={maxCols}
              onColsChange={onColsChange}
              parentGroupsCols={parentGroupsCols}
            />
          </div>
        )}
      </div>

      <GroupActions
        id={id}
        onDeleteGroup={onDeleteGroup}
        parentGroupsCols={parentGroupsCols}
        attributes={attributes}
        listeners={listeners}
      />
    </div>
  );
}
