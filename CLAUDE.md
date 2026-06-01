# StockNews Frontend — Next.js 가이드

미장 섹터·종목 분석 정보를 보여주는 웹 프론트엔드. Next.js 16 App Router.

> 📌 **API 계약은 루트 `../CLAUDE.md`의 "API 계약" 섹션이 기준입니다.** 백엔드와 타입/엔드포인트를 항상 일치시키세요.
> ⚠️ **투자 추천이 아닌 정보 제공 화면입니다.** 모든 데이터 화면에 면책 문구를 노출하세요. (`.claude/rules/14-compliance-ui.md`)

## 화면 구성 (Phase 1)

```
/                         → 홈: 유망 섹터 랭킹 1~5위 (카드)
/sectors/[sectorId]       → 섹터 상세: 대형주/성장주 Top20 탭 + 트렌드 차트
/stocks/[ticker]          → 종목 상세: 기본정보 + 재무지표 + 뉴스 리스트
```

## 규칙 파일 인덱스

| 파일 | 언제 읽는가 |
|------|------------|
| `.claude/rules/tech-stack.md` | 모든 작업 (Next.js, 스택, 컨벤션) |
| `.claude/rules/structure.md` | 폴더/라우팅/컴포넌트 구조 작업 시 |
| `.claude/rules/data-fetching.md` | API 연동, TanStack Query 작업 시 |
| `.claude/rules/ui-design.md` | UI/스타일/컴포넌트 작업 시 |
| `.claude/rules/compliance-ui.md` | 데이터 표시 화면 작업 시 (면책/표현) |

## 작업 원칙

- **타입은 백엔드 계약과 일치**: 루트 CLAUDE.md의 타입 정의를 `lib/types.ts`에 반영.
- **Server Component 우선**: 데이터 조회는 가능하면 서버에서. 상호작용 필요한 부분만 Client Component.
- **한국어 UI**: 모든 화면 텍스트/주석 한국어.
- **한 번에 한 화면씩** 완성하고 다음으로.

## 실행

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build
pnpm lint
```
