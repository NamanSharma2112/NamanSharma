import { cn } from "@/lib/utils";

/**
 * An isometric processor, drawn as three faces so it reads as a solid rather
 * than an outline.
 *
 * Everything is `currentColor` at different strengths — the top catching the
 * light, the two sides falling away — so it takes the colour of whatever text
 * it sits in and works on either theme without a second version.
 */
export default function CpuIcon({
  size = 15,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={cn("shrink-0", className)}
    >
      {/* Pins, before the body so the body sits over their inner ends. */}
      <g stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.45">
        <path d="M8.6 5.1 8.6 3.3M12 7.1 12 5.3M15.4 5.1 15.4 3.3" />
        <path d="M3.4 9.6 1.7 10.6M3.4 12.4 1.7 13.4" />
        <path d="M20.6 9.6 22.3 10.6M20.6 12.4 22.3 13.4" />
        <path d="M8.6 19.4 8.6 21.2M15.4 19.4 15.4 21.2" />
      </g>

      {/* Top face — the lit one. */}
      <path d="M12 4.2 20.4 9 12 13.8 3.6 9Z" fill="currentColor" opacity="0.92" />
      {/* Left face, turned away from the light. */}
      <path d="M3.6 9 12 13.8 12 19.4 3.6 14.6Z" fill="currentColor" opacity="0.5" />
      {/* Right face, further still. */}
      <path d="M20.4 9 20.4 14.6 12 19.4 12 13.8Z" fill="currentColor" opacity="0.3" />

      {/* The die inset into the top, picked out against it. */}
      <path
        d="M12 7.1 16.7 9 12 10.9 7.3 9Z"
        fill="currentColor"
        opacity="0.25"
        className="transition-opacity duration-300 group-hover:opacity-60"
      />
    </svg>
  );
}
