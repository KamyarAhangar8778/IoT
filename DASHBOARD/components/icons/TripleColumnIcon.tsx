import React from "react";

interface TripleColumnIconProps {
  /** Size in pixels */
  size?: number;
  /** Extra CSS classes */
  className?: string;
  /** Whether dashboard animations are enabled */
  animationsEnabled?: boolean;
  /** Whether this column option is currently active */
  isActive?: boolean;
}

/**
 * Triple column layout icon with three elegant balanced columns and staggered dynamic pulse.
 */
export default function TripleColumnIcon({
  size = 14,
  className = "",
  animationsEnabled = false,
  isActive = false,
}: TripleColumnIconProps) {
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
      {/* First Column */}
      <rect
        x="2"
        y="4"
        width="5"
        height="16"
        rx="1.5"
        fill="currentColor"
        fillOpacity={isActive ? "0.2" : "0.06"}
        className={
          animationsEnabled && isActive
            ? "animate-[col-stagger-1_2s_ease-in-out_infinite]"
            : ""
        }
        style={{ transformOrigin: "4.5px 12px" }}
      />

      {/* Center Column */}
      <rect
        x="9.5"
        y="4"
        width="5"
        height="16"
        rx="1.5"
        fill="currentColor"
        fillOpacity={isActive ? "0.2" : "0.06"}
        className={
          animationsEnabled && isActive
            ? "animate-[col-stagger-2_2s_ease-in-out_infinite_0.3s]"
            : ""
        }
        style={{ transformOrigin: "12px 12px" }}
      />

      {/* Third Column */}
      <rect
        x="17"
        y="4"
        width="5"
        height="16"
        rx="1.5"
        fill="currentColor"
        fillOpacity={isActive ? "0.2" : "0.06"}
        className={
          animationsEnabled && isActive
            ? "animate-[col-stagger-3_2s_ease-in-out_infinite_0.6s]"
            : ""
        }
        style={{ transformOrigin: "19.5px 12px" }}
      />
    </svg>
  );
}
