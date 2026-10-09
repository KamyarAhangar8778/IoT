"use client";

import React from "react";

interface GroupPatternProps {
  variant?: "header" | "body" | "footer" | "actions";
  className?: string;
}

export default function GroupPattern({
  variant = "body",
  className = "",
}: GroupPatternProps) {
  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none rounded-2xl z-0 transition-opacity duration-300 ${className}`}
      aria-hidden="true"
    >
      {/* Specular Top Rim Light */}
      <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.14)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)] pointer-events-none" />

      {/* Subtle Corner Ambient Glow */}
      {variant === "body" && (
        <>
          <div
            className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-10 dark:opacity-15 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, var(--accent3) 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl opacity-10 dark:opacity-15 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, var(--accent4) 0%, transparent 70%)",
            }}
          />
        </>
      )}

      {/* Micro-Pattern SVG - Soft, non-distracting dot grid */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.025] dark:opacity-[0.045] transition-opacity duration-300 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <defs>
          <pattern
            id={`group-pattern-${variant}`}
            width={variant === "footer" ? "20" : "28"}
            height={variant === "footer" ? "20" : "28"}
            patternUnits="userSpaceOnUse"
          >
            {/* Minimal subtle dot */}
            <circle
              cx={variant === "footer" ? "10" : "14"}
              cy={variant === "footer" ? "10" : "14"}
              r="0.6"
              className="fill-[var(--text-secondary)]"
            />
          </pattern>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill={`url(#group-pattern-${variant})`}
        />
      </svg>
    </div>
  );
}
