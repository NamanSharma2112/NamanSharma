import { Dots, Line, Solid } from "@/components/iso/react/draw";
import { ART } from "./gpu";
import { GpuLive } from "./live";

/* Every static part, built on the server and handed to the live component
   as element props, keyed for the same reason as the other figures'. */

const BACK = (
  <g key="back">
    <path className="iso-halo" d={ART.halo} />
    <Solid paths={ART.backplate} tone="lo" />
  </g>
);

/* The bare board: contacts, traces, the parts round the package and the
   cooler's screw points. What is mounted on it comes in its own groups so
   each can carry its own label. */
const BOARD = (
  <g key="board">
    {ART.tabs.map((paths, i) => (
      <Solid key={i} paths={paths} tone="mid" />
    ))}
    <Line d={ART.fingers} tone="lo" />
    <Solid paths={ART.pcb} tone="mid" className="gpu-pcb" />
    <Line d={ART.traces} tone="faint" />
    <Dots points={ART.smd} size={0.32} tone="mid" />
    <Line d={ART.screwRings} tone="lo" />
    <Dots points={ART.screws} size={0.45} tone="mid" />
  </g>
);

const POWER = (
  <g key="power">
    {ART.power.map((paths, i) => (
      <Solid key={i} paths={paths} tone="mid" />
    ))}
  </g>
);

/* The package is the one lit part: it is what the rest of the card is for. */
const CHIP = (
  <g key="chip">
    <Solid paths={ART.substrate} tone="mid" />
    <Solid paths={ART.die} tone="hi" lit />
  </g>
);

const MEMORY = (
  <g key="memory">
    {ART.memory.map((paths, i) => (
      <Solid key={i} paths={paths} tone="mid" />
    ))}
  </g>
);

const CONNECTORS = (
  <g key="connectors">
    {ART.housings.map((paths, i) => (
      <Solid key={i} paths={paths} tone="mid" />
    ))}
    <Solid paths={ART.plug} tone="hi" />
    <path className="iso-line gpu-pin" data-tone="mid" d={ART.pins} />
  </g>
);

const SINK = (
  <g key="sink">
    <Solid paths={ART.sink} tone="mid" inner={<Line d={ART.finsTop} tone="faint" />} />
    <Line d={ART.sinkBase} tone="lo" />
    <Line d={ART.finsSide} tone="lo" />
    <path className="iso-line gpu-pipe" data-tone="mid" d={ART.pipes} />
  </g>
);

/* A slab with three openings cut through it: each opening's far inner
   wall is the shade inside it, and its foot the line where it meets the
   fan. The light bar is the one line in colour. */
const SHROUD = (
  <g key="shroud">
    <g className="iso-solid gpu-shroud">
      <path className="iso-fill" d={ART.shroud.fill} />
      {ART.shroud.shades.map((d, shade) => (d ? <path key={shade} className="iso-shade" data-shade={shade} d={d} /> : null))}
      <path className="iso-top" d={ART.shroud.top} />
      {ART.walls.map((d, i) => (
        <path key={i} className="iso-shade gpu-wall" data-shade="1" d={d} />
      ))}
      <path className="iso-line" data-tone="lo" d={ART.feet} />
      <path className="iso-line iso-crease" data-tone="faint" d={ART.shroud.crease} />
      {ART.shroud.bevel ? <path className="iso-line iso-bevel" data-tone="faint" d={ART.shroud.bevel} /> : null}
      <path className="iso-line" data-tone="mid" d={ART.holes} />
      <path className="iso-line iso-edge" data-tone="hi" d={ART.shroud.outline} />
    </g>
    <Dots points={ART.shroudScrews} size={0.5} tone="mid" />
    <Line d={ART.lightBar} tone="red" className="gpu-bar" />
    <Solid paths={ART.bracket} tone="hi" />
    <path className="iso-line gpu-port" data-tone="mid" d={ART.ports} />
    <path className="iso-line gpu-port" data-tone="lo" d={ART.vents} />
  </g>
);

export function GpuArt() {
  return (
    <GpuLive
      back={BACK}
      board={BOARD}
      power={POWER}
      chip={CHIP}
      memory={MEMORY}
      connectors={CONNECTORS}
      sink={SINK}
      shroud={SHROUD}
    />
  );
}
