import React from "react";

interface ThemeMoonIconProps {
  /** Size in pixels */
  size?: number;
  /** Extra CSS classes */
  className?: string;
  /** Whether dashboard animations are enabled */
  animationsEnabled?: boolean;
}

/**
 * Serene Persian Night Moon Icon with twinkling celestial stars and organic floating aura.
 * Animations strictly run only when animationsEnabled is true.
 */
export default function ThemeMoonIcon({
  size = 16,
  className = "text-indigo-400",
  animationsEnabled = false,
}: ThemeMoonIconProps) {
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
      {/* Crescent Moon Body */}
      <path
        d="M20.5 13.5A8.5 8.5 0 1 1 10.5 3.5a6.5 6.5 0 0 0 10 10z"
        fill="currentColor"
        fillOpacity="0.15"
        className={
          animationsEnabled
            ? "animate-[lunar-float_5s_ease-in-out_infinite]"
            : ""
        }
        style={{ transformOrigin: "12px 12px" }}
      />

      {/* Celestial Twinkling Star 1 (Top-Right) */}
      <circle
        cx="19"
        cy="4.5"
        r="1"
        fill="currentColor"
        stroke="none"
        className={
          animationsEnabled
            ? "animate-[celestial-twinkle_2.4s_ease-in-out_infinite]"
            : "opacity-60"
        }
        style={{ transformOrigin: "19px 4.5px" }}
      />

      {/* Celestial Twinkling Star 2 (Center-Right) */}
      <circle
        cx="16"
        cy="8.5"
        r="0.75"
        fill="currentColor"
        stroke="none"
        className={
          animationsEnabled
            ? "animate-[celestial-twinkle_2.4s_ease-in-out_infinite_0.8s]"
            : "opacity-40"
        }
        style={{ transformOrigin: "16px 8.5px" }}
      />

      {/* Celestial Twinkling Star 3 (Bottom-Right) */}
      <circle
        cx="18.5"
        cy="18.5"
        r="0.85"
        fill="currentColor"
        stroke="none"
        className={
          animationsEnabled
            ? "animate-[celestial-twinkle_2.4s_ease-in-out_infinite_1.6s]"
            : "opacity-50"
        }
        style={{ transformOrigin: "18.5px 18.5px" }}
      />
    </svg>
  );
}
