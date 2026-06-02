# Changelog

## [Unreleased]

### Changed
- 홈 페이지 제목 "유망 섹터 랭킹 Top 10" → "섹터 랭킹"

---

## 2026-06-02

### Added
- **신규 API 5개 연동**
  - `GET /stocks/{ticker}/score-breakdown` — 성장주·대형주 스코어 팩터별 브레이크다운
  - `GET /stocks/{ticker}/sentiment-trend` — 최근 30일 일별 감정 추이 차트
  - `GET /news/top` — 전 종목 횡단 중요 뉴스 피드 (`/news` 페이지)
  - `GET /sectors/{id}/rule-of-40` — 섹터 내 Rule of 40 랭킹 테이블
  - `GET /sectors/{id}/valuation` — 섹터 내 PER·PBR·PSR·PEG 밸류에이션 비교 (섹터 중앙값 클라이언트 계산)
- **`/news` 페이지** — 전 종목 주요 뉴스 피드, 헤더 nav 추가
- **`/glossary` 페이지** — 22개 재무·투자 용어 해설 (6개 카테고리)
- **`/methodology` 페이지** — 섹터 랭킹·성장주·대형주 스코어·Rule of 40·LLM 감정 분석 실제 계산 로직 공개
- 헤더 nav에 주요 뉴스 / 용어집 / 계산 방식 3개 메뉴 추가
- 섹터 랭킹 노출 개수 5개 → 10개 확대, 그리드 `xl:grid-cols-4` 추가

### Fixed
- `SectorValuationTable` — 백엔드 응답에 없는 `sectorMedian` 필드 접근으로 인한 TypeError 수정 (클라이언트에서 중앙값 직접 계산)
- `SectorRuleOf40` — `items` → `stocks` 필드명 불일치 수정
- `StockSentimentChart` — `dailyStats` → `trend` 필드명 불일치 수정
- `StockScoreBreakdown` — 타입 구조 전면 수정 (`growthFactors/largeCapFactors` → `scores[]`)
- `TopNewsData` — `total` → `count`, `fetchedAt` 필드 제거

### Changed
- 전체 UI 크기 확대: HTML 기본 폰트 16px → 17px, `max-w-6xl` → `max-w-7xl`, 헤더 높이 `h-14` → `h-16`
- 섹션 제목·카드 패딩·테이블 행 높이·뉴스 텍스트 전반적으로 증가
