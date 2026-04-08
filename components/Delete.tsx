"use client"

import { useRef, useState, PointerEvent } from 'react';
import {
  AnimatePresence,
  Variants,
  animate,
  motion,
  useMotionValue,
  useTransform,
} from 'framer-motion';
import '../app/HoldToConfirm.css';

type Direction = 'back' | 'forward';

const textVariants: Variants = {
  initial: (direction: Direction) => ({
    y: direction === 'forward' ? '-30%' : '30%',
    opacity: 0,
  }),
  target: {
    y: '0%',
    opacity: 1,
  },
  exit: (direction: Direction) => ({
    y: direction === 'forward' ? '30%' : '-30%',
    opacity: 0,
  }),
};

const buttonVariants: Variants = {
  idle: {
    x: 0,
    rotate: 0,
    transition: {
      duration: 0.1,
    },
  },
  shaking: {
    x: [10, -10],
    rotate: [-3, 3],
    transition: {
      repeatType: 'mirror',
      repeat: Infinity,
      duration: 0.1,
      ease: 'easeInOut',
    },
  },
};

type HoldToConfirmProps = {
  text: string;
  confirmTimeout?: number;
  onConfirm?: VoidFunction;
};

export const HoldToConfirmFinal = ({
  text: textFromProps,
  confirmTimeout = 2,
  onConfirm,
}: HoldToConfirmProps) => {
  const startCountdown = () => {
    setState('inProgress');
    // Generates array like [100, 50, 100, 50, 100, 50, ...]
    const pattern = new Array(confirmTimeout * 10)
      .fill(0)
      .map((_, ind) => (ind % 2 === 0 ? 100 : 50));
    navigator.vibrate?.(pattern);
    animate(progress, 1, { duration: confirmTimeout, ease: 'linear' }).then(
      () => {
        if (progress.get() !== 1) return;
        setState('complete');
        navigator.vibrate(0); // Stop vibrating
      }
    );
  };

  const cancelCountdown = () => {
    navigator.vibrate?.(0);
    progress.stop();
    setState('idle');
    animate(progress, 0, { duration: 0.2, ease: 'linear' });
  };

  const pointerUp = (e: PointerEvent) => {
    const target = document.elementFromPoint(e.clientX, e.clientY);
    if (progress.get() === 1 && ref.current?.contains(target)) {
      animate(fillerConfirmAnimationProgress, 1, {
        duration: 0.2,
        ease: 'linear',
      }).then(() => {
        fillerConfirmAnimationProgress.jump(0);
        progress.jump(0);
        setState('idle');
        onConfirm?.();
      });
    } else {
      cancelCountdown();
    }
  };

  const pointerMove = (e: PointerEvent) => {
    // Mouse will be handled by onPointerLeave
    if (e.pointerType === 'mouse') return;
    const target = document.elementFromPoint(e.clientX, e.clientY);
    if (!ref.current?.contains(target)) {
      cancelCountdown();
    }
  };

  const [state, setState] = useState<'idle' | 'inProgress' | 'complete'>(
    'idle'
  );
  const ref = useRef<HTMLButtonElement>(null);

  const progress = useMotionValue(0);
  const fillRightOffset = useTransform(progress, (v) => `${(1 - v) * 100}%`);

  // This is used in 'completion' animation
  const fillerConfirmAnimationProgress = useMotionValue(0);
  const fillLeftOffset = useTransform(
    fillerConfirmAnimationProgress,
    (v) => `${v * 100}%`
  );

  const text =
    state === 'idle'
      ? textFromProps
      : state === 'inProgress'
      ? 'Hold to confirm'
      : 'Release to confirm';

  const textDirection: Direction = state === 'idle' ? 'back' : 'forward';

  return (
    <motion.button
      className="PressToConfirm"
      ref={ref}
      onPointerDown={startCountdown}
      onPointerUp={pointerUp}
      onPointerCancel={cancelCountdown}
      onPointerLeave={(e) => {
        // For touchscreen browser always generates PointerLeave at
        // the end of touch, even if it ended on the element, so
        // we handle only mouse leave here
        if (e.pointerType === 'mouse') cancelCountdown();
      }}
      onPointerMove={pointerMove}
      // Prevent context menu on mobiles (caused by long touch)
      onContextMenuCapture={(e) => e.preventDefault()}
      variants={buttonVariants}
      animate={state === 'inProgress' ? 'shaking' : 'idle'}
    >
      <motion.div
        className="filler"
        style={{
          left: fillLeftOffset,
          right: fillRightOffset,
        }}
      />
      <AnimatePresence custom={textDirection} initial={false} mode="popLayout">
        <motion.div
          key={text}
          className="text"
          variants={textVariants}
          custom={textDirection}
          initial="initial"
          animate="target"
          exit="exit"
        >
          {text}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
};
