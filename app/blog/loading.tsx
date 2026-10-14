import { Skeleton, SkeletonText } from "@/components/ui/skeleton";

/** The blog page's shape, held while it loads. */
export default function Loading() {
  return (
    <main className="home-col">
      <div className="home-strip">
        <Skeleton className="h-8 w-[320px] rounded-full" />
        <Skeleton className="h-6 w-[96px] rounded-full" />
      </div>

      <div className="page-head">
        <Skeleton className="h-3.5 w-[74px]" />
        <Skeleton className="mt-2 h-[34px] w-[210px]" />
        <SkeletonText lines={2} className="mt-3 max-w-[54ch]" />
      </div>

      <div className="space-y-3">
        {[0, 1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-[92px] w-full rounded-xl" />
        ))}
      </div>
    </main>
  );
}
