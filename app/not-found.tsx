import Link from "next/link";
import { Mark } from "@/components/chapters/Pieces";

/** Nowhere: the marshmallow asleep, and two ways back. */
export default function NotFound() {
  return (
    <div className="page">
      <main className="col">
        <div className="mark-sleep" aria-hidden="true">
          <Mark sleeping />
        </div>
        <h1 className="name">Nothing here.</h1>
        <p>This address doesn&rsquo;t go anywhere.</p>
        <p>
          Go <Link href="/">home</Link> or read my <Link href="/blog">writing</Link>.
        </p>
      </main>
    </div>
  );
}
