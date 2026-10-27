import { Plate } from "@/components/iso/react/draw";
import { WatchArt } from "./art";

/**
 * The one thing on the list: a platinum Day-Date 40, drawn to its own
 * dimensions and keeping the visitor's time.
 */
export function WatchFigure() {
  return (
    <Plate
      fig="Fig 5"
      title="On the list"
      hint="Move across it to turn the crown"
      readout="—"
      keys={[
        { mark: "flat", label: "The ice-blue dial, the one colour" },
        { mark: "raised", label: "The case, bezel and bracelet" },
        { mark: "edge", label: "Hands set to your clock" },
      ]}
      caption="A Day-Date 40 in platinum: 40 mm case, fluted bezel, ice-blue dial, President bracelet. The hands read your own clock, the window at 12 spells today and the lens at 3 magnifies the date."
    >
      <WatchArt />
    </Plate>
  );
}
