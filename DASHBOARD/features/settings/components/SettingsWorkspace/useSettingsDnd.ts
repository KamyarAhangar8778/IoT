import { useState } from "react";
import {
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates, arrayMove } from "@dnd-kit/sortable";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";

export function useSettingsDnd() {
  const settingsGroupsOrder = useIoTStore((s) => s.settingsGroupsOrder);
  const setSettingsGroupsOrder = useIoTStore((s) => s.setSettingsGroupsOrder);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      const oldIndex = settingsGroupsOrder.indexOf(String(active.id));
      const newIndex = settingsGroupsOrder.indexOf(String(over.id));
      if (oldIndex !== -1 && newIndex !== -1) {
        setSettingsGroupsOrder(arrayMove(settingsGroupsOrder, oldIndex, newIndex));
      }
    }
  };

  return {
    sensors,
    activeId,
    settingsGroupsOrder,
    handleDragStart,
    handleDragEnd,
  };
}
