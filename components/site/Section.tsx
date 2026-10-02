import type { ReactNode } from "react";
import { num, type SectionDef } from "@/components/site/sections";
import BlurReveal from "@/components/BlurReveal";

/**
 * One numbered band of the front page.
 *
 * The kicker carries the number the nav knows it by, so wherever you are on the
 * page the heading above you and the item lit in the index agree — which is the
 * whole reason the numbering is visible at all rather than being an internal
 * detail of the nav.
 *
 * `scroll-mt` keeps an anchored jump from landing under the fixed bar.
 */
export default function Section({
  def,
  index,
  children,
  wide = false,
}: {
  def: SectionDef;
  index: number;
  children: ReactNode;
  /** Lets a section's content run wider than the reading column. */
  wide?: boolean;
}) {
  return (
    <section id={def.id} className="site-section">
      <div className={`site-shell ${wide ? "is-wide" : ""}`}>
        <p className="site-kicker">
          {num(index)}_{def.label}
        </p>

        <BlurReveal as="h2" text={def.heading} className="site-h2" delay={0.05} />

        <p className="site-blurb">{def.blurb}</p>

        <div className="site-section-body">{children}</div>
      </div>
    </section>
  );
}
