import type { Metadata } from "next";
import HighlightList from "@/components/HighlightList";
import Panel from "@/components/Panel";
import PageHeader from "@/components/PageHeader";
import Footer from "@/components/home/Footer";
import TopStrip from "@/components/home/TopStrip";
import "@/components/home/home.css";
import { PROJECTS } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Work | Naman Sharma",
  description: "Projects and things Naman Sharma has shipped.",
};

export default function WorkPage() {
  return (
    <>
      <main className="home-col">
        <TopStrip />
        <PageHeader kicker="Work" title="Selected work">
          Passion projects and client work. Hover a title to see it.
        </PageHeader>

        <Panel>
          <HighlightList title="Highlights" items={PROJECTS} />
        </Panel>
        <Footer />
      </main>
    </>
  );
}
