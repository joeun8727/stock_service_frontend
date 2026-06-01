"use client";

import { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Button } from "@/components/ui/button";
import type { PeriodMetric } from "@/lib/types";

interface FinancialsChartProps {
  metrics: PeriodMetric[];
  period?: "annual" | "quarterly";
}

type MetricKey = "roe" | "roa" | "roic" | "operatingMargin" | "revenueGrowthYoy";

const METRIC_OPTIONS: { key: MetricKey; label: string }[] = [
  { key: "roe", label: "ROE" },
  { key: "roa", label: "ROA" },
  { key: "roic", label: "ROIC" },
  { key: "operatingMargin", label: "영업이익률" },
  { key: "revenueGrowthYoy", label: "매출성장" },
];

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
];

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
    <div className="rounded-lg border border-border bg-card px-3 py-2 text-xs shadow-md">
      <p className="mb-1 font-medium text-foreground">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color }} className="flex gap-2">
          <span className="text-muted-foreground">{entry.name}</span>
          <span className="font-mono font-medium">
            {Number(entry.value).toFixed(1)}%
          </span>
        </p>
      ))}
    </div>
  );
}

export function FinancialsChart({ metrics }: FinancialsChartProps) {
  const [selected, setSelected] = useState<MetricKey[]>(["roe", "operatingMargin"]);

  const data = [...metrics]
    .sort((a, b) => a.fiscalDate.localeCompare(b.fiscalDate))
    .map((m) => ({
      date: m.fiscalDate.slice(0, 7), // "2025-12"
      roe: m.roe,
      roa: m.roa,
      roic: m.roic,
      operatingMargin: m.operatingMargin,
      revenueGrowthYoy: m.revenueGrowthYoy,
    }));

  const toggle = (key: MetricKey) => {
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  if (data.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        재무 데이터가 없습니다.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {/* 지표 선택 토글 */}
      <div className="flex flex-wrap gap-2">
        {METRIC_OPTIONS.map((opt) => (
          <Button
            key={opt.key}
            variant={selected.includes(opt.key) ? "default" : "outline"}
            size="sm"
            className="h-7 text-xs"
            onClick={() => toggle(opt.key)}
          >
            {opt.label}
          </Button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v) => `${Number(v).toFixed(0)}%`}
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 11, color: "var(--muted-foreground)" }} />
          {selected.map((key, i) => (
            <Line
              key={key}
              dataKey={key}
              name={METRIC_OPTIONS.find((o) => o.key === key)?.label ?? key}
              stroke={COLORS[i % COLORS.length]}
              strokeWidth={2}
              dot={false}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
