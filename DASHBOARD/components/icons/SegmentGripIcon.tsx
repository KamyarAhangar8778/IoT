import React from "react";

interface SegmentGripIconProps {
  /** Size in pixels */
  size?: number;
  /** Extra CSS classes */
  className?: string;
  /** Whether dashboard animations are enabled */
  animationsEnabled?: boolean;
}

/**
 * Segment Grip / Drag Handle icon with interactive dot array and subtle magnetic levitation.
 */
export default function SegmentGripIcon({
  size = 14,
  className = "",
  animationsEnabled = false,
}: SegmentGripIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={`shrink-0 overflow-visible ${className}`}
    >
      {/* Left Column Dots */}
      <circle
        cx="8.5"
        cy="5.5"
        r="1.75"
        className={
          animationsEnabled
            ? "animate-[grip-dot-pulse_2s_ease-in-out_infinite]"
            : ""
        }
      />
      <circle
        cx="8.5"
        cy="12"
        r="1.75"
        className={
          animationsEnabled
            ? "animate-[grip-dot-pulse_2s_ease-in-out_infinite_0.3s]"
            : ""
        }
      />
      <circle
        cx="8.5"
        cy="18.5"
        r="1.75"
        className={
          animationsEnabled
            ? "animate-[grip-dot-pulse_2s_ease-in-out_infinite_0.6s]"
            : ""
        }
      />

      {/* Right Column Dots */}
      <circle
        cx="15.5"
        cy="5.5"
        r="1.75"
        className={
          animationsEnabled
            ? "animate-[grip-dot-pulse_2s_ease-in-out_infinite_0.2s]"
            : ""
        }
      />
      <circle
        cx="15.5"
        cy="12"
        r="1.75"
        className={
          animationsEnabled
            ? "animate-[grip-dot-pulse_2s_ease-in-out_infinite_0.5s]"
            : ""
        }
      />
      <circle
        cx="15.5"
        cy="18.5"
        r="1.75"
        className={
          animationsEnabled
            ? "animate-[grip-dot-pulse_2s_ease-in-out_infinite_0.8s]"
            : ""
        }
      />
    </svg>
  );
}
