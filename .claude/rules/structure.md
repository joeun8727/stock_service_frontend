# 11 — 폴더 구조 & 라우팅

## 디렉토리 구조

```
stock_service_frontend/
├── app/
│   ├── layout.tsx              # 루트 레이아웃 (Providers, 면책 푸터)
│   ├── page.tsx                # 홈 — 섹터 랭킹 1~5위
│   ├── globals.css
│   ├── sectors/
│   │   └── [sectorId]/
│   │       └── page.tsx        # 섹터 상세 (대형주/성장주 탭)
│   └── stocks/
│       └── [ticker]/
│           └── page.tsx        # 종목 상세
├── components/
│   ├── ui/                     # shadcn/ui 생성 컴포넌트
│   ├── sector/                 # SectorRankCard, SectorTrendChart 등
│   ├── stock/                  # StockMetricsTable, StockProfileCard 등
│   ├── news/                   # NewsList, NewsItem, SentimentBadge
│   └── common/                 # Disclaimer, LoadingSkeleton, ErrorState
├── lib/
│   ├── api.ts                  # fetch 래퍼 (ApiResponse 언랩)
│   ├── types.ts                # API 계약 타입 (루트 CLAUDE.md 기준)
│   ├── queries.ts              # TanStack Query 키 + 훅
│   └── utils.ts                # cn(), 포맷 함수
└── providers/
    └── query-provider.tsx      # QueryClientProvider ('use client')
```

## 라우팅 규칙 (App Router)

- 라우트는 `app/` 폴더 구조로 정의. 동적 세그먼트는 `[param]`.
- `page.tsx`는 기본 **Server Component**. 데이터 조회를 서버에서 수행.
- 상호작용(탭 전환, 필터, 차트 hover)이 필요한 부분만 별도 **Client Component**로 분리해 import.
- `loading.tsx`로 라우트별 로딩 스켈레톤, `error.tsx`로 에러 바운더리 제공.

## 컴포넌트 분리 원칙

- **서버에서 데이터 받아 → 클라이언트 컴포넌트에 props로 전달** 패턴 우선.
- 도메인별로 `components/{sector,stock,news}`에 모음. 공통 UI는 `common/`.
- 한 파일 = 한 컴포넌트. 200줄 넘으면 분리 고려.

## 페이지별 데이터

| 라우트 | 호출 API |
|--------|---------|
| `/` | `GET /sectors/ranking` |
| `/sectors/[sectorId]` | `GET /sectors/{id}/stocks?type=...`, `GET /sectors/{id}/trend` |
| `/stocks/[ticker]` | `GET /stocks/{ticker}`, `/financials`, `/news`, `/summary` |
