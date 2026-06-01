import { SectorRankingSkeleton } from "@/components/common/LoadingSkeleton";

export default function HomeLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
      <div className="space-y-1">
        <div className="h-8 w-48 rounded-md bg-muted animate-pulse" />
        <div className="h-4 w-64 rounded-md bg-muted animate-pulse" />
      </div>
      <SectorRankingSkeleton />
    </div>
  );
}
