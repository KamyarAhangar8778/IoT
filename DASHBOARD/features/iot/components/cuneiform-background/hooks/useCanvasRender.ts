"use client";

import { useEffect, useRef } from "react";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";
import { CuneiformBackgroundProps } from "../core/types";
import { renderGrid } from "../core/renderGrid";

interface UseCanvasRenderParams extends Omit<CuneiformBackgroundProps, "accent3"> {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  pointerRef: React.MutableRefObject<{ x: number; y: number }>;
  targetPointerRef: React.MutableRefObject<{ x: number; y: number }>;
}

/**
 * Custom hook to manage 2D canvas animation for the cuneiform matrix background.
 * Uses a persistent RAF loop with monotonic time delta for rock-solid, constant animation speed.
 *
 * @param params Configuration parameters including canvas ref, colors, and animation controls.
 */
export function useCanvasRender(params: UseCanvasRenderParams) {
  const isPageVisible = useIoTStore((state) => state.isPageVisible);
  const timeRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Store latest params in a ref to avoid tearing down the RAF loop on every state change
  const paramsRef = useRef(params);
  paramsRef.current = params;

  const isVisibleRef = useRef(isPageVisible);
  isVisibleRef.current = isPageVisible;

  useEffect(() => {
    const canvas = params.canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const checkIsMobile = () =>
      typeof window !== "undefined" &&
      (window.innerWidth <= 768 ||
        window.matchMedia("(pointer: coarse)").matches ||
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0);

    const updateCanvasDimensions = () => {
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

    updateCanvasDimensions();
    window.addEventListener("resize", updateCanvasDimensions);

    const render = (currentTime: number) => {
      animFrameIdRef.current = requestAnimationFrame(render);

      if (!isVisibleRef.current) {
        lastTimeRef.current = null;
        return;
      }

      if (lastTimeRef.current === null) {
        lastTimeRef.current = currentTime;
      }

      // Clamp delta to prevent speed jumps after tab switches or frame drops
      const deltaMs = Math.min(currentTime - lastTimeRef.current, 64);
      lastTimeRef.current = currentTime;

      const p = paramsRef.current;
      const animationsEnabled = p.animationsEnabled ?? true;

      // Constant, uniform speed progression
      if (animationsEnabled && p.matrixMoving) {
        timeRef.current += deltaMs / 16.66667;
      }

      // Smooth pointer easing
      p.pointerRef.current.x += (p.targetPointerRef.current.x - p.pointerRef.current.x) * 0.12;
      p.pointerRef.current.y += (p.targetPointerRef.current.y - p.pointerRef.current.y) * 0.12;

      renderGrid({
        ctx,
        width: window.innerWidth,
        height: window.innerHeight,
        time: timeRef.current,
        pointer: p.pointerRef.current,
        matrixDensity: p.matrixDensity,
        matrixSize: p.matrixSize,
        matrixHoverSize: p.matrixHoverSize,
        matrixOpacity: p.matrixOpacity,
        matrixColor: p.matrixColor,
        matrixMouseEffect: p.matrixMouseEffect,
        matrixTwinkleEffect: p.matrixTwinkleEffect,
        matrixTwinkleSpeed: p.matrixTwinkleSpeed,
        isDark: p.isDark,
        animationsEnabled,
        isMobile: checkIsMobile(),
      });
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", updateCanvasDimensions);
      if (animFrameIdRef.current !== null) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      lastTimeRef.current = null;
    };
  }, [params.canvasRef]);
}
