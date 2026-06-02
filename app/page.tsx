import { apiGetWithDisclaimer } from "@/lib/api";
import type { SectorRankingData } from "@/lib/types";
import { SectorRankCard } from "@/components/sector/SectorRankCard";
import { Disclaimer } from "@/components/common/Disclaimer";
import { formatRankedAt } from "@/lib/utils";
import { TrendingUp } from "lucide-react";

export default async function HomePage() {
  let rankingData: SectorRankingData | null = null;
  let disclaimer = "";
  let fetchError = false;

  try {
    const result = await apiGetWithDisclaimer<SectorRankingData>(
      "/sectors/ranking?limit=10",
      { cache: "no-store" }
    );
    rankingData = result.data;
    disclaimer = result.disclaimer;
  } catch (e) {
    console.error("[HomePage] ranking fetch error:", e);
    fetchError = true;
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 space-y-10">
      {/* 페이지 헤더 */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="size-5 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">섹터 랭킹</h1>
        </div>
        <p className="text-base text-muted-foreground max-w-xl">
          뉴스 볼륨·감정·매출성장·거시지표 기반 점수순 상위 5개 섹터.{" "}
          <span className="text-zinc-600">투자 추천이 아닌 객관적 지표 기반 정렬입니다.</span>
        </p>
        {rankingData && (
          <p className="text-xs text-zinc-600">
            {formatRankedAt(rankingData.rankedAt)}
          </p>
        )}
      </div>

      {/* 에러 */}
      {fetchError && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-5 py-5 text-center">
          <p className="text-sm text-red-400">
            섹터 데이터를 불러오지 못했습니다. 백엔드 서버 상태를 확인하세요.
          </p>
        </div>
      )}

      {/* 섹터 카드 그리드 */}
      {rankingData && rankingData.sectors.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {rankingData.sectors.map((sector) => (
            <SectorRankCard key={sector.code} item={sector} sectorId={sector.id} />
          ))}
        </div>
      ) : (
        !fetchError && (
          <div className="rounded-xl border border-white/5 bg-zinc-900/50 py-16 text-center">
            <p className="text-sm text-muted-foreground">
              배치가 아직 실행되지 않아 섹터 데이터가 없습니다.
            </p>
          </div>
        )
      )}

      {disclaimer && <Disclaimer text={disclaimer} />}
    </div>
  );
}
