"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TopNewsFeed } from "@/components/news/TopNewsFeed";
import type { TopNewsItem } from "@/lib/types";

const PAGE_SIZE = 10;

interface TopNewsPaginatedProps {
  items: TopNewsItem[];
}

export function TopNewsPaginated({ items }: TopNewsPaginatedProps) {
  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(items.length / PAGE_SIZE);
  const pageItems = items.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className="space-y-5">
      <TopNewsFeed items={pageItems} />

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 0}
            onClick={() => { setPage((p) => p - 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          >
            이전
          </Button>
          <span className="text-sm text-muted-foreground tabular-nums">
            {page + 1} / {totalPages}
            <span className="ml-2 text-zinc-600">({items.length}건)</span>
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages - 1}
            onClick={() => { setPage((p) => p + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          >
            다음
          </Button>
        </div>
      )}
    </div>
  );
}
