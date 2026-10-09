/**
 * @file registry.ts
 * @description Windows Registry-like key-value interface for Element Engine Protocol
 */

import { ElementEngineConfig } from "./types";
import { DEFAULT_ELEMENT_CONFIG } from "./presets";

export interface RegistryItem {
  keyPath: string;
  category: string;
  value: string | number | boolean;
  type: "string" | "number" | "boolean";
}

/**
 * Flattens nested ElementEngineConfig into dot-notation registry key paths.
 * Example: "segments.activeCardBg" => "rgba(37, 99, 235, 0.2)"
 */
export function flattenRegistry(config: ElementEngineConfig): RegistryItem[] {
  const items: RegistryItem[] = [];

  function traverse(obj: Record<string, unknown>, prefix = "") {
    for (const key of Object.keys(obj)) {
      const currentPath = prefix ? `${prefix}.${key}` : key;
      const val = obj[key];

      if (val !== null && typeof val === "object" && !Array.isArray(val)) {
        traverse(val as Record<string, unknown>, currentPath);
      } else if (val !== undefined && typeof val !== "function") {
        const category = currentPath.split(".")[0];
        const valType = typeof val as "string" | "number" | "boolean";
        items.push({
          keyPath: currentPath,
          category,
          value: val as string | number | boolean,
          type: valType,
        });
      }
    }
  }

  traverse(config as unknown as Record<string, unknown>);
  return items;
}

/**
 * Reads a value from the registry via dot-notation key path.
 */
export function getRegistryValue(config: ElementEngineConfig, keyPath: string): unknown {
  const parts = keyPath.split(".");
  let current: unknown = config;

  for (const part of parts) {
    if (current && typeof current === "object" && part in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }
  return current;
}

/**
 * Updates a value in the registry at dot-notation key path.
 * Returns a new immutably updated ElementEngineConfig object.
 */
export function setRegistryValue(
  config: ElementEngineConfig,
  keyPath: string,
  newValue: unknown
): ElementEngineConfig {
  const parts = keyPath.split(".");
  const newConfig = JSON.parse(JSON.stringify(config)) as Record<string, unknown>;

  let current = newConfig;
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (!current[part] || typeof current[part] !== "object") {
      current[part] = {};
    }
    current = current[part] as Record<string, unknown>;
  }

  current[parts[parts.length - 1]] = newValue;
  return newConfig as unknown as ElementEngineConfig;
}

/**
 * Exports config to formatted JSON string suitable for .element.json download.
 */
export function exportRegistryJSON(config: ElementEngineConfig): string {
  return JSON.stringify(config, null, 2);
}
