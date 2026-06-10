"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useMotionValue } from "motion/react";
import { Play } from "lucide-react";

type Note = {
  id: string;
  x: number;
  y: number;
  title: string;
  content: React.ReactNode;
  width?: number;
};

type Photo = {
  id: string;
  x: number;
  y: number;
  src: string;
  caption: string;
  rotation: number;
  blur?: string;
};

const CENTER = 50000;

// Initial Mock Data
const INITIAL_NOTES: Note[] = [
  {
    id: "note-1",
    x: CENTER,
    y: CENTER - 100,
    title: "About Me",
    width: 280,
    content: (
      <p className="text-zinc-300 text-[15px] leading-relaxed font-medium">
        Hi! I'm Naman. I'm a design engineer who loves building interfaces that feel alive.
      </p>
    ),
  },
  {
    id: "note-2",
    x: CENTER - 50,
    y: CENTER + 150,
    title: "Current Focus",
    width: 300,
    content: (
      <p className="text-zinc-300 text-[15px] leading-relaxed font-medium">
        Exploring WebGL, Framer Motion, and finding the perfect balance between design and code.
      </p>
    ),
  },
  {
    id: "note-3",
    x: CENTER - 250,
    y: CENTER - 50,
    title: "Hobbies",
    width: 280,
    content: (
      <p className="text-zinc-300 text-[15px] leading-relaxed font-medium">
        When I'm not coding, I'm probably sketching ideas, playing video games, or reading about interaction design.
      </p>
    ),
  },
];

const INITIAL_PHOTOS: Photo[] = [
  {
    id: "photo-1",
    x: CENTER + 200,
    y: CENTER - 250,
    src: "/avatar.jpg",
    caption: "Me, plotting the next project.",
    rotation: 4,
    blur: "blur-[3px] brightness-75", // ~25% blur and 25% darkened
  },
  {
    id: "photo-2",
    x: CENTER - 200,
    y: CENTER - 280,
    src: "/avatar2.png",
    caption: "Looking forward.",
    rotation: -3,
  },
  {
    id: "photo-3",
    x: CENTER + 320,
    y: CENTER + 50,
    src: "/isometric.png",
    caption: "Isometric Studio in action.",
    rotation: 2,
  },
  {
    id: "photo-4",
    x: CENTER - 300,
    y: CENTER + 200,
    src: "/motionkit.png",
    caption: "MotionKit components.",
    rotation: -5,
  },
];

export default function InfiniteCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Create a massive canvas size so it feels infinite
  const CANVAS_SIZE = 100000;
  
  // Center the canvas initially
  const [mounted, setMounted] = useState(false);
  const x = useMotionValue(-CENTER + (typeof window !== "undefined" ? window.innerWidth / 2 : 0));
  const y = useMotionValue(-CENTER + (typeof window !== "undefined" ? window.innerHeight / 2 : 0));

  useEffect(() => {
    setMounted(true);
    // Recenter on load
    x.set(-CENTER + window.innerWidth / 2);
    y.set(-CENTER + window.innerHeight / 2);
  }, []);

  if (!mounted) return <div className="w-screen h-screen bg-[#0a0a0a]" />; // Server SSR placeholder

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 w-screen h-screen overflow-hidden bg-[#0a0a0a] touch-none select-none"
    >
      <motion.div
        drag
        dragElastic={0.1}
        dragMomentum={true}
        style={{
          width: CANVAS_SIZE,
          height: CANVAS_SIZE,
          x,
          y,
        }}
        className="custom-bg absolute top-0 left-0 cursor-grab active:cursor-grabbing will-change-transform"
      >
        {/* Render Notes (Dark Cards) */}
        {INITIAL_NOTES.map((note) => (
          <motion.div
            key={note.id}
            drag
            dragMomentum={false}
            whileDrag={{ scale: 1.05, zIndex: 50, cursor: "grabbing" }}
            initial={{ x: note.x, y: note.y }}
            className="absolute flex flex-col p-5 md:p-6 rounded-xl shadow-2xl cursor-grab border border-white/5 bg-[#3b3e46] max-w-[85vw]"
            style={{ width: note.width || 280 }}
            onPointerDown={(e) => e.stopPropagation()} // Stop drag from panning the background
          >
            <div className="relative mb-6">
              <h3 className="font-writing text-white text-lg md:text-xl tracking-wide">{note.title}</h3>
              {/* Hand-drawn underline SVG */}
              <svg className="absolute -bottom-2 left-0 w-3/4 h-2 text-zinc-400/60" preserveAspectRatio="none" viewBox="0 0 100 10">
                <path d="M0,5 Q50,0 100,5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              </svg>
            </div>
            
            <div className="flex-1 w-full flex items-start">
              {note.content}
            </div>
          </motion.div>
        ))}

        {/* Render Photos */}
        {INITIAL_PHOTOS.map((photo) => (
          <motion.div
            key={photo.id}
            drag
            dragMomentum={false}
            whileDrag={{ scale: 1.05, zIndex: 50, cursor: "grabbing" }}
            initial={{ x: photo.x, y: photo.y, rotate: photo.rotation }}
            className="absolute p-2 md:p-3 bg-white shadow-2xl cursor-grab rounded-sm border border-black/5"
            onPointerDown={(e) => e.stopPropagation()} // Stop drag from panning the background
          >
            <div className="relative w-40 h-48 md:w-48 md:h-56 bg-zinc-100 overflow-hidden mb-2 md:mb-3">
              <img 
                src={photo.src} 
                alt={photo.caption} 
                className={`w-full h-full object-cover pointer-events-none ${photo.blur || ""}`}
              />
            </div>
            <p className="font-writing text-center text-zinc-800 text-xs md:text-sm font-medium italic">
              {photo.caption}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Recenter Button Overlay */}
      <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 z-50">
        <button
          onClick={() => {
            x.set(-CENTER + window.innerWidth / 2);
            y.set(-CENTER + window.innerHeight / 2);
          }}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 rounded-full text-white text-sm font-medium transition-all shadow-lg active:scale-95"
        >
          Recenter
        </button>
      </div>
      
      {/* Instructions Overlay */}
      <div className="absolute top-24 right-6 md:top-8 md:right-8 z-50 pointer-events-none text-right hidden md:block">
        <p className="text-zinc-400 text-sm font-medium drop-shadow-md">Click & drag the grid to pan</p>
        <p className="text-zinc-500 text-xs mt-1 drop-shadow-md">Drag notes to rearrange them</p>
      </div>
    </div>
  );
}
