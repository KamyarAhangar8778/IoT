import { RenderGridConfig } from "./types";

const LUT_SIZE = 3600;
const SIN_LUT = new Float32Array(LUT_SIZE);
const COS_LUT = new Float32Array(LUT_SIZE);

for (let i = 0; i < LUT_SIZE; i++) {
  const rad = (i / LUT_SIZE) * Math.PI * 2;
  SIN_LUT[i] = Math.sin(rad);
  COS_LUT[i] = Math.cos(rad);
}

const FAST_RAD_CONVERSION = LUT_SIZE / (Math.PI * 2);
const GLOW_RADIUS = 320;
const GLOW_RADIUS_SQ = GLOW_RADIUS * GLOW_RADIUS;
const INTENSITY_LUT = new Float32Array(GLOW_RADIUS_SQ + 1);

for (let dSq = 0; dSq <= GLOW_RADIUS_SQ; dSq++) {
  const dist = Math.sqrt(dSq);
  INTENSITY_LUT[dSq] = 1 - Math.pow(dist / GLOW_RADIUS, 1.4);
}

const TWINKLE_LUT_SIZE = 1000;
const TWINKLE_POW_LUT = new Float32Array(TWINKLE_LUT_SIZE + 1);
for (let i = 0; i <= TWINKLE_LUT_SIZE; i++) {
  TWINKLE_POW_LUT[i] = Math.pow(i / TWINKLE_LUT_SIZE, 1.5);
}

function fastSin(rad: number): number {
  let idx = (rad * FAST_RAD_CONVERSION) % LUT_SIZE;
  if (idx < 0) idx += LUT_SIZE;
  return SIN_LUT[idx | 0];
}

function fastCos(rad: number): number {
  let idx = (rad * FAST_RAD_CONVERSION) % LUT_SIZE;
  if (idx < 0) idx += LUT_SIZE;
  return COS_LUT[idx | 0];
}

/**
 * Renders the cuneiform / matrix geometric grid onto the 2D canvas.
 * Utilizes precalculated trigonometry LUTs and continuous coordinate waves for constant, smooth 60fps performance.
 *
 * @param config Configuration containing dimensions, time offset, colors, and effects.
 */
export function renderGrid({
  ctx,
  width,
  height,
  time,
  pointer,
  matrixDensity,
  matrixSize,
  matrixHoverSize,
  matrixOpacity,
  matrixColor,
  matrixMouseEffect,
  matrixTwinkleEffect,
  matrixTwinkleSpeed,
  isDark,
  animationsEnabled,
  isMobile,
}: RenderGridConfig) {
  const SPACING = Math.max(15, matrixDensity);
  const CROSS_SIZE = Math.max(1, matrixSize);
  const effectiveMouseEffect = matrixMouseEffect && !isMobile;

  const speedX = 0.35;
  const speedY = 0.35;
  const rawOffsetX = time * speedX;
  const rawOffsetY = time * speedY;
  const offsetX = rawOffsetX % SPACING;
  const offsetY = rawOffsetY % SPACING;

  ctx.clearRect(0, 0, width, height);

  // Mouse radial light spotlight
  if (effectiveMouseEffect && pointer.x > -500) {
    const gradient = ctx.createRadialGradient(
      pointer.x,
      pointer.y,
      0,
      pointer.x,
      pointer.y,
      GLOW_RADIUS
    );
    gradient.addColorStop(0, `${matrixColor}40`);
    gradient.addColorStop(0.6, `${matrixColor}15`);
    gradient.addColorStop(1, "transparent");

    ctx.globalAlpha = Math.min(1, (matrixOpacity / 100) * 1.5);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }

  const baseAlpha = Math.max(0.08, matrixOpacity / 100);
  const baseColor = isDark ? "rgba(255, 255, 255, 0.55)" : "rgba(30, 41, 59, 0.45)";

  ctx.lineWidth = 1.25;
  ctx.beginPath();
  const activePoints: Array<{ posX: number; posY: number; currentSize: number; currentAlpha: number; color: string }> = [];

  const twinkleSpeed = (matrixTwinkleSpeed || 50) * 0.0003;

  for (let x = -SPACING; x < width + SPACING; x += SPACING) {
    for (let y = -SPACING; y < height + SPACING; y += SPACING) {
      const posX = x + offsetX;
      const posY = y + offsetY;

      let currentAlpha = baseAlpha;
      let currentSize = CROSS_SIZE;
      let color = baseColor;
      let isDefault = true;

      // Twinkle calculation based on continuous world coordinates to prevent phase jumps
      let twinkleFactor = 0;
      if (matrixTwinkleEffect && animationsEnabled) {
        const continuousX = x + rawOffsetX;
        const continuousY = y + rawOffsetY;

        const wave1 = fastSin(continuousX * 0.0035 + continuousY * 0.0068 + time * twinkleSpeed);
        const wave2 = fastCos(continuousX * 0.0057 - continuousY * 0.0039 + time * twinkleSpeed * 1.3);
        const wave3 = fastSin(continuousX * 0.0092 + continuousY * 0.0024 - time * twinkleSpeed * 0.8);
        const combined = (wave1 + wave2 + wave3) / 3;

        if (combined > 0.65) {
          const factor = Math.min(1, (combined - 0.65) * 2.85);
          twinkleFactor = TWINKLE_POW_LUT[(factor * TWINKLE_LUT_SIZE) | 0];
          isDefault = false;
        }
      }

      // Mouse proximity calculation
      if (effectiveMouseEffect) {
        const dx = pointer.x - posX;
        const dy = pointer.y - posY;
        const distSq = dx * dx + dy * dy;

        if (distSq <= GLOW_RADIUS_SQ) {
          const intensity = INTENSITY_LUT[distSq | 0];
          currentAlpha = Math.min(1, baseAlpha + intensity * (1 - baseAlpha));
          currentSize = CROSS_SIZE + intensity * matrixHoverSize;
          color = matrixColor;
          isDefault = false;
        }
      }

      if (twinkleFactor > 0) {
        currentAlpha = Math.min(1, Math.max(currentAlpha, baseAlpha + twinkleFactor * (1 - baseAlpha)));
        currentSize = Math.max(currentSize, CROSS_SIZE + twinkleFactor * matrixHoverSize);
        color = matrixColor;
      }

      if (isDefault) {
        ctx.moveTo(posX - currentSize, posY);
        ctx.lineTo(posX + currentSize, posY);
        ctx.moveTo(posX, posY - currentSize);
        ctx.lineTo(posX, posY + currentSize);
      } else {
        activePoints.push({ posX, posY, currentSize, currentAlpha, color });
      }
    }
  }

  // Draw batch default static grid points
  ctx.globalAlpha = baseAlpha;
  ctx.strokeStyle = baseColor;
  ctx.stroke();

  // Draw active / hovered / twinkling points
  for (let i = 0; i < activePoints.length; i++) {
    const p = activePoints[i];
    ctx.globalAlpha = p.currentAlpha;
    ctx.strokeStyle = p.color;
    ctx.beginPath();
    ctx.moveTo(p.posX - p.currentSize, p.posY);
    ctx.lineTo(p.posX + p.currentSize, p.posY);
    ctx.moveTo(p.posX, p.posY - p.currentSize);
    ctx.lineTo(p.posX, p.posY + p.currentSize);
    ctx.stroke();
  }
}
