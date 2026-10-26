import { Dots, Line, Solid } from "@/components/iso/react/draw";
import { ART } from "./cam";
import { CamLive } from "./live";

/* Every static part, built on the server and handed to the live component as
   element props. Each root carries a key: on a page this size React streams
   element props as lazy chunks, and a lazy that resolves to an unkeyed
   element logs a key warning from inside the live component. */

const BASE = (
  <g key="base">
    <path className="iso-halo" d={ART.halo} />
    {ART.feet.map((foot, i) => (
      <g key={i}>
        <Solid paths={foot.flange} tone="lo" />
        <Solid paths={foot.foot} tone="mid" />
      </g>
    ))}
    <Solid paths={ART.plate} tone="mid" />
    <Line d={ART.groove} tone="faint" />
    {ART.screwRings.map((d, i) => (
      <Line key={i} d={d} tone="lo" />
    ))}
    <Dots points={ART.screws} size={0.5} tone="mid" />

    <Solid paths={ART.label} tone="lo" flat />
    <Line d={ART.labelInset} tone="faint" />
    {ART.labelRules.map((d, i) => (
      <Line key={i} d={d} tone="lo" free />
    ))}
    <Dots points={ART.labelScrews} size={0.45} tone="mid" />

    <Solid paths={ART.ruler} tone="lo" flat />
    <Line d={ART.ticks.minor} tone="lo" />
    <Line d={ART.ticks.major} tone="mid" />
    <Line d={ART.zero} tone="hi" />
  </g>
);

const RAILS = (
  <g key="rails">
    {ART.rails.map((paths, i) => (
      <Solid key={i} paths={paths} tone="mid" />
    ))}
    {ART.stops.map((paths, i) => (
      <Solid key={i} paths={paths} tone="mid" />
    ))}
    <Dots points={ART.stopScrews} size={0.5} tone="mid" />
  </g>
);

const SHAFT = (
  <g key="shaft">
    <Solid paths={ART.post} tone="lo" inner={<Line d={ART.postSeam} tone="faint" />} />
  </g>
);

const KNOB = (
  <g key="knob">
    <Solid paths={ART.shaft} tone="mid" inner={<Line d={ART.shaftSeam} tone="faint" />} />
    <Solid paths={ART.knob} tone="mid" />
    <Line d={ART.knurl} tone="lo" />
    <Line d={ART.knobRing} tone="faint" />
  </g>
);

const ARM = (
  <g key="arm">
    <Solid paths={ART.arm} tone="mid" />
  </g>
);

const SLIDE = (
  <g key="slide">
    {ART.slideBushes.map((paths, i) => (
      <Solid key={i} paths={paths} tone="lo" />
    ))}
    <Solid paths={ART.slide} tone="hi" />
    <Line d={ART.slideSeat} tone="faint" />
    <Dots points={ART.slideRivets} size={0.45} tone="mid" />
  </g>
);

const DIAL = (
  <g key="dial">
    <Solid paths={ART.dialLug} tone="lo" />
    <Solid paths={ART.dialStand} tone="lo" />
    <Solid paths={ART.dialCrown} tone="mid" />
    <Solid paths={ART.dialPuck} tone="hi" inner={<Line d={ART.dialSeam} tone="faint" />} />
    <Line d={ART.dialBand} tone="lo" />
    <Line d={ART.dialBezel} tone="lo" />
    <Line d={ART.dialTicks.minor} tone="lo" />
    <Line d={ART.dialTicks.major} tone="mid" />
    <Line d={ART.dialHub} tone="mid" />
  </g>
);

export function CamArt() {
  return <CamLive base={BASE} rails={RAILS} shaft={SHAFT} knob={KNOB} arm={ARM} slide={SLIDE} dial={DIAL} />;
}
