import React, { useState } from "react";
import { SettingsGroupHeader } from "./SettingsGroupHeader";
import { SETTINGS_GROUPS_META } from "./constants";
import { SettingsWorkspaceProps } from "./types";

import ColorsSection from "../ColorsSection";
import TypographySection from "../TypographySection";
import StabilitySection from "../StabilitySection";
import MatrixSection from "../matrix-section/MatrixSection";
import HeaderSettingsSection from "../HeaderSettingsSection";
import AudioSection from "../audio-section/AudioSection";
import MqttSection from "../mqtt-section/MqttSection";
import MacrosSection from "../macros-section/MacrosSection";
import VoiceCommandsSection from "../voice-commands-section/VoiceCommandsSection";
import WifiSection from "../wifi-section/WifiSection";
import ConditionsSection from "../conditions-section/ConditionsSection";
import LayoutSection from "../layout-section/LayoutSection";

interface SettingsGroupCardProps extends SettingsWorkspaceProps {
  groupId: string;
  dragHandleProps?: Record<string, any>;
}

export function SettingsGroupCard(props: SettingsGroupCardProps) {
  const { groupId, dragHandleProps } = props;
  const meta = SETTINGS_GROUPS_META[groupId];
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!meta) return null;

  const renderContent = () => {
    switch (groupId) {
      case "colors":
        return <ColorsSection accent3={props.accent3} setAccent3={props.setAccent3} accent4={props.accent4} setAccent4={props.setAccent4} isDark={props.isDark} hideHeader={true} />;
      case "fonts":
        return <TypographySection selectedFont={props.selectedFont} setSelectedFont={props.setSelectedFont} hideHeader={true} />;
      case "animations":
        return <StabilitySection animationsEnabled={props.animationsEnabled} setAnimationsEnabled={props.setAnimationsEnabled} animationsFps={props.animationsFps} setAnimationsFps={props.setAnimationsFps} hideHeader={true} isDark={props.isDark} />;
      case "macros":
        return <MacrosSection />;
      case "voice-commands":
        return <VoiceCommandsSection />;
      case "layout":
        return <LayoutSection headerPosition={props.headerPosition} setHeaderPosition={props.setHeaderPosition} headerTitle={props.headerTitle} setHeaderTitle={props.setHeaderTitle} dashboardWidth={props.dashboardWidth} setDashboardWidth={props.setDashboardWidth} isGroupsCompactLayout={props.isGroupsCompactLayout} setIsGroupsCompactLayout={props.setIsGroupsCompactLayout} isSegmentsCompactLayout={props.isSegmentsCompactLayout} setIsSegmentsCompactLayout={props.setIsSegmentsCompactLayout} dashboardViewMode={props.dashboardViewMode} setDashboardViewMode={props.setDashboardViewMode} />;
      case "matrix":
        return <MatrixSection matrixDensity={props.matrixDensity} setMatrixDensity={props.setMatrixDensity} matrixSize={props.matrixSize} setMatrixSize={props.setMatrixSize} matrixHoverSize={props.matrixHoverSize} setMatrixHoverSize={props.setMatrixHoverSize} matrixOpacity={props.matrixOpacity} setMatrixOpacity={props.setMatrixOpacity} matrixColor={props.matrixColor} setMatrixColor={props.setMatrixColor} matrixMoving={props.matrixMoving} setMatrixMoving={props.setMatrixMoving} matrixMouseEffect={props.matrixMouseEffect} setMatrixMouseEffect={props.setMatrixMouseEffect} matrixTwinkleEffect={props.matrixTwinkleEffect} setMatrixTwinkleEffect={props.setMatrixTwinkleEffect} matrixTwinkleSpeed={props.matrixTwinkleSpeed} setMatrixTwinkleSpeed={props.setMatrixTwinkleSpeed} hideHeader={true} accent3={props.accent3} accent4={props.accent4} isDark={props.isDark} dashboardBgColor={props.dashboardBgColor} setDashboardBgColor={props.setDashboardBgColor} dashboardBgOpacity={props.dashboardBgOpacity} setDashboardBgOpacity={props.setDashboardBgOpacity} />;
      case "audio":
        return <AudioSection />;
      case "mqtt":
        return <MqttSection />;
      case "wifi":
        return <WifiSection />;
      case "conditions":
        return <ConditionsSection />;
      case "header-settings":
        return <HeaderSettingsSection headerPosition={props.headerPosition} setHeaderPosition={props.setHeaderPosition} headerTitle={props.headerTitle} setHeaderTitle={props.setHeaderTitle} headerAnimationType={props.headerAnimationType} setHeaderAnimationType={props.setHeaderAnimationType} hideHeader={true} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:border-[var(--accent3-medium)]">
      <SettingsGroupHeader
        meta={meta}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        dragHandleProps={dragHandleProps}
      />
      {!isCollapsed && (
        <div className="p-3.5 md:p-4 text-right space-y-3 animate-fadeIn">
          {renderContent()}
        </div>
      )}
    </div>
  );
}
