import { Settings } from "lucide-react";
import { AnimatePresence } from "motion/react";
import React from "react";
import { WidgetIcon } from "@/components/icons";
import { useMediaQuery } from "../../../hooks/useMediaQuery";
import type { SegmentData } from "../core/types";
import { useCardHeaderLayout } from "../hooks/useCardHeaderLayout";
import SegmentActions from "./SegmentActions";
import SegmentPattern from "./SegmentPattern";
import SegmentSettingsMenu from "./SegmentSettingsMenu";

interface CardHeaderProps {
  segment: SegmentData;
  isPinOn: boolean;
  isUltraCompact: boolean;
  isCompact: boolean;
  mode: "switch" | "push";
  onRemove: (id: string) => void;
  onUpdateSegmentMode?: (id: string, mode: "switch" | "push") => void;
  onUpdateSegmentAutoOff?: (id: string, autoOff: number) => void;
  countdown?: number | null;
  attributes: any;
  listeners: any;
  isSettingsOpen?: boolean;
  setIsSettingsOpen?: (val: boolean) => void;
  groupMaxCols?: number;
}

export default function CardHeader({
  segment,
  isPinOn,
  isUltraCompact,
  isCompact,
  mode,
  onRemove,
  onUpdateSegmentMode,
  onUpdateSegmentAutoOff,
  countdown,
  attributes,
  listeners,
  isSettingsOpen,
  setIsSettingsOpen,
  groupMaxCols = 3,
}: CardHeaderProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const headerRef = React.useRef<HTMLDivElement>(null);
  const [isNarrow, setIsNarrow] = React.useState(false);

  React.useLayoutEffect(() => {
    if (!headerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        // Collapse inline actions if header width is less than 270px to avoid element overflow
        setIsNarrow(width < 270);
      }
    });
    observer.observe(headerRef.current);
    return () => observer.disconnect();
  }, []);

  const forceFullHeader = isMobile && groupMaxCols === 1;
  const isSmall = !forceFullHeader && (isUltraCompact || isCompact || (isMobile && groupMaxCols > 1) || isNarrow);
  const showIconInMenu = isSmall;

  const {
    isSettingsOpen: currentIsSettingsOpen,
    setIsSettingsOpen: currentSetIsSettingsOpen,
    showAutoOffMenu,
    setShowAutoOffMenu,
    buttonRef,
    menuRef,
    autoOffButtonRef,
    autoOffMenuRef,
  } = useCardHeaderLayout({ isSettingsOpen, setIsSettingsOpen });

  const autoOffMenuProps = {
    showAutoOffMenu,
    setShowAutoOffMenu,
    autoOffButtonRef,
    autoOffMenuRef,
  };

  return (
    <div
      ref={headerRef}
      {...(isSmall ? attributes : {})}
      {...(isSmall ? listeners : {})}
      data-segment-menu-open={currentIsSettingsOpen ? "true" : undefined}
      className={`relative flex items-center ${
        isSmall
          ? "justify-center p-2.5 px-3 cursor-grab active:cursor-grabbing"
          : "justify-between p-3.5"
      } border-b border-[var(--border-color)] bg-transparent rounded-t-2xl`}
    >
      <SegmentPattern variant="header" />
      {isSmall ? (
        <div className="relative flex items-center justify-center w-full group/btn h-6">
          <button
            type="button"
            ref={buttonRef}
            onClick={() => currentSetIsSettingsOpen(!currentIsSettingsOpen)}
            className={`w-7 h-7 bg-slate-200/90 dark:bg-slate-950 border border-slate-300/85 dark:border-slate-800 transition-all duration-300 cursor-pointer rounded-full shadow-sm flex items-center justify-center ${
              currentIsSettingsOpen
                ? "border-[var(--accent3)] text-[var(--accent3)] shadow-[0_0_8px_rgba(255,165,0,0.3)] bg-[var(--accent3-transparent)]"
                : "text-slate-700 dark:text-gray-300 md:hover:border-[var(--accent3)] md:hover:text-[var(--accent3)]"
            }`}
            title="تنظیمات و منوی کشویی سگمنت"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <Settings className="w-3.5 h-3.5 transition-transform duration-500 md:hover:rotate-90 shrink-0" />
          </button>

          <AnimatePresence>
            <SegmentSettingsMenu
              segment={segment}
              isSettingsOpen={currentIsSettingsOpen}
              menuRef={menuRef}
              buttonRef={buttonRef}
              showIconInMenu={showIconInMenu}
              isPinOn={isPinOn}
              isUltraCompact={isUltraCompact}
              onRemove={onRemove}
              onUpdateSegmentMode={onUpdateSegmentMode}
              onUpdateSegmentAutoOff={onUpdateSegmentAutoOff}
              mode={mode}
              countdown={countdown}
              autoOffMenuProps={autoOffMenuProps}
            />
          </AnimatePresence>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-1.5 md:gap-2">
            <SegmentActions
              segment={segment}
              onRemove={onRemove}
              attributes={attributes}
              listeners={listeners}
              onUpdateSegmentMode={onUpdateSegmentMode}
              onUpdateSegmentAutoOff={onUpdateSegmentAutoOff}
              mode={mode}
              countdown={countdown}
              autoOffMenuProps={autoOffMenuProps}
            />
          </div>

          <div className="flex items-center gap-2">
            <div
              className={`p-2 rounded-full transition-colors flex items-center justify-center ${
                isPinOn
                  ? "bg-[var(--accent4-transparent)] text-[var(--accent4)]"
                  : "bg-gray-800/20 text-gray-500"
              }`}
            >
              <WidgetIcon icon={segment.icon} defaultIcon="Cpu" className="w-4 h-4" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
