import { Plate } from "@/components/iso/react/draw";
import { GpuArt } from "./art";

/**
 * Second on the list: a three-fan graphics card, drawn as the stack of
 * parts it is and running a worked example of its fan curve.
 */
export function GpuFigure() {
  return (
    <Plate
      fig="Fig 6"
      title="On the list"
      hint="Move across it to set the load"
      readout="Load 62% · 2,370 rpm · 60 °C"
      keys={[
        { mark: "red", label: "The light bar, the one colour" },
        { mark: "raised", label: "The fans, shroud, fin stack and board" },
        { mark: "edge", label: "The I/O bracket at the end" },
      ]}
      caption="A three-fan card, 2.5 slots thick: backplate, board, a fin stack the length of the card, three ring fans with the middle one turning the other way, and a shroud with a light bar. The fans hold still below 30% load and run up to 3,000 rpm — a worked example, not any one card's figures."
    >
      <GpuArt />
    </Plate>
  );
}
