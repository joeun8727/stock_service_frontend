import { Globe, Users, Calendar, Building2, BarChart2 } from "lucide-react";
import { formatMarketCap, formatDate } from "@/lib/utils";
import type { StockProfile } from "@/lib/types";

interface StockProfileCardProps {
  profile: StockProfile;
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <Icon className="size-4 shrink-0 text-muted-foreground" aria-hidden />
      <span className="w-16 shrink-0 text-xs text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground/90">{value}</span>
    </div>
  );
}

export function StockProfileCard({ profile }: StockProfileCardProps) {
  const {
    ticker,
    companyName,
    sector,
    industry,
    marketCap,
    exchange,
    website,
    employeeCount,
    ipoDate,
  } = profile;

  return (
    <div className="rounded-2xl border border-white/5 bg-zinc-900 p-6">
      {/* 헤더 */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold font-mono tracking-tight text-foreground">
            {ticker}
          </h1>
          <p className="mt-1 text-base text-muted-foreground leading-snug">
            {companyName}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-xs text-muted-foreground mb-0.5">시가총액</p>
          <p className="text-2xl font-bold font-mono tabular-nums text-foreground">
            {formatMarketCap(marketCap)}
          </p>
        </div>
      </div>

      {/* 메타 정보 그리드 */}
      <div className="grid gap-2.5 sm:grid-cols-2">
        <InfoRow icon={BarChart2} label="섹터" value={sector} />
        <InfoRow icon={Building2} label="산업" value={industry} />
        <InfoRow icon={Building2} label="거래소" value={exchange} />
        {employeeCount != null && (
          <InfoRow
            icon={Users}
            label="임직원"
            value={`${employeeCount.toLocaleString()}명`}
          />
        )}
        {ipoDate && (
          <InfoRow icon={Calendar} label="IPO" value={formatDate(ipoDate)} />
        )}
        {website && (
          <InfoRow
            icon={Globe}
            label="웹사이트"
            value={
              <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline truncate"
              >
                {website.replace(/^https?:\/\//, "")}
              </a>
            }
          />
        )}
      </div>
    </div>
  );
}
