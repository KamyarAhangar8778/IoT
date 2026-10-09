"use client";

import React from "react";
import LowDataModeBanner from "@/features/iot/components/notifications/LowDataModeBanner";
import { useDashboard } from "@/features/dashboard/context/DashboardContext";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";
import DashboardWorkspace from "./DashboardWorkspace";
import MobileVoiceCommandButton from "../widgets/MobileVoiceCommandButton";

export default function DashboardMain() {
  const { refetchIot, triggerCloudflarePush } = useDashboard();
  const animationsEnabled = useIoTStore(s => s.animationsEnabled);
  const headerPosition = useIoTStore(s => s.headerPosition);
  const segments = useIoTStore(s => s.segments);
  const lowDataMode = useIoTStore(s => s.lowDataMode);
  const manualSaveMode = useIoTStore(s => s.manualSaveMode);
  const unsavedChangesCount = useIoTStore(s => s.unsavedChangesCount);

  return (
    <>
      {segments.length > 0 && (lowDataMode || (manualSaveMode && unsavedChangesCount > 0)) && (
        <LowDataModeBanner
          lowDataMode={lowDataMode}
          animationsEnabled={animationsEnabled}
          refetchIot={refetchIot}
          headerPosition={headerPosition}
          manualSaveMode={manualSaveMode}
          unsavedChangesCount={unsavedChangesCount}
          triggerCloudflarePush={triggerCloudflarePush}
        />
      )}

      <DashboardWorkspace />
      <MobileVoiceCommandButton />
    </>
  );
}
