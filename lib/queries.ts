import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import type {
  SectorRankingData,
  SectorTrendData,
  SectorStocksData,
  StockProfile,
  FinancialMetricData,
  NewsPageData,
  StockSummaryData,
} from "@/lib/types";

// ─────────────────────────────────────────
// 쿼리 키 팩토리
// ─────────────────────────────────────────

export const qk = {
  sectorRanking: () => ["sectors", "ranking"] as const,
  sectorTrend: (sectorId: string) => ["sectors", sectorId, "trend"] as const,
  sectorStocks: (sectorId: string, type: string) =>
    ["sectors", sectorId, "stocks", type] as const,
  stock: (ticker: string) => ["stocks", ticker] as const,
  stockFinancials: (ticker: string, period: string) =>
    ["stocks", ticker, "financials", period] as const,
  stockNews: (ticker: string, page: number) =>
    ["stocks", ticker, "news", page] as const,
  stockSummary: (ticker: string) => ["stocks", ticker, "summary"] as const,
};

// ─────────────────────────────────────────
// 섹터
// ─────────────────────────────────────────

export function useSectorRanking(limit = 5) {
  return useQuery({
    queryKey: qk.sectorRanking(),
    queryFn: () =>
      apiGet<SectorRankingData>(`/sectors/ranking?limit=${limit}`),
    staleTime: 10 * 60 * 1000, // 10분
  });
}

export function useSectorTrend(sectorId: string) {
  return useQuery({
    queryKey: qk.sectorTrend(sectorId),
    queryFn: () => apiGet<SectorTrendData>(`/sectors/${sectorId}/trend`),
    staleTime: 10 * 60 * 1000,
  });
}

export function useSectorStocks(sectorId: string, type: "large_cap" | "growth") {
  return useQuery({
    queryKey: qk.sectorStocks(sectorId, type),
    queryFn: () =>
      apiGet<SectorStocksData>(
        `/sectors/${sectorId}/stocks?type=${type}&limit=20`
      ),
    staleTime: 5 * 60 * 1000, // 5분
  });
}

// ─────────────────────────────────────────
// 종목
// ─────────────────────────────────────────

export function useStockProfile(ticker: string) {
  return useQuery({
    queryKey: qk.stock(ticker),
    queryFn: () => apiGet<StockProfile>(`/stocks/${ticker}`),
    staleTime: 5 * 60 * 1000,
  });
}

export function useStockFinancials(
  ticker: string,
  period: "annual" | "quarterly" = "quarterly"
) {
  return useQuery({
    queryKey: qk.stockFinancials(ticker, period),
    queryFn: () =>
      apiGet<FinancialMetricData>(
        `/stocks/${ticker}/financials?period=${period}&limit=8`
      ),
    staleTime: 60 * 60 * 1000, // 1시간
  });
}

export function useStockNews(ticker: string, page = 0) {
  return useQuery({
    queryKey: qk.stockNews(ticker, page),
    queryFn: () =>
      apiGet<NewsPageData>(
        `/stocks/${ticker}/news?page=${page}&size=20`
      ),
    staleTime: 2 * 60 * 1000, // 2분
  });
}

export function useStockSummary(ticker: string) {
  return useQuery({
    queryKey: qk.stockSummary(ticker),
    queryFn: () => apiGet<StockSummaryData>(`/stocks/${ticker}/summary`),
    staleTime: 6 * 60 * 60 * 1000, // 6시간
  });
}
