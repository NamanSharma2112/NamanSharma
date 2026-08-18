/**
 * Program icons, drawn rather than imported so they scale cleanly from the
 * 16px in a title bar to the 40px on the desktop without a sprite sheet.
 */

type IconProps = { size?: number; className?: string };

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 48 48",
  xmlns: "http://www.w3.org/2000/svg",
});

export function MinesweeperIcon({ size = 32, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <rect x="3" y="3" width="42" height="42" rx="4" fill="#c9d4de" />
      <rect x="6" y="6" width="36" height="36" rx="2" fill="#9fb2c4" />
      <g fill="#c6c6c6" stroke="#7d8fa1" strokeWidth="1">
        <rect x="7" y="7" width="16" height="16" />
        <rect x="25" y="7" width="16" height="16" />
        <rect x="7" y="25" width="16" height="16" />
      </g>
      <circle cx="33" cy="33" r="8" fill="#1b1b1b" />
      <g stroke="#1b1b1b" strokeWidth="2.6" strokeLinecap="round">
        <path d="M33 21v24M21 33h24M25 25l16 16M41 25 25 41" />
      </g>
      <circle cx="30.5" cy="30.5" r="2" fill="#fff" />
    </svg>
  );
}

export function SolitaireIcon({ size = 32, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <rect x="4" y="6" width="26" height="36" rx="3" fill="#2f6db5" transform="rotate(-11 17 24)" />
      <rect x="12" y="7" width="26" height="36" rx="3" fill="#fff" stroke="#8fa6bd" />
      <path
        d="M25 16c-2.6-3-6.6-1.4-6.6 1.8 0 3.4 4.4 6.4 6.6 8.4 2.2-2 6.6-5 6.6-8.4 0-3.2-4-4.8-6.6-1.8z"
        fill="#d0342c"
      />
      <rect x="18" y="31" width="14" height="2" rx="1" fill="#c3d0dd" />
      <rect x="18" y="35" width="10" height="2" rx="1" fill="#c3d0dd" />
    </svg>
  );
}

export function SnakeIcon({ size = 32, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <rect x="3" y="3" width="42" height="42" rx="5" fill="#12321c" />
      <rect x="6" y="6" width="36" height="36" rx="3" fill="#1d5230" />
      <g fill="#7ed957">
        <rect x="10" y="26" width="8" height="8" rx="2" />
        <rect x="18" y="26" width="8" height="8" rx="2" />
        <rect x="26" y="26" width="8" height="8" rx="2" />
        <rect x="26" y="18" width="8" height="8" rx="2" />
        <rect x="26" y="10" width="8" height="8" rx="2" />
      </g>
      <circle cx="16" cy="14" r="4" fill="#e64a34" />
    </svg>
  );
}

export function NotepadIcon({ size = 32, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M10 4h20l9 9v31a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" fill="#fff" stroke="#8fa6bd" />
      <path d="M30 4v9h9" fill="#dce8f4" stroke="#8fa6bd" />
      <g stroke="#7aa4cf" strokeWidth="2" strokeLinecap="round">
        <path d="M14 21h20M14 27h20M14 33h13" />
      </g>
    </svg>
  );
}

export function CalculatorIcon({ size = 32, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <rect x="8" y="3" width="32" height="42" rx="4" fill="#e6edf4" stroke="#8fa6bd" />
      <rect x="12" y="8" width="24" height="9" rx="2" fill="#9fd6a0" stroke="#6f9a70" />
      <g fill="#5b6b7c">
        {[0, 1, 2].map((r) =>
          [0, 1, 2].map((c) => (
            <rect key={`${r}-${c}`} x={12 + c * 9} y={21 + r * 7} width="6" height="5" rx="1.4" />
          ))
        )}
      </g>
    </svg>
  );
}

export function PaintIcon({ size = 32, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path
        d="M24 5C13 5 5 12.6 5 22.5S13 40 24 40h4a4 4 0 0 0 0-8h-1a3 3 0 0 1 0-6h5c6 0 11-4.4 11-10C43 9.8 34.6 5 24 5z"
        fill="#f0f4f8"
        stroke="#8fa6bd"
      />
      <circle cx="15" cy="18" r="3.4" fill="#e64a34" />
      <circle cx="24" cy="13" r="3.4" fill="#f2b01e" />
      <circle cx="33" cy="17" r="3.4" fill="#2f8fd0" />
      <circle cx="15" cy="29" r="3.4" fill="#7ab648" />
    </svg>
  );
}

export function ComputerIcon({ size = 32, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <rect x="5" y="8" width="38" height="26" rx="3" fill="#5b6b7c" />
      <rect x="8" y="11" width="32" height="20" rx="1.5" fill="#3aa0e0" />
      <path d="M8 11h32v10H8z" fill="#63bff0" opacity=".7" />
      <path d="M18 34h12l2 6H16z" fill="#7d8fa1" />
      <rect x="12" y="40" width="24" height="3" rx="1.5" fill="#5b6b7c" />
    </svg>
  );
}

export function FolderIcon({ size = 32, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M4 12a3 3 0 0 1 3-3h11l4 5h15a3 3 0 0 1 3 3v20a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3z" fill="#f0b849" />
      <path d="M4 19h40v18a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3z" fill="#ffd479" />
    </svg>
  );
}
