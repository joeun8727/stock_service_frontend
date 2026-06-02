"use client";

import { cn } from "@/lib/utils";
import { ScoreBreakdownSkeleton } from "@/components/common/LoadingSkeleton";
import { ErrorState } from "@/components/common/ErrorState";
import { useStockScoreBreakdown } from "@/lib/queries";
import type { ScoreEntry } from "@/lib/types";
import { format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";

const SCREEN_TYPE_LABEL: Record<string, string> = {
  LARGE_CAP: "대형주",
  GROWTH: "성장주",
};

const SCREEN_TYPE_COLOR: Record<string, string> = {
  LARGE_CAP: "text-sky-400",
  GROWTH: "text-emerald-400",
};

function PercentileBar({ label, value }: { label: string; value: number }) {
  const pct = Math.min(Math.max(value, 0), 100);
  const barColor =
    pct >= 70 ? "bg-emerald-500" : pct >= 40 ? "bg-amber-500" : "bg-red-500/70";

  return (
    <div className="flex items-center gap-3 py-2 border-b border-white/[0.04] last:border-0">
      <span className="w-36 shrink-0 text-sm text-foreground/80">{label}</span>
      <div className="flex-1">
        <div className="h-2 rounded-full bg-white/[0.07] overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all duration-300", barColor)}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      <span className="w-14 shrink-0 text-right text-sm font-mono font-semibold tabular-nums text-foreground/80">
        {pct.toFixed(0)}분위
      </span>
    </div>
  );
}

function ScoreCard({ entry }: { entry: ScoreEntry }) {
  const label = SCREEN_TYPE_LABEL[entry.screenType] ?? entry.screenType;
  const scoreColor = SCREEN_TYPE_COLOR[entry.screenType] ?? "text-foreground";
  const factors = Object.entries(entry.factorPercentiles);

  return (
    <div className="rounded-xl border border-white/5 bg-zinc-900/60 p-5">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <p className="text-sm text-muted-foreground mb-0.5">{label} 스코어</p>
          <span className={cn("text-4xl font-bold font-mono tabular-nums", scoreColor)}>
            {entry.totalScore != null ? entry.totalScore.toFixed(1) : "—"}
          </span>
          <span className="text-sm text-muted-foreground ml-1">/ 100</span>
        </div>
        <div className="text-right text-xs text-muted-foreground space-y-1">
          {entry.rankInSector != null && (
            <p>섹터 내 순위 <span className="font-mono font-semibold text-foreground">{entry.rankInSector}위</span></p>
          )}
          {entry.sectorGroup && (
            <p className="text-zinc-600">{entry.sectorGroup}</p>
          )}
          {entry.scoredAt && (
            <p className="text-zinc-600">
              {format(parseISO(entry.scoredAt), "MM/dd HH:mm", { locale: ko })} 산출
            </p>
          )}
        </div>
      </div>

      {factors.length > 0 ? (
        <div>
          <p className="text-xs text-zinc-600 mb-2">팩터별 백분위</p>
          {factors.map(([name, pct]) => (
            <PercentileBar key={name} label={name} value={pct} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-zinc-600">팩터 상세 데이터가 없습니다.</p>
      )}
    </div>
  );
}

interface StockScoreBreakdownProps {
  ticker: string;
}

export function StockScoreBreakdown({ ticker }: StockScoreBreakdownProps) {
  const { data, isPending, isError, refetch } = useStockScoreBreakdown(ticker);

  if (isPending) return <ScoreBreakdownSkeleton />;
  if (isError)
    return (
      <ErrorState
        message="스코어 데이터를 불러오지 못했습니다."
        onRetry={() => refetch()}
      />
    );

  if (data.scores.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        스코어 데이터가 아직 없습니다. 배치 실행 후 표시됩니다.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {data.scores.map((entry) => (
        <ScoreCard key={entry.screenType} entry={entry} />
      ))}
    </div>
  );
}
