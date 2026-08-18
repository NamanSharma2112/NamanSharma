"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

/**
 * Klondike solitaire, draw one.
 *
 * Played by clicking rather than dragging: pick a card up, then pick where it
 * goes. Dragging is the nostalgic way, but on a page that already scrolls and
 * has windows to move, a click-to-move board is the one that actually works —
 * and double-clicking still sends a card straight home.
 */

const SUITS = ["♠", "♥", "♦", "♣"] as const;
type Suit = (typeof SUITS)[number];

type Card = {
  id: string;
  suit: Suit;
  /** 1 = ace … 13 = king. */
  rank: number;
  faceUp: boolean;
};

type Pile = "stock" | "waste" | "foundation" | "tableau";
type Spot = { pile: Pile; index: number; card?: number };

const RANK_LABEL = ["", "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const isRed = (suit: Suit) => suit === "♥" || suit === "♦";

type Board = {
  stock: Card[];
  waste: Card[];
  foundations: Card[][];
  tableau: Card[][];
};

function deal(): Board {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (let rank = 1; rank <= 13; rank++) {
      deck.push({ id: `${suit}${rank}`, suit, rank, faceUp: false });
    }
  }
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  const tableau: Card[][] = [];
  let at = 0;
  for (let col = 0; col < 7; col++) {
    const pile = deck.slice(at, at + col + 1);
    at += col + 1;
    pile[pile.length - 1].faceUp = true;
    tableau.push(pile);
  }

  return {
    stock: deck.slice(at),
    waste: [],
    foundations: [[], [], [], []],
    tableau,
  };
}

/** A card may sit on a foundation only in suit, in order, from the ace up. */
const fitsFoundation = (card: Card, pile: Card[]) =>
  pile.length === 0
    ? card.rank === 1
    : pile[pile.length - 1].suit === card.suit &&
      pile[pile.length - 1].rank === card.rank - 1;

/** …and on the tableau only in alternating colour, descending, kings first. */
const fitsTableau = (card: Card, pile: Card[]) => {
  if (pile.length === 0) return card.rank === 13;
  const top = pile[pile.length - 1];
  return top.faceUp && isRed(top.suit) !== isRed(card.suit) && top.rank === card.rank + 1;
};

export default function Solitaire() {
  const [board, setBoard] = useState<Board>(deal);
  const [held, setHeld] = useState<Spot | null>(null);
  const [moves, setMoves] = useState(0);

  const won = useMemo(
    () => board.foundations.every((f) => f.length === 13),
    [board.foundations]
  );

  const newGame = useCallback(() => {
    setBoard(deal());
    setHeld(null);
    setMoves(0);
  }, []);

  // Escape drops whatever is in hand.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setHeld(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const drawStock = () => {
    setHeld(null);
    setBoard((b) => {
      if (b.stock.length === 0) {
        // Turning the waste back over costs nothing in draw-one.
        return {
          ...b,
          stock: [...b.waste].reverse().map((c) => ({ ...c, faceUp: false })),
          waste: [],
        };
      }
      const stock = [...b.stock];
      const card = { ...stock.pop()!, faceUp: true };
      return { ...b, stock, waste: [...b.waste, card] };
    });
    setMoves((m) => m + 1);
  };

  /** Everything from `card` down, which only ever comes off the tableau. */
  const cardsAt = (spot: Spot): Card[] => {
    if (spot.pile === "waste") {
      const top = board.waste[board.waste.length - 1];
      return top ? [top] : [];
    }
    if (spot.pile === "foundation") {
      const pile = board.foundations[spot.index];
      const top = pile[pile.length - 1];
      return top ? [top] : [];
    }
    if (spot.pile === "tableau") {
      return board.tableau[spot.index].slice(spot.card ?? 0);
    }
    return [];
  };

  /** Takes the moving cards off wherever they came from, turning up behind. */
  const lift = (b: Board, from: Spot): Board => {
    if (from.pile === "waste") return { ...b, waste: b.waste.slice(0, -1) };
    if (from.pile === "foundation") {
      const foundations = b.foundations.map((f, i) =>
        i === from.index ? f.slice(0, -1) : f
      );
      return { ...b, foundations };
    }
    const tableau = b.tableau.map((pile, i) => {
      if (i !== from.index) return pile;
      const rest = pile.slice(0, from.card ?? 0);
      if (rest.length && !rest[rest.length - 1].faceUp) {
        rest[rest.length - 1] = { ...rest[rest.length - 1], faceUp: true };
      }
      return rest;
    });
    return { ...b, tableau };
  };

  const drop = (to: Spot) => {
    if (!held) return;
    const moving = cardsAt(held);
    if (moving.length === 0) return setHeld(null);

    const sameSpot =
      held.pile === to.pile && held.index === to.index && to.pile !== "tableau";
    if (sameSpot) return setHeld(null);

    if (to.pile === "foundation") {
      if (moving.length !== 1 || !fitsFoundation(moving[0], board.foundations[to.index])) {
        return setHeld(null);
      }
      const lifted = lift(board, held);
      setBoard({
        ...lifted,
        foundations: lifted.foundations.map((f, i) =>
          i === to.index ? [...f, moving[0]] : f
        ),
      });
    } else if (to.pile === "tableau") {
      if (!fitsTableau(moving[0], board.tableau[to.index])) return setHeld(null);
      const lifted = lift(board, held);
      setBoard({
        ...lifted,
        tableau: lifted.tableau.map((p, i) => (i === to.index ? [...p, ...moving] : p)),
      });
    } else {
      return setHeld(null);
    }

    setHeld(null);
    setMoves((m) => m + 1);
  };

  /** Double-click: send it home if any foundation will take it. */
  const sendHome = (from: Spot) => {
    const moving = cardsAt(from);
    if (moving.length !== 1) return;
    const target = board.foundations.findIndex((f) => fitsFoundation(moving[0], f));
    if (target < 0) return;
    const lifted = lift(board, from);
    setBoard({
      ...lifted,
      foundations: lifted.foundations.map((f, i) =>
        i === target ? [...f, moving[0]] : f
      ),
    });
    setHeld(null);
    setMoves((m) => m + 1);
  };

  const pickOrDrop = (spot: Spot, canPick: boolean) => {
    if (held) return drop(spot);
    if (canPick) setHeld(spot);
  };

  const isHeld = (spot: Spot) =>
    held?.pile === spot.pile &&
    held?.index === spot.index &&
    (spot.pile !== "tableau" || held?.card === spot.card);

  return (
    <div className="flex h-full flex-col" style={{ background: "#0b6b33" }}>
      <div className="flex items-center gap-3 border-b border-black/25 bg-black/20 px-3 py-1.5">
        <button type="button" onClick={newGame} className="w7-btn px-3 py-1 text-[11px] text-[#1b2a38]">
          New game
        </button>
        <span className="text-[11px] text-white/75">Moves: {moves}</span>
        {held && (
          <span className="text-[11px] text-yellow-200">
            Card in hand — click where it goes, or press Esc
          </span>
        )}
        {won && <span className="text-[11px] font-semibold text-yellow-200">You win.</span>}
      </div>

      <div className="flex-1 overflow-auto p-3">
        {/* Stock, waste, then the four foundations. */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={drawStock}
            aria-label="Draw"
            className="grid h-[74px] w-[54px] place-items-center rounded-[4px]"
            style={{
              background: board.stock.length ? "#1c4f8f" : "rgba(0,0,0,0.18)",
              boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.35)",
            }}
          >
            {board.stock.length ? (
              <span className="text-[18px] text-white/80">🂠</span>
            ) : (
              <span className="text-[16px] text-white/60">↻</span>
            )}
          </button>

          <CardSlot
            onClick={() =>
              pickOrDrop({ pile: "waste", index: 0 }, board.waste.length > 0)
            }
            onDoubleClick={() => sendHome({ pile: "waste", index: 0 })}
          >
            {board.waste.length > 0 && (
              <PlayingCard
                card={board.waste[board.waste.length - 1]}
                held={isHeld({ pile: "waste", index: 0 })}
              />
            )}
          </CardSlot>

          <span className="w-6" />

          {board.foundations.map((pile, i) => (
            <CardSlot
              key={i}
              label={SUITS[i]}
              onClick={() => pickOrDrop({ pile: "foundation", index: i }, pile.length > 0)}
            >
              {pile.length > 0 && (
                <PlayingCard
                  card={pile[pile.length - 1]}
                  held={isHeld({ pile: "foundation", index: i })}
                />
              )}
            </CardSlot>
          ))}
        </div>

        {/* The seven columns. */}
        <div className="mt-4 flex gap-2">
          {board.tableau.map((pile, col) => (
            <div key={col} className="w-[54px]">
              {pile.length === 0 ? (
                <CardSlot onClick={() => pickOrDrop({ pile: "tableau", index: col }, false)} />
              ) : (
                <div className="relative" style={{ height: 74 + (pile.length - 1) * 20 }}>
                  {pile.map((card, row) => (
                    <button
                      key={card.id}
                      type="button"
                      onClick={() =>
                        pickOrDrop(
                          { pile: "tableau", index: col, card: row },
                          card.faceUp
                        )
                      }
                      onDoubleClick={() =>
                        row === pile.length - 1 &&
                        sendHome({ pile: "tableau", index: col, card: row })
                      }
                      className="absolute left-0 w-[54px]"
                      style={{ top: row * 20, zIndex: row }}
                    >
                      <PlayingCard
                        card={card}
                        held={
                          held?.pile === "tableau" &&
                          held.index === col &&
                          (held.card ?? 0) <= row
                        }
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CardSlot({
  children,
  label,
  onClick,
  onDoubleClick,
}: {
  children?: React.ReactNode;
  label?: string;
  onClick?: () => void;
  onDoubleClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      className="grid h-[74px] w-[54px] place-items-center rounded-[4px]"
      style={{
        background: "rgba(0,0,0,0.16)",
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.3)",
      }}
    >
      {children ?? <span className="text-[19px] text-white/45">{label}</span>}
    </button>
  );
}

function PlayingCard({ card, held }: { card: Card; held?: boolean }) {
  if (!card.faceUp) {
    return (
      <span
        className="block h-[74px] w-[54px] rounded-[4px]"
        style={{
          background:
            "repeating-linear-gradient(45deg, #1c4f8f 0 5px, #2a67b0 5px 10px)",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.45)",
        }}
      />
    );
  }

  return (
    <span
      className="flex h-[74px] w-[54px] flex-col justify-between rounded-[4px] bg-white p-1 text-left leading-none"
      style={{
        color: isRed(card.suit) ? "#c62828" : "#16202b",
        boxShadow: held
          ? "0 0 0 2px #ffd54f, 0 3px 10px rgba(0,0,0,0.4)"
          : "0 0 0 1px rgba(0,0,0,0.35), 0 1px 3px rgba(0,0,0,0.3)",
      }}
    >
      <span className="text-[12px] font-semibold">
        {RANK_LABEL[card.rank]}
        {card.suit}
      </span>
      <span className="self-center text-[19px]">{card.suit}</span>
      <span className="rotate-180 text-[12px] font-semibold">
        {RANK_LABEL[card.rank]}
        {card.suit}
      </span>
    </span>
  );
}
