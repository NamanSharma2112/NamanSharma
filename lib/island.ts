"use client";

import * as React from "react";

/* ══ What the island is showing ═════════════════════════════════════════
   A page can hand the island a live activity — a short label and a quiet
   detail, the way the phone's island shows a timer or a call — and take
   it back when it is done. One at a time; the last set wins. A tiny store
   rather than a context, so a page deep in the tree can set it without
   the layout knowing. */

export type Activity = { label: string; detail?: string } | null;

let current: Activity = null;
const subs = new Set<() => void>();

export function setActivity(a: Activity) {
  if (a === current || (a && current && a.label === current.label && a.detail === current.detail)) return;
  current = a;
  subs.forEach((f) => f());
}

const subscribe = (f: () => void) => {
  subs.add(f);
  return () => {
    subs.delete(f);
  };
};

export function useActivity() {
  return React.useSyncExternalStore(
    subscribe,
    () => current,
    () => null,
  );
}
