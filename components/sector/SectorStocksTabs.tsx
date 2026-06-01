"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SectorStocksList } from "@/components/sector/SectorStocksList";
import { SectorStocksSkeleton } from "@/components/common/LoadingSkeleton";
import { ErrorState } from "@/components/common/ErrorState";
import { Disclaimer } from "@/components/common/Disclaimer";
import { useSectorStocks } from "@/lib/queries";

interface SectorStocksTabsProps {
  sectorId: string;
}

function StocksPane({
  sectorId,
  type,
}: {
  sectorId: string;
  type: "large_cap" | "growth";
}) {
  const { data, isPending, isError, refetch } = useSectorStocks(sectorId, type);

  if (isPending) return <SectorStocksSkeleton />;
  if (isError)
    return (
      <ErrorState
        message="종목 데이터를 불러오지 못했습니다."
        onRetry={() => refetch()}
      />
    );

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        {type === "large_cap"
          ? "시가총액 순 상위 20개 종목"
          : "성장 지표 기반 점수 상위 20개 종목 (객관적 지표 기반 정렬)"}
      </p>
      <SectorStocksList stocks={data.stocks} type={type} />
      <Disclaimer className="mt-4" />
    </div>
  );
}

export function SectorStocksTabs({ sectorId }: SectorStocksTabsProps) {
  return (
    <Tabs defaultValue="large_cap">
      <TabsList>
        <TabsTrigger value="large_cap">대형주 Top 20</TabsTrigger>
        <TabsTrigger value="growth">성장주 Top 20</TabsTrigger>
      </TabsList>

      <TabsContent value="large_cap" className="mt-4">
        <StocksPane sectorId={sectorId} type="large_cap" />
      </TabsContent>

      <TabsContent value="growth" className="mt-4">
        <StocksPane sectorId={sectorId} type="growth" />
      </TabsContent>
    </Tabs>
  );
}
