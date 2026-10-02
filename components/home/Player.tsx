"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The pill in the middle of the topbar: a track, and a button to play it.
 *
 * It plays a real file from /public rather than reporting what some service
 * says is playing — so what it shows is always true, and it keeps working with
 * no network, no key and no third party to go down.
 *
 * It renders nothing at all until the file is actually there. A player with a
 * dead source is worse than no player: it looks like a feature and behaves like
 * a bug, and the one thing a page this quiet cannot afford is a control that
 * does nothing when pressed.
 */

export type Track = {
  /** Path under /public — e.g. "/music/track.mp3". */
  src: string;
  title: string;
  artist: string;
  /** Square art under /public. Optional; a disc is drawn without it. */
  art?: string;
};

export default function Player({ track }: { track: Track | null }) {
  const audio = useRef<HTMLAudioElement>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  // Two gates, and both earn their place. No track configured means no
  // request at all — a HEAD on every visit for a file nobody has added yet is
  // a 404 in everyone's network tab forever. A configured track is still
  // checked, because a player whose file has gone missing looks like a feature
  // and behaves like a bug.
  const src = track?.src;
  useEffect(() => {
    if (!src) return;
    let live = true;
    fetch(src, { method: "HEAD" })
      .then((r) => live && setReady(r.ok))
      .catch(() => live && setReady(false));
    return () => {
      live = false;
    };
  }, [src]);

  if (!track || !ready) return null;

  const toggle = () => {
    const el = audio.current;
    if (!el) return;
    if (el.paused) {
      el.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      el.pause();
      setPlaying(false);
    }
  };

  return (
    <div className="pl">
      <audio
        ref={audio}
        src={track.src}
        preload="none"
        onTimeUpdate={(e) => {
          const el = e.currentTarget;
          setProgress(el.duration ? el.currentTime / el.duration : 0);
        }}
        onEnded={() => {
          setPlaying(false);
          setProgress(0);
        }}
      />

      <button
        type="button"
        className="pl-pill"
        onClick={toggle}
        aria-label={`${playing ? "Pause" : "Play"} ${track.title} by ${track.artist}`}
      >
        <span className={`pl-art ${playing ? "is-spinning" : ""}`}>
          {track.art ? (
            <img src={track.art} alt="" />
          ) : (
            <span className="pl-disc" aria-hidden />
          )}
        </span>

        {/* The title only appears on hover or while playing — at rest the pill
            is a shape, which is what keeps it from competing with the name
            below it. */}
        <span className="pl-title">
          {track.title} — {track.artist}
        </span>

        <span className="pl-btn" aria-hidden>
          {playing ? (
            <svg viewBox="0 0 12 12">
              <rect x="2.5" y="2" width="2.6" height="8" rx="0.8" />
              <rect x="6.9" y="2" width="2.6" height="8" rx="0.8" />
            </svg>
          ) : (
            <svg viewBox="0 0 12 12">
              <path d="M3.4 2.3 9.6 6 3.4 9.7z" />
            </svg>
          )}
        </span>

        {/* How far through, along the bottom edge of the pill. */}
        <span className="pl-bar" aria-hidden>
          <span className="pl-bar-fill" style={{ transform: `scaleX(${progress})` }} />
        </span>
      </button>
    </div>
  );
}
