"use client";

import { useCallback, useEffect, useState } from "react";
import { useWindowSize } from "../WindowContext";

/**
 * Minesweeper, on any of the three original boards.
 *
 * Two rules carried over from the original because the game is unfair without
 * them: the first square you open is never a mine (the board is laid *after*
 * that click), and opening a square with no neighbouring mines cascades until
 * it reaches numbers.
 */

/** The three original boards. */
const LEVELS = {
  Beginner: { cols: 9, rows: 9, mines: 10 },
  Intermediate: { cols: 16, rows: 16, mines: 40 },
  Expert: { cols: 30, rows: 16, mines: 99 },
} as const;

type Level = keyof typeof LEVELS;

/** Square size, in px — the grid and the window sizing both read it. */
const CELL = 24;

/** The original palette, one colour per count. */
const NUMBER_COLOR = [
  "",
  "#0000ff",
  "#008000",
  "#ff0000",
  "#000080",
  "#800000",
  "#008080",
  "#000000",
  "#808080",
];

type Cell = {
  mine: boolean;
  count: number;
  open: boolean;
  flagged: boolean;
};

type Status = "ready" | "playing" | "won" | "lost";

const emptyBoard = (level: Level): Cell[] => {
  const { cols, rows } = LEVELS[level];
  return Array.from({ length: cols * rows }, () => ({
    mine: false,
    count: 0,
    open: false,
    flagged: false,
  }));
};

const neighbours = (i: number, level: Level) => {
  const { cols, rows } = LEVELS[level];
  const x = i % cols;
  const y = Math.floor(i / cols);
  const out: number[] = [];
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (!dx && !dy) continue;
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
      out.push(ny * cols + nx);
    }
  }
  return out;
};

/** Lays mines anywhere except the opening click and the squares touching it. */
const layMines = (board: Cell[], safe: number, level: Level) => {
  const forbidden = new Set([safe, ...neighbours(safe, level)]);
  const spots: number[] = [];
  for (let i = 0; i < board.length; i++) if (!forbidden.has(i)) spots.push(i);
  for (let i = spots.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [spots[i], spots[j]] = [spots[j], spots[i]];
  }
  const next = board.map((c) => ({ ...c }));
  for (const spot of spots.slice(0, LEVELS[level].mines)) next[spot].mine = true;
  for (let i = 0; i < next.length; i++) {
    next[i].count = neighbours(i, level).filter((n) => next[n].mine).length;
  }
  return next;
};

const cascade = (board: Cell[], from: number, level: Level) => {
  const next = board.map((c) => ({ ...c }));
  const stack = [from];
  while (stack.length) {
    const i = stack.pop()!;
    const cell = next[i];
    if (cell.open || cell.flagged) continue;
    cell.open = true;
    if (cell.count === 0 && !cell.mine) stack.push(...neighbours(i, level));
  }
  return next;
};

const pad = (n: number) => String(Math.max(0, Math.min(999, n))).padStart(3, "0");

export default function Minesweeper() {
  const [level, setLevel] = useState<Level>("Beginner");
  const [board, setBoard] = useState<Cell[]>(() => emptyBoard("Beginner"));
  const [status, setStatus] = useState<Status>("ready");
  const [seconds, setSeconds] = useState(0);
  const [pressed, setPressed] = useState(false);

  const flags = board.filter((c) => c.flagged).length;
  const { requestSize } = useWindowSize();

  // The board decides how big the window has to be, not the other way round.
  useEffect(() => {
    const { cols, rows } = LEVELS[level];
    requestSize(cols * CELL + 34, rows * CELL + 150);
  }, [level, requestSize]);

  useEffect(() => {
    if (status !== "playing") return;
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [status]);

  const reset = useCallback(
    (to: Level = level) => {
      setLevel(to);
      setBoard(emptyBoard(to));
      setStatus("ready");
      setSeconds(0);
    },
    [level]
  );

  const open = (i: number) => {
    if (status === "won" || status === "lost") return;
    if (board[i].flagged || board[i].open) return;

    let laid = board;
    if (status === "ready") {
      laid = layMines(board, i, level);
      setStatus("playing");
      setSeconds(0);
    }

    if (laid[i].mine) {
      setBoard(
        laid.map((c) => (c.mine ? { ...c, open: true } : { ...c, open: c.open }))
      );
      setStatus("lost");
      return;
    }

    const next = cascade(laid, i, level);
    const remaining = next.filter((c) => !c.open && !c.mine).length;
    setBoard(next);
    if (remaining === 0) {
      setBoard(next.map((c) => (c.mine ? { ...c, flagged: true } : c)));
      setStatus("won");
    }
  };

  const flag = (i: number) => {
    if (status === "won" || status === "lost" || board[i].open) return;
    setBoard(board.map((c, n) => (n === i ? { ...c, flagged: !c.flagged } : c)));
  };

  const face = status === "lost" ? "😵" : status === "won" ? "😎" : pressed ? "😮" : "🙂";
  const { cols, mines } = LEVELS[level];

  return (
    <div className="flex h-full flex-col items-center overflow-auto bg-[#c6c6c6] p-3">
      <div className="mb-2 flex w-full items-center gap-1">
        {(Object.keys(LEVELS) as Level[]).map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => reset(name)}
            aria-pressed={level === name}
            className="w7-btn flex-1 px-1.5 py-1 text-[10.5px]"
            style={
              level === name
                ? {
                    background: "linear-gradient(to bottom,#bfe2fb,#8cc4ee)",
                    boxShadow:
                      "inset 0 0 0 1px rgba(255,255,255,0.85), 0 0 0 1px #3a7fb5, inset 0 2px 4px rgba(0,60,110,0.28)",
                    fontWeight: 600,
                  }
                : undefined
            }
          >
            {name}
          </button>
        ))}
      </div>

      <div className="w7-sunken flex w-full items-center justify-between rounded-[2px] p-2">
        <Counter value={pad(mines - flags)} />
        <button
          type="button"
          onClick={() => reset()}
          aria-label="New game"
          className="w7-raised grid size-[27px] place-items-center rounded-[2px] text-[15px] leading-none active:shadow-none"
        >
          {face}
        </button>
        <Counter value={pad(seconds)} />
      </div>

      <div
        className="w7-sunken mt-3 grid rounded-[2px] p-[3px]"
        style={{ gridTemplateColumns: `repeat(${cols}, ${CELL}px)` }}
        onContextMenu={(e) => e.preventDefault()}
        onPointerDown={() => setPressed(true)}
        onPointerUp={() => setPressed(false)}
        onPointerLeave={() => setPressed(false)}
      >
        {board.map((cell, i) => {
          const showMine = cell.open && cell.mine;
          return (
            <button
              key={i}
              type="button"
              aria-label={`Square ${(i % cols) + 1}, ${Math.floor(i / cols) + 1}`}
              onClick={() => open(i)}
              onContextMenu={(e) => {
                e.preventDefault();
                flag(i);
              }}
              className={`grid size-6 place-items-center text-[13px] font-bold leading-none ${
                cell.open ? "w7-pressed" : "w7-raised"
              }`}
              style={{
                color: NUMBER_COLOR[cell.count],
                background: showMine ? "#ff2d2d" : undefined,
              }}
            >
              {cell.flagged && !cell.open ? (
                <span className="text-[11px]">🚩</span>
              ) : showMine ? (
                <span className="text-[12px]">💣</span>
              ) : cell.open && cell.count > 0 ? (
                cell.count
              ) : null}
            </button>
          );
        })}
      </div>

      <p className="mt-3 text-center text-[11px] text-[#3d4a57]">
        {status === "won"
          ? "Cleared. Nicely done."
          : status === "lost"
            ? "Boom. Click the face to try again."
            : "Left click to open · right click to flag"}
      </p>
    </div>
  );
}

/** The seven-segment LED readouts either side of the face. */
function Counter({ value }: { value: string }) {
  return (
    <span
      className="rounded-[2px] px-1.5 py-0.5 font-mono text-[19px] leading-none tracking-[2px]"
      style={{ background: "#000", color: "#ff2d2d" }}
    >
      {value}
    </span>
  );
}
