import React from "react";
import { motion, AnimatePresence } from "motion/react";
import ThemeSunIcon from "./ThemeSunIcon";
import ThemeMoonIcon from "./ThemeMoonIcon";

interface ThemeAnimatedIconProps {
  /** Current theme state (true for dark, false for light) */
  isDark?: boolean;
  /** Whether dashboard animations are enabled */
  animationsEnabled?: boolean;
  /** Size in pixels */
  size?: number;
  /** Extra CSS classes */
  className?: string;
}

/**
 * Animated theme switcher icon with smooth cross-fade rotation between Persian Sun and Moon.
 */
export default function ThemeAnimatedIcon({
  isDark = false,
  animationsEnabled = false,
  size = 16,
  className = "",
}: ThemeAnimatedIconProps) {
  if (!animationsEnabled) {
    return isDark ? (
      <ThemeMoonIcon size={size} className={className} animationsEnabled={false} />
    ) : (
      <ThemeSunIcon size={size} className={className} animationsEnabled={false} />
    );
  }

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="moon"
            initial={{ opacity: 0, rotate: -40, scale: 0.75 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 40, scale: 0.75 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="flex items-center justify-center"
          >
            <ThemeMoonIcon size={size} animationsEnabled={animationsEnabled} />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ opacity: 0, rotate: 40, scale: 0.75 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: -40, scale: 0.75 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="flex items-center justify-center"
          >
            <ThemeSunIcon size={size} animationsEnabled={animationsEnabled} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
