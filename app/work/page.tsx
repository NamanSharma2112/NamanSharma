import type { Metadata } from "next";
import HighlightList from "@/components/HighlightList";
import Panel from "@/components/Panel";
import PageHeader from "@/components/PageHeader";
import SiteFooter from "@/components/SiteFooter";
import { PROJECTS } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Work | Naman Sharma",
  description: "Projects and things Naman Sharma has shipped.",
};

export default function WorkPage() {
  return (
    <>
      <main className="mx-auto w-full max-w-[640px] px-6 pt-8">
        <PageHeader kicker="Work" title="Selected work">
          Passion projects and client work. Hover a title to see it.
        </PageHeader>

        <Panel>
          <HighlightList title="Highlights" items={PROJECTS} />
        </Panel>
      </main>
      <SiteFooter />
    </>
  );
}
