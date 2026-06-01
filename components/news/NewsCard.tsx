import { ExternalLink } from "lucide-react";
import { SentimentBadge } from "@/components/news/SentimentBadge";
import { formatDateTime, cn } from "@/lib/utils";
import type { NewsItem } from "@/lib/types";

interface NewsCardProps {
  item: NewsItem;
}

const RELEVANCE_STYLE: Record<string, string> = {
  HIGH: "bg-amber-500/10 text-amber-400",
  MEDIUM: "bg-sky-500/10 text-sky-400",
  LOW: "bg-zinc-700/50 text-zinc-500",
};
const RELEVANCE_LABEL: Record<string, string> = {
  HIGH: "관련도 높음",
  MEDIUM: "관련도 보통",
  LOW: "관련도 낮음",
};

export function NewsCard({ item }: NewsCardProps) {
  const { headline, source, sourceUrl, publishedAt, summary, sentiment, importance, relevance } = item;

  return (
    <div className="rounded-xl border border-white/5 bg-zinc-900 p-4 transition-colors hover:border-white/10">
      {/* 헤드라인 */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <p className="font-semibold leading-snug text-sm text-foreground/90">{headline}</p>
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 flex items-center gap-0.5 text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          원문 <ExternalLink className="size-3" aria-hidden />
        </a>
      </div>

      {/* LLM 요약 */}
      {summary ? (
        <p className="text-xs text-muted-foreground leading-relaxed border-l-2 border-primary/20 pl-3 mb-3">
          {summary}
        </p>
      ) : (
        <p className="text-xs text-zinc-600 italic mb-3">분석 처리 중…</p>
      )}

      {/* 메타 행 */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-zinc-500">{source}</span>
        <span className="text-zinc-700">·</span>
        <span className="text-xs text-zinc-600">{formatDateTime(publishedAt)}</span>

        <SentimentBadge sentiment={sentiment} />

        {importance != null && (
          <span
            className={cn(
              "text-xs font-semibold tabular-nums",
              importance >= 80 && "text-amber-400",
              importance >= 50 && importance < 80 && "text-sky-400",
              importance < 50 && "text-zinc-500"
            )}
          >
            중요도 {importance}
          </span>
        )}

        {relevance && (
          <span
            className={cn(
              "rounded-md px-1.5 py-0.5 text-[10px] font-medium",
              RELEVANCE_STYLE[relevance] ?? "bg-zinc-700/50 text-zinc-500"
            )}
          >
            {RELEVANCE_LABEL[relevance] ?? relevance}
          </span>
        )}
      </div>
    </div>
  );
}
