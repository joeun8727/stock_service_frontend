import { StockDetailSkeleton, NewsListSkeleton } from "@/components/common/LoadingSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function StockDetailLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
      <Skeleton className="h-4 w-24" />
      <StockDetailSkeleton />
      <NewsListSkeleton />
    </div>
  );
}
