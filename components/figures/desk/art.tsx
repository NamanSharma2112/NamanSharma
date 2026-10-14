import { Dots, Line, Solid } from "@/components/iso/react/draw";
import { ART } from "./desk";
import { DeskLive } from "./live";

/* The static parts, built on the server. Each root is keyed: element props
   stream as lazy chunks on a page this size, and an unkeyed lazy logs a key
   warning from inside the live component. */

const BASE = (
  <g key="base">
    <path className="iso-halo" d={ART.halo} />
    {ART.feet.map((f, i) => (
      <g key={i}>
        <Solid paths={f.flange} tone="lo" />
        <Solid paths={f.foot} tone="mid" />
      </g>
    ))}
    <Solid paths={ART.desk} tone="mid" />
    <Line d={ART.groove} tone="faint" />
    {ART.screwRings.map((d, i) => <Line key={i} d={d} tone="lo" />)}
    <Dots points={ART.screws} size={0.5} tone="mid" />

    <Solid paths={ART.label} tone="lo" flat />
    <Line d={ART.labelInset} tone="faint" />
    {ART.labelRules.map((d, i) => <Line key={i} d={d} tone="lo" free />)}
    <Dots points={ART.labelScrews} size={0.45} tone="mid" />

    <Solid paths={ART.ruler} tone="lo" flat />
    <Line d={ART.ticks.minor} tone="lo" />
    <Line d={ART.ticks.major} tone="mid" />
  </g>
);

const STAND = (
  <g key="stand">
    <Solid paths={ART.boot} tone="lo" />
    <Line d={ART.bootGroove} tone="faint" />
    <Dots points={ART.bootScrews} size={0.5} tone="mid" />
    <Solid paths={ART.neck} tone="mid" />
    <Line d={ART.neckSeam} tone="faint" />
  </g>
);

const CASE = (
  <g key="case">
    <Solid paths={ART.case} tone="mid" />
    <Dots points={ART.chinDot} size={0.5} tone="lo" />
  </g>
);

const DESK_THINGS = (
  <g key="things">
    <Solid paths={ART.keyTray} tone="hi" />
    <Line d={ART.keyLip} tone="faint" />
    <Dots points={ART.keys} size={0.78} tone="lo" />
    <Line d={ART.keySpace} tone="lo" />

    <Solid paths={ART.mouse} tone="hi" />
    <Line d={ART.mouseSeam} tone="faint" />
  </g>
);

const TOWER = (
  <g key="tower">
    <Solid paths={ART.tower} tone="mid" />
    {ART.vents.map((d, i) => <Line key={i} d={d} tone="faint" />)}
    <Line d={ART.towerKnurl} tone="lo" />
    <Line d={ART.power} tone="lo" />
    <Dots points={ART.powerDot} size={0.6} tone="mid" />
  </g>
);

export function DeskArt() {
  return <DeskLive base={BASE} stand={STAND} frame={CASE} things={DESK_THINGS} tower={TOWER} />;
}
