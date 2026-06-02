"use client";

import Link from "next/link";
import { cn, formatMarketCap, formatNumber } from "@/lib/utils";
import { TableSkeleton } from "@/components/common/LoadingSkeleton";
import { ErrorState } from "@/components/common/ErrorState";
import { Disclaimer } from "@/components/common/Disclaimer";
import { useSectorValuation } from "@/lib/queries";
import type { ValuationItem } from "@/lib/types";

type ValKey = "per" | "pbr" | "psr" | "peg";

const VAL_COLS: { key: ValKey; label: string }[] = [
  { key: "per", label: "PER" },
  { key: "pbr", label: "PBR" },
  { key: "psr", label: "PSR" },
  { key: "peg", label: "PEG" },
];

function calcMedian(stocks: ValuationItem[], key: ValKey): number | null {
  const vals = stocks.map((s) => s[key]).filter((v): v is number => v != null);
  if (vals.length === 0) return null;
  const sorted = [...vals].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

function ValCell({
  value,
  median,
}: {
  value: number | null;
  median: number | null;
}) {
  if (value == null) return <span className="text-zinc-600">—</span>;
  const color =
    median == null
      ? "text-foreground/80"
      : value < median * 0.85
      ? "text-emerald-400"
      : value > median * 1.15
      ? "text-red-400"
      : "text-foreground/80";
  return (
    <span className={cn("font-mono tabular-nums", color)}>
      {formatNumber(value, 1)}
    </span>
  );
}

interface SectorValuationTableProps {
  sectorId: string;
}

export function SectorValuationTable({ sectorId }: SectorValuationTableProps) {
  const { data, isPending, isError, refetch } = useSectorValuation(sectorId);

  if (isPending) return <TableSkeleton />;
  if (isError)
    return (
      <ErrorState
        message="밸류에이션 데이터를 불러오지 못했습니다."
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

  const medians = Object.fromEntries(
    VAL_COLS.map((c) => [c.key, calcMedian(data.stocks, c.key)])
  ) as Record<ValKey, number | null>;

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        <span className="text-emerald-400 font-semibold">녹색</span> = 섹터
        중앙값 대비 저평가,{" "}
        <span className="text-red-400 font-semibold">적색</span> = 고평가
        (±15% 기준). 낮을수록 상대적으로 저렴.
      </p>

      <div className="overflow-x-auto rounded-xl border border-white/5">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02] text-sm text-muted-foreground">
              <th className="py-3.5 pl-4 text-left font-medium">티커</th>
              <th className="py-3.5 pl-2 text-left font-medium">종목명</th>
              <th className="py-3.5 pr-4 text-right font-medium">시가총액</th>
              {VAL_COLS.map((c) => (
                <th key={c.key} className="py-3.5 pr-4 text-right font-medium">
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {/* 섹터 중앙값 행 */}
            <tr className="bg-white/[0.025] border-b border-white/[0.08]">
              <td
                className="py-3.5 pl-4 text-sm font-semibold text-zinc-400"
                colSpan={2}
              >
                섹터 중앙값
              </td>
              <td className="py-3.5 pr-4 text-right text-sm text-zinc-600">
                —
              </td>
              {VAL_COLS.map((c) => (
                <td key={c.key} className="py-3.5 pr-4 text-right">
                  <span className="font-mono tabular-nums text-zinc-300 font-semibold">
                    {medians[c.key] != null
                      ? formatNumber(medians[c.key]!, 1)
                      : "—"}
                  </span>
                </td>
              ))}
            </tr>
            {data.stocks.map((stock) => (
              <tr
                key={stock.ticker}
                className="transition-colors hover:bg-white/[0.03]"
              >
                <td className="py-3.5 pl-4">
                  <Link
                    href={`/stocks/${stock.ticker}`}
                    className="font-mono font-bold text-primary hover:text-primary/80 hover:underline"
                  >
                    {stock.ticker}
                  </Link>
                </td>
                <td className="max-w-[180px] truncate py-3.5 pl-2 text-base text-foreground/80">
                  {stock.companyName}
                </td>
                <td className="py-3.5 pr-4 text-right font-mono text-base tabular-nums">
                  {formatMarketCap(stock.marketCap)}
                </td>
                {VAL_COLS.map((c) => (
                  <td key={c.key} className="py-3.5 pr-4 text-right text-base">
                    <ValCell value={stock[c.key]} median={medians[c.key]} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Disclaimer className="mt-2" />
    </div>
  );
}
