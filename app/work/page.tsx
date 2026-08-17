import type { Metadata } from "next";
import HighlightList from "@/components/HighlightList";
import Panel from "@/components/Panel";
import { PROJECTS } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Work | Naman Sharma",
  description: "Projects and things Naman Sharma has shipped.",
};

export default function WorkPage() {
  return (
    <main className="mx-auto w-full max-w-[560px] px-6 pt-5 pb-28">
      <Panel>
        <h1 className="text-[13.5px] font-medium text-zinc-900 dark:text-white">Work.</h1>

        <p className="mt-6 text-[13.5px] leading-[1.75] text-zinc-700 dark:text-zinc-300">
          Passion projects and client work. Hover a title to see it.
        </p>

        <div className="mt-8">
          <HighlightList title="Highlights" items={PROJECTS} />
        </div>
      </Panel>
    </main>
  );
}
