"use client";

import { ErrorState } from "@/components/common/ErrorState";

export default function StockDetailError({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <ErrorState
        message="종목 정보를 불러오지 못했습니다."
        onRetry={reset}
      />
    </div>
  );
}
