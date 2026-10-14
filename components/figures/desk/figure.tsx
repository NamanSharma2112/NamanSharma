import { Plate } from "@/components/iso/react/draw";
import { APPS, WINDOWS } from "./desk";
import { DeskArt } from "./art";

/**
 * Fig 2 on /work: the desktop in the browser, as the machine it imitates.
 */
export function DeskFigure() {
  return (
    <Plate
      fig="Fig 3"
      title="A machine in the browser"
      hint="Hover to boot it again"
      readout="booting…"
      keys={[
        { mark: "lit", label: "The screen, once it has booted" },
        { mark: "raised", label: "The keyboard and the mouse" },
        { mark: "edge", label: "The tower beside it" },
      ]}
      caption={`The /desktop route, drawn as the workstation it imitates: it boots, puts up a menu bar and a dock of ${APPS.length} apps, and opens ${WINDOWS.length} windows that drag and resize. The screen is drawn in the plane of the monitor's own face, so the picture sits in the glass rather than on top of it.`}
    >
      <DeskArt />
    </Plate>
  );
}
