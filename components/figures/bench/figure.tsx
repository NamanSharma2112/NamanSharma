import { Plate } from "@/components/iso/react/draw";
import { STAGES } from "./bench";
import { BenchArt } from "./art";

/** The big one: how the work actually gets made. */
export function BenchFigure() {
  return (
    <Plate
      fig="Fig 4"
      title="How it gets made"
      hint="It runs on its own"
      readout="moving · 0 of 4 passes"
      keys={[
        { mark: "lit", label: "The work, and the tool touching it" },
        { mark: "raised", label: "The carriage carrying it down the rail" },
        { mark: "edge", label: "The gauge that decides it is done" },
      ]}
      caption={`One piece, four passes: ${STAGES.map((s) => s.name.toLowerCase()).join(", ")}. It is scribed, cut and pressed, and then measured — the last station is a gauge rather than a stamp, because a thing is not finished when it is made, it is finished when it reads true. Each tool only moves while it is working, and each mark on the piece appears when the station that cuts it has passed.`}
    >
      <BenchArt />
    </Plate>
  );
}
