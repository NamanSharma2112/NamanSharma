import { redirect } from "next/navigation";

/**
 * The front page now carries the about writing and the look this route used to
 * have, so anything pointing here lands there instead.
 */
export default function AboutPage() {
  redirect("/");
}
