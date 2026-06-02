import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { SentimentBadge } from "@/components/news/SentimentBadge";
import { formatDateTime, cn } from "@/lib/utils";
import type { TopNewsItem } from "@/lib/types";

function TopNewsCard({ item }: { item: TopNewsItem }) {
  const {
    ticker,
    companyName,
    headline,
    source,
    sourceUrl,
    publishedAt,
    summary,
    sentiment,
    importance,
  } = item;

  return (
    <div className="rounded-xl border border-white/5 bg-zinc-900 p-5 transition-colors hover:border-white/10">
      {/* 티커 + 회사명 + 중요도 */}
      <div className="flex items-center gap-2 mb-2.5">
        <Link
          href={`/stocks/${ticker}`}
          className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 font-mono text-sm font-bold text-primary ring-1 ring-primary/20 hover:bg-primary/20 transition-colors"
        >
          {ticker}
        </Link>
        <span className="text-sm text-zinc-500 truncate">{companyName}</span>
        {importance != null && (
          <span
            className={cn(
              "ml-auto shrink-0 text-xs font-semibold tabular-nums",
              importance >= 80 ? "text-amber-400" : "text-sky-400"
            )}
          >
            중요도 {importance}
          </span>
        )}
      </div>

      {/* 헤드라인 */}
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <p className="font-semibold leading-snug text-base text-foreground/90">
          {headline}
        </p>
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 flex items-center gap-0.5 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          원문 <ExternalLink className="size-3" aria-hidden />
        </a>
      </div>

      {/* LLM 요약 */}
      {summary ? (
        <p className="text-sm text-muted-foreground leading-relaxed border-l-2 border-primary/20 pl-3 mb-3.5">
          {summary}
        </p>
      ) : (
        <p className="text-sm text-zinc-600 italic mb-3.5">분석 처리 중…</p>
      )}

      {/* 메타 */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-zinc-500">{source}</span>
        <span className="text-zinc-700">·</span>
        <span className="text-sm text-zinc-600">{formatDateTime(publishedAt)}</span>
        <SentimentBadge sentiment={sentiment} />
      </div>
    </div>
  );
}

interface TopNewsFeedProps {
  items: TopNewsItem[];
}

export function TopNewsFeed({ items }: TopNewsFeedProps) {
  if (items.length === 0) {
    return (
      <p className="py-16 text-center text-sm text-muted-foreground">
        조건에 맞는 주요 뉴스가 없습니다.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item, idx) => (
        <TopNewsCard
          key={`${item.ticker}-${item.publishedAt}-${idx}`}
          item={item}
        />
      ))}
    </div>
  );
}
