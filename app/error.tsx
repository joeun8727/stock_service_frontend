"use client";

import { ErrorState } from "@/components/common/ErrorState";

export default function RootError({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <ErrorState
        message="페이지를 불러오는 중 오류가 발생했습니다."
        onRetry={reset}
      />
    </div>
  );
}
