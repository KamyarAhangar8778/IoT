import React from "react";

interface ModulesIconProps {
  /** Size in pixels (width and height) */
  size?: number;
  /** Extra CSS classes */
  className?: string;
  /** Whether dashboard animations are enabled */
  animationsEnabled?: boolean;
}

/**
 * Animated Modules icon featuring stacked isometric tiers with floating levitation effect.
 * Animations strictly obey the animationsEnabled preference.
 */
export default function ModulesIcon({
  size = 16,
  className = "",
  animationsEnabled = false,
}: ModulesIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`shrink-0 overflow-visible ${className}`}
    >
      {/* Top Layer (Floats subtly when animations are enabled) */}
      <polygon
        points="12 2 2 7 12 12 22 7 12 2"
        className={
          animationsEnabled
            ? "animate-[layer-float-top_3s_ease-in-out_infinite]"
            : ""
        }
      />

      {/* Middle Layer (Intermediate floating offset) */}
      <path
        d="M2 12l10 5 10-5"
        className={
          animationsEnabled
            ? "animate-[layer-float-mid_3s_ease-in-out_infinite_0.4s]"
            : ""
        }
      />

      {/* Base Anchor Layer */}
      <path d="M2 17l10 5 10-5" />
    </svg>
  );
}
