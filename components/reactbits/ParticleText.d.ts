import type { CSSProperties } from "react";

/**
 * Types for the plain-JSX component next to this file.
 *
 * Without it TypeScript infers each prop from its default value, so `fontSize`
 * reads as `string` only — the documented `number | string` is lost, and
 * passing a pixel number is an error at the call site.
 */
export interface ParticleTextProps {
  text?: string;
  particleSize?: number;
  density?: number;
  color?: string;
  highlightColor?: string;
  scatter?: number;
  gatherDuration?: number;
  stagger?: number;
  pointerRepel?: number;
  repelRadius?: number;
  idleDrift?: number;
  trigger?: "mount" | "hover" | "click";
  fontSize?: number | string;
  fontWeight?: number | string;
  fontFamily?: string;
  glow?: boolean;
  className?: string;
  style?: CSSProperties;
}

declare const ParticleText: (props: ParticleTextProps) => JSX.Element;
export default ParticleText;
