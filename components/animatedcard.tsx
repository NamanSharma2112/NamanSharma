"use client";
import React from "react";

export default function AnimatedCard({
  imgSrc,
  title,
  aboutProduct,
}: {
  imgSrc: string;
  title: string;
  aboutProduct: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center w-[160px] h-[200px] bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 shadow-xl rounded-2xl p-4 gap-3 text-center transition-all hover:shadow-2xl">
      <div className="w-12 h-12 rounded-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 flex items-center justify-center overflow-hidden">
        <img src={imgSrc} alt={title} className="w-6 h-6 object-contain opacity-80 dark:opacity-90 dark:invert transition-all" />
      </div>
      <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-100 leading-tight">{title}</h3>
      <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-tight line-clamp-3">
        {aboutProduct}
      </p>
    </div>
  );
}
