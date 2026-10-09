import React from "react";
import { motion } from "motion/react";
import { SortableSegmentCardProps } from "../core/types";
import CardHeader from "./CardHeader";
import CardBody from "./CardBody";
import CardFooter from "./CardFooter";
import useSegmentButtonProps from "../hooks/useSegmentButtonProps";
import { useAutoOffTimer } from "../hooks/useAutoOffTimer";

interface ActiveCardProps
  extends Omit<SortableSegmentCardProps, "onSetupPlaceholder" | "isLoadingIoT"> {
  isCompact: boolean;
  isUltraCompact: boolean;
  isMobileTwoCol?: boolean;
  densityFactor?: number;
  attributes: any;
  listeners: any;
  isSettingsOpen?: boolean;
  setIsSettingsOpen?: (val: boolean) => void;
}

function ActiveCard({
  segment,
  isPinOn = false,
  onRemove,
  onTogglePin,
  onSetPinState,
  onUpdateSegmentMode,
  onUpdateSegmentAutoOff,
  onUpdateSegmentRule,
  parentGroupsCols,
  groupMaxCols,
  animationsEnabled = true,
  isCompact,
  isUltraCompact,
  isMobileTwoCol,
  densityFactor,
  attributes,
  listeners,
  isSettingsOpen,
  setIsSettingsOpen,
}: ActiveCardProps) {
  const mode = segment.mode || "switch";
  const buttonProps = useSegmentButtonProps({
    mode,
    pin: segment.pin,
    onTogglePin,
    onSetPinState,
  });

  const { countdown } = useAutoOffTimer({
    isPinOn,
    autoOff: segment.auto_off,
    mode,
    pin: segment.pin,
    onSetPinState,
  });

  return (
    <motion.div
      layout={animationsEnabled ? "position" : false}
      transition={animationsEnabled ? { type: "spring", stiffness: 380, damping: 32 } : undefined}
      initial={animationsEnabled ? { opacity: 0, scale: 0.93, y: 10 } : false}
      animate={animationsEnabled ? { opacity: 1, scale: 1, y: 0 } : false}
      exit={
        animationsEnabled
          ? { opacity: 0, scale: 0.85, y: -10, transition: { duration: 0.2, ease: "easeIn" } }
          : undefined
      }
      className={`flex flex-col bg-[var(--card-bg)]/90 backdrop-blur-md border border-[var(--border-color)] relative group/segment h-full rounded-2xl element-card shadow-none transition-all duration-300 ease-out md:hover:-translate-y-1.5 md:hover:shadow-md ${
        isPinOn
          ? "border-[var(--accent4)]/50 shadow-[0_0_12px_var(--accent4-transparent)] md:hover:border-[var(--accent4)]"
          : "md:hover:border-[var(--accent3-heavy)]"
      } ${
        isSettingsOpen ? "z-50" : ""
      } ${
        isUltraCompact ? "min-h-[90px]" : "min-h-[140px]"
      }`}
    >
      {/* Dynamic Hover & Active Aura Glow */}
      <div
        className={`absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300 ${
          isPinOn ? "opacity-100" : "opacity-0 md:group-hover/segment:opacity-100"
        }`}
        style={{
          background: isPinOn
            ? "radial-gradient(ellipse at 50% 100%, var(--accent4-transparent), transparent 70%)"
            : "radial-gradient(ellipse at 50% 0%, var(--accent3-transparent), transparent 70%)",
        }}
      />

      {/* Specular Inner Edge Highlight */}
      <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] pointer-events-none" />

      {/* Hover border glow overlay */}
      <div className="absolute inset-0 rounded-2xl border border-[var(--accent3)] shadow-xl opacity-0 transition-opacity duration-300 md:group-hover/segment:opacity-40 pointer-events-none" />

      <div className="flex flex-col h-full relative z-10 flex-1">
        <CardHeader
          segment={segment}
          isPinOn={isPinOn}
          isUltraCompact={isUltraCompact}
          isCompact={isCompact}
          mode={mode}
          onRemove={onRemove}
          onUpdateSegmentMode={onUpdateSegmentMode}
          attributes={attributes}
          listeners={listeners}
          countdown={countdown}
          onUpdateSegmentAutoOff={onUpdateSegmentAutoOff}
          isSettingsOpen={isSettingsOpen}
          setIsSettingsOpen={setIsSettingsOpen}
          groupMaxCols={groupMaxCols}
        />

        <CardBody
          segment={segment}
          isPinOn={isPinOn}
          isCompact={isCompact}
          isUltraCompact={isUltraCompact}
          isMobileTwoCol={isMobileTwoCol}
          densityFactor={densityFactor}
          mode={mode}
          buttonProps={buttonProps}
          animationsEnabled={animationsEnabled}
        />

        {!isUltraCompact && !isCompact && <CardFooter segment={segment} isPinOn={isPinOn} mode={mode} countdown={countdown} />}
      </div>
    </motion.div>
  );
}

export default React.memo(ActiveCard, (prev, next) => {
  return (
    prev.segment === next.segment &&
    prev.isPinOn === next.isPinOn &&
    prev.isCompact === next.isCompact &&
    prev.isUltraCompact === next.isUltraCompact &&
    prev.isMobileTwoCol === next.isMobileTwoCol &&
    prev.densityFactor === next.densityFactor &&
    prev.parentGroupsCols === next.parentGroupsCols &&
    prev.groupMaxCols === next.groupMaxCols &&
    prev.animationsEnabled === next.animationsEnabled &&
    prev.isSettingsOpen === next.isSettingsOpen
  );
});
