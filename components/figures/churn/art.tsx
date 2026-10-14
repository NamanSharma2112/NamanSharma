import { Dots, Line, Solid } from "@/components/iso/react/draw";
import { ART } from "./churn";
import { ChurnLive } from "./live";

const BASE = (
  <g key="base">
    <path className="iso-halo" d={ART.halo} />
    {ART.feet.map((f, i) => (
      <g key={i}>
        <Solid paths={f.flange} tone="lo" />
        <Solid paths={f.foot} tone="mid" />
      </g>
    ))}
    <Solid paths={ART.plate} tone="mid" />
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

const FRAME = (
  <g key="frame">
    {ART.posts.map((post, i) => (
      <g key={i}>
        <Solid paths={post.shelf} tone="lo" />
        <Solid paths={post.body} tone="mid" />
        <Line d={post.cap} tone="faint" />
        <Dots points={post.screws} size={0.5} tone="mid" />
      </g>
    ))}
    {ART.rods.map((rod, i) => (
      <g key={i}>
        <Solid paths={rod.rod} tone="lo" />
        {rod.collars.map((paths, k) => <Solid key={k} paths={paths} tone="mid" />)}
      </g>
    ))}
  </g>
);

const BAR = (
  <g key="bar">
    <Solid paths={ART.bar} tone="hi" />
    <Line d={ART.barSeam} tone="faint" free />
  </g>
);

const DIAL = (
  <g key="dial">
    <Solid paths={ART.dialStand} tone="lo" />
    <Solid paths={ART.dialCrown} tone="mid" />
    <Solid paths={ART.dialPuck} tone="hi" inner={<Line d={ART.dialSeam} tone="faint" />} />
    <Line d={ART.dialBezel} tone="lo" />
    <Line d={ART.dialTicks.minor} tone="lo" />
    <Line d={ART.dialTicks.major} tone="mid" />
    <Line d={ART.dialHub} tone="mid" />
  </g>
);

export function ChurnArt() {
  return <ChurnLive base={BASE} frame={FRAME} bar={BAR} dial={DIAL} />;
}
