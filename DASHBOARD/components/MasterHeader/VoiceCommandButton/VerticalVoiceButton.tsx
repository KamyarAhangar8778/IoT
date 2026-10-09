import React from 'react';
import { VoiceAssistantIcon } from '@/components/icons';
import { VoiceCommandButtonProps } from './types';

interface VerticalVoiceButtonProps extends VoiceCommandButtonProps {
  isListening: boolean;
  handlePointerDown: (e: React.PointerEvent) => void;
  handlePointerUp: (e: React.PointerEvent) => void;
  handlePointerCancel: (e: React.PointerEvent) => void;
}

export default function VerticalVoiceButton({ 
  animationsEnabled = false, 
  isListening, 
  handlePointerDown, 
  handlePointerUp, 
  handlePointerCancel 
}: VerticalVoiceButtonProps) {
  return (
    <button
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onContextMenu={(e) => e.preventDefault()}
      style={{ touchAction: 'none' }}
      className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all duration-300 transform active:scale-[0.98] group select-none ${
        isListening 
          ? "bg-[var(--accent4-transparent)] border-[var(--accent4)] text-[var(--accent4)] shadow-[0_0_12px_var(--accent4-transparent)]" 
          : "border-[var(--border-color)] bg-[var(--card-bg-solid)] md:hover:bg-[var(--card-hover-bg)] md:hover:border-[var(--accent4)] text-[var(--text-secondary)] md:hover:text-[var(--accent4)]"
      }`}
    >
      <div className="flex items-center gap-2.5">
        <div className={`p-1.5 rounded-lg transition-all flex items-center justify-center ${isListening ? "bg-[var(--accent4)] text-white" : "bg-[var(--accent4-transparent)] text-[var(--accent4)]"}`}>
          <VoiceAssistantIcon
            size={16}
            animationsEnabled={animationsEnabled}
            isListening={isListening}
          />
        </div>
        <span className="text-xs font-semibold">{isListening ? "در حال شنیدن..." : "فرمان صوتی (نگه دارید)"}</span>
      </div>
      <span className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--border-color)] text-[var(--text-muted)] font-mono">
        Voice
      </span>
    </button>
  );
}
