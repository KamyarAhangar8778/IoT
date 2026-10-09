/**
 * @file ModulesWorkspace.tsx
 * @description Main workspace view for Modules matching SettingsWorkspace group-segment layout.
 */

import React, { useState } from "react";
import { MODULES_GROUPS_ORDER, MODULES_GROUPS_META } from "./constants";
import { ModulesFilterSelector } from "./ModulesFilterSelector";
import { ModulesGroupCard } from "./ModulesGroupCard";
import { ModulesCategory, ModulesWorkspaceProps } from "./types";

export function ModulesWorkspace(props: ModulesWorkspaceProps) {
  const [selectedCategory, setSelectedCategory] = useState<ModulesCategory>("all");

  const filteredGroups = MODULES_GROUPS_ORDER.filter((id) => {
    if (selectedCategory === "all") return true;
    const meta = MODULES_GROUPS_META[id];
    return meta?.category === selectedCategory;
  });

  return (
    <div className="w-full min-h-[70vh] flex flex-col items-center animate-fadeIn font-sans">
      <ModulesFilterSelector
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        onClose={props.onClose}
      />

      <div className="w-full columns-1 lg:columns-2 gap-6 space-y-6 [&>div]:break-inside-avoid">
        {filteredGroups.map((groupId) => (
          <ModulesGroupCard key={groupId} groupId={groupId} {...props} />
        ))}
      </div>
    </div>
  );
}
