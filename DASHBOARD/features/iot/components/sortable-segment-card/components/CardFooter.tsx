import type { SegmentData } from "../core/types";
import SegmentPattern from "./SegmentPattern";
import { Clock } from "lucide-react";

interface CardFooterProps {
  segment: SegmentData;
  isPinOn: boolean;
  mode?: "switch" | "push";
  countdown?: number | null;
}

const formatTimeFa = (seconds: number) => {
  if (seconds < 60) return `${seconds} ثانیه`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (s === 0) return `${m} دقیقه`;
  return `${m} دقیقه و ${s} ثانیه`;
};

export default function CardFooter({ segment, isPinOn, mode, countdown }: CardFooterProps) {
  const activeLabel = isPinOn
    ? segment.on_label || segment.onLabel || "HIGH"
    : segment.off_label || segment.offLabel || "LOW";

  return (
    <div className="relative overflow-hidden px-3 py-1.5 border-t border-[var(--border-color)] bg-transparent min-h-[26px] rounded-b-2xl transition-colors">
      <SegmentPattern variant="footer" />
      <div className="relative z-10 flex justify-between items-center text-[9px] font-sans font-bold tracking-wide text-gray-500 dark:text-gray-400 transition-colors">
        <div className="flex items-center gap-1.5 truncate max-w-[80%]">
          <span className="text-gray-400 dark:text-gray-500 text-[9px] shrink-0">وضعیت:</span>
          <strong
            className={`font-sans font-extrabold text-[10px] truncate ${
              isPinOn ? "text-[var(--accent4)]" : "text-gray-400 dark:text-gray-500"
            }`}
          >
            {activeLabel}
          </strong>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {mode === "switch" && segment.auto_off && segment.auto_off > 0 ? (
            <div className={`flex items-center gap-0.5 text-[9px] ${isPinOn && countdown !== null ? 'text-[var(--accent3)]' : 'text-gray-400 dark:text-gray-500'}`}>
              <Clock className="w-2.5 h-2.5" />
              <span className="font-sans font-bold tabular-nums">
                {isPinOn && countdown !== null ? `${countdown}s` : formatTimeFa(segment.auto_off)}
              </span>
            </div>
          ) : null}
          <span
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ml-0.5 ${
              isPinOn
                ? "bg-[var(--accent4)] shadow-[0_0_6px_var(--accent4)] animate-pulse"
                : "bg-gray-400/40"
            }`}
          />
        </div>
      </div>
    </div>
  );
}
