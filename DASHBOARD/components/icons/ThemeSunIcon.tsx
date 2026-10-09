import React from "react";

interface ThemeSunIconProps {
  /** Size in pixels */
  size?: number;
  /** Extra CSS classes */
  className?: string;
  /** Whether dashboard animations are enabled */
  animationsEnabled?: boolean;
}

/**
 * Regal Persian Solstice Sun Icon with rotating corona rays and a glowing solar core.
 * Animations strictly run only when animationsEnabled is true.
 */
export default function ThemeSunIcon({
  size = 16,
  className = "text-amber-400",
  animationsEnabled = false,
}: ThemeSunIconProps) {
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
      {/* Central Solar Core */}
      <circle
        cx="12"
        cy="12"
        r="4.5"
        fill="currentColor"
        fillOpacity="0.2"
        className={
          animationsEnabled
            ? "animate-[solar-core-pulse_3s_ease-in-out_infinite]"
            : ""
        }
        style={{ transformOrigin: "12px 12px" }}
      />

      {/* Rotating Solar Corona Rays */}
      <g
        className={
          animationsEnabled
            ? "animate-[solar-corona-spin_24s_linear_infinite]"
            : ""
        }
        style={{ transformOrigin: "12px 12px" }}
      >
        <line x1="12" y1="1" x2="12" y2="3.5" />
        <line x1="12" y1="20.5" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.99" y2="5.99" />
        <line x1="18.01" y1="18.01" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3.5" y2="12" />
        <line x1="20.5" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.99" y2="18.01" />
        <line x1="18.01" y1="5.99" x2="19.78" y2="4.22" />
      </g>
    </svg>
  );
}
