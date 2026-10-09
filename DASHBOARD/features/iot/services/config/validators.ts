import { EspConfig } from "./types";

/**
 * Validates the raw ESP32 configuration object structure.
 * 
 * @param config - The unknown incoming configuration object.
 * @returns Boolean indicating whether the object strictly matches the EspConfig schema.
 */
export function validateEspConfig(config: any): config is EspConfig {
  if (!config) return false;
  if (typeof config !== "object") return false;
  if (!config.version || typeof config.version !== "string") return false;
  if (!config.preferences || typeof config.preferences !== "object") return false;
  if (!config.layout || typeof config.layout !== "object") return false;
  if (!Array.isArray(config.segments)) return false;

  const prefs = config.preferences;
  if (typeof prefs.theme_mode !== "string") return false;
  if (typeof prefs.accent_color_3 !== "string") return false;
  if (typeof prefs.accent_color_4 !== "string") return false;
  if (typeof prefs.font_family !== "string") return false;
  if (prefs.dashboard_view_mode && prefs.dashboard_view_mode !== "grid" && prefs.dashboard_view_mode !== "free_canvas") {
    return false;
  }

  return true;
}
