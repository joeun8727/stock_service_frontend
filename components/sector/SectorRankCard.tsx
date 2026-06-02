import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn, formatPct, parseVolumeChangeSign, getSentimentLevel } from "@/lib/utils";
import type { SectorRankItem } from "@/lib/types";

interface SectorRankCardProps {
  item: SectorRankItem;
  sectorId: number;
}

const RANK_RING: Record<number, string> = {
  1: "ring-amber-400/60 text-amber-300",
  2: "ring-zinc-300/50 text-zinc-300",
  3: "ring-orange-500/50 text-orange-400",
};
const RANK_BG: Record<number, string> = {
  1: "bg-amber-400/10",
  2: "bg-zinc-300/10",
  3: "bg-orange-500/10",
};

export function SectorRankCard({ item, sectorId }: SectorRankCardProps) {
  const { rank, name, score, highlights } = item;
  const volumeSign = parseVolumeChangeSign(highlights.newsVolumeChange);
  const sentimentLevel = getSentimentLevel(highlights.avgSentiment);
  const scoreWidth = score != null ? Math.min(score, 100) : 0;

  return (
    <Link href={`/sectors/${sectorId}`} className="group block focus:outline-none">
      <div
        className={cn(
          "relative h-full rounded-2xl border border-white/5 bg-zinc-900 p-6 transition-all duration-200",
          "hover:border-white/15 hover:bg-zinc-800/80 hover:shadow-lg hover:shadow-black/30",
          "group-focus-visible:ring-2 group-focus-visible:ring-primary/60"
        )}
      >
        {/* 상단: 순위 + 점수 */}
        <div className="flex items-start justify-between gap-2 mb-4">
          <span
            className={cn(
              "inline-flex size-10 shrink-0 items-center justify-center rounded-full ring-1 text-base font-bold",
              RANK_RING[rank] ?? "ring-white/10 text-muted-foreground",
              RANK_BG[rank] ?? "bg-white/5"
            )}
          >
            {rank}
          </span>
          {/* 점수 바 */}
          <div className="flex-1 pt-2 px-2">
            <div className="h-1 rounded-full bg-white/5 overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  rank === 1 && "bg-amber-400",
                  rank === 2 && "bg-zinc-400",
                  rank === 3 && "bg-orange-500",
                  rank > 3 && "bg-primary/60"
                )}
                style={{ width: `${scoreWidth}%` }}
              />
            </div>
          </div>
          <span className="text-xs font-mono font-semibold text-muted-foreground tabular-nums">
            {score != null ? score.toFixed(1) : "—"}
          </span>
        </div>

        {/* 섹터명 */}
        <h3 className="text-xl font-bold tracking-tight mb-4">{name}</h3>

        {/* 지표 3줄 */}
        <div className="space-y-2.5 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">뉴스 볼륨</span>
            <span
              className={cn(
                "font-semibold tabular-nums",
                volumeSign === "positive" && "text-emerald-400",
                volumeSign === "negative" && "text-red-400",
                volumeSign === "neutral" && "text-muted-foreground"
              )}
            >
              {highlights.newsVolumeChange}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">뉴스 감정</span>
            <span
              className={cn(
                "font-semibold tabular-nums",
                sentimentLevel === "positive" && "text-emerald-400",
                sentimentLevel === "negative" && "text-red-400",
                sentimentLevel === "neutral" && "text-zinc-500"
              )}
            >
              {highlights.avgSentiment != null
                ? `${highlights.avgSentiment >= 0 ? "+" : ""}${highlights.avgSentiment.toFixed(2)}`
                : "—"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">평균 매출 성장</span>
            <span
              className={cn(
                "font-semibold tabular-nums",
                highlights.avgRevenueGrowth == null && "text-zinc-500",
                highlights.avgRevenueGrowth != null &&
                  highlights.avgRevenueGrowth >= 0 &&
                  "text-emerald-400",
                highlights.avgRevenueGrowth != null &&
                  highlights.avgRevenueGrowth < 0 &&
                  "text-red-400"
              )}
            >
              {formatPct(highlights.avgRevenueGrowth)}
            </span>
          </div>
        </div>

        {/* 하단 링크 힌트 */}
        <div className="mt-5 flex items-center justify-end gap-1 text-sm text-muted-foreground/50 transition-colors group-hover:text-primary/70">
          <span>상세 보기</span>
          <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>
    </Link>
  );
}
