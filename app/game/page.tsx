import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Footer from "@/components/home/Footer";
import TopStrip from "@/components/home/TopStrip";
import { Plate } from "@/components/iso/react/draw";
import Skimmer from "@/components/game/Skimmer";
import "@/components/iso/iso.css";
import "@/components/home/home.css";

export const metadata: Metadata = {
  title: "Game | Naman Sharma",
  description:
    "Shearwater SK-4 — fly an isometric ground-effect skimmer down a lane, shoot the drones and miss the pylons.",
};

/**
 * The game, set like the figures it is drawn with.
 *
 * It is the same kit: solids extruded from plans, four tones of shading, one
 * hairline. The difference is that this one takes the keyboard — which was
 * the point of building the figures as models rather than as pictures.
 */
export default function GamePage() {
  return (
    <main className="home-col">
      <TopStrip />
      <PageHeader kicker="Game" title="Shearwater SK-4">
        A ground-effect skimmer, drawn with the same kit as the figures and
        wired to the keyboard. Steer across the lane, break the rocks, shoot
        down the aircraft coming the other way, and go round the one thing
        the guns will not touch.
      </PageHeader>

      <div className="iso game-stage">
        <Plate
          fig="Fig. 1"
          title="Shearwater SK-4"
          hint="← → to steer · Space for the guns"
          readout="alt 17.2 m · ias 58 kt · hdg 313° · bank R 2.1°"
          keys={[
            { mark: "lit", label: "The skimmer, and what is worth shooting" },
            { mark: "raised", label: "Rocks and drones break; aircraft take two rounds" },
            { mark: "edge", label: "Steel pylons do not, so go round them" },
          ]}
          caption="A ground-effect machine flies in the cushion of air over a surface, which is why this one has floats at the wingtips and sits as low as it does — the rings under it are that cushion. Everything in the lane is one solid built once and moved by a transform, so a frame of play costs a few dozen attribute writes rather than a redraw."
        >
          <Skimmer />
        </Plate>
      </div>

      <Footer />
    </main>
  );
}
