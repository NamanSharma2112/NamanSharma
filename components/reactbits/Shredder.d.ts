import type { ReactNode } from 'react';

/** The props this project uses. The component takes more; see Shredder.jsx. */
export default function Shredder<T extends { id: string | number }>(props: {
  items?: T[];
  renderItem: (item: T, index: number) => ReactNode;
  onShred?: (item: T) => void;
  onReorder?: (items: T[]) => void;
  width?: number;
  height?: number;
  inset?: number;
  gap?: number;
  slitHeight?: number;
  fallHeight?: number;
  feedSpeed?: number;
  bite?: number;
  autoFeed?: boolean;
  stripWidth?: number;
  curl?: number;
  autoAnimate?: boolean;
  loop?: boolean;
  loopAfterDelete?: boolean;
  dragTilt?: number;
  lift?: number;
  slitColor?: string;
  color?: string;
  /** False removes the rollers: rows reorder, nothing is destroyed. */
  shred?: boolean;
  disabled?: boolean;
  className?: string;
}): JSX.Element;
