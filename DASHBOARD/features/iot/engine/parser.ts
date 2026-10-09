/**
 * @file parser.ts
 * @description Parser and interpreter for Element Engine Protocol protocol files
 */

import { ElementEngineSchema } from "./schema";
import { ElementEngineConfig, ParseResult } from "./types";
import { DEFAULT_ELEMENT_CONFIG } from "./presets";

/**
 * Parses raw JSON string or object adhering to Element Engine Protocol.
 * Performs structural validation and fallback merging.
 * @param input JSON string or raw object
 * @returns ParseResult with status, validated config, or errors list
 */
export function parseElementProtocol(input: string | unknown): ParseResult {
  try {
    let rawObj: unknown = input;
    if (typeof input === "string") {
      try {
        rawObj = JSON.parse(input);
      } catch (e) {
        return {
          success: false,
          errors: [`خطا در تجزیه JSON: ${e instanceof Error ? e.message : "فرمت نا معتبر"}`],
        };
      }
    }

    if (!rawObj || typeof rawObj !== "object") {
      return {
        success: false,
        errors: ["محتوای فایل باید یک آبجکت معتبر JSON باشد."],
      };
    }

    // Merge with defaults so missing keys get default values
    const mergedObj = deepMerge(
      DEFAULT_ELEMENT_CONFIG as unknown as Record<string, unknown>,
      rawObj as Record<string, unknown>
    );
    const result = ElementEngineSchema.safeParse(mergedObj);

    if (!result.success) {
      const formattedErrors = result.error.issues.map(
        (issue) => `کلید '${issue.path.join(".")}': ${issue.message}`
      );
      return {
        success: false,
        errors: formattedErrors,
      };
    }

    return {
      success: true,
      config: result.data as ElementEngineConfig,
    };
  } catch (error) {
    return {
      success: false,
      errors: [`خطای غیرمنتظره موتور المنت: ${error instanceof Error ? error.message : "خطای ناشناخته"}`],
    };
  }
}

/**
 * Helper deep merge function for fallback fallback safety.
 */
function deepMerge<T extends Record<string, unknown>>(target: T, source: Record<string, unknown>): T {
  const output = { ...target };
  for (const key of Object.keys(source)) {
    if (source[key] !== null && typeof source[key] === "object" && !Array.isArray(source[key])) {
      if (key in target) {
        (output as Record<string, unknown>)[key] = deepMerge(
          (target as Record<string, unknown>)[key] as Record<string, unknown>,
          source[key] as Record<string, unknown>
        );
      } else {
        (output as Record<string, unknown>)[key] = source[key];
      }
    } else if (source[key] !== undefined) {
      (output as Record<string, unknown>)[key] = source[key];
    }
  }
  return output;
}
