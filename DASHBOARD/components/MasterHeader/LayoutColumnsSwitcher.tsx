import React from "react";
import { Workflow } from "lucide-react";
import { SingleColumnIcon, DoubleColumnIcon, TripleColumnIcon } from "@/components/icons";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";

interface LayoutColumnsSwitcherProps {
  groupsCols: number;
  setGroupsCols: (val: number) => void;
  variant: "vertical" | "horizontal";
  isSidebarCollapsed?: boolean;
}

export default function LayoutColumnsSwitcher({
  groupsCols,
  setGroupsCols,
  variant,
  isSidebarCollapsed,
}: LayoutColumnsSwitcherProps) {
  const animationsEnabled = useIoTStore((s) => s.animationsEnabled);
  const dashboardViewMode = useIoTStore((s) => s.dashboardViewMode);
  const setDashboardViewMode = useIoTStore((s) => s.setDashboardViewMode);

  const handleSetCols = (cols: number) => {
    if (dashboardViewMode !== "grid") {
      setDashboardViewMode("grid");
    }
    setGroupsCols(cols);
  };

  const handleSetFreeCanvas = () => {
    setDashboardViewMode("free_canvas");
  };

  if (variant === "vertical" && !isSidebarCollapsed) {
    return (
      <div className="flex items-center justify-between p-2 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg gap-2">
        <span className="text-[10px] text-[var(--text-tertiary)] font-bold">چیدمان:</span>
        <div className="flex gap-1">
          {[1, 2, 3].map((cols) => (
            <button
              key={cols}
              onClick={() => handleSetCols(cols)}
              className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                dashboardViewMode === "grid" && groupsCols === cols
                  ? "bg-[var(--accent3-transparent)] text-[var(--accent3)] border border-[var(--accent3-medium)] shadow-xs"
                  : "text-[var(--text-muted)] md:hover:text-[var(--text-primary)] border border-transparent"
              }`}
            >
              {cols === 1 && <SingleColumnIcon size={12} animationsEnabled={animationsEnabled} isActive={dashboardViewMode === "grid" && groupsCols === 1} />}
              {cols === 2 && <DoubleColumnIcon size={12} animationsEnabled={animationsEnabled} isActive={dashboardViewMode === "grid" && groupsCols === 2} />}
              {cols === 3 && <TripleColumnIcon size={12} animationsEnabled={animationsEnabled} isActive={dashboardViewMode === "grid" && groupsCols === 3} />}
              <span>{cols}</span>
            </button>
          ))}
          <button
            onClick={handleSetFreeCanvas}
            title="بوم آزاد (N8N)"
            className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
              dashboardViewMode === "free_canvas"
                ? "bg-[var(--accent3-transparent)] text-[var(--accent3)] border border-[var(--accent3-medium)] shadow-xs"
                : "text-[var(--text-muted)] md:hover:text-[var(--text-primary)] border border-transparent"
            }`}
          >
            <Workflow className="w-3 h-3" />
            <span>بوم</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${variant === "vertical" && isSidebarCollapsed ? "flex-col" : "items-center"} bg-transparent border border-[var(--border-color)] p-0.5 rounded-xl text-xs gap-0.5 shrink-0`}>
      <button
        onClick={() => handleSetCols(1)}
        aria-label="تک ستون"
        className={`p-1.5 flex items-center justify-center rounded-lg transition-all cursor-pointer ${
          dashboardViewMode === "grid" && groupsCols === 1
            ? "bg-[var(--accent3-transparent)] text-[var(--accent3)] font-bold shadow-xs"
            : "text-[var(--text-muted)] md:hover:text-[var(--text-primary)] md:hover:bg-[var(--accent3-transparent)]"
        }`}
        title="نمایش تک ستونه"
      >
        <SingleColumnIcon
          size={14}
          animationsEnabled={animationsEnabled}
          isActive={dashboardViewMode === "grid" && groupsCols === 1}
        />
      </button>
      <button
        onClick={() => handleSetCols(2)}
        aria-label="دو ستون"
        className={`p-1.5 flex items-center justify-center rounded-lg transition-all cursor-pointer ${
          dashboardViewMode === "grid" && groupsCols === 2
            ? "bg-[var(--accent3-transparent)] text-[var(--accent3)] font-bold shadow-xs"
            : "text-[var(--text-muted)] md:hover:text-[var(--text-primary)] md:hover:bg-[var(--accent3-transparent)]"
        }`}
        title="نمایش دو ستونه"
      >
        <DoubleColumnIcon
          size={14}
          animationsEnabled={animationsEnabled}
          isActive={dashboardViewMode === "grid" && groupsCols === 2}
        />
      </button>
      <button
        onClick={() => handleSetCols(3)}
        aria-label="سه ستون"
        className={`p-1.5 flex items-center justify-center rounded-lg transition-all cursor-pointer ${
          dashboardViewMode === "grid" && groupsCols === 3
            ? "bg-[var(--accent3-transparent)] text-[var(--accent3)] font-bold shadow-xs"
            : "text-[var(--text-muted)] md:hover:text-[var(--text-primary)] md:hover:bg-[var(--accent3-transparent)]"
        }`}
        title="نمایش سه ستونه"
      >
        <TripleColumnIcon
          size={14}
          animationsEnabled={animationsEnabled}
          isActive={dashboardViewMode === "grid" && groupsCols === 3}
        />
      </button>

      <div className="w-[1px] h-3.5 bg-[var(--border-color)] mx-0.5 opacity-60" />

      <button
        onClick={handleSetFreeCanvas}
        aria-label="بوم آزاد"
        className={`p-1.5 flex items-center justify-center rounded-lg transition-all cursor-pointer ${
          dashboardViewMode === "free_canvas"
            ? "bg-[var(--accent3-transparent)] text-[var(--accent3)] font-bold shadow-xs border border-[var(--accent3-medium)]"
            : "text-[var(--text-muted)] md:hover:text-[var(--text-primary)] md:hover:bg-[var(--accent3-transparent)]"
        }`}
        title="حالت بوم آزاد دوبعدی (Free Canvas N8N)"
      >
        <Workflow className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

