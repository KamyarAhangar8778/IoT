"use client";

import React from "react";
import DashboardHeader from "./DashboardHeader";
import DashboardMain from "./DashboardMain";
import DashboardFooter from "./DashboardFooter";
import DashboardDrawers from "./DashboardDrawers";
import ToastNotification from "@/features/iot/components/notifications/ToastNotification";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";

/**
 * Fullscreen 2D Free-Canvas (N8N-style) Layout.
 * Renders the canvas edge-to-edge across the entire dashboard with floating Header and Footer overlays.
 */
export default function DashboardFreeCanvasLayout() {
  const headerPosition = useIoTStore((s) => s.headerPosition);

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col justify-between select-none">
      {/* Edge-to-Edge Fullscreen Canvas Plane */}
      <div className="fixed inset-0 w-full h-full z-0 overflow-hidden">
        <DashboardMain />
      </div>

      {/* Floating Header Overlay */}
      {headerPosition === "left" ? (
        <aside className="fixed top-0 left-0 bottom-0 z-30 pointer-events-auto h-screen">
          <DashboardHeader position="left" />
        </aside>
      ) : (
        <div className="fixed top-0 inset-x-0 z-30 pointer-events-none p-3 md:px-8 md:py-4 flex flex-col items-center">
          <div className="w-full max-w-7xl pointer-events-auto">
            <DashboardHeader position="topOrMobile" />
          </div>
        </div>
      )}

      {/* Floating Footer Overlay */}
      <div className="fixed bottom-0 inset-x-0 z-20 pointer-events-none">
        <div className="pointer-events-auto">
          <DashboardFooter />
        </div>
      </div>

      {/* Global Modals, Drawers and Toasts */}
      <DashboardDrawers />
      <ToastNotification />
    </div>
  );
}
