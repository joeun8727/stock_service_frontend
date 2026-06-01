# 10 — 프론트엔드 기술 스택 & 컨벤션

## 확정 스택

| 항목 | 선택 |
|------|------|
| Framework | Next.js 16.x (App Router) |
| React | 19.x (App Router 내장 canary) |
| Language | TypeScript (strict) |
| Package Manager | pnpm |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| Data Fetching | TanStack Query (React Query) v5 + fetch |
| Charts | Recharts |
| Icons | lucide-react |
| Date | date-fns |

> Next.js 16은 App Router가 표준이며 React Server Components, Server Actions, Streaming을 기본 사용. Pages Router는 쓰지 않음.

## 프로젝트 생성

```bash
pnpm create next-app@latest stock_service_frontend --typescript --tailwind --app --eslint
# shadcn/ui 초기화
pnpm dlx shadcn@latest init
```

## 환경변수

- `NEXT_PUBLIC_API_BASE_URL` — 백엔드 API 주소 (예: `http://localhost:8080/api/v1`).
- 클라이언트 노출 변수는 반드시 `NEXT_PUBLIC_` 접두사. 그 외 비밀값은 서버 전용.
- `.env.local`은 `.gitignore`.

## TypeScript 컨벤션

- `strict: true`. `any` 금지 (불가피하면 `unknown` 후 좁히기).
- API 응답 타입은 `lib/types.ts`에 정의하고 루트 `CLAUDE.md`의 계약과 일치시킴.
- 컴포넌트 props는 `interface`로, 유틸 반환 등은 `type`으로.

## 코딩 컨벤션

- **함수형 컴포넌트 + 화살표 함수** 또는 `function` 선언 (일관되게).
- 파일명: 컴포넌트 `PascalCase.tsx`, 그 외 `kebab-case.ts`.
- `'use client'`는 정말 필요한 컴포넌트 최상단에만. 무분별한 client 전환 금지.
- import 순서: 외부 → 내부 별칭(`@/`) → 상대경로.
- 주석은 한국어.

## 품질

- ESLint + Prettier 적용. 커밋 전 `pnpm lint` 통과.
- 접근성: 시맨틱 태그, `alt`, 키보드 포커스 고려.
