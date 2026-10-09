import React from "react";

/**
 * Multi-part SVG Animated Icons for Weather and Environment
 * Micro-animations with stationary frames and independent moving elements.
 */

export function AnimSun({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="4" />
      <g className="animate-[spin_16s_linear_infinite] origin-center opacity-85">
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
      </g>
    </svg>
  );
}

export function AnimMoon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" className="origin-center animate-[pulse_4s_ease-in-out_infinite]" />
      <circle cx="17" cy="7" r="0.75" fill="currentColor" stroke="none" className="animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite] opacity-70" />
    </svg>
  );
}

export function AnimCloud({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" className="animate-[pulse_3.5s_ease-in-out_infinite]" />
    </svg>
  );
}

export function AnimWind({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" className="animate-[pulse_2.8s_ease-in-out_infinite]" />
      <path d="M9.6 4.6A2 2 0 1 1 11 8H2" className="animate-[pulse_2.8s_ease-in-out_infinite_0.4s]" />
      <path d="M12.6 19.4A2 2 0 1 0 14 16H2" className="animate-[pulse_2.8s_ease-in-out_infinite_0.8s]" />
    </svg>
  );
}

export function AnimFlame({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
      <path d="M12 18a2 2 0 0 0 2-2c0-.8-.5-1.5-1-2-.5.5-1 1.2-1 2a2 2 0 0 0 0 2z" className="origin-bottom animate-[pulse_1.8s_ease-in-out_infinite]" />
    </svg>
  );
}

export function AnimSnowflake({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <g className="animate-[spin_14s_linear_infinite] origin-center">
        <line x1="2" x2="22" y1="12" y2="12" />
        <line x1="12" x2="12" y1="2" y2="22" />
        <path d="m20 16-4-4 4-4M4 8l4 4-4 4M16 4l-4 4-4-4M8 20l4-4 4 4" />
      </g>
    </svg>
  );
}

export function AnimWaves({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" className="animate-[pulse_2.5s_ease-in-out_infinite]" />
      <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" className="animate-[pulse_2.5s_ease-in-out_infinite_0.4s]" />
      <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" className="animate-[pulse_2.5s_ease-in-out_infinite_0.8s]" />
    </svg>
  );
}

export function AnimDroplet({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" className="animate-[pulse_3s_ease-in-out_infinite] origin-bottom" />
    </svg>
  );
}

export function AnimDroplets({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z" className="animate-[pulse_2.5s_ease-in-out_infinite]" />
      <path d="M17 21c2.76 0 5-2.24 5-5 0-1.4-.7-2.8-2.1-3.9s-2.5-2.9-2.9-4.8c-.4 1.9-1.5 3.7-2.9 4.8S12 14.6 12 16c0 2.76 2.24 5 5 5z" className="animate-[pulse_2.5s_ease-in-out_infinite_0.5s]" />
    </svg>
  );
}

export function AnimThermometer({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" />
      <path d="M12 11v3" className="animate-[pulse_2.5s_ease-in-out_infinite]" />
    </svg>
  );
}

export function AnimThermometerSun({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 9a4 4 0 0 0-2 7.5" />
      <path d="M12 3v2M6.6 18.4l-1.4 1.4M20 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" />
      <path d="M4 13H2M6.34 7.34 4.93 5.93" className="animate-[pulse_3s_ease-in-out_infinite]" />
    </svg>
  );
}
