import React from "react";

/**
 * Multi-part SVG Animated Icons for Media, Connectivity & Drinks
 * Subtle sequential waves, audio ripples, and gently rising steam without blur.
 */

export function AnimSpeaker({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="16" height="20" x="4" y="2" rx="2" />
      <circle cx="12" cy="14" r="4" className="animate-[pulse_2.2s_ease-in-out_infinite]" />
      <line x1="12" x2="12.01" y1="6" y2="6" />
    </svg>
  );
}

export function AnimVolume2({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" className="animate-[pulse_2s_ease-in-out_infinite]" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" className="animate-[pulse_2s_ease-in-out_infinite_0.4s]" />
    </svg>
  );
}

export function AnimMic({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" x2="12" y1="19" y2="22" />
      <line x1="8" x2="16" y1="22" y2="22" />
    </svg>
  );
}

export function AnimMusic({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" className="animate-[pulse_2.2s_ease-in-out_infinite]" />
      <circle cx="18" cy="16" r="3" className="animate-[pulse_2.2s_ease-in-out_infinite_0.4s]" />
    </svg>
  );
}

export function AnimRadio({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" className="animate-[pulse_2.4s_ease-in-out_infinite]" />
      <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" className="animate-[pulse_2.4s_ease-in-out_infinite_0.3s]" />
      <circle cx="12" cy="12" r="2" />
      <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" className="animate-[pulse_2.4s_ease-in-out_infinite_0.3s]" />
      <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19" className="animate-[pulse_2.4s_ease-in-out_infinite]" />
    </svg>
  );
}

export function AnimAirplay({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1" />
      <polygon points="12 15 17 21 7 21 12 15" className="animate-[pulse_2.5s_ease-in-out_infinite]" />
    </svg>
  );
}

export function AnimWifi({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 20h.01" />
      <path d="M8.5 16.429a5 5 0 0 1 7 0" className="animate-[pulse_2.4s_ease-in-out_infinite]" />
      <path d="M5 12.859a10 10 0 0 1 14 0" className="animate-[pulse_2.4s_ease-in-out_infinite_0.4s]" />
      <path d="M1.42 9a16 16 0 0 1 21.16 0" className="animate-[pulse_2.4s_ease-in-out_infinite_0.8s]" />
    </svg>
  );
}

export function AnimBluetooth({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m7 7 10 10-5 5V2l5 5L7 17" className="animate-[pulse_2.5s_ease-in-out_infinite]" />
    </svg>
  );
}

export function AnimGamepad2({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="6" x2="10" y1="12" y2="12" className="animate-[pulse_2.5s_ease-in-out_infinite]" />
      <line x1="8" x2="8" y1="10" y2="14" className="animate-[pulse_2.5s_ease-in-out_infinite]" />
      <line x1="15" x2="15.01" y1="13" y2="13" />
      <line x1="18" x2="18.01" y1="11" y2="11" />
      <rect width="20" height="12" x="2" y="6" rx="6" />
    </svg>
  );
}

export function AnimCoffee({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
      <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
      <line x1="6" x2="6" y1="2" y2="4" className="animate-[pulse_2s_ease-in-out_infinite]" />
      <line x1="10" x2="10" y1="2" y2="4" className="animate-[pulse_2s_ease-in-out_infinite_0.4s]" />
      <line x1="14" x2="14" y1="2" y2="4" className="animate-[pulse_2s_ease-in-out_infinite_0.8s]" />
    </svg>
  );
}
