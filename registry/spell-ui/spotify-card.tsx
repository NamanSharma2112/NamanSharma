"use client";

import React from "react";

// Fallback utility if cn is not perfectly matched to user's lib
function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

interface SpotifyCardProps extends React.IframeHTMLAttributes<HTMLIFrameElement> {
  url: string;
}

export function SpotifyCard({ url, className, ...props }: SpotifyCardProps) {
  // Extract track ID from URL like "https://open.spotify.com/track/0DTSnA1bcVI5niJzoyBPyZ"
  // and convert it to embed format
  const embedUrl = url.includes("open.spotify.com") 
    ? url.replace("open.spotify.com", "open.spotify.com/embed")
    : url;

  return (
    <iframe
      src={embedUrl}
      width="100%"
      height="152"
      frameBorder="0"
      allowFullScreen
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
      className={cn("rounded-2xl border-none shadow-sm", className)}
      {...props}
    />
  );
}
