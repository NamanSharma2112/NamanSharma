import type { Metadata } from "next";
import HighlightList from "@/components/HighlightList";
import { PROJECTS } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Work | Naman Sharma",
  description: "Projects and things Naman Sharma has shipped.",
};

export default function WorkPage() {
  return (
    <main className="mx-auto w-full max-w-[560px] px-6 pt-16 pb-24 text-[13.5px] leading-[1.75] text-zinc-400">
      <h1 className="font-medium text-white">Work.</h1>

      <p className="mt-6">
        Passion projects and client work. Hover a title to see it.
      </p>

      <div className="mt-10">
        <HighlightList title="Highlights" items={PROJECTS} />
      </div>
    </main>
  );
}
