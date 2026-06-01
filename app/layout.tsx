import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";
import { Disclaimer } from "@/components/common/Disclaimer";
import Link from "next/link";
import { TrendingUp } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StockNews — 미장 섹터·종목 분석",
  description:
    "미국 주식 섹터 및 종목 지표·뉴스 정보 서비스. 투자 추천이 아닌 정보 제공 목적.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <QueryProvider>
          {/* 글로벌 헤더 */}
          <header className="sticky top-0 z-40 border-b border-white/5 bg-black/80 backdrop-blur-md">
            <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
              <Link
                href="/"
                className="flex items-center gap-2 font-bold text-foreground hover:text-primary transition-colors"
              >
                <TrendingUp className="size-5 text-primary" aria-hidden />
                StockNews
              </Link>
              <span className="hidden text-xs text-zinc-600 sm:block">
                미장 섹터·종목 분석 정보
              </span>
              <div className="ml-auto">
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] text-zinc-500">
                  정보 제공 전용
                </span>
              </div>
            </div>
          </header>

          {/* 페이지 콘텐츠 */}
          <main className="flex-1">{children}</main>

          {/* 글로벌 푸터 */}
          <footer className="border-t border-white/5 bg-zinc-950 px-4 py-8">
            <div className="mx-auto max-w-6xl space-y-2">
              <Disclaimer variant="footer" />
              <p className="text-center text-[11px] text-zinc-700">
                © 2026 StockNews. 정보 제공 전용 서비스.
              </p>
            </div>
          </footer>
        </QueryProvider>
      </body>
    </html>
  );
}
