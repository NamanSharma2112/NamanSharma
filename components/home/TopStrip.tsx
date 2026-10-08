import Nav from "@/components/home/Nav";
import Player, { type Track } from "@/components/home/Player";
import Status from "@/components/home/Status";

/**
 * The bar every page opens with: where to go on the left, the date and the
 * light on the right.
 *
 * One component rather than one per route, so a link added here appears
 * everywhere and the strip cannot drift apart between pages.
 */
export default function TopStrip({ track = null }: { track?: Track | null }) {
  return (
    <div className="home-strip">
      <span className="home-strip-left">
        <Nav />
        <Player track={track} />
      </span>

      <Status />
    </div>
  );
}
