import React, { useEffect, useRef } from "react";
import { CanvasGridBackgroundProps } from "../core/types";
import { CANVAS_GRID_CONFIG } from "../core/constants";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";

/**
 * Hash helper for deterministic pseudo-random values per grid cell.
 */
function pseudoHash(x: number, y: number): number {
  let h = x * 374761393 + y * 668265263;
  h = (h ^ (h >> 13)) * 1274126177;
  return ((h ^ (h >> 16)) >>> 0) / 4294967296;
}

/**
 * Renders a crisp background dot grid for Free-Canvas with sparse (1 in 10 dots),
 * subtle, and soft individual twinkling star animations.
 */
export const CanvasGridBackground: React.FC<CanvasGridBackgroundProps> = ({
  transform,
  dotSize = CANVAS_GRID_CONFIG.dotRadius,
  gridSpacing = CANVAS_GRID_CONFIG.spacing,
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const isDark = useIoTStore((s) => s.isDark);
  const animationsEnabled = useIoTStore((s) => s.animationsEnabled);
  const matrixOpacity = useIoTStore((s) => s.matrixOpacity);
  const matrixColor = useIoTStore((s) => s.matrixColor);
  const matrixTwinkleEffect = useIoTStore((s) => s.matrixTwinkleEffect);
  const matrixTwinkleSpeed = useIoTStore((s) => s.matrixTwinkleSpeed);
  const matrixMoving = useIoTStore((s) => s.matrixMoving);
  const isPageVisible = useIoTStore((s) => s.isPageVisible);

  const transformRef = useRef(transform);
  transformRef.current = transform;

  const timeRef = useRef(0);
  const animFrameIdRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleResize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const render = (currentTime: number) => {
      animFrameIdRef.current = requestAnimationFrame(render);

      if (!isPageVisible) {
        lastTimeRef.current = null;
        return;
      }

      if (lastTimeRef.current === null) {
        lastTimeRef.current = currentTime;
      }
      const deltaMs = Math.min(currentTime - lastTimeRef.current, 64);
      lastTimeRef.current = currentTime;

      if (animationsEnabled && matrixMoving) {
        timeRef.current += deltaMs / 16.66667;
      }

      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      const t = transformRef.current;
      const spacing = gridSpacing * t.scale;
      if (spacing <= 4) return;

      const offsetX = ((t.x % spacing) + spacing) % spacing;
      const offsetY = ((t.y % spacing) + spacing) % spacing;

      // Base grid dot color & alpha (gentle, clear dots)
      const baseAlpha = Math.max(0.18, (matrixOpacity / 100) * 0.55);
      const baseColor = isDark ? "rgba(255, 255, 255, 0.6)" : "rgba(30, 41, 59, 0.45)";
      const activeColor = matrixColor || "var(--accent3)";

      const speedMult = ((matrixTwinkleSpeed || 50) / 50) * 0.022;
      const time = timeRef.current;
      const radius = dotSize * Math.max(0.75, Math.min(t.scale, 1.6));

      // 1. Draw ALL base grid dots
      ctx.beginPath();
      for (let x = -spacing; x < w + spacing; x += spacing) {
        for (let y = -spacing; y < h + spacing; y += spacing) {
          const posX = x + offsetX;
          const posY = y + offsetY;
          ctx.moveTo(posX + radius, posY);
          ctx.arc(posX, posY, radius, 0, Math.PI * 2);
        }
      }
      ctx.globalAlpha = baseAlpha;
      ctx.fillStyle = baseColor;
      ctx.fill();

      // 2. Draw sparse, subtle individual star twinkles (only ~10% of dots are candidates)
      if (matrixTwinkleEffect && animationsEnabled) {
        for (let x = -spacing; x < w + spacing; x += spacing) {
          for (let y = -spacing; y < h + spacing; y += spacing) {
            const posX = x + offsetX;
            const posY = y + offsetY;

            const gridCellX = Math.round((posX - t.x) / spacing);
            const gridCellY = Math.round((posY - t.y) / spacing);

            // Candidate check: only 1 in 10 dots (10% density) can ever twinkle
            const eligibilityHash = pseudoHash(gridCellX * 7, gridCellY * 11);
            if (eligibilityHash > 0.10) {
              continue;
            }

            const starSeed = pseudoHash(gridCellX, gridCellY);
            const starSpeed = 0.4 + pseudoHash(gridCellY, gridCellX) * 0.8;
            const phase = starSeed * Math.PI * 2;

            // Soft sine breathing
            const starPulse = Math.sin(time * speedMult * starSpeed + phase);

            // Trigger only when pulse reaches near top peak
            if (starPulse > 0.70) {
              const intensity = (starPulse - 0.70) / 0.30; // 0 to 1
              
              // Very gentle radius expansion and subtle soft opacity
              const starRadius = radius + intensity * 0.6;
              const starAlpha = baseAlpha + intensity * 0.45; // Soft glow, not harsh or blinding

              ctx.beginPath();
              ctx.arc(posX, posY, starRadius, 0, Math.PI * 2);
              ctx.globalAlpha = Math.min(0.75, starAlpha);
              ctx.fillStyle = activeColor;
              ctx.fill();
            }
          }
        }
      }
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [
    isDark,
    animationsEnabled,
    matrixOpacity,
    matrixColor,
    matrixTwinkleEffect,
    matrixTwinkleSpeed,
    matrixMoving,
    isPageVisible,
    dotSize,
    gridSpacing,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none z-0 ${className}`}
    />
  );
};
