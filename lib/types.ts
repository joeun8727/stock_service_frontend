// ============================================================
// API 계약 타입 — 백엔드 실제 DTO 기준 (2026-05-31 확인)
// 변경 시 백엔드 DTO와 루트 CLAUDE.md를 함께 수정할 것
// ============================================================

// ─────────────────────────────────────────
// 1. 공통 응답 래퍼
// ─────────────────────────────────────────

export interface ErrorInfo {
  code: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  disclaimer: string;
  error: ErrorInfo | null;
  timestamp: string; // ISO 8601
}

// ─────────────────────────────────────────
// 2. 섹터
// ─────────────────────────────────────────

export interface SectorRankHighlights {
  newsVolumeChange: string;         // 예: "+34%"
  avgSentiment: number | null;      // -1.0 ~ 1.0, 뉴스 없으면 null
  avgRevenueGrowth: number | null;  // 소수 (예: 0.28 = 28%), 데이터 없으면 null
}

export interface SectorRankItem {
  id: number;    // 백엔드 Sector DB PK — /sectors/{id}/trend, /sectors/{id}/stocks 에 사용
  rank: number;
  code: string;
  name: string;
  score: number | null;  // 배치 미실행 시 null 가능
  highlights: SectorRankHighlights;
}

/** GET /api/v1/sectors/ranking 응답 data */
export interface SectorRankingData {
  rankedAt: string; // ISO 8601 (Instant)
  sectors: SectorRankItem[];
}

/** GET /api/v1/sectors/{sectorId}/trend — DailyStats 1건 */
export interface DailyStats {
  date: string;           // LocalDate → "2026-05-29"
  newsCount: number;
  avgSentiment: number | null;
}

/** GET /api/v1/sectors/{sectorId}/trend 응답 data */
export interface SectorTrendData {
  sectorId: number;
  sectorCode: string;
  sectorName: string;
  dailyStats: DailyStats[];
}

// ─────────────────────────────────────────
// 3. 섹터별 종목 스크리닝
// ─────────────────────────────────────────

/**
 * MetricsSnapshot — SectorStocksResponse.StockScreenResult 내 metrics 필드
 * V4 필드(psr, peg, grossMargin, fcfMargin) 포함.
 * @JsonInclude(NON_NULL) — 값 없으면 JSON 키 자체 없음 → optional
 */
export interface MetricsSnapshot {
  roe: number | null;
  roa: number | null;
  roic: number | null;
  per: number | null;
  pbr: number | null;
  revenueGrowthYoy: number | null;
  operatingMargin: number | null;
  psr: number | null;
  peg: number | null;
  grossMargin: number | null;
  fcfMargin: number | null;
}

export interface SectorStockItem {
  rank: number;
  ticker: string;
  companyName: string;
  marketCap: number;
  metrics: MetricsSnapshot | null;
  growthScore: number | null; // type=growth 일 때만
}

/** GET /api/v1/sectors/{sectorId}/stocks 응답 data */
export interface SectorStocksData {
  sectorId: number;
  sectorCode: string;
  sectorName: string;
  type: "large_cap" | "growth";
  stocks: SectorStockItem[];
}

// ─────────────────────────────────────────
// 4. 종목 프로필
// ─────────────────────────────────────────

/**
 * 종목 최신 재무지표 스냅샷 — StockProfileResponse.LatestMetrics
 * eps, debtRatio 포함 (MetricsSnapshot에는 없음)
 * @JsonInclude(NON_NULL) — 배치 미실행 시 null
 */
export interface LatestMetrics {
  roe: number | null;
  roa: number | null;
  roic: number | null;
  per: number | null;
  pbr: number | null;
  eps: number | null;
  debtRatio: number | null;
  revenueGrowthYoy: number | null;
  operatingMargin: number | null;
}

/** GET /api/v1/stocks/{ticker} 응답 data */
export interface StockProfile {
  ticker: string;
  companyName: string;
  sector: string;      // 백엔드: String (섹터명), 객체 아님
  industry: string;
  marketCap: number;   // USD
  exchange: string;
  website: string | null;
  employeeCount: number | null;
  ipoDate: string | null;   // "2025-01-15" (LocalDate)
  latestMetrics: LatestMetrics | null; // 배치 미실행 시 null
}

// ─────────────────────────────────────────
// 5. 재무지표 시계열
// ─────────────────────────────────────────

/** FinancialMetricResponse.PeriodMetric — 1개 회계 기간 데이터 */
export interface PeriodMetric {
  fiscalDate: string; // LocalDate → "2025-12-31"
  roe: number | null;
  roa: number | null;
  roic: number | null;
  per: number | null;
  pbr: number | null;
  eps: number | null;
  debtRatio: number | null;
  interestCoverage: number | null;
  revenueGrowthYoy: number | null;
  operatingMargin: number | null;
  ocfToNi: number | null;
}

/** GET /api/v1/stocks/{ticker}/financials 응답 data */
export interface FinancialMetricData {
  ticker: string;
  period: "annual" | "quarterly";
  metrics: PeriodMetric[];
}

// ─────────────────────────────────────────
// 6. 뉴스
// ─────────────────────────────────────────

/**
 * NewsPageResponse.NewsItemResponse
 * LLM 미처리 시 summary/sentiment/importance/relevance → null
 */
export interface NewsItem {
  headline: string;
  source: string;
  sourceUrl: string;
  publishedAt: string;        // LocalDateTime → ISO string
  summary: string | null;
  sentiment: number | null;   // -1.0 ~ 1.0
  importance: number | null;  // 0 ~ 100
  relevance: "HIGH" | "MEDIUM" | "LOW" | null;
}

/** GET /api/v1/stocks/{ticker}/news 응답 data */
export interface NewsPageData {
  ticker: string;
  news: NewsItem[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
}

// ─────────────────────────────────────────
// 7. LLM 종합 요약
// ─────────────────────────────────────────

/** GET /api/v1/stocks/{ticker}/summary 응답 data */
export interface StockSummaryData {
  ticker: string;
  companyName: string;
  summaryComment: string;   // 백엔드 필드명: summaryComment (summary 아님)
  avgSentiment: number;
  analyzedNewsCount: number; // 백엔드 필드명: analyzedNewsCount (analyzedAt 아님)
}

// ─────────────────────────────────────────
// 8. 종목 스코어 브레이크다운
// ─────────────────────────────────────────

/** 스코어 1건 (screenType = "LARGE_CAP" | "GROWTH" 등) */
export interface ScoreEntry {
  screenType: string;
  sectorGroup: string;
  totalScore: number | null;
  rankInSector: number | null;
  factorPercentiles: Record<string, number>;
  scoredAt: string;
}

/** GET /api/v1/stocks/{ticker}/score-breakdown 응답 data */
export interface StockScoreBreakdown {
  ticker: string;
  companyName: string;
  sectorCode: string | null;
  sectorName: string | null;
  scores: ScoreEntry[];
}

// ─────────────────────────────────────────
// 9. 종목 감정 추이 (최근 30일)
// ─────────────────────────────────────────

export interface DailySentimentStat {
  date: string;
  newsCount: number;
  avgSentiment: number | null;
}

/** GET /api/v1/stocks/{ticker}/sentiment-trend 응답 data */
export interface StockSentimentTrend {
  ticker: string;
  companyName: string;
  days: number;
  trend: DailySentimentStat[];
}

// ─────────────────────────────────────────
// 10. 전체 주요 뉴스
// ─────────────────────────────────────────

export interface TopNewsItem {
  ticker: string;
  companyName: string;
  headline: string;
  source: string;
  sourceUrl: string;
  publishedAt: string;
  summary: string | null;
  sentiment: number | null;
  importance: number | null;
  relevance: "HIGH" | "MEDIUM" | "LOW" | null;
}

/** GET /api/v1/news/top 응답 data */
export interface TopNewsData {
  news: TopNewsItem[];
  count: number;
}

// ─────────────────────────────────────────
// 11. 섹터 Rule of 40
// ─────────────────────────────────────────

export interface RuleOf40Item {
  rank: number;
  ticker: string;
  companyName: string;
  marketCap: number;
  revenueGrowthPct: number | null;
  fcfMarginPct: number | null;
  operatingMarginPct: number | null;
  ruleOf40Score: number | null;
}

/** GET /api/v1/sectors/{sectorId}/rule-of-40 응답 data */
export interface SectorRuleOf40Data {
  sectorId: number;
  sectorCode: string;
  sectorName: string;
  sectorGroup: string;
  stocks: RuleOf40Item[];
}

// ─────────────────────────────────────────
// 12. 섹터 밸류에이션 비교
// ─────────────────────────────────────────

export interface ValuationItem {
  ticker: string;
  companyName: string;
  marketCap: number;
  per: number | null;
  pbr: number | null;
  psr: number | null;
  peg: number | null;
}

/** GET /api/v1/sectors/{sectorId}/valuation 응답 data */
export interface SectorValuationData {
  sectorId: number;
  sectorCode: string;
  sectorName: string;
  stocks: ValuationItem[];
}
