"use client";

import React from "react";

type Card = {
  src: string;
  alt: string;
  dx: number;
  r: number;
};

type Props = {
  label: string;
  cards: Card[];
};

export default function HoverCards({ label, cards }: Props) {
  return (
    <span className="card-trigger inline-block">
      <span className="cursor-default underline decoration-dotted underline-offset-2">
        {label}
      </span>
      <span aria-hidden="true" className="card-stack">
        {cards.map((card, i) => (
          <span
            key={i}
            className="hover-card"
            style={{
              "--dx": `${card.dx}px`,
              "--r": `${card.r}deg`,
              "--delay": `${i * 30}ms`,
            } as React.CSSProperties}
          >
            <img
              alt={card.alt}
              src={card.src}
              width={145}
              height={172}
              className="h-full w-full object-cover"
            />
          </span>
        ))}
      </span>
    </span>
  );
}
