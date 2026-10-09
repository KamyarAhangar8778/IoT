/**
 * @file ModulesTabContent.tsx
 * @description Tab content switcher for ModulesDrawer.
 */

import React from "react";
import AddSegmentForm from "./AddSegmentForm";
import SegmentList from "./SegmentList";
import ConnectionNote from "./ConnectionNote";
import { Segment } from "../core/types";

interface ModulesTabContentProps {
  activeTab: string;
  onAddSegment: (
    type: string,
    pin: string,
    title?: string,
    group?: string,
    mode?: "switch" | "push",
    auto_off?: number,
    icon?: string,
    groupIcon?: string
  ) => void;
  onClose: () => void;
  segments: Segment[];
  onRemoveSegment: (id: string) => void;
  animationsEnabled: boolean;
  accent3: string;
}

export function ModulesTabContent({
  activeTab,
  onAddSegment,
  onClose,
  segments,
  onRemoveSegment,
  animationsEnabled,
  accent3,
}: ModulesTabContentProps) {
  switch (activeTab) {
    case "add":
      return (
        <AddSegmentForm
          onAddSegment={onAddSegment}
          onClose={onClose}
          segments={segments}
          animationsEnabled={animationsEnabled}
        />
      );
    case "list":
      return <SegmentList segments={segments} onRemoveSegment={onRemoveSegment} />;
    case "config":
      return <ConnectionNote accent3={accent3} />;
    default:
      return (
        <AddSegmentForm
          onAddSegment={onAddSegment}
          onClose={onClose}
          segments={segments}
          animationsEnabled={animationsEnabled}
        />
      );
  }
}
