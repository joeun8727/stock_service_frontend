# 12 — 데이터 페칭 (API 연동)

## 기본 전략

- **초기 로드 데이터**: Server Component에서 직접 `fetch` (서버에서 받아 HTML에 포함 → 빠른 첫 화면).
- **클라이언트 상호작용 데이터**(탭 전환, 페이징, 필터, refetch): **TanStack Query v5**.
- 두 방식을 혼용: 서버에서 초기 데이터를 가져와 Query의 `initialData`로 주입하면 최적.

## API 래퍼 (`lib/api.ts`)

모든 호출은 공통 래퍼 경유. `ApiResponse<T>`를 언랩하고 에러를 표준화:

```ts
const BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });
  if (!res.ok) throw new ApiError(res.status, await res.text());
  const json = (await res.json()) as ApiResponse<T>;
  if (!json.success || json.data === null) {
    throw new ApiError(res.status, json.error?.message ?? 'Unknown error');
  }
  return json.data;
}
```

- `disclaimer`는 응답에서 별도로 꺼내 화면에 노출 (`14-compliance-ui.md`).
- 타입 `ApiResponse<T>`, 도메인 타입은 `lib/types.ts` (루트 계약 기준).

## TanStack Query (`lib/queries.ts`)

- 쿼리 키는 상수 팩토리로 관리 (문자열 하드코딩 금지):

```ts
export const qk = {
  sectorRanking: () => ['sectors', 'ranking'] as const,
  sectorStocks: (id: string, type: string) => ['sectors', id, 'stocks', type] as const,
  stock: (ticker: string) => ['stocks', ticker] as const,
  stockNews: (ticker: string, page: number) => ['stocks', ticker, 'news', page] as const,
};
```

- 각 도메인 훅 제공: `useSectorRanking()`, `useSectorStocks(id, type)`, `useStockNews(ticker, page)` 등.
- `staleTime`: 섹터 랭킹 10분, 종목 지표 5분, 뉴스 2분 (백엔드 캐시 TTL과 정합).
- `QueryClientProvider`는 `providers/query-provider.tsx`에서 `'use client'`로 구성하고 루트 레이아웃에 래핑.

## 로딩 / 에러 / 빈 상태

- 로딩: `loading.tsx` 또는 Query `isPending` → 스켈레톤(`components/common/LoadingSkeleton`).
- 에러: `error.tsx` 또는 Query `isError` → `ErrorState` + 재시도 버튼.
- 빈 데이터: "데이터가 없습니다" 안내 (절대 빈 화면 방치 금지).

## 규칙

- 컴포넌트 안에서 `fetch` 직접 호출 금지 → 반드시 `apiGet` / Query 훅 경유.
- 환경변수 미설정 시 빌드/런타임에 명확히 실패하도록 (조용한 무시 금지).
- 백엔드 계약 변경 시 `lib/types.ts`와 루트 `CLAUDE.md`를 함께 수정.
