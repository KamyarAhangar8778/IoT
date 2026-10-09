import React from "react";

interface SegmentDeleteIconProps {
  /** Size in pixels */
  size?: number;
  /** Extra CSS classes */
  className?: string;
  /** Whether dashboard animations are enabled */
  animationsEnabled?: boolean;
}

/**
 * Segment Delete / Close icon with animated micro-twist when hovered/active.
 */
export default function SegmentDeleteIcon({
  size = 14,
  className = "",
  animationsEnabled = false,
}: SegmentDeleteIconProps) {
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
      <g
        className={
          animationsEnabled
            ? "transition-transform duration-300 group-hover:rotate-90"
            : ""
        }
        style={{ transformOrigin: "12px 12px" }}
      >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </g>
    </svg>
  );
}
