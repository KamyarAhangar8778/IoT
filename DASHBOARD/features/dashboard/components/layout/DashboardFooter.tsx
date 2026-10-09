"use client";

import React from "react";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";

export default function DashboardFooter() {
  const activeGroupId = useIoTStore(s => s.activeGroupId);
  const activeSegmentId = useIoTStore(s => s.activeSegmentId);
  const isDragging = !!activeGroupId || !!activeSegmentId;

  if (isDragging) return null;

  return (
    <footer
      id="dashboard-footer"
      className="relative z-20 w-full border-t border-[var(--border-color)] bg-[var(--card-bg)]/85 backdrop-blur-md py-2.5 px-6 mt-auto text-center text-[10px] theme-text-secondary font-sans transition-all duration-300 shadow-sm"
    >
      <div className="w-full max-w-7xl mx-auto flex flex-col items-center justify-center">
        <span className="footer-animated-text block opacity-70">
          سامانه هوشمند و داشبورد تعاملی مانیتورینگ صنعت اینترنت اشیاء (الهام گرفته از طراحی کلودفلر)
        </span>
      </div>
    </footer>
  );
}
