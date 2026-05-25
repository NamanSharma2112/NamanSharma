"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion, useAnimate } from "motion/react";

export default function Headphone() {
  const [interactionState, setInteractionState] = useState<"none" | "hover" | "click">("none");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);
  const [scope, animate] = useAnimate();

  // Determine actual eye state based on interaction
  let eyeState = 0;
  if (interactionState === "click") eyeState = 2; // surprised
  else if (interactionState === "hover") eyeState = 1; // happy

  // Track global mouse position to move eyes
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2; // range -1 to 1
      const y = (e.clientY / window.innerHeight - 0.5) * 2; // range -1 to 1
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Blink logic
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const blinkLoop = () => {
      // Random interval between blinks (1.5 to 5.5 seconds)
      const nextBlink = Math.random() * 4000 + 1500; 
      timeoutId = setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => {
          setIsBlinking(false);
          blinkLoop();
        }, 120); // very quick close-and-open
      }, nextBlink);
    };

    blinkLoop();
    return () => clearTimeout(timeoutId);
  }, []);

  // Landing sequence
  useEffect(() => {
    let isMounted = true;
    
    const run = async () => {
      if (!isMounted) return;
      
      // 1. Headphone drops down (from much higher up, face remains totally fixed)
      await animate(
        ".headphone",
        { y: [-80, 0] },
        { type: "spring", stiffness: 160, damping: 12, mass: 1 }
      );
      // Removed the squish animations completely so they stay strictly separate and fixed
    };

    run();

    return () => {
        isMounted = false;
    };
  }, [animate]);

  // Max eye movement offset (in pixels)
  const eyeMoveX = mousePos.x * 4.5;
  const eyeMoveY = mousePos.y * 4.5;

  return (
    <div 
      className="flex items-center justify-center pointer-events-auto cursor-pointer"
      onMouseEnter={() => setInteractionState("hover")}
      onMouseLeave={() => setInteractionState("none")}
      onMouseDown={() => setInteractionState("click")}
      onMouseUp={() => setInteractionState("hover")}
    >
      <svg
        ref={scope}
        className="w-20 overflow-visible drop-shadow-2xl"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
      >
        <motion.g className="headphone" style={{ transformOrigin: "center 32px" }}>
          <path
            d="m57.1 27.6-3.5-0.1c-1.1-3.9-3.1-7.4-5.6-10.2l2.4-2.3c2.9 2.9 5.7 7.6 6.7 12.6z"
            fill="#29B6F6"
          />
          <path
            d="m16 17.2c-2.5 2.8-4.4 6.1-5.4 10.3l-3.7 0.1c1-4.5 3.4-9.1 6.6-12.5l2.5 2.1z"
            fill="#29B6F6"
          />
          <path
            d="m32 7.1c-6 0-11.9 2.2-17 6.5l-1.3 1.2 0.5 0.9 1.9 1.5 1.1 0.2 0.4-0.3c3.7-3.3 8.5-5.7 14.4-5.7 5.2 0 10.3 1.7 14.5 5.3l0.4 0.4 1.1 0.1 1.9-1.5 0.5-1-1.3-1.1c-4-3.2-9.1-6.5-17.1-6.5z"
            fill="#354B58"
          />
          <path
            d="m58.2 26.9c-1.3-4.9-3.8-9.3-6.8-12.5-0.1-0.2-0.2-0.4-0.3-0.5-4.6-4.3-10-8-19.1-8-5.8 0-11.3 1.9-16.1 5.5-1 0.8-2 1.7-3.1 2.6-0.1 0.2-0.3 0.3-0.3 0.5-3 3.1-5.4 7.3-6.5 12.3-2.8 0.8-5.2 3.5-5.2 6.9v6.9c0 4 2.9 7.8 7.2 7.8h2.3c1.2 0 2.3-0.6 3.1-1.6 1.2 2.5 3 4.9 5.9 7 3.1 2.4 7.2 4.3 12.7 4.3 3.3 0 6.2-0.6 8.7-1.8 3.2-1.4 7.1-4.3 9.8-9.6 0.7 0.9 1.9 1.7 3.2 1.7h2.8c3.6 0 6.7-3 6.7-7.4v-7.4c-0.1-3-2.2-5.8-5-6.7zm-2.2-0.4zm-42.4-10.3c0.3 0.4 0.8 0.7 1.3 1.1-1.9 2.2-3.7 5.1-4.9 9.2h-1.9c1-3.5 3-7.4 5.5-10.3zm35.5 1c2 2.4 3.9 5.5 5.1 9.3h1.8c-1-3.5-3-7-5.7-10.3-0.3 0.4-0.8 0.8-1.2 1zm-33.9-2.6c4.2-3.7 9.7-6.7 16.6-6.7 5.6 0 11 1.7 17 6.7v0.1c-0.3 0.5-1.3 1.4-1.9 1.3-3.8-3.3-8.6-5.6-14.9-5.6-5.3 0-10 1.7-14.8 5.5-0.5 0.5-1.9-1-2-1.3zm-2.9 29.2c0 1.2-1 2.4-2.3 2.4h-2.2c-2.6 0-4.9-2.1-4.9-5.4v-7.1c0-2.5 2.3-5.1 4.9-5.1h2.2c1.3 0 2.3 0.9 2.3 2.2v13zm19.6 11.4c-9.8 0-17.6-7.9-17.6-17.6 0-8.5 7.4-17.9 17.7-17.9 9.2 0 17.6 7.8 17.6 17.9 0 8.7-7.1 17.6-17.7 17.6zm20.1-24.4c0-1.3 1-2.2 2-2.2h2.5c2.5 0 4.6 2.3 4.6 5v7c0 2.7-2.2 5.5-5 5.5h-2.1c-1 0-2.5-0.8-2.5-2.3v-13zm-1.7-2.4c-2.7-5-8.2-11.4-18.3-11.4-5.9 0-11.7 2.5-15.8 7.6-0.8 1-1.6 2.1-2.6 3.9-0.3-0.5-0.9-1.1-1.6-1.5 1-3.4 2.9-6.4 4.8-8.8 0.5 0.2 1.1 0 1.5-0.4 2.3-2.1 6.8-5.2 13.5-5.3 4.8 0 9.5 1.4 13.9 5.2 0.4 0.4 0.9 0.6 1.4 0.5 1.8 1.9 3.8 5.1 4.8 8.8-0.6 0.3-1.2 0.9-1.6 1.4z"
            fill="#22343D"
          />
        </motion.g>

        <motion.g className="head" style={{ transformOrigin: "center 45px" }}>
          <path
            d="m49.6 37.4c0 8.9-7.2 17.8-17.6 17.8-5.1 0-9.5-1.9-13-5.4-2.8-3.1-4.7-7.4-4.7-12.2 0-8.5 7.4-17.9 17.7-17.9 9.2 0 17.6 7.7 17.6 17.7z"
            fill="#E6E9EB"
          />

          <path
            d="m49.3 33.1c0.1 0.9 0.1 1.7 0.1 2.5 0 8.9-7 18.3-18.4 18.3-4.1 0-8.2-1.3-11-3.4 3.2 2.9 7.3 4.7 12 4.7 10.4 0 17.6-8.3 17.6-17.6 0-1.5-0.1-3-0.3-4.5z"
            fill="#CBD4D8"
          />

          {/* Group wrapper to follow cursor */}
          <motion.g
            animate={{ x: eyeMoveX, y: eyeMoveY }}
            transition={{ type: "spring", stiffness: 250, damping: 25 }}
          >
            <AnimatePresence mode="wait">
              {eyeState === 0 && (
                <motion.g
                  key="normal"
                  initial={{ y: -10, scale: 0.7, rotate: -6 }}
                  animate={{ 
                    y: 0, 
                    scaleX: 1, 
                    scaleY: isBlinking ? 0.1 : 1, // blink squishes eyes vertically
                    rotate: 0 
                  }}
                  exit={{ y: 10, scale: 0.75, rotate: 6 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: isBlinking ? 900 : 260, // super fast when blinking
                    damping: isBlinking ? 30 : 16 
                  }}
                  style={{ transformOrigin: "center 39px" }}
                >
                  <path
                    d="m28 39.7c-0.6 0-1.1-0.5-1.2-1.1-0.2-1.2-1.2-2.4-2.8-2.5-1.3 0.1-2.5 1-2.8 2.6-0.2 1-1.1 1.2-1.6 1s-1.1-0.8-0.9-1.6c0.3-2.3 2.5-4.4 5.2-4.5 2.7 0 5 2 5.3 4.8 0 0.8-0.5 1.3-1.2 1.3z"
                    fill="#22343D"
                  />
                  <path
                    d="m44.1 39.7c-0.6 0-1.1-0.5-1.2-1.1-0.3-1.2-1.3-2.4-2.8-2.5-1.3 0.1-2.6 0.9-2.9 2.6-0.2 0.8-0.9 1-1.4 1-0.5-0.1-1.2-0.5-1.1-1.4 0.2-2.2 2.4-4.6 5.2-4.7 2.7 0 5 1.9 5.4 4.7 0.1 0.9-0.6 1.4-1.2 1.4z"
                    fill="#22343D"
                  />
                </motion.g>
              )}

              {eyeState === 1 && (
                <motion.g
                  key="closed"
                  initial={{ y: -10, scale: 0.6, rotate: -8 }}
                  animate={{ y: 0, scale: 1, rotate: 0 }}
                  exit={{ y: 10, scale: 0.6, rotate: 8 }}
                  transition={{ type: "spring", stiffness: 260, damping: 16 }}
                >
                  <path
                    d="M20 37 Q24 33 28 37"
                    stroke="#22343D"
                    strokeWidth="2.5"
                    fill="transparent"
                    strokeLinecap="round"
                  />
                  <path
                    d="M36 37 Q40 33 44 37"
                    stroke="#22343D"
                    strokeWidth="2.5"
                    fill="transparent"
                    strokeLinecap="round"
                  />
                </motion.g>
              )}

              {eyeState === 2 && (
                <motion.g
                  key="surprised"
                  initial={{ y: -10, scale: 0.45 }}
                  animate={{ y: 0, scale: 1 }}
                  exit={{ y: 10, scale: 0.45 }}
                  transition={{ type: "spring", stiffness: 300, damping: 14 }}
                >
                  <circle cx="24" cy="36" r="2.6" fill="#22343D" />
                  <circle cx="40" cy="36" r="2.6" fill="#22343D" />
                </motion.g>
              )}
            </AnimatePresence>
          </motion.g>
        </motion.g>
      </svg>
    </div>
  );
}
