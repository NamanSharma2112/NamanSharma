import { Plate } from "@/components/iso/react/draw";
import { BEADS, KEEP, ROWS } from "./churn";
import { ChurnArt } from "./art";

/** Fig 3 on /work: what a churn dashboard is watching, as a counting frame. */
export function ChurnFigure() {
  return (
    <Plate
      fig="Fig 2"
      title="What churn looks like"
      hint="It runs on its own"
      readout="month 0 · 100% kept · 10 of 10"
      keys={[
        { mark: "raised", label: "A bead: one subscriber in ten" },
        { mark: "lit", label: "The bar they cross when they leave" },
        { mark: "edge", label: "The dial reading what is left" },
      ]}
      caption={`${ROWS} rods, one per monthly cohort, ${BEADS} beads to a rod. A worked example at ${Math.round(KEEP * 100)}% monthly retention — not figures from anyone's account — so each month the beads that churned slide across the bar. The dial reads the beads themselves, not the model.`}
    >
      <ChurnArt />
    </Plate>
  );
}
