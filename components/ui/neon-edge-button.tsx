import React from 'react';
import { Zap } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface NeonEdgeButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  speed?: number;
  glow?: boolean;
  /** The glyph before the label. Defaults to the bolt it shipped with. */
  icon?: React.ReactNode;
  /** Render as a link to this address instead of a button. */
  href?: string;
}

export const NeonEdgeButton: React.FC<NeonEdgeButtonProps> = ({
  children = 'Deploy preview',
  speed = 1,
  glow = true,
  icon,
  href,
  className,
  ...props
}) => {
  const duration = `${3 / speed}s`;
  // A link when it goes somewhere — a mailto or a page is a link, and a
  // button that navigates breaks middle-click, copy-address and the rest.
  const Tag = (href ? 'a' : 'button') as 'button';
  const linkProps = href ? ({ href } as Record<string, string>) : { type: 'button' as const };

  return (
    <Tag
      {...linkProps}
      className={cn(
        'focus-ring group relative inline-flex min-h-11 items-center justify-center overflow-hidden rounded-[10px] p-[1px] text-sm font-medium text-[#FAFAFA] transition-all cursor-pointer active:scale-[0.98]',
        glow && 'shadow-[0_0_24px_-10px_rgba(255,255,255,0.4)]',
        className
      )}
      {...props}
    >
      <style>{`
        @keyframes easyui-neon-rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .easyui-neon-beam { animation: none !important; opacity: 0.4 !important; }
        }
      `}</style>
      
      {/* Dynamic Animated Border Beam */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-[200%] overflow-hidden"
      >
        <span
          className="easyui-neon-beam absolute inset-0 block"
          style={{
            background: 'conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 280deg, rgba(255,255,255,0.85) 340deg, transparent 360deg)',
            animation: `easyui-neon-rotate ${duration} linear infinite`,
          }}
        />
      </span>

      {/* Button Interior Surface */}
      <span className="relative z-10 inline-flex min-h-[42px] w-full items-center justify-center gap-2 rounded-[9px] bg-[#050505] px-5 py-2.5 transition-colors group-hover:bg-[#0B0B0B]">
        <span className="inline-flex text-[#E5E5E5] transition-transform duration-300 group-hover:scale-110 [&>svg]:h-4 [&>svg]:w-4">
          {icon ?? <Zap />}
        </span>
        <span className="select-none">{children}</span>
      </span>
    </Tag>
  );
};

