import { cn, getSentimentLevel, getSentimentLabel, getSentimentSign } from "@/lib/utils";

interface SentimentBadgeProps {
  sentiment: number | null | undefined;
  className?: string;
}

export function SentimentBadge({ sentiment, className }: SentimentBadgeProps) {
  const level = getSentimentLevel(sentiment);
  const label = getSentimentLabel(sentiment);
  const sign = getSentimentSign(sentiment);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold",
        level === "positive" && "bg-emerald-500/10 text-emerald-400",
        level === "negative" && "bg-red-500/10 text-red-400",
        level === "neutral" && "bg-zinc-700/50 text-zinc-400",
        className
      )}
      aria-label={`감정: ${label}`}
    >
      <span aria-hidden>{sign}</span>
      <span>{label}</span>
      {sentiment != null && (
        <span className="font-mono text-[10px] opacity-60 tabular-nums">
          {sentiment >= 0 ? "+" : ""}
          {sentiment.toFixed(2)}
        </span>
      )}
    </span>
  );
}
