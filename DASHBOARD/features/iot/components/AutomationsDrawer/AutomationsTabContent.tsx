/**
 * @file AutomationsTabContent.tsx
 * @description Tab content switcher for AutomationsDrawer with smooth animations.
 */

import React from "react";
import AutomationForm from "./components/AutomationForm";
import AutomationList from "./components/AutomationList";
import AutomationGuide from "./components/AutomationGuide";

interface AutomationsTabContentProps {
  activeTab: string;
  formHook: any;
}

/**
 * AutomationsTabContent renders the view corresponding to the active tab.
 */
export function AutomationsTabContent({ activeTab, formHook }: AutomationsTabContentProps) {
  switch (activeTab) {
    case "add":
      return <AutomationForm formHook={formHook} />;
    case "list":
      return (
        <AutomationList
          handleEdit={formHook.handleEdit}
          handleDelete={formHook.handleDelete}
          handleToggle={formHook.handleToggle}
        />
      );
    case "guide":
      return <AutomationGuide />;
    default:
      return <AutomationForm formHook={formHook} />;
  }
}
