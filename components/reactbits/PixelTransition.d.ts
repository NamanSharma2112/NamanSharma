import type { CSSProperties, ReactNode } from 'react';

export default function PixelTransition(props: {
  firstContent: ReactNode;
  secondContent: ReactNode;
  gridSize?: number;
  pixelColor?: string;
  animationStepDuration?: number;
  once?: boolean;
  aspectRatio?: string;
  /** Omit to transition on hover; pass a boolean to drive it from outside. */
  active?: boolean;
  className?: string;
  style?: CSSProperties;
}): JSX.Element;
