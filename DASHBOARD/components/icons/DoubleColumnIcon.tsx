import React from "react";

interface DoubleColumnIconProps {
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
 * Dual column layout icon with split parallel architectural panels and undulating heights.
 */
export default function DoubleColumnIcon({
  size = 14,
  className = "",
  animationsEnabled = false,
  isActive = false,
}: DoubleColumnIconProps) {
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
      {/* Left Column */}
      <rect
        x="3"
        y="4"
        width="8"
        height="16"
        rx="2"
        fill="currentColor"
        fillOpacity={isActive ? "0.2" : "0.06"}
        className={
          animationsEnabled && isActive
            ? "animate-[col-wave-left_2.4s_ease-in-out_infinite]"
            : ""
        }
        style={{ transformOrigin: "7px 12px" }}
      />
      
      {/* Right Column */}
      <rect
        x="13"
        y="4"
        width="8"
        height="16"
        rx="2"
        fill="currentColor"
        fillOpacity={isActive ? "0.2" : "0.06"}
        className={
          animationsEnabled && isActive
            ? "animate-[col-wave-right_2.4s_ease-in-out_infinite]"
            : ""
        }
        style={{ transformOrigin: "17px 12px" }}
      />
    </svg>
  );
}
