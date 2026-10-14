"use client";

import { JellyBlobMascot } from "feral-blob";
import "feral-blob/blob.css";
import "./mascot.css";

/**
 * The mark beside the name: mortspace's jelly blob (MIT), poked.
 *
 * It ships as a violet jelly, which would be the one saturated thing on a
 * page drawn entirely in ink and paper. It is re-skinned instead to the same
 * palette as the figures below it — a white body, a hairline outline, grey
 * shading — through the `--jelly-*` custom properties the package exposes for
 * exactly this, so nothing is patched and an update cannot undo it. The skin
 * lives in mascot.css next to the dark-mode half of it.
 *
 * Press it and it squashes; press it a few times in a row and it loses
 * patience and shakes, which is the component's own behaviour and the reason
 * to use this one rather than draw another.
 */
export default function Mascot() {
  return (
    <span className="mascot">
      <JellyBlobMascot mood="neutral" eyeStyle="v2" className="mascot-blob" />
    </span>
  );
}
