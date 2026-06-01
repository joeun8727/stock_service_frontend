"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FinancialsChart } from "@/components/stock/FinancialsChart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useStockFinancials } from "@/lib/queries";
import { formatPct, formatNumber } from "@/lib/utils";
import { ErrorState } from "@/components/common/ErrorState";
import { SectorStocksSkeleton } from "@/components/common/LoadingSkeleton";

interface StockFinancialsTabsProps {
  ticker: string;
}

export function StockFinancialsTabs({ ticker }: StockFinancialsTabsProps) {
  const [period, setPeriod] = useState<"annual" | "quarterly">("quarterly");
  const { data, isPending, isError, refetch } = useStockFinancials(ticker, period);

  if (isPending) return <SectorStocksSkeleton />;
  if (isError)
    return (
      <ErrorState
        message="재무 데이터를 불러오지 못했습니다."
        onRetry={() => refetch()}
      />
    );

  const sorted = [...data.metrics].sort((a, b) =>
    b.fiscalDate.localeCompare(a.fiscalDate)
  );

  return (
    <Tabs
      value={period}
      onValueChange={(v) => setPeriod(v as "annual" | "quarterly")}
    >
      <TabsList>
        <TabsTrigger value="quarterly">분기</TabsTrigger>
        <TabsTrigger value="annual">연간</TabsTrigger>
      </TabsList>

      <TabsContent value={period} className="mt-4 space-y-4">
        <FinancialsChart metrics={data.metrics} period={period} />

        {/* 상세 테이블 */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>회계기준일</TableHead>
                <TableHead className="text-right">ROE</TableHead>
                <TableHead className="text-right">ROA</TableHead>
                <TableHead className="text-right">영업이익률</TableHead>
                <TableHead className="text-right">매출성장</TableHead>
                <TableHead className="text-right">PER</TableHead>
                <TableHead className="text-right">PBR</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((m) => (
                <TableRow key={m.fiscalDate}>
                  <TableCell className="font-mono text-sm">{m.fiscalDate}</TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    {formatPct(m.roe)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    {formatPct(m.roa)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    {formatPct(m.operatingMargin)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    {formatPct(m.revenueGrowthYoy)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    {formatNumber(m.per, 1)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    {formatNumber(m.pbr, 2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <p className="text-xs text-muted-foreground">
          단위: 비율(%) 항목은 백분율 변환, 배수 항목은 원값 표시.
        </p>
      </TabsContent>
    </Tabs>
  );
}
