"use client";

export const dynamic = "force-dynamic";

import React from "react";
import { useAchaemenidState } from "@/features/iot/hooks/useAchaemenidState";
import { DashboardContext } from "@/features/dashboard";
import nextDynamic from "next/dynamic";

const AchaemenidDashboard = nextDynamic(
  () => import("@/features/dashboard").then(mod => mod.DashboardContainer),
  { ssr: false, loading: () => <div className="min-h-screen bg-[#0b0c10]" /> },
);

export default function Home() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-[#0b0c10]" />}>
      <UnifiedDashboardRoot />
    </React.Suspense>
  );
}

function UnifiedDashboardRoot() {
  // Shared Backend State Engine (MQTT, Cloudflare, ESP32, State)
  const state = useAchaemenidState();

  return (
    <DashboardContext.Provider value={state}>
      <AchaemenidDashboard />
    </DashboardContext.Provider>
  );
}


