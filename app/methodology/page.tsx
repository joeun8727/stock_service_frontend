import { FlaskConical } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "계산 방식 — StockNews",
  description:
    "섹터 랭킹, 성장주·대형주 스코어, Rule of 40, LLM 감정 분석의 실제 계산 로직 공개",
};

// ─────────────────────────────────────────
// 재사용 UI 블록
// ─────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl font-bold tracking-tight border-b border-white/5 pb-3 mb-6">
      {children}
    </h2>
  );
}

function FormulaBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-white/10 bg-zinc-950 px-5 py-4 font-mono text-sm text-zinc-200 leading-relaxed overflow-x-auto">
      {children}
    </div>
  );
}

function Tag({
  children,
  color = "zinc",
}: {
  children: React.ReactNode;
  color?: "sky" | "emerald" | "amber" | "violet" | "rose" | "zinc";
}) {
  const cls = {
    sky: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    violet: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    rose: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    zinc: "bg-zinc-700/50 text-zinc-400 border-zinc-600/30",
  }[color];
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold ${cls}`}
    >
      {children}
    </span>
  );
}

function InfoBox({
  children,
  type = "info",
}: {
  children: React.ReactNode;
  type?: "info" | "warn";
}) {
  return (
    <div
      className={`rounded-lg border px-4 py-3 text-sm leading-relaxed ${
        type === "warn"
          ? "border-amber-500/20 bg-amber-500/5 text-amber-300/80"
          : "border-sky-500/20 bg-sky-500/5 text-sky-300/80"
      }`}
    >
      {children}
    </div>
  );
}

// ─────────────────────────────────────────
// 섹터 랭킹 데이터
// ─────────────────────────────────────────

const MACRO_TABLE = [
  { sector: "AI/소프트웨어", low: 90, mid: 60, high: 30 },
  { sector: "반도체", low: 90, mid: 55, high: 25 },
  { sector: "항공·우주", low: 85, mid: 50, high: 20 },
  { sector: "로봇·자동화", low: 85, mid: 55, high: 25 },
  { sector: "EV·배터리", low: 80, mid: 45, high: 20 },
  { sector: "사이버보안", low: 80, mid: 65, high: 50 },
  { sector: "헬스케어·바이오", low: 65, mid: 55, high: 40 },
  { sector: "소비재", low: 70, mid: 50, high: 35 },
  { sector: "에너지", low: 50, mid: 55, high: 60 },
  { sector: "금융", low: 30, mid: 55, high: 85 },
];

// ─────────────────────────────────────────
// 페이지
// ─────────────────────────────────────────

export default function MethodologyPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 space-y-16">
      {/* 헤더 */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <FlaskConical className="size-5 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">계산 방식</h1>
        </div>
        <p className="text-base text-muted-foreground max-w-2xl">
          섹터 랭킹, 성장주·대형주 스코어, Rule of 40, LLM 감정 분석의 실제
          계산 로직을 공개합니다. 모든 데이터는 정보 제공 목적이며 투자 추천이
          아닙니다.
        </p>
        {/* 빠른 이동 */}
        <nav aria-label="섹션 이동" className="flex flex-wrap gap-2 pt-2">
          {[
            "섹터 랭킹 스코어",
            "대형주 스코어",
            "성장주 스코어",
            "Rule of 40",
            "LLM 감정 분석",
            "데이터 파이프라인",
          ].map((label) => (
            <a
              key={label}
              href={`#${label}`}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-zinc-400 hover:text-foreground hover:bg-white/10 transition-colors"
            >
              {label}
            </a>
          ))}
        </nav>
      </div>

      {/* ── 1. 섹터 랭킹 ── */}
      <section id="섹터 랭킹 스코어" className="scroll-mt-20 space-y-6">
        <SectionTitle>섹터 랭킹 스코어</SectionTitle>

        <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
          매일 배치로 5개 섹터의 유망도를 0~100점으로 산출합니다. 5개
          컴포넌트를 가중 합산하며, 데이터가 없는 항목은 중립값{" "}
          <span className="font-mono text-zinc-300">50</span>으로 대체합니다.
        </p>

        <FormulaBox>
          <p className="text-zinc-400 text-xs mb-2">최종 점수</p>
          <p>
            = 뉴스 볼륨 점수 × <span className="text-sky-400">0.25</span>
          </p>
          <p>
            + 감정 점수 × <span className="text-emerald-400">0.20</span>
          </p>
          <p>
            + 매출성장 점수 × <span className="text-sky-400">0.25</span>
          </p>
          <p>
            + 거시 점수 × <span className="text-amber-400">0.20</span>
          </p>
          <p>
            + 모멘텀 점수 × <span className="text-zinc-400">0.10</span>
          </p>
        </FormulaBox>

        {/* 컴포넌트 카드 5개 */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* 뉴스 볼륨 */}
          <div className="rounded-xl border border-white/5 bg-zinc-900 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <p className="font-semibold">뉴스 볼륨 점수</p>
              <Tag color="sky">25%</Tag>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              최근 7일 vs 직전 7일 뉴스 수 비교
            </p>
            <FormulaBox>
              <p className="text-xs text-zinc-500 mb-1">변화율</p>
              <p className="text-xs">= (최근7일 − 직전7일) ÷ 직전7일</p>
              <p className="text-xs mt-2 text-zinc-500">→ [-1, 1] 클램프</p>
              <p className="text-xs mt-1">점수 = 50 × (1 + 변화율)</p>
            </FormulaBox>
            <p className="text-xs text-zinc-600">
              직전 7일이 0이면 중립 50점
            </p>
          </div>

          {/* 감정 */}
          <div className="rounded-xl border border-white/5 bg-zinc-900 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <p className="font-semibold">감정 점수</p>
              <Tag color="emerald">20%</Tag>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              최근 14일 뉴스의 LLM 감정 평균
            </p>
            <FormulaBox>
              <p className="text-xs text-zinc-500 mb-1">입력: −1.0 ~ +1.0</p>
              <p className="text-xs">점수 = (감정 + 1) ÷ 2 × 100</p>
              <p className="text-xs mt-1 text-zinc-500">
                +1.0 → 100점 / 0 → 50점 / −1.0 → 0점
              </p>
            </FormulaBox>
          </div>

          {/* 매출성장 */}
          <div className="rounded-xl border border-white/5 bg-zinc-900 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <p className="font-semibold">매출성장 점수</p>
              <Tag color="sky">25%</Tag>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              섹터 내 종목 평균 매출성장 YoY
            </p>
            <FormulaBox>
              <p className="text-xs text-zinc-500 mb-1">범위: −20% ~ +100%</p>
              <p className="text-xs">
                점수 = (clamp(yoy, −20, 100) + 20) ÷ 120 × 100
              </p>
            </FormulaBox>
            <p className="text-xs text-zinc-600">
              이상치는 −20% / +100%로 클램핑
            </p>
          </div>

          {/* 거시 */}
          <div className="rounded-xl border border-white/5 bg-zinc-900 p-5 space-y-3 sm:col-span-2">
            <div className="flex items-center justify-between">
              <p className="font-semibold">거시 점수</p>
              <Tag color="amber">20%</Tag>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              미국 기준금리(DFF)를 기반으로 금리 환경을 3단계로 분류하고,
              섹터별 사전 정의 점수를 부여합니다.
            </p>
            <div className="flex gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="size-2 rounded-full bg-emerald-500/60 inline-block" />
                저금리 DFF &lt; 3.0%
              </span>
              <span className="flex items-center gap-1">
                <span className="size-2 rounded-full bg-amber-500/60 inline-block" />
                중금리 3.0~5.5%
              </span>
              <span className="flex items-center gap-1">
                <span className="size-2 rounded-full bg-red-500/60 inline-block" />
                고금리 DFF &gt; 5.5%
              </span>
            </div>
            <div className="overflow-x-auto rounded-lg border border-white/5">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.02] text-muted-foreground">
                    <th className="py-2 pl-3 text-left font-medium">섹터</th>
                    <th className="py-2 pr-3 text-center font-medium text-emerald-400/70">저금리</th>
                    <th className="py-2 pr-3 text-center font-medium text-amber-400/70">중금리</th>
                    <th className="py-2 pr-3 text-center font-medium text-red-400/70">고금리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {MACRO_TABLE.map((r) => (
                    <tr key={r.sector}>
                      <td className="py-1.5 pl-3 text-foreground/80">{r.sector}</td>
                      <td className="py-1.5 pr-3 text-center font-mono text-emerald-400">{r.low}</td>
                      <td className="py-1.5 pr-3 text-center font-mono text-amber-400">{r.mid}</td>
                      <td className="py-1.5 pr-3 text-center font-mono text-red-400">{r.high}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 모멘텀 */}
          <div className="rounded-xl border border-white/5 bg-zinc-900 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <p className="font-semibold">모멘텀 점수</p>
              <Tag color="zinc">10%</Tag>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              섹터 내 종목 중 영업이익률이 직전 분기 대비 개선된 비율
            </p>
            <FormulaBox>
              <p className="text-xs">
                = 개선된 종목 수 ÷ 재무데이터 보유 종목 수 × 100
              </p>
            </FormulaBox>
            <p className="text-xs text-zinc-600">
              재무 데이터 없으면 중립 50점
            </p>
          </div>
        </div>
      </section>

      {/* ── 2. 대형주 스코어 ── */}
      <section id="대형주 스코어" className="scroll-mt-20 space-y-5">
        <SectionTitle>대형주 스코어 (LARGE_CAP)</SectionTitle>

        <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
          섹터별 시가총액 상위 20개 종목을 선정하고, 시총 순위를 그대로 점수로
          변환합니다.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              선정 기준
            </h3>
            <ul className="space-y-2 text-sm text-foreground/80">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                섹터 내 시가총액 기준 상위 20개 종목
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                미국 주식(US 마켓)만 대상
              </li>
            </ul>

            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider pt-2">
              점수 공식
            </h3>
            <FormulaBox>
              <p>점수 = 100 − (순위 − 1) × 5</p>
              <p className="text-zinc-500 text-xs mt-2">
                1위 → 100점 / 2위 → 95점 / ... / 20위 → 5점
              </p>
            </FormulaBox>
          </div>

          <div className="rounded-xl border border-white/5 bg-zinc-900 p-5 space-y-3">
            <p className="text-sm font-semibold">해석 방법</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-sky-400 font-mono shrink-0">100점</span>
                <span>섹터 내 시총 1위 — 시장 지배력 최상위</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sky-400 font-mono shrink-0">50점</span>
                <span>섹터 내 시총 11위 수준</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-zinc-500 font-mono shrink-0">5점</span>
                <span>섹터 내 시총 20위 — Top 20 내 최하위</span>
              </li>
            </ul>
            <InfoBox type="info">
              대형주 스코어는 수익성·성장성이 아닌{" "}
              <strong>규모(시총)</strong>만을 반영합니다. 팩터 분석이 필요하면
              성장주 스코어를 함께 참고하세요.
            </InfoBox>
          </div>
        </div>
      </section>

      {/* ── 3. 성장주 스코어 ── */}
      <section id="성장주 스코어" className="scroll-mt-20 space-y-5">
        <SectionTitle>성장주 스코어 (GROWTH)</SectionTitle>

        <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
          섹터 내 $10B~$500B 규모의 종목 중 재무 조건을 충족하는 종목을 대상으로
          팩터별 백분위를 계산하고 가중 합산합니다. 섹터 그룹에 따라 평가 기준이
          다릅니다.
        </p>

        {/* 선정 기준 */}
        <div className="rounded-xl border border-white/5 bg-zinc-900 p-5 space-y-3">
          <p className="text-sm font-semibold">공통 선정 기준 (하드 필터)</p>
          <div className="grid sm:grid-cols-3 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-primary">•</span>
              <span>시가총액 <span className="font-mono text-foreground">$10B ~ $500B</span></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-primary">•</span>
              <span>부채비율 <span className="font-mono text-foreground">≤ 2.0</span></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-primary">•</span>
              <span>TRADITIONAL 그룹: 영업이익률 ≥ 0 (흑자)</span>
            </div>
          </div>
        </div>

        {/* 두 그룹 */}
        <div className="grid gap-5 lg:grid-cols-2">
          {/* GROWTH_TECH */}
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5 space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold">GROWTH_TECH 그룹</p>
                <Tag color="emerald">적자 허용</Tag>
              </div>
              <p className="text-xs text-zinc-500">
                AI/소프트웨어 · 로봇/자동화 · 사이버보안 · EV/배터리 · 항공우주
              </p>
            </div>

            <FormulaBox>
              <p className="text-zinc-400 text-xs mb-2">점수 = 팩터 백분위 가중합</p>
              <p>Rule of 40 백분위 × <span className="text-emerald-400">0.35</span></p>
              <p>+ 매출총이익 기울기 백분위 × <span className="text-emerald-400">0.25</span></p>
              <p>+ ROIC 기울기 백분위 × <span className="text-emerald-400">0.20</span></p>
              <p>+ PEG 백분위 × <span className="text-emerald-400">0.20</span></p>
            </FormulaBox>

            <div className="space-y-2 text-xs text-muted-foreground">
              <p>
                <span className="text-foreground font-medium">Rule of 40</span> —
                매출성장률(%) + max(FCF마진×100, 영업이익률×100)
              </p>
              <p>
                <span className="text-foreground font-medium">기울기 지표</span> —
                최근 8분기 선형회귀 기울기 (추세 개선도)
              </p>
              <p>
                <span className="text-foreground font-medium">PEG</span> —
                낮을수록 높은 백분위 (역순 적용)
              </p>
            </div>
          </div>

          {/* TRADITIONAL */}
          <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-5 space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold">TRADITIONAL 그룹</p>
                <Tag color="sky">흑자 필수</Tag>
              </div>
              <p className="text-xs text-zinc-500">
                반도체 · 헬스케어/바이오 · 에너지 · 금융 · 소비재
              </p>
            </div>

            <FormulaBox>
              <p className="text-zinc-400 text-xs mb-2">점수 = 팩터 백분위 가중합</p>
              <p>매출성장률 백분위 × <span className="text-sky-400">0.40</span></p>
              <p>+ 영업이익률 기울기 백분위 × <span className="text-sky-400">0.25</span></p>
              <p>+ ROIC 기울기 백분위 × <span className="text-sky-400">0.20</span></p>
              <p>+ PSR 백분위 × <span className="text-sky-400">0.15</span></p>
            </FormulaBox>

            <div className="space-y-2 text-xs text-muted-foreground">
              <p>
                <span className="text-foreground font-medium">기울기 지표</span> —
                최근 8분기 선형회귀 기울기 (추세 개선도)
              </p>
              <p>
                <span className="text-foreground font-medium">PSR</span> —
                낮을수록 높은 백분위 (역순 적용)
              </p>
            </div>
          </div>
        </div>

        {/* 백분위 계산 공통 로직 */}
        <div className="rounded-xl border border-white/5 bg-zinc-900 p-5 space-y-3">
          <p className="text-sm font-semibold">백분위 계산 공통 로직</p>
          <div className="grid sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <ul className="space-y-1.5">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5 shrink-0">1</span>
                섹터 내 대상 종목 풀에서 각 팩터별 순위 계산
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5 shrink-0">2</span>
                0~100 백분위로 변환 (동순위는 평균 순위 처리)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5 shrink-0">3</span>
                결측값은 중립값 <span className="font-mono text-zinc-300">50</span>으로 대체
              </li>
            </ul>
            <ul className="space-y-1.5">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5 shrink-0">4</span>
                PEG·PSR 등 낮을수록 좋은 지표는{" "}
                <span className="font-mono text-zinc-300">100 − 백분위</span>로 역전
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5 shrink-0">5</span>
                8분기 추세 계산 시 상하위 10% 윈저화 적용
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5 shrink-0">6</span>
                추세 계산은 데이터 최소 3분기 이상 필요
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── 4. Rule of 40 ── */}
      <section id="Rule of 40" className="scroll-mt-20 space-y-5">
        <SectionTitle>Rule of 40</SectionTitle>

        <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
          SaaS·테크 기업의 성장성과 수익성을 하나의 숫자로 요약하는 지표입니다.
          빠른 성장과 높은 마진을 동시에 달성하기 어렵다는 특성을 반영해,
          두 지표의 합이 40 이상이면 균형 잡힌 기업으로 평가합니다.
        </p>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-4">
            <FormulaBox>
              <p className="text-zinc-400 text-xs mb-2">Rule of 40 공식</p>
              <p>= 매출성장률(%) + 현금창출마진(%)</p>
              <p className="text-zinc-500 text-xs mt-3">
                현금창출마진 = max(FCF마진 × 100, 영업이익률)
              </p>
              <p className="text-zinc-600 text-xs mt-1">
                FCF마진 우선 적용, 없으면 영업이익률로 대체
              </p>
            </FormulaBox>

            <div className="space-y-2">
              <p className="text-sm font-semibold">점수 해석</p>
              <div className="space-y-2">
                {[
                  { range: "40 이상", label: "고성장·고효율", color: "text-emerald-400", bg: "bg-emerald-500/10" },
                  { range: "20 ~ 39", label: "양호", color: "text-amber-400", bg: "bg-amber-500/10" },
                  { range: "20 미만", label: "성장·수익성 균형 재검토 필요", color: "text-zinc-400", bg: "bg-zinc-800/50" },
                ].map((r) => (
                  <div key={r.range} className={`flex items-center gap-3 rounded-lg px-3 py-2 ${r.bg}`}>
                    <span className={`font-mono font-bold text-sm shrink-0 ${r.color}`}>{r.range}</span>
                    <span className="text-sm text-foreground/80">{r.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-white/5 bg-zinc-900 p-5 space-y-3">
              <p className="text-sm font-semibold">계산 예시</p>
              <div className="space-y-3 text-sm">
                <div className="rounded-lg bg-white/[0.04] px-4 py-3 space-y-1">
                  <p className="font-mono text-foreground">NVDA (NVIDIA)</p>
                  <p className="text-muted-foreground text-xs">매출성장 70.7% + FCF마진 59.5%</p>
                  <p className="text-emerald-400 font-mono font-bold">= 130.2점 ✓</p>
                </div>
                <div className="rounded-lg bg-white/[0.04] px-4 py-3 space-y-1">
                  <p className="font-mono text-foreground">초기 성장 기업</p>
                  <p className="text-muted-foreground text-xs">매출성장 60% + FCF마진 −25%</p>
                  <p className="text-amber-400 font-mono font-bold">= 35점</p>
                </div>
              </div>
            </div>

            <InfoBox type="info">
              <span className="font-semibold">FCF vs 영업이익률:</span> FCF마진은
              실제 현금 창출을, 영업이익률은 회계적 수익성을 반영합니다. FCF
              데이터가 없는 경우 영업이익률로 대체해 일관성을 유지합니다.
            </InfoBox>
          </div>
        </div>
      </section>

      {/* ── 5. LLM 감정 분석 ── */}
      <section id="LLM 감정 분석" className="scroll-mt-20 space-y-5">
        <SectionTitle>LLM 감정 분석</SectionTitle>

        <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
          Gemini LLM이 뉴스 헤드라인과 본문 스니펫을 분석해 감정 점수·중요도·관련도를 산출합니다.
          결과는 JSON 형태로 파싱되며, 파싱 실패 시 해당 필드는 null 처리됩니다.
        </p>

        <div className="grid gap-5 lg:grid-cols-2">
          {/* 출력 구조 */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">LLM 출력 구조</h3>
            <FormulaBox>
              <pre className="text-xs leading-relaxed">{`{
  "summary":    "3줄 이내 한국어 요약",
  "sentiment":  -1.0 ~ +1.0,
  "importance": 0 ~ 100,
  "relevance":  "HIGH" | "MEDIUM" | "LOW"
}`}</pre>
            </FormulaBox>

            <h3 className="text-sm font-semibold pt-1">감정 점수 기준</h3>
            <div className="space-y-2 text-sm">
              {[
                { range: "+0.3 이상", label: "긍정", color: "text-emerald-400" },
                { range: "−0.3 ~ +0.3", label: "중립", color: "text-zinc-400" },
                { range: "−0.3 이하", label: "부정", color: "text-red-400" },
              ].map((r) => (
                <div key={r.range} className="flex items-center gap-3">
                  <span className={`font-mono text-sm w-28 shrink-0 ${r.color}`}>{r.range}</span>
                  <span className="text-foreground/80">{r.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 중요도 기준 */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">중요도 점수 기준</h3>
            <div className="overflow-x-auto rounded-xl border border-white/5">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.02] text-xs text-muted-foreground">
                    <th className="py-2.5 pl-4 text-left font-medium">점수</th>
                    <th className="py-2.5 pr-4 text-left font-medium">해당 뉴스 유형</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04] text-xs">
                  {[
                    { range: "80~100", label: "실적 발표, M&A, 대형 계약, 규제 승인, 소송 결과", color: "text-amber-400" },
                    { range: "50~79", label: "신제품, 가이던스 변경, 파트너십, 경영진 교체", color: "text-sky-400" },
                    { range: "20~49", label: "일반 사업 소식, 시장 코멘트", color: "text-zinc-400" },
                    { range: "0~19", label: "광고성·단순 시세 언급·중복 보도", color: "text-zinc-600" },
                  ].map((r) => (
                    <tr key={r.range}>
                      <td className={`py-2.5 pl-4 font-mono font-semibold ${r.color}`}>{r.range}</td>
                      <td className="py-2.5 pr-4 text-foreground/70">{r.label}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="text-sm font-semibold pt-1">관련도 분류 기준</h3>
            <div className="flex gap-3 text-xs flex-wrap">
              <span className="flex items-center gap-1.5 rounded-md bg-amber-500/10 border border-amber-500/20 px-2.5 py-1.5 text-amber-400">
                HIGH <span className="text-amber-400/60 font-mono">importance ≥ 60</span>
              </span>
              <span className="flex items-center gap-1.5 rounded-md bg-sky-500/10 border border-sky-500/20 px-2.5 py-1.5 text-sky-400">
                MEDIUM <span className="text-sky-400/60 font-mono">≥ 30</span>
              </span>
              <span className="flex items-center gap-1.5 rounded-md bg-zinc-700/50 border border-zinc-600/30 px-2.5 py-1.5 text-zinc-400">
                LOW <span className="text-zinc-500 font-mono">&lt; 30</span>
              </span>
            </div>
          </div>
        </div>

        <InfoBox type="warn">
          LLM 감정 분석은 확률적 모델의 출력이므로 오류 가능성이 있습니다.
          투자 결정의 근거로 단독 사용을 권장하지 않으며, 본 서비스의 모든
          데이터는 정보 제공만을 목적으로 합니다.
        </InfoBox>
      </section>

      {/* ── 6. 데이터 파이프라인 ── */}
      <section id="데이터 파이프라인" className="scroll-mt-20 space-y-5">
        <SectionTitle>데이터 파이프라인</SectionTitle>

        <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
          데이터 수집부터 스코어링까지의 전체 흐름입니다.
        </p>

        <div className="overflow-x-auto">
          <div className="flex flex-col gap-0 min-w-[480px]">
            {[
              {
                step: "1",
                title: "뉴스 수집",
                desc: "Finnhub API로 종목별 뉴스 수집",
                color: "border-zinc-600 bg-zinc-800",
              },
              {
                step: "2",
                title: "LLM 분석",
                desc: "Gemini가 헤드라인·스니펫 분석 → 요약·감정·중요도·관련도 산출",
                color: "border-violet-500/40 bg-violet-500/10",
              },
              {
                step: "3",
                title: "재무 데이터 수집",
                desc: "Finnhub API로 분기별 재무지표 수집 (ROE, ROA, ROIC, 매출성장 등)",
                color: "border-zinc-600 bg-zinc-800",
              },
              {
                step: "4",
                title: "추세 계산",
                desc: "최근 8분기 선형회귀로 각 지표의 개선/악화 기울기 산출 (상하위 10% 윈저화)",
                color: "border-sky-500/40 bg-sky-500/10",
              },
              {
                step: "5",
                title: "성장주 스코어링 (배치)",
                desc: "팩터 백분위 계산 → 가중 합산 → StockScore 저장",
                color: "border-emerald-500/40 bg-emerald-500/10",
              },
              {
                step: "6",
                title: "섹터 랭킹 산출 (배치)",
                desc: "뉴스 볼륨·감정·매출성장·거시·모멘텀 합산 → 섹터 순위 업데이트",
                color: "border-amber-500/40 bg-amber-500/10",
              },
            ].map((item, i, arr) => (
              <div key={item.step} className="flex gap-0 items-stretch">
                <div className="flex flex-col items-center">
                  <div className={`flex size-8 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${item.color}`}>
                    {item.step}
                  </div>
                  {i < arr.length - 1 && (
                    <div className="w-px flex-1 bg-white/10 my-1" />
                  )}
                </div>
                <div className="pb-5 pl-4">
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 파라미터 요약 */}
        <div className="rounded-xl border border-white/5 bg-zinc-900 p-5">
          <p className="text-sm font-semibold mb-4">주요 파라미터</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-2 text-sm">
            {[
              ["시총 하한 (성장주)", "$10B"],
              ["시총 상한 (성장주)", "$500B"],
              ["부채비율 최대 (성장주)", "2.0"],
              ["추세 계산 기간", "8분기"],
              ["추세 최소 데이터", "3분기"],
              ["윈저화 비율", "상하위 10%"],
              ["뉴스 볼륨 비교 기간", "7일씩"],
              ["감정 분석 기간 (섹터)", "14일"],
              ["금리 저 임계", "DFF < 3.0%"],
              ["금리 고 임계", "DFF > 5.5%"],
              ["결측값 대체", "중립 50점"],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-2 border-b border-white/[0.04] py-1.5 last:border-0">
                <span className="text-muted-foreground text-xs">{label}</span>
                <span className="font-mono text-xs text-foreground">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <p className="text-xs text-zinc-700 text-center pb-4">
        본 계산 방식은 특정 투자 전략을 권장하지 않습니다. 모든 스코어는
        객관적 데이터 기반 정렬 도구이며, 투자 판단은 이용자 본인의 책임입니다.
      </p>
    </div>
  );
}
