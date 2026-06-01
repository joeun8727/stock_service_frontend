import { formatPct, formatNumber, cn } from "@/lib/utils";
import type { LatestMetrics } from "@/lib/types";

interface StockMetricsTableProps {
  metrics: LatestMetrics;
}

interface MetricRow {
  label: string;
  sub?: string;
  value: string;
  positive?: boolean | null;
}

function metricRows(m: LatestMetrics): MetricRow[] {
  const pct = (v: number | null) => formatPct(v);
  const num = (v: number | null, d = 2) => formatNumber(v, d);
  const sign = (v: number | null) => (v == null ? null : v >= 0 ? true : false);

  return [
    { label: "ROE", sub: "자기자본이익률", value: pct(m.roe), positive: sign(m.roe) },
    { label: "ROA", sub: "총자산이익률", value: pct(m.roa), positive: sign(m.roa) },
    { label: "ROIC", sub: "투하자본이익률", value: pct(m.roic), positive: sign(m.roic) },
    { label: "영업이익률", value: pct(m.operatingMargin), positive: sign(m.operatingMargin) },
    { label: "매출성장 YoY", value: pct(m.revenueGrowthYoy), positive: sign(m.revenueGrowthYoy) },
    { label: "PER", sub: "주가수익비율", value: num(m.per, 1), positive: null },
    { label: "PBR", sub: "주가순자산비율", value: num(m.pbr, 2), positive: null },
    { label: "EPS", sub: "주당순이익", value: m.eps != null ? `$${num(m.eps, 2)}` : "—", positive: sign(m.eps) },
    {
      label: "부채비율",
      value: num(m.debtRatio, 2),
      positive: m.debtRatio == null ? null : m.debtRatio <= 2.0,
    },
  ];
}

export function StockMetricsTable({ metrics }: StockMetricsTableProps) {
  const rows = metricRows(metrics);

  return (
    <div className="grid grid-cols-1 gap-px bg-white/5 overflow-hidden rounded-xl sm:grid-cols-3">
      {rows.map((row) => (
        <div
          key={row.label}
          className="flex flex-col justify-between bg-zinc-900 px-4 py-3 gap-1"
        >
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {row.label}
            </p>
            {row.sub && (
              <p className="text-[10px] text-zinc-600 mt-0.5">{row.sub}</p>
            )}
          </div>
          <p
            className={cn(
              "text-xl font-bold font-mono tabular-nums mt-1",
              row.positive === true && "text-emerald-400",
              row.positive === false && "text-red-400",
              row.positive == null && "text-foreground"
            )}
          >
            {row.value}
          </p>
        </div>
      ))}
    </div>
  );
}
