import Link from "next/link";
import SocialLinks from "@/components/SocialLinks";

/**
 * One ending for every page.
 *
 * A rule, who wrote it, where else to go, and the fine print — in that order,
 * because that is the order you want them in once you have reached the bottom
 * and are deciding whether to leave.
 */
const EMAIL = "namansharmans03@gmail.com";

export default function Footer() {
  return (
    <footer className="foot">
      <div className="foot-rule" />

      <div className="foot-row">
        <div>
          <Link href="/" className="foot-name">
            Naman Sharma
          </Link>
          <p className="foot-role">Design engineer</p>
        </div>

        <nav className="foot-links" aria-label="Footer">
          <Link href="/work">Work</Link>
          <Link href="/blog">Writing</Link>
          <Link href="/inspiration">Inspiration</Link>
          <Link href="/lab">Lab</Link>
          <Link href="/desktop">Desktop</Link>
        </nav>
      </div>

      <div className="foot-fine">
        <p>
          Open to design engineering roles and freelance work —{" "}
          <a className="home-link" href={`mailto:${EMAIL}`}>
            {EMAIL}
          </a>
        </p>
        <SocialLinks />
      </div>
    </footer>
  );
}
