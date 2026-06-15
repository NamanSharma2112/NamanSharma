"use client";

import { useState, useEffect, useRef } from "react";
import {
  enrichTweet,
  useTweet,
  type EnrichedTweet,
} from "react-tweet";
import { cn } from "@/lib/utils";
import { Check, Link2 } from "lucide-react";
import { SiX } from "@icons-pack/react-simple-icons";

const VerifiedBadge = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 22 22"
    className={className}
    fill="currentColor"
    aria-label="Verified account"
    role="img"
  >
    <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
  </svg>
);

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  }
  return num.toString();
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  const month = monthNames[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  return `${hour12}:${minutes.toString().padStart(2, "0")} ${ampm} · ${month} ${day}, ${year}`;
};

const TweetSkeleton = ({ className, size = "large" }: { className?: string; size?: "small" | "large" }) => (
  <div
    className={cn(
      "tweet-card block w-full rounded-xl border border-zinc-200 bg-[#fafafa]",
      size === "small" ? "p-3" : "p-4",
      className
    )}
  >
    <div className="flex items-center gap-2">
      <div className={cn("shrink-0 animate-pulse rounded-full bg-zinc-200", size === "small" ? "size-[30px]" : "size-[38px]")} />
      <div className="flex flex-col gap-1">
        <div className="h-4 w-24 animate-pulse rounded bg-zinc-200" />
        <div className="h-3 w-16 animate-pulse rounded bg-zinc-200" />
      </div>
    </div>
    <div className="mt-4 space-y-2">
      <div className="h-4 w-full animate-pulse rounded bg-zinc-200" />
      <div className="h-4 w-3/4 animate-pulse rounded bg-zinc-200" />
    </div>
  </div>
);

const TweetNotFound = ({ className, size = "large" }: { className?: string; size?: "small" | "large" }) => (
  <div
    className={cn(
      "tweet-card flex w-full flex-col items-center justify-center gap-2 rounded-xl text-zinc-400 border border-zinc-200 bg-[#fafafa]",
      size === "small" ? "p-4" : "p-6",
      className
    )}
  >
    <p className="text-sm">Tweet not found</p>
  </div>
);

const TweetHeader = ({ tweet, size = "large" }: { tweet: EnrichedTweet; size?: "small" | "large" }) => (
  <div className="flex items-start justify-between">
    <div className="flex items-center gap-2">
      <img
        src={tweet.user.profile_image_url_https}
        alt={tweet.user.name}
        loading="lazy"
        width={size === "small" ? 30 : 38}
        height={size === "small" ? 30 : 38}
        className="rounded-full"
      />
      <div className="flex flex-col">
        <span className={cn("flex items-center gap-1 font-semibold text-black", size === "small" ? "text-sm" : "text-[15px]")}>
          {tweet.user.name}
          {(tweet.user.verified || tweet.user.is_blue_verified) && (
            <VerifiedBadge className={size === "small" ? "size-3.5 text-[#1C9BF1]" : "size-4 text-[#1C9BF1]"} />
          )}
        </span>
        <span className={cn("text-zinc-500", size === "small" ? "text-xs -mt-1" : "text-[13px] -mt-0.5")}>
          @{tweet.user.screen_name}
        </span>
      </div>
    </div>
    {size === "large" && (
      <a href={tweet.url} target="_blank" rel="noopener noreferrer">
        <SiX className="size-4 text-black" />
      </a>
    )}
  </div>
);

const TweetBody = ({ tweet, size = "large" }: { tweet: EnrichedTweet; size?: "small" | "large" }) => (
  <p className={cn("mt-3 text-zinc-800 font-normal leading-relaxed", size === "small" ? "text-xs mt-2" : "text-sm")}>
    {tweet.entities.map((entity, idx) => {
      switch (entity.type) {
        case "url":
        case "symbol":
        case "hashtag":
        case "mention":
          return (
            <a
              key={idx}
              href={entity.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1C9BF1] hover:underline"
            >
              {entity.text}
            </a>
          );
        case "text":
          return (
            <span
              key={idx}
              dangerouslySetInnerHTML={{ __html: entity.text }}
            />
          );
        default:
          return null;
      }
    })}
  </p>
);

const VideoPlayer = ({ src, poster, aspectRatio }: { src: string; poster?: string; aspectRatio?: [number, number] }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Force play on mount/load
    const playVideo = async () => {
      if (videoRef.current) {
        try {
          await videoRef.current.play();
        } catch (err) {
          console.warn("Autoplay failed, trying again on click/interaction:", err);
        }
      }
    };
    playVideo();
  }, [src]);

  const ratioString = aspectRatio ? `${aspectRatio[0]} / ${aspectRatio[1]}` : "16 / 9";

  return (
    <div className="relative w-full rounded-lg overflow-hidden bg-black/5" style={{ aspectRatio: ratioString }}>
      <video
        key={src}
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay
        loop
        muted
        playsInline
        controls
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  );
};

const TweetMedia = ({ tweet, size = "large" }: { tweet: EnrichedTweet; size?: "small" | "large" }) => {
  if (!tweet.video && !tweet.photos) return null;

  const getVideoSource = () => {
    if (!tweet.video?.variants) return null;

    const getResolution = (url: string): number => {
      const match = url.match(/\/(\d+)x(\d+)\//);
      if (match) {
        return parseInt(match[1]) * parseInt(match[2]);
      }
      return 0;
    };

    const mp4Variants = tweet.video.variants
      .filter((v) => v.type === "video/mp4")
      .sort((a, b) => getResolution(b.src) - getResolution(a.src));

    if (mp4Variants.length > 0) {
      return { src: mp4Variants[0].src, type: "video/mp4" };
    }

    const firstVariant = tweet.video.variants[0];
    return { src: firstVariant.src, type: firstVariant.type };
  };

  const videoSource = getVideoSource();

  return (
    <div className={cn("mt-4", size === "small" ? "mt-2.5" : "mt-4")}>
      {tweet.video && videoSource && (
        <VideoPlayer 
          src={videoSource.src} 
          poster={tweet.video.poster} 
          aspectRatio={tweet.video.aspectRatio} 
        />
      )}
      {tweet.photos && (
        <div
          className={cn(
            "grid gap-1",
            tweet.photos.length === 1 && "grid-cols-1",
            tweet.photos.length === 2 && "grid-cols-2",
            tweet.photos.length >= 3 && "grid-cols-2"
          )}
        >
          {tweet.photos.map((photo, idx) => (
            <img
              key={photo.url}
              src={photo.url}
              alt={`Photo ${idx + 1}`}
              loading="lazy"
              className={cn(
                "w-full rounded-lg object-cover",
                tweet.photos &&
                  tweet.photos.length === 3 &&
                  idx === 0 &&
                  "row-span-2"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface TweetFooterProps {
  tweet: EnrichedTweet;
  showDate?: boolean;
  showLikeButton?: boolean;
  showCopyLink?: boolean;
  size?: "small" | "large";
}

const TweetFooter = ({
  tweet,
  showDate = true,
  showLikeButton = true,
  showCopyLink = true,
  size = "large",
}: TweetFooterProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(tweet.url).catch(() => {});
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1500);
  };

  const showActions = showLikeButton || showCopyLink;

  if (!showDate && !showActions) return null;

  return (
    <>
      {showDate && (
        <div className="mt-4">
          <time
            className="text-xs text-zinc-400"
            dateTime={tweet.created_at}
          >
            {formatDate(tweet.created_at)}
          </time>
        </div>
      )}
      {showActions && (
        <div className="mt-3 flex gap-4 border-t border-zinc-100 pt-3 text-[13px] text-zinc-500">
          {showLikeButton && (
            <a
              href={`https://x.com/intent/like?tweet_id=${tweet.id_str}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-pink-600 transition-colors"
            >
              <svg
                className="w-4 h-4 text-zinc-400 hover:text-pink-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>
              <span>{formatNumber(tweet.favorite_count)}</span>
            </a>
          )}
          {showCopyLink && (
            <button
              onClick={handleCopyLink}
              className="flex cursor-pointer items-center gap-1.5 hover:text-zinc-800 transition-colors"
            >
              {isCopied ? (
                <Check className="size-3.5 text-emerald-500" />
              ) : (
                <Link2 className="size-3.5" />
              )}
              <span>Copy link</span>
            </button>
          )}
        </div>
      )}
    </>
  );
};

interface TweetContentProps {
  tweet: EnrichedTweet;
  className?: string;
  showDate?: boolean;
  showLikeButton?: boolean;
  showCopyLink?: boolean;
  size?: "small" | "large";
}

const TweetContent = ({
  tweet,
  className,
  showDate,
  showLikeButton,
  showCopyLink,
  size = "large",
}: TweetContentProps) => {
  return (
    <div
      className={cn(
        "tweet-card w-full rounded-xl border border-zinc-200 bg-[#fafafa]",
        size === "small" ? "p-3" : "p-4",
        className
      )}
    >
      <TweetHeader tweet={tweet} size={size} />
      <TweetBody tweet={tweet} size={size} />
      <TweetMedia tweet={tweet} size={size} />
      <TweetFooter
        tweet={tweet}
        showDate={showDate}
        showLikeButton={showLikeButton}
        showCopyLink={showCopyLink}
        size={size}
      />
    </div>
  );
};

interface TweetProps {
  id: string;
  className?: string;
  showDate?: boolean;
  showLikeButton?: boolean;
  showCopyLink?: boolean;
  size?: "small" | "large";
}

export function Tweet({
  id,
  className,
  showDate = true,
  showLikeButton = true,
  showCopyLink = true,
  size = "large",
}: TweetProps) {
  const { data: tweet, isLoading, error } = useTweet(id);

  if (isLoading) {
    return <TweetSkeleton className={className} size={size} />;
  }

  if (error || !tweet) {
    return <TweetNotFound className={className} size={size} />;
  }

  const enrichedTweet = enrichTweet(tweet);

  return (
    <TweetContent
      tweet={enrichedTweet}
      className={className}
      showDate={size === "large" ? showDate : false}
      showLikeButton={size === "large" ? showLikeButton : false}
      showCopyLink={size === "large" ? showCopyLink : false}
      size={size}
    />
  );
}
