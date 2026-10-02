import Annotated from "@/components/landing/Annotated";

/**
 * The opening, written as a note rather than a hero.
 *
 * Short measure, generous leading, one idea a paragraph — the eye goes down the
 * page instead of across it, which is what makes it read as something written
 * to you. The only ornament is the mark in front of a handful of words, and
 * what is behind those is the reward for noticing it.
 */

/** The map pin, in the site's own language: the rail in the corner says the
    same thing, so the card does not introduce a second way of giving a place. */
function Place() {
  return (
    <span className="anno-place">
      <span className="anno-place-pin" aria-hidden />
      <span className="anno-place-name">Jalandhar</span>
      <span className="anno-place-coords">
        31.3260° N
        <br />
        75.5762° E
      </span>
    </span>
  );
}

function Shot({ src, alt }: { src: string; alt: string }) {
  // Plain img, not next/image: it is 210px wide inside a card that only exists
  // while hovered, and the optimizer's lazy pass does not fire for something
  // that is not in the layout until then.
  return <img src={src} alt={alt} width={248} height={150} loading="eager" />;
}

export default function Letter() {
  return (
    <div className="letter">
      <p>Hey,</p>

      <p>
        I&rsquo;m{" "}
        <Annotated card={<Shot src="/avatar2.png" alt="Naman Sharma" />}>
          Naman
        </Annotated>
        , and I&rsquo;m from{" "}
        <Annotated card={<Place />}>Jalandhar</Annotated>, India.
      </p>

      <p>
        I&rsquo;m a design engineer. I sit in the space between design and
        engineering, and I care about how an interface{" "}
        <em>feels</em> — not only whether it works.
      </p>

      <p>
        Most of what I build starts as a passion project.{" "}
        <Annotated
          wide
          card={<Shot src="/motionkit-preview.png" alt="MotionKit" />}
        >
          MotionKit
        </Annotated>{" "}
        is the motion code I kept rebuilding, packaged so it behaves the same
        way every time.{" "}
        <Annotated
          wide
          card={<Shot src="/churnrate-dashboard.png" alt="ChurnRate" />}
        >
          ChurnRate
        </Annotated>{" "}
        is a dashboard for a SaaS product.
      </p>

      <p>
        I&rsquo;m open to design engineering roles and freelance work.
      </p>
    </div>
  );
}
