"use client";

import Link from "next/link";
import { cn, formatMarketCap } from "@/lib/utils";
import { TableSkeleton } from "@/components/common/LoadingSkeleton";
import { ErrorState } from "@/components/common/ErrorState";
import { Disclaimer } from "@/components/common/Disclaimer";
import { useSectorRuleOf40 } from "@/lib/queries";

interface SectorRuleOf40Props {
  sectorId: string;
}

function R40Score({ score }: { score: number | null }) {
  if (score == null) return <span className="text-zinc-600">—</span>;
  const color =
    score >= 40
      ? "text-emerald-400"
      : score >= 20
      ? "text-amber-400"
      : "text-zinc-500";
  return (
    <span className={cn("font-bold font-mono tabular-nums", color)}>
      {score.toFixed(1)}
    </span>
  );
}

function PctCell({ value }: { value: number | null }) {
  if (value == null) return <span className="text-zinc-600">—</span>;
  return (
    <span
      className={cn(
        "tabular-nums font-mono",
        value >= 0 ? "text-emerald-400" : "text-red-400"
      )}
    >
      {value.toFixed(1)}%
    </span>
  );
}

export function SectorRuleOf40({ sectorId }: SectorRuleOf40Props) {
  const { data, isPending, isError, refetch } = useSectorRuleOf40(sectorId);

  if (isPending) return <TableSkeleton />;
  if (isError)
    return (
      <ErrorState
        message="Rule of 40 데이터를 불러오지 못했습니다."
        onRetry={() => refetch()}
      />
    );
  if (data.stocks.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        데이터가 없습니다.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Rule of 40 = 매출성장% + FCF마진%. 합산{" "}
        <span className="text-emerald-400 font-semibold">40 이상</span>이면
        고성장·고효율.
      </p>

      <div className="overflow-x-auto rounded-xl border border-white/5">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02] text-sm text-muted-foreground">
              <th className="w-10 py-3.5 pl-4 text-center font-medium">#</th>
              <th className="py-3.5 pl-3 text-left font-medium">티커</th>
              <th className="py-3.5 pl-2 text-left font-medium">종목명</th>
              <th className="py-3.5 pr-4 text-right font-medium">시가총액</th>
              <th className="py-3.5 pr-4 text-right font-medium">매출성장%</th>
              <th className="py-3.5 pr-4 text-right font-medium">FCF마진%</th>
              <th className="py-3.5 pr-4 text-right font-medium">R40 스코어</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {data.stocks.map((item) => (
              <tr
                key={item.ticker}
                className="transition-colors hover:bg-white/[0.03]"
              >
                <td className="py-3.5 pl-4 text-center text-sm text-zinc-600 tabular-nums">
                  {item.rank}
                </td>
                <td className="py-3.5 pl-3">
                  <Link
                    href={`/stocks/${item.ticker}`}
                    className="font-mono font-bold text-primary hover:text-primary/80 hover:underline"
                  >
                    {item.ticker}
                  </Link>
                </td>
                <td className="max-w-[200px] truncate py-3.5 pl-2 text-base text-foreground/80">
                  {item.companyName}
                </td>
                <td className="py-3.5 pr-4 text-right font-mono text-base tabular-nums">
                  {formatMarketCap(item.marketCap)}
                </td>
                <td className="py-3.5 pr-4 text-right text-base">
                  <PctCell value={item.revenueGrowthPct} />
                </td>
                <td className="py-3.5 pr-4 text-right text-base">
                  <PctCell value={item.fcfMarginPct} />
                </td>
                <td className="py-3.5 pr-4 text-right">
                  <R40Score score={item.ruleOf40Score} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Disclaimer className="mt-2" />
    </div>
  );
}
