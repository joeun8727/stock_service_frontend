import { TrendChartSkeleton, SectorStocksSkeleton } from "@/components/common/LoadingSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function SectorDetailLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-40" />
      <TrendChartSkeleton />
      <SectorStocksSkeleton />
    </div>
  );
}
