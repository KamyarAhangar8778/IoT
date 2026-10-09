"use client";

import React from "react";

interface SegmentPatternProps {
  variant?: "header" | "footer" | "card";
  className?: string;
}

export default function SegmentPattern({
  variant = "header",
  className = "",
}: SegmentPatternProps) {
  const isHeader = variant === "header";
  const isFooter = variant === "footer";

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${
        isHeader ? "rounded-t-2xl" : isFooter ? "rounded-b-2xl" : "rounded-2xl"
      } z-0 transition-opacity duration-300 ${className}`}
      aria-hidden="true"
    >
      {/* Micro-Pattern SVG */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.02] dark:opacity-[0.04] transition-opacity duration-300 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <defs>
          <pattern
            id={`segment-micro-pattern-${variant}`}
            width="18"
            height="18"
            patternUnits="userSpaceOnUse"
          >
            {/* Micro pin node */}
            <circle
              cx="9"
              cy="9"
              r="0.5"
              className="fill-[var(--accent3)]"
            />
          </pattern>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill={`url(#segment-micro-pattern-${variant})`}
        />
      </svg>
    </div>
  );
}
