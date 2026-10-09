import React, { useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { useSettingsDnd } from "./useSettingsDnd";
import { SettingsFilterSelector } from "./SettingsFilterSelector";
import { SortableSettingsGroup } from "./SortableSettingsGroup";
import { SETTINGS_GROUPS_META } from "./constants";
import { SettingsWorkspaceProps, SettingsCategory } from "./types";

export function SettingsWorkspace(props: SettingsWorkspaceProps) {
  const { sensors, settingsGroupsOrder, handleDragStart, handleDragEnd } = useSettingsDnd();
  const [selectedCategory, setSelectedCategory] = useState<SettingsCategory>("all");

  const filteredGroups = settingsGroupsOrder.filter((id) => {
    if (selectedCategory === "all") return true;
    const meta = SETTINGS_GROUPS_META[id];
    return meta?.category === selectedCategory;
  });

  return (
    <div className="w-full min-h-[70vh] flex flex-col items-center animate-fadeIn">
      <SettingsFilterSelector
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={filteredGroups} strategy={rectSortingStrategy}>
          <div className="w-full columns-1 lg:columns-2 gap-6 space-y-6 [&>div]:break-inside-avoid">
            {filteredGroups.map((id) => (
              <SortableSettingsGroup key={id} id={id} {...props} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
