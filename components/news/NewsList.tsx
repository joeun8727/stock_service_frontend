"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { NewsCard } from "@/components/news/NewsCard";
import { NewsListSkeleton } from "@/components/common/LoadingSkeleton";
import { ErrorState } from "@/components/common/ErrorState";
import { Disclaimer } from "@/components/common/Disclaimer";
import { useStockNews } from "@/lib/queries";

interface NewsListProps {
  ticker: string;
}

export function NewsList({ ticker }: NewsListProps) {
  const [page, setPage] = useState(0);
  const { data, isPending, isError, refetch } = useStockNews(ticker, page);

  if (isPending) return <NewsListSkeleton />;
  if (isError)
    return (
      <ErrorState
        message="뉴스를 불러오지 못했습니다."
        onRetry={() => refetch()}
      />
    );

  const { news, totalPages, currentPage } = data;

  if (news.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        수집된 뉴스가 없습니다.
      </p>
    );
  }

  return (
    <section aria-label="종목 뉴스" className="space-y-3">
      {news.map((item, idx) => (
        <NewsCard key={`${item.sourceUrl}-${idx}`} item={item} />
      ))}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 0}
            onClick={() => setPage((p) => p - 1)}
          >
            이전
          </Button>
          <span className="text-xs text-muted-foreground">
            {currentPage + 1} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
          >
            다음
          </Button>
        </div>
      )}

      <Disclaimer className="mt-4" />
    </section>
  );
}
