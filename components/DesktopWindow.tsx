"use client";

import { useRef, useState, type ReactNode } from "react";
import { motion, useDragControls } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * A macOS-style window that can be opened, closed, and dragged around.
 *
 * Traffic-light buttons, all three live:
 *  - Red: closes the window
 *  - Yellow: minimises it away
 *  - Green: toggles fullscreen
 */
export default function DesktopWindow({
  id,
  title,
  children,
  className,
  onClose,
  onFocus,
  zIndex = 10,
  defaultPosition = { x: 0, y: 0 },
  constraintsRef,
}: {
  id?: string;
  title?: string;
  children: ReactNode;
  className?: string;
  onClose?: () => void;
  onFocus?: () => void;
  zIndex?: number;
  defaultPosition?: { x: number; y: number };
  constraintsRef?: React.RefObject<Element | null>;
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const windowRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();

  return (
    <motion.div
      ref={windowRef}
      layoutId={id}
      drag={!isFullscreen}
      dragConstraints={constraintsRef || { top: -600, left: -1000, right: 1000, bottom: 800 }}
      dragElastic={0.05}
      dragMomentum={true}
      dragTransition={{ power: 0.15, timeConstant: 250, bounceStiffness: 400, bounceDamping: 30 }}
      dragControls={dragControls}
      dragListener={false} // We only want dragging from the title bar
      onPointerDown={onFocus}
      initial={{ opacity: 0, scale: 0.92, filter: "blur(8px)", x: defaultPosition.x, y: defaultPosition.y + 30 }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)", x: defaultPosition.x, y: defaultPosition.y }}
      exit={{ opacity: 0, scale: 0.92, filter: "blur(8px)", y: defaultPosition.y + 20 }}
      transition={{
        type: "spring",
        stiffness: 360,
        damping: 34,
        mass: 0.9,
        filter: { duration: 0.35, ease: [0.23, 1, 0.32, 1] },
      }}
      className={cn(
        "absolute flex flex-col border border-black/10 bg-[#f5f5f5] shadow-[0_40px_90px_-25px_rgba(0,0,0,0.75)] transition-[border-radius,width,height] duration-300",
        isFullscreen ? "rounded-none !fixed !inset-0 !max-w-none !max-h-none z-[100] !transform-none" : "rounded-xl",
        "dark:border-white/10 dark:bg-[#111110]",
        // Mobile responsiveness: Force center, ignore drag translations, and avoid dock overlap
        "max-sm:!transform-none max-sm:!w-[calc(100vw-24px)] max-sm:!h-[calc(100vh-130px)] max-sm:!max-h-[85vh] max-sm:mt-2 max-sm:mb-auto",
        className
      )}
      style={{
        zIndex: isFullscreen ? 100 : zIndex,
        width: isFullscreen ? "100vw" : "100%",
        maxWidth: isFullscreen ? "100vw" : "688px",
        maxHeight: isFullscreen ? "100vh" : "85vh",
      }}
    >
      {/* Title bar (Draggable Area) */}
      <div
        className={cn(
          "flex shrink-0 items-center gap-2 border-b border-black/5 px-4 py-3 dark:border-white/10 cursor-grab active:cursor-grabbing",
          isFullscreen ? "rounded-none" : "rounded-t-xl"
        )}
        onPointerDown={(e) => {
          if (!isFullscreen) dragControls.start(e);
        }}
      >
        {/* Red — close */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // Don't trigger drag
            onClose?.();
          }}
          className="group relative size-3 rounded-full bg-[#ff5f57] hover:brightness-90 transition-all duration-150 cursor-pointer pointer-events-auto"
          aria-label="Close window"
        >
          <svg
            viewBox="0 0 12 12"
            className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-150"
          >
            <line x1="3" y1="3" x2="9" y2="9" stroke="rgba(0,0,0,0.5)" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="9" y1="3" x2="3" y2="9" stroke="rgba(0,0,0,0.5)" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </button>
        {/* Yellow — minimise */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (isFullscreen) setIsFullscreen(false);
            onClose?.();
          }}
          className="group relative size-3 rounded-full bg-[#febc2e] hover:brightness-90 transition-all duration-150 cursor-pointer pointer-events-auto"
          aria-label="Minimize window"
        >
          <svg
            viewBox="0 0 12 12"
            className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-150"
          >
            <line x1="2.5" y1="6" x2="9.5" y2="6" stroke="rgba(0,0,0,0.5)" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </button>
        {/* Green — fullscreen. The state was already here and wired into the
            class list; nothing was flipping it. */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsFullscreen((prev) => !prev);
            onFocus?.();
          }}
          className="group relative size-3 rounded-full bg-[#28c840] hover:brightness-90 transition-all duration-150 cursor-pointer pointer-events-auto"
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          <svg
            viewBox="0 0 12 12"
            className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-150"
          >
            {isFullscreen ? (
              <path d="M3.5 6h5M6 3.5v5" fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth="1.2" strokeLinecap="round" />
            ) : (
              <path d="M3.5 8.5v-5h5M8.5 3.5v5h-5" fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth="1.2" strokeLinecap="round" />
            )}
          </svg>
        </button>

        {title && (
          <span className="ml-2 text-[13px] font-medium text-zinc-500 dark:text-zinc-400 select-none flex-1 text-center pr-12">
            {title}
          </span>
        )}
      </div>

      {/* Content Area (Scrollable) */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden rounded-b-xl min-h-0">
        {children}
      </div>
    </motion.div>
  );
}
