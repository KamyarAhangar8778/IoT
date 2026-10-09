export interface CuneiformBackgroundProps {
  isDark: boolean;
  matrixDensity: number;
  matrixSize: number;
  matrixHoverSize: number;
  matrixOpacity: number;
  matrixColor: string;
  matrixMoving: boolean;
  matrixMouseEffect: boolean;
  matrixTwinkleEffect: boolean;
  matrixTwinkleSpeed: number;
  accent3: string;
  animationsEnabled?: boolean;
  animationsFps?: number;
}

export interface RenderGridConfig {
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
  width: number;
  height: number;
  time: number;
  pointer: { x: number; y: number };
  matrixDensity: number;
  matrixSize: number;
  matrixHoverSize: number;
  matrixOpacity: number;
  matrixColor: string;
  matrixMouseEffect: boolean;
  matrixTwinkleEffect: boolean;
  matrixTwinkleSpeed: number;
  isDark: boolean;
  animationsEnabled: boolean;
  isMobile: boolean;
}
