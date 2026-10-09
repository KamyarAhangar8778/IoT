import React from 'react';
import { motion } from 'motion/react';
import { VoiceAssistantIcon } from '@/components/icons';
import { VoiceCommandButtonProps } from './types';

interface HorizontalVoiceButtonProps extends VoiceCommandButtonProps {
  isListening: boolean;
  handlePointerDown: (e: React.PointerEvent) => void;
  handlePointerUp: (e: React.PointerEvent) => void;
  handlePointerCancel: (e: React.PointerEvent) => void;
}

export default function HorizontalVoiceButton({ 
  animationsEnabled = false, 
  isListening, 
  handlePointerDown, 
  handlePointerUp, 
  handlePointerCancel 
}: HorizontalVoiceButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onContextMenu={(e) => e.preventDefault()}
      style={{ touchAction: 'none' }}
      className={`p-2 md:p-2.5 transition-all border rounded-xl flex justify-center items-center group select-none cursor-pointer ${
        isListening
          ? "bg-[var(--accent4-transparent)] border-[var(--accent4)] text-[var(--accent4)] shadow-[0_0_12px_var(--accent4-transparent)]"
          : "bg-transparent md:hover:bg-[var(--accent4-transparent)] border-[var(--border-color)] text-[var(--text-secondary)] md:hover:text-[var(--accent4)] md:hover:border-[var(--accent4)]"
      }`}
      title="فرمان صوتی (نگه دارید)"
    >
      <VoiceAssistantIcon
        size={16}
        animationsEnabled={animationsEnabled}
        isListening={isListening}
        className={`transition-transform duration-300 ${animationsEnabled && !isListening ? "md:group-hover:scale-110" : ""}`}
      />
    </motion.button>
  );
}
