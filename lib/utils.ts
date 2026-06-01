import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─────────────────────────────────────────
// 숫자 포맷
// ─────────────────────────────────────────

/** 시가총액: $1.2T / $450.3B / $2.1M */
export function formatMarketCap(value: number | null | undefined): string {
  if (value == null) return "—";
  const abs = Math.abs(value);
  if (abs >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (abs >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
  if (abs >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  return `$${value.toLocaleString()}`;
}

/**
 * 이미 퍼센트인 값에 % 부호만 붙임 (36.93 → "36.9%")
 * 백엔드 DB 저장 형식: roe/roa/roic/operatingMargin/grossMargin/revenueGrowthYoy 모두
 * 퍼센트 형식(0~100 범위)으로 저장됨. 100 곱셈 금지.
 */
export function formatPct(
  value: number | null | undefined,
  decimals = 1
): string {
  if (value == null) return "—";
  return `${value.toFixed(decimals)}%`;
}

/**
 * 소수 비율 → 백분율 (0.307 → "30.7%")
 * fcfMargin, debtRatio 등 0~1 범위 저장 필드에 사용.
 */
export function formatPercent(
  value: number | null | undefined,
  decimals = 1
): string {
  if (value == null) return "—";
  return `${(value * 100).toFixed(decimals)}%`;
}

/** 배수/지표 수 포맷 (소수점 자릿수 지정) — PER, PBR, PSR, PEG 등 */
export function formatNumber(
  value: number | null | undefined,
  decimals = 2
): string {
  if (value == null) return "—";
  return value.toFixed(decimals);
}

/** 점수(0~100) → 소수점 1자리 */
export function formatScore(value: number | null | undefined): string {
  if (value == null) return "—";
  return value.toFixed(1);
}

// ─────────────────────────────────────────
// 날짜 포맷
// ─────────────────────────────────────────

/** "2026-05-29" 또는 ISO string → "2026년 5월 29일" */
export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  try {
    const d = parseISO(dateStr);
    return format(d, "yyyy년 M월 d일", { locale: ko });
  } catch {
    return dateStr;
  }
}

/** ISO datetime → "2026.05.29 14:30" */
export function formatDateTime(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  try {
    const d = parseISO(dateStr);
    return format(d, "yyyy.MM.dd HH:mm", { locale: ko });
  } catch {
    return dateStr;
  }
}

/** Instant/ISO string → "2026-05-29 06:00 기준" */
export function formatRankedAt(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  try {
    const d = parseISO(dateStr);
    return `${format(d, "yyyy-MM-dd HH:mm", { locale: ko })} 기준`;
  } catch {
    return dateStr;
  }
}

// ─────────────────────────────────────────
// 감정 점수
// ─────────────────────────────────────────

export type SentimentLevel = "positive" | "neutral" | "negative";

export function getSentimentLevel(score: number | null | undefined): SentimentLevel {
  if (score == null) return "neutral";
  if (score >= 0.3) return "positive";
  if (score <= -0.3) return "negative";
  return "neutral";
}

export function getSentimentLabel(score: number | null | undefined): string {
  const level = getSentimentLevel(score);
  if (level === "positive") return "긍정";
  if (level === "negative") return "부정";
  return "중립";
}

export function getSentimentSign(score: number | null | undefined): string {
  const level = getSentimentLevel(score);
  if (level === "positive") return "+";
  if (level === "negative") return "−";
  return "•";
}

// ─────────────────────────────────────────
// 중요도
// ─────────────────────────────────────────

export function getImportanceLabel(importance: number | null | undefined): string {
  if (importance == null) return "—";
  if (importance >= 80) return "매우 높음";
  if (importance >= 50) return "높음";
  if (importance >= 20) return "보통";
  return "낮음";
}

// ─────────────────────────────────────────
// 뉴스 볼륨 변화 색상
// ─────────────────────────────────────────

/** "+34%" → positive, "-12%" → negative */
export function parseVolumeChangeSign(change: string): "positive" | "negative" | "neutral" {
  if (change.startsWith("+")) return "positive";
  if (change.startsWith("-")) return "negative";
  return "neutral";
}
