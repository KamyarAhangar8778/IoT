import { PanelLeftClose, PanelRightClose } from "lucide-react";
import Image from "next/image";
import { useDashboard } from "@/features/dashboard/context/DashboardContext";
import GroupFilterSelector from "../GroupFilterSelector";
import HeaderIslandPattern from "../HeaderIslandPattern";
import type { BrandBoxProps } from "./types";

export default function VerticalBrandBox({
  headerTitle,
  animationsEnabled,
  groupsOrder,
  selectedGroupFilter,
  setSelectedGroupFilter,
  isSidebarCollapsed,
  setIsSidebarCollapsed,
}: Omit<BrandBoxProps, "variant">) {
  const { isFullyReady } = useDashboard();

  if (isSidebarCollapsed) {
    return (
      <div className="relative z-10 w-full flex flex-col items-center justify-center gap-2.5 py-1">
        {setIsSidebarCollapsed && (
          <button
            type="button"
            onClick={() => setIsSidebarCollapsed(false)}
            className="relative z-10 p-1.5 text-[var(--text-secondary)] md:hover:text-[var(--accent3)] rounded-lg border border-[var(--border-color)] bg-[var(--card-bg-solid)] md:hover:border-[var(--accent3)]/50 transition-all duration-300 cursor-pointer"
            title="باز کردن منوی کناری"
          >
            <PanelLeftClose className="w-4 h-4 rotate-180" />
          </button>
        )}
        <div className="w-8 h-8 bg-[var(--card-bg-solid)] border border-[var(--border-color)] rounded-full shrink-0 flex items-center justify-center overflow-hidden shadow-sm">
          <Image
            src="/logo.png"
            alt="Logo"
            width={20}
            height={20}
            className="object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10 w-full flex items-center justify-between gap-3 py-1 px-1">
      {setIsSidebarCollapsed && (
        <button
          type="button"
          onClick={() => setIsSidebarCollapsed(true)}
          className="relative z-10 p-1.5 text-[var(--text-secondary)] md:hover:text-[var(--accent3)] rounded-lg border border-[var(--border-color)] bg-[var(--card-bg-solid)] md:hover:border-[var(--accent3)]/50 transition-all duration-300 cursor-pointer"
          title="بستن منوی کناری"
        >
          <PanelRightClose className="w-4 h-4" />
        </button>
      )}

      <div className="relative z-10 flex items-center gap-2.5">
        <div className="text-right flex flex-col items-end gap-0.5">
          <h1 className="font-sans font-extrabold text-[12.5px] tracking-tight leading-tight select-none transition-all duration-300 md:hover:scale-[1.02] title-animated">
            {isFullyReady ? (
              headerTitle
            ) : (
              <div className="w-24 h-3.5 bg-[var(--text-muted)] opacity-20 rounded animate-pulse" />
            )}
          </h1>
          {groupsOrder && setSelectedGroupFilter ? (
            <div className="mt-0.5 block md:hidden">
              <GroupFilterSelector
                groupsOrder={groupsOrder}
                selectedGroupFilter={selectedGroupFilter || null}
                setSelectedGroupFilter={setSelectedGroupFilter}
                animationsEnabled={animationsEnabled}
                isCompact={true}
              />
            </div>
          ) : null}
        </div>
        <div className="w-8 h-8 bg-[var(--card-bg-solid)] border border-[var(--border-color)] rounded-full shrink-0 flex items-center justify-center overflow-hidden shadow-sm md:hover:border-[var(--accent4)] transition-all">
          <Image
            src="/logo.png"
            alt="Logo"
            width={20}
            height={20}
            className="object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </div>
  );
}
