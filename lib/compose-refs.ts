import * as React from "react";

function setRef<T>(ref: React.Ref<T> | undefined, value: T) {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref !== null && ref !== undefined) {
    (ref as React.MutableRefObject<T>).current = value;
  }
}

export function composeRefs<T>(...refs: (React.Ref<T> | undefined)[]) {
  return (node: T) => refs.forEach((ref) => setRef(ref, node));
}

export function useComposedRefs<T>(...refs: (React.Ref<T> | undefined)[]) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return React.useCallback(composeRefs(...refs), refs);
}
