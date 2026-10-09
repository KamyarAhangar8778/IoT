import React from "react";

interface VoiceAssistantIconProps {
  /** Size in pixels */
  size?: number;
  /** Extra CSS classes */
  className?: string;
  /** Whether dashboard animations are enabled */
  animationsEnabled?: boolean;
  /** Whether voice recognition is currently listening */
  isListening?: boolean;
}

/**
 * Animated Voice Assistant icon with dynamic acoustic waveforms and responsive listening states.
 * Animations strictly run only when animationsEnabled is true.
 */
export default function VoiceAssistantIcon({
  size = 16,
  className = "",
  animationsEnabled = false,
  isListening = false,
}: VoiceAssistantIconProps) {
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
      {/* Left Acoustic Wave */}
      <path
        d="M2.5 8.5a6 6 0 0 0 0 5"
        className={
          animationsEnabled
            ? isListening
              ? "animate-[voice-wave-active_0.8s_ease-in-out_infinite] opacity-100"
              : "animate-[voice-wave-idle_3s_ease-in-out_infinite] opacity-60"
            : isListening
            ? "opacity-100"
            : "opacity-40"
        }
      />

      {/* Right Acoustic Wave */}
      <path
        d="M21.5 8.5a6 6 0 0 1 0 5"
        className={
          animationsEnabled
            ? isListening
              ? "animate-[voice-wave-active_0.8s_ease-in-out_infinite_0.2s] opacity-100"
              : "animate-[voice-wave-idle_3s_ease-in-out_infinite_0.5s] opacity-60"
            : isListening
            ? "opacity-100"
            : "opacity-40"
        }
      />

      {/* Microphone Capsule */}
      <rect
        x="9"
        y="2"
        width="6"
        height="11"
        rx="3"
        className={
          animationsEnabled && isListening
            ? "animate-[solar-core-pulse_1s_ease-in-out_infinite]"
            : ""
        }
      />

      {/* Cradle */}
      <path d="M18 10a6 6 0 0 1-12 0" />

      {/* Stand & Base */}
      <line x1="12" y1="16" x2="12" y2="21" />
      <line x1="9" y1="21" x2="15" y2="21" />
    </svg>
  );
}
