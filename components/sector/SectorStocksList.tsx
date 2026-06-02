import Link from "next/link";
import { formatMarketCap, formatPct, cn } from "@/lib/utils";
import type { SectorStockItem } from "@/lib/types";

interface SectorStocksListProps {
  stocks: SectorStockItem[];
  type: "large_cap" | "growth";
}

function PctCell({ value }: { value: number | null | undefined }) {
  if (value == null) return <span className="text-zinc-600">—</span>;
  return (
    <span className={cn("tabular-nums font-mono", value >= 0 ? "text-emerald-400" : "text-red-400")}>
      {formatPct(value)}
    </span>
  );
}

export function SectorStocksList({ stocks, type }: SectorStocksListProps) {
  if (stocks.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        데이터가 없습니다. 배치가 아직 실행되지 않았거나 해당 섹터 종목이 없습니다.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-white/5">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/5 bg-white/[0.02] text-sm text-muted-foreground">
            <th className="w-10 py-3.5 pl-4 text-center font-medium">#</th>
            <th className="py-3.5 pl-3 text-left font-medium">티커</th>
            <th className="py-3.5 pl-2 text-left font-medium">종목명</th>
            <th className="py-3.5 pr-4 text-right font-medium">시가총액</th>
            <th className="py-3.5 pr-4 text-right font-medium">매출성장</th>
            <th className="py-3.5 pr-4 text-right font-medium">영업이익률</th>
            <th className="py-3.5 pr-4 text-right font-medium">ROE</th>
            {type === "growth" && (
              <th className="py-3.5 pr-4 text-right font-medium">성장점수</th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.04]">
          {stocks.map((stock) => (
            <tr
              key={stock.ticker}
              className="transition-colors hover:bg-white/[0.03]"
            >
              <td className="py-3.5 pl-4 text-center text-sm text-zinc-600 tabular-nums">
                {stock.rank}
              </td>
              <td className="py-3.5 pl-3">
                <Link
                  href={`/stocks/${stock.ticker}`}
                  className="font-mono font-bold text-primary hover:text-primary/80 hover:underline"
                >
                  {stock.ticker}
                </Link>
              </td>
              <td className="max-w-[200px] truncate py-3.5 pl-2 text-base text-foreground/80">
                {stock.companyName}
              </td>
              <td className="py-3.5 pr-4 text-right font-mono text-base tabular-nums">
                {formatMarketCap(stock.marketCap)}
              </td>
              <td className="py-3.5 pr-4 text-right text-base">
                <PctCell value={stock.metrics?.revenueGrowthYoy} />
              </td>
              <td className="py-3.5 pr-4 text-right text-base">
                <PctCell value={stock.metrics?.operatingMargin} />
              </td>
              <td className="py-3.5 pr-4 text-right text-base">
                <PctCell value={stock.metrics?.roe} />
              </td>
              {type === "growth" && (
                <td className="py-3.5 pr-4 text-right">
                  {stock.growthScore != null ? (
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-sm font-bold text-primary ring-1 ring-primary/20 tabular-nums">
                      {stock.growthScore.toFixed(1)}
                    </span>
                  ) : (
                    <span className="text-zinc-600">—</span>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
