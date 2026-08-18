"use client";

import { useEffect, useRef, useState } from "react";

/* ── Notepad ────────────────────────────────────────────────────────────── */

const README = `readme.txt

Thanks for turning the machine on.

This is a Windows 7 desktop rebuilt in React — the boot screen, the
Aero glass, the taskbar, the Start menu and the windows are all
drawn rather than screenshotted. The games underneath are real:
Minesweeper lays its board after your first click so you can never
lose on move one, and Solitaire plays a proper draw-one Klondike.

Things worth trying:
  · Right click a square in Minesweeper to flag it.
  · Double click a card in Solitaire to send it to a foundation.
  · Drag a window by its title bar. Double click the bar to maximise.
  · Open the Start menu and look in Games.

— Naman
`;

export function Notepad() {
  const [text, setText] = useState(README);

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex gap-4 border-b border-[#c3d0dd] bg-[#f2f6fa] px-3 py-1 text-[11px] text-[#1b2a38]">
        {["File", "Edit", "Format", "View", "Help"].map((m) => (
          <span key={m} className="cursor-default rounded px-1 hover:bg-[#cfe4f6]">
            {m}
          </span>
        ))}
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        spellCheck={false}
        aria-label="Notepad document"
        className="h-full w-full flex-1 resize-none p-3 font-mono text-[12px] leading-[1.5] text-[#111] outline-none"
      />
    </div>
  );
}

/* ── Calculator ─────────────────────────────────────────────────────────── */

const KEYS = [
  ["MC", "MR", "MS", "M+"],
  ["←", "CE", "C", "±"],
  ["7", "8", "9", "/"],
  ["4", "5", "6", "*"],
  ["1", "2", "3", "-"],
  ["0", ".", "=", "+"],
];

export function Calculator() {
  const [shown, setShown] = useState("0");
  const [pending, setPending] = useState<{ op: string; value: number } | null>(null);
  const [fresh, setFresh] = useState(true);
  const [memory, setMemory] = useState(0);

  const apply = (a: number, b: number, op: string) => {
    if (op === "+") return a + b;
    if (op === "-") return a - b;
    if (op === "*") return a * b;
    if (op === "/") return b === 0 ? NaN : a / b;
    return b;
  };

  const press = (key: string) => {
    const current = Number(shown);

    if (/^[0-9]$/.test(key)) {
      setShown(fresh || shown === "0" ? key : shown + key);
      setFresh(false);
      return;
    }
    if (key === ".") {
      if (fresh) {
        setShown("0.");
        setFresh(false);
      } else if (!shown.includes(".")) setShown(shown + ".");
      return;
    }
    if (key === "C") {
      setShown("0");
      setPending(null);
      setFresh(true);
      return;
    }
    if (key === "CE") {
      setShown("0");
      setFresh(true);
      return;
    }
    if (key === "←") {
      setShown(shown.length > 1 ? shown.slice(0, -1) : "0");
      return;
    }
    if (key === "±") {
      setShown(shown.startsWith("-") ? shown.slice(1) : shown === "0" ? "0" : `-${shown}`);
      return;
    }
    if (key === "MS") return setMemory(current);
    if (key === "MC") return setMemory(0);
    if (key === "M+") return setMemory(memory + current);
    if (key === "MR") {
      setShown(String(memory));
      setFresh(true);
      return;
    }

    if (key === "=") {
      if (!pending) return;
      const result = apply(pending.value, current, pending.op);
      setShown(Number.isFinite(result) ? String(result) : "Cannot divide by zero");
      setPending(null);
      setFresh(true);
      return;
    }

    // An operator with one already waiting resolves it first, so 2+3+4 chains.
    const value = pending && !fresh ? apply(pending.value, current, pending.op) : current;
    if (pending && !fresh) setShown(Number.isFinite(value) ? String(value) : "Error");
    setPending({ op: key, value });
    setFresh(true);
  };

  return (
    <div className="flex h-full flex-col bg-[#eef3f8] p-2">
      <div className="w7-sunken mb-2 rounded-[2px] px-2 py-2 text-right font-mono text-[20px] text-[#111]">
        {shown}
      </div>
      <div className="grid flex-1 grid-cols-4 gap-1">
        {KEYS.flat().map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => press(key)}
            className="w7-btn text-[12px] text-[#1b2a38]"
            style={
              key === "="
                ? { background: "linear-gradient(to bottom,#d6ecff,#a8d4f5)" }
                : undefined
            }
          >
            {key}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Paint ──────────────────────────────────────────────────────────────── */

const SWATCHES = [
  "#000000", "#7f7f7f", "#880015", "#ed1c24", "#ff7f27", "#fff200",
  "#22b14c", "#00a2e8", "#3f48cc", "#a349a4", "#ffffff", "#c3c3c3",
];

export function Paint() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState("#000000");
  const [width, setWidth] = useState(3);
  const drawing = useRef(false);

  // A canvas resets whenever its backing store is sized, so it is sized once.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const draw = (e: React.PointerEvent<HTMLCanvasElement>, start: boolean) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = color;
    ctx.lineWidth = width;

    if (start) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      // A click with no drag should still leave a dot.
      ctx.lineTo(x + 0.01, y);
      ctx.stroke();
      return;
    }
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="flex h-full flex-col bg-[#eef3f8]">
      <div className="flex items-center gap-3 border-b border-[#c3d0dd] px-2 py-1.5">
        <div className="grid grid-cols-6 gap-[3px]">
          {SWATCHES.map((c) => (
            <button
              key={c}
              type="button"
              aria-label={`Colour ${c}`}
              onClick={() => setColor(c)}
              className="size-[14px] rounded-[2px]"
              style={{
                background: c,
                boxShadow:
                  color === c
                    ? "0 0 0 2px #2f8fd0, inset 0 0 0 1px rgba(0,0,0,0.4)"
                    : "inset 0 0 0 1px rgba(0,0,0,0.4)",
              }}
            />
          ))}
        </div>

        <input
          type="range"
          min={1}
          max={22}
          value={width}
          onChange={(e) => setWidth(Number(e.target.value))}
          aria-label="Brush size"
          className="w-24 accent-[#2f8fd0]"
        />

        <button type="button" onClick={clear} className="w7-btn ml-auto px-2.5 py-1 text-[11px]">
          Clear
        </button>
      </div>

      <div className="flex-1 p-2">
        <canvas
          ref={canvasRef}
          width={620}
          height={420}
          onPointerDown={(e) => {
            drawing.current = true;
            e.currentTarget.setPointerCapture(e.pointerId);
            draw(e, true);
          }}
          onPointerMove={(e) => drawing.current && draw(e, false)}
          onPointerUp={() => (drawing.current = false)}
          onPointerCancel={() => (drawing.current = false)}
          className="h-full w-full cursor-crosshair rounded-[2px] bg-white"
          style={{ boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.35)" }}
        />
      </div>
    </div>
  );
}
