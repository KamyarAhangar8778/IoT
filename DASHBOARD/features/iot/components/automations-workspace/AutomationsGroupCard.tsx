/**
 * @file AutomationsGroupCard.tsx
 * @description Card container for individual automation groups.
 */

import React, { useState } from "react";
import { AUTOMATIONS_GROUPS_META } from "./constants";
import { AutomationsGroupHeader } from "./AutomationsGroupHeader";
import AutomationForm from "../AutomationsDrawer/components/AutomationForm";
import AutomationList from "../AutomationsDrawer/components/AutomationList";
import AutomationGuide from "../AutomationsDrawer/components/AutomationGuide";
import { useAutomationForm } from "../AutomationsDrawer/hooks/useAutomationForm";

interface AutomationsGroupCardProps {
  groupId: string;
  formHook: ReturnType<typeof useAutomationForm>;
}

export function AutomationsGroupCard({ groupId, formHook }: AutomationsGroupCardProps) {
  const meta = AUTOMATIONS_GROUPS_META[groupId];
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!meta) return null;

  const renderContent = () => {
    switch (groupId) {
      case "automation-builder":
        return <AutomationForm formHook={formHook} />;
      case "automation-list":
        return (
          <AutomationList
            handleEdit={formHook.handleEdit}
            handleDelete={formHook.handleDelete}
            handleToggle={formHook.handleToggle}
          />
        );
      case "automation-guide":
        return <AutomationGuide />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:border-[var(--accent3-medium)]">
      <AutomationsGroupHeader
        meta={meta}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />
      {!isCollapsed && (
        <div className="p-3.5 md:p-4 text-right space-y-3 animate-fadeIn">
          {renderContent()}
        </div>
      )}
    </div>
  );
}
