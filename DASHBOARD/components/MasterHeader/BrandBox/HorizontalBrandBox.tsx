import Image from "next/image";
import { useDashboard } from "@/features/dashboard/context/DashboardContext";
import GroupFilterSelector from "../GroupFilterSelector";
import MobileDropdownMenu from "./MobileDropdownMenu";
import type { BrandBoxProps } from "./types";

export default function HorizontalBrandBox(props: Omit<BrandBoxProps, "variant">) {
  const {
    headerTitle,
    animationsEnabled,
    groupsOrder,
    selectedGroupFilter,
    setSelectedGroupFilter,
  } = props;
  const { isFullyReady } = useDashboard();

  return (
    <div className="relative z-10 flex items-center justify-between md:justify-start gap-4 shrink-0 w-full md:w-auto">
      <div className="relative z-10 flex items-center gap-3">
        <div className="w-10 h-10 bg-transparent border border-[var(--border-color)] rounded-full shrink-0 flex items-center justify-center overflow-hidden shadow-sm md:hover:border-[var(--accent4)] transition-all">
          <Image
            src="/logo.png"
            alt="Logo"
            width={26}
            height={26}
            className="object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="text-right flex flex-col items-end gap-1">
          <h1 className="font-sans font-extrabold text-[13.5px] md:text-sm tracking-tight leading-tight select-none transition-all duration-300 md:hover:scale-[1.02] title-animated">
            {isFullyReady ? (
              headerTitle
            ) : (
              <div className="w-32 h-4 bg-[var(--text-muted)] opacity-20 rounded animate-pulse" />
            )}
          </h1>
          {groupsOrder && setSelectedGroupFilter ? (
            <div className="mt-1 block md:hidden">
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
      </div>

      {/* Mobile-only Theme Toggle & Menu located in title island for quick reach */}
      <div className="relative z-10 md:hidden">
        <MobileDropdownMenu {...props} />
      </div>
    </div>
  );
}
