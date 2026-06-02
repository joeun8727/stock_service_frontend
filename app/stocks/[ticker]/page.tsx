import { apiGetWithDisclaimer } from "@/lib/api";
import type { StockProfile, StockSummaryData } from "@/lib/types";
import { StockProfileCard } from "@/components/stock/StockProfileCard";
import { StockMetricsTable } from "@/components/stock/StockMetricsTable";
import { StockFinancialsTabs } from "@/components/stock/StockFinancialsTabs";
import { StockSentimentChart } from "@/components/stock/StockSentimentChart";
import { StockScoreBreakdown } from "@/components/stock/StockScoreBreakdown";
import { NewsList } from "@/components/news/NewsList";
import { Disclaimer } from "@/components/common/Disclaimer";
import { SentimentBadge } from "@/components/news/SentimentBadge";
import Link from "next/link";
import { ChevronLeft, Sparkles, LineChart, Newspaper, Activity, Award } from "lucide-react";
import { Suspense } from "react";
import { StockDetailSkeleton, NewsListSkeleton, TrendChartSkeleton, ScoreBreakdownSkeleton } from "@/components/common/LoadingSkeleton";

interface Props {
  params: Promise<{ ticker: string }>;
}

function SectionCard({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/5 bg-zinc-900">
      <div className="flex items-center gap-2 border-b border-white/5 px-6 py-4">
        <Icon className="size-4 text-muted-foreground" />
        <h2 className="text-base font-semibold">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

export default async function StockDetailPage({ params }: Props) {
  const { ticker } = await params;
  const upperTicker = ticker.toUpperCase();

  let profile: StockProfile | null = null;
  let summaryData: StockSummaryData | null = null;
  let disclaimer = "";
  let profileError = false;

  const [profileResult, summaryResult] = await Promise.allSettled([
    apiGetWithDisclaimer<StockProfile>(`/stocks/${upperTicker}`),
    apiGetWithDisclaimer<StockSummaryData>(`/stocks/${upperTicker}/summary`),
  ]);

  if (profileResult.status === "fulfilled") {
    profile = profileResult.value.data;
    disclaimer = profileResult.value.disclaimer;
  } else {
    profileError = true;
  }
  if (summaryResult.status === "fulfilled") {
    summaryData = summaryResult.value.data;
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 space-y-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className="size-3" />
        섹터 랭킹으로
      </Link>

      {profileError && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-5 py-6 text-center">
          <p className="text-sm text-red-400">
            &quot;{upperTicker}&quot; 종목 정보를 불러오지 못했습니다.
          </p>
        </div>
      )}

      {profile && (
        <>
          {/* 종목 기본 프로필 */}
          <StockProfileCard profile={profile} />

          {/* LLM 요약 */}
          {summaryData && summaryData.analyzedNewsCount > 0 && (
            <SectionCard icon={Sparkles} title="LLM 종합 요약">
              <p className="text-sm leading-relaxed text-foreground/85 mb-3">
                {summaryData.summaryComment}
              </p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>분석 기사 {summaryData.analyzedNewsCount}건</span>
                <SentimentBadge sentiment={summaryData.avgSentiment} />
              </div>
            </SectionCard>
          )}

          {/* 감정 추이 (30일) */}
          <SectionCard icon={Activity} title="감정 추이 (최근 30일)">
            <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="inline-block size-2 rounded-sm bg-[#6366f1]" />
                뉴스 수
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block size-2 rounded-full bg-[#34d399]" />
                평균 감정
              </span>
            </div>
            <Suspense fallback={<TrendChartSkeleton />}>
              <StockSentimentChart ticker={upperTicker} />
            </Suspense>
          </SectionCard>

          {/* 스코어 브레이크다운 */}
          <SectionCard icon={Award} title="스코어 브레이크다운">
            <Suspense fallback={<ScoreBreakdownSkeleton />}>
              <StockScoreBreakdown ticker={upperTicker} />
            </Suspense>
          </SectionCard>

          {/* 최신 재무지표 */}
          {profile.latestMetrics ? (
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-1">
                최신 재무지표
              </h2>
              <StockMetricsTable metrics={profile.latestMetrics} />
            </div>
          ) : (
            <div className="rounded-xl border border-white/5 bg-zinc-900 py-8 text-center">
              <p className="text-sm text-muted-foreground">
                재무지표 수집 전입니다. 배치 실행 후 표시됩니다.
              </p>
            </div>
          )}

          {/* 재무지표 추이 */}
          <SectionCard icon={LineChart} title="재무지표 추이">
            <Suspense fallback={<StockDetailSkeleton />}>
              <StockFinancialsTabs ticker={upperTicker} />
            </Suspense>
          </SectionCard>

          {/* 관련 뉴스 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <Newspaper className="size-4 text-muted-foreground" />
              <h2 className="text-base font-semibold">관련 뉴스</h2>
            </div>
            <Suspense fallback={<NewsListSkeleton />}>
              <NewsList ticker={upperTicker} />
            </Suspense>
          </div>
        </>
      )}

      {disclaimer && <Disclaimer text={disclaimer} />}
    </div>
  );
}
