import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface DisclaimerProps {
  text?: string;
  className?: string;
  variant?: "footer" | "inline";
}

const DEFAULT_TEXT =
  "본 정보는 투자 추천이나 자문이 아니며, 정보 제공만을 목적으로 합니다. 투자 결정과 책임은 이용자 본인에게 있습니다.";

export function Disclaimer({
  text = DEFAULT_TEXT,
  className,
  variant = "inline",
}: DisclaimerProps) {
  return (
    <p
      className={cn(
        "flex items-start gap-1.5 text-xs text-muted-foreground",
        variant === "footer" && "justify-center text-center",
        className
      )}
    >
      <AlertCircle className="mt-0.5 size-3 shrink-0" aria-hidden />
      <span>{text}</span>
    </p>
  );
}
