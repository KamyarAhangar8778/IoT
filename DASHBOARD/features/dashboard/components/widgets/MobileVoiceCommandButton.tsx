import React from 'react';
import { motion } from 'motion/react';
import { VoiceAssistantIcon } from '@/components/icons';
import { useIoTStore } from '@/features/iot/hooks/useIoTStore';
import { useMobileVoiceCommand } from '../../hooks/useMobileVoiceCommand';

export default function MobileVoiceCommandButton() {
  const animationsEnabled = useIoTStore(s => s.animationsEnabled);
  const activeGroupId = useIoTStore(s => s.activeGroupId);
  const activeSegmentId = useIoTStore(s => s.activeSegmentId);
  const { isListening, handlePointerDown, handlePointerUp, handlePointerCancel } = useMobileVoiceCommand();

  const isDragging = !!activeGroupId || !!activeSegmentId;

  if (isDragging) return null;

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onContextMenu={(e) => e.preventDefault()}
      style={{ touchAction: 'none' }}
      className={`fixed bottom-6 left-6 z-50 p-4 rounded-full shadow-lg flex justify-center items-center select-none transition-all duration-300 ${
        isListening
          ? "bg-[var(--accent4)] shadow-[0_0_20px_var(--accent4-transparent)] text-white"
          : "bg-[var(--card-bg-solid)] border border-[var(--border-color)] text-[var(--text-secondary)] shadow-[0_4px_15px_-5px_var(--border-color)]"
      }`}
      title="فرمان صوتی (نگه دارید)"
    >
      <VoiceAssistantIcon
        size={24}
        animationsEnabled={animationsEnabled}
        isListening={isListening}
      />
    </motion.button>
  );
}
