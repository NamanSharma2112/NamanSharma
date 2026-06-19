"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tweet } from "@/registry/spell-ui/tweet"

interface TweetGridProps {
  tweets: string[]
  className?: string
  maxDisplayed?: number
  onSelect?: (id: string) => void
}

export function TweetGrid({
  tweets,
  className,
  maxDisplayed = 2,
  onSelect
}: TweetGridProps) {
  const [showAll, setShowAll] = useState(false)

  return (
    <div className={cn("relative w-full pb-10", className)}>
      <div
        className={cn(
          "grid grid-cols-1 sm:grid-cols-2 gap-4 w-full",
          !showAll &&
            tweets.length > maxDisplayed &&
            "max-h-[380px] overflow-hidden"
        )}
      >
        {tweets
          .slice(0, showAll ? undefined : maxDisplayed)
          .map((id) => (
            <div
              key={id}
              className="relative transition-all duration-200 hover:shadow-sm rounded-xl h-fit w-full overflow-hidden"
            >
              <Tweet id={id} size="small" className="w-full m-0" />
            </div>
          ))}
      </div>

      {tweets.length > maxDisplayed && !showAll && (
        <>
          <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-white to-transparent pointer-events-none dark:hidden" />
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-20">
            <Button 
              variant="secondary" 
              onClick={() => setShowAll(true)}
              className="rounded-full shadow-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-black dark:text-white px-6"
            >
              Load More
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
