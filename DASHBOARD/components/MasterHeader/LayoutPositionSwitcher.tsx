import React from "react";
import { PanelTop, PanelLeft } from "lucide-react";

interface LayoutPositionSwitcherProps {
  headerPosition: "top" | "left";
  setHeaderPosition: (val: "top" | "left") => void;
  variant: "vertical" | "horizontal";
  isSidebarCollapsed?: boolean;
}

export default function LayoutPositionSwitcher({
  headerPosition,
  setHeaderPosition,
  variant,
  isSidebarCollapsed,
}: LayoutPositionSwitcherProps) {
  const handleTogglePosition = (pos: "top" | "left") => {
    setHeaderPosition(pos);
  };

  if (variant === "vertical") {
    return (
      <div className={`grid ${isSidebarCollapsed ? "grid-cols-1" : "grid-cols-2"} gap-1.5 w-full`}>
        <button
          onClick={() => handleTogglePosition("top")}
          className={`flex items-center justify-center gap-1.5 p-2 rounded-lg border text-[11px] font-bold transition-all cursor-pointer ${
            headerPosition === "top"
              ? "border-[var(--accent3)] bg-[var(--accent3-transparent)] text-[var(--accent3)] shadow-xs"
              : "border-[var(--border-color)] text-[var(--text-tertiary)] md:hover:text-[var(--text-primary)] md:hover:bg-[var(--card-hover-bg)]"
          }`}
          title="قرارگیری هدر در بالای صفحه"
        >
          <PanelTop className="w-4 h-4 shrink-0" />
          {!isSidebarCollapsed && <span>هدر بالا</span>}
        </button>

        <button
          onClick={() => handleTogglePosition("left")}
          className={`flex items-center justify-center gap-1.5 p-2 rounded-lg border text-[11px] font-bold transition-all cursor-pointer ${
            headerPosition === "left"
              ? "border-[var(--accent4)] bg-[var(--accent4-transparent)] text-[var(--accent4)] shadow-xs"
              : "border-[var(--border-color)] text-[var(--text-tertiary)] md:hover:text-[var(--text-primary)] md:hover:bg-[var(--card-hover-bg)]"
          }`}
          title="قرارگیری منو در سمت چپ"
        >
          <PanelLeft className="w-4 h-4 shrink-0" />
          {!isSidebarCollapsed && <span>منوی چپ</span>}
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center p-0.5 bg-transparent border border-[var(--border-color)] rounded-xl gap-0.5 shrink-0">
      <button
        onClick={() => handleTogglePosition("top")}
        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
          headerPosition === "top"
            ? "bg-[var(--accent3)] text-black shadow-sm"
            : "text-[var(--text-tertiary)] md:hover:text-[var(--text-primary)] md:hover:bg-[var(--accent3-transparent)]"
        }`}
        title="نمای پادشاهی بالا"
      >
        <PanelTop className="w-3 h-3" />
        <span className="hidden sm:inline">هدر بالا</span>
      </button>
      <button
        onClick={() => handleTogglePosition("left")}
        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
          headerPosition === "left"
            ? "bg-[var(--accent4)] text-black shadow-sm"
            : "text-[var(--text-tertiary)] md:hover:text-[var(--text-primary)] md:hover:bg-[var(--accent4-transparent)]"
        }`}
        title="نمای منوی ستونی چپ"
      >
        <PanelLeft className="w-3 h-3" />
        <span className="hidden sm:inline">منوی چپ</span>
      </button>
    </div>
  );
}
