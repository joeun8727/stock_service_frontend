"use client";

import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";
import { format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import type { DailyStats } from "@/lib/types";

interface SectorTrendChartProps {
  dailyStats: DailyStats[];
  sectorName?: string;
}

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
      <p className="mb-2 font-semibold text-foreground">{label}</p>
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

export function SectorTrendChart({ dailyStats }: SectorTrendChartProps) {
  const data = dailyStats.map((s) => ({
    date: format(parseISO(s.date), "M/d", { locale: ko }),
    뉴스수: s.newsCount,
    평균감정: s.avgSentiment != null ? Number(Number(s.avgSentiment).toFixed(2)) : null,
  }));

  if (data.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        트렌드 데이터가 없습니다.
      </p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={180}>
      <ComposedChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
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
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
        <ReferenceLine yAxisId="sentiment" y={0} stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />
        <Bar
          yAxisId="count"
          dataKey="뉴스수"
          fill="#6366f1"
          opacity={0.7}
          radius={[3, 3, 0, 0]}
          maxBarSize={28}
        />
        <Line
          yAxisId="sentiment"
          dataKey="평균감정"
          stroke="#34d399"
          strokeWidth={2}
          dot={{ r: 3, fill: "#34d399", strokeWidth: 0 }}
          activeDot={{ r: 5, fill: "#34d399" }}
          connectNulls
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
