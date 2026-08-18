"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Snake on a 20×16 grid.
 *
 * The queued direction matters: without it, two quick turns inside one tick
 * would let the snake double back into itself, which reads as the game
 * cheating rather than as a mistake.
 */

const COLS = 20;
const ROWS = 16;
const CELL = 18;
const TICK_MS = 130;

type Point = { x: number; y: number };
type Dir = "up" | "down" | "left" | "right";

const STEP: Record<Dir, Point> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const OPPOSITE: Record<Dir, Dir> = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
};

const START: Point[] = [
  { x: 6, y: 8 },
  { x: 5, y: 8 },
  { x: 4, y: 8 },
];

const randomFood = (snake: Point[]): Point => {
  const taken = new Set(snake.map((p) => `${p.x},${p.y}`));
  const free: Point[] = [];
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (!taken.has(`${x},${y}`)) free.push({ x, y });
    }
  }
  return free[Math.floor(Math.random() * free.length)] ?? { x: 0, y: 0 };
};

export default function Snake() {
  const [snake, setSnake] = useState<Point[]>(START);
  const [food, setFood] = useState<Point>({ x: 13, y: 8 });
  const [dead, setDead] = useState(false);
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);

  // Turns taken between ticks queue up rather than overwriting each other.
  const dir = useRef<Dir>("right");
  const queued = useRef<Dir[]>([]);

  const reset = useCallback(() => {
    setSnake(START);
    setFood({ x: 13, y: 8 });
    setScore(0);
    setDead(false);
    setRunning(true);
    dir.current = "right";
    queued.current = [];
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, Dir> = {
        ArrowUp: "up",
        ArrowDown: "down",
        ArrowLeft: "left",
        ArrowRight: "right",
        w: "up",
        s: "down",
        a: "left",
        d: "right",
      };
      const next = map[e.key];
      if (!next) {
        if (e.key === " ") {
          e.preventDefault();
          if (dead) reset();
          else setRunning((r) => !r);
        }
        return;
      }
      e.preventDefault();
      const last = queued.current[queued.current.length - 1] ?? dir.current;
      if (next !== last && next !== OPPOSITE[last]) queued.current.push(next);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dead, reset]);

  useEffect(() => {
    if (!running || dead) return;
    const id = window.setInterval(() => {
      setSnake((body) => {
        const turn = queued.current.shift();
        if (turn) dir.current = turn;

        const step = STEP[dir.current];
        const head = { x: body[0].x + step.x, y: body[0].y + step.y };

        const offBoard =
          head.x < 0 || head.y < 0 || head.x >= COLS || head.y >= ROWS;
        // The tail square is free this tick — it moves out as the head moves in.
        const hitSelf = body
          .slice(0, -1)
          .some((p) => p.x === head.x && p.y === head.y);

        if (offBoard || hitSelf) {
          setDead(true);
          setRunning(false);
          setBest((b) => Math.max(b, body.length - START.length));
          return body;
        }

        const ate = head.x === food.x && head.y === food.y;
        const next = [head, ...(ate ? body : body.slice(0, -1))];
        if (ate) {
          setFood(randomFood(next));
          setScore((s) => s + 1);
        }
        return next;
      });
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [running, dead, food]);

  return (
    <div className="flex h-full flex-col items-center bg-[#e8eef4] p-3">
      <div className="mb-2 flex w-full items-center justify-between px-1 text-[11px] text-[#1b2a38]">
        <span>
          Score: <b>{score}</b> &nbsp; Best: <b>{best}</b>
        </span>
        <button type="button" onClick={reset} className="w7-btn px-2.5 py-1 text-[11px]">
          {dead ? "Play again" : "Restart"}
        </button>
      </div>

      <div
        className="relative rounded-[3px]"
        style={{
          width: COLS * CELL,
          height: ROWS * CELL,
          background: "#1d5230",
          boxShadow: "inset 0 0 0 2px #0e2a18, inset 0 0 30px rgba(0,0,0,0.5)",
        }}
      >
        <span
          className="absolute rounded-[3px]"
          style={{
            left: food.x * CELL + 3,
            top: food.y * CELL + 3,
            width: CELL - 6,
            height: CELL - 6,
            background: "#e64a34",
            boxShadow: "0 0 8px rgba(230,74,52,0.8)",
          }}
        />
        {snake.map((p, i) => (
          <span
            key={`${p.x}-${p.y}-${i}`}
            className="absolute rounded-[3px]"
            style={{
              left: p.x * CELL + 1,
              top: p.y * CELL + 1,
              width: CELL - 2,
              height: CELL - 2,
              background: i === 0 ? "#b7f07a" : "#7ed957",
              opacity: 1 - Math.min(i / (snake.length + 6), 0.45),
            }}
          />
        ))}

        {(!running || dead) && (
          <div className="absolute inset-0 grid place-items-center bg-black/55 text-center text-white">
            <div>
              <p className="text-[14px] font-semibold">
                {dead ? "Game over" : score > 0 ? "Paused" : "Snake"}
              </p>
              <p className="mt-1 text-[11px] text-white/75">
                {dead ? `You scored ${score}` : "Arrow keys or WASD"}
              </p>
              <button
                type="button"
                onClick={dead ? reset : () => setRunning(true)}
                className="w7-btn mt-3 px-3 py-1 text-[11px] text-[#1b2a38]"
              >
                {dead ? "Play again" : "Start"}
              </button>
            </div>
          </div>
        )}
      </div>

      <p className="mt-2 text-[11px] text-[#54636f]">Space pauses.</p>
    </div>
  );
}
