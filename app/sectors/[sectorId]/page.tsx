import { apiGetWithDisclaimer } from "@/lib/api";
import type { SectorTrendData } from "@/lib/types";
import { SectorStocksTabs } from "@/components/sector/SectorStocksTabs";
import { SectorTrendChart } from "@/components/sector/SectorTrendChart";
import { Disclaimer } from "@/components/common/Disclaimer";
import { TrendChartSkeleton } from "@/components/common/LoadingSkeleton";
import Link from "next/link";
import { ChevronLeft, Activity } from "lucide-react";
import { Suspense } from "react";

interface Props {
  params: Promise<{ sectorId: string }>;
}

export default async function SectorDetailPage({ params }: Props) {
  const { sectorId } = await params;

  let trendData: SectorTrendData | null = null;
  let disclaimer = "";
  let trendError = false;

  try {
    const result = await apiGetWithDisclaimer<SectorTrendData>(
      `/sectors/${sectorId}/trend`
    );
    trendData = result.data;
    disclaimer = result.disclaimer;
  } catch {
    trendError = true;
  }

  const sectorName = trendData?.sectorName ?? `섹터 #${sectorId}`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 space-y-8">
      {/* 브레드크럼 */}
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className="size-3" />
        섹터 랭킹으로
      </Link>

      {/* 헤더 */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{sectorName}</h1>
          {trendData?.sectorCode && (
            <p className="mt-1 text-xs font-mono text-zinc-500 tracking-widest uppercase">
              {trendData.sectorCode}
            </p>
          )}
        </div>
      </div>

      {/* 트렌드 차트 */}
      <div className="rounded-2xl border border-white/5 bg-zinc-900 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="size-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold">뉴스 트렌드 (최근 14일)</h2>
          <div className="ml-auto flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="inline-block size-2 rounded-sm bg-[#6366f1]" />
              뉴스 수
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block size-2 rounded-full bg-[#34d399]" />
              평균 감정
            </span>
          </div>
        </div>

        {trendError ? (
          <p className="py-8 text-center text-sm text-red-400">
            트렌드 데이터를 불러오지 못했습니다.
          </p>
        ) : trendData && trendData.dailyStats.length > 0 ? (
          <SectorTrendChart dailyStats={trendData.dailyStats} />
        ) : (
          <p className="py-8 text-center text-sm text-muted-foreground">
            트렌드 데이터가 없습니다.
          </p>
        )}
      </div>

      {/* 종목 탭 */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">섹터 종목</h2>
        <Suspense fallback={<TrendChartSkeleton />}>
          <SectorStocksTabs sectorId={sectorId} />
        </Suspense>
      </section>

      {disclaimer && <Disclaimer text={disclaimer} />}
    </div>
  );
}
