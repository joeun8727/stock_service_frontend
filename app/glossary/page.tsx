import { BookOpen } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "용어집 — StockNews",
  description: "PER, PBR, ROE, ROIC 등 미국 주식 분석에 쓰이는 재무·투자 용어 해설",
};

interface Term {
  name: string;
  en: string;
  formula?: string;
  desc: string;
  tip: string;
}

interface Category {
  label: string;
  color: string;
  terms: Term[];
}

const CATEGORIES: Category[] = [
  {
    label: "밸류에이션",
    color: "border-sky-500/30 bg-sky-500/5",
    terms: [
      {
        name: "PER",
        en: "Price-to-Earnings Ratio · 주가수익비율",
        formula: "주가 ÷ 주당순이익(EPS)",
        desc: "주가가 1주당 순이익의 몇 배인지 나타냅니다. 동일 섹터 내 기업 간 상대 비교에 주로 활용합니다.",
        tip: "낮을수록 이익 대비 주가가 저렴. 성장주는 미래 이익 기대로 PER이 높게 형성되는 경향이 있습니다.",
      },
      {
        name: "PBR",
        en: "Price-to-Book Ratio · 주가순자산비율",
        formula: "주가 ÷ 주당순자산(BPS)",
        desc: "주가가 장부가치(순자산)의 몇 배인지 나타냅니다. 자산 집약적 업종(금융·에너지 등)에서 유용합니다.",
        tip: "1 미만이면 청산가치 이하에 거래되는 것. 그러나 무형자산 비중이 큰 테크·소프트웨어 기업은 수치가 높게 나타납니다.",
      },
      {
        name: "PSR",
        en: "Price-to-Sales Ratio · 주가매출비율",
        formula: "시가총액 ÷ 연간 매출",
        desc: "이익이 아직 없거나 적자인 초기 성장 기업의 밸류에이션을 평가할 때 주로 사용합니다.",
        tip: "SaaS·바이오처럼 초기 투자비용이 큰 업종에서 PER 대안으로 활용. 낮을수록 매출 대비 저평가.",
      },
      {
        name: "PEG",
        en: "Price/Earnings-to-Growth · 주가이익성장비율",
        formula: "PER ÷ 이익성장률(%)",
        desc: "PER에 성장률을 반영한 지표입니다. PER만으로는 포착하기 어려운 성장 프리미엄의 적정성을 판단합니다.",
        tip: "1 미만이면 성장성 대비 저평가로 해석하는 경우가 많습니다. 성장률 예측이 전제되므로 추정치 신뢰도가 중요합니다.",
      },
      {
        name: "EPS",
        en: "Earnings Per Share · 주당순이익",
        formula: "당기순이익 ÷ 발행주식수",
        desc: "주식 1주가 창출하는 순이익입니다. PER 계산의 분모가 되는 핵심 수치입니다.",
        tip: "Diluted EPS(희석 EPS)는 스톡옵션·전환사채 등을 주식으로 환산해 계산하므로 더 보수적입니다.",
      },
    ],
  },
  {
    label: "수익성",
    color: "border-emerald-500/30 bg-emerald-500/5",
    terms: [
      {
        name: "ROE",
        en: "Return on Equity · 자기자본이익률",
        formula: "순이익 ÷ 자기자본 × 100",
        desc: "주주가 투자한 자본으로 얼마나 이익을 냈는지 나타냅니다. 경영 효율성의 대표 지표입니다.",
        tip: "일반적으로 15% 이상이면 우수. 다만 레버리지(부채)로 인위적으로 높아질 수 있으므로 ROA·ROIC와 함께 봐야 합니다.",
      },
      {
        name: "ROA",
        en: "Return on Assets · 총자산이익률",
        formula: "순이익 ÷ 총자산 × 100",
        desc: "보유한 총자산으로 얼마나 이익을 냈는지 나타냅니다. ROE와 달리 부채 효과가 제거됩니다.",
        tip: "금융업은 자산 규모가 커서 수치가 낮게 나오는 경향이 있어, 동일 업종 내 비교가 중요합니다.",
      },
      {
        name: "ROIC",
        en: "Return on Invested Capital · 투하자본이익률",
        formula: "세후영업이익(NOPAT) ÷ 투하자본 × 100",
        desc: "영업에 실제 투입된 자본(자기자본 + 이자부채)이 창출하는 수익률입니다. 핵심 사업의 자본 효율성을 측정합니다.",
        tip: "ROIC > WACC(가중평균자본비용)이면 기업이 가치를 창출한다고 해석합니다.",
      },
      {
        name: "영업이익률",
        en: "Operating Margin",
        formula: "영업이익 ÷ 매출 × 100",
        desc: "본업에서 얼마나 이익을 내는지 나타냅니다. 이자·세금 등 비영업 항목을 제외한 순수 사업 수익성입니다.",
        tip: "동일 업종 기업과 비교하거나, 시계열로 개선·악화 추이를 확인하는 것이 중요합니다.",
      },
      {
        name: "FCF 마진",
        en: "Free Cash Flow Margin",
        formula: "잉여현금흐름(FCF) ÷ 매출 × 100",
        desc: "설비투자(CapEx) 후 실제로 손에 남는 현금의 비율입니다. 회계 이익과 달리 현금 창출 능력을 직접 보여줍니다.",
        tip: "높은 FCF 마진은 배당·자사주매입·M&A 여력을 의미합니다. 특히 SaaS 기업 평가에 핵심 지표입니다.",
      },
      {
        name: "매출총이익률",
        en: "Gross Margin",
        formula: "(매출 − 매출원가) ÷ 매출 × 100",
        desc: "제품·서비스 원가를 제하고 남는 이익의 비율입니다. 비즈니스 모델의 구조적 우위를 보여줍니다.",
        tip: "소프트웨어는 70~80%, 하드웨어·제조는 30~50% 수준이 일반적. 섹터 평균과 비교해야 의미가 있습니다.",
      },
    ],
  },
  {
    label: "성장성",
    color: "border-amber-500/30 bg-amber-500/5",
    terms: [
      {
        name: "매출성장 YoY",
        en: "Revenue Growth Year-over-Year",
        formula: "(당기 매출 − 전기 매출) ÷ 전기 매출 × 100",
        desc: "전년 동기 대비 매출이 얼마나 늘었는지 나타냅니다. 기업의 외형 성장속도를 가장 직관적으로 보여주는 지표입니다.",
        tip: "성장주는 20% 이상을 기대하는 경우가 많습니다. 환율·인수합병 등 일회성 요인을 제거한 '유기적 성장률'도 함께 보면 좋습니다.",
      },
      {
        name: "Rule of 40",
        en: "Rule of 40",
        formula: "매출성장률(%) + FCF 마진(%)",
        desc: "SaaS·테크 기업 건전성 평가 지표. 성장과 수익성의 합이 40 이상이면 균형 잡힌 기업으로 평가합니다.",
        tip: "합산 40 이상: 고성장·고효율 / 20~40: 양호 / 20 미만: 주의. 빠르게 성장하는 초기 기업은 FCF 마진이 낮아도 성장률로 상쇄 가능합니다.",
      },
    ],
  },
  {
    label: "재무 건전성",
    color: "border-orange-500/30 bg-orange-500/5",
    terms: [
      {
        name: "부채비율",
        en: "Debt Ratio",
        formula: "총부채 ÷ 자기자본",
        desc: "자기자본 대비 부채가 얼마나 많은지 나타냅니다. 재무 레버리지 수준을 보여주는 기본 지표입니다.",
        tip: "1(100%) 미만이면 안정적. 그러나 업종마다 적정 수준이 다르며(금융업은 구조적으로 높음), 이자보상배율과 함께 봐야 합니다.",
      },
      {
        name: "이자보상배율",
        en: "Interest Coverage Ratio",
        formula: "영업이익 ÷ 이자비용",
        desc: "영업이익으로 이자를 몇 배 갚을 수 있는지 나타냅니다. 부채 상환 능력의 안전 마진을 보여줍니다.",
        tip: "3 이상이면 비교적 안전. 1 미만이면 영업이익으로 이자도 못 내는 상황입니다.",
      },
    ],
  },
  {
    label: "뉴스 분석 지표",
    color: "border-violet-500/30 bg-violet-500/5",
    terms: [
      {
        name: "감정 점수",
        en: "Sentiment Score",
        formula: "−1.0 (매우 부정) ~ +1.0 (매우 긍정)",
        desc: "LLM이 뉴스 헤드라인·요약을 분석해 산출하는 시장 감정 지수입니다. +0.3 이상을 긍정, −0.3 이하를 부정으로 분류합니다.",
        tip: "단기 시장 심리를 반영하며, 실제 펀더멘털과 다를 수 있습니다. 추세 변화(상승/하락)가 절대값보다 의미 있는 경우가 많습니다.",
      },
      {
        name: "중요도",
        en: "Importance Score",
        formula: "0 ~ 100점",
        desc: "뉴스가 시장·종목에 미치는 영향력을 LLM이 0~100 점수로 평가합니다. 실적 발표·대형 계약·규제 이슈 등이 높게 산정됩니다.",
        tip: "80 이상: 매우 높음 / 50~79: 높음 / 20~49: 보통 / 20 미만: 낮음으로 표시됩니다.",
      },
      {
        name: "관련도",
        en: "Relevance",
        formula: "HIGH / MEDIUM / LOW",
        desc: "뉴스가 해당 종목과 얼마나 직접적으로 관련되는지를 나타냅니다. HIGH는 종목이 주인공인 기사입니다.",
        tip: "섹터 전체 뉴스가 해당 종목 티커를 직접 언급하면 HIGH, 업계 이슈로만 연결되면 MEDIUM 이하로 분류됩니다.",
      },
      {
        name: "뉴스 볼륨 변화",
        en: "News Volume Change",
        formula: "(이번 주 뉴스 수 − 저번 주) ÷ 저번 주 × 100",
        desc: "최근 뉴스 언급량이 전주 대비 얼마나 증감했는지 나타냅니다. 섹터 주목도·이슈 발생 여부를 빠르게 파악할 수 있습니다.",
        tip: "급격한 증가(+100% 이상)는 대형 이벤트 발생 가능성을 시사합니다. 감소는 시장 관심 소멸을 의미할 수 있습니다.",
      },
    ],
  },
  {
    label: "섹터·스코어링",
    color: "border-rose-500/30 bg-rose-500/5",
    terms: [
      {
        name: "섹터 스코어",
        en: "Sector Score",
        formula: "뉴스 볼륨 × 감정 × 매출성장 × 거시지표 가중 합산",
        desc: "뉴스 볼륨 변화, 평균 감정, 평균 매출성장, 거시경제 지표를 종합한 섹터 유망도 점수(0~100)입니다.",
        tip: "투자 추천이 아닌 객관적 지표 기반 정렬입니다. 동일 기준으로 5개 섹터를 비교하는 용도로만 활용하세요.",
      },
      {
        name: "대형주 스코어",
        en: "Large-Cap Score",
        formula: "시가총액·ROE·ROIC·부채비율 등 팩터 백분위 가중 합산",
        desc: "섹터 내 시가총액 상위 종목을 수익성·재무안정성 팩터 기준으로 순위를 매기는 점수입니다.",
        tip: "각 팩터의 섹터 내 백분위를 계산한 뒤 가중 합산합니다. 100점에 가까울수록 섹터 내 상위 수준입니다.",
      },
      {
        name: "성장주 스코어",
        en: "Growth Score",
        formula: "매출성장·FCF 마진·ROIC 등 팩터 백분위 가중 합산",
        desc: "매출성장률, FCF 마진, ROIC 등 성장·효율 팩터 기준으로 섹터 내 성장주 순위를 매기는 점수입니다.",
        tip: "수익성보다 성장 속도를 중시하는 섹터(AI/소프트웨어·로봇 등)에서 더 의미 있는 지표입니다.",
      },
    ],
  },
];

function TermCard({ term }: { term: Term }) {
  return (
    <div className="rounded-xl border border-white/5 bg-zinc-900 p-5 space-y-3 hover:border-white/10 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-lg font-bold font-mono text-foreground">
            {term.name}
          </span>
          <p className="text-xs text-zinc-500 mt-0.5">{term.en}</p>
        </div>
      </div>

      {term.formula && (
        <div className="rounded-md bg-white/[0.04] border border-white/[0.06] px-3 py-2">
          <p className="text-xs text-zinc-500 mb-0.5">공식</p>
          <p className="text-sm font-mono text-zinc-300">{term.formula}</p>
        </div>
      )}

      <p className="text-sm text-foreground/80 leading-relaxed">{term.desc}</p>

      <div className="flex items-start gap-2 rounded-md bg-primary/5 border border-primary/10 px-3 py-2">
        <span className="text-xs text-primary/60 mt-0.5 shrink-0">TIP</span>
        <p className="text-xs text-muted-foreground leading-relaxed">{term.tip}</p>
      </div>
    </div>
  );
}

export default function GlossaryPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 space-y-14">
      {/* 헤더 */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <BookOpen className="size-5 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">용어집</h1>
        </div>
        <p className="text-base text-muted-foreground max-w-2xl">
          StockNews에서 사용하는 재무·투자 지표 해설. 모든 데이터는 정보 제공
          목적이며 투자 추천이 아닙니다.
        </p>
      </div>

      {/* 빠른 이동 */}
      <nav aria-label="카테고리 이동" className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <a
            key={cat.label}
            href={`#${cat.label}`}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-zinc-400 hover:text-foreground hover:bg-white/10 transition-colors"
          >
            {cat.label}
          </a>
        ))}
      </nav>

      {/* 카테고리별 섹션 */}
      {CATEGORIES.map((cat) => (
        <section key={cat.label} id={cat.label} className="scroll-mt-20 space-y-5">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold">{cat.label}</h2>
            <span className="text-sm text-zinc-600">{cat.terms.length}개 항목</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cat.terms.map((term) => (
              <TermCard key={term.name} term={term} />
            ))}
          </div>
        </section>
      ))}

      <p className="text-xs text-zinc-700 text-center pb-4">
        본 용어 해설은 일반적인 재무 개념을 설명하며, 특정 종목에 대한 투자
        판단 근거로 활용해서는 안 됩니다.
      </p>
    </div>
  );
}
