import InfiniteCanvas from "@/components/InfiniteCanvas";

export const metadata = {
  title: "About | Naman Sharma",
  description: "Learn more about Naman Sharma",
};

export default function AboutPage() {
  return (
    <main className="w-screen h-screen overflow-hidden bg-[#f5f5f5] dark:bg-[#0a0a0a] transition-colors duration-500">
      {/* 
        This renders the interactive framer-motion canvas. 
        It covers the entire screen and provides a draggable infinity grid.
      */}
      <InfiniteCanvas />
    </main>
  );
}
