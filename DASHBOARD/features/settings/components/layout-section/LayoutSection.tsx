import React from "react";
import HeaderSettingsContent from "../header-settings/HeaderSettingsContent";
import { DashboardWidthSetting } from "./DashboardWidthSetting";
import { CompactLayoutToggles } from "./CompactLayoutToggles";

interface LayoutSectionProps {
  headerPosition: "top" | "left";
  setHeaderPosition: (val: "top" | "left") => void;
  headerTitle: string;
  setHeaderTitle: (val: string) => void;
  dashboardWidth: 1 | 2 | 3 | 4 | 5;
  setDashboardWidth: (val: 1 | 2 | 3 | 4 | 5) => void;
  isGroupsCompactLayout: boolean;
  setIsGroupsCompactLayout: (val: boolean) => void;
  isSegmentsCompactLayout: boolean;
  setIsSegmentsCompactLayout: (val: boolean) => void;
  dashboardViewMode: "grid" | "free_canvas";
  setDashboardViewMode: (val: "grid" | "free_canvas") => void;
}

export default function LayoutSection({
  headerPosition, setHeaderPosition,
  headerTitle, setHeaderTitle,
  dashboardWidth, setDashboardWidth,
  isGroupsCompactLayout, setIsGroupsCompactLayout,
  isSegmentsCompactLayout, setIsSegmentsCompactLayout,
  dashboardViewMode, setDashboardViewMode,
}: LayoutSectionProps) {
  return (
    <div className="space-y-6">
      <div className="bg-[var(--card-bg-solid)] border border-[var(--border-color)] p-4 space-y-4 rounded-2xl text-right">
        <HeaderSettingsContent
          headerPosition={headerPosition}
          setHeaderPosition={setHeaderPosition}
          headerTitle={headerTitle}
          setHeaderTitle={setHeaderTitle}
        />
      </div>

      <div className="bg-[var(--card-bg-solid)] border border-[var(--border-color)] p-4 space-y-5 rounded-2xl text-right">
        {/* Dashboard View Mode Selector */}
        <div className="flex flex-col gap-2 pb-3 border-b border-[var(--border-color)]">
          <div className="flex items-center justify-between">
            <div className="text-right flex-1 ml-4">
              <h4 className="text-sm font-bold text-[var(--text-primary)] mb-1">حالت نمایش داشبورد</h4>
              <p className="text-[10px] text-[var(--text-secondary)]">انتخاب بین حالت شبکه استاندارد عمودی یا بوم آزاد افقی/عمودی</p>
            </div>
            <div className="flex bg-[var(--bg-main)] border border-[var(--border-color)] p-0.5 rounded-xl text-xs gap-0.5 shrink-0" dir="rtl">
              <button
                onClick={() => setDashboardViewMode("grid")}
                className={`px-3 py-1.5 flex items-center justify-center rounded-lg transition-all cursor-pointer text-[11px] font-bold ${
                  dashboardViewMode === "grid"
                    ? "bg-[var(--accent3-transparent)] text-[var(--accent3)] shadow-xs border border-[var(--accent3-medium)]"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-transparent"
                }`}
              >
                شبکه عمودی
              </button>
              <button
                onClick={() => setDashboardViewMode("free_canvas")}
                className={`px-3 py-1.5 flex items-center justify-center rounded-lg transition-all cursor-pointer text-[11px] font-bold ${
                  dashboardViewMode === "free_canvas"
                    ? "bg-[var(--accent3-transparent)] text-[var(--accent3)] shadow-xs border border-[var(--accent3-medium)]"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-transparent"
                }`}
              >
                بوم آزاد (N8N)
              </button>
            </div>
          </div>
        </div>

        <DashboardWidthSetting 
          dashboardWidth={dashboardWidth} 
          setDashboardWidth={setDashboardWidth} 
        />
        <CompactLayoutToggles 
          isGroupsCompactLayout={isGroupsCompactLayout}
          setIsGroupsCompactLayout={setIsGroupsCompactLayout}
          isSegmentsCompactLayout={isSegmentsCompactLayout}
          setIsSegmentsCompactLayout={setIsSegmentsCompactLayout}
        />
      </div>
    </div>
  );
}
