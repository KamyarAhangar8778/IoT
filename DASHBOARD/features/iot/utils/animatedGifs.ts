import { COLOR_ANIMATED_GIFS, type AnimatedItem } from "./colorGifsData";
import { MONO_ANIMATED_GIFS, type MonoAnimatedItem } from "./monoGifsData";

export { COLOR_ANIMATED_GIFS, MONO_ANIMATED_GIFS };
export type { AnimatedItem, MonoAnimatedItem };

export const ANIMATED_GIFS = COLOR_ANIMATED_GIFS;

/** Check whether a value is any type of animated icon (Color GIF/APNG or Monochrome Animated) */
export function isGifIcon(value?: string | null): boolean {
  if (!value) return false;
  return (
    value.startsWith("gif:") ||
    value.startsWith("mgif:") ||
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("data:image/") ||
    /\.(png|gif|webp|apng)(\?.*)?$/i.test(value)
  );
}

/** Check whether a value is a monochrome animated icon */
export function isMonoGif(value?: string | null): boolean {
  if (!value) return false;
  return value.startsWith("mgif:");
}

/** Resolve direct URL for a Color GIF icon key */
export function getGifUrl(value: string): string {
  if (value.startsWith("gif:")) {
    const item = COLOR_ANIMATED_GIFS.find((g) => g.id === value);
    if (item) return item.url;
  }
  return value;
}

/** Resolve info for a monochrome animated icon */
export function getMonoGifData(value: string): MonoAnimatedItem | undefined {
  if (value.startsWith("mgif:")) {
    return MONO_ANIMATED_GIFS.find((m) => m.id === value);
  }
  return undefined;
}
