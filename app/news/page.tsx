import { apiGetWithDisclaimer } from "@/lib/api";
import type { TopNewsData } from "@/lib/types";
import { TopNewsPaginated } from "@/components/news/TopNewsPaginated";
import { Disclaimer } from "@/components/common/Disclaimer";
import { Newspaper } from "lucide-react";

export default async function TopNewsPage() {
  let newsData: TopNewsData | null = null;
  let disclaimer = "";
  let fetchError = false;

  try {
    const result = await apiGetWithDisclaimer<TopNewsData>(
      "/news/top?minImportance=70&days=7",
      { cache: "no-store" }
    );
    newsData = {
      ...result.data,
      news: [...result.data.news].sort(
        (a, b) => (b.importance ?? 0) - (a.importance ?? 0)
      ),
    };
    disclaimer = result.disclaimer;
  } catch (e) {
    console.error("[TopNewsPage] fetch error:", e);
    fetchError = true;
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 space-y-10">
      {/* 헤더 */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Newspaper className="size-5 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">주요 뉴스</h1>
        </div>
        <p className="text-base text-muted-foreground max-w-xl">
          최근 7일 · 중요도 70 이상 뉴스. 중요도 높은 순, 10건씩 페이지 표시.
          LLM 요약·감정 분석 포함. 투자 추천이 아닌 정보 제공 목적입니다.
        </p>
      </div>

      {fetchError && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-5 py-5 text-center">
          <p className="text-sm text-red-400">
            뉴스 데이터를 불러오지 못했습니다. 백엔드 서버 상태를 확인하세요.
          </p>
        </div>
      )}

      {newsData && (
        <>
          {newsData.news.length > 0 && (
            <p className="text-sm text-muted-foreground">
              총{" "}
              <span className="text-foreground font-semibold">
                {newsData.count}
              </span>
              건
            </p>
          )}
          <TopNewsPaginated items={newsData.news} />
          {disclaimer && <Disclaimer text={disclaimer} />}
        </>
      )}
    </div>
  );
}
