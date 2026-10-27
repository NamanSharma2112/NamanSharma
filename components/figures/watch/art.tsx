import { Line, Solid } from "@/components/iso/react/draw";
import { ART } from "./watch";
import { WatchLive } from "./live";

/* Every static part, built on the server and handed to the live component
   as element props, keyed for the same reason as the other figures'. */

const TRAY = (
  <g key="tray">
    <path className="iso-halo" d={ART.halo} />
    <Solid paths={ART.tray} tone="mid" inner={<Line d={ART.groove} tone="faint" />} />
  </g>
);

const link = (p: (typeof ART.far)[number], i: number) => (
  <Solid key={i} paths={p.paths} tone="mid" inner={p.crest ? <Line d={p.crest} tone="faint" /> : null} />
);

/* The case, with the far half of the bracelet behind it and the near half
   in front, in one group: they lift together. */
const HEAD = (
  <g key="head">
    {ART.far.map(link)}
    <Solid paths={ART.caseback} tone="lo" />
    <Solid paths={ART.case} tone="hi" inner={<Line d={ART.caseSeam} tone="faint" />} />
    <Line d={ART.seat} tone="lo" />
    <Solid paths={ART.tube} tone="mid" />
    <Solid paths={ART.crown} tone="hi" />
    <Line d={ART.crownFlutes} tone="lo" />
    {ART.near.map(link)}
  </g>
);

const DIAL = (
  <g key="dial">
    <Solid paths={ART.dial} tone="lo" className="watch-dial" />
    <Line d={ART.track.inner} tone="lo" />
    <Line d={ART.track.outer} tone="lo" />
    <Line d={ART.track.ticks} tone="lo" />
    {ART.indices.map((paths, i) => (
      <Solid key={i} paths={paths} tone="hi" crease="lo" className="watch-index" />
    ))}
    <path className="iso-line watch-window" data-tone="mid" d={ART.dayWindow} />
    <path className="iso-line watch-window" data-tone="mid" d={ART.dateWindow} />
  </g>
);

/* A ring rather than a disc: the opening is cut through its fill and its
   top, so the dial shows through it assembled and the case through it
   apart. The far inner wall is the one shade inside the opening. */
const BEZEL = (
  <g key="bezel" className="iso-solid watch-ring">
    <path className="iso-fill" d={ART.bezel.fill} />
    {ART.bezel.shades.map((d, shade) => (d ? <path key={shade} className="iso-shade" data-shade={shade} d={d} /> : null))}
    <path className="iso-top" d={ART.bezel.top} />
    <path className="iso-shade watch-wall" data-shade="1" d={ART.bezel.wall} />
    <path className="iso-line" data-tone="lo" d={ART.bezel.flutesTop} />
    <path className="iso-line" data-tone="lo" d={ART.bezel.flutesSide} />
    <path className="iso-line" data-tone="lo" d={ART.bezel.wallFoot} />
    <path className="iso-line iso-crease" data-tone="mid" d={ART.bezel.crease} />
    <path className="iso-line" data-tone="mid" d={ART.bezel.hole} />
    <path className="iso-line iso-edge" data-tone="hi" d={ART.bezel.outline} />
  </g>
);

const GLASS = (
  <g key="glass">
    <path className="iso-line watch-glass" data-tone="mid" d={ART.crystal} />
    <Solid paths={ART.cyclops} tone="mid" crease="lo" className="watch-glass-solid" />
  </g>
);

export function WatchArt() {
  return <WatchLive tray={TRAY} head={HEAD} dial={DIAL} bezel={BEZEL} glass={GLASS} />;
}
