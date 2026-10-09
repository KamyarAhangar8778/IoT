"use client";

/**
 * @file ElementEngineStyleProvider.tsx
 * @description React component that subscribes to elementConfig in store and injects dynamic CSS rules
 */

import React, { useEffect } from "react";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";
import { generateElementEngineCSS } from "@/features/iot/engine";

export const ElementEngineStyleProvider: React.FC = () => {
  const elementConfig = useIoTStore((s) => s.elementConfig);

  useEffect(() => {
    const styleId = "element-engine-dynamic-styles";
    let styleEl = document.getElementById(styleId) as HTMLStyleElement | null;

    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }

    styleEl.textContent = generateElementEngineCSS(elementConfig);
  }, [elementConfig]);

  return null;
};
