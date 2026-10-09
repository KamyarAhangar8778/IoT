"use client";

interface HeaderIslandPatternProps {
  className?: string;
  variant?: "horizontal" | "vertical" | "compact";
}

export default function HeaderIslandPattern({
  className = "",
  variant = "horizontal",
}: HeaderIslandPatternProps) {
  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none rounded-2xl z-0 transition-opacity duration-500 ${className}`}
      aria-hidden="true"
    >
      {/* Specular Inner Rim Light (Glass rim effect matching groups and segments) */}
      <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.18)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] pointer-events-none" />

      {/* Ambient Radial Corner Glows using Accent 3 and Accent 4 */}
      <div
        className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl opacity-20 dark:opacity-30 transition-all duration-700 pointer-events-none"
        style={{
          background: "radial-gradient(circle, var(--accent3) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full blur-3xl opacity-15 dark:opacity-25 transition-all duration-700 pointer-events-none"
        style={{
          background: "radial-gradient(circle, var(--accent4) 0%, transparent 70%)",
        }}
      />

      {/* Clean Subtle Micro-Dot Grid SVG (Replaces crowded lattice pattern) */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.035] dark:opacity-[0.06] transition-opacity duration-300 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id={`header-island-pattern-${variant}`}
            width="24"
            height="24"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="12" cy="12" r="0.65" className="fill-[var(--accent3)]" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#header-island-pattern-${variant})`} />
      </svg>

      {/* Ambient bottom edge shimmer */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--accent3-transparent)] to-transparent opacity-60" />
    </div>
  );
}
