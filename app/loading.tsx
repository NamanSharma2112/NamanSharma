import { Skeleton, SkeletonText } from "@/components/ui/skeleton";

/**
 * What stands in for the front page while it is on its way.
 *
 * It is shaped like the page it replaces — strip, portrait, name, three
 * paragraphs, the work stack — so when the real thing arrives nothing moves.
 * A skeleton that is the wrong shape is worse than none: the page lands and
 * then jumps.
 */
export default function Loading() {
  return (
    <main className="home">
      <div className="home-col">
        <div className="home-strip">
          <Skeleton className="h-8 w-[320px] rounded-full" />
          <Skeleton className="h-6 w-[96px] rounded-full" />
        </div>

        <Skeleton className="home-portrait rounded-full" />

        <Skeleton className="mt-[34px] h-[38px] w-[235px]" />

        <div className="home-prose space-y-3">
          <SkeletonText lines={2} />
          <SkeletonText lines={3} />
          <SkeletonText lines={2} />
        </div>

        <div className="home-section">
          <Skeleton className="h-3.5 w-[92px]" />
          <div className="mt-4 space-y-3">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[148px] w-full rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
