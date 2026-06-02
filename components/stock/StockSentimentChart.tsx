"use client";

import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";
import { format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import { TrendChartSkeleton } from "@/components/common/LoadingSkeleton";
import { ErrorState } from "@/components/common/ErrorState";
import { useStockSentimentTrend } from "@/lib/queries";

interface TooltipPayloadItem {
  name: string;
  value: number;
  color: string;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-xs shadow-xl">
      <p className="mb-1.5 font-semibold text-foreground">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="flex items-center gap-2">
          <span className="size-2 rounded-full" style={{ background: entry.color }} />
          <span className="text-muted-foreground">{entry.name}</span>
          <span className="font-mono font-semibold tabular-nums" style={{ color: entry.color }}>
            {entry.name === "평균감정"
              ? Number(entry.value) >= 0
                ? `+${Number(entry.value).toFixed(2)}`
                : Number(entry.value).toFixed(2)
              : entry.value}
          </span>
        </p>
      ))}
    </div>
  );
}

interface StockSentimentChartProps {
  ticker: string;
}

export function StockSentimentChart({ ticker }: StockSentimentChartProps) {
  const { data, isPending, isError, refetch } = useStockSentimentTrend(ticker);

  if (isPending) return <TrendChartSkeleton />;
  if (isError)
    return (
      <ErrorState
        message="감정 추이를 불러오지 못했습니다."
        onRetry={() => refetch()}
      />
    );
  if (data.trend.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        감정 데이터가 없습니다.
      </p>
    );
  }

  const chartData = data.trend.map((s) => ({
    date: format(parseISO(s.date), "M/d", { locale: ko }),
    뉴스수: s.newsCount,
    평균감정:
      s.avgSentiment != null ? Number(s.avgSentiment.toFixed(2)) : null,
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <ComposedChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(255,255,255,0.05)"
          vertical={false}
        />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          yAxisId="count"
          orientation="left"
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          yAxisId="sentiment"
          orientation="right"
          domain={[-1, 1]}
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ fill: "rgba(255,255,255,0.03)" }}
        />
        <ReferenceLine
          yAxisId="sentiment"
          y={0}
          stroke="rgba(255,255,255,0.08)"
          strokeDasharray="4 4"
        />
        <Bar
          yAxisId="count"
          dataKey="뉴스수"
          fill="#6366f1"
          opacity={0.6}
          radius={[2, 2, 0, 0]}
          maxBarSize={20}
        />
        <Area
          yAxisId="sentiment"
          dataKey="평균감정"
          stroke="#34d399"
          fill="#34d39918"
          strokeWidth={2}
          dot={{ r: 2.5, fill: "#34d399", strokeWidth: 0 }}
          activeDot={{ r: 4, fill: "#34d399" }}
          connectNulls
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
