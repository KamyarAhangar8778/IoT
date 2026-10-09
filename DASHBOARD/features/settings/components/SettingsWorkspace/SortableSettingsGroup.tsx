import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SettingsGroupCard } from "./SettingsGroupCard";
import { SettingsWorkspaceProps } from "./types";

interface SortableSettingsGroupProps extends SettingsWorkspaceProps {
  id: string;
}

export function SortableSettingsGroup(props: SortableSettingsGroupProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="w-full">
      <SettingsGroupCard
        {...props}
        groupId={props.id}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}
