"use client";

import React, { useState } from "react";
import { ICON_MAP } from "@/features/iot/utils/icons";
import MonoAnimatedIcon from "@/components/icons/mono-animated/MonoAnimatedIcon";
import {
  isMonoGif,
  getMonoGifData,
  isGifIcon,
  getGifUrl,
} from "@/features/iot/utils/animatedGifs";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";

interface WidgetIconProps {
  icon?: string | null;
  defaultIcon?: string;
  className?: string;
  size?: number;
  style?: React.CSSProperties;
  animationsEnabled?: boolean;
}

/**
 * Universal widget icon renderer supporting:
 * 1. Multi-part Animated Monochrome Icons (mgif: or plain icon names when animationsEnabled is true)
 * 2. Animated 3D Stickers (gif: / URLs)
 * 3. Static Lucide SVG icons (when animations are disabled)
 * 4. Text Emojis
 */
export default function WidgetIcon({
  icon,
  defaultIcon = "Cpu",
  className = "w-4 h-4",
  size,
  style,
  animationsEnabled,
}: WidgetIconProps) {
  const [hasImageError, setHasImageError] = useState(false);
  const storeAnimationsEnabled = useIoTStore((s) => s.animationsEnabled);
  const isAnimated = animationsEnabled !== undefined ? animationsEnabled : storeAnimationsEnabled;
  const targetIcon = icon || defaultIcon;

  if (!targetIcon) return null;

  // Extract clean icon name if it has mgif: prefix or is a plain icon name
  const isMono = isMonoGif(targetIcon);
  const cleanMonoName = isMono
    ? (getMonoGifData(targetIcon)?.iconName || targetIcon.replace("mgif:", ""))
    : targetIcon;

  // 1. Monochrome Icons (both mgif:... and standard Lucide keys in ICON_MAP)
  if (isMono || ICON_MAP[cleanMonoName]) {
    if (isAnimated) {
      return (
        <span
          className={`inline-flex items-center justify-center ${className}`}
          style={{
            width: size ? `${size}px` : undefined,
            height: size ? `${size}px` : undefined,
            ...style,
          }}
        >
          <MonoAnimatedIcon
            iconName={cleanMonoName}
            className="w-full h-full object-contain"
            animationsEnabled={true}
          />
        </span>
      );
    }

    // Static Lucide Icon when animations are disabled
    const LucideComponent = ICON_MAP[cleanMonoName] || ICON_MAP["Cpu"];
    return (
      <LucideComponent
        className={className}
        style={{
          width: size ? `${size}px` : undefined,
          height: size ? `${size}px` : undefined,
          ...style,
        }}
      />
    );
  }

  // 2. Animated Color GIF / APNG Sticker (gif:... or image URL)
  if (isGifIcon(targetIcon) && !hasImageError) {
    const src = getGifUrl(targetIcon);
    return (
      <img
        src={src}
        alt="widget-icon"
        className={`object-contain inline-block select-none pointer-events-none ${className}`}
        style={{
          width: size ? `${size}px` : undefined,
          height: size ? `${size}px` : undefined,
          ...style,
        }}
        loading="lazy"
        decoding="async"
        onError={() => setHasImageError(true)}
      />
    );
  }

  // 3. Static Lucide Icon fallback
  if (ICON_MAP[targetIcon]) {
    const LucideComponent = ICON_MAP[targetIcon];
    return (
      <LucideComponent
        className={className}
        style={{
          width: size ? `${size}px` : undefined,
          height: size ? `${size}px` : undefined,
          ...style,
        }}
      />
    );
  }

  // 4. Colored Emoji Sticker
  return (
    <span
      className={`leading-none flex items-center justify-center select-none ${className}`}
      style={{
        fontSize: size ? `${size}px` : undefined,
        lineHeight: 1,
        ...style,
      }}
    >
      {targetIcon}
    </span>
  );
}
