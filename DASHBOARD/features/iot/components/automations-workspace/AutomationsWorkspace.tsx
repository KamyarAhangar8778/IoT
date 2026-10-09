/**
 * @file AutomationsWorkspace.tsx
 * @description Main workspace view for Automations matching SettingsWorkspace layout.
 */

import React, { useState } from "react";
import { AUTOMATIONS_GROUPS_ORDER, AUTOMATIONS_GROUPS_META } from "./constants";
import { AutomationsFilterSelector } from "./AutomationsFilterSelector";
import { AutomationsGroupCard } from "./AutomationsGroupCard";
import { AutomationsCategory, AutomationsWorkspaceProps } from "./types";
import { useAutomationForm } from "../AutomationsDrawer/hooks/useAutomationForm";

export function AutomationsWorkspace({ onClose }: AutomationsWorkspaceProps) {
  const [selectedCategory, setSelectedCategory] = useState<AutomationsCategory>("all");
  const formHook = useAutomationForm();

  const filteredGroups = AUTOMATIONS_GROUPS_ORDER.filter((id) => {
    if (selectedCategory === "all") return true;
    const meta = AUTOMATIONS_GROUPS_META[id];
    return meta?.category === selectedCategory;
  });

  return (
    <div className="w-full min-h-[70vh] flex flex-col items-center animate-fadeIn font-sans">
      <AutomationsFilterSelector
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        onClose={onClose}
      />

      <div className="w-full columns-1 lg:columns-2 gap-6 space-y-6 [&>div]:break-inside-avoid">
        {filteredGroups.map((groupId) => (
          <AutomationsGroupCard key={groupId} groupId={groupId} formHook={formHook} />
        ))}
      </div>
    </div>
  );
}
