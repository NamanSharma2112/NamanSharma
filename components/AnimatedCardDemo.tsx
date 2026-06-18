"use client";
import AnimatedCard from "./animatedcard";
import { easeInOut, motion } from "framer-motion";
import { useState } from "react";

const tools = [
  {
    imgSrc: "https://cdn.simpleicons.org/tailwindcss/000000",
    title: "Tailwind CSS",
    aboutProduct: "A utility-first CSS framework for rapidly building custom UIs.",
  },
  {
    imgSrc: "https://cdn.simpleicons.org/nextdotjs/000000",
    title: "Next.js",
    aboutProduct: "A React framework for production with server-side rendering and static site generation.",
  },
  {
    imgSrc: "https://cdn.simpleicons.org/shadcnui/000000",
    title: "Shadcn UI",
    aboutProduct: "Beautiful, accessible components built using Radix UI and Tailwind CSS.",
  },
  {
    imgSrc: "https://cdn.simpleicons.org/framer/000000",
    title: "Motion",
    aboutProduct: "A production-ready motion library for React.",
  },
];

export default function AnimatedCardDemo() {
  const rotateDegree = [-20, -10, 5, 17];
  const xAxis = [-180, -60, 60, 180]; // Reduced spread to fit inside a profile container
  const yAxis = [-20, -40, -40, -10];
  const initialRotation = [0, 6, -12, 17];
  const zIndex = [40, 30, 20, 10];

  return (
    <div className="hidden sm:flex justify-center h-[280px] items-center relative w-full">
      {tools.map((tool, ind) => (
        <motion.div
          key={ind}
          initial={{ x: 0, y: 0, rotate: initialRotation[ind] }}
          animate={{ x: xAxis[ind], y: yAxis[ind], rotate: rotateDegree[ind] }}
          whileHover={{ 
            y: yAxis[ind] - 25, 
            scale: 1.08, 
            rotate: 0, 
            zIndex: 100 
          }}
          transition={{ ease: easeInOut, duration: 0.3 }}
          style={{
            zIndex: zIndex[ind],
          }}
          className="absolute flex justify-center items-center cursor-pointer"
        >
          <AnimatedCard imgSrc={tool.imgSrc} title={tool.title} aboutProduct={tool.aboutProduct} />
        </motion.div>
      ))}
    </div>
  );
}
