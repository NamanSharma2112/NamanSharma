import { Plate } from "@/components/iso/react/draw";
import { CamArt } from "./art";
import { EASE, LIFT } from "./cam";

/**
 * Fig 1 on /work: what an easing preset actually does, as a machine.
 *
 * The disc is cut to this site's own `--ease-out`, so the drawing is the
 * curve rather than a picture of one.
 */
export function CamFigure() {
  return (
    <Plate
      fig="Fig 1"
      title="One curve, every time"
      hint="Move across it, or ← →"
      readout="t 0.00 · out 0.00 · 0.0 px"
      keys={[
        { mark: "lit", label: "The cam, cut to the easing curve" },
        { mark: "raised", label: "The slide it drives" },
        { mark: "edge", label: "The dial reading how far it has gone" },
      ]}
      caption={`A disc cam cut to cubic-bezier(${EASE.join(", ")}) — the same \`--ease-out\` this site animates with. Its radius at any angle is the eased value at that fraction of a turn, so one turn of the crank plays the curve once and the slide travels ${LIFT} px.`}
    >
      <CamArt />
    </Plate>
  );
}
