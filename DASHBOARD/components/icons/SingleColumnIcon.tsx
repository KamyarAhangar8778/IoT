import React from "react";

interface SingleColumnIconProps {
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
 * Single column layout icon with clean structural panel and animated breathing wave.
 */
export default function SingleColumnIcon({
  size = 14,
  className = "",
  animationsEnabled = false,
  isActive = false,
}: SingleColumnIconProps) {
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
      <rect
        x="3"
        y="4"
        width="18"
        height="16"
        rx="3"
        fill="currentColor"
        fillOpacity={isActive ? "0.2" : "0.06"}
        className={
          animationsEnabled && isActive
            ? "animate-[col-wave-single_3s_ease-in-out_infinite]"
            : ""
        }
        style={{ transformOrigin: "12px 12px" }}
      />
      <line x1="7" y1="9" x2="17" y2="9" strokeOpacity={isActive ? "0.9" : "0.5"} />
      <line x1="7" y1="14" x2="13" y2="14" strokeOpacity={isActive ? "0.8" : "0.4"} />
    </svg>
  );
}
