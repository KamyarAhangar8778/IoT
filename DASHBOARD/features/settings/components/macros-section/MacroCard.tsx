import React from "react";
import { Edit2, Trash2 } from "lucide-react";
import { WidgetIcon } from "@/components/icons";
import { MacroEditor } from "./MacroEditor";
import { motion } from "motion/react";

interface Props {
  macro: any;
  isEditing: boolean;
  onEditStart: () => void;
  onDelete: () => void;
  newMacroTitle: string;
  setNewMacroTitle: (val: string) => void;
  newMacroIcon: string;
  setNewMacroIcon: (val: string) => void;
  iconMode: "gif-color" | "gif-mono" | "emoji" | "lucide";
  setIconMode: (val: "gif-color" | "gif-mono" | "emoji" | "lucide") => void;
  tempActions: Array<any>;
  setTempActions: (val: Array<any>) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function MacroCard({
  macro, isEditing, onEditStart, onDelete,
  newMacroTitle, setNewMacroTitle,
  newMacroIcon, setNewMacroIcon,
  iconMode, setIconMode,
  tempActions, setTempActions,
  onSave, onCancel
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-[var(--card-bg-solid)] border border-[var(--border-color)] p-4 rounded-2xl shadow-sm flex flex-col gap-3"
    >
      {isEditing ? (
        <MacroEditor
          macro={macro}
          newMacroTitle={newMacroTitle} setNewMacroTitle={setNewMacroTitle}
          newMacroIcon={newMacroIcon} setNewMacroIcon={setNewMacroIcon}
          iconMode={iconMode} setIconMode={setIconMode}
          tempActions={tempActions} setTempActions={setTempActions}
          onSave={onSave} onCancel={onCancel}
        />
      ) : (
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            {macro.icon && (
              <div className="w-10 h-10 flex items-center justify-center bg-[var(--accent3-transparent)] text-[var(--accent3)] border border-[var(--accent3)] rounded-xl text-xl">
                <WidgetIcon icon={macro.icon} className="w-6 h-6 object-contain" />
              </div>
            )}
            <div className="flex flex-col gap-1.5">
              <span className="font-bold text-[var(--text-primary)]">{macro.title}</span>
              <span className="text-xs text-[var(--text-secondary)] opacity-80">
                {macro.actions.length} عملیات
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={onEditStart}
              className="p-2 bg-[var(--card-bg-solid)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--accent3)] hover:border-[var(--accent3)] rounded-xl transition-colors"
              title="ویرایش"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 bg-[var(--card-bg-solid)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--accent4)] hover:border-[var(--accent4)] rounded-xl transition-colors"
              title="حذف"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
