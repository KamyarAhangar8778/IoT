/**
 * @file ModulesGroupCard.tsx
 * @description Card container rendering specific section inside ModulesWorkspace.
 */

import React, { useState } from "react";
import { MODULES_GROUPS_META } from "./constants";
import { ModulesGroupHeader } from "./ModulesGroupHeader";
import AddSegmentForm from "../modules-drawer/components/AddSegmentForm";
import SegmentList from "../modules-drawer/components/SegmentList";
import ConnectionNote from "../modules-drawer/components/ConnectionNote";
import { ModulesWorkspaceProps } from "./types";

interface ModulesGroupCardProps extends ModulesWorkspaceProps {
  groupId: string;
}

export function ModulesGroupCard({
  groupId,
  onAddSegment,
  onClose,
  segments,
  onRemoveSegment,
  animationsEnabled = true,
  accent3 = "var(--accent3)",
}: ModulesGroupCardProps) {
  const meta = MODULES_GROUPS_META[groupId];
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!meta) return null;

  const renderContent = () => {
    switch (groupId) {
      case "module-add":
        return (
          <AddSegmentForm
            onAddSegment={onAddSegment}
            onClose={onClose || (() => {})}
            segments={segments}
            animationsEnabled={animationsEnabled}
          />
        );
      case "module-list":
        return <SegmentList segments={segments} onRemoveSegment={onRemoveSegment} />;
      case "module-guide":
        return <ConnectionNote accent3={accent3} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:border-[var(--accent3-medium)]">
      <ModulesGroupHeader
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
