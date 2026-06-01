"use client";

import { ErrorState } from "@/components/common/ErrorState";

export default function SectorDetailError({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <ErrorState
        message="섹터 정보를 불러오지 못했습니다."
        onRetry={reset}
      />
    </div>
  );
}
