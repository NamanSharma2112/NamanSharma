import { Dots, Line, Solid } from "@/components/iso/react/draw";
import { ART } from "./bench";
import { BenchLive } from "./live";

const PLATE = (
  <g key="plate">
    <path className="iso-halo" d={ART.halo} />
    {ART.feet.map((f, i) => (
      <g key={i}>
        <Solid paths={f.flange} tone="lo" />
        <Solid paths={f.foot} tone="mid" />
      </g>
    ))}
    <Solid paths={ART.bench} tone="mid" />
    <Line d={ART.groove} tone="faint" />
    {ART.screwRings.map((d, i) => <Line key={i} d={d} tone="lo" />)}
    <Dots points={ART.screws} size={0.52} tone="mid" />
    <Dots points={ART.grid} size={0.4} tone="faint" />

    <Solid paths={ART.label} tone="lo" flat />
    <Line d={ART.labelInset} tone="faint" />
    {ART.labelRules.map((d, i) => <Line key={i} d={d} tone="lo" free />)}
    <Dots points={ART.labelScrews} size={0.45} tone="mid" />
    <Solid paths={ART.ruler} tone="lo" flat />
    <Line d={ART.ticks.minor} tone="lo" />
    <Line d={ART.ticks.major} tone="mid" />
  </g>
);

const BACK = (
  <g key="back">
    <Solid paths={ART.conduit} tone="lo" />
    <Line d={ART.conduitLid} tone="faint" />
    {ART.drops.map((paths, i) => <Solid key={i} paths={paths} tone="lo" />)}
    <Dots points={ART.dropCaps} size={0.5} tone="mid" />

    <Solid paths={ART.rack} tone="lo" />
    <Line d={ART.rackLip} tone="faint" />
    {ART.tools.map((t, i) => (
      <g key={i}>
        <Solid paths={t.shank} tone="mid" />
        <Solid paths={t.head} tone="mid" />
      </g>
    ))}
    <Solid paths={ART.drawInk} tone="mid" />
    <Line d={ART.drawInkRing} tone="faint" />
  </g>
);

const RAIL = (
  <g key="rail">
    {ART.rails.map((paths, i) => <Solid key={i} paths={paths} tone="mid" />)}
    {ART.stops.map((paths, i) => <Solid key={i} paths={paths} tone="mid" />)}
    {ART.rodBores.map((d, i) => <Line key={i} d={d} tone="faint" />)}
    <Dots points={ART.stopScrews} size={0.5} tone="mid" />
  </g>
);

const gantryOf = (g: typeof ART.draw, key: string) => (
  <g key={key}>
    {g.feet.map((paths, i) => <Solid key={`f${i}`} paths={paths} tone="lo" />)}
    {g.posts.map((paths, i) => <Solid key={`p${i}`} paths={paths} tone="mid" />)}
    {g.seams.map((d, i) => <Line key={`s${i}`} d={d} tone="faint" />)}
    <Solid paths={g.beam} tone="mid" />
    <Dots points={g.bolts} size={0.5} tone="mid" />
  </g>
);

const STATIONS = (
  <g key="stations">
    {gantryOf(ART.draw, "draw")}
    <Solid paths={ART.drawHead} tone="mid" />

    {gantryOf(ART.cut, "cut")}
    <Solid paths={ART.cutGuard} tone="lo" />
    <Solid paths={ART.cutHousing} tone="mid" inner={<Line d={ART.cutSeam} tone="faint" />} />
    <Line d={ART.cutKnurl} tone="lo" />

    {gantryOf(ART.press, "press")}
    <Solid paths={ART.pressDie} tone="lo" />
    <Line d={ART.pressDieRing} tone="faint" />
    {ART.pressTies.map((paths, i) => <Solid key={i} paths={paths} tone="lo" />)}

    <Solid paths={ART.gaugePost} tone="mid" />
    <Solid paths={ART.gaugeCollar} tone="mid" />
    <Solid paths={ART.gaugeArm} tone="mid" />
  </g>
);

const GAUGE = (
  <g key="gauge">
    <Solid paths={ART.gaugePuck} tone="hi" inner={<Line d={ART.gaugeSeam} tone="faint" />} />
    <Line d={ART.gaugeBand} tone="lo" />
    <Line d={ART.gaugeBezel} tone="lo" />
    <Line d={ART.gaugeTicks.minor} tone="lo" />
    <Line d={ART.gaugeTicks.major} tone="mid" />
    <Line d={ART.gaugeHub} tone="mid" />
  </g>
);

const FRONT = (
  <g key="front">
    <Solid paths={ART.tray} tone="lo" />
    <Line d={ART.trayWell} tone="faint" />
    <Dots points={ART.chips} size={0.42} tone="faint" />

    <Solid paths={ART.out} tone="lo" />
    <Line d={ART.outWell} tone="faint" />
    {ART.outDone.map((paths, i) => <Solid key={i} paths={paths} tone="hi" />)}
  </g>
);

const BOX = (
  <g key="box">
    <Solid paths={ART.box} tone="mid" />
    <Line d={ART.boxFace} tone="faint" />
    {ART.boxVents.map((d, i) => <Line key={i} d={d} tone="faint" />)}
    <Solid paths={ART.boxWindow} tone="lo" flat />
    <Line d={ART.boxWindowInset} tone="faint" />
    {ART.boxLines.map((d, i) => <Line key={i} d={d} tone="lo" free />)}
    {ART.boxKnobs.map((k, i) => (
      <g key={i}>
        <Solid paths={k.body} tone="mid" />
        <Line d={k.knurl} tone="lo" />
        <Line d={k.mark} tone="hi" free />
      </g>
    ))}
  </g>
);

export function BenchArt() {
  return (
    <BenchLive
      plate={PLATE}
      back={BACK}
      rail={RAIL}
      stations={STATIONS}
      gauge={GAUGE}
      front={FRONT}
      box={BOX}
    />
  );
}
