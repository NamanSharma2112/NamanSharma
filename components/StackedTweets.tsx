"use client";
import React from "react";
import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { Tweet } from "@/registry/spell-ui/tweet";

const INITIAL_TWEETS = [
  "2060428797443473817",
  "2059578920849342776",
  "2053411484752052536",
  "2056804349117186363",
];

const STACK_SPRING = { type: "spring" as const, stiffness: 380, damping: 32 };

export default function StackedTweets({ onSelect }: { onSelect: (id: string) => void }) {
  const [stack, setStack] = React.useState(INITIAL_TWEETS);

  return (
    <div className="relative flex w-full h-[400px] sm:h-[450px] items-center justify-center">
      {stack.map((id, index) => (
        <StackedTweetItem
          key={id}
          id={id}
          index={index}
          total={stack.length}
          onSendToBack={() => {
            setStack((s) => [...s.slice(1), s[0]]);
          }}
          onSelect={() => onSelect(id)}
        />
      ))}
    </div>
  );
}

type StackedTweetProps = {
  id: string;
  index: number;
  total: number;
  onSendToBack: () => void;
  onSelect: () => void;
};

const StackedTweetItem: React.FC<StackedTweetProps> = ({
  id,
  index,
  total,
  onSendToBack,
  onSelect,
}) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-150, 0, 150], [-10, 0, 10]);
  const isTop = index === 0;

  return (
    <motion.div
      layout
      drag={isTop ? "x" : false}
      dragConstraints={{ left: -150, right: 150 }}
      dragElastic={0.12}
      dragMomentum={false}
      onDragEnd={(_, info) => {
        if (!isTop) return;

        if (Math.abs(info.offset.x) > 80) {
          onSendToBack();
        }

        animate(x, 0, STACK_SPRING);
      }}
      style={{ zIndex: total - index, rotate, x }}
      animate={{
        y: index * 20, // Stack them downwards
        scale: 1 - index * 0.05,
      }}
      transition={STACK_SPRING}
      className={`absolute w-full max-w-[320px] ${
        isTop ? "cursor-grab active:cursor-grabbing" : "cursor-default"
      }`}
      onClick={(e) => {
        // If the user clicked without dragging, select the tweet
        if (isTop && Math.abs(x.get()) < 5) {
          onSelect();
        }
      }}
    >
      <div className="pointer-events-none [&_video]:pointer-events-auto bg-white rounded-2xl shadow-xl border border-zinc-200/60 w-full overflow-hidden transition-shadow duration-300 hover:shadow-2xl">
        <Tweet id={id} size="small" className="w-full m-0" />
      </div>
    </motion.div>
  );
}
