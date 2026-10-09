/**
 * @file FormHeader.tsx
 * @description Header component for the automation form.
 */

import React from "react";
import { Edit2, Plus } from "lucide-react";

interface FormHeaderProps {
  editingId: string | null;
}

export function FormHeader({ editingId }: FormHeaderProps) {
  return (
    <h3 className="font-bold text-sm text-[var(--text-primary)] flex items-center gap-2">
      {editingId ? (
        <Edit2 className="w-4 h-4 text-[var(--accent3)]" />
      ) : (
        <Plus className="w-4 h-4 text-[var(--accent3)]" />
      )}
      <span>{editingId ? "ویرایش اتوماسیون" : "افزودن اتوماسیون جدید"}</span>
    </h3>
  );
}
