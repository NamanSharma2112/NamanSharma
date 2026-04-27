"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "motion/react";

interface BlurScrambleProps {
  text?: string;
  delay?: number;
  onFinish?: () => void;
}

const BlurScramble = ({ text = "NAMAN SHARMA", delay = 200, onFinish }: BlurScrambleProps) => {
  const [displayText, setDisplayText] = useState("");
  const [isFinished, setIsFinished] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const japChars =
    "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズヅブプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン";

  const startScramble = useCallback(() => {
    let iteration = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((letter, index) => {
            if (letter === " ") return " ";
            if (index < iteration) return text[index];
            return japChars[Math.floor(Math.random() * japChars.length)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        clearInterval(intervalRef.current!);
        setIsFinished(true);
        // Give a moment to appreciate the final text, then callback
        if (onFinish) setTimeout(onFinish, 800);
      }
      iteration += 1 / 3;
    }, 30);
  }, [text, onFinish]);

  useEffect(() => {
    const timer = setTimeout(startScramble, delay);
    return () => {
      clearTimeout(timer);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startScramble, delay]);

  return (
    <motion.h1
      initial={{ filter: "blur(8px)", opacity: 0, y: 10 }}
      animate={{
        filter: isFinished ? "blur(0px)" : "blur(4px)",
        opacity: 1,
        y: 0,
      }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="font-mono text-4xl sm:text-5xl font-bold text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] tracking-wider"
    >
      {displayText}
    </motion.h1>
  );
};

export default BlurScramble;
