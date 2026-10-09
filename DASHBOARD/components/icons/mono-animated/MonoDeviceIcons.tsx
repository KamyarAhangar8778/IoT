import React from "react";

/**
 * Multi-part SVG Animated Icons for Devices and Appliances
 * Static chassis with smoothly moving functional components (e.g., fan blades, clock hands).
 */

export function AnimFan({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" className="opacity-40" />
      <g className="animate-[spin_4s_linear_infinite] origin-center">
        <path d="M12 12c0-3 2.5-5 5-5s3 2.5 3 5-2.5 3-5 3c0 3-2.5 5-5 5s-3-2.5-3-5 2.5-3 5-3c0-3-2.5-5-5-5s-3 2.5-3 5 2.5 3 5 3" />
        <circle cx="12" cy="12" r="2" fill="currentColor" />
      </g>
    </svg>
  );
}

export function AnimLightbulb({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-1 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6M10 22h4" />
      <path d="M12 9v3" className="animate-[pulse_2.2s_ease-in-out_infinite]" />
    </svg>
  );
}

export function AnimClock({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="12" x2="12" y2="7" className="origin-center animate-[spin_12s_linear_infinite]" />
      <line x1="12" y1="12" x2="16" y2="12" />
    </svg>
  );
}

export function AnimTimer({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="10" x2="14" y1="2" y2="2" />
      <line x1="12" x2="15" y1="14" y2="11" className="origin-[12px_14px] animate-[spin_6s_linear_infinite]" />
      <circle cx="12" cy="14" r="8" />
    </svg>
  );
}

export function AnimBell({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <g className="origin-top animate-[pulse_3s_ease-in-out_infinite]">
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
      </g>
    </svg>
  );
}

export function AnimCamera({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" className="animate-[pulse_3s_ease-in-out_infinite]" />
    </svg>
  );
}

export function AnimVideo({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m22 8-6 4 6 4V8Z" />
      <rect width="14" height="12" x="2" y="6" rx="2" />
      <circle cx="6" cy="10" r="1" fill="currentColor" className="animate-[pulse_1.5s_ease-in-out_infinite]" />
    </svg>
  );
}

export function AnimTv({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="15" x="2" y="7" rx="2" />
      <polyline points="17 2 12 7 7 2" className="animate-[pulse_3.5s_ease-in-out_infinite]" />
    </svg>
  );
}

export function AnimMonitor({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="14" x="2" y="3" rx="2" />
      <line x1="8" x2="16" y1="21" y2="21" />
      <line x1="12" x2="12" y1="17" y2="21" />
      <line x1="6" x2="10" y1="8" y2="8" className="animate-[pulse_2s_ease-in-out_infinite]" />
    </svg>
  );
}

export function AnimSmartphone({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
      <path d="M12 18h.01" className="animate-[pulse_2s_ease-in-out_infinite]" />
    </svg>
  );
}

export function AnimPhone({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" className="animate-[pulse_3s_ease-in-out_infinite]" />
    </svg>
  );
}
