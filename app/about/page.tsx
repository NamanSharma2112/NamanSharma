import InfiniteCanvas from "@/components/InfiniteCanvas";
import RainGlass from "@/components/RainGlass";

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

      {/*
        Rain on the far side of the glass, water clinging to the near side.
        Moving the cursor wipes the pane clear; it fogs back over on its own.
      */}
      <RainGlass />
    </main>
  );
}
